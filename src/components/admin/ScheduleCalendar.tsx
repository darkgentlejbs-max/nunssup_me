import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Appointment, AppointmentStatus, TimeBlock } from '../../types';
import {
  formatKoreanDate,
  timeToMinutes,
  minutesToTime,
  getHoursForDate,
  isDateClosed,
  getWeekDates,
  formatLocalDate,
  getTodayString,
  shiftDate,
  shiftMonth,
  getMonthGrid,
} from '../../utils/dateUtils';
import { formatCurrency, formatPhoneNumber, getStatusBadgeInfo } from '../../utils/formatters';
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  Ban,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  User,
  Phone,
  FileText,
  X,
  Sparkles,
  Scissors,
  Check,
  MessageSquare,
  Trash2,
} from 'lucide-react';

export const ScheduleCalendar: React.FC = () => {
  const {
    appointments,
    timeBlocks,
    services,
    customers,
    shopConfig,
    selectedDate,
    setSelectedDate,
    updateAppointmentStatus,
    createAppointment,
    addTimeBlock,
    deleteTimeBlock,
    deleteAppointment,
    openSmsModal,
  } = useApp();

  const [calendarView, setCalendarView] = useState<'daily' | 'weekly' | 'monthly' | 'list'>('daily');
  const [listFilter, setListFilter] = useState<'upcoming' | 'past' | 'all'>('upcoming');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  // Direct Appointment Form States
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newServiceId, setNewServiceId] = useState(services[0]?.id || '');
  const [newDate, setNewDate] = useState(selectedDate);
  const [newTime, setNewTime] = useState('11:00');
  const [newNotes, setNewNotes] = useState('');
  const [newIsFirst, setNewIsFirst] = useState(true);

  // Timeblock Form States
  const [blockDate, setBlockDate] = useState(selectedDate);
  const [blockStart, setBlockStart] = useState('12:30');
  const [blockEnd, setBlockEnd] = useState('13:30');
  const [blockReason, setBlockReason] = useState('점심 및 휴식 시간');

  // Change selected date (Timezone-safe)
  const handleDateShift = (days: number) => {
    setSelectedDate(shiftDate(selectedDate, days));
  };

  const handleSetToday = () => {
    setSelectedDate(getTodayString());
  };

  const handleMonthShift = (offsetMonths: number) => {
    setSelectedDate(shiftMonth(selectedDate, offsetMonths));
  };

  // Appointments on selected day
  const dayAppointments = appointments.filter((a) => a.date === selectedDate && a.status !== 'cancelled');
  const dayTimeBlocks = timeBlocks.filter((b) => b.date === selectedDate);
  const dayClosed = isDateClosed(selectedDate, shopConfig);
  const dayHours = getHoursForDate(selectedDate, shopConfig);

  // Create Direct Appointment
  const handleCreateDirectBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName || !newCustPhone || !newServiceId) return;

    createAppointment({
      customerName: newCustName.trim(),
      customerPhone: newCustPhone.trim(),
      serviceId: newServiceId,
      date: newDate,
      time: newTime,
      notes: newNotes.trim(),
      isFirstVisit: newIsFirst,
    });

    setIsAddModalOpen(false);
    setNewCustName('');
    setNewCustPhone('');
    setNewNotes('');
  };

  // Create Timeblock
  const handleCreateBlock = (e: React.FormEvent) => {
    e.preventDefault();
    addTimeBlock({
      date: blockDate,
      startTime: blockStart,
      endTime: blockEnd,
      reason: blockReason,
    });
    setIsBlockModalOpen(false);
  };

  // Time grid slots from 10:00 to 21:00 in 30m steps
  const gridHours: string[] = [];
  for (let h = 10; h <= 21; h++) {
    gridHours.push(`${h.toString().padStart(2, '0')}:00`);
    if (h < 21) {
      gridHours.push(`${h.toString().padStart(2, '0')}:30`);
    }
  }

  const renderListView = () => {
    const todayStr = getTodayString();
    
    // 필터에 맞게 예약 필터링
    let filteredAppointments = appointments.filter(a => a.status !== 'cancelled');
    
    if (listFilter === 'upcoming') {
      filteredAppointments = filteredAppointments.filter(a => a.date >= todayStr);
    } else if (listFilter === 'past') {
      filteredAppointments = filteredAppointments.filter(a => a.date < todayStr);
    }
    
    // 정렬 (다가오는 예약은 날짜 오름차순, 과거 예약은 날짜 내림차순, 전체는 날짜 내림차순)
    filteredAppointments.sort((a, b) => {
      const timeA = `${a.date} ${a.time}`;
      const timeB = `${b.date} ${b.time}`;
      if (listFilter === 'upcoming') {
        return timeA.localeCompare(timeB);
      }
      return timeB.localeCompare(timeA);
    });

    return (
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden flex flex-col h-[70vh]">
        {/* 리스트 필터 탭 */}
        <div className="flex border-b border-stone-200 bg-stone-50/50 p-2 gap-2">
          <button
            onClick={() => setListFilter('upcoming')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex-1 ${
              listFilter === 'upcoming' ? 'bg-white shadow-sm border border-stone-200 text-brand-900' : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            다가오는 예약
          </button>
          <button
            onClick={() => setListFilter('past')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex-1 ${
              listFilter === 'past' ? 'bg-white shadow-sm border border-stone-200 text-brand-900' : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            지난 예약
          </button>
          <button
            onClick={() => setListFilter('all')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex-1 ${
              listFilter === 'all' ? 'bg-white shadow-sm border border-stone-200 text-brand-900' : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            전체 보기
          </button>
        </div>

        {/* 리스트 내용 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredAppointments.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-stone-400">
              <CalendarIcon className="w-12 h-12 mb-3 opacity-20" />
              <p>해당하는 예약이 없습니다.</p>
            </div>
          ) : (
            filteredAppointments.map(apt => {
              const badge = getStatusBadgeInfo(apt.status);
              return (
                <div key={apt.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white border border-stone-200 rounded-2xl hover:border-brand-300 transition-colors shadow-sm gap-4">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${badge.bg} ${badge.text} ${badge.border}`}>
                        {badge.label}
                      </span>
                      <span className="text-sm font-bold text-stone-900">
                        {formatKoreanDate(apt.date)} {apt.time}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-bold text-brand-900">{apt.customerName}</span>
                      <span className="text-xs text-stone-500 font-mono">{formatPhoneNumber(apt.customerPhone)}</span>
                    </div>
                    <div className="text-xs text-stone-600 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-gold-500" />
                      <span>{apt.serviceName}</span>
                      <span className="text-stone-300">|</span>
                      <span className="font-mono font-semibold">{formatCurrency(apt.price)}</span>
                    </div>
                    {apt.notes && (
                      <p className="text-[11px] text-stone-500 bg-stone-50 p-1.5 rounded-lg border border-stone-100 inline-block mt-1">
                        메모: {apt.notes}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => {
                        setSelectedAppointment(apt);
                        setIsAddModalOpen(true);
                      }}
                      className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-lg transition-colors"
                    >
                      상세 보기
                    </button>
                    {apt.status === 'pending' && (
                      <button
                        onClick={() => updateAppointmentStatus(apt.id, 'confirmed')}
                        className="px-3 py-1.5 bg-brand-900 hover:bg-brand-800 text-gold-300 text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" /> 승인
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* 1. TOP CONTROLS & DATE NAVIGATOR */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Date Selector */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleDateShift(-1)}
            className="p-2 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-600 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-1.5 border border-stone-300 rounded-xl text-xs sm:text-sm font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-800"
            />
            <button
              onClick={handleSetToday}
              className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-colors"
            >
              오늘
            </button>
          </div>

          <button
            onClick={() => handleDateShift(1)}
            className="p-2 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-600 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <span className="hidden sm:inline font-serif-kr font-bold text-sm text-brand-900 ml-2">
            {formatKoreanDate(selectedDate)}
          </span>
        </div>

        {/* View Switcher & Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap justify-end w-full md:w-auto">
          <div className="flex bg-stone-100 p-1 rounded-xl">
            <button
              onClick={() => setCalendarView('daily')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                calendarView === 'daily'
                  ? 'bg-brand-900 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              일간 타임테이블
            </button>
            <button
              onClick={() => setCalendarView('weekly')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                calendarView === 'weekly'
                  ? 'bg-brand-900 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              주간 뷰
            </button>
            <button
              onClick={() => setCalendarView('monthly')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                calendarView === 'monthly'
                  ? 'bg-brand-900 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              월간 뷰
            </button>
            <button
              onClick={() => setCalendarView('list')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                calendarView === 'list'
                  ? 'bg-brand-900 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              목록 뷰
            </button>
          </div>

          <button
            onClick={() => {
              setBlockDate(selectedDate);
              setIsBlockModalOpen(true);
            }}
            className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
          >
            <Ban className="w-3.5 h-3.5 text-stone-500" />
            <span>일정 차단</span>
          </button>

          <button
            onClick={() => {
              setNewDate(selectedDate);
              setIsAddModalOpen(true);
            }}
            className="px-4 py-2 bg-brand-900 hover:bg-brand-800 text-gold-300 hover:text-white rounded-xl text-xs font-bold transition-all shadow flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>예약 직접 등록</span>
          </button>
        </div>
      </div>

      {/* 2. MAIN CALENDAR VIEW */}
      {calendarView === 'daily' && (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
          {/* Daily Header */}
          <div className="p-4 sm:p-6 bg-stone-50/80 border-b border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-serif-kr text-base sm:text-lg font-bold text-stone-900">
                {formatKoreanDate(selectedDate)} 일정 현황
              </span>
              {dayClosed.isClosed ? (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 font-bold border border-rose-200">
                  정기 휴무일
                </span>
              ) : (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-brand-100 text-brand-800 font-bold border border-brand-200">
                  영업시간: {dayHours.start} ~ {dayHours.end}
                </span>
              )}
            </div>
            <span className="text-xs text-stone-500 font-medium">
              총 <strong>{dayAppointments.length}</strong>건의 예약
            </span>
          </div>

          {/* Timetable Grid */}
          <div className="divide-y divide-stone-100">
            {gridHours.map((hourStr) => {
              const currentMin = timeToMinutes(hourStr);
              // Find appointment starting at or spanning this hour
              const matchingApts = dayAppointments.filter((apt) => {
                const aptStart = timeToMinutes(apt.time);
                const aptEnd = aptStart + apt.durationMinutes;
                return currentMin >= aptStart && currentMin < aptEnd;
              });

              // Find timeblock
              const matchingBlock = dayTimeBlocks.find((b) => {
                const bStart = timeToMinutes(b.startTime);
                const bEnd = timeToMinutes(b.endTime);
                return currentMin >= bStart && currentMin < bEnd;
              });

              const isStartSlot = (apt: Appointment) => apt.time === hourStr;
              const isBlockStart = matchingBlock && matchingBlock.startTime === hourStr;

              const openStart = timeToMinutes(dayHours.start);
              const openEnd = timeToMinutes(dayHours.end);
              const isOutsideBusiness = currentMin < openStart || currentMin >= openEnd || dayClosed.isClosed;

              return (
                <div
                  key={hourStr}
                  className={`flex min-h-[56px] transition-colors ${
                    isOutsideBusiness ? 'bg-stone-50/50' : 'hover:bg-brand-50/20'
                  }`}
                >
                  {/* Time label */}
                  <div className="w-16 sm:w-20 p-2 sm:p-3 border-r border-stone-200 text-stone-500 font-mono text-xs font-semibold flex items-start justify-center flex-shrink-0 bg-stone-50/40">
                    {hourStr}
                  </div>

                  {/* Content slot */}
                  <div className="flex-1 p-1.5 sm:p-2 relative flex flex-col justify-center">
                    {matchingBlock && isBlockStart && (
                      <div className="bg-stone-200/80 border border-stone-300 rounded-xl p-2.5 text-xs text-stone-700 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Ban className="w-3.5 h-3.5 text-stone-500" />
                          <span className="font-bold">{matchingBlock.reason}</span>
                          <span className="text-stone-500 text-[11px]">
                            ({matchingBlock.startTime} ~ {matchingBlock.endTime})
                          </span>
                        </div>
                        <button
                          onClick={() => deleteTimeBlock(matchingBlock.id)}
                          className="text-[11px] text-rose-600 hover:underline font-semibold"
                        >
                          차단 해제
                        </button>
                      </div>
                    )}

                    {matchingApts.map((apt) => {
                      if (!isStartSlot(apt)) return null;
                      const badge = getStatusBadgeInfo(apt.status);

                      return (
                        <div
                          key={apt.id}
                          className={`rounded-2xl p-3 sm:p-4 border shadow-sm transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                            apt.status === 'confirmed'
                              ? 'bg-emerald-50/80 border-emerald-300'
                              : apt.status === 'pending'
                              ? 'bg-amber-50/80 border-amber-300 ring-2 ring-amber-400/40 animate-pulse'
                              : apt.status === 'completed'
                              ? 'bg-blue-50/70 border-blue-200'
                              : 'bg-stone-100 border-stone-300'
                          }`}
                        >
                          {/* Info */}
                          <div className="flex items-start sm:items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-brand-900 text-gold-300 flex items-center justify-center font-bold text-xs flex-shrink-0 font-serif-kr">
                              {apt.customerName.slice(0, 1)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-bold text-stone-900 text-sm">
                                  {apt.customerName}
                                </span>
                                <span className="text-xs font-mono text-stone-500">
                                  {apt.customerPhone}
                                </span>
                                {apt.isFirstVisit && (
                                  <span className="text-[10px] px-1.5 py-0.2 bg-blue-100 text-blue-700 rounded font-bold">
                                    신규
                                  </span>
                                )}
                                <span
                                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${badge.bg} ${badge.text} ${badge.border}`}
                                >
                                  {badge.label}
                                </span>
                              </div>

                              <div className="flex items-center gap-2 mt-1 text-xs text-stone-600">
                                <span className="font-bold text-brand-900">{apt.serviceName}</span>
                                <span className="text-stone-400">•</span>
                                <span>{apt.durationMinutes}분 소요</span>
                                <span className="text-stone-400">•</span>
                                <span className="font-mono font-bold text-stone-900">
                                  {formatCurrency(apt.price)}
                                </span>
                              </div>

                              {apt.notes && (
                                <p className="text-[11px] text-stone-500 mt-1 bg-white/70 px-2 py-1 rounded-lg border border-stone-200/60 inline-block">
                                  메모: {apt.notes}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Quick Status Change Actions */}
                          <div className="flex items-center gap-1.5 flex-wrap justify-end">
                            {apt.status === 'pending' && (
                              <button
                                onClick={() => updateAppointmentStatus(apt.id, 'confirmed')}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>예약 승인</span>
                              </button>
                            )}

                            {apt.status === 'confirmed' && (
                              <>
                                <button
                                  onClick={() => openSmsModal(apt)}
                                  className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1"
                                  title="고객에게 확정 문자 다시 발송"
                                >
                                  <MessageSquare className="w-3.5 h-3.5" />
                                  <span>문자 안내</span>
                                </button>
                                <button
                                  onClick={() => updateAppointmentStatus(apt.id, 'completed')}
                                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>시술 완료</span>
                                </button>
                              </>
                            )}

                            {apt.status !== 'completed' && apt.status !== 'cancelled' && (
                              <button
                                onClick={() => updateAppointmentStatus(apt.id, 'noshow')}
                                className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-semibold transition-colors"
                              >
                                노쇼
                              </button>
                            )}

                            <button
                              onClick={() => setSelectedAppointment(apt)}
                              className="px-2.5 py-1.5 bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 rounded-xl text-xs font-semibold transition-colors"
                            >
                              상세보기
                            </button>

                            <button
                              onClick={() => {
                                if (window.confirm(`'${apt.customerName}'님의 예약을 삭제하시겠습니까?`)) {
                                  deleteAppointment(apt.id);
                                }
                              }}
                              className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1"
                              title="예약 삭제"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>삭제</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}

                    {matchingApts.length === 0 && !matchingBlock && isOutsideBusiness && (
                      <span className="text-[11px] text-stone-400 pl-2">
                        {dayClosed.isClosed ? '정기 휴무' : '영업 외 시간'}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. WEEKLY VIEW */}
      {calendarView === 'weekly' && (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-4 sm:p-6">
          <h3 className="text-base font-bold text-stone-900 font-serif-kr mb-4">
            주간 일정 한눈에 보기
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
            {getWeekDates(new Date(selectedDate)).map((wDate) => {
              const isSelected = selectedDate === wDate;
              const wApts = appointments.filter((a) => a.date === wDate && a.status !== 'cancelled');
              const wClosed = isDateClosed(wDate, shopConfig);

              return (
                <div
                  key={wDate}
                  onClick={() => {
                    setSelectedDate(wDate);
                    setCalendarView('daily');
                  }}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer min-h-[150px] flex flex-col justify-between group ${
                    isSelected
                      ? 'border-brand-900 bg-brand-50/60 ring-2 ring-brand-800 shadow-md'
                      : 'border-stone-200 bg-stone-50/50 hover:bg-white hover:border-brand-300 hover:shadow-sm'
                  }`}
                  title={`${formatKoreanDate(wDate)} 일간 일정표로 이동`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-stone-800">
                        {formatKoreanDate(wDate).split(' ')[1]} {formatKoreanDate(wDate).split(' ')[2]}
                      </span>
                      {wClosed.isClosed ? (
                        <span className="text-[10px] text-rose-500 font-bold px-1.5 py-0.2 rounded bg-rose-50 border border-rose-200">
                          휴무
                        </span>
                      ) : wApts.length > 0 ? (
                        <span className="text-[10px] text-brand-900 font-bold px-1.5 py-0.5 rounded bg-brand-100 border border-brand-200">
                          {wApts.length}건
                        </span>
                      ) : (
                        <span className="text-[10px] text-stone-400">예약 없음</span>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      {wApts.slice(0, 3).map((a) => (
                        <div
                          key={a.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedAppointment(a);
                          }}
                          className="p-1.5 rounded-lg bg-white border border-stone-200 text-[11px] font-semibold text-stone-800 truncate hover:border-brand-400 transition-colors"
                          title="예약 상세 보기"
                        >
                          <span className="font-mono text-brand-900 font-bold">{a.time}</span>{' '}
                          <span className="truncate">{a.customerName}</span>
                        </div>
                      ))}
                      {wApts.length > 3 && (
                        <div className="text-[10px] text-stone-500 font-semibold pl-1">
                          +{wApts.length - 3}건 더보기
                        </div>
                      )}
                      {wApts.length === 0 && (
                        <div className="text-[11px] text-stone-400 italic text-center py-4">
                          예약 없음
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedDate(wDate);
                      setCalendarView('daily');
                    }}
                    className="w-full mt-2 py-1 bg-stone-100 group-hover:bg-brand-900 text-stone-600 group-hover:text-gold-300 rounded-lg text-[10px] font-semibold transition-all flex items-center justify-center gap-1 cursor-pointer border border-stone-200/70 group-hover:border-brand-900"
                  >
                    <span>일정 보기</span>
                    <span className="text-[9px]">→</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. MONTHLY VIEW */}
      {calendarView === 'monthly' && (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-4 sm:p-6 space-y-4">
          {/* Monthly Header & Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-stone-200">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleMonthShift(-1)}
                className="p-2 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-700 transition-colors"
                title="이전 달"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <h3 className="font-serif-kr font-extrabold text-lg sm:text-xl text-brand-900">
                {selectedDate.split('-')[0]}년 {parseInt(selectedDate.split('-')[1], 10)}월
              </h3>
              <button
                onClick={() => handleMonthShift(1)}
                className="p-2 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-700 transition-colors"
                title="다음 달"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={handleSetToday}
                className="ml-2 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-colors"
              >
                오늘 달로 이동
              </button>
            </div>

            {/* Monthly Summary Stats */}
            {(() => {
              const currentMonthKey = selectedDate.slice(0, 7);
              const mAppointments = appointments.filter(
                (a) => a.date.startsWith(currentMonthKey) && a.status !== 'cancelled'
              );
              const mCompletedSales = mAppointments
                .filter((a) => a.status === 'completed')
                .reduce((sum, a) => sum + a.price, 0);

              return (
                <div className="flex items-center gap-3 text-xs">
                  <span className="px-3 py-1.5 rounded-xl bg-brand-50 text-brand-900 border border-brand-200 font-bold">
                    월간 예약: <strong>{mAppointments.length}건</strong>
                  </span>
                  <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold font-mono">
                    완료 매출: {formatCurrency(mCompletedSales)}
                  </span>
                </div>
              );
            })()}
          </div>

          {/* Monthly Weekday Header (일 ~ 토) */}
          <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs py-2 bg-stone-50 rounded-xl border border-stone-200">
            <div className="text-rose-600">일</div>
            <div className="text-stone-700">월</div>
            <div className="text-stone-700">화</div>
            <div className="text-stone-700">수</div>
            <div className="text-stone-700">목</div>
            <div className="text-stone-700">금</div>
            <div className="text-blue-600">토</div>
          </div>

          {/* Monthly 7xN Grid */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {getMonthGrid(selectedDate).map((cell) => {
              const cellApts = appointments.filter(
                (a) => a.date === cell.dateStr && a.status !== 'cancelled'
              );
              const cellBlocks = timeBlocks.filter((b) => b.date === cell.dateStr);
              const cellClosed = isDateClosed(cell.dateStr, shopConfig);
              const isToday = cell.dateStr === getTodayString();
              const isSelected = cell.dateStr === selectedDate;
              const dayOfWeek = cell.dayOfWeek;

              return (
                <div
                  key={cell.dateStr}
                  onClick={() => setSelectedDate(cell.dateStr)}
                  className={`min-h-[105px] sm:min-h-[125px] p-1.5 sm:p-2 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    !cell.isCurrentMonth
                      ? 'opacity-40 bg-stone-50/40 border-stone-200/50'
                      : isSelected
                      ? 'border-brand-900 bg-brand-50/50 ring-2 ring-brand-800 shadow-md'
                      : cellClosed.isClosed
                      ? 'bg-rose-50/20 border-stone-200 hover:border-rose-300'
                      : 'bg-white border-stone-200 hover:border-brand-300 hover:shadow-sm'
                  }`}
                >
                  {/* Top Day Header */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`text-xs font-bold px-1.5 py-0.5 rounded-md flex items-center justify-center ${
                          isToday
                            ? 'bg-gold-400 text-stone-950 font-extrabold shadow-sm'
                            : dayOfWeek === 0
                            ? 'text-rose-600 font-bold'
                            : dayOfWeek === 6
                            ? 'text-blue-600 font-bold'
                            : 'text-stone-700'
                        }`}
                      >
                        {cell.dayNum}일
                      </span>

                      {cellClosed.isClosed ? (
                        <span className="text-[9px] text-rose-500 font-bold px-1 rounded bg-rose-50 border border-rose-200">
                          휴무
                        </span>
                      ) : cellApts.length > 0 ? (
                        <span className="text-[10px] text-brand-900 font-extrabold font-mono px-1.5 py-0.2 rounded bg-brand-100 border border-brand-200">
                          {cellApts.length}건
                        </span>
                      ) : null}
                    </div>

                    {/* Appointments list preview (max 2-3 items) */}
                    <div className="space-y-1 mt-1">
                      {cellApts.slice(0, 2).map((apt) => {
                        const isPending = apt.status === 'pending';
                        const isCompleted = apt.status === 'completed';
                        const isConfirmed = apt.status === 'confirmed';

                        return (
                          <div
                            key={apt.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedAppointment(apt);
                            }}
                            className={`p-1 rounded-lg text-[10px] font-semibold truncate flex items-center gap-1 border transition-all ${
                              isPending
                                ? 'bg-amber-100 text-amber-900 border-amber-300 animate-pulse'
                                : isConfirmed
                                ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                                : isCompleted
                                ? 'bg-blue-50 text-blue-900 border-blue-200'
                                : 'bg-stone-100 text-stone-700 border-stone-200'
                            }`}
                            title={`${apt.time} ${apt.customerName} (${apt.serviceName})`}
                          >
                            <span className="font-mono font-bold text-[9px]">{apt.time}</span>
                            <span className="truncate">{apt.customerName}</span>
                          </div>
                        );
                      })}

                      {cellApts.length > 2 && (
                        <div className="text-[9px] text-stone-500 font-semibold pl-1">
                          +{cellApts.length - 2}건 더보기
                        </div>
                      )}

                      {cellBlocks.length > 0 && (
                        <div className="p-0.5 rounded bg-stone-100 text-stone-500 text-[9px] truncate text-center border border-stone-200">
                          🚫 일정 차단
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bottom Day Quick Action */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedDate(cell.dateStr);
                      setCalendarView('daily');
                    }}
                    className="w-full mt-1.5 py-0.5 bg-stone-100/80 hover:bg-brand-900 hover:text-white rounded text-[9px] font-bold text-stone-600 transition-colors opacity-80 hover:opacity-100"
                  >
                    일정 보기
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4.5. LIST VIEW */}
      {calendarView === 'list' && renderListView()}

      {/* 5. MODAL: DIRECT APPOINTMENT ADD */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-stone-200">
            <div className="bg-brand-900 text-white p-5 flex items-center justify-between">
              <h3 className="font-serif-kr font-bold text-lg text-gold-300">
                원장님 직접 예약 등록
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-stone-300 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDirectBooking} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  고객 성함 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="홍길동"
                  value={newCustName}
                  onChange={(e) => setNewCustName(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-brand-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  휴대폰 번호 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="010-0000-0000"
                  value={newCustPhone}
                  onChange={(e) => setNewCustPhone(formatPhoneNumber(e.target.value))}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm font-mono focus:ring-2 focus:ring-brand-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    예약 날짜 <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    예약 시간 <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="time"
                    required
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  시술 프로그램 <span className="text-rose-500">*</span>
                </label>
                <select
                  value={newServiceId}
                  onChange={(e) => setNewServiceId(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-brand-800"
                >
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      [{s.category}] {s.name} - {formatCurrency(s.price)} ({s.durationMinutes}분)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  시술 메모 / 요청사항
                </label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="예: 전화로 리터치 예약 접수됨"
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl text-xs focus:ring-2 focus:ring-brand-800"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-brand-900 hover:bg-brand-800 text-gold-300 font-bold rounded-xl text-xs shadow-md"
                >
                  등록 완료
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. MODAL: TIMEBLOCK ADD */}
      {isBlockModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-stone-200">
            <div className="bg-stone-900 text-white p-5 flex items-center justify-between">
              <h3 className="font-serif-kr font-bold text-base">예약 차단 시간 설정</h3>
              <button
                onClick={() => setIsBlockModalOpen(false)}
                className="text-stone-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBlock} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">차단 날짜</label>
                <input
                  type="date"
                  required
                  value={blockDate}
                  onChange={(e) => setBlockDate(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">시작 시간</label>
                  <input
                    type="time"
                    required
                    value={blockStart}
                    onChange={(e) => setBlockStart(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">종료 시간</label>
                  <input
                    type="time"
                    required
                    value={blockEnd}
                    onChange={(e) => setBlockEnd(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">차단 사유</label>
                <select
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm"
                >
                  <option value="점심 및 휴식 시간">점심 및 휴식 시간</option>
                  <option value="원장님 개인 일정">원장님 개인 일정</option>
                  <option value="재료 입고 및 샵 소독">재료 입고 및 샵 소독</option>
                  <option value="교육 및 세미나 참석">교육 및 세미나 참석</option>
                  <option value="임시 마감">임시 마감</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsBlockModalOpen(false)}
                  className="flex-1 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-xl text-xs shadow-md"
                >
                  차단 설정
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. MODAL: APPOINTMENT DETAIL */}
      {selectedAppointment && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-stone-200">
            <div className="bg-brand-900 text-white p-5 flex items-center justify-between">
              <h3 className="font-serif-kr font-bold text-lg text-gold-300">
                예약 상세 정보 & 상태 변경
              </h3>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="text-stone-300 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-stone-500">예약자:</span>
                  <span className="font-bold text-stone-900 text-sm">
                    {selectedAppointment.customerName} ({selectedAppointment.customerPhone})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">시술명:</span>
                  <span className="font-bold text-brand-900 text-sm">
                    {selectedAppointment.serviceName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">일시:</span>
                  <span className="font-bold text-stone-900">
                    {formatKoreanDate(selectedAppointment.date)} {selectedAppointment.time} ({selectedAppointment.durationMinutes}분)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">결제 금액:</span>
                  <span className="font-extrabold font-mono text-brand-900 text-sm">
                    {formatCurrency(selectedAppointment.price)}
                  </span>
                </div>
                {selectedAppointment.notes && (
                  <div className="pt-2 border-t border-stone-200">
                    <span className="text-stone-500">고객 메모:</span>
                    <p className="font-medium text-stone-800 mt-0.5">{selectedAppointment.notes}</p>
                  </div>
                )}
              </div>

              {/* Status Change Buttons */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-2">
                  상태 변경
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['pending', 'confirmed', 'completed', 'noshow', 'cancelled'] as AppointmentStatus[]).map(
                    (st) => {
                      const isCurrent = selectedAppointment.status === st;
                      const badge = getStatusBadgeInfo(st);
                      return (
                        <button
                          key={st}
                          onClick={() => {
                            updateAppointmentStatus(selectedAppointment.id, st);
                            setSelectedAppointment({
                              ...selectedAppointment,
                              status: st,
                            });
                          }}
                          className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all ${
                            isCurrent
                              ? `${badge.bg} ${badge.text} ${badge.border} ring-2 ring-brand-800`
                              : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                          }`}
                        >
                          {badge.label}
                        </button>
                      );
                    }
                  )}
                </div>
              </div>

              {/* Danger Zone: Delete */}
              <div className="pt-3 border-t border-stone-100 flex justify-between items-center">
                <button
                  onClick={() => {
                    if (window.confirm('이 예약을 완전히 삭제하시겠습니까?')) {
                      deleteAppointment(selectedAppointment.id);
                      setSelectedAppointment(null);
                    }
                  }}
                  className="text-xs text-rose-600 hover:underline font-semibold"
                >
                  예약 내역 완전 삭제
                </button>
                <button
                  onClick={() => setSelectedAppointment(null)}
                  className="px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-bold"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
