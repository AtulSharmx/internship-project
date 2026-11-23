import { 
  Lead, 
  Quotation, 
  Deal, 
  Order, 
  Payment, 
  TeamMember, 
  CRMActivity,
  LeadSource,
  LeadStatus,
  DealPriority,
  DealStage,
  OrderStatus,
  PaymentMethod
} from '../types';
import { COMPLIANCE_SERVICES } from './services';

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'user_nancy',
    name: 'Nancy Singh',
    avatar: 'N',
    role: 'sales',
    department: 'Sales',
    email: 'nancy.s@compliancehub.in',
    phone: '+91 98112 34561'
  },
  {
    id: 'user_sneha',
    name: 'Sneha Choudhary',
    avatar: 'S',
    role: 'sales',
    department: 'Sales',
    email: 'sneha.c@compliancehub.in',
    phone: '+91 98223 45672'
  },
  {
    id: 'user_tannu',
    name: 'Tannu Kumari',
    avatar: 'T',
    role: 'sales',
    department: 'Sales',
    email: 'tannu.k@compliancehub.in',
    phone: '+91 98334 56783'
  },
  {
    id: 'user_rahul',
    name: 'Rahul Verma',
    avatar: 'R',
    role: 'sales',
    department: 'Sales',
    email: 'rahul.v@compliancehub.in',
    phone: '+91 98445 67894'
  },
  {
    id: 'user_priya',
    name: 'Priya Sharma',
    avatar: 'P',
    role: 'sales',
    department: 'Sales',
    email: 'priya.s@compliancehub.in',
    phone: '+91 98556 78905'
  },
  {
    id: 'user_gaurav',
    name: 'Gaurav Pant',
    avatar: 'G',
    role: 'operations',
    department: 'Operations',
    email: 'gaurav.p@compliancehub.in',
    phone: '+91 98667 89016'
  },
  {
    id: 'user_srishti',
    name: 'Srishti Upadhyay',
    avatar: 'S',
    role: 'operations',
    department: 'Operations',
    email: 'srishti.u@compliancehub.in',
    phone: '+91 98778 90127'
  },
  {
    id: 'user_azam',
    name: 'Azam Afaroz',
    avatar: 'A',
    role: 'operations',
    department: 'Operations',
    email: 'azam.a@compliancehub.in',
    phone: '+91 98889 01238'
  },
  {
    id: 'user_vikram',
    name: 'Vikram Rathore',
    avatar: 'V',
    role: 'operations',
    department: 'Operations',
    email: 'vikram.r@compliancehub.in',
    phone: '+91 98990 12349'
  }
];

const INDIAN_CITIES = [
  { city: 'Bengaluru', state: 'Karnataka' },
  { city: 'Mumbai', state: 'Maharashtra' },
  { city: 'Delhi', state: 'Delhi NCR' },
  { city: 'Hyderabad', state: 'Telangana' },
  { city: 'Pune', state: 'Maharashtra' },
  { city: 'Gurugram', state: 'Haryana' },
  { city: 'Noida', state: 'Uttar Pradesh' },
  { city: 'Chennai', state: 'Tamil Nadu' },
  { city: 'Ahmedabad', state: 'Gujarat' },
  { city: 'Jaipur', state: 'Rajasthan' },
  { city: 'Kolkata', state: 'West Bengal' },
  { city: 'Indore', state: 'Madhya Pradesh' }
];

const COMPANY_PREFIXES = [
  'Aura Tech', 'Zenith Logistics', 'BluePeak Innovations', 'Nexa Health', 
  'GreenSprout Agritech', 'Kavach Cyber', 'Vyapaar Network', 'Veda Organics', 
  'CloudScale AI', 'Bharat Solar', 'UrbanKite Retail', 'Dhruv Aerospace',
  'FinWave Digital', 'Samriddhi Micro', 'KisanSetu Technologies', 'Pratham Foods',
  'Trishul Defense', 'SwiftCraft Media', 'OmniPulse Pharma', 'Ananta Energy'
];

const FOUNDER_NAMES = [
  'Rohan Mehta', 'Aditi Deshmukh', 'Vikramaditya Rao', 'Ananya Iyer', 
  'Arjun Malhotra', 'Pooja Agarwal', 'Manish Kothari', 'Kavita Nair',
  'Deepak Singhal', 'Divya Chawla', 'Siddharth Jain', 'Ritu Bansal',
  'Kunal Bhatia', 'Sunita Patel', 'Harshvardhan Joshi', 'Meera Subramanian',
  'Sandeep Reddy', 'Neha Gupta', 'Rajeev Kapoor', 'Shweta Tiwari'
];

