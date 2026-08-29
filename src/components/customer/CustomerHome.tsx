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
    <div className="min-h-screen bg-stone-100/60 pb-20">
      {/* 1. HERO SECTION: Vintage Emerald Business Card Replica */}
      <section className="bg-gradient-to-b from-brand-900 via-brand-900 to-brand-950 text-white pt-10 pb-16 px-4 relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-brand-700/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-24 w-96 h-96 bg-gold-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto">
          {/* Main Luxury Business Card Banner */}
          <div className="relative mx-auto max-w-3xl rounded-3xl p-6 sm:p-10 border-2 border-gold-300/60 shadow-2xl bg-gradient-to-br from-brand-900 to-brand-950 backdrop-blur-md">
            {/* Ornamental Inner Border */}
            <div className="absolute inset-2 border border-gold-400/25 rounded-2xl pointer-events-none" />

            {/* Business Card Header Title */}
            <div className="text-center mb-8 relative z-10">
              <div className="inline-block px-8 py-3 rounded-2xl border-2 border-white/80 shadow-sm bg-brand-950/40 backdrop-blur">
                <h1 className="text-2xl sm:text-4xl font-extrabold font-serif-kr tracking-widest text-white">
                  눈 썹 <span className="text-gold-300 font-normal">:</span> 미{' '}
                  <span className="text-gold-300 font-serif-kr font-bold text-3xl sm:text-5xl ml-1">眉</span>
                </h1>
                <p className="text-xs sm:text-sm font-mono tracking-widest text-gold-300 mt-1 font-semibold">
                  {shopConfig.subtitle}
                </p>
              </div>
            </div>

            {/* Business Card Two-Column Content (Exact copy of image) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center border-t border-brand-800/80 pt-6 relative z-10">
              {/* Left Column: Operating Hours */}
              <div className="space-y-4 text-center md:text-left md:border-r md:border-brand-800/80 md:pr-6">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-wider flex items-center justify-center md:justify-start gap-2">
                    <Clock className="w-5 h-5 text-gold-400" />
                    <span>영 업 시 간</span>
                  </h3>
                </div>

                <div className="space-y-2 text-sm sm:text-base font-medium text-stone-200">
                  <div className="flex items-center justify-between sm:justify-start sm:gap-6 bg-brand-950/50 p-2.5 rounded-xl border border-brand-800">
                    <span className="font-bold text-gold-300">월 - 목</span>
                    <span className="font-mono">AM 10시 ~ PM 7시</span>
                  </div>
                  <div className="flex items-center justify-between sm:justify-start sm:gap-6 bg-brand-950/50 p-2.5 rounded-xl border border-brand-800">
                    <span className="font-bold text-gold-300">금 - 토</span>
                    <span className="font-mono">AM 10시 ~ PM 9시</span>
                  </div>
                </div>

                <div className="text-center md:text-left">
                  <span className="inline-block text-gold-400 font-bold text-xs sm:text-sm tracking-widest">
                    * 일요일 휴무 *
                  </span>
                </div>

                <div className="pt-2">
                  <a
                    href={`tel:${shopConfig.phone}`}
                    className="inline-flex items-center gap-2 text-lg sm:text-2xl font-extrabold font-mono tracking-wider text-white hover:text-gold-300 transition-colors"
                  >
                    <Phone className="w-5 h-5 text-gold-400" />
                    <span>{shopConfig.phone}</span>
                  </a>
                </div>
              </div>

              {/* Right Column: Menu Items & Notices */}
              <div className="space-y-4 text-center md:text-left">
                <div className="grid grid-cols-2 gap-3 text-sm sm:text-base font-bold text-stone-100">
                  <div className="flex items-center justify-center md:justify-start gap-2 p-2 rounded-lg bg-brand-950/40 border border-brand-800/60">
                    <span className="text-gold-400">✦</span>
                    <span>여자눈썹</span>
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-2 p-2 rounded-lg bg-brand-950/40 border border-brand-800/60">
                    <span className="text-gold-400">✦</span>
                    <span>남자눈썹</span>
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-2 p-2 rounded-lg bg-brand-950/40 border border-brand-800/60">
                    <span className="text-gold-400">✦</span>
                    <span>아이라인</span>
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-2 p-2 rounded-lg bg-brand-950/40 border border-brand-800/60">
                    <span className="text-gold-400">✦</span>
                    <span>입술</span>
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-2 p-2 rounded-lg bg-brand-950/40 border border-brand-800/60">
                    <span className="text-gold-400">✦</span>
                    <span>미인점</span>
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-2 p-2 rounded-lg bg-brand-950/40 border border-brand-800/60">
                    <span className="text-gold-400">✦</span>
                    <span>속눈썹 연장/펌</span>
                  </div>
                </div>

                <div className="pt-2 text-gold-400 font-bold text-xs sm:text-sm tracking-wider space-y-1">
                  <p>* 100% 예약제 운영 중입니다 *</p>
                  <p className="text-stone-300 font-normal text-xs">* 부재 시 문자 남겨주세요 *</p>
                </div>
              </div>
            </div>

            {/* Quick Action CTA Buttons */}
            <div className="mt-8 pt-6 border-t border-brand-800 flex flex-col sm:flex-row gap-3 justify-center relative z-10">
              <button
                onClick={() => handleOpenBooking()}
                className="px-8 py-4 bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500 hover:from-gold-400 hover:to-gold-300 text-stone-950 font-extrabold rounded-2xl text-sm sm:text-base shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5 text-stone-900" />
                <span>실시간 간편 예약하기</span>
              </button>

              <button
                onClick={() => setIsLookupOpen(true)}
                className="px-6 py-4 bg-brand-950/80 hover:bg-brand-950 text-stone-200 hover:text-white font-bold rounded-2xl text-sm border border-gold-400/40 hover:border-gold-300 transition-all flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4 text-gold-400" />
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
            <div className="flex flex-wrap gap-1.5 p-1.5 bg-stone-100 rounded-2xl">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedCategory === cat
                      ? 'bg-brand-900 text-gold-300 shadow-sm'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
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
