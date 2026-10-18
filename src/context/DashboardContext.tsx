import React, { createContext, useContext, useState, useMemo } from 'react';
import { 
  Lead, 
  Quotation, 
  Deal, 
  Order, 
  Payment, 
  TeamMember, 
  CRMActivity, 
  DatePreset,
  DrillDownType
} from '../types';
import { initialMockDataset } from '../data/mockData';
import { COMPLIANCE_SERVICES } from '../data/services';

export interface DrillDownStackItem {
  type: DrillDownType;
  title: string;
  subtitle?: string;
  activeEntityId?: string;
  entityType?: 'lead' | 'deal' | 'order' | 'payment';
  records?: any[];
}

interface DashboardContextType {
  // Filters
  preset: DatePreset | 'october_2026';
  setPreset: (preset: DatePreset | 'october_2026') => void;
  startDate: string;
  endDate: string;
  setDateRange: (start: string, end: string) => void;
  selectedUserId: string;
  setSelectedUserId: (userId: string) => void;
  selectedDepartment: string;
  setSelectedDepartment: (dept: string) => void;
  comparisonLabel: string;

  // Filtered raw data
  filteredLeads: Lead[];
  filteredQuotations: Quotation[];
  filteredDeals: Deal[];
  filteredOrders: Order[];
  filteredPayments: Payment[];
  filteredActivities: CRMActivity[];
  teamMembers: TeamMember[];

  // Computed Top KPIs
  kpis: {
    totalLeads: number;
    leadsDelta: number;
    qualifiedLeads: number;
    qualifiedPct: number;
    qualifiedDelta: number;
    convertedLeads: number;
    conversionPct: number;
    convertedDelta: number;
    unqualifiedLeads: number;
    unqualifiedPct: number;
    unqualifiedDelta: number;
    conversionRate: number;
    conversionRateDelta: number;
    quotationsCreated: number;
    quotationsDelta: number;
    dealsCreated: number;
    dealsDelta: number;
    invoicesGenerated: number;
    invoicesDelta: number;
  };

  // Target achievement
  targetAchievement: {
    target: number;
    achieved: number;
    remaining: number;
    achievedPct: number;
  };

  // Lead Funnel
  leadFunnel: {
    total: number;
    qualified: number;
    qualifiedPct: number;
    converted: number;
    convertedPct: number;
    unqualified: number;
    unqualifiedPct: number;
  };

  // Lead Trends & Sources
  dailyLeadTrend: Array<{ date: string; displayDate: string; newLeads: number; qualified: number; converted: number }>;
  leadSources: Array<{ name: string; count: number; percentage: number; color: string }>;

  // Quotation Analytics
  quotationsByService: Array<{ name: string; count: number; serviceId: string }>;
  quotationValueByService: Array<{ name: string; value: number; percentage: number; serviceId: string }>;
  serviceWiseQuotationDetails: Array<{
    serviceId: string;
    serviceName: string;
    quotationsCount: number;
    quotedAmount: number;
    accepted: number;
    pending: number;
    rejected: number;
    convRate: number;
  }>;
  quoteToDealConvRate: {
    rate: number;
    dealsCount: number;
    quotesCount: number;
  };

  // Deals & Revenue
  dealsVsRevenueByService: Array<{
    serviceName: string;
    dealsCreated: number;
    dealRevenue: number;
  }>;
  revenueByCategory: Array<{
    category: string;
    revenue: number;
    percentage: number;
  }>;
  priorityBreakdown: {
    high: { count: number; revenue: number; percentage: number };
    medium: { count: number; revenue: number; percentage: number };
    low: { count: number; revenue: number; percentage: number };
  };
  dailyRevenueTrend: Array<{
    date: string;
    displayDate: string;
    revenue: number;
    collected: number;
  }>;
  totalVsCollectedRevenue: {
    totalDealValue: number;
    netCollectedRevenue: number;
    outstandingRevenue: number;
  };

  // Team & Operations
  salesTeamActivity: Array<{
    id: string;
    name: string;
    avatar: string;
    leadsHandled: number;
    qualified: number;
    converted: number;
    conversionPct: number;
    quotations: number;
    deals: number;
    dealValue: number;
    revenue: number;
  }>;
  operationsTeamActivity: Array<{
    id: string;
    name: string;
    avatar: string;
    ordersUpdated: number;
    stagesCompleted: number;
    pendingStages: number;
    overdueOrders: number;
  }>;
  ordersAndStageProgress: Array<{
    serviceName: string;
    serviceId: string;
    pending: number;
    inProgress: number;
    completed: number;
    onHold: number;
    total: number;
  }>;

