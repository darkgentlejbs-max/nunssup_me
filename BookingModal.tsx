import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ServiceItem } from '../../types';
import {
  getAvailableTimeSlots,
  isDateClosed,
  formatKoreanDate,
  getHoursForDate,
} from '../../utils/dateUtils';
import { formatCurrency, formatPhoneNumber } from '../../utils/formatters';
import {
  X,
  Calendar,
  Clock,
  User,
  Phone,
  FileText,
  CheckCircle,
  Sparkles,
  ChevronRight,
  AlertCircle,
  ArrowLeft,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialService?: ServiceItem | null;
  onSuccessLookup?: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  initialService,
  onSuccessLookup,
}) => {
  const { services, appointments, timeBlocks, shopConfig, createAppointment, customers, showToast } = useApp();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');

  // Customer Input Fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  const [notes, setNotes] = useState('');
  const [agreeDeposit, setAgreeDeposit] = useState(true);

  // Confirmed Appointment Ticket State
  const [confirmedApt, setConfirmedApt] = useState<any>(null);

  // Initialize service & date
  useEffect(() => {
    if (initialService) {
      setSelectedService(initialService);
      setStep(2);
    } else if (services.length > 0) {
      setSelectedService(services[0]);
    }

    // Default to tomorrow or next business day
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setSelectedDate(tomorrow.toISOString().split('T')[0]);
  }, [initialService, services]);

  if (!isOpen) return null;

  // Generate 14 selectable upcoming dates
  const upcomingDates: { dateStr: string; dayName: string; dayNum: number; isClosed: boolean }[] = [];
  const baseDate = new Date();
  const dayNamesKr = ['일', '월', '화', '수', '목', '금', '토'];

  for (let i = 0; i < 14; i++) {
    const d = new Date(baseDate);
    d.setDate(baseDate.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const closed = isDateClosed(dateStr, shopConfig);
    upcomingDates.push({
      dateStr,
      dayName: dayNamesKr[d.getDay()],
      dayNum: d.getDate(),
      isClosed: closed.isClosed,
    });
  }

  // Calculate available time slots for selected date & service duration
  const duration = selectedService?.durationMinutes || 60;
  const availableSlots = selectedDate
    ? getAvailableTimeSlots(selectedDate, duration, appointments, timeBlocks, shopConfig)
    : [];

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhoneNumber(e.target.value));
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !selectedDate || !selectedTime || !name.trim() || !phone.trim()) {
      return;
    }

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const existingCustomer = customers.find(c => c.phone.replace(/[^0-9]/g, '') === cleanPhone);
    if (existingCustomer?.isBlacklisted) {
      showToast('예약 제한', '현재 온라인 예약이 제한된 연락처입니다. 매장으로 직접 문의해주세요.', 'error');
      return;
    }

    const res = createAppointment({
      customerName: name.trim(),
      customerPhone: phone.trim(),
      serviceId: selectedService.id,
      date: selectedDate,
      time: selectedTime,
      notes: notes.trim(),
      isFirstVisit,
    });

    if (res.success && res.appointment) {
      setConfirmedApt(res.appointment);
      setStep(4);
      // Trigger confetti celebration!
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0e3d37', '#d4af4a', '#3e8f83', '#f5eed3'],
      });
    }
  };

  const handleResetAndClose = () => {
    setStep(1);
    setSelectedService(services[0] || null);
    setSelectedTime('');
    setName('');
    setPhone('');
    setNotes('');
    setConfirmedApt(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden border border-stone-200 transition-all">
        {/* Modal Top Header */}
        <div className="bg-brand-900 text-white p-6 relative">
          <button
            onClick={handleResetAndClose}
            className="absolute top-5 right-5 text-stone-300 hover:text-white p-1 rounded-full hover:bg-brand-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-gold-300 text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>눈썹 : 미 眉 100% 실시간 예약</span>
          </div>

          <h2 className="text-xl font-bold font-serif-kr">
            {step === 1 && '1. 시술 프로그램 선택'}
            {step === 2 && '2. 예약 희망 날짜 & 시간 선택'}
            {step === 3 && '3. 예약자 정보 입력'}
            {step === 4 && '✨ 예약 접수 완료'}
          </h2>

          {/* Stepper Dots */}
          {step < 4 && (
            <div className="flex items-center gap-2 mt-4">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    s === step
                      ? 'w-8 bg-gold-400'
                      : s < step
                      ? 'w-3 bg-brand-500'
                      : 'w-3 bg-brand-800'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Modal Body Content */}
        <div className="p-6">
          {/* STEP 1: SERVICE SELECTION */}
          {step === 1 && (
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              <p className="text-xs text-stone-500 mb-2">
                원하시는 맞춤 시술 항목을 선택해 주세요.
              </p>
              {services.map((srv) => {
                const isSelected = selectedService?.id === srv.id;
                return (
                  <div
                    key={srv.id}
                    onClick={() => setSelectedService(srv)}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'border-brand-800 bg-brand-50/50 shadow-sm'
                        : 'border-stone-200 hover:border-brand-300 bg-white'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-brand-100 text-brand-800">
                          {srv.category}
                        </span>
                        <h4 className="font-bold text-stone-900 text-sm">{srv.name}</h4>
                      </div>
                      <p className="text-xs text-stone-500 mt-1 line-clamp-1">
                        {srv.description}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-xs">
                        <span className="font-bold text-brand-900 font-mono">
                          {formatCurrency(srv.price)}
                        </span>
                        <span className="text-stone-400">|</span>
                        <span className="text-stone-500">소요 시간 {srv.durationMinutes}분</span>
                      </div>
                    </div>

                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                        isSelected
                          ? 'bg-brand-900 border-brand-900 text-white'
                          : 'border-stone-300 bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-4 h-4" />}
                    </div>
                  </div>
                );
              })}

              <div className="pt-4">
                <button
                  onClick={() => setStep(2)}
                  disabled={!selectedService}
                  className="w-full py-3.5 bg-brand-900 hover:bg-brand-800 disabled:opacity-50 text-gold-300 font-bold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <span>날짜 및 시간 선택하기</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: DATE & TIME SELECTION */}
          {step === 2 && selectedService && (
            <div className="space-y-5">
              {/* Selected service pill */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-brand-50 border border-brand-100 text-xs">
                <div>
                  <span className="text-stone-500">선택 시술: </span>
                  <span className="font-bold text-brand-900">{selectedService.name}</span>
                  <span className="text-stone-500 ml-2">({selectedService.durationMinutes}분 소요)</span>
                </div>
                <button
                  onClick={() => setStep(1)}
                  className="text-xs text-brand-700 font-semibold hover:underline"
                >
                  시술 변경
                </button>
              </div>

              {/* 1. Date Picker Strip */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-2 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-brand-800" />
                  <span>방문 날짜 선택</span>
                </label>
                <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                  {upcomingDates.slice(0, 7).map((item) => {
                    const isSelected = selectedDate === item.dateStr;
                    return (
                      <button
                        key={item.dateStr}
                        type="button"
                        disabled={item.isClosed}
                        onClick={() => {
                          setSelectedDate(item.dateStr);
                          setSelectedTime('');
                        }}
                        className={`p-2 rounded-xl text-center flex flex-col items-center justify-center transition-all ${
                          item.isClosed
                            ? 'opacity-35 bg-stone-100 text-stone-400 cursor-not-allowed'
                            : isSelected
                            ? 'bg-brand-900 text-white shadow-md ring-2 ring-gold-400'
                            : 'bg-stone-50 hover:bg-stone-100 text-stone-800 border border-stone-200'
                        }`}
                      >
                        <span
                          className={`text-[10px] font-bold ${
                            item.dayName === '일'
                              ? 'text-rose-500'
                              : item.dayName === '토'
                              ? 'text-blue-500'
                              : ''
                          }`}
                        >
                          {item.dayName}
                        </span>
                        <span className="text-sm font-extrabold mt-0.5">{item.dayNum}</span>
                        {item.isClosed && (
                          <span className="text-[9px] text-rose-500 font-medium scale-90">휴무</span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Second week row */}
                <div className="grid grid-cols-7 gap-1.5 sm:gap-2 mt-2">
                  {upcomingDates.slice(7, 14).map((item) => {
                    const isSelected = selectedDate === item.dateStr;
                    return (
                      <button
                        key={item.dateStr}
                        type="button"
                        disabled={item.isClosed}
                        onClick={() => {
                          setSelectedDate(item.dateStr);
                          setSelectedTime('');
                        }}
                        className={`p-2 rounded-xl text-center flex flex-col items-center justify-center transition-all ${
                          item.isClosed
                            ? 'opacity-35 bg-stone-100 text-stone-400 cursor-not-allowed'
                            : isSelected
                            ? 'bg-brand-900 text-white shadow-md ring-2 ring-gold-400'
                            : 'bg-stone-50 hover:bg-stone-100 text-stone-800 border border-stone-200'
                        }`}
                      >
                        <span
                          className={`text-[10px] font-bold ${
                            item.dayName === '일'
                              ? 'text-rose-500'
                              : item.dayName === '토'
                              ? 'text-blue-500'
                              : ''
                          }`}
                        >
                          {item.dayName}
                        </span>
                        <span className="text-sm font-extrabold mt-0.5">{item.dayNum}</span>
                        {item.isClosed && (
                          <span className="text-[9px] text-rose-500 font-medium scale-90">휴무</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Time Slots Grid */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-brand-800" />
                    <span>
                      {selectedDate ? formatKoreanDate(selectedDate) : '날짜를 선택해 주세요'} 예약 가능 시간
                    </span>
                  </label>
                  {selectedDate && (
                    <span className="text-[11px] text-stone-500 font-mono">
                      영업: {getHoursForDate(selectedDate, shopConfig).start} ~ {getHoursForDate(selectedDate, shopConfig).end}
                    </span>
                  )}
                </div>

                {availableSlots.length === 0 ? (
                  <div className="p-6 text-center bg-stone-50 rounded-2xl border border-stone-200 text-stone-500 text-xs">
                    {isDateClosed(selectedDate, shopConfig).isClosed
                      ? '일요일은 정기 휴무일입니다. 다른 날짜를 선택해 주세요.'
                      : '해당 일자에는 예약 가능한 슬롯이 마감되었습니다.'}
                  </div>
                ) : (
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 max-h-48 overflow-y-auto p-1">
                    {availableSlots.map((slot) => {
                      const isSelected = selectedTime === slot.time;
                      return (
                        <button
                          key={slot.time}
                          type="button"
                          disabled={!slot.available}
                          onClick={() => setSelectedTime(slot.time)}
                          className={`py-2 px-1 rounded-xl text-xs font-mono font-bold transition-all text-center ${
                            !slot.available
                              ? 'bg-stone-100 text-stone-400 border border-stone-200 line-through cursor-not-allowed'
                              : isSelected
                              ? 'bg-gradient-to-r from-brand-900 to-brand-800 text-gold-300 shadow-md ring-2 ring-gold-400 font-extrabold'
                              : 'bg-white hover:bg-brand-50 text-stone-800 border border-stone-200 hover:border-brand-400'
                          }`}
                        >
                          {slot.time}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Bottom navigation */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-3 rounded-xl border border-stone-300 text-stone-600 text-xs font-semibold hover:bg-stone-50"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  disabled={!selectedDate || !selectedTime}
                  onClick={() => setStep(3)}
                  className="flex-1 py-3.5 bg-brand-900 hover:bg-brand-800 disabled:opacity-50 text-gold-300 font-bold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <span>예약자 정보 입력하기</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: CUSTOMER DETAILS */}
          {step === 3 && selectedService && (
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              {/* Summary banner */}
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs space-y-1">
                <div className="flex justify-between text-stone-600">
                  <span>시술 항목:</span>
                  <span className="font-bold text-stone-900">{selectedService.name}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>예약 일시:</span>
                  <span className="font-bold text-brand-900">
                    {formatKoreanDate(selectedDate)} {selectedTime}
                  </span>
                </div>
                <div className="flex justify-between text-stone-600 pt-1 border-t border-stone-200/60">
                  <span>시술 금액:</span>
                  <span className="font-extrabold text-stone-900 font-mono">
                    {formatCurrency(selectedService.price)}
                  </span>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  성함 (예약자명) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="홍길동"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-800"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  연락처 (휴대폰 번호) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    required
                    maxLength={13}
                    placeholder="010-0000-0000"
                    value={phone}
                    onChange={handlePhoneChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-300 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-800"
                  />
                </div>
              </div>

              {/* First visit toggle */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  방문 유형
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setIsFirstVisit(true)}
                    className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                      isFirstVisit
                        ? 'bg-brand-900 text-gold-300 border-brand-900'
                        : 'bg-white text-stone-600 border-stone-300'
                    }`}
                  >
                    첫 방문 (신규 고객)
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsFirstVisit(false)}
                    className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                      !isFirstVisit
                        ? 'bg-brand-900 text-gold-300 border-brand-900'
                        : 'bg-white text-stone-600 border-stone-300'
                    }`}
                  >
                    재방문 / 리터치 고객
                  </button>
                </div>
              </div>

              {/* Notes / Tattoos / Allergies */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  요청사항 / 이전 반영구 잔흔 유무 (선택)
                </label>
                <div className="relative">
                  <FileText className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                  <textarea
                    rows={2}
                    placeholder="예: 2년 전 붉은 잔흔이 약간 남아있어요 / 세미아치 스타일 선호합니다"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white border border-stone-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-800"
                  />
                </div>
              </div>

              {/* 100% Booking Rule agreement */}
              <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs text-amber-900 space-y-1.5">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                  <p className="text-[11px] leading-relaxed">
                    <strong>눈썹:미는 100% 1:1 예약제</strong>로 운영됩니다. 원활한 일정 관리를 위해 당일 취소 및 노쇼는 지양해 주시기 바랍니다.
                  </p>
                </div>
                <label className="flex items-center gap-2 pt-1 font-semibold text-[11px] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeDeposit}
                    onChange={(e) => setAgreeDeposit(e.target.checked)}
                    className="rounded text-brand-900 focus:ring-brand-900 w-4 h-4"
                  />
                  <span>예약 유의사항을 확인하였으며 이에 동의합니다.</span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-3 rounded-xl border border-stone-300 text-stone-600 text-xs font-semibold hover:bg-stone-50"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  type="submit"
                  disabled={!agreeDeposit || !name.trim() || !phone.trim()}
                  className="flex-1 py-3.5 bg-[#DF9A8C] hover:bg-[#D18475] disabled:opacity-50 text-white font-bold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>예약 신청 완료하기</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: CONFIRMATION TICKET & VIRTUAL NOTIFICATION */}
          {step === 4 && confirmedApt && (
            <div className="space-y-5 text-center">
              <div className="w-16 h-16 rounded-full bg-[#faeee9] text-[#DF9A8C] flex items-center justify-center mx-auto ring-8 ring-[#fdf7f5] animate-bounce">
                <CheckCircle className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-stone-900">
                  예약 신청이 정상 접수되었습니다!
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  원장님 확인 후 예약 확정 안내가 전달됩니다.
                </p>
              </div>

              {/* Luxury Booking Ticket */}
              <div className="card-frame bg-brand-900 text-white p-5 text-left rounded-2xl shadow-xl space-y-3">
                <div className="flex items-center justify-between border-b border-brand-700/80 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-serif-kr text-base font-bold text-brand-100">눈썹 : 미 眉</span>
                    <span className="text-[10px] text-brand-300 font-mono">RESERVATION TICKET</span>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 bg-[#DF9A8C]/30 text-[#f5dad3] rounded border border-[#DF9A8C]/50 font-bold">
                    대기 중
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-stone-300 text-[11px]">예약자명</span>
                    <p className="font-bold text-white text-sm">{confirmedApt.customerName} 님</p>
                  </div>
                  <div>
                    <span className="text-stone-300 text-[11px]">연락처</span>
                    <p className="font-mono text-stone-200">{confirmedApt.customerPhone}</p>
                  </div>
                  <div>
                    <span className="text-stone-300 text-[11px]">시술 프로그램</span>
                    <p className="font-bold text-brand-200">{confirmedApt.serviceName}</p>
                  </div>
                  <div>
                    <span className="text-stone-300 text-[11px]">시술 시간</span>
                    <p className="text-stone-200">약 {confirmedApt.durationMinutes}분 소요</p>
                  </div>
                  <div className="col-span-2 bg-brand-950/60 p-2.5 rounded-lg border border-brand-800">
                    <span className="text-stone-300 text-[11px]">예약 일시</span>
                    <p className="font-bold text-brand-100 text-sm">
                      {formatKoreanDate(confirmedApt.date)} {confirmedApt.time}
                    </p>
                  </div>
                </div>

                <div className="text-[11px] text-stone-300 border-t border-brand-800 pt-2 flex items-center justify-between">
                  <span>매장 문의: {shopConfig.phone}</span>
                  <span>100% 예약제</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    handleResetAndClose();
                    if (onSuccessLookup) onSuccessLookup();
                  }}
                  className="flex-1 py-3 bg-[#FAF5EE] hover:bg-[#F2EBD9] text-[#3E2C1E] text-xs font-bold rounded-xl transition-all border border-[#D9C4AD]"
                >
                  내 예약 목록 확인하기
                </button>
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="flex-1 py-3 bg-[#3E2C1E] hover:bg-[#DF9A8C] text-white text-xs font-bold rounded-xl transition-all shadow-md"
                >
                  확인 완료
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
