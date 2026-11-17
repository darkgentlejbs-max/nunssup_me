import { createClient, SupabaseClient, RealtimeChannel } from '@supabase/supabase-js';

// LocalStorage Keys for Cloud DB Config
const CLOUD_CONFIG_KEY = 'nunssup_cloud_db_config';
const LAST_KEEPALIVE_KEY = 'nunssup_last_keepalive_ts';
const KEEPALIVE_INTERVAL_MS = 1000 * 60 * 60 * 4; // Every 4 hours per device

export interface CloudDbConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  storeChannelId: string;
  autoSyncEnabled: boolean;
}

export const defaultCloudConfig: CloudDbConfig = {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL || 'https://vehvndduipgzjnksbdit.supabase.co',
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_hiEbLMumWBGvgaHS9FUtiA_Xjs1NiDe',
  storeChannelId: import.meta.env.VITE_STORE_CHANNEL_ID || 'nunssup_me_7721', // Unique store sync channel identifier
  autoSyncEnabled: true,
};

export const getSavedCloudConfig = (): CloudDbConfig => {
  if (typeof window === 'undefined') return defaultCloudConfig;
  const saved = localStorage.getItem(CLOUD_CONFIG_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      const rawUrl = (parsed.supabaseUrl || '').trim();
      const rawKey = (parsed.supabaseAnonKey || '').trim();
      const rawChannel = (parsed.storeChannelId || '').trim();

      // Auto-heal invalid or empty saved config to defaultCloudConfig
      const validUrl = rawUrl.startsWith('https://') && rawUrl.includes('.supabase.co')
        ? rawUrl
        : defaultCloudConfig.supabaseUrl;
      const validKey = rawKey.length >= 20
        ? rawKey
        : defaultCloudConfig.supabaseAnonKey;
      const validChannel = rawChannel || defaultCloudConfig.storeChannelId;

      return {
        supabaseUrl: validUrl,
        supabaseAnonKey: validKey,
        storeChannelId: validChannel,
        autoSyncEnabled: parsed.autoSyncEnabled ?? true,
      };
    } catch {
      return defaultCloudConfig;
    }
  }
  return defaultCloudConfig;
};

export const saveCloudConfig = (config: CloudDbConfig) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CLOUD_CONFIG_KEY, JSON.stringify(config));
  } catch (e) {
    console.warn('Failed to save cloud config to localStorage:', e);
  }
};

// Detect if a network error indicates Supabase Free Tier paused state (DNS NXDOMAIN -> Failed to fetch / Load failed)
export const isSupabasePausedOrUnreachableError = (errMsg: string): boolean => {
  const lower = (errMsg || '').toLowerCase();
  const isBrowserOnline = typeof navigator !== 'undefined' ? navigator.onLine !== false : true;
  if (lower.includes('paused') || lower.includes('enotfound') || lower.includes('name_not_resolved')) {
    return true;
  }
  if (isBrowserOnline && (lower.includes('failed to fetch') || lower.includes('load failed') || lower.includes('networkerror'))) {
    return true;
  }
  return false;
};

