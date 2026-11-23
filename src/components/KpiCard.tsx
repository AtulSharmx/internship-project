import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { formatDelta } from '../utils/formatters';

interface KpiCardProps {
  title: string;
  value: string | number;
  subValue?: string;
  subLabel?: string;
  delta: number;
  comparisonLabel: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  subValue,
  subLabel,
  delta,
  comparisonLabel,
  icon,
  onClick
}) => {
  const deltaInfo = formatDelta(delta);

  return (
    <div
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
      role="button"
      tabIndex={0}
      className="group relative bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs hover:shadow-sm hover:border-blue-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-all cursor-pointer flex flex-col justify-between"
    >
      <div className="flex items-center gap-2">
        <span className="text-slate-400 shrink-0">
          {icon}
        </span>
        <span className="text-[11px] font-bold text-slate-700 group-hover:text-slate-900 transition-colors leading-tight">
          {title}
        </span>
      </div>

      <div className="my-2 flex items-baseline justify-between gap-1.5">
        <span className="text-2xl font-bold tracking-tight text-slate-900">
          {value}
        </span>
        {subValue && (
          <div className="text-right">
            <span className="block text-[11px] font-bold text-slate-700 tabular-nums">
              {subValue}
            </span>
            {subLabel && (
              <span className="block text-[9px] text-slate-400 font-medium">
                {subLabel}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-1 text-[10px] font-medium pt-1 border-t border-slate-100">
        {deltaInfo.isNeutral ? (
          <span className="inline-flex items-center text-slate-500 shrink-0">
            <Minus className="w-2.5 h-2.5 mr-0.5" />
            0.0%
          </span>
        ) : deltaInfo.isPositive ? (
          <span className="inline-flex items-center text-emerald-600 font-bold shrink-0">
            <TrendingUp className="w-2.5 h-2.5 mr-0.5 stroke-[2.5]" />
            {deltaInfo.text}
          </span>
        ) : (
          <span className="inline-flex items-center text-rose-600 font-bold shrink-0">
            <TrendingDown className="w-2.5 h-2.5 mr-0.5 stroke-[2.5]" />
            {deltaInfo.text}
          </span>
        )}
        <span className="text-slate-400 text-[9.5px] truncate">
          {comparisonLabel}
        </span>
      </div>
    </div>
  );
};
