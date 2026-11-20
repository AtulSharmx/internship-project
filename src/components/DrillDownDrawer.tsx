import React, { useState, useMemo } from 'react';
import { 
  X, 
  ArrowLeft, 
  Search, 
  ExternalLink, 
  Building2, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  FileText, 
  Briefcase, 
  Receipt, 
  ShieldCheck, 
  ChevronRight,
  Download,
  Filter
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import { Lead, Quotation, Deal, Order, Payment } from '../types';
import { formatINR, formatPercent, formatDate, formatDateTime } from '../utils/formatters';

export const DrillDownDrawer: React.FC = () => {
  const { 
    drillDownStack, 
    isDrillDownOpen, 
    popDrillDown, 
    closeDrillDown,
    inspectLead,
    inspectDeal,
    inspectOrder,
    inspectPayment,
    findLeadById,
    findDealById,
    findOrderById,
    findPaymentById,
    filteredLeads,
    filteredQuotations,
    filteredDeals,
    filteredOrders,
    filteredPayments
  } = useDashboard();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const currentItem = drillDownStack[drillDownStack.length - 1];

  // If drawer is closed or stack is empty
  if (!isDrillDownOpen || !currentItem) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300"
        onClick={closeDrillDown}
      />

      <div className="relative w-full max-w-4xl bg-white shadow-2xl h-full flex flex-col z-10 animate-in slide-in-from-right duration-300 border-l border-slate-200">
        
        <div className="px-6 py-4 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            {drillDownStack.length > 1 && (
              <button
                type="button"
                onClick={popDrillDown}
                className="p-1.5 -ml-1 text-slate-500 hover:text-slate-900 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
                title="Go back"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                {drillDownStack.map((step, idx) => (
                  <React.Fragment key={idx}>
                    {idx > 0 && <span>/</span>}
                    <span className={idx === drillDownStack.length - 1 ? 'text-slate-900 font-semibold' : ''}>
                      {step.title.split(':')[0]}
                    </span>
                  </React.Fragment>
                ))}
              </div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight mt-0.5">
                {currentItem.title}
              </h2>
              {currentItem.subtitle && (
                <p className="text-xs text-slate-500 mt-0.5">{currentItem.subtitle}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={closeDrillDown}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          
          {/* 1. SINGLE LEAD DETAIL VIEW */}
          {currentItem.type === 'lead' && currentItem.activeEntityId && (
            <LeadDetailView 
              leadId={currentItem.activeEntityId} 
              onInspectDeal={inspectDeal}
            />
          )}

          {/* 2. SINGLE DEAL DETAIL VIEW */}
          {currentItem.type === 'deal' && currentItem.activeEntityId && (
            <DealDetailView 
              dealId={currentItem.activeEntityId} 
              onInspectLead={inspectLead}
              onInspectOrder={inspectOrder}
              onInspectPayment={inspectPayment}
            />
          )}

          {/* 3. SINGLE ORDER DETAIL VIEW */}
          {currentItem.type === 'order' && currentItem.activeEntityId && (
            <OrderDetailView 
              orderId={currentItem.activeEntityId} 
              onInspectDeal={inspectDeal}
            />
          )}

          {/* 4. LEADS LIST VIEW */}
          {currentItem.type === 'lead_list' && (
            <LeadsListView 
              records={currentItem.records || filteredLeads}
              onInspectLead={inspectLead}
            />
          )}

          {/* 5. QUOTATIONS LIST VIEW */}
          {currentItem.type === 'quotation_list' && (
            <QuotationsListView 
              records={currentItem.records || filteredQuotations}
              onInspectLead={inspectLead}
            />
          )}

          {/* 6. DEALS LIST VIEW */}
          {currentItem.type === 'deal_list' && (
            <DealsListView 
              records={currentItem.records || filteredDeals}
              onInspectDeal={inspectDeal}
            />
          )}

          {/* 7. ORDERS LIST VIEW */}
          {currentItem.type === 'order_list' && (
            <OrdersListView 
              records={currentItem.records || filteredOrders}
              onInspectOrder={inspectOrder}
            />
          )}

          {/* 8. PAYMENTS LIST VIEW */}
          {currentItem.type === 'payment_list' && (
            <PaymentsListView 
              records={currentItem.records || filteredPayments}
              onInspectDeal={inspectDeal}
            />
          )}

        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// SINGLE LEAD INSPECTOR
// -------------------------------------------------------------
const LeadDetailView: React.FC<{ leadId: string; onInspectDeal: (dealId: string) => void }> = ({ leadId, onInspectDeal }) => {
  const { findLeadById, filteredQuotations, filteredDeals } = useDashboard();
  const lead = findLeadById(leadId);

  if (!lead) return <div className="text-sm text-slate-500">Lead not found.</div>;

  // Find related quotations and deals
  const relatedQuotes = filteredQuotations.filter(q => q.leadId === lead.id);
  const relatedDeals = filteredDeals.filter(d => d.leadId === lead.id);

  return (
    <div className="space-y-6">
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                #{lead.leadNumber}
              </span>
              <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                lead.status === 'converted' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                lead.status === 'qualified' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                lead.status === 'new' ? 'bg-slate-100 text-slate-700 border-slate-200' :
                'bg-rose-50 text-rose-700 border-rose-200'
              }`}>
                {lead.status}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mt-1">{lead.name}</h3>
            <p className="text-xs text-slate-600 flex items-center gap-1 font-medium">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              {lead.companyName}
            </p>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-slate-500 block">Estimated Budget</span>
            <span className="text-lg font-bold text-slate-900 font-mono tabular-nums">
              {formatINR(lead.estimatedBudget)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Email</span>
            <span className="font-medium text-slate-700 truncate block">{lead.email}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Phone</span>
            <span className="font-medium text-slate-700">{lead.phone}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Location</span>
            <span className="font-medium text-slate-700">{lead.city}, {lead.state}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Acquisition Source</span>
            <span className="font-semibold text-blue-600">{lead.source}</span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-200/80 text-xs text-slate-600">
          <p><strong>Primary Interest:</strong> {lead.serviceInterest}</p>
          <p className="mt-1 text-slate-500"><strong>Notes:</strong> {lead.notes}</p>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-blue-600" />
            Linked Quotations ({relatedQuotes.length})
          </h4>
        </div>

        {relatedQuotes.length === 0 ? (
          <div className="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-lg text-xs text-slate-500 text-center">
            No quotations issued yet for this prospect.
          </div>
        ) : (
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[10px] font-bold uppercase text-slate-500">
                <tr>
                  <th className="py-2 px-3">Quote #</th>
                  <th className="py-2 px-3">Service</th>
                  <th className="py-2 px-3 text-right">Amount</th>
                  <th className="py-2 px-3 text-center">Status</th>
                  <th className="py-2 px-3">Valid Until</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono tabular-nums">
                {relatedQuotes.map(q => (
                  <tr key={q.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-bold text-blue-600 font-mono">#{q.quotationNumber}</td>
                    <td className="py-2.5 px-3 font-sans text-slate-800">{q.serviceName}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-900">{formatINR(q.totalAmount)}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        q.status === 'accepted' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        q.status === 'rejected' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                        'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {q.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-500">{q.validUntil}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
            Linked Deals ({relatedDeals.length})
          </h4>
        </div>

        {relatedDeals.length === 0 ? (
          <div className="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-lg text-xs text-slate-500 text-center">
            No deals finalized for this lead yet.
          </div>
        ) : (
          <div className="space-y-2">
            {relatedDeals.map(d => (
              <div 
                key={d.id}
                onClick={() => onInspectDeal(d.id)}
                className="bg-white border border-slate-200 hover:border-blue-400 rounded-xl p-3.5 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      #{d.dealNumber}
                    </span>
                    <span className="text-xs font-bold text-slate-800">{d.title}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Stage: <strong className="text-slate-700 uppercase">{d.stage}</strong> • Priority: {d.priority}</p>
                </div>

                <div className="text-right">
                  <span className="block text-sm font-bold text-slate-900 font-mono tabular-nums">{formatINR(d.totalAmount)}</span>
                  <span className="text-[11px] text-emerald-600 font-medium">Collected: {formatINR(d.collectedAmount)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// SINGLE DEAL INSPECTOR
// -------------------------------------------------------------
const DealDetailView: React.FC<{ 
  dealId: string; 
  onInspectLead: (id: string) => void;
  onInspectOrder: (id: string) => void;
  onInspectPayment: (id: string) => void;
}> = ({ dealId, onInspectLead, onInspectOrder, onInspectPayment }) => {
  const { findDealById, filteredOrders, filteredPayments } = useDashboard();
  const deal = findDealById(dealId);

  if (!deal) return <div className="text-sm text-slate-500">Deal not found.</div>;

  const linkedOrders = filteredOrders.filter(o => o.dealId === deal.id);
  const linkedPayments = filteredPayments.filter(p => p.dealId === deal.id);

  return (
    <div className="space-y-6">
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                #{deal.dealNumber}
              </span>
              <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                deal.priority === 'high' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                deal.priority === 'medium' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                'bg-slate-100 text-slate-700 border-slate-200'
              }`}>
                {deal.priority} Priority
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mt-1">{deal.title}</h3>
            <button
              onClick={() => onInspectLead(deal.leadId)}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 mt-0.5 cursor-pointer"
            >
              <span>Client: {deal.leadName} ({deal.companyName})</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-slate-500 block">Total Deal Value</span>
            <span className="text-2xl font-black text-slate-900 font-mono tabular-nums">
              {formatINR(deal.totalAmount)}
            </span>
          </div>
        </div>

        <div className="pt-4">
          <div className="flex items-center justify-between text-xs font-medium mb-1.5">
            <span className="text-slate-600">Collection Progress</span>
            <span className="font-bold text-emerald-700 font-mono tabular-nums">
              {formatPercent((deal.collectedAmount / deal.totalAmount) * 100, 1)} Collected
            </span>
          </div>
          <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden flex">
            <div 
              style={{ width: `${(deal.collectedAmount / deal.totalAmount) * 100}%` }}
              className="bg-emerald-500 h-full"
            />
          </div>
          <div className="flex items-center justify-between text-xs mt-2 font-mono tabular-nums">
            <span className="text-emerald-700 font-semibold">Collected: {formatINR(deal.collectedAmount)}</span>
            <span className="text-amber-700 font-semibold">Outstanding: {formatINR(deal.outstandingAmount)}</span>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            Fulfillment Orders ({linkedOrders.length})
          </h4>
        </div>

        {linkedOrders.length === 0 ? (
          <div className="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-lg text-xs text-slate-500 text-center">
            No fulfillment orders initiated.
          </div>
        ) : (
          <div className="space-y-2">
            {linkedOrders.map(order => (
              <div 
                key={order.id}
                onClick={() => onInspectOrder(order.id)}
                className="bg-white border border-slate-200 hover:border-blue-400 rounded-xl p-3.5 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      #{order.orderNumber}
                    </span>
                    <span className="text-xs font-bold text-slate-800">{order.serviceName}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Current Step: <strong className="text-blue-700">{order.currentStage}</strong> ({order.stagesCompleted}/{order.totalStages})
                  </p>
                </div>

                <div className="text-right">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    order.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    order.status === 'in_progress' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                    order.status === 'on_hold' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                    'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {order.status.replace('_', ' ')}
                  </span>
                  <span className="block text-[11px] text-slate-400 mt-1 font-mono">Due: {formatDate(order.dueDate)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Receipt className="w-3.5 h-3.5 text-emerald-600" />
            Payment Receipts & Ledger ({linkedPayments.length})
          </h4>
        </div>

        {linkedPayments.length === 0 ? (
          <div className="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-lg text-xs text-slate-500 text-center">
            No payments recorded yet for this deal.
          </div>
        ) : (
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[10px] font-bold uppercase text-slate-500">
                <tr>
                  <th className="py-2 px-3">Receipt #</th>
                  <th className="py-2 px-3">Date</th>
                  <th className="py-2 px-3">Method</th>
                  <th className="py-2 px-3">Txn Ref</th>
                  <th className="py-2 px-3 text-right">Amount</th>
                  <th className="py-2 px-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono tabular-nums">
                {linkedPayments.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-bold text-emerald-700">#{p.paymentNumber}</td>
                    <td className="py-2.5 px-3 text-slate-600">{formatDate(p.date)}</td>
                    <td className="py-2.5 px-3 font-sans font-medium text-slate-700">{p.method}</td>
                    <td className="py-2.5 px-3 text-slate-500 text-[11px]">{p.transactionRef}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-900">{formatINR(p.amount)}</td>
                    <td className="py-2.5 px-3 text-center">
                      <button
                        onClick={() => onInspectPayment(p.id)}
                        className="text-blue-600 hover:text-blue-800 text-[11px] font-sans font-semibold cursor-pointer underline"
                      >
                        Receipt
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// SINGLE ORDER INSPECTOR
// -------------------------------------------------------------
const OrderDetailView: React.FC<{ orderId: string; onInspectDeal: (id: string) => void }> = ({ orderId, onInspectDeal }) => {
  const { findOrderById } = useDashboard();
  const order = findOrderById(orderId);

  if (!order) return <div className="text-sm text-slate-500">Order not found.</div>;

  return (
    <div className="space-y-6">
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                #{order.orderNumber}
              </span>
              <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                order.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                order.status === 'in_progress' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                'bg-amber-50 text-amber-700 border-amber-200'
              }`}>
                {order.status.replace('_', ' ')}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mt-1">{order.serviceName}</h3>
            <p className="text-xs text-slate-600 font-medium">Client: {order.clientName} ({order.companyName})</p>
          </div>

          <button
            onClick={() => onInspectDeal(order.dealId)}
            className="px-3 py-1.5 bg-white border border-slate-200 hover:border-blue-400 rounded-lg text-xs font-semibold text-blue-600 shadow-2xs transition-colors cursor-pointer self-start sm:self-auto"
          >
            View Parent Deal #{order.dealNumber}
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 text-xs font-mono tabular-nums">
          <div>
            <span className="text-slate-400 block text-[11px] font-sans">Start Date</span>
            <span className="font-semibold text-slate-700">{formatDate(order.startDate)}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px] font-sans">SLA Due Date</span>
            <span className="font-semibold text-slate-700">{formatDate(order.dueDate)}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px] font-sans">Progress</span>
            <span className="font-semibold text-blue-600">{order.stagesCompleted} of {order.totalStages} stages</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px] font-sans">Overdue Status</span>
            <span className={order.isOverdue ? 'font-bold text-rose-600' : 'font-semibold text-emerald-600'}>
              {order.isOverdue ? 'Delayed - Action Req' : 'On Track'}
            </span>
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
          Compliance Fulfillment Milestones
        </h4>
        <div className="space-y-2">
          {Array.from({ length: order.totalStages }).map((_, idx) => {
            const isDone = idx < order.stagesCompleted;
            const isCurrent = idx === order.stagesCompleted && order.status !== 'completed';

            return (
              <div 
                key={idx}
                className={`flex items-center gap-3 p-3 rounded-xl border text-xs ${
                  isDone ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900' :
                  isCurrent ? 'bg-blue-50/70 border-blue-300 text-blue-900 shadow-2xs' :
                  'bg-white border-slate-200 text-slate-400'
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-bold ${
                  isDone ? 'bg-emerald-600 text-white' :
                  isCurrent ? 'bg-blue-600 text-white animate-pulse' :
                  'bg-slate-200 text-slate-500'
                }`}>
                  {isDone ? '✓' : idx + 1}
                </div>
                <div className="flex-1">
                  <span className="font-semibold block">Stage {idx + 1}: MCA / Department Review</span>
                  <span className="text-[11px] opacity-80">
                    {isDone ? 'Completed & verified on statutory portal' : isCurrent ? 'Active step currently being processed by operations' : 'Pending previous milestone'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// LIST VIEWS (LEADS, QUOTATIONS, DEALS, ORDERS, PAYMENTS)
// -------------------------------------------------------------
const LeadsListView: React.FC<{ records: Lead[]; onInspectLead: (id: string) => void }> = ({ records, onInspectLead }) => {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    return records.filter(l => 
      l.name.toLowerCase().includes(query.toLowerCase()) ||
      l.companyName.toLowerCase().includes(query.toLowerCase()) ||
      l.leadNumber.toLowerCase().includes(query.toLowerCase()) ||
      l.serviceInterest.toLowerCase().includes(query.toLowerCase())
    );
  }, [records, query]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        <input
          type="text"
          placeholder="Search leads by name, company, or service..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full text-xs pl-9 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="border border-slate-200 rounded-lg overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-[10px] font-bold uppercase text-slate-500 border-b border-slate-200">
            <tr>
              <th className="py-2.5 px-3">Lead #</th>
              <th className="py-2.5 px-3">Founder / Company</th>
              <th className="py-2.5 px-3">Service Interest</th>
              <th className="py-2.5 px-3">Source</th>
              <th className="py-2.5 px-3 text-center">Status</th>
              <th className="py-2.5 px-3 text-right">Budget</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-mono tabular-nums">
            {filtered.slice(0, 50).map(lead => (
              <tr 
                key={lead.id}
                onClick={() => onInspectLead(lead.id)}
                className="hover:bg-blue-50/50 cursor-pointer transition-colors group"
              >
                <td className="py-2.5 px-3 font-bold text-blue-600">#{lead.leadNumber}</td>
                <td className="py-2.5 px-3 font-sans">
                  <div className="font-semibold text-slate-800 group-hover:text-blue-600">{lead.name}</div>
                  <div className="text-[11px] text-slate-400">{lead.companyName}</div>
                </td>
                <td className="py-2.5 px-3 font-sans text-slate-700 truncate max-w-[150px]">{lead.serviceInterest}</td>
                <td className="py-2.5 px-3 font-sans text-slate-600">{lead.source}</td>
                <td className="py-2.5 px-3 text-center">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    lead.status === 'converted' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    lead.status === 'qualified' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                    lead.status === 'new' ? 'bg-slate-100 text-slate-700 border border-slate-200' :
                    'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}>
                    {lead.status}
                  </span>
                </td>
                <td className="py-2.5 px-3 text-right font-bold text-slate-900">{formatINR(lead.estimatedBudget)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[11px] text-slate-400 text-center">Showing {Math.min(50, filtered.length)} of {filtered.length} leads</p>
    </div>
  );
};

const QuotationsListView: React.FC<{ records: Quotation[]; onInspectLead: (id: string) => void }> = ({ records, onInspectLead }) => {
  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-50 text-[10px] font-bold uppercase text-slate-500 border-b border-slate-200">
          <tr>
            <th className="py-2.5 px-3">Quote #</th>
            <th className="py-2.5 px-3">Client</th>
            <th className="py-2.5 px-3">Service</th>
            <th className="py-2.5 px-3 text-right">Quoted Amount</th>
            <th className="py-2.5 px-3 text-center">Status</th>
            <th className="py-2.5 px-3">Valid Until</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 font-mono tabular-nums">
          {records.slice(0, 50).map(q => (
            <tr key={q.id} onClick={() => onInspectLead(q.leadId)} className="hover:bg-blue-50/50 cursor-pointer">
              <td className="py-2.5 px-3 font-bold text-blue-600 font-mono">#{q.quotationNumber}</td>
              <td className="py-2.5 px-3 font-sans">
                <span className="font-semibold text-slate-800">{q.leadName}</span>
                <span className="block text-[11px] text-slate-400">{q.companyName}</span>
              </td>
              <td className="py-2.5 px-3 font-sans text-slate-700">{q.serviceName}</td>
              <td className="py-2.5 px-3 text-right font-bold text-slate-900">{formatINR(q.totalAmount)}</td>
              <td className="py-2.5 px-3 text-center">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  q.status === 'accepted' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                  q.status === 'rejected' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                  'bg-amber-50 text-amber-700 border border-amber-200'
                }`}>
                  {q.status}
                </span>
              </td>
              <td className="py-2.5 px-3 text-slate-500">{q.validUntil}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const DealsListView: React.FC<{ records: Deal[]; onInspectDeal: (id: string) => void }> = ({ records, onInspectDeal }) => {
  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-50 text-[10px] font-bold uppercase text-slate-500 border-b border-slate-200">
          <tr>
            <th className="py-2.5 px-3">Deal #</th>
            <th className="py-2.5 px-3">Title / Company</th>
            <th className="py-2.5 px-3 text-right">Value (INR)</th>
            <th className="py-2.5 px-3 text-right">Collected</th>
            <th className="py-2.5 px-3 text-center">Priority</th>
            <th className="py-2.5 px-3 text-center">Stage</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 font-mono tabular-nums">
          {records.slice(0, 50).map(d => (
            <tr key={d.id} onClick={() => onInspectDeal(d.id)} className="hover:bg-blue-50/50 cursor-pointer">
              <td className="py-2.5 px-3 font-bold text-emerald-700">#{d.dealNumber}</td>
              <td className="py-2.5 px-3 font-sans">
                <span className="font-semibold text-slate-800">{d.title}</span>
                <span className="block text-[11px] text-slate-400">{d.companyName}</span>
              </td>
              <td className="py-2.5 px-3 text-right font-bold text-slate-900">{formatINR(d.totalAmount)}</td>
              <td className="py-2.5 px-3 text-right font-bold text-emerald-600">{formatINR(d.collectedAmount)}</td>
              <td className="py-2.5 px-3 text-center">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  d.priority === 'high' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                  d.priority === 'medium' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                  'bg-slate-100 text-slate-600'
                }`}>
                  {d.priority}
                </span>
              </td>
              <td className="py-2.5 px-3 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-700">{d.stage}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const OrdersListView: React.FC<{ records: Order[]; onInspectOrder: (id: string) => void }> = ({ records, onInspectOrder }) => {
  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-50 text-[10px] font-bold uppercase text-slate-500 border-b border-slate-200">
          <tr>
            <th className="py-2.5 px-3">Order #</th>
            <th className="py-2.5 px-3">Service & Client</th>
            <th className="py-2.5 px-3">Current Milestone</th>
            <th className="py-2.5 px-3 text-center">Status</th>
            <th className="py-2.5 px-3">Due Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 font-mono tabular-nums">
          {records.slice(0, 50).map(o => (
            <tr key={o.id} onClick={() => onInspectOrder(o.id)} className="hover:bg-blue-50/50 cursor-pointer">
              <td className="py-2.5 px-3 font-bold text-blue-700">#{o.orderNumber}</td>
              <td className="py-2.5 px-3 font-sans">
                <span className="font-semibold text-slate-800">{o.serviceName}</span>
                <span className="block text-[11px] text-slate-400">{o.companyName}</span>
              </td>
              <td className="py-2.5 px-3 font-sans text-slate-700">{o.currentStage}</td>
              <td className="py-2.5 px-3 text-center">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  o.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                  o.status === 'in_progress' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                  'bg-amber-50 text-amber-700 border border-amber-200'
                }`}>
                  {o.status.replace('_', ' ')}
                </span>
              </td>
              <td className="py-2.5 px-3 text-slate-500">{formatDate(o.dueDate)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const PaymentsListView: React.FC<{ records: Payment[]; onInspectDeal: (id: string) => void }> = ({ records, onInspectDeal }) => {
  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-50 text-[10px] font-bold uppercase text-slate-500 border-b border-slate-200">
          <tr>
            <th className="py-2.5 px-3">Receipt #</th>
            <th className="py-2.5 px-3">Date</th>
            <th className="py-2.5 px-3">Client</th>
            <th className="py-2.5 px-3">Method</th>
            <th className="py-2.5 px-3 text-right">Amount (INR)</th>
            <th className="py-2.5 px-3 text-center">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 font-mono tabular-nums">
          {records.slice(0, 50).map(p => (
            <tr key={p.id} className="hover:bg-slate-50">
              <td className="py-2.5 px-3 font-bold text-emerald-700">#{p.paymentNumber}</td>
              <td className="py-2.5 px-3 text-slate-600">{formatDate(p.date)}</td>
              <td className="py-2.5 px-3 font-sans">
                <span className="font-semibold text-slate-800">{p.clientName}</span>
                <span className="block text-[11px] text-slate-400">{p.companyName}</span>
              </td>
              <td className="py-2.5 px-3 font-sans font-medium text-slate-700">{p.method}</td>
              <td className="py-2.5 px-3 text-right font-bold text-slate-900">{formatINR(p.amount)}</td>
              <td className="py-2.5 px-3 text-center">
                <button
                  onClick={() => onInspectDeal(p.dealId)}
                  className="text-blue-600 hover:text-blue-800 text-[11px] font-sans font-semibold cursor-pointer underline"
                >
                  View Deal
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
