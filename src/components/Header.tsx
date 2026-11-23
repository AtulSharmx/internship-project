import React, { useState } from 'react';
import { 
  Calendar, 
  Users, 
  Briefcase, 
  Download, 
  ChevronDown, 
  Check, 
  Clock
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import { DatePreset } from '../types';

export const Header: React.FC = () => {
  const { 
    preset, 
    setPreset, 
    startDate, 
    endDate, 
    setDateRange, 
    selectedUserId, 
    setSelectedUserId, 
    selectedDepartment, 
    setSelectedDepartment,
    comparisonLabel,
    teamMembers,
    filteredLeads,
    filteredDeals,
    filteredQuotations
  } = useDashboard();

  const [isDateOpen, setIsDateOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [isDeptOpen, setIsDeptOpen] = useState(false);
  const [customStart, setCustomStart] = useState(startDate);
  const [customEnd, setCustomEnd] = useState(endDate);
  const [showCustomModal, setShowCustomModal] = useState(false);

  const getPresetLabel = () => {
    switch (preset) {
      case 'october_2026': return 'Oct 1 - Oct 31, 2026';
      case 'today': return 'Today (Oct 31, 2026)';
      case 'last_7_days': return 'Last 7 Days';
      case 'last_30_days': return 'Last 30 Days';
      case 'custom': return `${startDate} to ${endDate}`;
      default: return 'Select Date Range';
    }
  };

  const getSelectedUserLabel = () => {
    if (selectedUserId === 'all') return 'All Users';
    const found = teamMembers.find(m => m.id === selectedUserId);
    return found ? found.name : 'All Users';
  };

  const handleExportCSV = () => {
    const rows = [
      ['Report Type', 'Business Performance & Revenue Analytics'],
      ['Date Range', `${startDate} to ${endDate}`],
      ['User Filter', getSelectedUserLabel()],
      ['Department Filter', selectedDepartment === 'all' ? 'All Departments' : selectedDepartment],
      [],
      ['Metric', 'Current Period Value'],
      ['Total Leads', filteredLeads.length],
      ['Total Quotations', filteredQuotations.length],
      ['Total Deals', filteredDeals.length],
      ['Total Deal Revenue', filteredDeals.reduce((s, d) => s + d.totalAmount, 0)],
      ['Net Collected Revenue', filteredDeals.reduce((s, d) => s + d.collectedAmount, 0)],
      [],
      ['Recent Deals'],
      ['Deal ID', 'Client Name', 'Company', 'Service', 'Total Value (INR)', 'Collected (INR)', 'Status'],
      ...filteredDeals.slice(0, 50).map(d => [
        d.dealNumber,
        `"${d.leadName}"`,
        `"${d.companyName}"`,
        `"${d.serviceName}"`,
        d.totalAmount,
        d.collectedAmount,
        d.stage
      ])
    ];

    const csv = rows.map(r => r.join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `Compliance_Performance_Report_${startDate}_${endDate}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-xs">
                CH
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl font-bold tracking-tight text-slate-900">
                    Business Performance & Revenue Analytics
                  </h1>
                  <span className="inline-flex shrink-0 whitespace-nowrap items-center text-[11px] font-medium text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full">
                    Sample data
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Track your leads, conversions, quotations, deals, revenue and operations in real time.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDateOpen(!isDateOpen)}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md transition-colors shadow-2xs cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>{getPresetLabel()}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {isDateOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsDateOpen(false)} 
                  />
                  <div className="absolute right-0 mt-1.5 w-56 bg-white border border-slate-200 rounded-lg shadow-lg z-50 py-1 text-xs">
                    <div className="px-3 py-1.5 font-semibold text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-100">
                      Select Period
                    </div>
                    {[
                      { id: 'october_2026', label: 'Oct 1 - Oct 31, 2026 (Benchmark)' },
                      { id: 'today', label: 'Today (Oct 31, 2026)' },
                      { id: 'last_7_days', label: 'Last 7 Days (Oct 25 - 31)' },
                      { id: 'last_30_days', label: 'Last 30 Days' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setPreset(item.id as DatePreset | 'october_2026');
                          setIsDateOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center justify-between text-slate-700 cursor-pointer"
                      >
                        <span>{item.label}</span>
                        {preset === item.id && <Check className="w-3.5 h-3.5 text-blue-600" />}
                      </button>
                    ))}
                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button
                        onClick={() => {
                          setIsDateOpen(false);
                          setShowCustomModal(true);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-slate-50 text-blue-600 font-medium cursor-pointer"
                      >
                        Custom Date Range...
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => setIsUserOpen(!isUserOpen)}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md transition-colors shadow-2xs cursor-pointer"
              >
                <Users className="w-3.5 h-3.5 text-slate-500" />
                <span>{getSelectedUserLabel()}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {isUserOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsUserOpen(false)} />
                  <div className="absolute right-0 mt-1.5 w-52 bg-white border border-slate-200 rounded-lg shadow-lg z-50 py-1 text-xs max-h-72 overflow-y-auto">
                    <button
                      onClick={() => {
                        setSelectedUserId('all');
                        setIsUserOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center justify-between font-medium cursor-pointer"
                    >
                      <span>All Users</span>
                      {selectedUserId === 'all' && <Check className="w-3.5 h-3.5 text-blue-600" />}
                    </button>
                    <div className="px-3 py-1 font-semibold text-slate-400 uppercase text-[10px] tracking-wider border-t border-slate-100">
                      Team Members
                    </div>
                    {teamMembers.map(member => (
                      <button
                        key={member.id}
                        onClick={() => {
                          setSelectedUserId(member.id);
                          setIsUserOpen(false);
                        }}
                        className="w-full text-left px-3 py-1.5 hover:bg-slate-50 flex items-center justify-between text-slate-700 cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-[10px] flex items-center justify-center font-bold">
                            {member.avatar}
                          </span>
                          <span>{member.name}</span>
                        </div>
                        {selectedUserId === member.id && <Check className="w-3.5 h-3.5 text-blue-600" />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDeptOpen(!isDeptOpen)}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md transition-colors shadow-2xs cursor-pointer"
              >
                <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                <span>{selectedDepartment === 'all' ? 'All Departments' : selectedDepartment}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {isDeptOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsDeptOpen(false)} />
                  <div className="absolute right-0 mt-1.5 w-44 bg-white border border-slate-200 rounded-lg shadow-lg z-50 py-1 text-xs">
                    {['all', 'Sales', 'Operations', 'Finance'].map(dept => (
                      <button
                        key={dept}
                        onClick={() => {
                          setSelectedDepartment(dept);
                          setIsDeptOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center justify-between text-slate-700 cursor-pointer"
                      >
                        <span>{dept === 'all' ? 'All Departments' : dept}</span>
                        {selectedDepartment === dept && <Check className="w-3.5 h-3.5 text-blue-600" />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-md transition-colors shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
          </div>
        </div>

        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>Active Window: <strong className="font-semibold text-slate-700">{startDate}</strong> to <strong className="font-semibold text-slate-700">{endDate}</strong></span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500 italic">Calculating deltas {comparisonLabel}</span>
          </div>

          <div className="hidden sm:flex items-center gap-3">
            <span className="text-slate-400">Select any KPI, bar or row to inspect the records behind it</span>
          </div>
        </div>
      </div>

      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-5 border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-1">Select Custom Date Range</h3>
            <p className="text-xs text-slate-500 mb-4">Choose custom start and end dates to filter all dashboard analytics.</p>
            
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Start Date</label>
                <input
                  type="date"
                  value={customStart}
                  onChange={(e) => setCustomStart(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">End Date</label>
                <input
                  type="date"
                  value={customEnd}
                  onChange={(e) => setCustomEnd(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 mt-5">
              <button
                type="button"
                onClick={() => setShowCustomModal(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800 font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setDateRange(customStart, customEnd);
                  setShowCustomModal(false);
                }}
                className="px-4 py-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-xs cursor-pointer"
              >
                Apply Range
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
