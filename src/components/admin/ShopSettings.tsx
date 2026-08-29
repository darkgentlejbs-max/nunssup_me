import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ServiceCategory, ServiceItem } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import {
  Settings,
  Store,
  Clock,
  Scissors,
  Database,
  Plus,
  Trash2,
  Edit2,
  Download,
  Upload,
  RotateCcw,
  Check,
  X,
  Phone,
  MapPin,
  Sparkles,
  Smartphone,
  Laptop,
  Share2,
  Copy,
  RefreshCw,
  Cloud,
  Zap,
  CheckCircle2,
  Globe,
  Key,
  AlertTriangle,
  ExternalLink,
  FileText,
} from 'lucide-react';
import { testCloudConnection } from '../../services/cloudSync';

export const ShopSettings: React.FC = () => {
  const {
    shopConfig,
    updateShopConfig,
    services,
    addService,
    updateService,
    deleteService,
    resetData,
    loadSampleData,
    clearAllSampleData,
    exportDataJson,
    importDataJson,
    changeAdminPin,
    cloudConfig,
    updateCloudConfig,
    cloudSyncStatus,
    lastSyncedAt,
    syncWithCloud,
    showToast,
  } = useApp();

  // Cloud Config State
  const [cloudChannelId, setCloudChannelId] = useState(cloudConfig.storeChannelId);
  const [supabaseUrl, setSupabaseUrl] = useState(cloudConfig.supabaseUrl || '');
  const [supabaseAnonKey, setSupabaseAnonKey] = useState(cloudConfig.supabaseAnonKey || '');
  const [isCopiedSql, setIsCopiedSql] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    const res = await testCloudConnection(supabaseUrl.trim(), supabaseAnonKey.trim(), cloudChannelId.trim());
    setTestResult(res);
    setIsTesting(false);
  };

  // Basic Info Form
  const [name, setName] = useState(shopConfig.name);
  const [subtitle, setSubtitle] = useState(shopConfig.subtitle);
  const [phone, setPhone] = useState(shopConfig.phone);
  const [instagram, setInstagram] = useState(shopConfig.instagram);
  const [address, setAddress] = useState(shopConfig.address);
  const [notice, setNotice] = useState(shopConfig.notice);

  // Hours
  const [weekdayStart, setWeekdayStart] = useState(shopConfig.weekdayHours.start);
  const [weekdayEnd, setWeekdayEnd] = useState(shopConfig.weekdayHours.end);
  const [weekendStart, setWeekendStart] = useState(shopConfig.weekendHours.start);
  const [weekendEnd, setWeekendEnd] = useState(shopConfig.weekendHours.end);

  // PIN Change Form
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');

  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin !== confirmPin) {
      showToast('비밀번호 불일치', '새 비밀번호와 비밀번호 확인이 일치하지 않습니다.', 'warning');
      return;
    }
    const res = changeAdminPin(oldPin, newPin);
    if (res) {
      setOldPin('');
      setNewPin('');
      setConfirmPin('');
    }
  };

  const handleSaveCloudConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updateCloudConfig({
      supabaseUrl: supabaseUrl.trim(),
      supabaseAnonKey: supabaseAnonKey.trim(),
      storeChannelId: cloudChannelId.trim() || 'nunssup_me_7721',
      autoSyncEnabled: true,
    });
  };

  const handleCopySql = () => {
    const sql = `-- [눈썹 : 미 眉] Supabase 클라우드 DB 테이블 및 스토리지 생성 스크립트
CREATE TABLE IF NOT EXISTS nunssup_store_data (
  channel_id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS 활성화 및 앱 전체 접근 허용 정책 (데이터)
ALTER TABLE nunssup_store_data ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow Full Access" ON nunssup_store_data;
CREATE POLICY "Allow Full Access" ON nunssup_store_data FOR ALL USING (true) WITH CHECK (true);

-- 스토리지 버킷 생성 (시술 전/후 사진)
INSERT INTO storage.buckets (id, name, public) VALUES ('nunssup_photos', 'nunssup_photos', true) ON CONFLICT (id) DO NOTHING;
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Upload" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete" ON storage.objects;
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'nunssup_photos');
CREATE POLICY "Public Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'nunssup_photos');
CREATE POLICY "Public Delete" ON storage.objects FOR DELETE USING (bucket_id = 'nunssup_photos');
`;
    navigator.clipboard.writeText(sql);
    setIsCopiedSql(true);
    showToast('SQL 스크립트 복사 완료', 'Supabase SQL Editor에 붙여넣을 테이블/스토리지 생성 쿼리가 복사되었습니다.', 'success');
    setTimeout(() => setIsCopiedSql(false), 2500);
  };

  // Device Quick Sync State
  const [syncCodeInput, setSyncCodeInput] = useState('');
  const [isSyncCopied, setIsSyncCopied] = useState(false);

  const handleCopySyncCode = () => {
    const json = exportDataJson();
    navigator.clipboard.writeText(json);
    setIsSyncCopied(true);
    showToast('동기화 코드 복사 완료', '현재 PC의 모든 예약/고객 데이터가 복사되었습니다. 카카오톡으로 스마트폰에 보낸 후 붙여넣어 주세요.', 'success');
    setTimeout(() => setIsSyncCopied(false), 3000);
  };

  const handleApplySyncCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!syncCodeInput.trim()) return;
    const ok = importDataJson(syncCodeInput.trim());
    if (ok) {
      setSyncCodeInput('');
      showToast('기기 동기화 완료', 'PC에서 수정한 최신 예약 및 회원 데이터가 이 기기에 정상 적용되었습니다!', 'success');
    }
  };

  // Service Modal Form
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [srvName, setSrvName] = useState('');
  const [srvCat, setSrvCat] = useState<ServiceCategory>('눈썹');
  const [srvPrice, setSrvPrice] = useState(150000);
  const [srvDuration, setSrvDuration] = useState(90);
  const [srvDesc, setSrvDesc] = useState('');
  const [srvRec, setSrvRec] = useState('');
  const [srvTag, setSrvTag] = useState('');

  const handleSaveStoreInfo = (e: React.FormEvent) => {
    e.preventDefault();
    updateShopConfig({
      name,
      subtitle,
      phone,
      instagram,
      address,
      notice,
      weekdayHours: { start: weekdayStart, end: weekdayEnd },
      weekendHours: { start: weekendStart, end: weekendEnd },
    });
  };

  const handleOpenAddService = () => {
    setEditingServiceId(null);
    setSrvName('');
    setSrvCat('눈썹');
    setSrvPrice(150000);
    setSrvDuration(90);
    setSrvDesc('');
    setSrvRec('');
    setSrvTag('');
    setIsServiceModalOpen(true);
  };

  const handleOpenEditService = (srv: ServiceItem) => {
    setEditingServiceId(srv.id);
    setSrvName(srv.name);
    setSrvCat(srv.category);
    setSrvPrice(srv.price);
    setSrvDuration(srv.durationMinutes);
    setSrvDesc(srv.description);
    setSrvRec(srv.recommendedFor);
    setSrvTag(srv.tag || '');
    setIsServiceModalOpen(true);
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!srvName.trim()) return;

    if (editingServiceId) {
      updateService(editingServiceId, {
        name: srvName.trim(),
        category: srvCat,
        price: Number(srvPrice),
        durationMinutes: Number(srvDuration),
        description: srvDesc.trim(),
        recommendedFor: srvRec.trim(),
        tag: srvTag.trim() || undefined,
      });
    } else {
      addService({
        name: srvName.trim(),
        category: srvCat,
        price: Number(srvPrice),
        durationMinutes: Number(srvDuration),
        description: srvDesc.trim(),
        recommendedFor: srvRec.trim(),
        tag: srvTag.trim() || undefined,
      });
    }
    setIsServiceModalOpen(false);
  };

  // Export JSON file
  const handleDownloadBackup = () => {
    const json = exportDataJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nunssup_me_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('백업 파일 다운로드', '전체 데이터가 JSON 파일로 저장되었습니다.', 'success');
  };

  // Import JSON file
  const handleUploadBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        importDataJson(content);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-8">
      {/* 1. STORE BASIC INFO & OPERATING HOURS */}
      <form onSubmit={handleSaveStoreInfo} className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-stone-200 pb-4">
          <div>
            <h3 className="font-serif-kr font-bold text-lg text-stone-900 flex items-center gap-2">
              <Store className="w-5 h-5 text-brand-900" />
              <span>매장 기본 정보 & 영업 시간 설정</span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              명함 이미지 정보와 일치하는 영업시간 및 안내 문구를 관리합니다.
            </p>
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-brand-900 hover:bg-brand-800 text-gold-300 font-bold rounded-xl text-xs shadow transition-all"
          >
            변경사항 저장
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">상호명</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">서브타이틀 / 아이디</label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">대표 연락처 (전화번호)</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">인스타그램 계정</label>
            <input
              type="text"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm font-mono"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-stone-700 mb-1">매장 주소 및 오시는 길</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-stone-700 mb-1">상단 공지 및 예약 유의사항</label>
            <textarea
              rows={2}
              value={notice}
              onChange={(e) => setNotice(e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-xl text-xs"
            />
          </div>
        </div>

        {/* Operating Hours Grid */}
        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-4">
          <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-brand-900" />
            <span>영업 시간 및 정기 휴무일</span>
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Weekdays */}
            <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-2">
              <span className="font-bold text-stone-800 block">월 - 목 영업시간</span>
              <div className="flex items-center gap-2">
                <input
                  type="time"
                  value={weekdayStart}
                  onChange={(e) => setWeekdayStart(e.target.value)}
                  className="px-2 py-1 border rounded-lg font-mono text-xs"
                />
                <span>~</span>
                <input
                  type="time"
                  value={weekdayEnd}
                  onChange={(e) => setWeekdayEnd(e.target.value)}
                  className="px-2 py-1 border rounded-lg font-mono text-xs"
                />
              </div>
            </div>

            {/* Weekends */}
            <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-2">
              <span className="font-bold text-stone-800 block">금 - 토 영업시간</span>
              <div className="flex items-center gap-2">
                <input
                  type="time"
                  value={weekendStart}
                  onChange={(e) => setWeekendStart(e.target.value)}
                  className="px-2 py-1 border rounded-lg font-mono text-xs"
                />
                <span>~</span>
                <input
                  type="time"
                  value={weekendEnd}
                  onChange={(e) => setWeekendEnd(e.target.value)}
                  className="px-2 py-1 border rounded-lg font-mono text-xs"
                />
              </div>
            </div>
          </div>

          <div className="text-xs font-bold text-rose-600 flex items-center gap-2">
            <span>* 일요일 정기 휴무 (예약 시스템 자동 차단 적용 중)</span>
          </div>
        </div>
      </form>

      {/* 2. SERVICES MENU MANAGER */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-stone-200 pb-4">
          <div>
            <h3 className="font-serif-kr font-bold text-lg text-stone-900 flex items-center gap-2">
              <Scissors className="w-5 h-5 text-brand-900" />
              <span>시술 메뉴 및 가격표 관리</span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              고객 예약창에 노출되는 시술 항목, 소요시간, 금액을 추가하거나 수정합니다.
            </p>
          </div>

          <button
            onClick={handleOpenAddService}
            className="px-4 py-2 bg-brand-900 hover:bg-brand-800 text-gold-300 hover:text-white rounded-xl text-xs font-bold transition-all shadow flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            <span>새 시술 추가</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((srv) => (
            <div
              key={srv.id}
              className="p-4 rounded-2xl border border-stone-200 bg-stone-50/60 hover:bg-white transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-brand-100 text-brand-800">
                    {srv.category}
                  </span>
                  <span className="text-xs font-mono font-bold text-stone-500">
                    {srv.durationMinutes}분
                  </span>
                </div>
                <h4 className="font-bold text-stone-900 text-sm">{srv.name}</h4>
                <p className="text-xs text-stone-500 mt-1 line-clamp-2">{srv.description}</p>
                <div className="mt-2 font-mono font-extrabold text-brand-900 text-sm">
                  {formatCurrency(srv.price)}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 mt-3 border-t border-stone-200">
                <button
                  onClick={() => handleOpenEditService(srv)}
                  className="p-1.5 rounded-lg text-stone-600 hover:bg-stone-200 text-xs flex items-center gap-1 font-semibold"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>수정</span>
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(`'${srv.name}' 시술 항목을 삭제하시겠습니까?`)) {
                      deleteService(srv.id);
                    }
                  }}
                  className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 text-xs flex items-center gap-1 font-semibold"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>삭제</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. ADMIN SECURITY & PIN CHANGE */}
      <form onSubmit={handleChangePin} className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-stone-200 pb-4">
          <div>
            <h3 className="font-serif-kr font-bold text-lg text-stone-900 flex items-center gap-2">
              <Settings className="w-5 h-5 text-brand-900" />
              <span>원장님 전용 관리자 비밀번호(PIN) 변경</span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              원장님만 관리 모드(고객 차트, 매출, 예약 일정)에 접근할 수 있도록 보안 PIN을 설정합니다.
            </p>
          </div>

          <button
            type="submit"
            disabled={!oldPin || !newPin || !confirmPin}
            className="px-5 py-2.5 bg-brand-900 hover:bg-brand-800 disabled:opacity-40 text-gold-300 font-bold rounded-xl text-xs shadow transition-all"
          >
            비밀번호 변경
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">현재 사용 중인 비밀번호</label>
            <input
              type="password"
              required
              placeholder="현재 PIN (초기: 7721)"
              value={oldPin}
              onChange={(e) => setOldPin(e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">새 비밀번호 (4자리 이상)</label>
            <input
              type="password"
              required
              placeholder="새 PIN 입력"
              value={newPin}
              onChange={(e) => setNewPin(e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">새 비밀번호 확인</label>
            <input
              type="password"
              required
              placeholder="새 PIN 재입력"
              value={confirmPin}
              onChange={(e) => setConfirmPin(e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm font-mono"
            />
          </div>
        </div>

        <div className="text-[11px] text-stone-500 bg-stone-50 p-3 rounded-xl border border-stone-200">
          💡 <strong>보안 팁:</strong> 고객이 예약하는 기기나 일반 브라우저에서는 이 비밀번호가 없으면 고객 차트나 매출 정보에 일절 접근할 수 없습니다.
        </div>
      </form>

      {/* 4. REAL-TIME CLOUD DATABASE (SUPABASE ONLY) */}
      <form onSubmit={handleSaveCloudConfig} className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-400/90 shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-stone-200 pb-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>실시간 클라우드 DB 연동 (Supabase 전용)</span>
            </div>
            <h3 className="font-serif-kr font-bold text-lg text-stone-900 flex items-center gap-2">
              <Database className="w-5 h-5 text-emerald-700" />
              <span>Supabase PostgreSQL 클라우드 DB 자동 동기화</span>
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              PC에서 수정한 예약과 고객 차트가 <strong>원장님 스마트폰/태블릿 및 고객 예약 화면에 1초 만에 실시간 자동 동기화</strong>됩니다.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={isTesting}
              className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 text-xs font-bold transition-all flex items-center gap-1.5"
            >
              {isTesting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
              <span>연결 테스트</span>
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs shadow transition-all flex items-center gap-1"
            >
              <Check className="w-3.5 h-3.5" />
              <span>설정 저장</span>
            </button>
          </div>
        </div>

        {/* Sync Status Banner */}
        <div className={`rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs border ${
          cloudConfig.supabaseUrl && cloudConfig.supabaseAnonKey
            ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
            : 'bg-amber-50/80 border-amber-300 text-amber-950'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl text-white flex items-center justify-center flex-shrink-0 shadow ${
              cloudConfig.supabaseUrl && cloudConfig.supabaseAnonKey ? 'bg-emerald-700' : 'bg-amber-600'
            }`}>
              {cloudConfig.supabaseUrl && cloudConfig.supabaseAnonKey ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
            </div>
            <div>
              <p className="font-bold text-sm">
                {cloudConfig.supabaseUrl && cloudConfig.supabaseAnonKey
                  ? (cloudSyncStatus === 'syncing' ? '⚡ 실시간 데이터 동기화 중...' : '🟢 Supabase 클라우드 실시간 동기화 활성')
                  : '⚠️ Supabase URL과 Key를 입력하여 클라우드 DB를 연결해 주세요.'}
              </p>
              <p className="text-[11px] opacity-80 mt-0.5">
                동기화 채널: <strong className="font-mono">{cloudChannelId || 'nunssup_me_7721'}</strong> | 마지막 동기화: {lastSyncedAt || (cloudConfig.supabaseUrl ? '대기 중' : '미연결')}
              </p>
            </div>
          </div>

          <span className={`text-[11px] font-bold px-3 py-1 rounded-full font-mono border ${
            cloudConfig.supabaseUrl && cloudConfig.supabaseAnonKey
              ? 'bg-emerald-200/80 border-emerald-300 text-emerald-900'
              : 'bg-amber-200/80 border-amber-300 text-amber-900'
          }`}>
            {cloudConfig.supabaseUrl && cloudConfig.supabaseAnonKey ? 'PC ↔ 스마트폰 자동 연결됨' : '설정 필요'}
          </span>
        </div>

        {/* Credentials Form */}
        <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Supabase Project URL <span className="text-rose-500">*</span>
              </label>
              <input
                type="url"
                required
                placeholder="https://xyzproject.supabase.co"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-xs font-mono bg-white focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Supabase anon public API Key <span className="text-rose-500">*</span>
              </label>
              <input
                type="password"
                required
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                value={supabaseAnonKey}
                onChange={(e) => setSupabaseAnonKey(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-xs font-mono bg-white focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center justify-between">
              <span>매장 고유 동기화 채널 키 (Store Channel ID)</span>
              <span className="text-[10px] text-stone-400 font-normal">PC와 스마트폰에 동일한 키를 입력하면 자동 연결</span>
            </label>
            <input
              type="text"
              required
              value={cloudChannelId}
              onChange={(e) => setCloudChannelId(e.target.value)}
              placeholder="예: nunssup_me_7721"
              className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-xs font-mono font-bold text-stone-900 bg-white focus:ring-2 focus:ring-emerald-700 focus:outline-none"
            />
          </div>

          {/* SQL Table Generator Banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white p-4 rounded-xl border border-stone-200 gap-3">
            <div>
              <span className="text-xs font-bold text-stone-800 block">
                💡 Supabase SQL Editor에 붙여넣을 <strong>테이블 생성 쿼리</strong>
              </span>
              <span className="text-[11px] text-stone-500">
                새 프로젝트 생성 후 SQL Editor에 아래 스크립트를 붙여넣고 [Run]을 누르시면 테이블이 생성됩니다.
              </span>
            </div>
            <button
              type="button"
              onClick={handleCopySql}
              className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 flex-shrink-0"
            >
              {isCopiedSql ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{isCopiedSql ? 'SQL 복사됨!' : '1-클릭 SQL 복사'}</span>
            </button>
          </div>

          {/* Connection Test Result */}
          {testResult && (
            <div
              className={`p-4 rounded-xl border text-xs leading-relaxed flex items-start gap-2.5 ${
                testResult.success
                  ? 'bg-emerald-50 text-emerald-950 border-emerald-300'
                  : 'bg-rose-50 text-rose-950 border-rose-300'
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-bold text-sm">{testResult.success ? '연결 테스트 성공!' : '연결 테스트 실패'}</p>
                <p className="text-xs mt-1">{testResult.message}</p>
              </div>
            </div>
          )}

          {/* 3-Step Guide */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-4 text-xs text-amber-950 space-y-2 leading-relaxed">
            <p className="font-bold text-xs text-amber-900 flex items-center gap-1.5">
              <span>📖 Supabase 무료 PostgreSQL DB 2분 연동 순서</span>
              <a
                href="https://supabase.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-amber-800 inline-flex items-center gap-1 ml-1"
              >
                <span>supabase.com 열기</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </p>
            <ol className="list-decimal list-inside space-y-1.5 text-stone-700 text-[11px]">
              <li><a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="underline font-bold text-emerald-800">Supabase.com</a> 무료 회원가입 후 <strong>[New project]</strong>를 생성합니다.</li>
              <li>왼쪽 메뉴 <strong>[SQL Editor]</strong>에 들어가 위 <strong>[1-클릭 SQL 복사]</strong>를 붙여넣고 초록색 <strong>[Run]</strong> 버튼을 누릅니다.</li>
              <li>왼쪽 메뉴 <strong>[Project Settings] (⚙️) ➔ [API]</strong>에서 <strong>Project URL</strong>과 <strong>anon public key</strong>를 복사하여 위 칸에 넣고 <strong>[연결 테스트]</strong> 후 <strong>[설정 저장]</strong>을 누르시면 됩니다!</li>
            </ol>
          </div>
        </div>
      </form>

      {/* 5. MULTI-DEVICE INSTANT DATA SYNC */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-brand-200/80 shadow-md space-y-6">
        <div className="border-b border-stone-200 pb-4">
          <div className="flex items-center gap-2 text-brand-900 font-bold text-xs uppercase tracking-wider mb-1">
            <RefreshCw className="w-4 h-4 text-gold-500 animate-spin-slow" />
            <span>기기 간 데이터 이동 & 동기화</span>
          </div>
          <h3 className="font-serif-kr font-bold text-lg text-stone-900 flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-brand-900" />
            <span>스마트폰 ↔ PC 데이터 1초 동기화</span>
          </h3>
          <p className="text-xs text-stone-500 mt-1 leading-relaxed">
            PC에서 수정한 예약자/회원 차트를 스마트폰에서도 똑같이 보고 싶을 때, 아래 <strong>[동기화 코드 복사]</strong>를 눌러 스마트폰에 붙여넣으시면 즉시 동일하게 반영됩니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Step 1: Export from source device */}
          <div className="p-5 rounded-2xl bg-brand-50/60 border border-brand-200/80 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-brand-900 text-white flex items-center justify-center text-xs font-bold">1</span>
              <h4 className="font-bold text-stone-900 text-sm">데이터를 보낼 기기 (예: PC)</h4>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              아래 버튼을 누르면 현재 기기에 저장된 모든 예약, 회원 차트, 매출 내역이 클립보드에 복사됩니다.
            </p>
            <button
              type="button"
              onClick={handleCopySyncCode}
              className="w-full py-3 bg-brand-900 hover:bg-brand-800 text-gold-300 font-bold rounded-xl text-xs transition-all shadow flex items-center justify-center gap-2"
            >
              {isSyncCopied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>동기화 코드 복사 완료! (카톡 전송)</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>📋 현재 데이터 동기화 코드 복사하기</span>
                </>
              )}
            </button>
          </div>

          {/* Step 2: Import on target device */}
          <form onSubmit={handleApplySyncCode} className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-gold-500 text-white flex items-center justify-center text-xs font-bold">2</span>
              <h4 className="font-bold text-stone-900 text-sm">데이터를 받을 기기 (예: 스마트폰)</h4>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              복사한 동기화 코드를 아래 입력창에 붙여넣고 [동기화 적용]을 누르면 즉시 최신 데이터가 반영됩니다.
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="복사한 동기화 코드 붙여넣기..."
                value={syncCodeInput}
                onChange={(e) => setSyncCodeInput(e.target.value)}
                className="flex-1 px-3 py-2 border border-stone-300 rounded-xl text-xs focus:ring-2 focus:ring-brand-800"
              />
              <button
                type="submit"
                disabled={!syncCodeInput.trim()}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white font-bold rounded-xl text-xs shadow transition-all flex items-center gap-1 flex-shrink-0"
              >
                <Check className="w-3.5 h-3.5" />
                <span>동기화 적용</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* 5. DATA BACKUP & RESET */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
        <div className="border-b border-stone-200 pb-4">
          <h3 className="font-serif-kr font-bold text-lg text-stone-900 flex items-center gap-2">
            <Database className="w-5 h-5 text-brand-900" />
            <span>데이터 백업 & 복원</span>
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            등록된 모든 회원 명부, 차트, 예약 내역, 설정 데이터를 안전하게 JSON 파일로 백업하거나 복원합니다.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {/* User Manual PDF Download */}
          <a
            href="/nunssup_me_manual.pdf"
            download="nunssup_me_manual.pdf"
            className="p-4 rounded-2xl bg-brand-50/80 hover:bg-brand-100 border border-brand-300 text-left transition-all group block shadow-xs"
          >
            <FileText className="w-5 h-5 text-brand-900 mb-2 group-hover:scale-110 transition-transform" />
            <h4 className="font-bold text-stone-900 text-sm">사용 매뉴얼 PDF</h4>
            <p className="text-xs text-stone-600 mt-1 leading-relaxed">
              앱의 전체 사용법과 설정 가이드가 담긴 공식 PDF 매뉴얼을 다운로드합니다.
            </p>
          </a>

          {/* Download */}
          <button
            onClick={handleDownloadBackup}
            className="p-4 rounded-2xl bg-stone-50 hover:bg-brand-50 border border-stone-200 hover:border-brand-300 text-left transition-all group"
          >
            <Download className="w-5 h-5 text-brand-900 mb-2 group-hover:scale-110 transition-transform" />
            <h4 className="font-bold text-stone-900 text-sm">데이터 백업 다운로드</h4>
            <p className="text-xs text-stone-500 mt-1 leading-relaxed">
              현재 매장의 모든 데이터를 안전하게 .JSON 파일로 컴퓨터에 저장합니다.
            </p>
          </button>

          {/* Upload */}
          <label className="p-4 rounded-2xl bg-stone-50 hover:bg-brand-50 border border-stone-200 hover:border-brand-300 text-left transition-all group cursor-pointer block">
            <Upload className="w-5 h-5 text-brand-900 mb-2 group-hover:scale-110 transition-transform" />
            <h4 className="font-bold text-stone-900 text-sm">백업 데이터 불러오기</h4>
            <p className="text-xs text-stone-500 mt-1 leading-relaxed">
              이전에 저장한 JSON 백업 파일을 업로드하여 그대로 복원합니다.
            </p>
            <input
              type="file"
              accept=".json"
              onChange={handleUploadBackup}
              className="hidden"
            />
          </label>

          {/* Clean Real Store Mode */}
          <button
            onClick={() => {
              if (window.confirm('가상 샘플 예약과 고객 명부를 모두 비우고 실전 매장 운영 모드로 전환하시겠습니까? (시술 메뉴 및 기본 설정은 그대로 유지됩니다)')) {
                clearAllSampleData();
              }
            }}
            className="p-4 rounded-2xl bg-emerald-50/60 hover:bg-emerald-50 border border-emerald-300 text-left transition-all group"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-700 mb-2 group-hover:scale-110 transition-transform" />
            <h4 className="font-bold text-emerald-950 text-sm">실전 운영 모드로 비우기</h4>
            <p className="text-xs text-emerald-700 mt-1 leading-relaxed">
              가상 샘플 데이터를 모두 지우고 실제 손님 예약만 기록할 수 있도록 준비합니다.
            </p>
          </button>

          {/* Load Sample Demo */}
          <button
            onClick={() => {
              if (window.confirm('앱 사용법 연습용 샘플 예약(2건)과 고객 데이터를 추가하시겠습니까?')) {
                loadSampleData();
              }
            }}
            className="p-4 rounded-2xl bg-gold-50/60 hover:bg-gold-50 border border-gold-300 text-left transition-all group"
          >
            <Sparkles className="w-5 h-5 text-gold-600 mb-2 group-hover:rotate-12 transition-transform" />
            <h4 className="font-bold text-gold-950 text-sm">연습용 샘플 채우기</h4>
            <p className="text-xs text-gold-800 mt-1 leading-relaxed">
              캘린더 및 고객 차트 기능을 테스트해 볼 수 있는 샘플 데이터를 생성합니다.
            </p>
          </button>
        </div>
      </div>

      {/* 4. MODAL: ADD / EDIT SERVICE */}
      {isServiceModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-stone-200">
            <div className="bg-brand-900 text-white p-5 flex items-center justify-between">
              <h3 className="font-serif-kr font-bold text-lg text-gold-300">
                {editingServiceId ? '시술 항목 수정' : '신규 시술 항목 추가'}
              </h3>
              <button
                onClick={() => setIsServiceModalOpen(false)}
                className="text-stone-300 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">카테고리</label>
                  <select
                    value={srvCat}
                    onChange={(e) => setSrvCat(e.target.value as ServiceCategory)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm"
                  >
                    <option value="눈썹">눈썹</option>
                    <option value="아이라인">아이라인</option>
                    <option value="입술">입술</option>
                    <option value="미인점">미인점</option>
                    <option value="속눈썹">속눈썹</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    시술명 <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="예: 여자 섀도우눈썹"
                    value={srvName}
                    onChange={(e) => setSrvName(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">시술 금액 (원)</label>
                  <input
                    type="number"
                    required
                    value={srvPrice}
                    onChange={(e) => setSrvPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">소요 시간 (분)</label>
                  <input
                    type="number"
                    required
                    step={10}
                    value={srvDuration}
                    onChange={(e) => setSrvDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">태그 (선택)</label>
                <input
                  type="text"
                  placeholder="예: 인기 시그니처, 맨즈 추천"
                  value={srvTag}
                  onChange={(e) => setSrvTag(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">시술 상세 설명</label>
                <textarea
                  rows={2}
                  value={srvDesc}
                  onChange={(e) => setSrvDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">추천 대상 안내</label>
                <input
                  type="text"
                  placeholder="예: 또렷한 화장눈썹 느낌을 원하시는 분"
                  value={srvRec}
                  onChange={(e) => setSrvRec(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsServiceModalOpen(false)}
                  className="flex-1 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-brand-900 hover:bg-brand-800 text-gold-300 font-bold rounded-xl text-xs shadow-md"
                >
                  저장하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
