import { create } from 'zustand';
import {
  ShopConfig,
  ServiceItem,
  Customer,
  Appointment,
  TimeBlock,
  ViewMode,
  ActiveTab,
  AppointmentStatus,
  TreatmentHistoryItem,
} from '../types';
import {
  initialShopConfig,
  initialServices,
  initialCustomers,
  initialAppointments,
  initialTimeBlocks,
  sampleCustomers,
  sampleAppointments,
  sampleTimeBlocks,
} from '../data/initialData';
import {
  CloudDbConfig,
  getSavedCloudConfig,
  saveCloudConfig,
  pushDataToCloud,
  pullDataFromCloud,
  SyncPayload,
  resetSupabaseClient,
} from '../services/cloudSync';

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

export interface AppStore {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  
  shopConfig: ShopConfig;
  updateShopConfig: (config: Partial<ShopConfig>) => void;
  
  services: ServiceItem[];
  addService: (service: Omit<ServiceItem, 'id'>) => void;
  updateService: (id: string, service: Partial<ServiceItem>) => void;
  deleteService: (id: string) => void;
  
  customers: Customer[];
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt' | 'totalVisits' | 'totalSpent' | 'history'>) => Customer;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  addTreatmentHistory: (customerId: string, record: Omit<TreatmentHistoryItem, 'id'>) => void;
  
  appointments: Appointment[];
  createAppointment: (data: {
    customerName: string;
    customerPhone: string;
    serviceId: string;
    date: string;
    time: string;
    notes?: string;
    isFirstVisit: boolean;
  }) => { success: boolean; appointment?: Appointment; message?: string };
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;
  deleteAppointment: (id: string) => void;
  
  timeBlocks: TimeBlock[];
  addTimeBlock: (block: Omit<TimeBlock, 'id'>) => void;
  deleteTimeBlock: (id: string) => void;
  
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  
  isAdminAuthenticated: boolean;
  loginAdmin: (pin: string) => boolean;
  logoutAdmin: () => void;
  changeAdminPin: (oldPin: string, newPin: string) => boolean;
  
  smsModalState: { isOpen: boolean; appointment: Appointment | null };
  openSmsModal: (appointment: Appointment) => void;
  closeSmsModal: () => void;
  markSmsSent: (appointmentId: string) => void;
  
  cloudConfig: CloudDbConfig;
  updateCloudConfig: (config: CloudDbConfig) => void;
  cloudSyncStatus: 'synced' | 'syncing' | 'offline' | 'idle';
  lastSyncedAt: string | null;
  syncWithCloud: (isSilent?: boolean) => Promise<void>;

