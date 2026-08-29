import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Customer, CustomerGrade, TreatmentHistoryItem } from '../../types';
import { formatCurrency, formatPhoneNumber, getGradeBadgeInfo } from '../../utils/formatters';
import { formatKoreanDate } from '../../utils/dateUtils';
import { uploadImageToCloud } from '../../services/cloudSync';
import {
  Users,
  Search,
  Plus,
  User,
  Phone,
  FileText,
  Clock,
  Sparkles,
  Calendar,
  ChevronRight,
  X,
  Copy,
  Check,
  Edit2,
  Trash2,
  Tag,
  Shield,
  MessageSquare,
  ImagePlus,
  Loader2,
} from 'lucide-react';

export const CustomerCRM: React.FC = () => {
  const {
    customers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    addTreatmentHistory,
    services,
    shopConfig,
    showToast,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<CustomerGrade | '전체'>('전체');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Modals
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [isEditCustomerOpen, setIsEditCustomerOpen] = useState(false);
  const [isAddRecordOpen, setIsAddRecordOpen] = useState(false);
  const [copiedTemplate, setCopiedTemplate] = useState<string | null>(null);

  // Add Customer Form
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newGrade, setNewGrade] = useState<CustomerGrade>('신규');
  const [newSkinType, setNewSkinType] = useState('');
  const [newAllergies, setNewAllergies] = useState('');
  const [newMemo, setNewMemo] = useState('');

  // Edit Customer Form
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editGrade, setEditGrade] = useState<CustomerGrade>('신규');
  const [editSkinType, setEditSkinType] = useState('');
  const [editAllergies, setEditAllergies] = useState('');
  const [editMemo, setEditMemo] = useState('');
  const [editIsBlacklisted, setEditIsBlacklisted] = useState(false);

  // Open Edit Customer Modal
  const handleOpenEditCustomer = (cust: Customer) => {
    setEditName(cust.name);
    setEditPhone(cust.phone);
    setEditGrade(cust.grade);
    setEditSkinType(cust.skinType || '');
    setEditAllergies(cust.allergies || '');
    setEditMemo(cust.memo || '');
    setEditIsBlacklisted(cust.isBlacklisted || false);
    setIsEditCustomerOpen(true);
  };

  const handleUpdateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer || !editName.trim() || !editPhone.trim()) return;

    updateCustomer(selectedCustomer.id, {
      name: editName.trim(),
      phone: editPhone.trim(),
      grade: editGrade,
      skinType: editSkinType.trim(),
      allergies: editAllergies.trim(),
      memo: editMemo.trim(),
      isBlacklisted: editIsBlacklisted,
    });

    setIsEditCustomerOpen(false);
  };

  const handleDeleteCustomer = (id: string, name: string) => {
    if (
      window.confirm(
        `정말 '${name}' 회원님을 삭제하시겠습니까?\n고객님의 전자 차트 및 시술 기록이 모두 삭제됩니다.`
      )
    ) {
      deleteCustomer(id);
      if (selectedCustomer?.id === id) {
        setSelectedCustomer(null);
      }
    }
  };

  // Add Treatment Record Form
  const [recDate, setRecDate] = useState(new Date().toISOString().split('T')[0]);
  const [recServiceName, setRecServiceName] = useState(services[0]?.name || '여자 자연눈썹');
  const [recPrice, setRecPrice] = useState(services[0]?.price || 150000);
  const [recPigment, setRecPigment] = useState('');
  const [recTechnique, setRecTechnique] = useState('');
  const [recNotes, setRecNotes] = useState('');
  const [recBeforeImage, setRecBeforeImage] = useState('');
  const [recAfterImage, setRecAfterImage] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Filtering
  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.replace(/[^0-9]/g, '').includes(searchQuery.replace(/[^0-9]/g, ''));
    const matchesGrade = selectedGrade === '전체' || c.grade === selectedGrade;
    return matchesSearch && matchesGrade;
  });

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim()) return;

    const created = addCustomer({
      name: newName.trim(),
      phone: newPhone.trim(),
      grade: newGrade,
      skinType: newSkinType.trim(),
      allergies: newAllergies.trim(),
      memo: newMemo.trim(),
    });

    setIsAddCustomerOpen(false);
    setSelectedCustomer(created);
    setNewName('');
    setNewPhone('');
    setNewSkinType('');
    setNewAllergies('');
    setNewMemo('');
  };

  const handleOpenAddRecord = () => {
    setRecDate(new Date().toISOString().split('T')[0]);
    setIsAddRecordOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'before' | 'after') => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    setIsUploadingImage(true);
    const { url, error } = await uploadImageToCloud(file);
    setIsUploadingImage(false);

    if (error) {
      showToast('업로드 실패', error, 'error');
      return;
    }

    if (url) {
      if (type === 'before') setRecBeforeImage(url);
      else setRecAfterImage(url);
      showToast('업로드 성공', '사진이 성공적으로 첨부되었습니다.', 'success');
    }
  };

  const handleAddTreatmentRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) return;

    addTreatmentHistory(selectedCustomer.id, {
      date: recDate,
      serviceName: recServiceName,
      price: Number(recPrice),
      pigmentColor: recPigment.trim(),
      technique: recTechnique.trim(),
      notes: recNotes.trim(),
      beforeImage: recBeforeImage,
      afterImage: recAfterImage,
    });

    // Update locally selected customer state
    const updatedCust = customers.find((c) => c.id === selectedCustomer.id);
    if (updatedCust) {
      setSelectedCustomer(updatedCust);
    }
    setIsAddRecordOpen(false);
    setRecNotes('');
    setRecPigment('');
    setRecTechnique('');
    setRecBeforeImage('');
    setRecAfterImage('');
  };

  const copyToClipboard = (text: string, templateKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTemplate(templateKey);
    showToast('문자 복사 완료', '클립보드에 문자 메시지 템플릿이 복사되었습니다.', 'success');
    setTimeout(() => setCopiedTemplate(null), 2500);
  };

  // Sync selected customer with context state changes
  const activeCustomer = selectedCustomer
    ? customers.find((c) => c.id === selectedCustomer.id) || selectedCustomer
    : null;

  return (
    <div className="space-y-6">
      {/* 1. TOP CRM CONTROLS & SEARCH */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="회원 이름 또는 전화번호 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-800"
          />
        </div>

        {/* Grade Filters & New Customer Button */}
        <div className="flex items-center gap-2 flex-wrap justify-end w-full md:w-auto">
          <div className="flex bg-stone-100 p-1 rounded-xl">
            {(['전체', 'VIP', '단골', '신규', '주의'] as (CustomerGrade | '전체')[]).map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGrade(g)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  selectedGrade === g
                    ? 'bg-brand-900 text-gold-300 shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {g}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsAddCustomerOpen(true)}
            className="px-4 py-2 bg-brand-900 hover:bg-brand-800 text-gold-300 hover:text-white rounded-xl text-xs font-bold transition-all shadow flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>신규 회원 등록</span>
          </button>
        </div>
      </div>

      {/* 2. CUSTOMER LIST & STATS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer List Column */}
        <div className="lg:col-span-1 bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden flex flex-col h-[700px]">
          <div className="p-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
            <span className="font-serif-kr font-bold text-sm text-stone-900">
              회원 목록 ({filteredCustomers.length}명)
            </span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-stone-100 p-2 space-y-1">
            {filteredCustomers.length === 0 ? (
              <div className="p-8 text-center text-xs text-stone-500 space-y-2.5">
                <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
                  <Users className="w-6 h-6" />
                </div>
                <p className="font-bold text-stone-700 text-sm">등록된 회원이 없습니다 (0명)</p>
                <p className="text-[11px] text-stone-400 leading-relaxed">
                  신규 회원을 직접 등록하거나, 고객의 예약이 확정되면 자동으로 회원 명부 및 전자 차트가 생성됩니다.
                </p>
                <button
                  onClick={() => setIsAddCustomerOpen(true)}
                  className="mt-2 px-3.5 py-1.5 bg-brand-900 hover:bg-brand-800 text-gold-300 rounded-xl text-xs font-bold transition-all shadow inline-flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>신규 회원 등록</span>
                </button>
              </div>
            ) : (
              filteredCustomers.map((cust) => {
                const isSelected = activeCustomer?.id === cust.id;
                const gradeBadge = getGradeBadgeInfo(cust.grade);

                return (
                  <div
                    key={cust.id}
                    onClick={() => setSelectedCustomer(cust)}
                    className={`p-3.5 rounded-2xl cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-brand-900 text-white shadow-md'
                        : 'hover:bg-stone-50 text-stone-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-serif-kr font-bold text-sm flex-shrink-0 ${
                          isSelected
                            ? 'bg-brand-800 text-gold-300 border border-gold-400/40'
                            : 'bg-stone-100 text-brand-900'
                        }`}
                      >
                        {cust.name.slice(0, 1)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm">{cust.name}</span>
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${gradeBadge.bg}`}
                          >
                            {cust.grade}
                          </span>
                        </div>
                        <p
                          className={`text-xs font-mono mt-0.5 ${
                            isSelected ? 'text-stone-300' : 'text-stone-500'
                          }`}
                        >
                          {cust.phone}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span
                        className={`text-xs font-bold block ${
                          isSelected ? 'text-gold-300' : 'text-brand-900'
                        }`}
                      >
                        방문 {cust.totalVisits}회
                      </span>
                      <span
                        className={`text-[11px] font-mono ${
                          isSelected ? 'text-stone-300' : 'text-stone-400'
                        }`}
                      >
                        {formatCurrency(cust.totalSpent)}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Customer Detail / Digital Chart Column */}
        <div className="lg:col-span-2">
          {activeCustomer ? (
            <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 space-y-6 h-[700px] overflow-y-auto">
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-6 border-b border-stone-200">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-brand-900 text-gold-300 font-serif-kr text-2xl font-bold flex items-center justify-center shadow-md">
                    {activeCustomer.name.slice(0, 1)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h2 className="text-xl font-bold text-stone-900 font-serif-kr">
                        {activeCustomer.name} 고객 차트
                      </h2>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full border ${getGradeBadgeInfo(activeCustomer.grade).bg}`}
                      >
                        {activeCustomer.grade}
                      </span>
                    </div>
                    <p className="text-xs font-mono text-stone-500 mt-1 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5" />
                      {activeCustomer.phone}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {/* KPI metrics */}
                  <div className="flex items-center gap-4 bg-stone-50 p-3 rounded-2xl border border-stone-200 text-xs">
                    <div>
                      <span className="text-stone-400 block text-[11px]">총 시술 횟수</span>
                      <strong className="text-stone-900 font-mono text-sm">
                        {activeCustomer.totalVisits}회
                      </strong>
                    </div>
                    <div className="h-6 w-px bg-stone-200" />
                    <div>
                      <span className="text-stone-400 block text-[11px]">총 누적 결제</span>
                      <strong className="text-brand-900 font-mono text-sm">
                        {formatCurrency(activeCustomer.totalSpent)}
                      </strong>
                    </div>
                  </div>

                  {/* Edit & Delete Action Buttons */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEditCustomer(activeCustomer)}
                      className="px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-all flex items-center gap-1 shadow-sm"
                      title="회원 정보 수정"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>수정</span>
                    </button>
                    <button
                      onClick={() => handleDeleteCustomer(activeCustomer.id, activeCustomer.name)}
                      className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-all flex items-center gap-1 shadow-sm"
                      title="회원 삭제"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>삭제</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Skin & Allergy Profile Card */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
                  <span className="text-[11px] font-bold text-stone-500 block mb-1">
                    피부 타입
                  </span>
                  <p className="text-xs font-semibold text-stone-800">
                    {activeCustomer.skinType || '기록 없음 (보통)'}
                  </p>
                </div>
                <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
                  <span className="text-[11px] font-bold text-stone-500 block mb-1">
                    알러지 / 주의사항
                  </span>
                  <p className="text-xs font-semibold text-rose-700">
                    {activeCustomer.allergies || '특이사항 없음'}
                  </p>
                </div>
                <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
                  <span className="text-[11px] font-bold text-stone-500 block mb-1">
                    회원 등록일
                  </span>
                  <p className="text-xs font-mono font-semibold text-stone-800">
                    {activeCustomer.createdAt}
                  </p>
                </div>
              </div>

              {/* Memo Note */}
              <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200/80">
                <span className="text-xs font-bold text-amber-900 block mb-1">
                  💡 원장님 고객 취향 & 맞춤 디자인 메모
                </span>
                <p className="text-xs text-stone-700 leading-relaxed">
                  {activeCustomer.memo || '등록된 메모가 없습니다.'}
                </p>
              </div>

              {/* Quick Notification Template Box */}
              <div className="p-4 rounded-2xl bg-brand-50/60 border border-brand-200/70 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-brand-950 flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-brand-800" />
                    <span>고객 맞춤 카카오톡/문자 발송 템플릿</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      const msg = `[눈썹 : 미 眉]\n안녕하세요 ${activeCustomer.name}님! 시술 후 4~6주가 경과하여 가장 예쁜 색감과 결 유지를 위한 리터치 권장 시기입니다.\n\n편하신 날짜로 예약 주시면 맞춤 케어 도와드리겠습니다.\n문의: ${shopConfig.phone}`;
                      copyToClipboard(msg, 'retouch');
                    }}
                    className="p-2.5 rounded-xl bg-white hover:bg-brand-100 text-stone-800 border border-brand-200 text-xs font-semibold text-left transition-all flex items-center justify-between"
                  >
                    <span>📅 4주 리터치 리마인드 문자</span>
                    {copiedTemplate === 'retouch' ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-stone-400" />
                    )}
                  </button>

                  <button
                    onClick={() => {
                      const msg = `[눈썹 : 미 眉]\n${activeCustomer.name}님, 오늘 시술받으시느라 고생 많으셨습니다!\n\n■ 시술 후 필수 주의사항\n1. 24시간 동안 시술 부위 물 세안 금지\n2. 탈각 시 생기는 각질은 절대 손으로 뜯지 마세요.\n3. 재생크림은 아침/저녁 쌀알 크기만큼 얇게 도포해 주세요.\n\n문의: ${shopConfig.phone}`;
                      copyToClipboard(msg, 'care');
                    }}
                    className="p-2.5 rounded-xl bg-white hover:bg-brand-100 text-stone-800 border border-brand-200 text-xs font-semibold text-left transition-all flex items-center justify-between"
                  >
                    <span>🌿 시술 후 주의사항 안내 문자</span>
                    {copiedTemplate === 'care' ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-stone-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Treatment History Timeline */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif-kr font-bold text-base text-stone-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-gold-500" />
                    <span>시술 히스토리 & 레시피 차트</span>
                  </h3>

                  <button
                    onClick={() => setIsAddRecordOpen(true)}
                    className="px-3 py-1.5 bg-brand-900 text-gold-300 hover:text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>시술 기록 추가</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {activeCustomer.history.length === 0 ? (
                    <div className="p-8 text-center text-xs text-stone-500 bg-stone-50 rounded-2xl border border-stone-200">
                      아직 등록된 시술 이력이 없습니다.
                    </div>
                  ) : (
                    activeCustomer.history.map((item, idx) => (
                      <div
                        key={item.id || idx}
                        className="p-4 rounded-2xl border border-stone-200 hover:border-brand-300 bg-stone-50/50 space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-brand-900 text-sm">
                              {item.serviceName}
                            </span>
                            <span className="font-mono text-stone-500">{item.date}</span>
                          </div>
                          <span className="font-mono font-bold text-stone-900">
                            {formatCurrency(item.price)}
                          </span>
                        </div>

                        {item.pigmentColor && (
                          <div className="bg-white p-2 rounded-xl border border-stone-200/80 text-stone-700">
                            <strong className="text-stone-900">🎨 색소 배합 레시피: </strong>
                            <span>{item.pigmentColor}</span>
                          </div>
                        )}

                        {item.technique && (
                          <div className="bg-white p-2 rounded-xl border border-stone-200/80 text-stone-700">
                            <strong className="text-stone-900">✒️ 사용 기법: </strong>
                            <span>{item.technique}</span>
                          </div>
                        )}

                        {item.notes && (
                          <p className="text-stone-600 bg-white/70 p-2 rounded-xl border border-stone-100">
                            {item.notes}
                          </p>
                        )}

                        {(item.beforeImage || item.afterImage) && (
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            {item.beforeImage && (
                              <div>
                                <span className="block text-[10px] text-stone-500 mb-1 font-bold">Before</span>
                                <a href={item.beforeImage} target="_blank" rel="noreferrer">
                                  <img src={item.beforeImage} alt="Before" className="w-full h-24 sm:h-32 object-cover rounded-xl border border-stone-200 hover:opacity-90 transition-opacity" />
                                </a>
                              </div>
                            )}
                            {item.afterImage && (
                              <div>
                                <span className="block text-[10px] text-stone-500 mb-1 font-bold">After</span>
                                <a href={item.afterImage} target="_blank" rel="noreferrer">
                                  <img src={item.afterImage} alt="After" className="w-full h-24 sm:h-32 object-cover rounded-xl border border-stone-200 hover:opacity-90 transition-opacity" />
                                </a>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-12 text-center h-[700px] flex flex-col items-center justify-center text-stone-400">
              <Users className="w-12 h-12 text-stone-300 mb-3" />
              <p className="text-sm font-semibold text-stone-600">
                좌측 회원 목록에서 고객을 선택해 주세요.
              </p>
              <p className="text-xs text-stone-400 mt-1">
                상세 시술 히스토리, 색소 레시피 및 차트를 열람하고 관리할 수 있습니다.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 3. MODAL: ADD CUSTOMER */}
      {isAddCustomerOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col border border-stone-200">
            <div className="bg-brand-900 text-white p-5 flex items-center justify-between shrink-0">
              <h3 className="font-serif-kr font-bold text-lg text-gold-300">신규 회원 등록</h3>
              <button
                onClick={() => setIsAddCustomerOpen(false)}
                className="text-stone-300 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  고객 성함 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="예: 김민서"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  연락처 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="010-0000-0000"
                  value={newPhone}
                  onChange={(e) => setNewPhone(formatPhoneNumber(e.target.value))}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">회원 등급</label>
                  <select
                    value={newGrade}
                    onChange={(e) => setNewGrade(e.target.value as CustomerGrade)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm"
                  >
                    <option value="신규">신규</option>
                    <option value="단골">단골</option>
                    <option value="VIP">VIP</option>
                    <option value="주의">주의</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">피부 타입</label>
                  <input
                    type="text"
                    placeholder="예: 복합성, 얇은 피부"
                    value={newSkinType}
                    onChange={(e) => setNewSkinType(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  알러지 / 특이사항
                </label>
                <input
                  type="text"
                  placeholder="예: 금속 알러지 약간 있음"
                  value={newAllergies}
                  onChange={(e) => setNewAllergies(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  고객 디자인 취향 / 상담 메모
                </label>
                <textarea
                  rows={2}
                  placeholder="예: 자연스러운 일자 아치 선호, 붉은 잔흔 커버 필요"
                  value={newMemo}
                  onChange={(e) => setNewMemo(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl text-xs"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddCustomerOpen(false)}
                  className="flex-1 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-brand-900 hover:bg-brand-800 text-gold-300 font-bold rounded-xl text-xs shadow-md"
                >
                  회원 등록
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. MODAL: ADD TREATMENT RECORD */}
      {isAddRecordOpen && activeCustomer && (
        <div className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col border border-stone-200">
            <div className="bg-brand-900 text-white p-5 flex items-center justify-between shrink-0">
              <h3 className="font-serif-kr font-bold text-lg text-gold-300">
                {activeCustomer.name}님 시술 차트 기록 추가
              </h3>
              <button
                onClick={() => setIsAddRecordOpen(false)}
                className="text-stone-300 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddTreatmentRecord} className="p-6 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">시술 일자</label>
                  <input
                    type="date"
                    required
                    value={recDate}
                    onChange={(e) => setRecDate(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">시술 금액</label>
                  <input
                    type="number"
                    required
                    value={recPrice}
                    onChange={(e) => setRecPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">시술 프로그램</label>
                <input
                  type="text"
                  required
                  value={recServiceName}
                  onChange={(e) => setRecServiceName(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  색소 배합 레시피 (Pigment Formula)
                </label>
                <input
                  type="text"
                  placeholder="예: 다크브라운 7 : 카키 1 : 웜토너 1"
                  value={recPigment}
                  onChange={(e) => setRecPigment(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  사용 기법 (Technique)
                </label>
                <input
                  type="text"
                  placeholder="예: 엠보 결 6선 + 꼬리 머신 섀도우 그라데이션"
                  value={recTechnique}
                  onChange={(e) => setRecTechnique(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  시술 특이사항 & 탈각 경과 메모
                </label>
                <textarea
                  rows={2}
                  placeholder="예: 피부가 얇아 압 조절 주의함. 1차 시술 후 대칭 완벽."
                  value={recNotes}
                  onChange={(e) => setRecNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">시술 전 사진</label>
                  {recBeforeImage ? (
                    <div className="relative group rounded-xl overflow-hidden border border-stone-200">
                      <img src={recBeforeImage} alt="시술 전" className="w-full h-24 object-cover" />
                      <button type="button" onClick={() => setRecBeforeImage('')} className="absolute inset-0 bg-stone-900/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-stone-300 rounded-xl cursor-pointer hover:bg-stone-50 hover:border-brand-300 transition-colors">
                      {isUploadingImage ? <Loader2 className="w-5 h-5 text-brand-500 animate-spin" /> : <ImagePlus className="w-5 h-5 text-stone-400" />}
                      <span className="text-[10px] text-stone-500 mt-1 font-bold">사진 첨부</span>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'before')} />
                    </label>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">시술 후 사진</label>
                  {recAfterImage ? (
                    <div className="relative group rounded-xl overflow-hidden border border-stone-200">
                      <img src={recAfterImage} alt="시술 후" className="w-full h-24 object-cover" />
                      <button type="button" onClick={() => setRecAfterImage('')} className="absolute inset-0 bg-stone-900/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-stone-300 rounded-xl cursor-pointer hover:bg-stone-50 hover:border-brand-300 transition-colors">
                      {isUploadingImage ? <Loader2 className="w-5 h-5 text-brand-500 animate-spin" /> : <ImagePlus className="w-5 h-5 text-stone-400" />}
                      <span className="text-[10px] text-stone-500 mt-1 font-bold">사진 첨부</span>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'after')} />
                    </label>
                  )}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddRecordOpen(false)}
                  className="flex-1 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-brand-900 hover:bg-brand-800 text-gold-300 font-bold rounded-xl text-xs shadow-md"
                >
                  차트에 기록 저장
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. MODAL: EDIT CUSTOMER INFO */}
      {isEditCustomerOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] flex flex-col border border-stone-200">
            <div className="bg-brand-900 text-white p-5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-gold-300" />
                <h3 className="font-serif-kr font-bold text-lg text-gold-300">회원 정보 수정</h3>
              </div>
              <button
                onClick={() => setIsEditCustomerOpen(false)}
                className="text-stone-300 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateCustomer} className="p-6 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    고객 성함 <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    연락처 <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">회원 등급</label>
                <select
                  value={editGrade}
                  onChange={(e) => setEditGrade(e.target.value as CustomerGrade)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm"
                >
                  <option value="신규">신규</option>
                  <option value="단골">단골</option>
                  <option value="VIP">VIP</option>
                  <option value="주의">주의/특별관리</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">피부 타입</label>
                  <input
                    type="text"
                    placeholder="예: 지성, 얇은 피부"
                    value={editSkinType}
                    onChange={(e) => setEditSkinType(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">알러지/주의</label>
                  <input
                    type="text"
                    placeholder="예: 금속 알러지"
                    value={editAllergies}
                    onChange={(e) => setEditAllergies(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">디자인 & 취향 메모</label>
                <textarea
                  rows={3}
                  value={editMemo}
                  onChange={(e) => setEditMemo(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl text-xs"
                />
              </div>

              <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <span className="block text-xs font-bold text-rose-700">🚨 블랙리스트 (온라인 예약 차단)</span>
                  <span className="text-[10px] text-stone-500">잦은 노쇼 고객의 자동 간편 예약을 차단합니다.</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={editIsBlacklisted}
                    onChange={(e) => setEditIsBlacklisted(e.target.checked)}
                  />
                  <div className="w-9 h-5 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-600"></div>
                </label>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditCustomerOpen(false)}
                  className="flex-1 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-brand-900 hover:bg-brand-800 text-gold-300 font-bold rounded-xl text-xs shadow-md"
                >
                  수정 내용 저장
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
