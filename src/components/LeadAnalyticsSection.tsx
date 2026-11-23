import React from 'react';
import { 
  Target, 
  Filter, 
  TrendingUp, 
  PieChart as PieIcon,
  ChevronRight,
  Info
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { useDashboard } from '../context/DashboardContext';
import { formatINR, formatPercent } from '../utils/formatters';

export const LeadAnalyticsSection: React.FC = () => {
  const { 
    targetAchievement, 
    leadFunnel, 
    dailyLeadTrend, 
    leadSources,
    openDrillDown,
    filteredLeads,
    filteredDeals
  } = useDashboard();

  return (
    <section aria-label="Lead Analytics" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-4">
      
      <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="text-slate-400 flex items-center justify-center">
              <Target className="w-3.5 h-3.5" />
            </div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">Target Achievement</h2>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">Monthly Pacing</span>
        </div>

        <div className="my-3">
          <span className="text-[11px] font-medium text-slate-500 block">Collections target, this window</span>
          <span className="text-2xl font-black text-slate-900 tracking-tight font-mono tabular-nums">
            {formatINR(targetAchievement.target)}
          </span>
        </div>

        <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 my-1">
          <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
            <span className="text-slate-600">Target vs Achieved</span>
            <span className="font-bold text-blue-700 font-mono tabular-nums">
              {formatPercent(targetAchievement.achievedPct, 2)}
            </span>
          </div>

          <div className="w-full h-3.5 bg-slate-200 rounded-full overflow-hidden flex shadow-inner">
            <div 
              style={{ width: `${Math.min(100, Math.max(2, targetAchievement.achievedPct))}%` }}
              className="bg-emerald-500 h-full transition-all duration-500 rounded-l-full"
            />
          </div>

          <div className="mt-3 space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-slate-600">Achieved</span>
              </div>
              <span className="font-semibold text-slate-800 font-mono tabular-nums">
                {formatINR(targetAchievement.achieved)} ({formatPercent(targetAchievement.achievedPct, 1)})
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-400" />
                <span className="text-slate-600">Remaining</span>
              </div>
              <span className="font-semibold text-slate-500 font-mono tabular-nums">
                {formatINR(targetAchievement.remaining)} ({formatPercent(100 - targetAchievement.achievedPct, 1)})
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => openDrillDown({
            type: 'deal_list',
            title: 'Revenue Contributing Deals',
            subtitle: `${formatINR(targetAchievement.achieved)} collected from deals closed in period`,
            records: filteredDeals
          })}
          className="w-full mt-2 text-center text-xs font-semibold text-blue-600 hover:text-blue-800 py-1.5 border border-blue-100 hover:border-blue-200 rounded-lg bg-blue-50/50 hover:bg-blue-50 transition-colors cursor-pointer flex items-center justify-center gap-1"
        >
          <span>View Revenue Breakdown</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="text-slate-400 flex items-center justify-center">
              <Filter className="w-3.5 h-3.5" />
            </div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">Lead Funnel</h2>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">Stage Retention</span>
        </div>

        <div className="py-2 flex flex-col gap-2 relative">
          
          <div 
            onClick={() => openDrillDown({
              type: 'lead_list',
              title: 'Funnel Stage 1: New Leads',
              subtitle: '100% of top-of-funnel inbound inquiries',
              records: filteredLeads
            })}
            className="w-full bg-[#256abf] hover:bg-[#1c5cab] text-white p-2.5 rounded-lg shadow-2xs cursor-pointer transition-all"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold">New Leads</span>
              <span className="font-mono tabular-nums font-semibold">{leadFunnel.total} (100%)</span>
            </div>
          </div>

          <div 
            onClick={() => openDrillDown({
              type: 'lead_list',
              title: 'Funnel Stage 2: Qualified Leads',
              subtitle: `${leadFunnel.qualified} qualified prospects (${formatPercent(leadFunnel.qualifiedPct)})`,
              records: filteredLeads.filter(l => l.status === 'qualified' || l.status === 'converted')
            })}
            style={{ width: '84%', margin: '0 auto' }}
            className="bg-[#184f95] hover:bg-[#14447f] text-white p-2 rounded-lg shadow-2xs cursor-pointer transition-all"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold">Qualified</span>
              <span className="font-mono tabular-nums font-semibold">
                {leadFunnel.qualified} ({formatPercent(leadFunnel.qualifiedPct)})
              </span>
            </div>
          </div>

          <div 
            onClick={() => openDrillDown({
              type: 'lead_list',
              title: 'Funnel Stage 3: Converted Leads',
              subtitle: `${leadFunnel.converted} paying clients (${formatPercent(leadFunnel.convertedPct)})`,
              records: filteredLeads.filter(l => l.status === 'converted')
            })}
            style={{ width: '68%', margin: '0 auto' }}
            className="bg-[#0d366b] hover:bg-[#0a2c58] text-white p-2 rounded-lg shadow-2xs cursor-pointer transition-all"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold">Converted</span>
              <span className="font-mono tabular-nums font-semibold">
                {leadFunnel.converted} ({formatPercent(leadFunnel.convertedPct)})
              </span>
            </div>
          </div>

          <div 
            onClick={() => openDrillDown({
              type: 'lead_list',
              title: 'Unqualified / Disqualified Leads',
              subtitle: `${leadFunnel.unqualified} leads dropped during qualification`,
              records: filteredLeads.filter(l => l.status === 'unqualified')
            })}
            className="mt-1 p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-600 transition-colors cursor-pointer flex items-center justify-between text-xs"
          >
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              <span className="font-semibold">Unqualified Drop-off</span>
            </div>
            <span className="font-bold text-slate-700 font-mono tabular-nums">
              {leadFunnel.unqualified} ({formatPercent(leadFunnel.unqualifiedPct)})
            </span>
          </div>
        </div>

        <p className="text-[10px] text-slate-400 text-center">
          Click any stage to drill down into corresponding leads
        </p>
      </div>

      <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="text-slate-400 flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">Daily Lead Trend</h2>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-medium">
            <span className="inline-flex items-center gap-1 text-slate-600">
              <span className="w-2 h-2 rounded-full bg-[#2a78d6]" /> New
            </span>
            <span className="inline-flex items-center gap-1 text-slate-600">
              <span className="w-2 h-2 rounded-full bg-[#eb6834]" /> Qual.
            </span>
            <span className="inline-flex items-center gap-1 text-slate-600">
              <span className="w-2 h-2 rounded-full bg-[#1baf7a]" /> Conv.
            </span>
          </div>
        </div>

        <div className="h-44 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dailyLeadTrend} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="displayDate" 
                tick={{ fontSize: 9, fill: '#64748b' }} 
                tickLine={false} 
                axisLine={{ stroke: '#e2e8f0' }}
                interval="preserveStartEnd"
              />
              <YAxis 
                tick={{ fontSize: 9, fill: '#64748b' }} 
                tickLine={false} 
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0f172a', 
                  borderRadius: '8px', 
                  border: 'none', 
                  color: '#fff', 
                  fontSize: '11px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                labelStyle={{ fontWeight: 'bold', color: '#93c5fd', marginBottom: '4px' }}
              />
              <Line 
                type="monotone" 
                dataKey="newLeads" 
                name="New Leads" 
                stroke="#2a78d6" 
                strokeWidth={2} 
                dot={{ r: 2, fill: '#2a78d6' }}
                activeDot={{ r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="qualified" 
                name="Qualified" 
                stroke="#eb6834" 
                strokeWidth={2} 
                dot={{ r: 2, fill: '#eb6834' }}
                activeDot={{ r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="converted" 
                name="Converted" 
                stroke="#1baf7a" 
                strokeWidth={2} 
                dot={{ r: 2, fill: '#1baf7a' }}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>Inbound intake pacing</span>
          <span className="font-semibold text-slate-700">Daily Average: {(leadFunnel.total / Math.max(1, dailyLeadTrend.length)).toFixed(1)} leads/day</span>
        </div>
      </div>

      <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="text-slate-400 flex items-center justify-center">
              <PieIcon className="w-3.5 h-3.5" />
            </div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">Lead Sources</h2>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">Acquisition Channel</span>
        </div>

        <div className="flex items-center gap-2 py-2">
          <div className="w-1/2 h-36 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={leadSources}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={36}
                  outerRadius={52}
                  paddingAngle={3}
                >
                  {leadSources.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    borderRadius: '8px', 
                    border: 'none', 
                    color: '#fff', 
                    fontSize: '11px' 
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              <span className="text-sm font-black text-slate-900 font-mono tabular-nums leading-none">
                {leadFunnel.total}
              </span>
              <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 mt-0.5">
                Total
              </span>
            </div>
          </div>

          <div className="w-1/2 space-y-1.5 text-xs">
            {leadSources.map(source => (
              <div 
                key={source.name}
                onClick={() => openDrillDown({
                  type: 'lead_list',
                  title: `Leads from ${source.name}`,
                  subtitle: `${source.count} leads acquired via ${source.name}`,
                  records: filteredLeads.filter(l => l.source === source.name)
                })}
                className="group flex items-center justify-between p-1 rounded-md hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-1.5 truncate">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: source.color }} />
                  <span className="text-slate-600 truncate text-[11px] group-hover:text-slate-900">{source.name}</span>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-bold text-slate-800 text-[11px] font-mono tabular-nums">
                    {source.count}
                  </span>
                  <span className="text-[10px] text-slate-400 ml-1">
                    ({formatPercent(source.percentage, 1)})
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>Primary driver</span>
          <span className="font-semibold text-blue-600">Google Ads (76.9%)</span>
        </div>
      </div>
    </section>
  );
};