// Custom fetch wrapper that handles sb_publishable_ keys properly and disables stale browser caching
const createSupabaseFetch = (apiKey: string): typeof fetch => {
  const cleanKey = apiKey.trim();
  const isPublishableKey = cleanKey.startsWith('sb_publishable_') || cleanKey.startsWith('sb_secret_');

  return async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const headers = new Headers(init?.headers);
    headers.set('apikey', cleanKey);

    // New-format Supabase API keys (sb_publishable_...) are not JWTs and belong in the apikey header.
    // Remove malformed Bearer header first; if 401 is returned, fallback to Bearer.
    if (isPublishableKey) {
      headers.delete('Authorization');
    } else if (!headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${cleanKey}`);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    try {
      const response = await fetch(input, {
        ...init,
        headers,
        cache: 'no-store',
        signal: init?.signal || controller.signal,
      });

      if (response.status === 401 && isPublishableKey) {
        const retryHeaders = new Headers(init?.headers);
        retryHeaders.set('apikey', cleanKey);
        retryHeaders.set('Authorization', `Bearer ${cleanKey}`);
        return await fetch(input, {
          ...init,
          headers: retryHeaders,
          cache: 'no-store',
        });
      }

      return response;
    } finally {
      clearTimeout(timeoutId);
    }
  };
};

let supabaseInstance: SupabaseClient | null = null;
let currentClientUrl = '';
let currentClientKey = '';
let activeRealtimeChannel: RealtimeChannel | null = null;

export const getSupabaseClient = (): SupabaseClient | null => {
  const config = getSavedCloudConfig();
  const url = (config.supabaseUrl || '').trim();
  const key = (config.supabaseAnonKey || '').trim();

  if (!url || !key) {
    return null;
  }

  if (supabaseInstance && currentClientUrl === url && currentClientKey === key) {
    return supabaseInstance;
  }

  try {
    supabaseInstance = createClient(url, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
      global: {
        fetch: createSupabaseFetch(key),
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    });
    currentClientUrl = url;
    currentClientKey = key;
    return supabaseInstance;
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    return null;
  }
};

export const resetSupabaseClient = () => {
  if ( supabaseInstance && activeRealtimeChannel ) {
    try {
      supabaseInstance.removeChannel(activeRealtimeChannel);
    } catch {
      // ignore
    }
    activeRealtimeChannel = null;
  }
  supabaseInstance = null;
  currentClientUrl = '';
  currentClientKey = '';
};

export interface SyncPayload {
  shopConfig: any;
  services: any[];
  customers: any[];
  appointments: any[];
  timeBlocks: any[];
  updatedAt: string;
  deviceOrigin?: string;
}

// Direct REST helper fallback in case Supabase JS client encounters any issue
const directRestUpsert = async (
  url: string,
  key: string,
  channelId: string,
  payload: any
): Promise<{ ok: boolean; errorText?: string }> => {
  try {
    const endpoint = `${url.replace(/\/$/, '')}/rest/v1/nunssup_store_data?on_conflict=channel_id`;
    const customFetch = createSupabaseFetch(key);
    const res = await customFetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates,return=minimal',
      },
      body: JSON.stringify({
        channel_id: channelId,
        data: payload,
        updated_at: payload.updatedAt || new Date().toISOString(),
      }),
    });
    if (!res.ok) {
      const text = await res.text();
      return { ok: false, errorText: text || `HTTP ${res.status}` };
    }
    return { ok: true };
  } catch (e: any) {
    return { ok: false, errorText: e.message || String(e) };
  }
};

const directRestSelect = async (
  url: string,
  key: string,
  channelId: string
): Promise<{ data: SyncPayload | null; error?: string }> => {
  try {
    const endpoint = `${url.replace(/\/$/, '')}/rest/v1/nunssup_store_data?channel_id=eq.${encodeURIComponent(channelId)}&select=data,updated_at`;
    const customFetch = createSupabaseFetch(key);
    const res = await customFetch(endpoint, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });
    if (!res.ok) {
      const text = await res.text();
      return { data: null, error: text || `HTTP ${res.status}` };
    }
    const rows = await res.json();
    if (Array.isArray(rows) && rows.length > 0 && rows[0]?.data) {
      const payload = rows[0].data as SyncPayload;
      if (rows[0].updated_at && (!payload.updatedAt || rows[0].updated_at > payload.updatedAt)) {
        payload.updatedAt = rows[0].updated_at;
      }
      return { data: payload };
    }
    return { data: null };
  } catch (e: any) {
    return { data: null, error: e.message || 'Supabase 연결 실패' };
  }
};

// Automatic Keep-Alive Heartbeat: writes a lightweight ping row to prevent Supabase Free Tier 7-day pause
export const sendKeepAliveHeartbeat = async (force = false): Promise<boolean> => {
  if (typeof window !== 'undefined' && !force) {
    const lastPing = Number(localStorage.getItem(LAST_KEEPALIVE_KEY) || '0');
    if (Date.now() - lastPing < KEEPALIVE_INTERVAL_MS) {
      return true;
    }
  }

  const config = getSavedCloudConfig();
  const url = (config.supabaseUrl || '').trim();
  const key = (config.supabaseAnonKey || '').trim();
  if (!url || !key) return false;

  const nowIso = new Date().toISOString();
  const res = await directRestUpsert(url, key, 'nunssup_keepalive_ping', {
    ping: true,
    updatedAt: nowIso,
    source: typeof window !== 'undefined' ? 'browser-client' : 'server',
  });

  if (res.ok && typeof window !== 'undefined') {
    try {
      localStorage.setItem(LAST_KEEPALIVE_KEY, String(Date.now()));
    } catch {
      // ignore
    }
  }
  return res.ok;
};

// Subscribe to Supabase Realtime WebSocket changes for instant (<0.1s) cross-device sync
export const subscribeToRealtimeSync = (onRemoteChange: () => void): (() => void) => {
  const supabase = getSupabaseClient();
  const config = getSavedCloudConfig();
  const cleanChannel = (config.storeChannelId || 'nunssup_me_7721').trim();

  if (!supabase) return () => {};

  if (activeRealtimeChannel) {
    try {
      supabase.removeChannel(activeRealtimeChannel);
    } catch {
      // ignore
    }
    activeRealtimeChannel = null;
  }

  try {
    const channel = supabase
      .channel(`realtime_store_${cleanChannel}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'nunssup_store_data',
          filter: `channel_id=eq.${cleanChannel}`,
        },
        () => {
          onRemoteChange();
        }
      )
      .subscribe();

    activeRealtimeChannel = channel;

    return () => {
      try {
        supabase.removeChannel(channel);
      } catch {
        // ignore
      }
      if (activeRealtimeChannel === channel) {
        activeRealtimeChannel = null;
      }
    };
  } catch (e) {
    console.warn('Realtime subscription setup warning:', e);
    return () => {};
  }
};

