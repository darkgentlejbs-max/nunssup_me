import { ShopConfig, ServiceItem, Customer, Appointment, TimeBlock } from '../types';

export const initialShopConfig: ShopConfig = {
  name: '눈썹 : 미 眉',
  subtitle: 'LASH & BROW',
  instagram: '@nunssup_me',
  phone: '010.3797.7721',
  address: '전남광주통합특별시 여수시 문수로 148, 1층(문수동)',
  weekdayHours: { start: '10:30', end: '19:00' }, // 월-수 10:30 ~ 19:00
  weekendHours: { start: '10:30', end: '21:00' }, // 목-토 10:30 ~ 21:00
  closedDays: [0], // 0 = 일요일 휴무 (일요일은 쉬어요:))
  slotIntervalMinutes: 30,
  notice: '100% 예약제 운영중 입니다. 부재 시 문자 남겨주세요 :)',
  depositAmount: 20000,
  bankInfo: '카카오뱅크 3333-01-2345678 (예금주: 눈썹미)',
  adminPin: '7721', // 전화번호 뒷 4자리
};

export const initialServices: ServiceItem[] = [
  {
    id: 'srv-1',
    name: '여자 자연눈썹 (엠보)',
    category: '눈썹',
    price: 150000,
    durationMinutes: 90,
    description: '본인 눈썹 결을 한 올 한 올 살려 원래 내 눈썹처럼 자연스러운 결을 완성하는 시그니처 시술',
    recommendedFor: '모량이 적당하고 자연스러운 쌩얼 눈썹을 원하시는 분',
    tag: '대표 시그니처',
    popular: true,
  },
  {
    id: 'srv-2',
    name: '여자 콤보눈썹 (결+섀도우)',
    category: '눈썹',
    price: 180000,
    durationMinutes: 90,
    description: '앞머리는 자연스러운 엠보 결로, 꼬리와 숱이 부족한 부분은 부드러운 섀도우 그라데이션으로 풍성하게 채우는 입체적 시술',
    recommendedFor: '눈썹 숱이 적거나 붉은 잔흔이 남아있는 분',
    tag: '만족도 1위',
    popular: true,
  },
  {
    id: 'srv-3',
    name: '남자 맞춤 결눈썹',
    category: '눈썹',
    price: 160000,
    durationMinutes: 90,
    description: '남성 골격과 눈썹 근육의 움직임에 맞춘 티 나지 않는 또렷하고 단정한 맨즈 텍스처 디자인',
    recommendedFor: '인상이 흐릿해 보이거나 면접/웨딩을 앞두신 남성분',
    tag: '남성 전용',
    popular: true,
  },
  {
    id: 'srv-4',
    name: '무통 점막 아이라인',
    category: '아이라인',
    price: 130000,
    durationMinutes: 60,
    description: '속눈썹 사이사이 점막을 꼼꼼히 채워 붓기 없이 또렷하고 깊이 있는 눈매를 연출',
    recommendedFor: '아이라인 그리기 번거롭거나 점막이 들려 보이는 분',
    tag: '통증 최소화',
    popular: false,
  },
  {
    id: 'srv-5',
    name: '생기 틴트 입술 (립 블러셔)',
    category: '입술',
    price: 220000,
    durationMinutes: 120,
    description: '어둡고 칙칙한 입술 톤을 보정하고 화사한 수채화 물광 틴트 발색을 선사하는 립 디자인',
    recommendedFor: '입술에 생기가 없거나 입술 라인이 불분명한 분',
    tag: '생기 충전',
    popular: true,
  },
  {
    id: 'srv-6',
    name: '포인트 미인점',
    category: '미인점',
    price: 30000,
    durationMinutes: 30,
    description: '코, 볼, 눈가 등 얼굴의 장점을 극대화하는 매력적인 자연스러운 미인점 연출',
    recommendedFor: '얼굴의 여백을 줄이고 포인트를 주고 싶으신 분',
    tag: '간편 시술',
    popular: false,
  },
  {
    id: 'srv-7',
    name: '블랙 케라틴 영양 속눈썹 펌',
    category: '속눈썹',
    price: 45000,
    durationMinutes: 50,
    description: '고농축 케라틴 영양제와 블랙 틴팅으로 속눈썹 손상 없이 바짝 올라가는 또렷한 C/L컬 펌',
    recommendedFor: '뷰러를 해도 금방 처지거나 잦은 마스카라가 번거로운 분',
    tag: '재예약률 95%',
    popular: true,
  },
  {
    id: 'srv-8',
    name: '프리미엄 볼륨 속눈썹 연장',
    category: '속눈썹',
    price: 65000,
    durationMinutes: 70,
    description: '초경량 프리미엄 플랫모로 이물감 없이 풍성하고 그윽한 인형 눈매 완성',
    recommendedFor: '풍성한 볼륨감과 화려한 눈매를 선호하시는 분',
    tag: '이물감 Zero',
    popular: false,
  },
];

