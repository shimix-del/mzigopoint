import React, { useState, useEffect } from 'react';
import {
  Luggage,
  Clock,
  AlertTriangle,
  DollarSign,
  TrendingUp,
  CreditCard,
  PlusCircle,
  Search,
  CheckCircle,
  FileText,
  ShieldCheck,
  Percent,
  Calendar
} from 'lucide-react';

export default function DashboardOverview({ token, user, onNavigate, onOpenWalkIn, refreshKey }) {
  const [summary, setSummary] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quickSearchRef, setQuickSearchRef] = useState('');

  const isOwner = user && user.role === 'owner';

  useEffect(() => {
    fetchSummary();
    fetchAnalytics();
  }, [refreshKey]);

  const fetchSummary = async () => {
    try {
      const res = await fetch('/api/reports/summary', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setSummary(data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/reports/analytics', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setAnalytics(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !summary) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center text-xs text-gray-500 border border-gray-200">
        Loading real-time Mombasa dashboard metrics...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Ref Search */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-xl font-bold font-['Poppins'] text-[#0F2A4A]">
            Karibu, {user.name} 👋
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Moi Avenue Facility Status: Active & CCTV Protected • All systems operational.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={onOpenWalkIn}
            className="bg-[#E75A2D] hover:bg-[#d0451b] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Walk-In Intake</span>
          </button>
        </div>
      </div>

      {/* 6 KPI SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* 1. Active Bookings */}
        <div
          onClick={() => onNavigate('bookings')}
          className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs hover:border-[#0F2A4A] cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Active In Storage
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <Luggage className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#0F2A4A] font-['Poppins']">
            {summary.activeBookings}
          </div>
          <span className="text-[11px] text-gray-500 mt-1 block">
            Items currently secured in racks
          </span>
        </div>

        {/* 2. Expected Pickups Today */}
        <div
          onClick={() => onNavigate('bookings')}
          className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs hover:border-amber-400 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
              Due For Pick-up Today
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-amber-800 font-['Poppins']">
            {summary.pickupsToday}
          </div>
          <span className="text-[11px] text-gray-500 mt-1 block">
            Customers expected at counter today
          </span>
        </div>

        {/* 3. Overdue Bookings */}
        <div
          onClick={() => onNavigate('alerts')}
          className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs hover:border-rose-400 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
              Overdue Bookings
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-rose-700 font-['Poppins']">
            {summary.overdueBookings}
          </div>
          <span className="text-[11px] text-gray-500 mt-1 block">
            Late fee applied @ KES 100/day
          </span>
        </div>

        {/* 4. Revenue Card (Owner Only / Staff Notice) */}
        {isOwner && summary.revenue ? (
          <div
            onClick={() => onNavigate('reports')}
            className="bg-gradient-to-br from-[#0F2A4A] to-[#173F6D] text-white rounded-2xl p-5 shadow-xs cursor-pointer hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                Today's Revenue
              </span>
              <div className="w-8 h-8 rounded-lg bg-white/10 text-white flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black font-['Poppins'] text-amber-400">
              KES {summary.revenue.today.toLocaleString()}
            </div>
            <div className="flex justify-between text-[11px] text-gray-300 pt-2 border-t border-white/15 mt-2">
              <span>This Week: KES {summary.revenue.thisWeek.toLocaleString()}</span>
              <span>Month: KES {summary.revenue.thisMonth.toLocaleString()}</span>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200 flex flex-col justify-center text-xs text-gray-500">
            <span className="font-bold text-gray-700 mb-1">Financial Metrics (Owner-Only)</span>
            <p className="text-[11px]">Daily and monthly revenue figures are restricted to the business owner account.</p>
          </div>
        )}

        {/* 5. Pending Payments */}
        <div
          onClick={() => onNavigate('payments')}
          className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs hover:border-[#0F2A4A] cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Pending / Balances Due
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#0F2A4A] font-['Poppins']">
            KES {summary.pendingPayments.toLocaleString()}
          </div>
          <span className="text-[11px] text-gray-500 mt-1 block">
            Total collectible upon pickup
          </span>
        </div>

        {/* 6. Capacity Utilization */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Storage Capacity
            </span>
            <span className="text-xs font-extrabold text-[#0F2A4A]">
              {summary.capacity.percentage}% Full
            </span>
          </div>
          <div className="text-2xl font-extrabold text-[#0F2A4A] font-['Poppins'] mb-2">
            {summary.capacity.used} / {summary.capacity.total} units
          </div>
          <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                summary.capacity.percentage > 85 ? 'bg-rose-500' : 'bg-[#E75A2D]'
              }`}
              style={{ width: `${summary.capacity.percentage}%` }}
            ></div>
          </div>
          <span className="text-[10px] text-gray-500 mt-1.5 block">
            {summary.capacity.available} storage spaces currently available
          </span>
        </div>
      </div>

      {/* CHARTS & ANALYTICS VISUALIZATIONS */}
      {analytics && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Storage Reasons Breakdown */}
          <div className="lg:col-span-6 bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-[#0F2A4A] font-['Poppins'] flex items-center justify-between">
              <span>Why People Store with Mzingo Point</span>
              <span className="text-[10px] font-normal text-gray-400">Use Cases</span>
            </h3>

            <div className="space-y-3 pt-2">
              {analytics.reasons.map((r, i) => {
                const total = analytics.reasons.reduce((acc, curr) => acc + curr.count, 0) || 1;
                const pct = Math.round((r.count / total) * 100);
                return (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-gray-700">{r.label}</span>
                      <span className="text-gray-500 font-mono">{r.count} bookings ({pct}%)</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-[#0F2A4A] h-full rounded-full"
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Popular Luggage Sizes */}
          <div className="lg:col-span-6 bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-[#0F2A4A] font-['Poppins'] flex items-center justify-between">
              <span>Most Popular Item Sizes</span>
              <span className="text-[10px] font-normal text-gray-400">Inventory Ratio</span>
            </h3>

            <div className="grid grid-cols-2 gap-3 pt-2">
              {analytics.sizes.map((s, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-gray-50 border border-gray-200">
                  <span className="text-[10px] font-bold uppercase text-gray-400 block">{s.label}</span>
                  <div className="text-xl font-bold text-[#0F2A4A] mt-1 font-['Poppins']">
                    {s.count} items
                  </div>
                  <span className="text-[10px] text-[#E75A2D] font-semibold mt-0.5 block">
                    {s.label === 'medium' ? 'Standard Luggage' : s.label === 'large' ? 'Trunks & Big Bags' : s.label === 'xlarge' ? 'Bulky Furniture' : 'Small Daypacks'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 14-Day Revenue Trend (Owner Only) */}
          {isOwner && analytics.revenueTrend && analytics.revenueTrend.length > 0 && (
            <div className="lg:col-span-12 bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-[#0F2A4A] font-['Poppins']">
                    Revenue Trajectory (Last 14 Days)
                  </h3>
                  <p className="text-[11px] text-gray-500">Daily M-Pesa & Cash collections in KES</p>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                  Owner Financial Overview
                </span>
              </div>

              {/* Bar visualization */}
              <div className="pt-4 flex items-end gap-2 h-44 overflow-x-auto pb-2">
                {analytics.revenueTrend.map((d, i) => {
                  const maxAmt = Math.max(...analytics.revenueTrend.map(x => x.amount), 1000);
                  const heightPct = Math.max(12, Math.round((d.amount / maxAmt) * 100));

                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative min-w-[36px]">
                      {/* Tooltip */}
                      <div className="absolute -top-7 hidden group-hover:block bg-gray-900 text-white text-[10px] py-0.5 px-2 rounded font-mono z-10 whitespace-nowrap">
                        KES {d.amount.toLocaleString()}
                      </div>
                      <div
                        className="w-full bg-gradient-to-t from-[#0F2A4A] to-[#E75A2D] rounded-t-md transition-all group-hover:brightness-110"
                        style={{ height: `${heightPct}%` }}
                      ></div>
                      <span className="text-[9px] text-gray-400 font-mono truncate w-full text-center">
                        {d.day.slice(5)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
