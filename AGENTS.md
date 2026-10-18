# Business Performance & Revenue Analytics Dashboard

Production-quality frontend-only administrative analytics dashboard for a business-compliance & company-registration services company (incorporations, licenses, GST, trademark, ROC filings).

## 1. Tech Stack
- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS + Custom Design Tokens (Enterprise Slate/Indigo theme)
- **Icons**: Lucide React
- **Charts**: Recharts (Customized for high-density, accessible tooltips, zero rainbow clutter)
- **State**: Reactive pure client-side relational store with filtering and drill-down engine

## 2. Industry Context & Services (Indian Compliance Ecosystem)
All amounts in Indian Rupees (INR - ₹).
1. **Private Limited Company Registration** (₹7,500 – ₹18,000)
2. **LLP Registration** (₹5,000 – ₹12,000)
3. **GST Registration & Filing** (₹1,500 – ₹6,000)
4. **Trademark Registration** (₹4,500 – ₹9,500)
5. **FSSAI License** (₹3,000 – ₹8,000)
6. **ISO Certification** (₹12,000 – ₹35,000)
7. **Startup India Registration** (₹4,000 – ₹10,000)
8. **Annual Compliance (RoC)** (₹15,000 – ₹45,000)
9. **DSC & DIN Services** (₹1,500 – ₹4,000)
10. **Import Export Code (IEC)** (₹2,500 – ₹5,000)

## 3. Data Relationships
- **Lead (1) ── (1..N) ── Quotation**: A prospective client inquiries and can receive multiple quotes for different or bundled services.
- **Lead (1) ── (0..N) ── Deal**: An accepted quotation turns into a signed deal.
- **Deal (1) ── (1..N) ── Order**: Fulfillment tasks assigned to the operations team with stages (Pending, In Progress, Completed, On Hold).
- **Deal (1) ── (1..N) ── Payment**: Transactions recorded against deals (Collected vs. Outstanding).

## 4. Design Guidelines
- **No generic AI admin template**: No cheesy purple/pink gradients, no identical shadow-card grids, no meaningless rainbow color palettes.
- **Enterprise Grade Aesthetics**: Slate-900 typography, slate-50 backgrounds, crisp slate-200 borders, micro-badges, and purposeful status color coding (Emerald for Success/Collected/Won, Amber for Pending/Under Review, Rose for Rejected/Overdue, Blue for Primary active entities).
- **Number Formatting**: All monetary values formatted in Indian numbering system (`₹1,82,627`) with `font-mono tabular-nums`.
- **Live Filtering**: Global date ranges (Today, Last 7 Days, Last 30 Days, Custom) recalculate all KPI deltas vs immediately preceding equivalent period.
- **Drill-Down Everywhere**: Clicking any KPI card, funnel stage, chart segment, service table row, or team member opens underlying real records in an interactive slide-over drawer with full relational inspection.
