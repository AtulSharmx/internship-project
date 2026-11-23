import React from 'react';
import { 
  IndianRupee, 
  TrendingUp, 
  BarChart2, 
  Flame, 
  ArrowUpRight,
  ShieldAlert,
  Wallet,
  CheckCircle,
  Clock
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { useDashboard } from '../context/DashboardContext';
import { formatINR, formatINRShort, formatPercent } from '../utils/formatters';

export const DealsRevenueSection: React.FC = () => {
  const { 
    dealsVsRevenueByService, 
    revenueByCategory, 
    priorityBreakdown, 
    dailyRevenueTrend, 
    totalVsCollectedRevenue,
    openDrillDown,
    filteredDeals
  } = useDashboard();

  return (
    <section aria-label="Deals and Revenue" className="mt-6">
      
      <div className="flex items-center gap-2 mb-3">
        <div className="text-slate-400 flex items-center justify-center">
          <IndianRupee className="w-3.5 h-3.5" />
        </div>
        <h2 className="text-base font-bold text-slate-900 tracking-tight">
          Deals & Revenue
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
        
        {/* 1. Deals Created vs Deal Revenue (by Service) */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 truncate">
              Deals by service
            </h3>
            <span className="text-[10px] text-slate-400 shrink-0">count</span>
          </div>

          <div className="h-48 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dealsVsRevenueByService.slice(0, 5)} margin={{ top: 15, right: 5, left: -25, bottom: 20 }}>
                <CartesianGrid vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="serviceName" 
                  tick={{ fontSize: 9, fill: '#64748b' }} 
                  interval={0}
                  angle={-25}
                  textAnchor="end"
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                />
                <YAxis 
                  yAxisId="left"
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
                          <p className="font-bold text-amber-400">{data.serviceName}</p>
                          <p className="font-mono tabular-nums">{data.dealsCreated} deals created</p>
                          <p className="font-mono tabular-nums text-emerald-400 font-semibold">{formatINR(data.dealRevenue)} revenue</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar 
                  yAxisId="left"
                  dataKey="dealsCreated" 
                  name="Deals Created" 
                  fill="#2563eb" 
                  radius={[4, 4, 0, 0]}
                  onClick={(entry: any) => openDrillDown({
                    type: 'deal_list',
                    title: `Deals: ${entry?.serviceName || 'Service'}`,
                    subtitle: `${entry?.dealsCreated || ''} deals closed • ${formatINR(entry?.dealRevenue || 0)} total`,
                    records: filteredDeals.filter(d => d.serviceName.includes(entry?.serviceName || '') || (entry?.serviceName || '').includes(d.serviceName))
                  })}
                  className="cursor-pointer hover:opacity-85"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Leading deal volume</span>
            <span className="font-semibold text-blue-600">Pvt Ltd & Filings</span>
          </div>
        </div>

        {/* 2. Revenue by Order / Service Category */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Revenue by Category
            </h3>
            <span className="text-[11px] text-slate-400 font-medium">Distribution</span>
          </div>

          <div className="py-2 space-y-2 overflow-y-auto max-h-48 pr-1">
            {revenueByCategory.slice(0, 6).map(item => (
              <div 
                key={item.category}
                onClick={() => openDrillDown({
                  type: 'deal_list',
                  title: `Category: ${item.category}`,
                  subtitle: `${formatINR(item.revenue)} total revenue (${formatPercent(item.percentage)})`,
                  records: filteredDeals.filter(d => d.category === item.category)
                })}
                className="group hover:bg-slate-50 p-1.5 rounded-lg transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-medium text-slate-700 truncate group-hover:text-blue-600">
                    {item.category}
                  </span>
                  <div className="text-right shrink-0 font-mono tabular-nums">
                    <span className="font-bold text-slate-900">{formatINRShort(item.revenue)}</span>
                    <span className="text-[10px] text-slate-400 ml-1">({formatPercent(item.percentage, 1)})</span>
                  </div>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, Math.max(5, item.percentage))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Primary category</span>
            <span className="font-semibold text-slate-700">Company Reg & Filings</span>
          </div>
        </div>

        {/* 3. Priority Breakdown */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              Priority Breakdown
            </h3>
            <span className="text-[11px] text-slate-400 font-medium">Urgency</span>
          </div>

          <div className="my-auto py-2">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-400">
                <tr>
                  <th className="py-1 px-1.5">Priority</th>
                  <th className="py-1 px-1 text-center">Deals</th>
                  <th className="py-1 px-1.5 text-right">Revenue</th>
                  <th className="py-1 px-1 text-right">%</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono tabular-nums text-xs">
                {/* High Priority */}
                <tr 
                  onClick={() => openDrillDown({
                    type: 'deal_list',
                    title: 'High Priority Deals',
                    subtitle: `${priorityBreakdown.high.count} deals requiring urgent completion`,
                    records: filteredDeals.filter(d => d.priority === 'high')
                  })}
                  className="hover:bg-rose-50/50 cursor-pointer transition-colors"
                >
                  <td className="py-2 px-1.5 font-sans flex items-center gap-1.5 text-rose-600 font-bold">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    High
                  </td>
                  <td className="py-2 px-1 text-center font-bold text-slate-800">{priorityBreakdown.high.count}</td>
                  <td className="py-2 px-1.5 text-right font-bold text-slate-900">{formatINR(priorityBreakdown.high.revenue)}</td>
                  <td className="py-2 px-1 text-right font-bold text-rose-600">{formatPercent(priorityBreakdown.high.percentage, 1)}</td>
                </tr>

                {/* Medium Priority */}
                <tr 
                  onClick={() => openDrillDown({
                    type: 'deal_list',
                    title: 'Medium Priority Deals',
                    subtitle: `${priorityBreakdown.medium.count} standard SLA deals`,
                    records: filteredDeals.filter(d => d.priority === 'medium')
                  })}
                  className="hover:bg-amber-50/50 cursor-pointer transition-colors"
                >
                  <td className="py-2 px-1.5 font-sans flex items-center gap-1.5 text-amber-600 font-bold">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    Medium
                  </td>
                  <td className="py-2 px-1 text-center font-bold text-slate-800">{priorityBreakdown.medium.count}</td>
                  <td className="py-2 px-1.5 text-right font-bold text-slate-900">{formatINR(priorityBreakdown.medium.revenue)}</td>
                  <td className="py-2 px-1 text-right font-bold text-amber-600">{formatPercent(priorityBreakdown.medium.percentage, 1)}</td>
                </tr>

                {/* Low Priority */}
                <tr 
                  onClick={() => openDrillDown({
                    type: 'deal_list',
                    title: 'Low Priority Deals',
                    subtitle: `${priorityBreakdown.low.count} low priority deals`,
                    records: filteredDeals.filter(d => d.priority === 'low')
                  })}
                  className="hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <td className="py-2 px-1.5 font-sans flex items-center gap-1.5 text-slate-500 font-bold">
                    <span className="w-2 h-2 rounded-full bg-slate-400" />
                    Low
                  </td>
                  <td className="py-2 px-1 text-center font-bold text-slate-800">{priorityBreakdown.low.count}</td>
                  <td className="py-2 px-1.5 text-right font-bold text-slate-900">{formatINR(priorityBreakdown.low.revenue)}</td>
                  <td className="py-2 px-1 text-right font-bold text-slate-500">{formatPercent(priorityBreakdown.low.percentage, 1)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>High priority share</span>
            <span className="font-semibold text-rose-600">{formatPercent(priorityBreakdown.high.percentage, 0)} of revenue</span>
          </div>
        </div>

        {/* 4. Daily Revenue Trend */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Daily Revenue Trend
            </h3>
            <div className="flex items-center gap-2 text-[10px]">
              <span className="inline-flex items-center gap-1 text-blue-600 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600" /> Booked
              </span>
              <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Collected
              </span>
            </div>
          </div>

          <div className="h-48 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyRevenueTrend} margin={{ top: 15, right: 5, left: -25, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="displayDate" 
                  tick={{ fontSize: 9, fill: '#64748b' }} 
                  interval="preserveStartEnd"
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                />
                <YAxis 
                  tick={{ fontSize: 9, fill: '#64748b' }} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(val) => `₹${Math.round(val / 1000)}k`}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white text-xs p-2 rounded-lg shadow-lg border border-slate-800">
                          <p className="font-bold text-blue-400">{data.displayDate}</p>
                          <p className="font-mono tabular-nums">Booked: {formatINR(data.revenue)}</p>
                          <p className="font-mono tabular-nums text-emerald-400">Collected: {formatINR(data.collected)}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                <Bar dataKey="collected" fill="#10b981" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Inflow tracking</span>
            <span className="font-semibold text-emerald-600">Daily Cash Flow Active</span>
          </div>
        </div>

        {/* 5. Total vs Collected Revenue Summary */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Total vs Collected
            </h3>
            <span className="text-[11px] text-slate-400 font-medium">Liquidity</span>
          </div>

          <div className="my-auto space-y-3 py-1">
            <div 
              onClick={() => openDrillDown({
                type: 'deal_list',
                title: 'All Invoiced Deals',
                subtitle: `${formatINR(totalVsCollectedRevenue.totalDealValue)} total pipeline value`,
                records: filteredDeals
              })}
              className="bg-blue-50/60 hover:bg-blue-50 border border-blue-100 p-3 rounded-xl transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="w-5 h-5 rounded-md bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                  ₹
                </div>
                <span className="text-xs font-medium text-slate-600 group-hover:text-blue-700">
                  Total Deal Value
                </span>
              </div>
              <p className="text-xl font-black text-slate-900 font-mono tabular-nums">
                {formatINR(totalVsCollectedRevenue.totalDealValue)}
              </p>
            </div>

            <div 
              onClick={() => openDrillDown({
                type: 'deal_list',
                title: 'Collected Revenue Deals',
                subtitle: `${formatINR(totalVsCollectedRevenue.netCollectedRevenue)} in cleared funds`,
                records: filteredDeals.filter(d => d.collectedAmount > 0)
              })}
              className="bg-emerald-50/60 hover:bg-emerald-50 border border-emerald-100 p-3 rounded-xl transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="w-5 h-5 rounded-md bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                  ✓
                </div>
                <span className="text-xs font-medium text-slate-600 group-hover:text-emerald-700">
                  Net Collected Revenue
                </span>
              </div>
              <p className="text-xl font-black text-emerald-700 font-mono tabular-nums">
                {formatINR(totalVsCollectedRevenue.netCollectedRevenue)}
              </p>
            </div>

            <div 
              onClick={() => openDrillDown({
                type: 'deal_list',
                title: 'Outstanding Receivables',
                subtitle: `${formatINR(totalVsCollectedRevenue.outstandingRevenue)} pending client collection`,
                records: filteredDeals.filter(d => d.outstandingAmount > 0)
              })}
              className="flex items-center justify-between px-2 py-1.5 bg-amber-50/70 border border-amber-200/60 rounded-lg text-xs cursor-pointer hover:bg-amber-50"
            >
              <div className="flex items-center gap-1.5 text-amber-800 font-medium">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>Outstanding Balance</span>
              </div>
              <span className="font-bold text-amber-900 font-mono tabular-nums">
                {formatINR(totalVsCollectedRevenue.outstandingRevenue)}
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Collection efficiency</span>
            <span className="font-semibold text-emerald-600">
              {formatPercent((totalVsCollectedRevenue.netCollectedRevenue / (totalVsCollectedRevenue.totalDealValue || 1)) * 100, 1)} Collected
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};