// Push local data to Supabase Cloud DB
export const pushDataToCloud = async (
  payload: SyncPayload,
  channelId: string
): Promise<{ success: boolean; message: string }> => {
  const config = getSavedCloudConfig();
  const url = (config.supabaseUrl || '').trim();
  const key = (config.supabaseAnonKey || '').trim();
  const cleanChannel = (channelId || config.storeChannelId || 'nunssup_me_7721').trim();

  const supabase = getSupabaseClient();
  if (!supabase || !url || !key) {
    return { success: false, message: 'Supabase URL과 Anon Key가 설정되지 않았습니다.' };
  }

  try {
    const nowIso = payload.updatedAt || new Date().toISOString();
    const { error } = await supabase.from('nunssup_store_data').upsert(
      {
        channel_id: cleanChannel,
        data: { ...payload, updatedAt: nowIso },
        updated_at: nowIso,
      },
      { onConflict: 'channel_id' }
    );

    if (error) {
      // Try direct REST fallback before reporting error
      const fallback = await directRestUpsert(url, key, cleanChannel, { ...payload, updatedAt: nowIso });
      if (fallback.ok) {
        return { success: true, message: 'Supabase DB에 정상 저장되었습니다.' };
      }

      const errMsg = error.message || fallback.errorText || '';
      if (isSupabasePausedOrUnreachableError(errMsg)) {
        return {
          success: false,
          message: '⚠️ Supabase 무료 DB 프로젝트가 7일간 미사용으로 [일시 정지(Paused)] 상태입니다. Supabase 대시보드(https://supabase.com/dashboard/project/vehvndduipgzjnksbdit)에서 [Restore project] 버튼을 눌러 깨워주시면 즉시 연동됩니다!',
        };
      }
      if (errMsg.includes('relation "nunssup_store_data" does not exist')) {
        return {
          success: false,
          message: 'Supabase에 nunssup_store_data 테이블이 없습니다. [1-클릭 SQL 복사]를 실행해 주세요.',
        };
      }
      return { success: false, message: `Supabase 저장 실패: ${errMsg}` };
    }

    return { success: true, message: 'Supabase DB에 정상 저장되었습니다.' };
  } catch (e: any) {
    const fallback = await directRestUpsert(url, key, cleanChannel, payload);
    if (fallback.ok) {
      return { success: true, message: 'Supabase DB에 정상 저장되었습니다.' };
    }
    const errMsg = e.message || fallback.errorText || String(e);
    if (isSupabasePausedOrUnreachableError(errMsg)) {
      return {
        success: false,
        message: '⚠️ Supabase 무료 DB 프로젝트가 [일시 정지(Paused)] 상태입니다. Supabase 대시보드(https://supabase.com/dashboard/project/vehvndduipgzjnksbdit)에서 [Restore project]를 눌러 활성화해 주세요!',
      };
    }
    return { success: false, message: `Supabase 연결 예외: ${errMsg}` };
  }
};