// Helper seeded random generator for stable repeatable data
function createSeededRandom(seed: number = 42) {
  let s = seed;
  return function() {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export function generateDashboardMockData() {
  const rand = createSeededRandom(108);

  const leads: Lead[] = [];
  const quotations: Quotation[] = [];
  const deals: Deal[] = [];
  const orders: Order[] = [];
  const payments: Payment[] = [];
  const activities: CRMActivity[] = [];

  const salesTeam = TEAM_MEMBERS.filter(m => m.role === 'sales');
  const opsTeam = TEAM_MEMBERS.filter(m => m.role === 'operations');

  let leadSeq = 209600;
  let quoteSeq = 10450;
  let dealSeq = 815;
  let orderSeq = 2150;
  let paymentSeq = 1075;

  // Generate data across 90 days from Aug 1, 2026 to Oct 31, 2026
  const startDate = new Date(2026, 7, 1); // Aug 1, 2026
  const endDate = new Date(2026, 9, 31, 23, 59, 59); // Oct 31, 2026
  const totalDays = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));

  for (let dayOffset = 0; dayOffset <= totalDays; dayOffset++) {
    const currentDate = new Date(startDate.getTime() + dayOffset * 86400000);
    const isOctober = currentDate.getMonth() === 9; // Oct is month 9 (0-indexed)
    
    // October runs at roughly 3-4 inbound leads a day.
    const leadsCountForDay = isOctober ? (dayOffset % 7 === 0 || dayOffset % 7 === 6 ? 2 : Math.floor(rand() * 3) + 2) : Math.floor(rand() * 3) + 1;

    for (let l = 0; l < leadsCountForDay; l++) {
      leadSeq++;
      const assignedSales = salesTeam[Math.floor(rand() * salesTeam.length)];
      const loc = INDIAN_CITIES[Math.floor(rand() * INDIAN_CITIES.length)];
      const service = COMPLIANCE_SERVICES[Math.floor(rand() * COMPLIANCE_SERVICES.length)];
      const founder = FOUNDER_NAMES[Math.floor(rand() * FOUNDER_NAMES.length)];
      const compPrefix = COMPANY_PREFIXES[Math.floor(rand() * COMPANY_PREFIXES.length)];
      const compName = `${compPrefix} ${service.id === 'pvt_ltd' ? 'Pvt Ltd' : service.id === 'llp' ? 'LLP' : 'Enterprises'}`;

      // Google Ads brings in roughly three quarters of inbound leads.
      const srcRand = rand();
      let source: LeadSource = 'Google Ads';
      if (srcRand > 0.77) source = 'Website';
      else if (srcRand > 0.94) source = 'CA Partner Network';
      else if (srcRand > 0.98) source = 'Just Dial';

      // Status distribution: ~46% Qualified, ~25% Converted, ~54% Unqualified
      const statusRand = rand();
      let status: LeadStatus = 'unqualified';
      let qualificationReason = 'Insufficient capital or contact unreachable';

      if (statusRand < 0.28) {
        status = 'converted';
        qualificationReason = 'High intent founder, KYC verified, quotation approved';
      } else if (statusRand < 0.52) {
        status = 'qualified';
        qualificationReason = 'Direct incorporation requirement, verified contact & budget';
      } else if (statusRand < 0.75) {
        status = 'new';
        qualificationReason = 'Fresh inbound lead, discovery scheduled';
      }

      const hour = 9 + Math.floor(rand() * 9);
      const minute = Math.floor(rand() * 60);
      const leadDate = new Date(currentDate);
      leadDate.setHours(hour, minute, 0, 0);

      const leadId = `lead_${leadSeq}`;
      const leadNumber = `L-${leadSeq}`;

      const leadObj: Lead = {
        id: leadId,
        leadNumber,
        name: founder,
        companyName: compName,
        email: `${founder.toLowerCase().replace(/\s+/g, '.')}@${compPrefix.toLowerCase().replace(/\s+/g, '')}.in`,
        phone: `+91 ${98000 + Math.floor(rand() * 1999)} ${10000 + Math.floor(rand() * 89999)}`,
        city: loc.city,
        state: loc.state,
        source,
        status,
        primaryServiceId: service.id,
        serviceInterest: service.name,
        estimatedBudget: Math.round(service.basePrice * (0.9 + rand() * 0.4)),
        assignedSalesId: assignedSales.id,
        createdAt: leadDate.toISOString(),
        qualificationReason,
        notes: `Inquiry regarding ${service.name}. Looking to complete filing within 2-3 weeks.`
      };
      leads.push(leadObj);

      // Create CRM activity for lead creation
      activities.push({
        id: `act_${activities.length + 1}`,
        timestamp: leadDate.toISOString(),
        employeeId: assignedSales.id,
        employeeName: assignedSales.name,
        employeeAvatar: assignedSales.avatar,
        action: 'Lead updated',
        recordType: 'lead',
        recordId: leadNumber,
        description: `Lead created from ${source} for ${service.shortName}`
      });

      // If Qualified or Converted, generate Quotations (1 to 2 quotations per lead)
      if (status === 'qualified' || status === 'converted' || (status === 'new' && rand() > 0.4)) {
        const numQuotes = rand() > 0.8 ? 2 : 1;
        for (let q = 0; q < numQuotes; q++) {
          quoteSeq++;
          const qService = q === 0 ? service : COMPLIANCE_SERVICES[Math.floor(rand() * COMPLIANCE_SERVICES.length)];
          const quoteAmount = Math.round(qService.basePrice * (0.95 + rand() * 0.35));
          const discount = rand() > 0.6 ? Math.round(quoteAmount * 0.1) : 0;
          const tax = Math.round((quoteAmount - discount) * 0.18);
          const totalAmount = quoteAmount - discount + tax;

          let quoteStatus: 'pending' | 'accepted' | 'rejected' = 'pending';
          if (status === 'converted' && q === 0) {
            quoteStatus = 'accepted';
          } else if (rand() > 0.8) {
            quoteStatus = 'rejected';
          }

          const qDate = new Date(leadDate.getTime() + (Math.floor(rand() * 4) + 1) * 3600000);
          const validUntil = new Date(qDate.getTime() + 15 * 86400000);

          const quoteId = `quote_${quoteSeq}`;
          const quoteNumber = `Q-${quoteSeq}`;

          const quoteObj: Quotation = {
            id: quoteId,
            quotationNumber: quoteNumber,
            leadId: leadObj.id,
            leadName: leadObj.name,
            companyName: leadObj.companyName,
            serviceId: qService.id,
            serviceName: qService.name,
            category: qService.category,
            amount: quoteAmount,
            discount,
            taxAmount: tax,
            totalAmount,
            status: quoteStatus,
            validUntil: validUntil.toISOString().split('T')[0],
            createdAt: qDate.toISOString(),
            assignedSalesId: assignedSales.id,
            notes: `Standard package pricing for ${qService.name} including official filing fees.`
          };
          quotations.push(quoteObj);

          activities.push({
            id: `act_${activities.length + 1}`,
            timestamp: qDate.toISOString(),
            employeeId: assignedSales.id,
            employeeName: assignedSales.name,
            employeeAvatar: assignedSales.avatar,
            action: 'Quotation created',
            recordType: 'quotation',
            recordId: quoteNumber,
            description: `Quoted ₹${totalAmount.toLocaleString('en-IN')} for ${qService.shortName}`
          });

          // If quote accepted, create Deal
          if (quoteStatus === 'accepted') {
            dealSeq++;
            const dealDate = new Date(qDate.getTime() + (Math.floor(rand() * 8) + 2) * 3600000);
            const dealId = `deal_${dealSeq}`;
            const dealNumber = `D-${dealSeq}`;

            // Split payments: Collected vs Outstanding
            const hasFullPayment = rand() > 0.45;
            const collected = hasFullPayment 
              ? totalAmount 
              : Math.round((totalAmount * (0.4 + rand() * 0.4)) / 100) * 100;
            const outstanding = totalAmount - collected;

            const priorityRand = rand();
            const priority: DealPriority = priorityRand > 0.5 ? 'high' : priorityRand > 0.15 ? 'medium' : 'low';
            const stage: DealStage = outstanding === 0 ? 'won' : 'invoicing';

            const dealObj: Deal = {
              id: dealId,
              dealNumber,
              leadId: leadObj.id,
              leadName: leadObj.name,
              companyName: leadObj.companyName,
              quotationId: quoteObj.id,
              title: `${qService.shortName} - ${leadObj.companyName}`,
              serviceId: qService.id,
              serviceName: qService.name,
              category: qService.category,
              totalAmount,
              collectedAmount: collected,
              outstandingAmount: outstanding,
              priority,
              stage,
              assignedSalesId: assignedSales.id,
              createdAt: dealDate.toISOString(),
              expectedCloseDate: new Date(dealDate.getTime() + 7 * 86400000).toISOString().split('T')[0],
              closedAt: dealDate.toISOString()
            };
            deals.push(dealObj);

            activities.push({
              id: `act_${activities.length + 1}`,
              timestamp: dealDate.toISOString(),
              employeeId: assignedSales.id,
              employeeName: assignedSales.name,
              employeeAvatar: assignedSales.avatar,
              action: 'Deal created',
              recordType: 'deal',
              recordId: dealNumber,
              description: `Closed deal worth ₹${totalAmount.toLocaleString('en-IN')}`
            });

            // Create Order for Deal
            orderSeq++;
            const opsAgent = opsTeam[Math.floor(rand() * opsTeam.length)];
            const orderDate = new Date(dealDate.getTime() + 2 * 3600000);
            const totalStages = qService.typicalStages.length;
            
            // Order status distribution
            const orderStatusRand = rand();
            let orderStatus: OrderStatus = 'pending';
            let stagesCompleted = 0;
            let completedDate: string | undefined = undefined;

            if (orderStatusRand > 0.65) {
              orderStatus = 'completed';
              stagesCompleted = totalStages;
              completedDate = new Date(orderDate.getTime() + qService.standardTurnaroundDays * 86400000).toISOString();
            } else if (orderStatusRand > 0.25) {
              orderStatus = 'in_progress';
              stagesCompleted = Math.min(totalStages - 1, Math.floor(rand() * (totalStages - 1)) + 1);
            } else if (orderStatusRand < 0.08) {
              orderStatus = 'on_hold';
              stagesCompleted = 1;
            } else {
              orderStatus = 'pending';
              stagesCompleted = 0;
            }

            const currentStage = stagesCompleted === totalStages 
              ? 'All Stages Finalized' 
              : qService.typicalStages[stagesCompleted] || 'Initiating';

            const orderId = `order_${orderSeq}`;
            const orderNumber = `O-${orderSeq}`;

            const orderObj: Order = {
              id: orderId,
              orderNumber,
              dealId: dealObj.id,
              dealNumber: dealObj.dealNumber,
              leadId: leadObj.id,
              clientName: leadObj.name,
              companyName: leadObj.companyName,
              serviceId: qService.id,
              serviceName: qService.name,
              status: orderStatus,
              stagesCompleted,
              totalStages,
              currentStage,
              assignedOpsId: opsAgent.id,
              startDate: orderDate.toISOString(),
              dueDate: new Date(orderDate.getTime() + qService.standardTurnaroundDays * 86400000).toISOString(),
              completedDate,
              isOverdue: orderStatus !== 'completed' && rand() > 0.85,
              notes: `Fulfillment under ${opsAgent.name}. Client documentation uploaded on MCA/Department portal.`
            };
            orders.push(orderObj);

            activities.push({
              id: `act_${activities.length + 1}`,
              timestamp: orderDate.toISOString(),
              employeeId: opsAgent.id,
              employeeName: opsAgent.name,
              employeeAvatar: opsAgent.avatar,
              action: 'Order created',
              recordType: 'order',
              recordId: orderNumber,
              description: `Assigned order to ${opsAgent.name} (${currentStage})`
            });

            // Create Payment records (advance payment & balance payment if collected > 0)
            if (collected > 0) {
              paymentSeq++;
              const pDate = new Date(dealDate.getTime() + 1800000);
              const methods: PaymentMethod[] = ['UPI', 'NEFT/RTGS', 'Net Banking', 'Credit Card'];
              const method = methods[Math.floor(rand() * methods.length)];

              const payId = `pay_${paymentSeq}`;
              const payNumber = `P-${paymentSeq}`;

              payments.push({
                id: payId,
                paymentNumber: payNumber,
                dealId: dealObj.id,
                dealNumber: dealObj.dealNumber,
                leadId: leadObj.id,
                clientName: leadObj.name,
                companyName: leadObj.companyName,
                serviceName: qService.name,
                amount: collected,
                date: pDate.toISOString(),
                method,
                status: 'success',
                transactionRef: `TXN${Math.floor(100000000 + rand() * 900000000)}`,
                recordedBy: assignedSales.name,
                receiptNumber: `REC-${paymentSeq}`
              });

              activities.push({
                id: `act_${activities.length + 1}`,
                timestamp: pDate.toISOString(),
                employeeId: assignedSales.id,
                employeeName: assignedSales.name,
                employeeAvatar: assignedSales.avatar,
                action: 'Payment recorded',
                recordType: 'payment',
                recordId: payNumber,
                description: `Received ₹${collected.toLocaleString('en-IN')} via ${method}`
              });
            }
          }
        }
      }
    }
  }

  // Sort activities in reverse chronological order
  activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return {
    leads,
    quotations,
    deals,
    orders,
    payments,
    activities,
    teamMembers: TEAM_MEMBERS,
    services: COMPLIANCE_SERVICES
  };
}

export const initialMockDataset = generateDashboardMockData();