  toasts: ToastMessage[];
  showToast: (title: string, message: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;
  
  resetData: () => void;
  loadSampleData: () => void;
  clearAllSampleData: () => void;
  exportDataJson: () => string;
  importDataJson: (json: string) => boolean;
}

const STORAGE_KEYS = {
  CONFIG: 'nunssup_me_config_v1',
  SERVICES: 'nunssup_me_services_v1',
  CUSTOMERS: 'nunssup_me_customers_v1',
  APPOINTMENTS: 'nunssup_me_appointments_v1',
  TIMEBLOCKS: 'nunssup_me_timeblocks_v1',
};

// Singleton refs for syncing logic
let isRemoteUpdating = false;
let localChangeCounter = 0;
let lastCloudUpdatedTimestamp = '';
let hasHydratedFromCloud = false;
let syncTimer: ReturnType<typeof setTimeout> | null = null;

export const useAppStore = create<AppStore>((set, get) => {
  // Initialize LocalStorage Data
  const getInitialShopConfig = (): ShopConfig => {
    if (typeof window === 'undefined') return initialShopConfig;
    const saved = localStorage.getItem(STORAGE_KEYS.CONFIG);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!parsed.address || parsed.address.includes('도산대로') || parsed.address.includes('강남구')) {
          parsed.address = initialShopConfig.address;
        }
        return parsed;
      } catch {
        return initialShopConfig;
      }
    }
    return initialShopConfig;
  };

  const getInitialServices = (): ServiceItem[] => {
    if (typeof window === 'undefined') return initialServices;
    const saved = localStorage.getItem(STORAGE_KEYS.SERVICES);
    return saved ? JSON.parse(saved) : initialServices;
  };

  const getInitialCustomers = (): Customer[] => {
    if (typeof window === 'undefined') return initialCustomers;
    const saved = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
    return saved ? JSON.parse(saved) : initialCustomers;
  };

  const getInitialAppointments = (): Appointment[] => {
    if (typeof window === 'undefined') return initialAppointments;
    const saved = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
    return saved ? JSON.parse(saved) : initialAppointments;
  };

  const getInitialTimeBlocks = (): TimeBlock[] => {
    if (typeof window === 'undefined') return initialTimeBlocks;
    const saved = localStorage.getItem(STORAGE_KEYS.TIMEBLOCKS);
    return saved ? JSON.parse(saved) : initialTimeBlocks;
  };

  return {
    viewMode: 'customer',
    setViewMode: (mode) => set({ viewMode: mode }),
    activeTab: 'calendar',
    setActiveTab: (tab) => set({ activeTab: tab }),

    shopConfig: getInitialShopConfig(),
    updateShopConfig: (updates) => {
      set((state) => ({ shopConfig: { ...state.shopConfig, ...updates } }));
      get().showToast('설정 저장', '매장 정보 및 영업 설정이 변경되었습니다.', 'success');
    },

    services: getInitialServices(),
    addService: (serviceData) => {
      const newService: ServiceItem = { ...serviceData, id: `srv-${Date.now()}` };
      set((state) => ({ services: [...state.services, newService] }));
      get().showToast('시술 추가', `'${newService.name}' 항목이 등록되었습니다.`, 'success');
    },
    updateService: (id, updates) => {
      set((state) => ({ services: state.services.map((s) => (s.id === id ? { ...s, ...updates } : s)) }));
      get().showToast('시술 수정', '시술 항목 정보가 수정되었습니다.', 'success');
    },
    deleteService: (id) => {
      set((state) => ({ services: state.services.filter((s) => s.id !== id) }));
      get().showToast('시술 삭제', '시술 항목이 삭제되었습니다.', 'info');
    },

    customers: getInitialCustomers(),
    addCustomer: (customerData) => {
      const newCustomer: Customer = {
        ...customerData,
        id: `cust-${Date.now()}`,
        grade: customerData.grade || '신규',
        totalVisits: 0,
        totalSpent: 0,
        history: [],
        createdAt: new Date().toISOString().split('T')[0],
      };
      set((state) => ({ customers: [newCustomer, ...state.customers] }));
      get().showToast('회원 등록', `${newCustomer.name} 고객님이 등록되었습니다.`, 'success');
      return newCustomer;
    },
    updateCustomer: (id, updates) => {
      set((state) => ({ customers: state.customers.map((c) => (c.id === id ? { ...c, ...updates } : c)) }));
      get().showToast('회원 수정', '고객 차트 정보가 업데이트되었습니다.', 'success');
    },
    deleteCustomer: (id) => {
      set((state) => ({ customers: state.customers.filter((c) => c.id !== id) }));
      get().showToast('회원 삭제', '회원 정보가 삭제되었습니다.', 'info');
    },
    addTreatmentHistory: (customerId, record) => {
      const newRecord: TreatmentHistoryItem = { ...record, id: `hist-${Date.now()}` };
      set((state) => ({
        customers: state.customers.map((c) => {
          if (c.id === customerId) {
            return {
              ...c,
              totalVisits: c.totalVisits + 1,
              totalSpent: c.totalSpent + (record.price || 0),
              lastVisitDate: record.date,
              history: [newRecord, ...c.history],
            };
          }
          return c;
        }),
      }));
      get().showToast('시술 기록 등록', '디지털 고객 차트에 시술 이력이 저장되었습니다.', 'success');
    },

    appointments: getInitialAppointments(),
    createAppointment: (data) => {
      const state = get();
      const service = state.services.find((s) => s.id === data.serviceId);
      if (!service) {
        state.showToast('예약 실패', '선택하신 시술 항목을 찾을 수 없습니다.', 'error');
        return { success: false, message: '시술 항목 오류' };
      }

      const cleanPhone = data.customerPhone.trim();
      let existingCustomer = state.customers.find(
        (c) => c.phone.replace(/[^0-9]/g, '') === cleanPhone.replace(/[^0-9]/g, '')
      );

      if (!existingCustomer) {
        const newCust: Customer = {
          id: `cust-${Date.now()}`,
          name: data.customerName.trim(),
          phone: cleanPhone,
          grade: '신규',
          totalVisits: 0,
          totalSpent: 0,
          history: [],
          createdAt: (() => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; })(),
        };
        set((s) => ({ customers: [newCust, ...s.customers] }));
        existingCustomer = newCust;
      }

      const newAppointment: Appointment = {
        id: `apt-${Date.now()}`,
        customerName: data.customerName.trim(),
        customerPhone: cleanPhone,
        serviceId: service.id,
        serviceName: service.name,
        price: service.price,
        durationMinutes: service.durationMinutes,
        date: data.date,
        time: data.time,
        status: 'pending',
        notes: data.notes || '',
        isFirstVisit: data.isFirstVisit,
        createdAt: (() => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; })(),
        paymentMethod: 'unpaid',
      };

      set((s) => ({ appointments: [newAppointment, ...s.appointments] }));
      get().showToast(
        '예약 신청 완료',
        `${data.customerName}님의 [${service.name}] 예약이 접수되었습니다. (100% 예약제 확인 후 안내)`,
        'success'
      );

      return { success: true, appointment: newAppointment };
    },
    updateAppointmentStatus: (id, newStatus) => {
      const state = get();
      const targetApt = state.appointments.find((a) => a.id === id);
      if (!targetApt) return;

      set((s) => ({
        appointments: s.appointments.map((a) =>
          a.id === id ? { ...a, status: newStatus, updatedAt: new Date().toISOString() } : a
        ),
      }));

      if (newStatus === 'completed' && targetApt.status !== 'completed') {
        const currentCustomers = get().customers;
        const customer = currentCustomers.find(
          (c) => c.phone.replace(/[^0-9]/g, '') === targetApt.customerPhone.replace(/[^0-9]/g, '')
        );
        if (customer) {
          const alreadyHasHist = customer.history.some(
            (h) => h.date === targetApt.date && h.serviceName === targetApt.serviceName
          );
          if (!alreadyHasHist) {
            get().addTreatmentHistory(customer.id, {
              date: targetApt.date,
              serviceName: targetApt.serviceName,
              price: targetApt.price,
              notes: targetApt.notes || '예약 시술 정상 완료',
            });
          }
        }
      }

      if (newStatus === 'confirmed') {
        const updatedApt: Appointment = {
          ...targetApt,
          status: 'confirmed',
          smsSent: true,
          smsSentAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set({ smsModalState: { isOpen: true, appointment: updatedApt } });
      }

      const statusLabels: Record<AppointmentStatus, string> = {
        pending: '예약 대기',
        confirmed: '예약 확정',
        completed: '시술 완료',
        cancelled: '예약 취소',
        noshow: '노쇼 처리',
      };
      get().showToast('상태 변경', `${targetApt.customerName}님의 예약이 [${statusLabels[newStatus]}] 상태로 변경되었습니다.`, 'info');
    },
    updateAppointment: (id, updates) => {
      set((state) => ({ appointments: state.appointments.map((a) => (a.id === id ? { ...a, ...updates } : a)) }));
      get().showToast('예약 변경', '예약 일정이 성공적으로 수정되었습니다.', 'success');
    },
    deleteAppointment: (id) => {
      set((state) => ({ appointments: state.appointments.filter((a) => a.id !== id) }));
      get().showToast('예약 삭제', '예약 내역이 삭제되었습니다.', 'info');
    },

    timeBlocks: getInitialTimeBlocks(),
    addTimeBlock: (blockData) => {
      const newBlock: TimeBlock = { ...blockData, id: `tb-${Date.now()}` };
      set((state) => ({ timeBlocks: [...state.timeBlocks, newBlock] }));
      get().showToast('일정 차단', `${newBlock.date} ${newBlock.startTime}~${newBlock.endTime} 예약 불가 시간이 설정되었습니다.`, 'success');
    },
    deleteTimeBlock: (id) => {
      set((state) => ({ timeBlocks: state.timeBlocks.filter((tb) => tb.id !== id) }));
      get().showToast('차단 해제', '예약 차단 시간이 해제되었습니다.', 'info');
    },

    selectedDate: new Date().toISOString().split('T')[0],
    setSelectedDate: (date) => set({ selectedDate: date }),

    isAdminAuthenticated: typeof window !== 'undefined' ? sessionStorage.getItem('nunssup_admin_auth') === 'true' : false,
    loginAdmin: (pin) => {
      const currentPin = get().shopConfig.adminPin || '7721';
      if (pin.trim() === currentPin.trim()) {
        set({ isAdminAuthenticated: true, viewMode: 'admin' });
        if (typeof window !== 'undefined') sessionStorage.setItem('nunssup_admin_auth', 'true');
        get().showToast('원장님 인증 완료', '관리자 모드로 접속하였습니다.', 'success');
        return true;
      } else {
        get().showToast('인증 실패', '비밀번호(PIN)가 일치하지 않습니다. 다시 확인해 주세요.', 'error');
        return false;
      }
    },
    logoutAdmin: () => {
      set({ isAdminAuthenticated: false, viewMode: 'customer' });
      if (typeof window !== 'undefined') sessionStorage.removeItem('nunssup_admin_auth');
      get().showToast('로그아웃', '관리자 모드에서 안전하게 로그아웃되었습니다.', 'info');
    },
    changeAdminPin: (oldPin, newPin) => {
      const currentPin = get().shopConfig.adminPin || '7721';
      if (oldPin.trim() !== currentPin.trim()) {
        get().showToast('변경 실패', '현재 사용 중인 기존 비밀번호가 일치하지 않습니다.', 'error');
        return false;
      }
      if (newPin.trim().length < 4) {
        get().showToast('변경 실패', '새 비밀번호는 최소 4자리 이상이어야 합니다.', 'warning');
        return false;
      }
      set((state) => ({ shopConfig: { ...state.shopConfig, adminPin: newPin.trim() } }));
      get().showToast('비밀번호 변경 완료', '원장님 관리자 비밀번호(PIN)가 성공적으로 변경되었습니다.', 'success');
      return true;
    },

    smsModalState: { isOpen: false, appointment: null },
    openSmsModal: (appointment) => set({ smsModalState: { isOpen: true, appointment } }),
    closeSmsModal: () => set({ smsModalState: { isOpen: false, appointment: null } }),
    markSmsSent: (appointmentId) => {
      set((state) => ({
        appointments: state.appointments.map((a) =>
          a.id === appointmentId ? { ...a, smsSent: true, smsSentAt: new Date().toISOString() } : a
        ),
      }));
    },

    cloudConfig: getSavedCloudConfig(),
    updateCloudConfig: (config) => {
      set({ cloudConfig: config });
      saveCloudConfig(config);
      resetSupabaseClient();
      hasHydratedFromCloud = false;
      get().showToast('Supabase DB 설정 저장', 'Supabase 데이터베이스 설정이 저장되었습니다.', 'success');
    },
    cloudSyncStatus: 'idle',
    lastSyncedAt: null,
    syncWithCloud: async (isSilent = false) => {
      const { cloudConfig } = get();
      if (!cloudConfig.supabaseUrl || !cloudConfig.supabaseAnonKey) {
        set({ cloudSyncStatus: 'idle' });
        hasHydratedFromCloud = true;
        return;
      }
      try {
        if (!isSilent) set({ cloudSyncStatus: 'syncing' });
        const res = await pullDataFromCloud(cloudConfig.storeChannelId);
        const cloudData = res.data;
        hasHydratedFromCloud = true;

        if (cloudData && cloudData.updatedAt && cloudData.updatedAt !== lastCloudUpdatedTimestamp) {
          lastCloudUpdatedTimestamp = cloudData.updatedAt;
          isRemoteUpdating = true;

          const updates: Partial<AppStore> = {};
          if (cloudData.shopConfig) {
            // Preserve local adminPin - never overwrite it from cloud data
            updates.shopConfig = { ...cloudData.shopConfig, adminPin: get().shopConfig.adminPin };
          }
          if (cloudData.services && cloudData.services.length) updates.services = cloudData.services;
          if (cloudData.customers) updates.customers = cloudData.customers.map((c: any) => ({ ...c, history: c.history ?? [] }));
          if (cloudData.appointments) updates.appointments = cloudData.appointments;
          if (cloudData.timeBlocks) updates.timeBlocks = cloudData.timeBlocks;

          updates.lastSyncedAt = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
          updates.cloudSyncStatus = 'synced';
          set(updates);

          if (!isSilent) {
            get().showToast('Supabase 동기화 완료', '최신 예약 및 고객 데이터가 Supabase DB와 동기화되었습니다.', 'info');
          }
          setTimeout(() => {
            isRemoteUpdating = false;
          }, 1000);
        } else if (!res.error) {
          set({ cloudSyncStatus: 'synced' });
        } else {
          set({ cloudSyncStatus: 'offline' });
        }
      } catch (err) {
        console.warn('Supabase sync pull error:', err);
        set({ cloudSyncStatus: 'offline' });
        // DO NOT set hasHydratedFromCloud = true here.
        // If the pull fails (offline/network error), we must NOT allow local state
        // to be pushed to cloud, as it could overwrite real cloud data when reconnected.
      }
    },

    toasts: [],
    showToast: (title, message, type = 'info') => {
      const id = Date.now().toString() + Math.random().toString().slice(2, 6);
      set((state) => ({ toasts: [...state.toasts, { id, title, message, type }] }));
      setTimeout(() => {
        get().removeToast(id);
      }, 4000);
    },
    removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),

    resetData: () => {
      set({
        shopConfig: initialShopConfig,
        services: initialServices,
        customers: initialCustomers,
        appointments: initialAppointments,
        timeBlocks: initialTimeBlocks,
      });
      if (typeof window !== 'undefined') localStorage.clear();
      get().showToast('초기화 완료', '모든 데이터가 기본 초기 상태로 복원되었습니다.', 'success');
    },
    loadSampleData: () => {
      set({
        customers: sampleCustomers,
        appointments: sampleAppointments,
        timeBlocks: sampleTimeBlocks,
      });
      get().showToast('샘플 데이터 로드', '연습용 샘플 예약(2건) 및 단골 고객(2명) 데이터가 생성되었습니다.', 'info');
    },
    clearAllSampleData: () => {
      set({ customers: [], appointments: [], timeBlocks: [] });
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify([]));
        localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify([]));
        localStorage.setItem(STORAGE_KEYS.TIMEBLOCKS, JSON.stringify([]));
      }

      const { cloudConfig, shopConfig, services } = get();
      if (cloudConfig.supabaseUrl && cloudConfig.supabaseAnonKey) {
        const nowIso = new Date().toISOString();
        lastCloudUpdatedTimestamp = nowIso;
        const payload: SyncPayload = { shopConfig, services, customers: [], appointments: [], timeBlocks: [], updatedAt: nowIso };
        pushDataToCloud(payload, cloudConfig.storeChannelId);
      }
      get().showToast('실전 운영 모드 전환 완료', '회원수(0명), 예약 내역(0건)이 모두 완벽하게 초기화되었습니다.', 'success');
    },
    exportDataJson: () => {
      const { shopConfig, services, customers, appointments, timeBlocks } = get();
      return JSON.stringify({ shopConfig, services, customers, appointments, timeBlocks, exportedAt: new Date().toISOString() }, null, 2);
    },
    importDataJson: (json) => {
      try {
        const data = JSON.parse(json);
        const updates: Partial<AppStore> = {};
        if (data.shopConfig) {
          // Never restore adminPin from backup - keep the locally stored PIN
          const { adminPin: _pin, ...safeShopConfig } = data.shopConfig as any;
          updates.shopConfig = { ...safeShopConfig, adminPin: get().shopConfig.adminPin };
        }
        if (data.services) updates.services = data.services;
        if (data.customers) updates.customers = data.customers.map((c: any) => ({ ...c, history: c.history ?? [] }));
        if (data.appointments) updates.appointments = data.appointments;
        if (data.timeBlocks) updates.timeBlocks = data.timeBlocks;
        set(updates);
        get().showToast('데이터 복원', '백업 데이터가 성공적으로 적용되었습니다.', 'success');
        return true;
      } catch {
        get().showToast('복원 실패', '유효하지 않은 백업 JSON 파일입니다.', 'error');
        return false;
      }
    },
  };
});

