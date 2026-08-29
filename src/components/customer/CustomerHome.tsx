import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ServiceCategory, ServiceItem } from '../../types';
import { ServiceCard } from './ServiceCard';
import { BookingModal } from './BookingModal';
import { MyBookingLookupModal } from './MyBookingLookupModal';
import {
  Sparkles,
  Clock,
  Phone,
  ShieldCheck,
  Search,
  Heart,
  HelpCircle,
} from 'lucide-react';

export const CustomerHome: React.FC = () => {
  const { services, shopConfig } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | '전체'>('전체');
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingService, setBookingService] = useState<ServiceItem | null>(null);
  const [isLookupOpen, setIsLookupOpen] = useState(false);

  const categories: (ServiceCategory | '전체')[] = [
    '전체',
    '눈썹',
    '아이라인',
    '입술',
    '미인점',
    '속눈썹',
  ];

  const filteredServices =
    selectedCategory === '전체'
      ? services
      : services.filter((s) => s.category === selectedCategory);

  const handleOpenBooking = (service?: ServiceItem) => {
    setBookingService(service || null);
    setIsBookingOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#faf7f2] pb-20">
      {/* 1. HERO SECTION: Exact Replica of the new LASH&BROW Brand Design */}
      <section className="pt-6 pb-12 px-4 relative overflow-hidden bg-gradient-to-b from-[#FAF4EC] via-[#FAF6F0] to-[#FAF7F2]">
        <div className="max-w-3xl mx-auto">
          {/* Main Brand Card */}
          <div className="relative rounded-3xl p-6 sm:p-12 border-2 border-[#E5D7C7] shadow-xl bg-[#FFFDF9]/95 backdrop-blur-sm">
            
            {/* 1) Main Brand Logo Box */}
            <div className="text-center mb-8">
              <div className="inline-block px-10 py-5 border-2 border-[#543D2B] bg-[#FFFDF9] shadow-sm rounded-sm">
                <h1 className="text-3xl sm:text-5xl font-bold font-dodum tracking-widest text-[#3E2C1E]">
                  눈썹 <span className="font-normal">:</span> 미<span className="ml-1 font-serif-kr">眉</span>
                </h1>
                <div className="w-12 h-0.5 bg-[#543D2B] mx-auto my-2 opacity-60" />
                <p className="text-xs sm:text-sm font-mono tracking-[0.35em] text-[#6E5341] font-bold uppercase">
                  LASH & BROW
                </p>
              </div>
            </div>

            {/* Dashed Separator 1 */}
            <div className="my-6 border-b-2 border-dashed border-[#D9C4AD] opacity-70" />

            {/* 2) Open / Closed Status & Operating Hours */}
            <div className="space-y-4 max-w-lg mx-auto">
              {/* Header Badges */}
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="py-1.5 px-4 bg-[#DF9A8C] text-white rounded-md text-xs sm:text-sm font-bold tracking-widest shadow-sm">
                  O P E N
                </div>
                <div className="py-1.5 px-4 bg-[#BEB2B3] text-white rounded-md text-xs sm:text-sm font-bold tracking-widest shadow-sm">
                  C L O S E D
                </div>
              </div>

              {/* Hours Rows */}
              <div className="space-y-2.5 pt-2 text-sm sm:text-base font-semibold text-[#4A3728]">
                <div className="flex items-center justify-between px-2 sm:px-6">
                  <span className="font-bold text-[#3E2C1E]">월 - 목</span>
                  <span className="font-mono text-[#543D2B]">{shopConfig.weekdayHours?.start || '10:30'}</span>
                  <span className="font-mono text-[#543D2B]">{shopConfig.weekdayHours?.end || '19:00'}</span>
                </div>
                <div className="flex items-center justify-between px-2 sm:px-6">
                  <span className="font-bold text-[#3E2C1E]">금 - 토</span>
                  <span className="font-mono text-[#543D2B]">{shopConfig.weekendHours?.start || '10:30'}</span>
                  <span className="font-mono text-[#543D2B]">{shopConfig.weekendHours?.end || '21:00'}</span>
                </div>
                <div className="text-right pr-2 sm:pr-6 pt-1">
                  <span className="text-xs sm:text-sm font-bold text-[#DF9A8C] tracking-wide">
                    {shopConfig.closedDays && shopConfig.closedDays.length > 0
                      ? `${shopConfig.closedDays.map(d => ['일','월','화','수','목','금','토'][d]).join(', ')}요일은 쉬어요:)`
                      : '휴무일 없음:)'}
                  </span>
                </div>
              </div>
            </div>

            {/* Dashed Separator 2 */}
            <div className="my-6 border-b-2 border-dashed border-[#D9C4AD] opacity-70" />

            {/* 3) Service Offerings Overview */}
            <div className="text-center space-y-2 text-sm sm:text-base font-bold text-[#4A3728]">
              <p className="tracking-wide">
                속눈썹 연장 <span className="text-[#D9C4AD] mx-1">/</span> LED 연장 <span className="text-[#D9C4AD] mx-1">/</span> 펌
              </p>
              <p className="tracking-wide">
                여자눈썹 <span className="text-[#D9C4AD] mx-1">/</span> 남자눈썹 <span className="text-[#D9C4AD] mx-1">/</span> 입술 <span className="text-[#D9C4AD] mx-1">/</span> 아이라인 <span className="text-[#D9C4AD] mx-1">/</span> 미인점
              </p>
            </div>

            {/* 4) Phone Number */}
            <div className="text-center my-6">
              <a
                href={`tel:${shopConfig.phone}`}
                className="inline-block text-2xl sm:text-4xl font-extrabold font-mono tracking-wider text-[#3E2C1E] hover:text-[#DF9A8C] transition-colors"
              >
                {shopConfig.phone}
              </a>
            </div>

            {/* 5) Notice Footer */}
            <div className="text-center mb-8">
              <p className="text-xs sm:text-sm font-semibold text-[#DF9A8C] tracking-tight">
                100% 예약제 운영중 입니다. 부재 시 문자 남겨주세요 :)
              </p>
            </div>

            {/* 6) Quick Action CTA Buttons */}
            <div className="pt-4 border-t border-[#EBDCD0] flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => handleOpenBooking()}
                className="px-8 py-4 bg-[#DF9A8C] hover:bg-[#D18475] text-white font-extrabold rounded-2xl text-sm sm:text-base shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5 text-white" />
                <span>실시간 간편 예약하기</span>
              </button>

              <button
                onClick={() => setIsLookupOpen(true)}
                className="px-6 py-4 bg-white hover:bg-[#FAF5EE] text-[#4A3728] hover:text-[#3E2C1E] font-bold rounded-2xl text-sm border-2 border-[#D9C4AD] hover:border-[#DF9A8C] transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <Search className="w-4 h-4 text-[#DF9A8C]" />
                <span>내 예약 확인 / 취소</span>
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* 2. SERVICES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-stone-200/80">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-brand-900 font-bold text-xs uppercase tracking-widest mb-1">
                <Sparkles className="w-4 h-4 text-gold-500" />
                <span>TREATMENT MENU</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-serif-kr">
                눈썹 : 미 시술 프로그램
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 mt-1">
                개개인의 골격과 이목구비 비율에 맞춘 1:1 프리미엄 맞춤 디자인 시술을 제공합니다.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1.5 p-1.5 bg-[#f4ece1] rounded-2xl border border-[#ebdcd0]">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedCategory === cat
                      ? 'bg-brand-900 text-gold-300 shadow-sm'
                      : 'text-stone-700 hover:text-brand-900 hover:bg-[#eadecc]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Service Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onBook={(srv) => handleOpenBooking(srv)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 3. STUDIO FEATURES & COMMITMENT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-900 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-sm">1회용 멸균 니들 철저 사용</h3>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                모든 시술 기구는 철저한 고압 멸균 소독 및 FDA/식약처 인증 안전 정품 색소만을 사용합니다.
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gold-50 text-gold-700 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-sm">1:1 맞춤 골격 디자인</h3>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                공장형 시술이 아닌 고객님의 얼굴형, 근육 움직임, 피부 톤에 가장 조화로운 디자인을 제안합니다.
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-900 flex items-center justify-center flex-shrink-0">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-sm">무통 케어 & 편안한 시술</h3>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                2단계 통증 완화 케어로 시술 중 통증을 최소화하여 편안하게 주무실 수 있을 만큼 아프지 않습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PRE/POST TREATMENT FAQ GUIDE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm">
          <div className="flex items-center gap-2 text-brand-900 font-bold text-xs uppercase tracking-widest mb-1">
            <HelpCircle className="w-4 h-4 text-gold-500" />
            <span>GUIDE & NOTICE</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-serif-kr mb-6">
            시술 전·후 주의사항 & 이용 안내
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm text-stone-600">
            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
              <h4 className="font-bold text-stone-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-brand-900 text-white flex items-center justify-center text-[10px] font-bold">1</span>
                시술 전 안내사항
              </h4>
              <ul className="space-y-1.5 text-stone-600 list-disc list-inside leading-relaxed text-xs">
                <li>시술 전날 과도한 음주나 수면 부족은 피해주세요.</li>
                <li>원하시는 특정 디자인(사진 등)이 있으시면 캡처해 오시면 좋습니다.</li>
                <li>기존 반영구 잔흔(붉은기/푸른기)이 있으신 경우 미리 메모 남겨주세요.</li>
                <li>임신 중이거나 켈로이드 피부염이 심하신 경우 상담이 필요합니다.</li>
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
              <h4 className="font-bold text-stone-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-gold-500 text-white flex items-center justify-center text-[10px] font-bold">2</span>
                시술 후 관리 및 리터치 안내
              </h4>
              <ul className="space-y-1.5 text-stone-600 list-disc list-inside leading-relaxed text-xs">
                <li>시술 당일 및 24시간 동안은 시술 부위에 물이 닿지 않도록 주의하세요.</li>
                <li>탈각 과정에서 생기는 각질은 억지로 뜯지 마시고 자연스럽게 떨어지도록 두세요.</li>
                <li>사우나, 수영, 격한 유산소 운동은 1주일간 피해주시기 바랍니다.</li>
                <li>리터치는 피부 재생 주기(4주~6주 후)에 받으시는 것이 가장 이상적입니다.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 5. LOCATION & FOOTER */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="bg-brand-950 text-stone-300 rounded-3xl p-6 sm:p-10 border border-brand-800 text-xs sm:text-sm space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-brand-800 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif-kr text-xl font-bold text-white">눈썹 : 미 眉</span>
                <span className="font-mono text-gold-400">{shopConfig.instagram}</span>
              </div>
              <p className="text-stone-400 text-xs mt-1">{shopConfig.address}</p>
            </div>
            <div className="flex items-center gap-4">
              <a
                href={`tel:${shopConfig.phone}`}
                className="px-4 py-2 rounded-xl bg-brand-900 hover:bg-brand-800 text-gold-300 text-xs font-bold border border-gold-400/30 flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{shopConfig.phone}</span>
              </a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-stone-500 text-[11px]">
            <span>© 2026 눈썹:미 (nunssup_me). All rights reserved. 100% 예약제 운영</span>
            <span>디자인 및 운영 시스템 v1.0</span>
          </div>
        </div>
      </footer>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialService={bookingService}
        onSuccessLookup={() => setIsLookupOpen(true)}
      />

      {/* My Bookings Lookup Modal */}
      <MyBookingLookupModal
        isOpen={isLookupOpen}
        onClose={() => setIsLookupOpen(false)}
      />
    </div>
  );
};