  // Drill-down navigation stack
  drillDownStack: DrillDownStackItem[];
  isDrillDownOpen: boolean;
  openDrillDown: (item: DrillDownStackItem) => void;
  pushDrillDown: (item: DrillDownStackItem) => void;
  popDrillDown: () => void;
  closeDrillDown: () => void;
  inspectLead: (leadId: string) => void;
  inspectDeal: (dealId: string) => void;
  inspectOrder: (orderId: string) => void;
  inspectPayment: (paymentId: string) => void;
  findLeadById: (leadId: string) => Lead | undefined;
  findDealById: (dealId: string) => Deal | undefined;
  findOrderById: (orderId: string) => Order | undefined;
  findPaymentById: (paymentId: string) => Payment | undefined;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to October 2026 matching assignment.png
  const [preset, setPreset] = useState<DatePreset | 'october_2026'>('october_2026');
  const [startDate, setStartDate] = useState<string>('2026-10-01');
  const [endDate, setEndDate] = useState<string>('2026-10-31');
  const [selectedUserId, setSelectedUserId] = useState<string>('all');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');

  // Drill-down history stack
  const [drillDownStack, setDrillDownStack] = useState<DrillDownStackItem[]>([]);

  // Raw dataset
  const dataset = useMemo(() => initialMockDataset, []);

  // Update date ranges when preset changes
  const applyPreset = (newPreset: DatePreset | 'october_2026') => {
    setPreset(newPreset);
    if (newPreset === 'october_2026') {
      setStartDate('2026-10-01');
      setEndDate('2026-10-31');
    } else if (newPreset === 'today') {
      // Simulate today as Oct 31, 2026 (end of active business period)
      setStartDate('2026-10-31');
      setEndDate('2026-10-31');
    } else if (newPreset === 'last_7_days') {
      setStartDate('2026-10-25');
      setEndDate('2026-10-31');
    } else if (newPreset === 'last_30_days') {
      setStartDate('2026-10-02');
      setEndDate('2026-10-31');
    }
  };

  const setCustomDateRange = (start: string, end: string) => {
    setPreset('custom');
    setStartDate(start);
    setEndDate(end);
  };

  // Compute current period timestamp range & preceding comparison range
  const { currentRange, prevRange, comparisonLabel } = useMemo(() => {
    const start = new Date(startDate + 'T00:00:00');
    const end = new Date(endDate + 'T23:59:59');
    const durationMs = end.getTime() - start.getTime();
    const durationDays = Math.max(1, Math.round(durationMs / 86400000));

    // Preceding equivalent period
    const prevEnd = new Date(start.getTime() - 1000); // 1 millisecond before start
    const prevStart = new Date(prevEnd.getTime() - durationMs);

    const compLabel = durationDays === 1 
      ? 'vs. yesterday' 
      : `vs. previous ${durationDays} days`;

    return {
      currentRange: { start, end },
      prevRange: { start: prevStart, end: prevEnd },
      comparisonLabel: compLabel
    };
  }, [startDate, endDate]);

  // Helper date-checker
  const isInRange = (dateStr: string, range: { start: Date; end: Date }) => {
    const d = new Date(dateStr);
    return d >= range.start && d <= range.end;
  };

  // Filter raw data for current period
  const filteredLeads = useMemo(() => {
    return dataset.leads.filter(lead => {
      const dateMatch = isInRange(lead.createdAt, currentRange);
      const userMatch = selectedUserId === 'all' || lead.assignedSalesId === selectedUserId;
      return dateMatch && userMatch;
    });
  }, [dataset.leads, currentRange, selectedUserId]);

  const prevLeads = useMemo(() => {
    return dataset.leads.filter(lead => {
      const dateMatch = isInRange(lead.createdAt, prevRange);
      const userMatch = selectedUserId === 'all' || lead.assignedSalesId === selectedUserId;
      return dateMatch && userMatch;
    });
  }, [dataset.leads, prevRange, selectedUserId]);

