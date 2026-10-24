import React, { useState } from 'react';
import {
  Search,
  CheckCircle,
  Clock,
  Luggage,
  Calendar,
  AlertTriangle,
  CreditCard,
  Printer,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
  X
} from 'lucide-react';
import { translations } from '../translations';
import ReceiptPrint from '../components/ReceiptPrint';

export default function TrackBooking({ lang, setView }) {
  const t = translations[lang];

  const [refInput, setRefInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [booking, setBooking] = useState(null);
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  // Extension Modal state
  const [extendModalOpen, setExtendModalOpen] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [isExtending, setIsExtending] = useState(false);
  const [extendSuccess, setExtendSuccess] = useState('');
  const [showReceipt, setShowReceipt] = useState(false);

  const handleTrack = async (e) => {
    if (e) e.preventDefault();
    if (!refInput.trim() || !phoneInput.trim()) {
      setErrorMsg('Please enter both your Booking Reference and Phone number.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/bookings/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reference: refInput.trim(),
          phone: phoneInput.trim()
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Booking not found.');
      }

      setBooking(data.booking);
      setQrCodeUrl(data.qrCodeDataUrl || '');
    } catch (err) {
      setErrorMsg(err.message || 'Error tracking booking. Please check your reference and phone number.');
      setBooking(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExtendSubmit = async (e) => {
    e.preventDefault();
    if (!newDate) return;

    setIsExtending(true);
    setErrorMsg('');

    try {
      const res = await fetch(`/api/bookings/${booking.id}/extend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          new_pickup_date: newDate,
          payment_method: 'mpesa_stk',
          paid_now: 0
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to extend storage.');

      setExtendSuccess(`Storage successfully extended to ${newDate}! Additional balance updated.`);
      setBooking(prev => ({
        ...prev,
        expected_pickup_date: newDate,
        total_amount: data.newTotal,
        balance_amount: data.updatedBalance,
        status: data.newStatus
      }));

      setTimeout(() => {
        setExtendModalOpen(false);
        setExtendSuccess('');
      }, 2500);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsExtending(false);
    }
  };

  // Status mapping
  const statusSteps = [
    { key: 'booked', label: '1. Booked Online' },
    { key: 'in_storage', label: '2. In Storage (Rack Assigned)' },
    { key: 'ready', label: '3. Ready for Pick-up' },
    { key: 'collected', label: '4. Collected & Signed' }
  ];

  const getStatusIndex = (st) => {
    if (st === 'booked') return 0;
    if (st === 'in_storage') return 1;
    if (st === 'ready') return 2;
    if (st === 'collected') return 3;
    if (st === 'overdue') return 1; // It was in storage
    return 0;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Title */}
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-[#E75A2D] bg-[#E75A2D]/10 px-3 py-1 rounded-full">
          Live Item Verification
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-['Poppins'] text-[#0F2A4A]">
          {t.tracking.title}
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 max-w-xl mx-auto">
          {t.tracking.subtitle}
        </p>
      </div>

      {/* SEARCH CARD */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-md">
        <form onSubmit={handleTrack} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                {t.tracking.refLabel} *
              </label>
              <input
                type="text"
                value={refInput}
                onChange={(e) => setRefInput(e.target.value.toUpperCase())}
                placeholder="e.g. MZP-2026-0001"
                className="w-full text-sm font-semibold tracking-wider px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-[#E75A2D]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                {t.tracking.phoneLabel} *
              </label>
              <input
                type="text"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                placeholder="e.g. 0719 234 567"
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-[#E75A2D]"
                required
              />
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <span className="text-[11px] text-gray-400">
              Demo sample: <button type="button" onClick={() => { setRefInput('MZP-2026-0001'); setPhoneInput('0719234567'); }} className="text-[#E75A2D] underline font-semibold">Fill MZP-2026-0001</button>
            </span>

            <button
              type="submit"
              disabled={isLoading}
              className="bg-[#E75A2D] hover:bg-[#d0451b] text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow flex items-center gap-2"
            >
              {isLoading ? (
                <span>Searching...</span>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>{t.tracking.btnTrack}</span>
                </>
              )}
            </button>
          </div>
        </form>

        {errorMsg && (
          <div className="mt-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            {errorMsg}
          </div>
        )}
      </div>

      {/* TRACKING RESULTS */}
      {booking && (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header Strip */}
          <div className="bg-[#0F2A4A] text-white p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="text-xl sm:text-2xl font-black font-['Poppins'] tracking-wider">
                  {booking.booking_ref}
                </span>
                <span className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full ${
                  booking.status === 'overdue'
                    ? 'bg-rose-500 text-white animate-pulse'
                    : booking.status === 'collected'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-amber-400 text-[#0F2A4A]'
                }`}>
                  {booking.status.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs text-amber-200 mt-1">
                Owner: <strong>{booking.customer_name}</strong> • Phone: {booking.customer_phone}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowReceipt(true)}
                className="bg-white/10 hover:bg-white/20 text-white text-xs px-3.5 py-2 rounded-xl font-semibold flex items-center gap-1.5 transition-colors border border-white/15"
              >
                <Printer className="w-4 h-4" />
                <span>Print Receipt</span>
              </button>

              {booking.status !== 'collected' && (
                <button
                  onClick={() => {
                    const d = new Date(booking.expected_pickup_date);
                    d.setDate(d.getDate() + 2);
                    setNewDate(d.toISOString().split('T')[0]);
                    setExtendModalOpen(true);
                  }}
                  className="bg-[#E75A2D] hover:bg-[#d0451b] text-white text-xs px-4 py-2 rounded-xl font-bold shadow flex items-center gap-1.5 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{t.tracking.extendBtn}</span>
                </button>
              )}
            </div>
          </div>

          {/* OVERDUE NOTICE IF APPLICABLE */}
          {booking.status === 'overdue' && (
            <div className="bg-rose-50 border-b border-rose-200 p-4 flex items-center gap-3 text-rose-800 text-xs">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
              <div>
                <strong>STORAGE OVERDUE ALERT:</strong> This item passed its expected pickup date ({booking.expected_pickup_date}). A standard late fee of KES {booking.late_fee || 100} has been applied. Please collect today or extend your duration immediately.
              </div>
            </div>
          )}

          {/* PROGRESS TIMELINE */}
          <div className="p-6 sm:p-8 border-b border-gray-100 bg-gray-50/50">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-6">
              Storage Progress Timeline
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative">
              {statusSteps.map((step, idx) => {
                const currentIdx = getStatusIndex(booking.status);
                const isPassed = currentIdx >= idx;
                const isCurrent = currentIdx === idx;

                return (
                  <div key={step.key} className="flex flex-col items-center text-center space-y-2">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shadow-sm transition-all ${
                        isPassed
                          ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                          : 'bg-white border-2 border-gray-300 text-gray-400'
                      }`}
                    >
                      {isPassed ? <CheckCircle className="w-5 h-5 text-white" /> : idx + 1}
                    </div>
                    <span className={`text-xs font-semibold ${isCurrent ? 'text-[#0F2A4A] font-bold' : 'text-gray-500'}`}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* STORAGE METRICS GRID */}
          <div className="p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                {t.tracking.daysStored}
              </span>
              <div className="text-2xl font-extrabold text-[#0F2A4A]">
                {booking.days_stored_calculated || 1} day(s)
              </div>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Dropped off: {booking.dropoff_date}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block mb-1">
                {t.tracking.rackLocation}
              </span>
              <div className="text-2xl font-black text-amber-900">
                {booking.shelf_location || 'Receiving Bay'}
              </div>
              <p className="text-[11px] text-amber-700 mt-0.5">
                CCTV-Monitored Aisle
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block mb-1">
                {t.tracking.amountPaid}
              </span>
              <div className="text-2xl font-black text-emerald-800">
                KES {booking.paid_amount?.toLocaleString()}
              </div>
              <p className="text-[11px] text-emerald-700 mt-0.5 uppercase font-semibold">
                Status: {booking.payment_status}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 block mb-1">
                {t.tracking.balanceDue}
              </span>
              <div className="text-2xl font-black text-rose-700">
                KES {booking.balance_amount?.toLocaleString()}
              </div>
              <p className="text-[11px] text-rose-600 mt-0.5">
                Due on collection
              </p>
            </div>
          </div>

          {/* ITEM SUMMARY & QR */}
          <div className="p-6 sm:p-8 bg-gray-50 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="space-y-1.5 text-xs text-gray-700">
              <p>
                <strong>Stored Items:</strong> {booking.quantity}x {booking.item_type} ({booking.item_size})
                {booking.is_fragile ? ' • ⚠️ FRAGILE' : ''}
              </p>
              {booking.description && (
                <p className="text-gray-500 italic">
                  "{booking.description}"
                </p>
              )}
              <p>
                <strong>Scheduled Pick-up:</strong> {booking.expected_pickup_date}
              </p>
              <p>
                <strong>Counter Location:</strong> Moi Avenue, Opp. Mombasa Tusks, Mombasa CBD
              </p>
            </div>

            {qrCodeUrl && (
              <div className="text-center shrink-0">
                <img
                  src={qrCodeUrl}
                  alt="Booking QR Code"
                  className="w-24 h-24 p-1 bg-white border border-gray-300 rounded-xl mx-auto shadow-xs"
                />
                <span className="text-[9px] text-gray-500 block mt-1">Official Luggage QR</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* EXTEND STORAGE MODAL */}
      {extendModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="font-bold text-base text-[#0F2A4A] font-['Poppins']">
                Extend Storage Period
              </h3>
              <button onClick={() => setExtendModalOpen(false)} className="p-1 text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {extendSuccess ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-semibold text-center">
                {extendSuccess}
              </div>
            ) : (
              <form onSubmit={handleExtendSubmit} className="space-y-4 text-xs">
                <p className="text-gray-600">
                  Choose a new collection date. Additional days will be calculated at standard Mombasa rates and added to your balance.
                </p>

                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">
                    New Expected Pick-up Date *
                  </label>
                  <input
                    type="date"
                    min={booking.expected_pickup_date}
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-[#E75A2D]"
                    required
                  />
                </div>

                <div className="p-3 bg-amber-50 rounded-xl text-amber-800 border border-amber-200">
                  Payment can be settled on collection at our Moi Avenue counter or online via M-Pesa.
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setExtendModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isExtending}
                    className="px-5 py-2 bg-[#E75A2D] hover:bg-[#d0451b] text-white rounded-xl font-bold shadow"
                  >
                    {isExtending ? 'Updating...' : 'Confirm Extension'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* RECEIPT MODAL */}
      {showReceipt && booking && (
        <ReceiptPrint
          booking={booking}
          qrCodeDataUrl={qrCodeUrl}
          onClose={() => setShowReceipt(false)}
        />
      )}
    </div>
  );
}