// Pull latest data from Supabase Cloud DB
export const pullDataFromCloud = async (
  channelId: string
): Promise<{ data: SyncPayload | null; error?: string; isPaused?: boolean }> => {
  const config = getSavedCloudConfig();
  const url = (config.supabaseUrl || '').trim();
  const key = (config.supabaseAnonKey || '').trim();
  const cleanChannel = (channelId || config.storeChannelId || 'nunssup_me_7721').trim();

  const supabase = getSupabaseClient();
  if (!supabase || !url || !key) {
    return { data: null, error: 'Supabase URL/Key 미설정' };
  }

  try {
    const { data, error } = await supabase
      .from('nunssup_store_data')
      .select('data, updated_at')
      .eq('channel_id', cleanChannel)
      .maybeSingle();

    if (!error && data && data.data) {
      const payload = data.data as SyncPayload;
      if (data.updated_at && (!payload.updatedAt || data.updated_at > payload.updatedAt)) {
        payload.updatedAt = data.updated_at;
      }
      // Trigger non-blocking keep-alive heartbeat when pull succeeds
      sendKeepAliveHeartbeat().catch(() => {});
      return { data: payload };
    }

    if (error && error.code !== 'PGRST116') {
      const fallback = await directRestSelect(url, key, cleanChannel);
      if (fallback.error && isSupabasePausedOrUnreachableError(fallback.error)) {
        return { ...fallback, isPaused: true };
      }
      return fallback;
    }
  } catch {
    const fallback = await directRestSelect(url, key, cleanChannel);
    if (fallback.error && isSupabasePausedOrUnreachableError(fallback.error)) {
      return { ...fallback, isPaused: true };
    }
    return fallback;
  }

  return { data: null };
};

// Test connection function directly against Supabase
export const testCloudConnection = async (
  testUrl?: string,
  testKey?: string,
  testChannel?: string
): Promise<{ success: boolean; message: string }> => {
  const config = getSavedCloudConfig();
  const url = (testUrl ?? config.supabaseUrl ?? '').trim();
  const key = (testKey ?? config.supabaseAnonKey ?? '').trim();
  const channel = (testChannel ?? config.storeChannelId ?? 'nunssup_me_7721').trim();

  if (!url) {
    return { success: false, message: 'Supabase Project URL을 입력해 주세요. (예: https://xyzproject.supabase.co)' };
  }
  if (!key) {
    return { success: false, message: 'Supabase anon public API Key를 입력해 주세요.' };
  }

  let client: SupabaseClient;
  try {
    client = createClient(url, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
      global: {
        fetch: createSupabaseFetch(key),
      },
    });
  } catch (err: any) {
    return { success: false, message: `잘못된 URL 형식입니다: ${err.message}` };
  }

  try {
    const { error } = await client
      .from('nunssup_store_data')
      .select('channel_id')
      .limit(1);

    if (error) {
      // Try direct REST select as verification
      const directRes = await directRestSelect(url, key, channel);
      if (!directRes.error) {
        await sendKeepAliveHeartbeat(true).catch(() => {});
        return {
          success: true,
          message: `Supabase 데이터베이스 연결 성공! 🎉 채널 [${channel}]을 통해 PC ↔ 스마트폰 실시간 연동 및 자동 깨우기(Keep-Alive)가 활성화되었습니다.`,
        };
      }

      const errMsg = error.message || directRes.error || '';
      if (isSupabasePausedOrUnreachableError(errMsg)) {
        return {
          success: false,
          message: '⚠️ 현재 Supabase 무료 프로젝트가 7일간 미접속으로 인해 [일시 정지(Paused)] 상태입니다! 아래 [⚡ Supabase 1-클릭 복원하러 가기] 버튼을 눌러 대시보드에서 [Restore project]를 클릭하시면 1~2분 내로 즉시 복원됩니다.',
        };
      }
      if (errMsg.includes('relation "nunssup_store_data" does not exist') || error.code === '42P01') {
        return {
          success: false,
          message: 'Supabase 프로젝트는 연결되었으나 nunssup_store_data 테이블이 없습니다. 아래 [1-클릭 SQL 복사] 버튼을 눌러 Supabase SQL Editor에서 실행(Run)해 주세요!',
        };
      }
      return { success: false, message: `Supabase 오류: ${errMsg}` };
    }

    await sendKeepAliveHeartbeat(true).catch(() => {});
    return {
      success: true,
      message: `Supabase 데이터베이스 연결 성공! 🎉 채널 [${channel}]을 통해 PC ↔ 스마트폰 실시간 연동 및 자동 깨우기(Keep-Alive)가 활성화되었습니다.`,
    };
  } catch (e: any) {
    const msg = e.message || String(e);
    if (isSupabasePausedOrUnreachableError(msg)) {
      return {
        success: false,
        message: '⚠️ 현재 Supabase 무료 프로젝트가 7일간 미접속으로 인해 [일시 정지(Paused)] 상태입니다! 아래 [⚡ Supabase 1-클릭 복원하러 가기] 버튼을 눌러 대시보드에서 [Restore project]를 클릭해 주세요.',
      };
    }
    return { success: false, message: `연결 실패: ${msg}` };
  }
};

