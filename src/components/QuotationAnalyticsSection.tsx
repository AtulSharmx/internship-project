import React from 'react';
import { 
  FileText, 
  BarChart3, 
  Layers, 
  Table as TableIcon, 
  Percent, 
  ArrowUpRight,
  ChevronRight
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Cell 
} from 'recharts';
import { useDashboard } from '../context/DashboardContext';
import { formatINR, formatPercent } from '../utils/formatters';

export const QuotationAnalyticsSection: React.FC = () => {
  const { 
    quotationsByService, 
    quotationValueByService, 
    serviceWiseQuotationDetails, 
    quoteToDealConvRate,
    openDrillDown,
    filteredQuotations,
    filteredDeals
  } = useDashboard();

  return (
    <section aria-label="Quotation Analytics" className="mt-6">
      
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded-md bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
          <FileText className="w-3.5 h-3.5" />
        </div>
        <h2 className="text-base font-bold text-slate-900 tracking-tight">
          Quotation Analytics
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        
        {/* 1. Quotations by Service / Order Category */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
              Quotations by Service
            </h3>
            <span className="text-[11px] text-slate-400 font-medium font-mono tabular-nums">
              Total: {filteredQuotations.length}
            </span>
          </div>

          <div className="h-48 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={quotationsByService.slice(0, 6)} margin={{ top: 15, right: 5, left: -25, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 9, fill: '#64748b' }} 
                  interval={0}
                  angle={-25}
                  textAnchor="end"
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                />
                <YAxis 
                  tick={{ fontSize: 9, fill: '#64748b' }} 
                  tickLine={false} 
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white text-xs p-2 rounded-lg shadow-lg border border-slate-800">
                          <p className="font-bold text-blue-400">{data.name}</p>
                          <p className="font-mono tabular-nums">{data.count} quotations</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">Click bar to inspect quotes</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar 
                  dataKey="count" 
                  fill="#2563eb" 
                  radius={[4, 4, 0, 0]}
                  onClick={(entry: any) => openDrillDown({
                    type: 'quotation_list',
                    title: `Quotations: ${entry?.name || 'Service'}`,
                    subtitle: `${entry?.count || ''} quotations generated for ${entry?.name || 'Service'}`,
                    records: filteredQuotations.filter(q => q.serviceId === entry?.serviceId)
                  })}
                  className="cursor-pointer hover:opacity-85 transition-opacity"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Highest volume</span>
            <span className="font-semibold text-blue-600">Private Limited (56 quotes)</span>
          </div>
        </div>

        {/* 2. Quotation Value by Service */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-600" />
              Quotation Value by Service
            </h3>
            <span className="text-[11px] text-slate-400 font-medium">Value Share</span>
          </div>

          <div className="py-2 space-y-2.5 overflow-y-auto max-h-48 pr-1">
            {quotationValueByService.slice(0, 6).map((item, idx) => {
              const barColors = ['#2563eb', '#3b82f6', '#0ea5e9', '#10b981', '#f59e0b', '#8b5cf6'];
              const color = barColors[idx % barColors.length];

              return (
                <div 
                  key={item.serviceId}
                  onClick={() => openDrillDown({
                    type: 'quotation_list',
                    title: `Quotations: ${item.name}`,
                    subtitle: `${formatINR(item.value)} total quoted value`,
                    records: filteredQuotations.filter(q => q.serviceId === item.serviceId)
                  })}
                  className="group hover:bg-slate-50 p-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
                      <span className="font-medium text-slate-700 truncate group-hover:text-blue-600 transition-colors">
                        {item.name}
                      </span>
                    </div>
                    <div className="text-right shrink-0 font-mono tabular-nums">
                      <span className="font-bold text-slate-900">{formatINR(item.value)}</span>
                      <span className="text-[10px] text-slate-400 ml-1">({formatPercent(item.percentage, 0)})</span>
                    </div>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-300"
                      style={{ 
                        width: `${Math.min(100, Math.max(4, item.percentage))}%`,
                        backgroundColor: color
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Leading revenue driver</span>
            <span className="font-semibold text-slate-700">Pvt Ltd (32% of pipeline)</span>
          </div>
        </div>

        {/* 3. Service Wise Quotation Details (Table) */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs flex flex-col justify-between md:col-span-2 xl:col-span-1">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <TableIcon className="w-3.5 h-3.5 text-blue-600" />
              Service Wise Quotation Details
            </h3>
            <span className="text-[10px] text-slate-400">Click row to inspect</span>
          </div>

          <div className="overflow-x-auto max-h-48 my-1">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-[10px] uppercase font-bold text-slate-500 tracking-wider sticky top-0">
                <tr>
                  <th className="py-1.5 px-2">Service</th>
                  <th className="py-1.5 px-1 text-center">Quotes</th>
                  <th className="py-1.5 px-1.5 text-right">Quoted Amt</th>
                  <th className="py-1.5 px-1 text-center">Acc.</th>
                  <th className="py-1.5 px-1 text-center">Pend.</th>
                  <th className="py-1.5 px-1 text-center">Rej.</th>
                  <th className="py-1.5 px-1.5 text-right">Conv.%</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono tabular-nums text-[11px]">
                {serviceWiseQuotationDetails.slice(0, 5).map(row => (
                  <tr 
                    key={row.serviceId}
                    onClick={() => openDrillDown({
                      type: 'quotation_list',
                      title: `Quotations: ${row.serviceName}`,
                      subtitle: `${row.quotationsCount} quotes • Quoted amount: ${formatINR(row.quotedAmount)}`,
                      records: filteredQuotations.filter(q => q.serviceId === row.serviceId)
                    })}
                    className="hover:bg-blue-50/50 transition-colors cursor-pointer group"
                  >
                    <td className="py-1.5 px-2 font-sans font-medium text-slate-800 truncate max-w-[90px] group-hover:text-blue-600">
                      {row.serviceName.replace(' Company Registration', '').replace(' Registration', '')}
                    </td>
                    <td className="py-1.5 px-1 text-center font-bold text-slate-700">{row.quotationsCount}</td>
                    <td className="py-1.5 px-1.5 text-right font-bold text-slate-900">{formatINR(row.quotedAmount)}</td>
                    <td className="py-1.5 px-1 text-center text-emerald-600 font-bold">{row.accepted}</td>
                    <td className="py-1.5 px-1 text-center text-amber-600 font-bold">{row.pending}</td>
                    <td className="py-1.5 px-1 text-center text-rose-500">{row.rejected}</td>
                    <td className="py-1.5 px-1.5 text-right font-bold text-blue-600">{formatPercent(row.convRate, 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            onClick={() => openDrillDown({
              type: 'quotation_list',
              title: 'All Active Quotations',
              subtitle: 'Full service breakdown across all categories',
              records: filteredQuotations
            })}
            className="w-full mt-1 text-center text-[11px] font-semibold text-blue-600 hover:text-blue-800 py-1 border border-slate-100 rounded bg-slate-50 hover:bg-blue-50/50 transition-colors cursor-pointer"
          >
            View All {serviceWiseQuotationDetails.length} Services
          </button>
        </div>

        {/* 4. Quote to Deal Conversion Rate */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Percent className="w-3.5 h-3.5 text-blue-600" />
              Quote to Deal Conv. Rate
            </h3>
            <span className="text-[11px] text-slate-400 font-medium">Win Ratio</span>
          </div>

          <div className="my-auto py-3 flex flex-col items-center justify-center">
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#e2e8f0"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#2563eb"
                  strokeWidth="8"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - (quoteToDealConvRate.rate / 100))}`}
                  strokeLinecap="round"
                  className="transition-all duration-700 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-black text-slate-900 font-mono tabular-nums leading-none">
                  {formatPercent(quoteToDealConvRate.rate, 1)}
                </span>
                <span className="text-[10px] text-slate-500 font-medium mt-1">Win Rate</span>
              </div>
            </div>

            <div className="mt-2 text-center">
              <p className="text-xs font-semibold text-slate-700 font-mono tabular-nums">
                {quoteToDealConvRate.dealsCount} Deals / {quoteToDealConvRate.quotesCount} Quotations
              </p>
              <p className="text-[10px] text-slate-400">Proposals closed into confirmed business</p>
            </div>
          </div>

          <button
            onClick={() => openDrillDown({
              type: 'deal_list',
              title: 'Won Deals from Quotations',
              subtitle: `${quoteToDealConvRate.dealsCount} deals converted out of ${quoteToDealConvRate.quotesCount} quotations`,
              records: filteredDeals
            })}
            className="w-full mt-2 text-center text-xs font-semibold text-blue-600 hover:text-blue-800 py-1.5 border border-blue-100 hover:border-blue-200 rounded-lg bg-blue-50/50 hover:bg-blue-50 transition-colors cursor-pointer flex items-center justify-center gap-1"
          >
            <span>Inspect Converted Deals</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </section>
  );
};
