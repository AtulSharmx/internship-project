import { ServiceDefinition } from '../types';

export const COMPLIANCE_SERVICES: ServiceDefinition[] = [
  {
    id: 'pvt_ltd',
    name: 'Private Limited Company Registration',
    shortName: 'Private Limited',
    category: 'Company Registration',
    basePrice: 11500,
    standardTurnaroundDays: 10,
    description: 'Complete MCA incorporation including DSC, DIN, SPICe+ filing, MoA/AoA, PAN/TAN & Bank Account assistance.',
    typicalStages: ['DSC & DIN Generation', 'Name Reservation (RUN)', 'SPICe+ Part B Filing', 'Certificate of Incorporation (COI)', 'PAN, TAN & Bank Acc']
  },
  {
    id: 'llp',
    name: 'LLP Registration',
    shortName: 'LLP Registration',
    category: 'Company Registration',
    basePrice: 8500,
    standardTurnaroundDays: 12,
    description: 'Limited Liability Partnership incorporation including FiLLiP filing and LLP Agreement drafting & filing (Form 3).',
    typicalStages: ['Partner DSC Issuance', 'Name Approval (RUN-LLP)', 'FiLLiP Form Submission', 'LLP Agreement Drafting', 'Form 3 RoC Filing']
  },
  {
    id: 'gst',
    name: 'GST Registration & Filing',
    shortName: 'GST Registration',
    category: 'Tax & Compliance',
    basePrice: 2499,
    standardTurnaroundDays: 5,
    description: 'New GSTIN registration with Aadhaar OTP authentication, principal place verification, and initial return filing setup.',
    typicalStages: ['Document Collection & KYC', 'GST Portal Application (REG-01)', 'Aadhaar Biometric/OTP Auth', 'ARN Generation', 'GSTIN Certificate Issuance']
  },
  {
    id: 'trademark',
    name: 'Trademark Registration',
    shortName: 'Trademark',
    category: 'Intellectual Property',
    basePrice: 6500,
    standardTurnaroundDays: 180,
    description: 'Comprehensive TM search across 45 classes, application drafting (TM-A), filing with IPO, and TM-1 receipt issuance.',
    typicalStages: ['Trademark Search & Class Audit', 'TM-A Form Preparation', 'IPO Filing & Fee Payment', 'Examination Report Monitoring', 'Publication & Registration']
  },
  {
    id: 'fssai',
    name: 'FSSAI Food License',
    shortName: 'FSSAI License',
    category: 'Licenses & Registrations',
    basePrice: 4500,
    standardTurnaroundDays: 7,
    description: 'Basic registration, State license or Central license assistance on FoSCoS portal for food manufacturers, cloud kitchens, and traders.',
    typicalStages: ['Business Category Assessment', 'FoSCoS Form-A/B Filing', 'Premises Blueprint & NOC Upload', 'Department Inspection Handling', 'FSSAI Certificate Download']
  },
  {
    id: 'iso',
    name: 'ISO Certification (9001/27001)',
    shortName: 'ISO Certification',
    category: 'Quality & Audit',
    basePrice: 18500,
    standardTurnaroundDays: 14,
    description: 'IAF/Non-IAF accredited ISO certification for Quality Management (9001) and Information Security (27001) compliance audits.',
    typicalStages: ['Gap Analysis & Documentation', 'Internal Quality Audit', 'Certification Body Pre-Audit', 'Final Audit & Rectification', 'ISO Certificate Issuance']
  },
  {
    id: 'startup_india',
    name: 'Startup India DPIIT Recognition',
    shortName: 'Startup India',
    category: 'Government Recognition',
    basePrice: 5999,
    standardTurnaroundDays: 8,
    description: 'DPIIT registration for eligible startups for tax exemptions (Section 80-IAC, 56(2)(viib)), patent fast-tracking, and tender relaxations.',
    typicalStages: ['Eligibility & Innovation Audit', 'Pitch Deck & Proof of Concept Prep', 'DPIIT National Portal Filing', 'Query Resolution', 'DPIIT Certificate Issuance']
  },
  {
    id: 'annual_compliance',
    name: 'Annual Corporate Compliance (RoC)',
    shortName: 'Annual Compliance',
    category: 'Tax & Compliance',
    basePrice: 24000,
    standardTurnaroundDays: 30,
    description: 'Annual RoC filing package: AOC-4 (Financial Statements), MGT-7 (Annual Return), DIR-3 KYC, and statutory register maintenance.',
    typicalStages: ['Statutory Audit Coordination', 'Drafting Board Resolutions & AGM', 'DIR-3 KYC Web Filing', 'AOC-4 & MGT-7 RoC Submission', 'Compliance Certificate Issuance']
  },
  {
    id: 'dsc_din',
    name: 'DSC & DIN Services',
    shortName: 'DSC & DIN Services',
    category: 'Director Compliance',
    basePrice: 1999,
    standardTurnaroundDays: 2,
    description: 'Class 3 Digital Signature Certificate issuance (Signing + Encryption) with e-Pass token and Director Identification Number (DIR-3).',
    typicalStages: ['Video Verification KYC', 'DSC Token Issuance', 'DIR-3 Application (if DIN required)', 'RoC Associate DSC Portal Register', 'Dispatch & Delivery']
  },
  {
    id: 'iec',
    name: 'Import Export Code (IEC)',
    shortName: 'Import Export Code',
    category: 'Licenses & Registrations',
    basePrice: 3500,
    standardTurnaroundDays: 3,
    description: 'DGFT 10-digit IEC registration for cross-border traders, linked with PAN and ICEGATE customs clearance setup.',
    typicalStages: ['DGFT Profile Creation', 'ANF-2A Online Application', 'Bank Certificate Verification', 'Online Fee Payment', 'IEC e-Certificate Download']
  }
];

export const SERVICE_CATEGORIES = [
  'Company Registration',
  'Tax & Compliance',
  'Licenses & Registrations',
  'Intellectual Property',
  'Quality & Audit',
  'Government Recognition',
  'Director Compliance'
];
