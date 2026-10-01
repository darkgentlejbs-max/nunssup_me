import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatKoreanDate } from '../../utils/dateUtils';
import { formatCurrency, formatPhoneNumber, getStatusBadgeInfo } from '../../utils/formatters';
import { X, Search, Calendar, Phone, Clock, AlertTriangle, CheckCircle, Ban } from 'lucide-react';

interface MyBookingLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MyBookingLookupModal: React.FC<MyBookingLookupModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { appointments, updateAppointmentStatus, shopConfig } = useApp();
  const [phoneQuery, setPhoneQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  if (!isOpen) return null;

  const cleanQuery = phoneQuery.replace(/[^0-9]/g, '');
  // 정확히 일치하는 번호만 조회 (includes는 타인 정보 노출 위험)
  const matchedAppointments = cleanQuery.length >= 9
    ? appointments.filter((a) => a.customerPhone.replace(/[^0-9]/g, '') === cleanQuery)
    : [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
  };

  const handleCancel = (id: string, customerName: string) => {
    if (window.confirm(`${customerName}님의 예약을 정말 취소하시겠습니까?`)) {
      updateAppointmentStatus(id, 'cancelled');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-stone-200">
        {/* Modal Top Header */}
        <div className="bg-brand-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-stone-300 hover:text-white p-1 rounded-full hover:bg-brand-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-brand-200 text-xs font-semibold uppercase tracking-wider mb-1">
            <Calendar className="w-3.5 h-3.5 text-[#DF9A8C]" />
            <span>눈썹 : 미 眉</span>
          </div>
          <h2 className="text-xl font-bold font-serif-kr">내 예약 내역 조회 및 관리</h2>
          <p className="text-xs text-brand-200/80 mt-1">
            예약 시 입력하신 휴대폰 번호로 예약 현황을 조회하실 수 있습니다.
          </p>
        </div>

        {/* Search Input Box */}
        <div className="p-6">
          <form onSubmit={handleSearch} className="flex gap-2 mb-6">
            <div className="relative flex-1">
              <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                type="tel"
                placeholder="예: 010-1234-5678"
                value={phoneQuery}
                onChange={(e) => {
                  setPhoneQuery(formatPhoneNumber(e.target.value));
                  setHasSearched(false);
                }}
                className="w-full pl-10 pr-4 py-2.5 bg-[#FAF6F0] border border-[#EBDCD0] rounded-xl text-sm font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#DF9A8C]"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#3E2C1E] hover:bg-[#DF9A8C] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Search className="w-4 h-4" />
              <span>조회</span>
            </button>
          </form>

          {/* Search Results */}
          {cleanQuery.length >= 4 && (
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {matchedAppointments.length === 0 ? (
                <div className="text-center py-10 bg-stone-50 rounded-2xl border border-stone-200 text-stone-500 text-xs">
                  입력하신 번호로 등록된 예약 내역이 없습니다.
                </div>
              ) : (
                matchedAppointments.map((apt) => {
                  const badge = getStatusBadgeInfo(apt.status);
                  const isCancellable = apt.status === 'pending' || apt.status === 'confirmed';

                  return (
                    <div
                      key={apt.id}
                      className="p-4 rounded-2xl border border-stone-200 hover:border-brand-300 bg-white shadow-sm transition-all"
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span
                          className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${badge.bg} ${badge.text} ${badge.border}`}
                        >
                          {badge.label}
                        </span>
                        <span className="text-xs font-mono font-bold text-brand-900">
                          {formatCurrency(apt.price)}
                        </span>
                      </div>

                      <h4 className="font-bold text-stone-900 text-sm">{apt.serviceName}</h4>

                      <div className="mt-2 text-xs text-stone-600 space-y-1">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-stone-400" />
                          <span className="font-semibold text-stone-800">
                            {formatKoreanDate(apt.date)} {apt.time}
                          </span>
                          <span className="text-stone-400">({apt.durationMinutes}분)</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-stone-500">
                          <Clock className="w-3.5 h-3.5 text-stone-400" />
                          <span>예약자: {apt.customerName} ({apt.customerPhone})</span>
                        </div>
                        {apt.notes && (
                          <p className="text-[11px] text-stone-500 bg-stone-50 p-2 rounded-lg mt-1 border border-stone-100">
                            요청사항: {apt.notes}
                          </p>
                        )}
                      </div>

                      {/* Cancel Action */}
                      {isCancellable && (
                        <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between">
                          <span className="text-[11px] text-stone-400">
                            예약 변경은 매장으로 문의해 주세요.
                          </span>
                          <button
                            onClick={() => handleCancel(apt.id, apt.customerName)}
                            className="px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                          >
                            <Ban className="w-3.5 h-3.5" />
                            <span>예약 취소</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}

          {cleanQuery.length < 9 && (
            <div className="p-6 text-center bg-stone-50 rounded-2xl border border-dashed border-stone-300 text-stone-500 text-xs">
              정확한 조회를 위해 휴대폰 번호를 끝까지 입력해 주세요.<br/>
              <span className="text-stone-400">(예: 010-1234-5678)</span>
            </div>
          )}

          {/* Store Info Footer */}
          <div className="mt-5 p-3 rounded-xl bg-brand-50 border border-brand-100 text-xs text-brand-950 flex items-center justify-between">
            <span>문의 전화: <strong>{shopConfig.phone}</strong></span>
            <span className="text-[11px] text-brand-800">100% 예약제</span>
          </div>
        </div>
      </div>
    </div>
  );
};
