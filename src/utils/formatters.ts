import { AppointmentStatus, CustomerGrade } from '../types';

// Format currency e.g. 150000 -> 150,000원
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('ko-KR').format(amount) + '원';
};

// Format phone number e.g. 01012345678 -> 010-1234-5678
export const formatPhoneNumber = (value: string): string => {
  const clean = value.replace(/[^0-9]/g, '');
  if (clean.length < 4) return clean;
  if (clean.length < 7) return `${clean.slice(0, 3)}-${clean.slice(3)}`;
  if (clean.length < 11) return `${clean.slice(0, 3)}-${clean.slice(3, 6)}-${clean.slice(6)}`;
  return `${clean.slice(0, 3)}-${clean.slice(3, 7)}-${clean.slice(7, 11)}`;
};

// Status text and color mapping
export const getStatusBadgeInfo = (status: AppointmentStatus): { label: string; bg: string; text: string; border: string } => {
  switch (status) {
    case 'pending':
      return {
        label: '예약 대기',
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-200',
      };
    case 'confirmed':
      return {
        label: '예약 확정',
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
      };
    case 'completed':
      return {
        label: '시술 완료',
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        border: 'border-blue-200',
      };
    case 'cancelled':
      return {
        label: '예약 취소',
        bg: 'bg-red-50',
        text: 'text-red-600',
        border: 'border-red-200',
      };
    case 'noshow':
      return {
        label: '노쇼 (불참)',
        bg: 'bg-rose-50',
        text: 'text-rose-700',
        border: 'border-rose-200',
      };
  }
};

export const getGradeBadgeInfo = (grade: CustomerGrade): { label: string; bg: string; text: string } => {
  switch (grade) {
    case 'VIP':
      return { label: 'VIP', bg: 'bg-amber-100 text-amber-800 border-amber-300', text: 'text-amber-800' };
    case '단골':
      return { label: '단골', bg: 'bg-emerald-100 text-emerald-800 border-emerald-300', text: 'text-emerald-800' };
    case '신규':
      return { label: '신규', bg: 'bg-blue-100 text-blue-800 border-blue-300', text: 'text-blue-800' };
    case '주의':
      return { label: '주의', bg: 'bg-rose-100 text-rose-800 border-rose-300', text: 'text-rose-800' };
  }
};
