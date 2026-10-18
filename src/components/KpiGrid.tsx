import React from 'react';
import { 
  UserPlus, 
  CheckCircle2, 
  Target, 
  XCircle, 
  Filter, 
  FileText, 
  Briefcase, 
  Receipt
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import { KpiCard } from './KpiCard';
import { formatPercent } from '../utils/formatters';

export const KpiGrid: React.FC = () => {
  const { 
    kpis, 
    comparisonLabel, 
    openDrillDown, 
    filteredLeads, 
    filteredQuotations, 
    filteredDeals, 
    filteredPayments 
  } = useDashboard();

  return (
    <section aria-label="Key Performance Indicators" className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-3">
      
      {/* 1. New / Total Leads */}
      <KpiCard
        title="New Leads"
        value={kpis.totalLeads}
        delta={kpis.leadsDelta}
        comparisonLabel={comparisonLabel}
        icon={<UserPlus className="w-4 h-4 text-blue-600" />}
        iconBgColor="bg-blue-50 text-blue-600"
        onClick={() => openDrillDown({
          type: 'lead_list',
          title: 'Total Inbound Leads',
          subtitle: `${kpis.totalLeads} leads recorded in selected period`,
          records: filteredLeads
        })}
      />

      {/* 2. Qualified Leads */}
      <KpiCard
        title="Qualified Leads"
        value={kpis.qualifiedLeads}
        subValue={formatPercent(kpis.qualifiedPct)}
        subLabel="Qualified %"
        delta={kpis.qualifiedDelta}
        comparisonLabel={comparisonLabel}
        icon={<CheckCircle2 className="w-4 h-4 text-emerald-600" />}
        iconBgColor="bg-emerald-50 text-emerald-600"
        onClick={() => openDrillDown({
          type: 'lead_list',
          title: 'Qualified Leads',
          subtitle: `${kpis.qualifiedLeads} leads with verified budget & compliance requirements`,
          records: filteredLeads.filter(l => l.status === 'qualified' || l.status === 'converted')
        })}
      />

      {/* 3. Converted Leads */}
      <KpiCard
        title="Converted Leads"
        value={kpis.convertedLeads}
        subValue={formatPercent(kpis.conversionPct)}
        subLabel="Conversion %"
        delta={kpis.convertedDelta}
        comparisonLabel={comparisonLabel}
        icon={<Target className="w-4 h-4 text-purple-600" />}
        iconBgColor="bg-purple-50 text-purple-600"
        onClick={() => openDrillDown({
          type: 'lead_list',
          title: 'Converted Leads (Clients)',
          subtitle: `${kpis.convertedLeads} leads who successfully purchased services`,
          records: filteredLeads.filter(l => l.status === 'converted')
        })}
      />

      {/* 4. Unqualified Leads */}
      <KpiCard
        title="Unqualified Leads"
        value={kpis.unqualifiedLeads}
        subValue={formatPercent(kpis.unqualifiedPct)}
        subLabel="Unqualified %"
        delta={kpis.unqualifiedDelta}
        comparisonLabel={comparisonLabel}
        icon={<XCircle className="w-4 h-4 text-rose-600" />}
        iconBgColor="bg-rose-50 text-rose-600"
        onClick={() => openDrillDown({
          type: 'lead_list',
          title: 'Unqualified Leads',
          subtitle: `${kpis.unqualifiedLeads} leads disqualified due to budget/wrong number/no response`,
          records: filteredLeads.filter(l => l.status === 'unqualified')
        })}
      />

      {/* 5. Conversion Rate */}
      <KpiCard
        title="Conversion Rate"
        value={formatPercent(kpis.conversionRate)}
        delta={kpis.conversionRateDelta}
        comparisonLabel={comparisonLabel}
        icon={<Filter className="w-4 h-4 text-cyan-600" />}
        iconBgColor="bg-cyan-50 text-cyan-600"
        onClick={() => openDrillDown({
          type: 'lead_list',
          title: 'Lead Conversion Performance',
          subtitle: `${kpis.convertedLeads} converted out of ${kpis.totalLeads} total leads (${formatPercent(kpis.conversionRate)})`,
          records: filteredLeads
        })}
      />

      {/* 6. Quotations Created */}
      <KpiCard
        title="Quotations Created"
        value={kpis.quotationsCreated}
        delta={kpis.quotationsDelta}
        comparisonLabel={comparisonLabel}
        icon={<FileText className="w-4 h-4 text-amber-600" />}
        iconBgColor="bg-amber-50 text-amber-600"
        onClick={() => openDrillDown({
          type: 'quotation_list',
          title: 'All Quotations Issued',
          subtitle: `${kpis.quotationsCreated} proposals generated for prospects`,
          records: filteredQuotations
        })}
      />

      {/* 7. Deals Created */}
      <KpiCard
        title="Deals Created"
        value={kpis.dealsCreated}
        delta={kpis.dealsDelta}
        comparisonLabel={comparisonLabel}
        icon={<Briefcase className="w-4 h-4 text-indigo-600" />}
        iconBgColor="bg-indigo-50 text-indigo-600"
        onClick={() => openDrillDown({
          type: 'deal_list',
          title: 'Deals Closed / Created',
          subtitle: `${kpis.dealsCreated} deals closed across compliance categories`,
          records: filteredDeals
        })}
      />

      {/* 8. Invoices Generated */}
      <KpiCard
        title="Invoices Generated"
        value={kpis.invoicesGenerated}
        delta={kpis.invoicesDelta}
        comparisonLabel={comparisonLabel}
        icon={<Receipt className="w-4 h-4 text-emerald-600" />}
        iconBgColor="bg-emerald-50 text-emerald-600"
        onClick={() => openDrillDown({
          type: 'payment_list',
          title: 'Invoices & Receipts Generated',
          subtitle: `${kpis.invoicesGenerated} collection transactions recorded`,
          records: filteredPayments
        })}
      />
    </section>
  );
};
