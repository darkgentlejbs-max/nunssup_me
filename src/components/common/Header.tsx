import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useLayoutMode } from '../../App';
import { AdminLoginModal } from '../admin/AdminLoginModal';
import { Sparkles, ShieldCheck, Phone, Clock, LogOut, Lock, RefreshCw, Monitor, Smartphone } from 'lucide-react';
import { getOperatingHoursGroups } from '../../utils/dateUtils';

export const Header: React.FC = () => {
  const {
    viewMode,
    setViewMode,
    shopConfig,
    appointments,
    isAdminAuthenticated,
    logoutAdmin,
    cloudConfig,
    cloudSyncStatus,
    lastSyncedAt,
    syncWithCloud,
  } = useApp();
  const { layoutMode, toggleLayoutMode } = useLayoutMode();

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const pendingCount = appointments.filter((a) => a.status === 'pending').length;

  const handleAdminModeClick = () => {
    if (isAdminAuthenticated) {
      setViewMode('admin');
    } else {
      setIsLoginModalOpen(true);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-brand-900 border-b border-brand-800 text-stone-100 shadow-md">
        {/* Top Banner Notice */}
        <div className="bg-brand-950/80 px-4 py-1.5 text-xs text-gold-300 border-b border-brand-800/60 flex items-center justify-between font-medium">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1 bg-gold-500/20 text-gold-300 px-2 py-0.5 rounded text-[11px] border border-gold-500/30 font-semibold">
                ✦ 100% 예약제 운영
              </span>
              <span className="hidden sm:inline text-stone-300">
                부재 시 문자를 남겨주시면 시술 후 순차적으로 연락드립니다.
              </span>
            </div>
            <div className="flex items-center gap-4 text-stone-300 text-[11px]">
              <a
                href={`tel:${shopConfig.phone}`}
                className="flex items-center gap-1 text-gold-300 hover:text-white transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                {shopConfig.phone}
              </a>
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-800 to-brand-950 border border-brand-500/40 flex items-center justify-center shadow-inner">
              <span className="font-serif-kr text-xl font-bold text-gold-300">眉</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-dodum text-lg sm:text-xl font-bold tracking-wider text-white">
                  눈썹 <span className="font-normal text-gold-300">:</span> 미 <span className="text-gold-300 font-serif-kr font-bold">眉</span>
                </h1>
                <span className="text-[10px] sm:text-[11px] px-2 py-0.5 rounded bg-brand-950 text-gold-200 font-mono tracking-[0.25em] hidden xs:inline border border-brand-700/60 font-bold uppercase">
                  LASH & BROW
                </span>
              </div>
              <p className="text-[11px] text-brand-200/80 -mt-0.5 font-dodum">
                프리미엄 1:1 맞춤 반영구 & 속눈썹 스튜디오
              </p>
            </div>
          </div>

          {/* View Mode Switcher & Admin Auth */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-brand-950/90 p-1 rounded-xl border border-brand-700/80 shadow-inner">
              <button
                onClick={() => setViewMode('customer')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all duration-200 ${
                  viewMode === 'customer'
                    ? 'bg-gradient-to-r from-gold-500 to-gold-400 text-stone-950 shadow-md scale-100 font-bold'
                    : 'text-stone-300 hover:text-white hover:bg-brand-800/60 font-semibold'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>고객 예약 모드</span>
              </button>

              <button
                onClick={handleAdminModeClick}
                className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all duration-200 ${
                  viewMode === 'admin'
                    ? 'bg-stone-100 text-brand-900 shadow-md scale-100 font-bold'
                    : 'text-stone-300 hover:text-white hover:bg-brand-800/60 font-semibold'
                }`}
              >
                {isAdminAuthenticated ? (
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Lock className="w-3.5 h-3.5 text-gold-400" />
                )}
                <span>원장님 관리 모드</span>
                {!isAdminAuthenticated && (
                  <span className="text-[10px] text-gold-400/80 font-normal">
                    (🔒인증)
                  </span>
                )}
                {pendingCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 bg-rose-500 text-white rounded-full text-[10px] font-bold animate-pulse">
                    {pendingCount}
                  </span>
                )}
              </button>
            </div>

            {/* Supabase Cloud Sync Status Indicator */}
            {cloudConfig.supabaseUrl && cloudConfig.supabaseAnonKey ? (
              <button
                type="button"
                onClick={() => syncWithCloud()}
                title={`Supabase 클라우드 동기화 (클릭하여 즉시 동기화)`}
                className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-brand-950/80 border border-emerald-500/50 text-[11px] text-stone-200 hover:text-white transition-colors"
              >
                {cloudSyncStatus === 'syncing' ? (
                  <RefreshCw className="w-3.5 h-3.5 text-gold-400 animate-spin" />
                ) : cloudSyncStatus === 'offline' ? (
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                )}
                <span className="font-mono text-[10px] text-emerald-300">
                  {cloudSyncStatus === 'syncing'
                    ? '동기화 중...'
                    : cloudSyncStatus === 'offline'
                    ? 'Supabase 확인 필요'
                    : lastSyncedAt
                    ? `Supabase ${lastSyncedAt}`
                    : 'Supabase 연결됨'}
                </span>
              </button>
            ) : null}

            {/* Layout Mode Toggle (PC ↔ Mobile) */}
            <button
              type="button"
              onClick={toggleLayoutMode}
              title={layoutMode === 'pc' ? '스마트폰 화면으로 전환' : 'PC 화면으로 전환'}
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-brand-950/80 border border-brand-700/80 text-[11px] text-stone-300 hover:text-white hover:border-gold-400/60 transition-all"
            >
              {layoutMode === 'pc' ? (
                <>
                  <Smartphone className="w-3.5 h-3.5 text-gold-400" />
                  <span>폰 뷰</span>
                </>
              ) : (
                <>
                  <Monitor className="w-3.5 h-3.5 text-gold-400" />
                  <span>PC 뷰</span>
                </>
              )}
            </button>

            {/* Logout button (visible only in admin mode) */}
            {viewMode === 'admin' && isAdminAuthenticated && (
              <button
                onClick={logoutAdmin}
                title="관리자 로그아웃"
                className="p-2 rounded-xl bg-brand-950/80 hover:bg-rose-900/60 text-stone-300 hover:text-rose-200 border border-brand-700/80 transition-colors text-xs font-semibold flex items-center gap-1"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">로그아웃</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
};
