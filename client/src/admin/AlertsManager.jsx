import React, { useState, useEffect } from 'react';
import { AlertTriangle, Clock, MessageSquare, Send, CheckCircle, ShieldAlert, DollarSign } from 'lucide-react';

export default function AlertsManager({ token, user, refreshKey, onDataChanged }) {
  const [alerts, setAlerts] = useState({
    overdue: [],
    unclaimed30Days: [],
    pendingBalances: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
  }, [refreshKey]);

  const fetchAlerts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/bookings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      const all = data.bookings || [];

      const overdue = all.filter(b => b.status === 'overdue');
      const unclaimed = all.filter(b => (b.days_stored_calculated || 0) >= 30 && b.status !== 'collected');
      const pending = all.filter(b => b.balance_amount > 0 && b.status !== 'cancelled');

      setAlerts({ overdue, unclaimed30Days: unclaimed, pendingBalances: pending });
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendReminder = async (bookingId, type) => {
    try {
      const res = await fetch('/api/notifications/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ booking_id: bookingId, type })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      window.open(data.whatsAppLink, '_blank');
      if (onDataChanged) onDataChanged();
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs">
        <h2 className="text-lg font-bold font-['Poppins'] text-[#0F2A4A]">
          Alerts, Overdue Storage & Statutory Notices
        </h2>
        <p className="text-xs text-gray-500">
          Automated monitoring for overdue luggage, unpaid balances, and unclaimed goods exceeding the 30-day grace period.
        </p>
      </div>

      {/* 1. Critical Overdue Items */}
      <div className="bg-white rounded-2xl border border-rose-200 overflow-hidden shadow-xs">
        <div className="bg-rose-50 p-4 border-b border-rose-200 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            <h3 className="font-bold text-sm text-rose-900">
              Overdue Belongings ({alerts.overdue.length})
            </h3>
          </div>
          <span className="text-[10px] font-bold uppercase text-rose-700 bg-rose-200 px-2 py-0.5 rounded">
            Late Fee Active (KES 100/day)
          </span>
        </div>

        <div className="divide-y divide-gray-100 text-xs">
          {alerts.overdue.length === 0 ? (
            <p className="p-6 text-center text-gray-400">No items currently overdue.</p>
          ) : (
            alerts.overdue.map((b) => (
              <div key={b.id} className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3 hover:bg-rose-50/20">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold font-mono text-base text-[#0F2A4A]">{b.booking_ref}</span>
                    <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.2 rounded font-mono">
                      Rack: {b.shelf_location || 'Receiving'}
                    </span>
                  </div>
                  <p className="font-semibold text-gray-900 mt-0.5">
                    {b.customer_name} • {b.customer_phone}
                  </p>
                  <p className="text-gray-500 text-[11px]">
                    Expected pickup was <strong>{b.expected_pickup_date}</strong>. Late Fee Accrued: <strong className="text-rose-600">+ KES {b.late_fee || 0}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-gray-400 text-[10px] block">Balance Owed:</span>
                    <strong className="text-base text-rose-700">KES {b.balance_amount?.toLocaleString()}</strong>
                  </div>

                  <button
                    onClick={() => handleSendReminder(b.id, 'overdue_alert')}
                    className="bg-[#25D366] hover:bg-[#20ba59] text-white px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 shadow-xs"
                    title="Send WhatsApp Overdue Alert"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp Notice</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 2. Unclaimed Goods > 30 Days (Kenya Law Cap 38) */}
      <div className="bg-white rounded-2xl border border-amber-300 overflow-hidden shadow-xs">
        <div className="bg-amber-50 p-4 border-b border-amber-200 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-700" />
            <h3 className="font-bold text-sm text-amber-900">
              Unclaimed Goods Stored &gt; 30 Days ({alerts.unclaimed30Days.length})
            </h3>
          </div>
          <span className="text-[10px] font-bold uppercase text-amber-800 bg-amber-200 px-2 py-0.5 rounded">
            Statutory Disposal Notice
          </span>
        </div>

        <div className="divide-y divide-gray-100 text-xs">
          {alerts.unclaimed30Days.length === 0 ? (
            <p className="p-6 text-center text-gray-400">No goods currently exceed the 30-day grace period.</p>
          ) : (
            alerts.unclaimed30Days.map((b) => (
              <div key={b.id} className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3 bg-amber-50/30">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold font-mono text-base text-[#0F2A4A]">{b.booking_ref}</span>
                    <span className="text-rose-700 bg-rose-100 px-2 py-0.2 rounded font-bold text-[10px]">
                      {b.days_stored_calculated} DAYS IN STORAGE
                    </span>
                  </div>
                  <p className="font-semibold text-gray-900 mt-0.5">
                    {b.customer_name} ({b.customer_phone}) • Rack: {b.shelf_location || 'Bay'}
                  </p>
                  <p className="text-amber-800 text-[11px] mt-0.5">
                    Eligible for statutory 14-day disposal letter under Kenya Disposal of Uncollected Goods Act (Cap. 38).
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSendReminder(b.id, 'overdue_alert')}
                    className="bg-[#0F2A4A] hover:bg-[#1a406c] text-white px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Disposal Notice</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
