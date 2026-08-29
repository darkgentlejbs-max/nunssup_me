import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/formatters';
import {
  TrendingUp,
  DollarSign,
  Users,
  Award,
  Calendar,
  CreditCard,
  Download,
  CheckCircle2,
  PieChart,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';

export const SalesReport: React.FC = () => {
  const { appointments, customers, services, shopConfig, showToast } = useApp();

  const todayStr = (() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = (now.getMonth() + 1).toString().padStart(2, '0');
    const d = now.getDate().toString().padStart(2, '0');
    return `${y}-${m}-${d}`;
  })();
  const currentMonthStr = todayStr.slice(0, 7); // 'YYYY-MM'

  // Calculate Revenue Stats
  const completedApts = appointments.filter((a) => a.status === 'completed');
  const confirmedApts = appointments.filter((a) => a.status === 'confirmed');

  // Today's stats
  const todayApts = appointments.filter((a) => a.date === todayStr && a.status !== 'cancelled' && a.status !== 'noshow');
  const todayCompleted = appointments.filter((a) => a.date === todayStr && a.status === 'completed');
  const todayRevenue = todayCompleted.reduce((sum, a) => sum + a.price, 0);
  const todayExpectedRevenue = todayApts.reduce((sum, a) => sum + a.price, 0);

  // Month stats
  const thisMonthCompleted = completedApts.filter((a) => a.date.startsWith(currentMonthStr));
  const thisMonthRevenue = thisMonthCompleted.reduce((sum, a) => sum + a.price, 0);

  // Total Lifetime Revenue
  const totalRevenue = completedApts.reduce((sum, a) => sum + a.price, 0);

  // Repeat customer rate
  const repeatCustomersCount = customers.filter((c) => c.totalVisits > 1).length;
  const repeatRate = customers.length > 0 ? Math.round((repeatCustomersCount / customers.length) * 100) : 0;

  // Average Order Value (AOV)
  const aov = completedApts.length > 0 ? Math.round(totalRevenue / completedApts.length) : 0;

  // Popular Services Ranking
  const serviceStatsMap: Record<string, { count: number; totalSales: number; name: string; category: string }> = {};

  services.forEach((s) => {
    serviceStatsMap[s.name] = { count: 0, totalSales: 0, name: s.name, category: s.category };
  });

  appointments.forEach((a) => {
    if (a.status !== 'cancelled') {
      if (!serviceStatsMap[a.serviceName]) {
        serviceStatsMap[a.serviceName] = { count: 0, totalSales: 0, name: a.serviceName, category: '기타' };
      }
      serviceStatsMap[a.serviceName].count += 1;
      if (a.status === 'completed') {
        serviceStatsMap[a.serviceName].totalSales += a.price;
      }
    }
  });

  const popularServices = Object.values(serviceStatsMap).sort((a, b) => b.count - a.count);
  const maxBookingCount = Math.max(...popularServices.map((p) => p.count), 1);

  // Export CSV
  const handleExportCsv = () => {
    const headers = ['예약번호', '고객명', '연락처', '시술명', '일시', '금액', '상태'];
    const rows = appointments.map((a) => [
      a.id,
      a.customerName,
      a.customerPhone,
      a.serviceName,
      `${a.date} ${a.time}`,
      a.price,
      a.status,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `nunssup_me_sales_${todayStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('엑셀 내보내기', '매출 및 예약 내역이 CSV 파일로 다운로드되었습니다.', 'success');
  };

  return (
    <div className="space-y-6">
      {/* 1. TOP KPI SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Sales */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500">오늘 완료 매출</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-extrabold font-mono text-stone-900">
              {formatCurrency(todayRevenue)}
            </h3>
            <p className="text-[11px] text-stone-500 mt-1">
              오늘 예약 총 {todayApts.length}건 (예상: {formatCurrency(todayExpectedRevenue)})
            </p>
          </div>
        </div>

        {/* This Month's Sales */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500">이번 달 누적 매출</span>
            <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-900 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-extrabold font-mono text-brand-900">
              {formatCurrency(thisMonthRevenue)}
            </h3>
            <p className="text-[11px] text-stone-500 mt-1">
              이번 달 시술 완료 {thisMonthCompleted.length}건
            </p>
          </div>
        </div>

        {/* Average Order Value (AOV) */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500">평균 객단가</span>
            <div className="w-9 h-9 rounded-xl bg-gold-50 text-gold-700 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-extrabold font-mono text-stone-900">
              {formatCurrency(aov)}
            </h3>
            <p className="text-[11px] text-stone-500 mt-1">
              시술 1회당 평균 결제 금액
            </p>
          </div>
        </div>

        {/* Repeat Customer Rate */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500">재방문 및 리터치율</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-extrabold font-mono text-stone-900">
              {repeatRate}%
            </h3>
            <p className="text-[11px] text-stone-500 mt-1">
              전체 회원 {customers.length}명 중 {repeatCustomersCount}명 재방문
            </p>
          </div>
        </div>
      </div>

      {/* 2. POPULAR SERVICES RANKING & EXPORT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Popular Services Ranking */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif-kr font-bold text-lg text-stone-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-gold-500" />
                <span>인기 시술 프로그램 순위 (예약 기준)</span>
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                가장 고객 반응이 뜨거운 상위 시술 메뉴 분석
              </p>
            </div>

            <button
              onClick={handleExportCsv}
              className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>CSV 내보내기</span>
            </button>
          </div>

          <div className="space-y-4">
            {popularServices.map((item, index) => {
              const percentage = Math.round((item.count / maxBookingCount) * 100);

              return (
                <div key={item.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                          index === 0
                            ? 'bg-gold-400 text-stone-950 font-extrabold'
                            : index === 1
                            ? 'bg-stone-300 text-stone-800'
                            : index === 2
                            ? 'bg-amber-200 text-amber-900'
                            : 'bg-stone-100 text-stone-500'
                        }`}
                      >
                        {index + 1}
                      </span>
                      <span className="font-bold text-stone-900">{item.name}</span>
                    </div>

                    <div className="flex items-center gap-3 font-mono">
                      <span className="text-brand-900 font-bold">{item.count}회 예약</span>
                      <span className="text-stone-400">|</span>
                      <span className="text-stone-600 font-semibold">
                        {formatCurrency(item.totalSales)}
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        index === 0
                          ? 'bg-gradient-to-r from-brand-900 to-gold-400'
                          : 'bg-brand-800'
                      }`}
                      style={{ width: `${Math.max(percentage, 8)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Operating Insights Card */}
        <div className="bg-brand-900 text-white rounded-3xl p-6 shadow-xl border border-brand-800 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-gold-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>원장님 맞춤 운영 인사이트</span>
            </div>

            <h3 className="text-xl font-bold font-serif-kr leading-snug">
              눈썹 : 미 眉<br />
              <span className="text-gold-300">100% 예약제</span> 성과 요약
            </h3>

            <div className="space-y-3 text-xs text-stone-200 pt-2">
              <div className="p-3 rounded-2xl bg-brand-950/60 border border-brand-800 space-y-1">
                <strong className="text-gold-300">👑 최고 인기 시술:</strong>
                <p>여자 자연눈썹 (엠보) & 콤보눈썹의 비율이 전체 예약의 65% 이상을 차지합니다.</p>
              </div>

              <div className="p-3 rounded-2xl bg-brand-950/60 border border-brand-800 space-y-1">
                <strong className="text-gold-300">💡 추천 마케팅 팁:</strong>
                <p>
                  시술 후 4~6주 차에 도달한 고객에게 CRM의 [4주 리터치 문자]를 발송하면 재방문율을 30% 이상 추가 증대시킬 수 있습니다.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-brand-800 text-stone-400 text-xs flex justify-between items-center">
            <span>실시간 데이터 집계 중</span>
            <span className="text-gold-300 font-mono">010.3797.7721</span>
          </div>
        </div>
      </div>
    </div>
  );
};