// Compress image file via canvas so mobile photos upload fast and never overflow storage
export const compressImageFile = (file: File, maxDimension = 1280, quality = 0.82): Promise<{ blob: Blob; dataUrl: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (!dataUrl) {
        reject(new Error('Failed to read image'));
        return;
      }
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context unavailable'));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve({ blob, dataUrl: compressedDataUrl });
            } else {
              reject(new Error('Canvas toBlob failed'));
            }
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = () => reject(new Error('Image load error'));
      img.src = dataUrl;
    };
    reader.onerror = () => reject(new Error('FileReader error'));
    reader.readAsDataURL(file);
  });
};

// Image Upload to Supabase Storage
export const uploadImageToCloud = async (file: File): Promise<{ url: string | null; fallbackDataUrl?: string; error?: string }> => {
  const supabase = getSupabaseClient();
  let uploadTarget: File | Blob = file;
  let fallbackDataUrl: string | undefined;

  // Compress large photos for faster mobile upload & compact fallback
  try {
    const compressed = await compressImageFile(file, 1280, 0.82);
    uploadTarget = compressed.blob;
    fallbackDataUrl = compressed.dataUrl;
  } catch {
    // Keep original file if compression fails
  }

  if (!supabase) return { url: null, fallbackDataUrl, error: '클라우드 DB가 연결되지 않았습니다.' };

  const config = getSavedCloudConfig();
  const cleanChannel = (config.storeChannelId || 'nunssup_me_7721').trim();

  try {
    const rawExt = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '');
    const fileExt = uploadTarget instanceof Blob && !(uploadTarget instanceof File) ? 'jpeg' : (rawExt || 'jpeg');
    const fileName = `${cleanChannel}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('nunssup_photos')
      .upload(fileName, uploadTarget, {
        cacheControl: '3600',
        upsert: false,
        contentType: fileExt === 'jpeg' || fileExt === 'jpg' ? 'image/jpeg' : file.type || 'image/jpeg',
      });

    if (uploadError) {
      if (uploadError.message.includes('bucket not found') || uploadError.message.includes('Bucket not found')) {
        return { url: null, fallbackDataUrl, error: 'nunssup_photos 스토리지 버킷이 없습니다. 매장 설정에서 SQL을 다시 복사해 실행해주세요!' };
      }
      return { url: null, fallbackDataUrl, error: uploadError.message };
    }

    const { data } = supabase.storage.from('nunssup_photos').getPublicUrl(fileName);
    return { url: data.publicUrl, fallbackDataUrl };
  } catch (err: any) {
    return { url: null, fallbackDataUrl, error: err.message || '업로드 실패' };
  }
};
