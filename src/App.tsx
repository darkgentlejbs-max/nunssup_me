import React from 'react';
import { useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { NotificationToast } from './components/common/NotificationToast';
import { SmsNotificationModal } from './components/common/SmsNotificationModal';
import { CustomerHome } from './components/customer/CustomerHome';
import { AdminDashboard } from './components/admin/AdminDashboard';

export const MainAppContent: React.FC = () => {
  const { viewMode } = useApp();

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col selection:bg-brand-800 selection:text-gold-300">
      <Header />
      <main className="flex-1">
        {viewMode === 'customer' ? <CustomerHome /> : <AdminDashboard />}
      </main>
      <SmsNotificationModal />
      <NotificationToast />
    </div>
  );
};

export default function App() {
  return <MainAppContent />;
}
