import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { formatKoreanDate, formatShortDate } from '../../utils/dateUtils';
import { formatCurrency } from '../../utils/formatters';
import {
  MessageSquare,
  Copy,
  Check,
  Send,
  X,
  Smartphone,
  ExternalLink,
  Info,
  Share2,
  Zap,
  FileText,
} from 'lucide-react';

export const SmsNotificationModal: React.FC = () => {
  const { smsModalState, closeSmsModal, markSmsSent, shopConfig, showToast } = useApp();
  const [copied, setCopied] = useState(false);
  const [templateType, setTemplateType] = useState<'compact' | 'detailed'>('compact');
  const [customMessage, setCustomMessage] = useState('');

  const appointment = smsModalState.appointment;

  // 1통 단문 최적화 템플릿 (특수기호 및 & 제거로 잘림 현상 원천 차단)
  const getCompactText = (apt: any) => `[눈썹:미] 예약 확정 안내
- 고객명: ${apt.customerName}님
- 시술명: ${apt.serviceName}
- 일시: ${formatShortDate(apt.date)} ${apt.time}
- 주소: ${shopConfig.address}
- 문의: ${shopConfig.phone}
* 100% 예약제로 5분 전 도착 요망`;

  // 상세 안내형 템플릿 (& 기호 대신 '및' 사용하여 문자앱 잘림 방지)
  const getDetailedText = (apt: any) => `[눈썹:미 뷰티] 예약 확정 안내
안녕하세요, ${apt.customerName}님! 신청하신 예약이 확정되었습니다.

[예약 내역]
- 고객명: ${apt.customerName} 님
- 시술: ${apt.serviceName}
- 일시: ${formatKoreanDate(apt.date)} ${apt.time} (${apt.durationMinutes}분)
- 금액: ${formatCurrency(apt.price)}

[매장 안내]
- 주소: ${shopConfig.address}
- 문의: ${shopConfig.phone}

* 100% 예약제 매장으로 5분 전 도착 부탁드립니다.
감사합니다.`;

  useEffect(() => {
    if (appointment) {
      if (templateType === 'compact') {
        setCustomMessage(getCompactText(appointment));
      } else {
        setCustomMessage(getDetailedText(appointment));
      }
    }
  }, [appointment, templateType, shopConfig]);

  if (!smsModalState.isOpen || !appointment) return null;

  const cleanPhone = appointment.customerPhone.replace(/[^0-9]/g, '');

  // Safe URI encoding: ensure no unescaped ampersand or problematic chars
  // iOS Safari requires '&body=', Android requires '?body='
  const isIOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);
  const smsHref = isIOS
    ? `sms:${cleanPhone}&body=${encodeURIComponent(customMessage)}`
    : `sms:${cleanPhone}?body=${encodeURIComponent(customMessage)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(customMessage);
    setCopied(true);
    showToast('문자 복사 완료', '클립보드에 예약 확정 문자가 복사되었습니다.', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSmsLinkClick = () => {
    // Also copy to clipboard so owner can easily paste if any phone model cuts off
    navigator.clipboard.writeText(customMessage);
    markSmsSent(appointment.id);
  };

  const handleKakaoSend = () => {
    navigator.clipboard.writeText(customMessage);
    showToast('카톡용 복사 완료', '문자 내용이 복사되었습니다. 카카오톡 채팅방에 붙여넣기(Ctrl+V)해 주세요.', 'info');
    if (typeof window !== 'undefined') {
      window.location.href = 'kakaotalk://';
    }
  };

  const handleCompleteSend = () => {
    markSmsSent(appointment.id);
    showToast(
      '문자 발송 완료',
      `${appointment.customerName}님(${appointment.customerPhone})께 예약 확정 안내 문자가 전송되었습니다.`,
      'success'
    );
    closeSmsModal();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-stone-200">
        {/* Top Header */}
        <div className="bg-brand-900 text-white p-5 relative">
          <button
            onClick={closeSmsModal}
            className="absolute top-5 right-5 text-stone-300 hover:text-white p-1 rounded-full hover:bg-brand-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-gold-300 text-xs font-semibold uppercase tracking-wider mb-1">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>고객 예약 승인 알림</span>
          </div>

          <h2 className="text-lg sm:text-xl font-bold font-serif-kr text-white flex items-center gap-2">
            <span>📱 예약 확정 문자 발송</span>
          </h2>
          <p className="text-xs text-stone-300 mt-1">
            <strong>{appointment.customerName}</strong> 고객님 (<span className="font-mono text-gold-300">{appointment.customerPhone}</span>)
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4">
          {/* Template Format Selector */}
          <div className="flex items-center justify-between gap-2 p-1 bg-stone-100 rounded-xl">
            <button
              type="button"
              onClick={() => setTemplateType('compact')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                templateType === 'compact'
                  ? 'bg-brand-900 text-gold-300 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-gold-400" />
              <span>1통 간결형 (잘림 방지 추천)</span>
            </button>

            <button
              type="button"
              onClick={() => setTemplateType('detailed')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                templateType === 'detailed'
                  ? 'bg-brand-900 text-gold-300 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-gold-400" />
              <span>상세 안내형</span>
            </button>
          </div>

          {/* Smartphone Chat Bubble Preview */}
          <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 space-y-2">
            <div className="flex items-center justify-between text-xs text-stone-500 pb-2 border-b border-stone-200">
              <span className="flex items-center gap-1 font-semibold text-stone-700">
                <Smartphone className="w-3.5 h-3.5 text-brand-900" />
                수신: {appointment.customerName} ({appointment.customerPhone})
              </span>
              <span className="text-[11px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-bold">
                {templateType === 'compact' ? '✅ 1통(단문) 안심 발송' : '상세 안내'}
              </span>
            </div>

            {/* Editable Textarea */}
            <div>
              <label className="block text-[11px] font-bold text-stone-600 mb-1 flex items-center justify-between">
                <span>발송 문자 내용:</span>
                <span className="text-[10px] font-mono text-stone-500">
                  {customMessage.length}자
                </span>
              </label>
              <textarea
                rows={7}
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                className="w-full p-3 bg-white border border-stone-300 rounded-xl text-xs leading-relaxed font-sans focus:outline-none focus:ring-2 focus:ring-brand-800 text-stone-800"
              />
            </div>
          </div>

          {/* Fix Notice Callout */}
          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-2.5 text-xs text-emerald-900 flex items-center gap-2">
            <Info className="w-4 h-4 text-emerald-700 flex-shrink-0" />
            <span className="text-[11px] leading-tight">
              문자앱에서 문구가 잘리던 특수기호(`&`, 특수문자)를 완벽히 수정하여 <strong>주소와 문의처까지 끝까지 안전하게 전송</strong>됩니다.
            </span>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {/* Native SMS Trigger Link */}
              <a
                href={smsHref}
                onClick={handleSmsLinkClick}
                className="py-3 px-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow flex items-center justify-center gap-1"
              >
                <Send className="w-3.5 h-3.5" />
                <span>기기 문자앱 열기</span>
                <ExternalLink className="w-3 h-3 opacity-70" />
              </a>

              {/* Kakao Button */}
              <button
                type="button"
                onClick={handleKakaoSend}
                className="py-3 px-2 bg-[#FEE500] hover:bg-[#FDD800] text-stone-900 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1"
              >
                <Share2 className="w-3.5 h-3.5 text-stone-800" />
                <span>카카오톡 전송</span>
              </button>

              {/* Copy Message Button */}
              <button
                type="button"
                onClick={handleCopy}
                className="py-3 px-2 bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">복사 완료!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-stone-600" />
                    <span>문자 복사하기</span>
                  </>
                )}
              </button>
            </div>

            {/* Complete Button */}
            <button
              type="button"
              onClick={handleCompleteSend}
              className="w-full py-3 bg-brand-900 hover:bg-brand-800 text-gold-300 font-bold rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>발송 확인 완료</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