  const filteredQuotations = useMemo(() => {
    return dataset.quotations.filter(q => {
      const dateMatch = isInRange(q.createdAt, currentRange);
      const userMatch = selectedUserId === 'all' || q.assignedSalesId === selectedUserId;
      return dateMatch && userMatch;
    });
  }, [dataset.quotations, currentRange, selectedUserId]);

  const prevQuotations = useMemo(() => {
    return dataset.quotations.filter(q => {
      const dateMatch = isInRange(q.createdAt, prevRange);
      const userMatch = selectedUserId === 'all' || q.assignedSalesId === selectedUserId;
      return dateMatch && userMatch;
    });
  }, [dataset.quotations, prevRange, selectedUserId]);

  const filteredDeals = useMemo(() => {
    return dataset.deals.filter(d => {
      const dateMatch = isInRange(d.createdAt, currentRange);
      const userMatch = selectedUserId === 'all' || d.assignedSalesId === selectedUserId;
      return dateMatch && userMatch;
    });
  }, [dataset.deals, currentRange, selectedUserId]);

  const prevDeals = useMemo(() => {
    return dataset.deals.filter(d => {
      const dateMatch = isInRange(d.createdAt, prevRange);
      const userMatch = selectedUserId === 'all' || d.assignedSalesId === selectedUserId;
      return dateMatch && userMatch;
    });
  }, [dataset.deals, prevRange, selectedUserId]);

  const filteredOrders = useMemo(() => {
    return dataset.orders.filter(o => {
      const dateMatch = isInRange(o.startDate, currentRange);
      const userMatch = selectedUserId === 'all' || o.assignedOpsId === selectedUserId;
      return dateMatch && userMatch;
    });
  }, [dataset.orders, currentRange, selectedUserId]);

  const filteredPayments = useMemo(() => {
    return dataset.payments.filter(p => {
      return isInRange(p.date, currentRange);
    });
  }, [dataset.payments, currentRange]);

  const prevPayments = useMemo(() => {
    return dataset.payments.filter(p => {
      return isInRange(p.date, prevRange);
    });
  }, [dataset.payments, prevRange]);

  const filteredActivities = useMemo(() => {
    return dataset.activities.filter(a => {
      const dateMatch = isInRange(a.timestamp, currentRange);
      const userMatch = selectedUserId === 'all' || a.employeeId === selectedUserId;
      return dateMatch && userMatch;
    });
  }, [dataset.activities, currentRange, selectedUserId]);

  // Delta calculation helper
  const calculateDelta = (current: number, previous: number): number => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  // Top KPI calculations
  const kpis = useMemo(() => {
    const totalLeads = filteredLeads.length;
    const prevTotalLeads = prevLeads.length;
    const leadsDelta = calculateDelta(totalLeads, prevTotalLeads);

    const qualifiedLeads = filteredLeads.filter(l => l.status === 'qualified' || l.status === 'converted').length;
    const prevQualifiedLeads = prevLeads.filter(l => l.status === 'qualified' || l.status === 'converted').length;
    const qualifiedPct = totalLeads > 0 ? (qualifiedLeads / totalLeads) * 100 : 0;
    const qualifiedDelta = calculateDelta(qualifiedLeads, prevQualifiedLeads);

    const convertedLeads = filteredLeads.filter(l => l.status === 'converted').length;
    const prevConvertedLeads = prevLeads.filter(l => l.status === 'converted').length;
    const conversionPct = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;
    const convertedDelta = calculateDelta(convertedLeads, prevConvertedLeads);

    const unqualifiedLeads = filteredLeads.filter(l => l.status === 'unqualified').length;
    const prevUnqualifiedLeads = prevLeads.filter(l => l.status === 'unqualified').length;
    const unqualifiedPct = totalLeads > 0 ? (unqualifiedLeads / totalLeads) * 100 : 0;
    const unqualifiedDelta = calculateDelta(unqualifiedLeads, prevUnqualifiedLeads);

    const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;
    const prevConversionRate = prevTotalLeads > 0 ? (prevConvertedLeads / prevTotalLeads) * 100 : 0;
    const conversionRateDelta = calculateDelta(conversionRate, prevConversionRate);

    const quotationsCreated = filteredQuotations.length;
    const prevQuotationsCreated = prevQuotations.length;
    const quotationsDelta = calculateDelta(quotationsCreated, prevQuotationsCreated);

    const dealsCreated = filteredDeals.length;
    const prevDealsCreated = prevDeals.length;
    const dealsDelta = calculateDelta(dealsCreated, prevDealsCreated);

    const invoicesGenerated = filteredPayments.length;
    const prevInvoicesGenerated = prevPayments.length;
    const invoicesDelta = calculateDelta(invoicesGenerated, prevInvoicesGenerated);

    return {
      totalLeads,
      leadsDelta,
      qualifiedLeads,
      qualifiedPct,
      qualifiedDelta,
      convertedLeads,
      conversionPct,
      convertedDelta,
      unqualifiedLeads,
      unqualifiedPct,
      unqualifiedDelta,
      conversionRate,
      conversionRateDelta,
      quotationsCreated,
      quotationsDelta,
      dealsCreated,
      dealsDelta,
      invoicesGenerated,
      invoicesDelta
    };
  }, [filteredLeads, prevLeads, filteredQuotations, prevQuotations, filteredDeals, prevDeals, filteredPayments, prevPayments]);