// Sync side effects (LocalStorage & Cloud Push)
useAppStore.subscribe((state, prevState) => {
  if (typeof window === 'undefined') return;

  // LocalStorage Syncing
  if (state.shopConfig !== prevState.shopConfig) localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(state.shopConfig));
  if (state.services !== prevState.services) localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(state.services));
  if (state.customers !== prevState.customers) localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(state.customers));
  if (state.appointments !== prevState.appointments) localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(state.appointments));
  if (state.timeBlocks !== prevState.timeBlocks) localStorage.setItem(STORAGE_KEYS.TIMEBLOCKS, JSON.stringify(state.timeBlocks));

  // Cloud Sync Push Logic
  const hasDataChanged =
    state.shopConfig !== prevState.shopConfig ||
    state.services !== prevState.services ||
    state.customers !== prevState.customers ||
    state.appointments !== prevState.appointments ||
    state.timeBlocks !== prevState.timeBlocks;

  const hasCloudConfigChanged = state.cloudConfig !== prevState.cloudConfig;

  if (hasDataChanged || hasCloudConfigChanged) {
    if (isRemoteUpdating) return;
    if (!state.cloudConfig.supabaseUrl || !state.cloudConfig.supabaseAnonKey) return;
    if (!hasHydratedFromCloud) return;

    localChangeCounter += 1;
    const currentCounter = localChangeCounter;

    if (syncTimer) clearTimeout(syncTimer);
    syncTimer = setTimeout(async () => {
      if (currentCounter !== localChangeCounter) return;
      try {
        useAppStore.setState({ cloudSyncStatus: 'syncing' });
        const nowIso = new Date().toISOString();
        lastCloudUpdatedTimestamp = nowIso;
        
        // Strip adminPin from shopConfig before pushing to cloud for security
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { adminPin: _pin, ...safeShopConfig } = state.shopConfig as any;
        const payload: SyncPayload = {
          shopConfig: safeShopConfig,
          services: state.services,
          customers: state.customers,
          appointments: state.appointments,
          timeBlocks: state.timeBlocks,
          updatedAt: nowIso,
        };
        
        const result = await pushDataToCloud(payload, state.cloudConfig.storeChannelId);
        if (result.success) {
          useAppStore.setState({
            cloudSyncStatus: 'synced',
            lastSyncedAt: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          });
        } else {
          useAppStore.setState({ cloudSyncStatus: 'offline' });
        }
      } catch (e) {
        console.warn('Supabase push error:', e);
        useAppStore.setState({ cloudSyncStatus: 'offline' });
      }
    }, 1000);
  }
});

// Periodic Auto-Sync and Window Focus listener
if (typeof window !== 'undefined') {
  const initSync = () => {
    const { cloudConfig, syncWithCloud } = useAppStore.getState();
    if (cloudConfig.supabaseUrl && cloudConfig.supabaseAnonKey) {
      syncWithCloud(true);
    }
  };

  // Initial Sync Call
  setTimeout(initSync, 100);

  setInterval(() => {
    if (!document.hidden) {
      const { cloudConfig, syncWithCloud } = useAppStore.getState();
      if (cloudConfig.supabaseUrl && cloudConfig.supabaseAnonKey) {
        syncWithCloud(true);
      }
    }
  }, 4000);

  window.addEventListener('focus', () => {
    const { cloudConfig, syncWithCloud } = useAppStore.getState();
    if (cloudConfig.supabaseUrl && cloudConfig.supabaseAnonKey) {
      syncWithCloud(true);
    }
  });
}
