import { createClient, SupabaseClient } from '@supabase/supabase-js';

// LocalStorage Keys for Cloud DB Config
const CLOUD_CONFIG_KEY = 'nunssup_cloud_db_config';

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
      return {
        supabaseUrl: parsed.supabaseUrl || defaultCloudConfig.supabaseUrl,
        supabaseAnonKey: parsed.supabaseAnonKey || defaultCloudConfig.supabaseAnonKey,
        storeChannelId: parsed.storeChannelId || defaultCloudConfig.storeChannelId,
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
  localStorage.setItem(CLOUD_CONFIG_KEY, JSON.stringify(config));
};

let supabaseInstance: SupabaseClient | null = null;
let currentClientUrl = '';
let currentClientKey = '';

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
    supabaseInstance = createClient(url, key);
    currentClientUrl = url;
    currentClientKey = key;
    return supabaseInstance;
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    return null;
  }
};

export const resetSupabaseClient = () => {
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

// Push local data to Supabase Cloud DB
export const pushDataToCloud = async (
  payload: SyncPayload,
  channelId: string
): Promise<{ success: boolean; message: string }> => {
  const config = getSavedCloudConfig();
  const cleanChannel = (channelId || config.storeChannelId || 'nunssup_me_7721').trim();

  const supabase = getSupabaseClient();
  if (!supabase) {
    return { success: false, message: 'Supabase URL과 Anon Key가 설정되지 않았습니다.' };
  }

  try {
    const { error } = await supabase.from('nunssup_store_data').upsert(
      {
        channel_id: cleanChannel,
        data: payload,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'channel_id' }
    );

    if (error) {
      if (error.message.includes('relation "nunssup_store_data" does not exist')) {
        return {
          success: false,
          message: 'Supabase에 nunssup_store_data 테이블이 없습니다. [1-클릭 SQL 복사]를 실행해 주세요.',
        };
      }
      return { success: false, message: `Supabase 저장 실패: ${error.message}` };
    }

    return { success: true, message: 'Supabase DB에 정상 저장되었습니다.' };
  } catch (e: any) {
    return { success: false, message: `Supabase 연결 예외: ${e.message || e}` };
  }
};

// Pull latest data from Supabase Cloud DB
export const pullDataFromCloud = async (
  channelId: string
): Promise<{ data: SyncPayload | null; error?: string }> => {
  const config = getSavedCloudConfig();
  const cleanChannel = (channelId || config.storeChannelId || 'nunssup_me_7721').trim();

  const supabase = getSupabaseClient();
  if (!supabase) {
    return { data: null, error: 'Supabase URL/Key 미설정' };
  }

  try {
    const { data, error } = await supabase
      .from('nunssup_store_data')
      .select('data, updated_at')
      .eq('channel_id', cleanChannel)
      .single();

    if (!error && data && data.data) {
      return { data: data.data as SyncPayload };
    }

    // PGRST116 indicates row not found yet (first sync before any push)
    if (error && error.code !== 'PGRST116') {
      return { data: null, error: error.message };
    }
  } catch (e: any) {
    return { data: null, error: e.message || 'Supabase 연결 실패' };
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
    client = createClient(url, key);
  } catch (err: any) {
    return { success: false, message: `잘못된 URL 형식입니다: ${err.message}` };
  }

  try {
    const { data, error } = await client
      .from('nunssup_store_data')
      .select('channel_id')
      .limit(1);

    if (error) {
      if (error.message.includes('relation "nunssup_store_data" does not exist') || error.code === '42P01') {
        return {
          success: false,
          message: 'Supabase 프로젝트는 연결되었으나 nunssup_store_data 테이블이 없습니다. 아래 [1-클릭 SQL 복사] 버튼을 눌러 Supabase SQL Editor에서 실행(Run)해 주세요!',
        };
      }
      return { success: false, message: `Supabase 오류: ${error.message}` };
    }

    return {
      success: true,
      message: `Supabase 데이터베이스 연결 성공! 🎉 채널 [${channel}]을 통해 PC ↔ 스마트폰 실시간 연동이 활성화되었습니다.`,
    };
  } catch (e: any) {
    return { success: false, message: `연결 실패: ${e.message || e}` };
  }
};

// Image Upload to Supabase Storage
export const uploadImageToCloud = async (file: File): Promise<{ url: string | null; error?: string }> => {
  const supabase = getSupabaseClient();
  if (!supabase) return { url: null, error: '클라우드 DB가 연결되지 않았습니다.' };
  
  const config = getSavedCloudConfig();
  const cleanChannel = (config.storeChannelId || 'nunssup_me_7721').trim();
  
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${cleanChannel}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('nunssup_photos')
      .upload(fileName, file, { cacheControl: '3600', upsert: false });
      
    if (uploadError) {
      if (uploadError.message.includes('bucket not found') || uploadError.message.includes('Bucket not found')) {
        return { url: null, error: 'nunssup_photos 스토리지 버킷이 없습니다. 매장 설정에서 SQL을 다시 복사해 실행해주세요!' };
      }
      return { url: null, error: uploadError.message };
    }
    
    const { data } = supabase.storage.from('nunssup_photos').getPublicUrl(fileName);
    return { url: data.publicUrl };
  } catch (err: any) {
    return { url: null, error: err.message || '업로드 실패' };
  }
};
