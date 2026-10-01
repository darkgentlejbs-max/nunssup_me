import React from 'react';
import { ServiceItem } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { Clock, Sparkles, Check } from 'lucide-react';

interface ServiceCardProps {
  service: ServiceItem;
  onBook: (service: ServiceItem) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onBook }) => {
  return (
    <div className="bg-white rounded-2xl border border-[#ebdcd0] hover:border-[#df9a8c]/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group">
      <div className="p-6">
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#faf5ee] text-[#543d2b] border border-[#e8dbca]">
            {service.category}
          </span>
          {service.tag && (
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#fdf5f3] text-[#df9a8c] border border-[#f5dad3] flex items-center gap-1 font-bold">
              <Sparkles className="w-3 h-3 text-[#df9a8c]" />
              {service.tag}
            </span>
          )}
        </div>

        {/* Service Name & Price */}
        <div className="mb-3">
          <h3 className="text-lg font-bold text-[#3e2c1e] group-hover:text-[#df9a8c] transition-colors">
            {service.name}
          </h3>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-extrabold text-[#3e2c1e] font-mono">
              {formatCurrency(service.price)}
            </span>
            <span className="text-xs text-stone-400">/ 1회 (리터치 포함 여부 상담)</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-[#5a483a] leading-relaxed mb-4">
          {service.description}
        </p>

        {/* Recommended for */}
        <div className="bg-[#faf6f0] rounded-xl p-3 border border-[#f0e4d6] text-xs text-[#5a483a] flex items-start gap-2">
          <Check className="w-4 h-4 text-[#df9a8c] flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-[#3e2c1e]">추천 대상: </span>
            <span>{service.recommendedFor}</span>
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="px-6 py-4 bg-[#fbf8f3] border-t border-[#f0e4d6] flex items-center justify-between">
        <span className="flex items-center gap-1 text-xs font-medium text-stone-500">
          <Clock className="w-3.5 h-3.5 text-stone-400" />
          소요 시간 약 {service.durationMinutes}분
        </span>

        <button
          onClick={() => onBook(service)}
          className="px-4 py-2 bg-[#3e2c1e] hover:bg-[#df9a8c] text-white rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow hover:scale-105 active:scale-95 flex items-center gap-1.5"
        >
          <span>예약하기</span>
          <span className="text-xs">→</span>
        </button>
      </div>
    </div>
  );
};