  // Target Achievement (Monthly Target: ₹85,00,000 as seen in assignment.png)
  const targetAchievement = useMemo(() => {
    const target = 8500000;
    const achieved = filteredDeals.reduce((sum, d) => sum + d.collectedAmount, 0);
    const remaining = Math.max(0, target - achieved);
    const achievedPct = (achieved / target) * 100;

    return {
      target,
      achieved,
      remaining,
      achievedPct
    };
  }, [filteredDeals]);

  // Lead Funnel
  const leadFunnel = useMemo(() => {
    const total = filteredLeads.length;
    const qualified = filteredLeads.filter(l => l.status === 'qualified' || l.status === 'converted').length;
    const converted = filteredLeads.filter(l => l.status === 'converted').length;
    const unqualified = filteredLeads.filter(l => l.status === 'unqualified').length;

    return {
      total,
      qualified,
      qualifiedPct: total > 0 ? (qualified / total) * 100 : 0,
      converted,
      convertedPct: total > 0 ? (converted / total) * 100 : 0,
      unqualified,
      unqualifiedPct: total > 0 ? (unqualified / total) * 100 : 0
    };
  }, [filteredLeads]);

  // Daily Lead Trend (aggregated per day)
  const dailyLeadTrend = useMemo(() => {
    const map = new Map<string, { newLeads: number; qualified: number; converted: number }>();
    
    // Initialize day map for every day in range
    const cur = new Date(currentRange.start);
    while (cur <= currentRange.end) {
      const dateKey = cur.toISOString().split('T')[0];
      map.set(dateKey, { newLeads: 0, qualified: 0, converted: 0 });
      cur.setDate(cur.getDate() + 1);
    }

    filteredLeads.forEach(l => {
      const dKey = l.createdAt.split('T')[0];
      const entry = map.get(dKey);
      if (entry) {
        entry.newLeads++;
        if (l.status === 'qualified' || l.status === 'converted') entry.qualified++;
        if (l.status === 'converted') entry.converted++;
      }
    });

    return Array.from(map.entries()).map(([date, counts]) => {
      const d = new Date(date);
      const displayDate = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
      return {
        date,
        displayDate,
        ...counts
      };
    });
  }, [filteredLeads, currentRange]);

  // Lead Sources Breakdown
  const leadSources = useMemo(() => {
    const counts: Record<string, number> = {
      'Google Ads': 0,
      'Website': 0,
      'Other': 0,
      'Just Dial': 0
    };

    filteredLeads.forEach(l => {
      if (l.source === 'Google Ads') counts['Google Ads']++;
      else if (l.source === 'Website') counts['Website']++;
      else if (l.source === 'Just Dial') counts['Just Dial']++;
      else counts['Other']++;
    });

    const total = filteredLeads.length || 1;
    const colors = ['#2563eb', '#10b981', '#f59e0b', '#6366f1'];

    return Object.entries(counts).map(([name, count], idx) => ({
      name,
      count,
      percentage: (count / total) * 100,
      color: colors[idx % colors.length]
    }));
  }, [filteredLeads]);

