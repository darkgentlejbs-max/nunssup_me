import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Lock, ShieldCheck, X, KeyRound, Sparkles, AlertCircle } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose }) => {
  const { loginAdmin, shopConfig } = useApp();
  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin) return;

    const success = loginAdmin(pin);
    if (success) {
      setPin('');
      setErrorMsg('');
      onClose();
    } else {
      setErrorMsg('비밀번호(PIN)가 일치하지 않습니다.');
    }
  };

  const handleKeyClick = (num: string) => {
    if (pin.length < 8) {
      setPin((prev) => prev + num);
      setErrorMsg('');
    }
  };

  const handleDeleteKey = () => {
    setPin((prev) => prev.slice(0, -1));
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-brand-950 text-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden border-2 border-gold-400/40 relative">
        {/* Close Button */}
        <button
          onClick={() => {
            setPin('');
            setErrorMsg('');
            onClose();
          }}
          className="absolute top-4 right-4 text-stone-400 hover:text-white p-1 rounded-full hover:bg-brand-900 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 text-center space-y-5">
          {/* Lock Icon */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-800 to-brand-900 border border-gold-400/50 flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-8 h-8 text-gold-300" />
          </div>

          <div>
            <div className="flex items-center justify-center gap-1.5 text-gold-300 text-xs font-semibold uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>원장님 전용 보안 인증</span>
            </div>
            <h3 className="text-xl font-bold font-serif-kr text-white">
              관리자 모드 접속
            </h3>
            <p className="text-xs text-stone-400 mt-1">
              매장 운영 및 회원 차트 보호를 위해 비밀번호(PIN)를 입력해 주세요.
            </p>
          </div>

          {/* PIN Input Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type="password"
                autoFocus
                maxLength={8}
                placeholder="PIN 4자리 입력"
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setErrorMsg('');
                }}
                className="w-full text-center tracking-[0.4em] py-3.5 bg-brand-900/90 border border-gold-400/40 rounded-2xl text-2xl font-mono font-bold text-gold-300 focus:outline-none focus:ring-2 focus:ring-gold-400 placeholder:tracking-normal placeholder:text-stone-500 placeholder:text-sm"
              />
            </div>

            {errorMsg && (
              <div className="flex items-center justify-center gap-1.5 text-rose-400 text-xs font-semibold">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Numeric Keypad */}
            <div className="grid grid-cols-3 gap-2 pt-2">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => handleKeyClick(n)}
                  className="py-3 bg-brand-900/60 hover:bg-brand-800 text-white rounded-xl text-lg font-bold font-mono border border-brand-800 hover:border-gold-400/40 transition-all active:scale-95"
                >
                  {n}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setPin('')}
                className="py-3 bg-brand-900/40 hover:bg-brand-800 text-stone-400 hover:text-white rounded-xl text-xs font-semibold border border-brand-800 transition-all"
              >
                전체 삭제
              </button>
              <button
                type="button"
                onClick={() => handleKeyClick('0')}
                className="py-3 bg-brand-900/60 hover:bg-brand-800 text-white rounded-xl text-lg font-bold font-mono border border-brand-800 hover:border-gold-400/40 transition-all active:scale-95"
              >
                0
              </button>
              <button
                type="button"
                onClick={handleDeleteKey}
                className="py-3 bg-brand-900/40 hover:bg-brand-800 text-stone-400 hover:text-white rounded-xl text-xs font-semibold border border-brand-800 transition-all"
              >
                ← 지우기
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!pin}
              className="w-full py-3.5 bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 disabled:opacity-40 text-stone-950 font-bold rounded-2xl text-sm transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4 text-stone-900" />
              <span>원장님 모드 로그인</span>
            </button>
          </form>

          {/* Initial PIN hint */}
          <div className="pt-2 border-t border-brand-900 text-[11px] text-stone-400 space-y-1">
            <span>초기 기본 비밀번호: <strong>7721</strong> (전화번호 뒷 4자리)</span>
            <p className="text-[10px] text-stone-500">
              * 로그인 후 [⚙️ 매장 설정]에서 언제든 원하는 비밀번호로 변경하실 수 있습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
