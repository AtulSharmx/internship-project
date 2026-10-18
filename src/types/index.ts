export type LeadStatus = 'new' | 'qualified' | 'converted' | 'unqualified';

export type LeadSource = 
  | 'Google Ads'
  | 'Website'
  | 'Just Dial'
  | 'Referral'
  | 'CA Partner Network'
  | 'Direct';

export type QuotationStatus = 'pending' | 'accepted' | 'rejected';

export type DealPriority = 'high' | 'medium' | 'low';

export type DealStage = 
  | 'proposal_sent'
  | 'in_negotiation'
  | 'won'
  | 'lost'
  | 'invoicing';

export type OrderStatus = 'pending' | 'in_progress' | 'completed' | 'on_hold';

export type PaymentMethod = 
  | 'UPI'
  | 'NEFT/RTGS'
  | 'Credit Card'
  | 'Net Banking'
  | 'Cheque';

export type PaymentStatus = 'success' | 'pending' | 'failed';

export interface ServiceDefinition {
  id: string;
  name: string;
  shortName: string;
  category: string;
  basePrice: number;
  standardTurnaroundDays: number;
  description: string;
  typicalStages: string[];
}

export interface Lead {
  id: string;
  leadNumber: string; // e.g. L-209610
  name: string;
  companyName: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  source: LeadSource;
  status: LeadStatus;
  primaryServiceId: string;
  serviceInterest: string;
  estimatedBudget: number;
  assignedSalesId: string;
  createdAt: string; // ISO string
  qualificationReason?: string;
  notes: string;
}

export interface Quotation {
  id: string;
  quotationNumber: string; // e.g. Q-10467
  leadId: string;
  leadName: string;
  companyName: string;
  serviceId: string;
  serviceName: string;
  category: string;
  amount: number;
  discount: number;
  taxAmount: number;
  totalAmount: number;
  status: QuotationStatus;
  validUntil: string;
  createdAt: string;
  assignedSalesId: string;
  notes: string;
}

export interface Deal {
  id: string;
  dealNumber: string; // e.g. D-822
  leadId: string;
  leadName: string;
  companyName: string;
  quotationId: string;
  title: string;
  serviceId: string;
  serviceName: string;
  category: string;
  totalAmount: number;
  collectedAmount: number;
  outstandingAmount: number;
  priority: DealPriority;
  stage: DealStage;
  assignedSalesId: string;
  createdAt: string;
  expectedCloseDate: string;
  closedAt?: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. O-2168
  dealId: string;
  dealNumber: string;
  leadId: string;
  clientName: string;
  companyName: string;
  serviceId: string;
  serviceName: string;
  status: OrderStatus;
  stagesCompleted: number;
  totalStages: number;
  currentStage: string;
  assignedOpsId: string;
  startDate: string;
  dueDate: string;
  completedDate?: string;
  isOverdue: boolean;
  notes: string;
}

export interface Payment {
  id: string;
  paymentNumber: string; // e.g. P-1081
  dealId: string;
  dealNumber: string;
  leadId: string;
  clientName: string;
  companyName: string;
  serviceName: string;
  amount: number;
  date: string;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionRef: string;
  recordedBy: string;
  receiptNumber: string;
}

export interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  role: 'sales' | 'operations' | 'admin';
  department: 'Sales' | 'Operations' | 'Finance' | 'Executive';
  email: string;
  phone: string;
}

export interface CRMActivity {
  id: string;
  timestamp: string; // ISO string
  employeeId: string;
  employeeName: string;
  employeeAvatar: string;
  action: 'Lead updated' | 'Payment recorded' | 'Order created' | 'Deal created' | 'Quotation created';
  recordType: 'lead' | 'payment' | 'order' | 'deal' | 'quotation';
  recordId: string; // e.g. L-209610, P-1081
  description: string;
}

export type DatePreset = 'today' | 'last_7_days' | 'last_30_days' | 'custom';

export interface DateFilterState {
  preset: DatePreset;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  label: string;
}

export type DrillDownType = 
  | 'kpi'
  | 'lead'
  | 'lead_list'
  | 'quotation_list'
  | 'deal'
  | 'deal_list'
  | 'order'
  | 'order_list'
  | 'payment_list'
  | 'service'
  | 'team_member';

export interface DrillDownState {
  isOpen: boolean;
  type: DrillDownType;
  title: string;
  subtitle?: string;
  activeEntityId?: string;
  filterContext?: {
    serviceId?: string;
    status?: string;
    source?: string;
    priority?: string;
    userId?: string;
  };
}