  // Quotations by Service & Quotation Value by Service
  const { quotationsByService, quotationValueByService, serviceWiseQuotationDetails } = useMemo(() => {
    const countMap: Record<string, { count: number; value: number; accepted: number; pending: number; rejected: number }> = {};

    COMPLIANCE_SERVICES.forEach(s => {
      countMap[s.id] = { count: 0, value: 0, accepted: 0, pending: 0, rejected: 0 };
    });

    filteredQuotations.forEach(q => {
      if (!countMap[q.serviceId]) {
        countMap[q.serviceId] = { count: 0, value: 0, accepted: 0, pending: 0, rejected: 0 };
      }
      countMap[q.serviceId].count++;
      countMap[q.serviceId].value += q.totalAmount;
      if (q.status === 'accepted') countMap[q.serviceId].accepted++;
      else if (q.status === 'pending') countMap[q.serviceId].pending++;
      else if (q.status === 'rejected') countMap[q.serviceId].rejected++;
    });

    const totalVal = Object.values(countMap).reduce((s, c) => s + c.value, 0) || 1;

    const byCount = COMPLIANCE_SERVICES
      .map(s => ({
        serviceId: s.id,
        name: s.shortName,
        count: countMap[s.id]?.count || 0
      }))
      .filter(item => item.count > 0)
      .sort((a, b) => b.count - a.count);

    const byValue = COMPLIANCE_SERVICES
      .map(s => {
        const val = countMap[s.id]?.value || 0;
        return {
          serviceId: s.id,
          name: s.shortName,
          value: val,
          percentage: (val / totalVal) * 100
        };
      })
      .filter(item => item.value > 0)
      .sort((a, b) => b.value - a.value);

    const details = COMPLIANCE_SERVICES.map(s => {
      const data = countMap[s.id] || { count: 0, value: 0, accepted: 0, pending: 0, rejected: 0 };
      const convRate = data.count > 0 ? (data.accepted / data.count) * 100 : 0;
      return {
        serviceId: s.id,
        serviceName: s.name,
        quotationsCount: data.count,
        quotedAmount: data.value,
        accepted: data.accepted,
        pending: data.pending,
        rejected: data.rejected,
        convRate
      };
    }).filter(d => d.quotationsCount > 0);

    return {
      quotationsByService: byCount,
      quotationValueByService: byValue,
      serviceWiseQuotationDetails: details
    };
  }, [filteredQuotations]);

  // Quote-to-deal conversion rate
  const quoteToDealConvRate = useMemo(() => {
    const quotesCount = filteredQuotations.length;
    const dealsCount = filteredDeals.length;
    const rate = quotesCount > 0 ? (dealsCount / quotesCount) * 100 : 0;
    return { rate, dealsCount, quotesCount };
  }, [filteredQuotations, filteredDeals]);

  // Deals Created vs Deal Revenue by Service
  const dealsVsRevenueByService = useMemo(() => {
    const map = new Map<string, { dealsCreated: number; dealRevenue: number }>();

    filteredDeals.forEach(d => {
      const service = COMPLIANCE_SERVICES.find(s => s.id === d.serviceId);
      const name = service ? service.shortName : d.serviceName;
      const cur = map.get(name) || { dealsCreated: 0, dealRevenue: 0 };
      cur.dealsCreated++;
      cur.dealRevenue += d.totalAmount;
      map.set(name, cur);
    });

    return Array.from(map.entries())
      .map(([serviceName, data]) => ({ serviceName, ...data }))
      .sort((a, b) => b.dealsCreated - a.dealsCreated);
  }, [filteredDeals]);

