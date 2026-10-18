import React from 'react';
import { 
  Users, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Activity, 
  ExternalLink,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import { formatINR, formatPercent, formatDateTime } from '../utils/formatters';

export const OperationsTeamSection: React.FC = () => {
  const { 
    salesTeamActivity, 
    operationsTeamActivity, 
    ordersAndStageProgress, 
    filteredActivities,
    openDrillDown,
    inspectLead,
    inspectDeal,
    inspectOrder,
    inspectPayment,
    filteredLeads,
    filteredDeals,
    filteredOrders,
    filteredPayments
  } = useDashboard();

  return (
    <section aria-label="Operations and Team Activity" className="mt-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        
        {/* 1. Sales Team Activity */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-blue-600" />
              Sales Team Activity
            </h3>
            <span className="text-[10px] bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded-full border border-blue-200">
              Sales Reps
            </span>
          </div>

          <div className="overflow-x-auto max-h-56 my-2">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-400 sticky top-0">
                <tr>
                  <th className="py-1 px-1.5">Rep</th>
                  <th className="py-1 px-1 text-center">Leads</th>
                  <th className="py-1 px-1 text-center">Qual.</th>
                  <th className="py-1 px-1 text-center">Conv.</th>
                  <th className="py-1 px-1 text-right">Conv.%</th>
                  <th className="py-1 px-1.5 text-right">Rev (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono tabular-nums text-xs">
                {salesTeamActivity.map(member => (
                  <tr 
                    key={member.id}
                    onClick={() => openDrillDown({
                      type: 'deal_list',
                      title: `Sales Portfolio: ${member.name}`,
                      subtitle: `${member.leadsHandled} leads handled • ${member.deals} deals closed • ${formatINR(member.revenue)} revenue`,
                      records: filteredDeals.filter(d => d.assignedSalesId === member.id)
                    })}
                    className="hover:bg-blue-50/50 cursor-pointer transition-colors group"
                  >
                    <td className="py-2 px-1.5 font-sans font-medium text-slate-800 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 font-bold text-[10px] flex items-center justify-center shrink-0">
                        {member.avatar}
                      </span>
                      <span className="truncate max-w-[85px] group-hover:text-blue-600">
                        {member.name}
                      </span>
                    </td>
                    <td className="py-2 px-1 text-center font-bold text-slate-700">{member.leadsHandled}</td>
                    <td className="py-2 px-1 text-center text-slate-600">{member.qualified}</td>
                    <td className="py-2 px-1 text-center text-emerald-600 font-bold">{member.converted}</td>
                    <td className="py-2 px-1 text-right text-blue-600 font-semibold">{formatPercent(member.conversionPct, 0)}</td>
                    <td className="py-2 px-1.5 text-right font-bold text-slate-900">{formatINR(member.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Top converted</span>
            <span className="font-semibold text-emerald-600">Sneha Choudhary (50%)</span>
          </div>
        </div>

        {/* 2. Operations Team Activity */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Operations Team Activity
            </h3>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-full border border-emerald-200">
              Operations
            </span>
          </div>

          <div className="overflow-x-auto max-h-56 my-2">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-400 sticky top-0">
                <tr>
                  <th className="py-1 px-1.5">Fulfillment Lead</th>
                  <th className="py-1 px-1 text-center">Orders</th>
                  <th className="py-1 px-1 text-center">Done</th>
                  <th className="py-1 px-1 text-center">Pending</th>
                  <th className="py-1 px-1.5 text-right">Overdue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono tabular-nums text-xs">
                {operationsTeamActivity.map(member => (
                  <tr 
                    key={member.id}
                    onClick={() => openDrillDown({
                      type: 'order_list',
                      title: `Operations Queue: ${member.name}`,
                      subtitle: `${member.ordersUpdated} client compliance orders in progress`,
                      records: filteredOrders.filter(o => o.assignedOpsId === member.id)
                    })}
                    className="hover:bg-emerald-50/50 cursor-pointer transition-colors group"
                  >
                    <td className="py-2 px-1.5 font-sans font-medium text-slate-800 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center justify-center shrink-0">
                        {member.avatar}
                      </span>
                      <span className="truncate max-w-[95px] group-hover:text-emerald-700">
                        {member.name}
                      </span>
                    </td>
                    <td className="py-2 px-1 text-center font-bold text-slate-800">{member.ordersUpdated}</td>
                    <td className="py-2 px-1 text-center text-emerald-600 font-bold">{member.stagesCompleted}</td>
                    <td className="py-2 px-1 text-center text-amber-600 font-bold">{member.pendingStages}</td>
                    <td className="py-2 px-1.5 text-right font-bold text-rose-600">
                      {member.overdueOrders > 0 ? (
                        <span className="inline-flex items-center gap-0.5 text-rose-600">
                          <AlertCircle className="w-3 h-3" />
                          {member.overdueOrders}
                        </span>
                      ) : (
                        <span className="text-slate-400">0</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>SLA Health</span>
            <span className="font-semibold text-emerald-600">94.2% On-Time Turnaround</span>
          </div>
        </div>

        {/* 3. Orders & Stage Progress */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Orders & Stage Progress
            </h3>
            <div className="flex items-center gap-1.5 text-[9px]">
              <span className="inline-flex items-center gap-0.5 text-amber-700 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Pend
              </span>
              <span className="inline-flex items-center gap-0.5 text-blue-700 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600" /> Prog
              </span>
              <span className="inline-flex items-center gap-0.5 text-emerald-700 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Comp
              </span>
              <span className="inline-flex items-center gap-0.5 text-rose-700 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Hold
              </span>
            </div>
          </div>

          <div className="py-2 space-y-2.5 overflow-y-auto max-h-56 pr-1">
            {ordersAndStageProgress.slice(0, 5).map(item => (
              <div 
                key={item.serviceId}
                onClick={() => openDrillDown({
                  type: 'order_list',
                  title: `Orders: ${item.serviceName}`,
                  subtitle: `${item.total} active compliance orders (${item.completed} completed)`,
                  records: filteredOrders.filter(o => o.serviceId === item.serviceId)
                })}
                className="group hover:bg-slate-50 p-1.5 rounded-lg transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-medium text-slate-700 truncate group-hover:text-blue-600 max-w-[130px]">
                    {item.serviceName.replace(' Company Registration', '').replace(' Registration', '')}
                  </span>
                  <div className="flex items-center gap-1.5 text-[10px] font-mono tabular-nums">
                    <span className="text-amber-700 font-bold">{item.pending}</span>
                    <span className="text-slate-300">/</span>
                    <span className="text-blue-700 font-bold">{item.inProgress}</span>
                    <span className="text-slate-300">/</span>
                    <span className="text-emerald-700 font-bold">{item.completed}</span>
                    <span className="text-slate-300">/</span>
                    <span className="text-rose-700 font-bold">{item.onHold}</span>
                    <span className="text-slate-400 font-bold ml-1">({item.total})</span>
                  </div>
                </div>

                {/* Stacked Status Bar */}
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden flex shadow-2xs">
                  {item.pending > 0 && (
                    <div 
                      style={{ width: `${(item.pending / item.total) * 100}%` }}
                      className="bg-amber-500 h-full"
                      title={`${item.pending} Pending`}
                    />
                  )}
                  {item.inProgress > 0 && (
                    <div 
                      style={{ width: `${(item.inProgress / item.total) * 100}%` }}
                      className="bg-blue-600 h-full"
                      title={`${item.inProgress} In Progress`}
                    />
                  )}
                  {item.completed > 0 && (
                    <div 
                      style={{ width: `${(item.completed / item.total) * 100}%` }}
                      className="bg-emerald-500 h-full"
                      title={`${item.completed} Completed`}
                    />
                  )}
                  {item.onHold > 0 && (
                    <div 
                      style={{ width: `${(item.onHold / item.total) * 100}%` }}
                      className="bg-rose-500 h-full"
                      title={`${item.onHold} On Hold`}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Fulfillment Pipeline</span>
            <span className="font-semibold text-slate-700">{filteredOrders.length} active orders</span>
          </div>
        </div>

        {/* 4. Recent CRM Activity */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-blue-600" />
              Recent CRM Activity
            </h3>
            <span className="text-[10px] text-slate-400">Live Audit Stream</span>
          </div>

          <div className="overflow-y-auto max-h-56 my-2 space-y-2 pr-1">
            {filteredActivities.slice(0, 7).map(item => {
              // Action badge color
              let badgeColor = 'bg-blue-50 text-blue-700 border-blue-200';
              if (item.action === 'Payment recorded') badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
              if (item.action === 'Deal created') badgeColor = 'bg-purple-50 text-purple-700 border-purple-200';
              if (item.action === 'Order created') badgeColor = 'bg-amber-50 text-amber-700 border-amber-200';

              return (
                <div 
                  key={item.id}
                  className="flex items-center justify-between text-xs py-1 border-b border-slate-50 last:border-none"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px] flex items-center justify-center shrink-0">
                      {item.employeeAvatar}
                    </span>
                    <div className="truncate">
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium text-slate-800 text-[11px] truncate">
                          {item.employeeName}
                        </span>
                        <span className={`text-[9px] font-semibold px-1.5 py-0.2 rounded border ${badgeColor}`}>
                          {item.action}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-mono tabular-nums">
                        {item.timestamp.split('T')[0]} {item.timestamp.split('T')[1].substring(0, 5)}
                      </p>
                    </div>
                  </div>

                  {/* Interactive Record Link Pill */}
                  <button
                    onClick={() => {
                      if (item.recordType === 'lead') inspectLead(item.recordId);
                      else if (item.recordType === 'deal') inspectDeal(item.recordId);
                      else if (item.recordType === 'order') inspectOrder(item.recordId);
                      else if (item.recordType === 'payment') inspectPayment(item.recordId);
                    }}
                    className="shrink-0 text-[11px] font-mono font-bold text-blue-600 hover:text-blue-800 bg-blue-50/80 hover:bg-blue-100 px-2 py-0.5 rounded border border-blue-200/60 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>#{item.recordId}</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </button>
                </div>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Audit log status</span>
            <span className="font-semibold text-emerald-600">All actions logged</span>
          </div>
        </div>

      </div>
    </section>
  );
};
