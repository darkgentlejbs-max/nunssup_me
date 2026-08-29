import React from 'react';
import { useApp } from '../../context/AppContext';
import { ScheduleCalendar } from './ScheduleCalendar';
import { CustomerCRM } from './CustomerCRM';
import { SalesReport } from './SalesReport';
import { ShopSettings } from './ShopSettings';
import { formatKoreanDate, getTodayString } from '../../utils/dateUtils';
import { formatCurrency } from '../../utils/formatters';
import {
  Calendar as CalendarIcon,
  Users,
  BarChart3,
  Settings,
  Bell,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Check,
  X,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    appointments,
    customers,
    updateAppointmentStatus,
    shopConfig,
    setSelectedDate,
  } = useApp();

  const todayStr = getTodayString();

  // Pending approval list
  const pendingAppointments = appointments.filter((a) => a.status === 'pending');
  const todayApts = appointments.filter((a) => a.date === todayStr && a.status !== 'cancelled');
  const todayCompleted = appointments.filter((a) => a.date === todayStr && a.status === 'completed');
  const todaySales = todayCompleted.reduce((sum, a) => sum + a.price, 0);

  return (
    <div className="min-h-screen bg-stone-100/60 pb-20">
      {/* 1. TOP OWNER HEADER */}
      <div className="bg-brand-900 text-white border-b border-brand-800 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 text-gold-300 text-xs font-semibold uppercase tracking-wider mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span>원장님 통합 비즈니스 관리자 센터</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-serif-kr text-white">
                눈썹 : 미 <span className="text-gold-300">眉</span> 스마트 CRM
              </h1>
              <p className="text-xs sm:text-sm text-stone-300 mt-1">
                오늘의 일정: {formatKoreanDate(todayStr)} | 100% 예약제 실시간 운영 중
              </p>
            </div>

            {/* Quick Clickable KPI stats in header */}
            <div className="flex items-center gap-1.5 sm:gap-2 bg-brand-950/90 p-2 sm:p-2.5 rounded-2xl border border-brand-700/80 shadow-lg">
              {/* 오늘 예약 -> Calendar */}
              <button
                type="button"
                onClick={() => {
                  setSelectedDate(getTodayString());
                  setActiveTab('calendar');
                }}
                className={`text-right px-3 py-2 rounded-xl transition-all group flex flex-col items-end cursor-pointer ${
                  activeTab === 'calendar'
                    ? 'bg-brand-800 ring-1 ring-gold-400/60 shadow-sm'
                    : 'hover:bg-brand-900/90'
                }`}
                title="오늘 예약 캘린더 화면으로 이동"
              >
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-stone-300 block group-hover:text-gold-300 transition-colors">
                    오늘 예약
                  </span>
                  <CalendarIcon className="w-2.5 h-2.5 text-stone-400 group-hover:text-gold-300" />
                </div>
                <strong className="text-base sm:text-lg font-bold text-white font-mono leading-tight group-hover:text-gold-300 transition-colors">
                  {todayApts.length}건
                </strong>
              </button>

              <div className="h-8 w-px bg-brand-800" />

              {/* 오늘 매출 -> Sales Report */}
              <button
                type="button"
                onClick={() => setActiveTab('analytics')}
                className={`text-right px-3 py-2 rounded-xl transition-all group flex flex-col items-end cursor-pointer ${
                  activeTab === 'analytics'
                    ? 'bg-brand-800 ring-1 ring-gold-400/60 shadow-sm'
                    : 'hover:bg-brand-900/90'
                }`}
                title="매출 보고서 및 통계 화면으로 이동"
              >
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-stone-300 block group-hover:text-gold-300 transition-colors">
                    오늘 매출
                  </span>
                  <BarChart3 className="w-2.5 h-2.5 text-stone-400 group-hover:text-gold-300" />
                </div>
                <strong className="text-base sm:text-lg font-bold text-gold-300 font-mono leading-tight group-hover:scale-105 transition-transform">
                  {formatCurrency(todaySales)}
                </strong>
              </button>

              <div className="h-8 w-px bg-brand-800" />

              {/* 총 회원수 -> Customer CRM */}
              <button
                type="button"
                onClick={() => setActiveTab('customers')}
                className={`text-right px-3 py-2 rounded-xl transition-all group flex flex-col items-end cursor-pointer ${
                  activeTab === 'customers'
                    ? 'bg-brand-800 ring-1 ring-gold-400/60 shadow-sm'
                    : 'hover:bg-brand-900/90'
                }`}
                title="고객 차트 및 회원 관리 화면으로 이동"
              >
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-stone-300 block group-hover:text-gold-300 transition-colors">
                    총 회원수
                  </span>
                  <Users className="w-2.5 h-2.5 text-stone-400 group-hover:text-gold-300" />
                </div>
                <strong className="text-base sm:text-lg font-bold text-white font-mono leading-tight group-hover:text-gold-300 transition-colors">
                  {customers.length}명
                </strong>
              </button>
            </div>
          </div>

          {/* 2. PENDING APPROVAL ALERT BANNER (If Any) */}
          {pendingAppointments.length > 0 && (
            <div className="bg-amber-500/15 border border-amber-400/40 rounded-2xl p-4 text-amber-200">
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                  <h3 className="font-bold text-sm text-amber-300">
                    신규 온라인 예약 승인 대기 ({pendingAppointments.length}건)
                  </h3>
                </div>
                <span className="text-xs text-amber-300/80 hidden sm:inline">
                  고객님께서 예약 신청을 완료하여 원장님의 승인을 기다리고 있습니다.
                </span>
              </div>

              <div className="space-y-2 max-h-40 overflow-y-auto">
                {pendingAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="bg-brand-950/70 p-3 rounded-xl border border-amber-400/20 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <span className="font-bold text-white text-sm">{apt.customerName}</span>
                      <span className="text-stone-400 ml-2 font-mono">{apt.customerPhone}</span>
                      <span className="text-gold-300 ml-2 font-semibold">[{apt.serviceName}]</span>
                      <span className="text-stone-300 ml-2">
                        {formatKoreanDate(apt.date)} {apt.time}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateAppointmentStatus(apt.id, 'confirmed')}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors flex items-center gap-1 shadow-sm"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>승인하기</span>
                      </button>
                      <button
                        onClick={() => updateAppointmentStatus(apt.id, 'cancelled')}
                        className="px-2.5 py-1 bg-rose-900/60 hover:bg-rose-900 text-rose-300 rounded-lg transition-colors"
                      >
                        거절
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. SUB-NAV TABS */}
          <div className="flex items-center gap-2 border-b border-brand-800 overflow-x-auto pb-1">
            <button
              onClick={() => setActiveTab('calendar')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'calendar'
                  ? 'bg-stone-100 text-brand-900 shadow-sm border-t-2 border-gold-400'
                  : 'text-stone-300 hover:text-white hover:bg-brand-800/60'
              }`}
            >
              <CalendarIcon className="w-4 h-4 text-brand-700" />
              <span>일정 & 캘린더</span>
              <span className="text-[11px] px-1.5 py-0.2 bg-brand-800 text-stone-200 rounded-full font-mono">
                {appointments.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('customers')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'customers'
                  ? 'bg-stone-100 text-brand-900 shadow-sm border-t-2 border-gold-400'
                  : 'text-stone-300 hover:text-white hover:bg-brand-800/60'
              }`}
            >
              <Users className="w-4 h-4 text-brand-700" />
              <span>고객 관리 & 전자 차트</span>
              <span className="text-[11px] px-1.5 py-0.2 bg-brand-800 text-stone-200 rounded-full font-mono">
                {customers.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'analytics'
                  ? 'bg-stone-100 text-brand-900 shadow-sm border-t-2 border-gold-400'
                  : 'text-stone-300 hover:text-white hover:bg-brand-800/60'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-brand-700" />
              <span>매출 & 분석</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'settings'
                  ? 'bg-stone-100 text-brand-900 shadow-sm border-t-2 border-gold-400'
                  : 'text-stone-300 hover:text-white hover:bg-brand-800/60'
              }`}
            >
              <Settings className="w-4 h-4 text-brand-700" />
              <span>매장 설정 & 백업</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. TAB VIEW CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-2 pt-6">
        {activeTab === 'calendar' && <ScheduleCalendar />}
        {activeTab === 'customers' && <CustomerCRM />}
        {activeTab === 'analytics' && <SalesReport />}
        {activeTab === 'settings' && <ShopSettings />}
      </main>
    </div>
  );
};
