import React from 'react';
import { DashboardProvider } from './context/DashboardContext';
import { Header } from './components/Header';
import { KpiGrid } from './components/KpiGrid';
import { LeadAnalyticsSection } from './components/LeadAnalyticsSection';
import { QuotationAnalyticsSection } from './components/QuotationAnalyticsSection';
import { DealsRevenueSection } from './components/DealsRevenueSection';
import { OperationsTeamSection } from './components/OperationsTeamSection';
import { DrillDownDrawer } from './components/DrillDownDrawer';

export const AppContent: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-blue-100 selection:text-blue-900">
      {/* Sticky Global Navigation & Filter Bar */}
      <Header />

      {/* Main Dashboard Canvas */}
      <main className="flex-1 max-w-[1720px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-5">
        {/* Row 1: Key Performance Indicators */}
        <KpiGrid />

        {/* Row 2: Lead Funnel, Revenue Targets & Trends */}
        <LeadAnalyticsSection />

        {/* Row 3: Quotation Analytics & Service Performance */}
        <QuotationAnalyticsSection />

        {/* Row 4: Deals Pipeline, Priority Matrix & Cash Flow */}
        <DealsRevenueSection />

        {/* Row 5: Operations, Team Productivity & Live CRM Feed */}
        <OperationsTeamSection />
      </main>

      {/* Relational Inspection Drawer */}
      <DrillDownDrawer />

      {/* Enterprise Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 px-6 text-xs text-slate-500 mt-auto">
        <div className="max-w-[1720px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-slate-700">Corporate Compliance Hub</span>
            <span className="text-slate-300">•</span>
            <span>Business Performance & Revenue Analytics Dashboard</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>All values in Indian Rupees (₹ INR)</span>
            <span>•</span>
            <span>Frontend-Only In-Memory Relational Engine</span>
            <span>•</span>
            <span className="text-slate-600 font-medium">Ready for Vercel Deployment</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <DashboardProvider>
      <AppContent />
    </DashboardProvider>
  );
}