// Clean Operational Initial Data (Starts clean for real store bookings)
export const initialCustomers: Customer[] = [];
export const initialAppointments: Appointment[] = [];
export const initialTimeBlocks: TimeBlock[] = [];

// Helper for relative dates
const getTodayStr = (offsetDays = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

// Demo/Sample Data for practice
export const sampleCustomers: Customer[] = [
  {
    id: 'cust-1',
    name: '김서연',
    phone: '010-2345-6789',
    grade: 'VIP',
    skinType: '건성, 얇은 피부',
    allergies: '없음',
    memo: '세미아치 디자인 선호, 피부 톤이 밝아서 카키브라운 계열 착색 우수함.',
    totalVisits: 4,
    totalSpent: 480000,
    lastVisitDate: getTodayStr(-30),
    history: [
      {
        id: 'hist-1',
        date: getTodayStr(-180),
        serviceName: '여자 콤보눈썹 (결+섀도우)',
        price: 180000,
        notes: '1차 디자인: 붉은 잔흔 커버하며 세미아치 라인 잡음.',
        pigmentColor: '다크브라운 7 : 카키 1',
      },
    ],
    createdAt: getTodayStr(-200),
  },
  {
    id: 'cust-2',
    name: '이지훈',
    phone: '010-8765-4321',
    grade: '단골',
    skinType: '지성',
    allergies: '없음',
    memo: '자연스러운 맨즈 텍스처 선호.',
    totalVisits: 2,
    totalSpent: 160000,
    lastVisitDate: getTodayStr(-45),
    history: [],
    createdAt: getTodayStr(-50),
  },
];

export const sampleAppointments: Appointment[] = [
  {
    id: 'apt-sample-1',
    customerName: '김서연',
    customerPhone: '010-2345-6789',
    serviceId: 'srv-7',
    serviceName: '블랙 케라틴 영양 속눈썹 펌',
    price: 45000,
    durationMinutes: 50,
    date: getTodayStr(0),
    time: '11:00',
    status: 'confirmed',
    notes: '속눈썹 펌 정기 방문 (U컬)',
    isFirstVisit: false,
    createdAt: getTodayStr(-3),
    paymentMethod: 'card',
  },
  {
    id: 'apt-sample-2',
    customerName: '이지훈',
    customerPhone: '010-8765-4321',
    serviceId: 'srv-3',
    serviceName: '남자 맞춤 결눈썹',
    price: 160000,
    durationMinutes: 90,
    date: getTodayStr(0),
    time: '14:00',
    status: 'confirmed',
    notes: '결혼식 전 자연스러운 눈썹 정리',
    isFirstVisit: false,
    createdAt: getTodayStr(-5),
    paymentMethod: 'cash',
  },
];

export const sampleTimeBlocks: TimeBlock[] = [
  {
    id: 'tb-sample-1',
    date: getTodayStr(0),
    startTime: '12:30',
    endTime: '13:30',
    reason: '원장님 점심 및 샵 방역 시간',
  },
];
