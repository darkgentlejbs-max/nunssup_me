import React, { createContext, useContext, useState } from 'react';
import { useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { NotificationToast } from './components/common/NotificationToast';
import { SmsNotificationModal } from './components/common/SmsNotificationModal';
import { CustomerHome } from './components/customer/CustomerHome';
import { AdminDashboard } from './components/admin/AdminDashboard';

// ── Layout Mode Context ──────────────────────────────────────────────────────
export type LayoutMode = 'pc' | 'mobile';
interface LayoutModeCtx { layoutMode: LayoutMode; toggleLayoutMode: () => void; }
export const LayoutModeContext = createContext<LayoutModeCtx>({ layoutMode: 'pc', toggleLayoutMode: () => {} });
export const useLayoutMode = () => useContext(LayoutModeContext);
// ─────────────────────────────────────────────────────────────────────────────

export const MainAppContent: React.FC = () => {
  const { viewMode } = useApp();
  const { layoutMode } = useLayoutMode();

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col selection:bg-brand-800 selection:text-gold-300">
      <Header />
      <main className="flex-1 flex justify-center">
        <div
          className={`w-full transition-all duration-300 ${
            layoutMode === 'mobile' ? 'max-w-[430px] shadow-2xl bg-stone-100' : ''
          }`}
        >
          {viewMode === 'customer' ? <CustomerHome /> : <AdminDashboard />}
        </div>
      </main>
      <SmsNotificationModal />
      <NotificationToast />
    </div>
  );
};

export default function App() {
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('pc');
  const toggleLayoutMode = () => setLayoutMode((m) => (m === 'pc' ? 'mobile' : 'pc'));

  return (
    <LayoutModeContext.Provider value={{ layoutMode, toggleLayoutMode }}>
      <MainAppContent />
    </LayoutModeContext.Provider>
  );
}
