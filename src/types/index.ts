export type ServiceCategory = '눈썹' | '아이라인' | '입술' | '미인점' | '속눈썹';

export interface ServiceItem {
  id: string;
  name: string;
  category: ServiceCategory;
  price: number;
  durationMinutes: number; // e.g. 60, 90, 120
  description: string;
  recommendedFor: string;
  tag?: string;
  popular?: boolean;
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'noshow';

export interface Appointment {
  id: string;
  customerName: string;
  customerPhone: string;
  serviceId: string;
  serviceName: string;
  price: number;
  durationMinutes: number;
  date: string; // 'YYYY-MM-DD'
  time: string; // 'HH:mm' e.g. '10:00'
  status: AppointmentStatus;
  notes?: string;
  isFirstVisit: boolean;
  createdAt: string;
  updatedAt?: string;
  paymentMethod?: 'card' | 'cash' | 'transfer' | 'unpaid';
  smsSent?: boolean;
  smsSentAt?: string;
}

export type CustomerGrade = 'VIP' | '단골' | '신규' | '주의';

export interface TreatmentHistoryItem {
  id: string;
  date: string;
  serviceName: string;
  price: number;
  notes: string;
  pigmentColor?: string; // 색소 배합 정보 (e.g. 다크브라운 + 카키 1방울)
  technique?: string; // e.g. 엠보 결 + 머신 섀도우
  beforeImage?: string;
  afterImage?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  grade: CustomerGrade;
  isBlacklisted?: boolean; // 노쇼/블랙리스트 여부
  skinType?: string; // 지성, 건성, 복합성, 민감성, 흉터성 등
  allergies?: string; // 켈로이드, 금속알러지, 피부염 등
  memo?: string; // 고객 취향 (e.g. 세미아치 선호, 자연스러운 결 강조)
  totalVisits: number;
  totalSpent: number;
  lastVisitDate?: string;
  history: TreatmentHistoryItem[];
  createdAt: string;
}

export interface TimeBlock {
  id: string;
  date: string; // 'YYYY-MM-DD'
  startTime: string; // 'HH:mm'
  endTime: string; // 'HH:mm'
  reason: string; // '점심시간' | '개인일정' | '임시휴진' | '기타'
}

export interface ShopConfig {
  name: string;
  subtitle: string;
  instagram: string;
  phone: string;
  address: string;
  weekdayHours: { start: string; end: string }; // 10:00 ~ 19:00
  weekendHours: { start: string; end: string }; // 10:00 ~ 21:00 (금-토)
  closedDays: number[]; // [0] = 일요일
  slotIntervalMinutes: number; // 30
  notice: string;
  depositAmount: number; // 예약금
  bankInfo: string;
  adminPin: string; // 원장님 관리자 접속 비밀번호/PIN (기본: 7721)
}

export type ActiveTab = 'calendar' | 'customers' | 'analytics' | 'settings';
export type ViewMode = 'customer' | 'admin';
