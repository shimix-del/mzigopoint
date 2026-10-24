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
  Calendar,
  ArrowRight
} from 'lucide-react';

export default function DashboardOverview({ token, user, isDarkMode, onNavigate, onOpenWalkIn, refreshKey }) {
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
      <div className={`rounded-3xl p-12 text-center text-xs border ${
        isDarkMode ? 'bg-[#0B2545] border-white/10 text-gray-400' : 'bg-white border-gray-200 text-gray-500'
      }`}>
        <div className="w-8 h-8 border-2 border-[#FF6B4A] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <span>Loading real-time Mombasa dashboard metrics...</span>
      </div>
    );
  }

  const cardBg = isDarkMode ? 'bg-[#0B2545] border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900';
  const subText = isDarkMode ? 'text-gray-400' : 'text-gray-500';

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Ref Search */}
      <div className={`rounded-3xl border p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-colors ${cardBg}`}>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black font-['Syne']">
              Karibu, {user.name} 👋
            </h2>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>
          <p className={`text-xs mt-1 ${subText}`}>
            Moi Avenue Facility Status: Active & CCTV Protected • All storage racks operational.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            type="button"
            onClick={onOpenWalkIn}
            className="bg-[#FF6B4A] hover:bg-[#e85535] text-white px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider shadow-md flex items-center gap-2 shrink-0 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Walk-In Intake</span>
          </button>
        </div>
      </div>

      {/* 6 KPI SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* 1. Active Bookings */}
        <div
          onClick={() => onNavigate('bookings')}
          className={`rounded-3xl p-6 border shadow-sm hover:border-[#13B5B1] cursor-pointer transition-all ${cardBg}`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#13B5B1]">
              Active In Storage
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#13B5B1]/10 text-[#13B5B1] flex items-center justify-center">
              <Luggage className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="text-3xl font-black font-['Syne']">
            {summary.activeBookings}
          </div>
          <span className={`text-[11px] mt-1.5 block ${subText}`}>
            Luggage & boxes safely locked in bay
          </span>
        </div>

        {/* 2. Expected Pickups Today */}
        <div
          onClick={() => onNavigate('bookings')}
          className={`rounded-3xl p-6 border shadow-sm hover:border-amber-400 cursor-pointer transition-all ${cardBg}`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-500">
              Due For Pick-up Today
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Clock className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="text-3xl font-black font-['Syne'] text-amber-500">
            {summary.pickupsToday}
          </div>
          <span className={`text-[11px] mt-1.5 block ${subText}`}>
            Customers expected at counter today
          </span>
        </div>

        {/* 3. Overdue Bookings */}
        <div
          onClick={() => onNavigate('alerts')}
          className={`rounded-3xl p-6 border shadow-sm hover:border-rose-400 cursor-pointer transition-all ${cardBg}`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-rose-500">
              Overdue Belongings
            </span>
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
              <AlertTriangle className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="text-3xl font-black font-['Syne'] text-rose-500">
            {summary.overdueBookings}
          </div>
          <span className={`text-[11px] mt-1.5 block ${subText}`}>
            Late surcharge accumulating @ KES 100/day
          </span>
        </div>

        {/* 4. Revenue Card (Owner Only / Staff Notice) */}
        {isOwner && summary.revenue ? (
          <div
            onClick={() => onNavigate('reports')}
            className="bg-gradient-to-br from-[#0B2545] to-[#13325c] text-white rounded-3xl p-6 shadow-md border border-white/10 cursor-pointer hover:shadow-xl transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-300">
                Today's Gross Revenue
              </span>
              <div className="w-9 h-9 rounded-xl bg-white/10 text-emerald-400 flex items-center justify-center">
                <TrendingUp className="w-4.5 h-4.5" />
              </div>
            </div>
            <div className="text-3xl font-black font-['Syne'] text-amber-400">
              KES {summary.revenue.today.toLocaleString()}
            </div>
            <div className="flex justify-between text-[11px] text-gray-300 pt-3 border-t border-white/15 mt-3 font-mono">
              <span>Week: KES {summary.revenue.thisWeek.toLocaleString()}</span>
              <span>Month: KES {summary.revenue.thisMonth.toLocaleString()}</span>
            </div>
          </div>
        ) : (
          <div className={`rounded-3xl p-6 border flex flex-col justify-center text-xs ${cardBg}`}>
            <span className="font-bold font-['Syne'] text-[#FF6B4A] mb-1">Financial Metrics (Owner-Only)</span>
            <p className={`text-[11px] leading-relaxed ${subText}`}>
              Daily and weekly revenue figures are strictly restricted to the registered owner account.
            </p>
          </div>
        )}

        {/* 5. Pending Payments */}
        <div
          onClick={() => onNavigate('payments')}
          className={`rounded-3xl p-6 border shadow-sm hover:border-[#13B5B1] cursor-pointer transition-all ${cardBg}`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-500">
              Pending / Due Balances
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <CreditCard className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="text-3xl font-black font-['Syne']">
            KES {summary.pendingPayments.toLocaleString()}
          </div>
          <span className={`text-[11px] mt-1.5 block ${subText}`}>
            Receivable upon item release
          </span>
        </div>

        {/* 6. Capacity Utilization */}
        <div className={`rounded-3xl p-6 border shadow-sm ${cardBg}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-gray-400">
              Storage Capacity
            </span>
            <span className="text-xs font-mono font-bold text-[#FF6B4A]">
              {summary.capacity.percentage}% Full
            </span>
          </div>
          <div className="text-2xl font-black font-['Syne'] mb-2">
            {summary.capacity.used} / {summary.capacity.total} units
          </div>
          <div className="w-full bg-gray-200 dark:bg-white/10 h-2.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                summary.capacity.percentage > 85 ? 'bg-rose-500' : 'bg-gradient-to-r from-[#FF6B4A] to-[#13B5B1]'
              }`}
              style={{ width: `${summary.capacity.percentage}%` }}
            ></div>
          </div>
          <span className={`text-[10px] mt-2 block font-mono ${subText}`}>
            {summary.capacity.available} storage rack bays available
          </span>
        </div>
      </div>

      {/* RECENT ANALYTICS BREAKDOWN */}
      {analytics && (
        <div className={`rounded-3xl border p-6 sm:p-8 shadow-sm space-y-6 ${cardBg}`}>
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/10 pb-4">
            <div>
              <h3 className="text-lg font-black font-['Syne']">
                Storage Purpose & Luggage Mix
              </h3>
              <p className={`text-xs mt-0.5 ${subText}`}>
                Distribution across job seekers, travellers, moving households, and students in Mombasa.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Travelling / SGR', pct: '38%', color: 'bg-[#FF6B4A]' },
              { label: 'House Hunting', pct: '28%', color: 'bg-[#13B5B1]' },
              { label: 'Job Interviews', pct: '20%', color: 'bg-amber-400' },
              { label: 'Students / Moving', pct: '14%', color: 'bg-[#0B2545]' }
            ].map((stat, i) => (
              <div key={i} className="p-4 rounded-2xl bg-gray-50/50 dark:bg-white/5 border border-gray-100 dark:border-white/10">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold">{stat.label}</span>
                  <span className="text-xs font-mono font-bold text-[#FF6B4A]">{stat.pct}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div className={`h-full ${stat.color}`} style={{ width: stat.pct }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
