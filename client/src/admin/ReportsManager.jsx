import React, { useState, useEffect } from 'react';
import { FileBarChart2, Download, Printer, TrendingUp, Calendar, CheckCircle2 } from 'lucide-react';

export default function ReportsManager({ token, user, refreshKey }) {
  const [reportPeriod, setReportPeriod] = useState('monthly'); // 'daily', 'weekly', 'monthly'
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const isOwner = user && user.role === 'owner';

  useEffect(() => {
    fetchReportData();
  }, [reportPeriod, refreshKey]);

  const fetchReportData = async () => {
    setIsLoading(true);
    try {
      const resSummary = await fetch('/api/reports/summary', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const summaryJson = await resSummary.json();

      const resAnalytics = await fetch('/api/reports/analytics', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const analyticsJson = await resAnalytics.json();

      setData({ summary: summaryJson, analytics: analyticsJson });
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadReport = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        'Mzingo Point Storage - Operational & Financial Audit Report',
        `Generated on: ${new Date().toISOString()}`,
        `Period: ${reportPeriod.toUpperCase()}`,
        '',
        'Summary Metric,Value',
        `Active Bookings in Storage,${data.summary.activeBookings}`,
        `Overdue Bookings,${data.summary.overdueBookings}`,
        `Total Pending Payments (KES),${data.summary.pendingPayments}`,
        `Capacity Used,${data.summary.capacity.used} of ${data.summary.capacity.total} units (${data.summary.capacity.percentage}%)`,
        ...(isOwner && data.summary.revenue
          ? [
              `Today Revenue (KES),${data.summary.revenue.today}`,
              `This Week Revenue (KES),${data.summary.revenue.thisWeek}`,
              `This Month Revenue (KES),${data.summary.revenue.thisMonth}`,
              `All-Time Revenue (KES),${data.summary.revenue.allTime}`
            ]
          : [])
      ].join('\n');

    const encoded = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encoded);
    link.setAttribute('download', `mzingo_report_${reportPeriod}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading || !data) {
    return (
      <div className="bg-white rounded-2xl p-10 text-center text-xs text-gray-500">
        Generating reports...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-lg font-bold font-['Poppins'] text-[#0F2A4A]">
            Audit & Performance Reports
          </h2>
          <p className="text-xs text-gray-500">
            Comprehensive breakdown of turnover, storage duration, collections, and capacity usage.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-gray-100 p-1 rounded-xl text-xs font-bold">
            {['daily', 'weekly', 'monthly'].map((p) => (
              <button
                key={p}
                onClick={() => setReportPeriod(p)}
                className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                  reportPeriod === p ? 'bg-[#0F2A4A] text-white shadow-xs' : 'text-gray-600'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <button
            onClick={handleDownloadReport}
            className="bg-[#E75A2D] hover:bg-[#d0451b] text-white text-xs px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download CSV</span>
          </button>
        </div>
      </div>

      {/* Report Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
            Occupancy Rate
          </span>
          <div className="text-2xl font-black text-[#0F2A4A] mt-1 font-['Poppins']">
            {data.summary.capacity.percentage}%
          </div>
          <span className="text-[11px] text-gray-500 mt-0.5 block">
            {data.summary.capacity.used} items on racks
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
            Overdue Rate
          </span>
          <div className="text-2xl font-black text-rose-700 mt-1 font-['Poppins']">
            {data.summary.overdueBookings} items
          </div>
          <span className="text-[11px] text-rose-600 mt-0.5 block">
            Subject to late charges
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
            Unpaid Receivables
          </span>
          <div className="text-2xl font-black text-amber-700 mt-1 font-['Poppins']">
            KES {data.summary.pendingPayments.toLocaleString()}
          </div>
          <span className="text-[11px] text-gray-500 mt-0.5 block">
            Due upon baggage collection
          </span>
        </div>

        {isOwner && data.summary.revenue && (
          <div className="bg-[#0F2A4A] text-white p-5 rounded-2xl shadow-xs">
            <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider block">
              Turnover ({reportPeriod})
            </span>
            <div className="text-2xl font-black text-amber-400 mt-1 font-['Poppins']">
              KES {reportPeriod === 'daily' ? data.summary.revenue.today.toLocaleString() : reportPeriod === 'weekly' ? data.summary.revenue.thisWeek.toLocaleString() : data.summary.revenue.thisMonth.toLocaleString()}
            </div>
            <span className="text-[11px] text-gray-300 mt-0.5 block">
              All-time: KES {data.summary.revenue.allTime.toLocaleString()}
            </span>
          </div>
        )}
      </div>

      {/* Breakdown Tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-3">
          <h3 className="font-bold text-sm text-[#0F2A4A] font-['Poppins']">
            Payment Status Breakdown
          </h3>
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left text-gray-400 border-b pb-1 text-[10px] uppercase">
                <th className="py-1">Status</th>
                <th className="py-1 text-center">Count</th>
                <th className="py-1 text-right">Balance Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.analytics.paymentBreakdown.map((p, i) => (
                <tr key={i}>
                  <td className="py-2 font-bold capitalize text-gray-800">{p.label}</td>
                  <td className="py-2 text-center text-gray-600">{p.count}</td>
                  <td className="py-2 text-right font-mono font-bold text-[#0F2A4A]">
                    KES {p.balance_total?.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-3">
          <h3 className="font-bold text-sm text-[#0F2A4A] font-['Poppins']">
            Booking Intake Statuses
          </h3>
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left text-gray-400 border-b pb-1 text-[10px] uppercase">
                <th className="py-1">Stage</th>
                <th className="py-1 text-right">Active Count</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.analytics.bookingStatuses.map((s, i) => (
                <tr key={i}>
                  <td className="py-2 font-bold uppercase text-gray-800">{s.label.replace('_', ' ')}</td>
                  <td className="py-2 text-right font-mono font-bold text-[#0F2A4A]">{s.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