  // Revenue by Category
  const revenueByCategory = useMemo(() => {
    const map = new Map<string, number>();
    let total = 0;

    filteredDeals.forEach(d => {
      const cur = map.get(d.category) || 0;
      map.set(d.category, cur + d.totalAmount);
      total += d.totalAmount;
    });

    const tot = total || 1;
    return Array.from(map.entries())
      .map(([category, revenue]) => ({
        category,
        revenue,
        percentage: (revenue / tot) * 100
      }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [filteredDeals]);

  // Priority Breakdown
  const priorityBreakdown = useMemo(() => {
    const high = { count: 0, revenue: 0, percentage: 0 };
    const medium = { count: 0, revenue: 0, percentage: 0 };
    const low = { count: 0, revenue: 0, percentage: 0 };

    let totalRev = 0;
    filteredDeals.forEach(d => {
      totalRev += d.totalAmount;
      if (d.priority === 'high') {
        high.count++;
        high.revenue += d.totalAmount;
      } else if (d.priority === 'medium') {
        medium.count++;
        medium.revenue += d.totalAmount;
      } else {
        low.count++;
        low.revenue += d.totalAmount;
      }
    });

    const tot = totalRev || 1;
    high.percentage = (high.revenue / tot) * 100;
    medium.percentage = (medium.revenue / tot) * 100;
    low.percentage = (low.revenue / tot) * 100;

    return { high, medium, low };
  }, [filteredDeals]);

  // Daily Revenue Trend (Revenue booked vs Collected)
  const dailyRevenueTrend = useMemo(() => {
    const map = new Map<string, { revenue: number; collected: number }>();

    const cur = new Date(currentRange.start);
    while (cur <= currentRange.end) {
      const dKey = cur.toISOString().split('T')[0];
      map.set(dKey, { revenue: 0, collected: 0 });
      cur.setDate(cur.getDate() + 1);
    }

    filteredDeals.forEach(d => {
      const dKey = d.createdAt.split('T')[0];
      const entry = map.get(dKey);
      if (entry) {
        entry.revenue += d.totalAmount;
        entry.collected += d.collectedAmount;
      }
    });

    return Array.from(map.entries()).map(([date, vals]) => {
      const d = new Date(date);
      const displayDate = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
      return {
        date,
        displayDate,
        ...vals
      };
    });
  }, [filteredDeals, currentRange]);

  // Total vs Collected Revenue
  const totalVsCollectedRevenue = useMemo(() => {
    const totalDealValue = filteredDeals.reduce((sum, d) => sum + d.totalAmount, 0);
    const netCollectedRevenue = filteredDeals.reduce((sum, d) => sum + d.collectedAmount, 0);
    const outstandingRevenue = Math.max(0, totalDealValue - netCollectedRevenue);

    return {
      totalDealValue,
      netCollectedRevenue,
      outstandingRevenue
    };
  }, [filteredDeals]);

  // Sales Team Activity
  const salesTeamActivity = useMemo(() => {
    const salesMembers = dataset.teamMembers.filter(m => m.role === 'sales');

    return salesMembers.map(member => {
      const leads = filteredLeads.filter(l => l.assignedSalesId === member.id);
      const qualified = leads.filter(l => l.status === 'qualified' || l.status === 'converted').length;
      const converted = leads.filter(l => l.status === 'converted').length;
      const conversionPct = leads.length > 0 ? (converted / leads.length) * 100 : 0;

      const quotes = filteredQuotations.filter(q => q.assignedSalesId === member.id);
      const deals = filteredDeals.filter(d => d.assignedSalesId === member.id);
      const dealValue = deals.reduce((s, d) => s + d.totalAmount, 0);
      const revenue = deals.reduce((s, d) => s + d.collectedAmount, 0);

      return {
        id: member.id,
        name: member.name,
        avatar: member.avatar,
        leadsHandled: leads.length,
        qualified,
        converted,
        conversionPct,
        quotations: quotes.length,
        deals: deals.length,
        dealValue,
        revenue
      };
    });
  }, [dataset.teamMembers, filteredLeads, filteredQuotations, filteredDeals]);

  // Operations Team Activity
  const operationsTeamActivity = useMemo(() => {
    const opsMembers = dataset.teamMembers.filter(m => m.role === 'operations');

    return opsMembers.map(member => {
      const orders = filteredOrders.filter(o => o.assignedOpsId === member.id);
      const stagesCompleted = orders.reduce((s, o) => s + o.stagesCompleted, 0);
      const pendingStages = orders.reduce((s, o) => s + (o.totalStages - o.stagesCompleted), 0);
      const overdueOrders = orders.filter(o => o.isOverdue).length;

      return {
        id: member.id,
        name: member.name,
        avatar: member.avatar,
        ordersUpdated: orders.length,
        stagesCompleted,
        pendingStages,
        overdueOrders
      };
    });
  }, [dataset.teamMembers, filteredOrders]);

  // Orders and Stage Progress (by service)
  const ordersAndStageProgress = useMemo(() => {
    const map = new Map<string, { pending: number; inProgress: number; completed: number; onHold: number }>();

    COMPLIANCE_SERVICES.forEach(s => {
      map.set(s.id, { pending: 0, inProgress: 0, completed: 0, onHold: 0 });
    });

    filteredOrders.forEach(o => {
      const entry = map.get(o.serviceId) || { pending: 0, inProgress: 0, completed: 0, onHold: 0 };
      if (o.status === 'pending') entry.pending++;
      else if (o.status === 'in_progress') entry.inProgress++;
      else if (o.status === 'completed') entry.completed++;
      else if (o.status === 'on_hold') entry.onHold++;
      map.set(o.serviceId, entry);
    });

    return COMPLIANCE_SERVICES.map(s => {
      const entry = map.get(s.id) || { pending: 0, inProgress: 0, completed: 0, onHold: 0 };
      const total = entry.pending + entry.inProgress + entry.completed + entry.onHold;
      return {
        serviceId: s.id,
        serviceName: s.name,
        ...entry,
        total
      };
    }).filter(s => s.total > 0);
  }, [filteredOrders]);

  // Entity Finders
  const findLeadById = (id: string) => dataset.leads.find(l => l.id === id || l.leadNumber === id);
  const findDealById = (id: string) => dataset.deals.find(d => d.id === id || d.dealNumber === id);
  const findOrderById = (id: string) => dataset.orders.find(o => o.id === id || o.orderNumber === id);
  const findPaymentById = (id: string) => dataset.payments.find(p => p.id === id || p.paymentNumber === id);

  // Drill-down stack handlers
  const openDrillDown = (item: DrillDownStackItem) => {
    setDrillDownStack([item]);
  };

  const pushDrillDown = (item: DrillDownStackItem) => {
    setDrillDownStack(prev => [...prev, item]);
  };

  const popDrillDown = () => {
    setDrillDownStack(prev => prev.slice(0, prev.length - 1));
  };

  const closeDrillDown = () => {
    setDrillDownStack([]);
  };

  const inspectLead = (leadId: string) => {
    const lead = findLeadById(leadId);
    if (!lead) return;
    pushDrillDown({
      type: 'lead',
      title: `Lead Details: ${lead.leadNumber}`,
      subtitle: `${lead.name} • ${lead.companyName}`,
      activeEntityId: lead.id,
      entityType: 'lead'
    });
  };

  const inspectDeal = (dealId: string) => {
    const deal = findDealById(dealId);
    if (!deal) return;
    pushDrillDown({
      type: 'deal',
      title: `Deal Details: ${deal.dealNumber}`,
      subtitle: `${deal.title} • ${deal.stage.toUpperCase()}`,
      activeEntityId: deal.id,
      entityType: 'deal'
    });
  };

  const inspectOrder = (orderId: string) => {
    const order = findOrderById(orderId);
    if (!order) return;
    pushDrillDown({
      type: 'order',
      title: `Order Fulfillment: ${order.orderNumber}`,
      subtitle: `${order.serviceName} • ${order.clientName}`,
      activeEntityId: order.id,
      entityType: 'order'
    });
  };

  const inspectPayment = (paymentId: string) => {
    const pay = findPaymentById(paymentId);
    if (!pay) return;
    pushDrillDown({
      type: 'payment_list',
      title: `Payment Receipt: ${pay.paymentNumber}`,
      subtitle: `Recorded for ${pay.clientName} (${pay.method})`,
      activeEntityId: pay.id,
      entityType: 'payment',
      records: [pay]
    });
  };

  return (
    <DashboardContext.Provider value={{
      preset,
      setPreset: applyPreset,
      startDate,
      endDate,
      setDateRange: setCustomDateRange,
      selectedUserId,
      setSelectedUserId,
      selectedDepartment,
      setSelectedDepartment,
      comparisonLabel,

      filteredLeads,
      filteredQuotations,
      filteredDeals,
      filteredOrders,
      filteredPayments,
      filteredActivities,
      teamMembers: dataset.teamMembers,

      kpis,
      targetAchievement,
      leadFunnel,
      dailyLeadTrend,
      leadSources,

      quotationsByService,
      quotationValueByService,
      serviceWiseQuotationDetails,
      quoteToDealConvRate,

      dealsVsRevenueByService,
      revenueByCategory,
      priorityBreakdown,
      dailyRevenueTrend,
      totalVsCollectedRevenue,

      salesTeamActivity,
      operationsTeamActivity,
      ordersAndStageProgress,

      drillDownStack,
      isDrillDownOpen: drillDownStack.length > 0,
      openDrillDown,
      pushDrillDown,
      popDrillDown,
      closeDrillDown,
      inspectLead,
      inspectDeal,
      inspectOrder,
      inspectPayment,
      findLeadById,
      findDealById,
      findOrderById,
      findPaymentById
    }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};
