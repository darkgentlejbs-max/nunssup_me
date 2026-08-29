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
    <div className="bg-white rounded-2xl border border-stone-200/80 hover:border-gold-400/60 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group">
      <div className="p-6">
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-50 text-brand-800 border border-brand-200/60">
            {service.category}
          </span>
          {service.tag && (
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gold-50 text-gold-700 border border-gold-300/60 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-gold-500" />
              {service.tag}
            </span>
          )}
        </div>

        {/* Service Name & Price */}
        <div className="mb-3">
          <h3 className="text-lg font-bold text-stone-900 group-hover:text-brand-900 transition-colors">
            {service.name}
          </h3>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-extrabold text-brand-900 font-mono">
              {formatCurrency(service.price)}
            </span>
            <span className="text-xs text-stone-400">/ 1회 (리터치 포함 여부 상담)</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-stone-600 leading-relaxed mb-4">
          {service.description}
        </p>

        {/* Recommended for */}
        <div className="bg-stone-50 rounded-xl p-3 border border-stone-100 text-xs text-stone-600 flex items-start gap-2">
          <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-stone-800">추천 대상: </span>
            <span>{service.recommendedFor}</span>
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="px-6 py-4 bg-stone-50/80 border-t border-stone-100 flex items-center justify-between">
        <span className="flex items-center gap-1 text-xs font-medium text-stone-500">
          <Clock className="w-3.5 h-3.5 text-stone-400" />
          소요 시간 약 {service.durationMinutes}분
        </span>

        <button
          onClick={() => onBook(service)}
          className="px-4 py-2 bg-brand-900 hover:bg-brand-800 text-gold-300 hover:text-white rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow hover:scale-105 active:scale-95 flex items-center gap-1.5"
        >
          <span>예약하기</span>
          <span className="text-xs">→</span>
        </button>
      </div>
    </div>
  );
};
