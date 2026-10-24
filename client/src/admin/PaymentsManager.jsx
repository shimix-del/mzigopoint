import React, { useState, useEffect } from 'react';
import { CreditCard, DollarSign, Search, Send, Download, RefreshCw, Calendar, CheckCircle } from 'lucide-react';

export default function PaymentsManager({ token, user, refreshKey }) {
  const [payments, setPayments] = useState([]);
  const [reconciliation, setReconciliation] = useState(null);
  const [search, setSearch] = useState('');
  const [methodFilter, setMethodFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState(new Date().toISOString().split('T')[0]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('transactions'); // 'transactions' or 'reconciliation'

  useEffect(() => {
    fetchPayments();
    fetchReconciliation();
  }, [refreshKey, methodFilter, dateFilter]);

  const fetchPayments = async () => {
    setIsLoading(true);
    try {
      const q = new URLSearchParams();
      if (search) q.set('search', search);
      if (methodFilter !== 'all') q.set('method', methodFilter);

      const res = await fetch(`/api/payments?${q.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setPayments(data.payments || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchReconciliation = async () => {
    try {
      const res = await fetch(`/api/payments/reconciliation?date=${dateFilter}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setReconciliation(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPayments();
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-lg font-bold font-['Poppins'] text-[#0F2A4A]">
            Payments, M-Pesa & Daily Reconciliation
          </h2>
          <p className="text-xs text-gray-500">
            Real-time transaction auditing for Safaricom Daraja STK Push & Cash at the counter.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('transactions')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'transactions' ? 'bg-[#0F2A4A] text-white shadow-xs' : 'bg-gray-100 text-gray-700'
            }`}
          >
            All Transactions
          </button>
          <button
            onClick={() => setActiveTab('reconciliation')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'reconciliation' ? 'bg-[#0F2A4A] text-white shadow-xs' : 'bg-gray-100 text-gray-700'
            }`}
          >
            Daily Reconciliation
          </button>
        </div>
      </div>

      {activeTab === 'reconciliation' && reconciliation && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Reconciliation Date Bar */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-xs flex items-center justify-between">
            <span className="text-xs font-bold text-gray-700">Reconciliation Date:</span>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="text-xs px-3 py-1.5 border border-gray-300 rounded-xl font-mono font-bold"
            />
          </div>

          {/* KPI Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                Total Cash in Drawer
              </span>
              <div className="text-2xl sm:text-3xl font-black text-amber-700 mt-1 font-['Poppins']">
                KES {reconciliation.cashTotal.toLocaleString()}
              </div>
              <span className="text-[10px] text-gray-500 mt-1 block">Physical cash collected today</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block">
                Total M-Pesa (Daraja & Till)
              </span>
              <div className="text-2xl sm:text-3xl font-black text-emerald-700 mt-1 font-['Poppins']">
                KES {reconciliation.mpesaTotal.toLocaleString()}
              </div>
              <span className="text-[10px] text-gray-500 mt-1 block">Electronic Safaricom transactions</span>
            </div>

            <div className="bg-[#0F2A4A] text-white p-5 rounded-2xl shadow-xs">
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                Combined Total Collected
              </span>
              <div className="text-2xl sm:text-3xl font-black text-amber-400 mt-1 font-['Poppins']">
                KES {reconciliation.overallTotal.toLocaleString()}
              </div>
              <span className="text-[10px] text-gray-300 mt-1 block">Net revenue for {dateFilter}</span>
            </div>
          </div>
        </div>
      )}

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs space-y-4 p-5">
        <div className="flex flex-col sm:flex-row justify-between gap-3">
          <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search M-Pesa code, ref, customer..."
              className="w-full text-xs pl-9 pr-3.5 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-[#E75A2D]"
            />
          </form>

          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="text-xs px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-[#E75A2D]"
          >
            <option value="all">All Methods</option>
            <option value="mpesa_stk">M-Pesa STK Push</option>
            <option value="mpesa_counter">M-Pesa Counter</option>
            <option value="cash">Cash</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase text-[10px] tracking-wider">
                <th className="p-3">Date & Time</th>
                <th className="p-3">Booking Ref</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Method</th>
                <th className="p-3">Receipt / Code</th>
                <th className="p-3 text-right">Amount (KES)</th>
                <th className="p-3">Recorded By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="p-6 text-center text-gray-400">Loading transactions...</td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-6 text-center text-gray-400">No payment records found.</td>
                </tr>
              ) : (
                payments.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="p-3 font-mono text-[11px] text-gray-500">{p.created_at}</td>
                    <td className="p-3 font-bold font-mono text-[#0F2A4A]">{p.booking_ref}</td>
                    <td className="p-3">
                      <span className="font-bold block">{p.customer_name}</span>
                      <span className="text-[10px] text-gray-400">{p.customer_phone}</span>
                    </td>
                    <td className="p-3 uppercase text-[10px] font-bold">
                      <span className={`px-2 py-0.5 rounded ${
                        p.payment_method.includes('mpesa') ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {p.payment_method.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-3 font-mono font-bold text-gray-900">
                      {p.mpesa_code || 'CASH-RCPT'}
                    </td>
                    <td className="p-3 text-right font-black text-emerald-700">
                      KES {p.amount?.toLocaleString()}
                    </td>
                    <td className="p-3 text-gray-600">{p.recorded_by}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
