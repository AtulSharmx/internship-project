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
  iconBgColor?: string;
  onClick?: () => void;
  accentBorderColor?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  subValue,
  subLabel,
  delta,
  comparisonLabel,
  icon,
  iconBgColor = 'bg-blue-50 text-blue-600',
  onClick,
  accentBorderColor
}) => {
  const deltaInfo = formatDelta(delta);

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      className={`group relative bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs hover:shadow-sm hover:border-blue-400 transition-all cursor-pointer flex flex-col justify-between ${
        accentBorderColor ? `hover:${accentBorderColor}` : ''
      }`}
    >
      {/* Top Header */}
      <div className="flex items-center gap-2">
        <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${iconBgColor}`}>
          {icon}
        </div>
        <span className="text-[11px] font-bold text-slate-700 group-hover:text-slate-900 transition-colors leading-tight">
          {title}
        </span>
      </div>

      {/* Main Metric Value + Secondary Sub-metric */}
      <div className="my-2 flex items-baseline justify-between gap-1.5">
        <span className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
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

      {/* Bottom Delta Indicator */}
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
