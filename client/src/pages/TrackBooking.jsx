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
  X,
  Compass,
  MapPin,
  Lock,
  Tag,
  ArrowRight
} from 'lucide-react';
import { translations } from '../translations';
import ReceiptPrint from '../components/ReceiptPrint';
import { DhowIcon, TagGrommet } from '../components/SwahiliMotifs';

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
      }, 2200);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsExtending(false);
    }
  };

  // Status mapping
  const statusSteps = [
    { key: 'booked', label: '1. Booked Online', sub: 'Manifest Logged' },
    { key: 'in_storage', label: '2. In Storage Bay', sub: 'Numbered Rack' },
    { key: 'ready', label: '3. Ready for Pick-up', sub: 'At Counter' },
    { key: 'collected', label: '4. Collected & Signed', sub: 'Journey Complete' }
  ];

  const getStatusIndex = (st) => {
    if (st === 'booked') return 0;
    if (st === 'in_storage') return 1;
    if (st === 'ready') return 2;
    if (st === 'collected') return 3;
    if (st === 'overdue') return 1;
    return 0;
  };

  return (
    <div className="min-h-screen py-10 sm:py-16 px-4 sm:px-6 lg:px-8 relative bg-gradient-to-b from-[#F6EBD9]/40 via-white to-[#F6EBD9]/20">
      <div className="max-w-4xl mx-auto space-y-10">

        {/* Page Title */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#13B5B1]/10 border border-[#13B5B1]/20 text-[#0B2545] text-xs font-bold uppercase tracking-widest">
            <Compass className="w-3.5 h-3.5 text-[#13B5B1]" />
            <span>{lang === 'sw' ? 'Ufuatiliaji wa Mzigo • Mombasa' : 'Luggage Radar & Status • Mombasa Island'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black font-['Syne',sans-serif] text-[#0B2545] tracking-tight">
            {lang === 'sw' ? 'Fuatilia Mzigo Wako' : 'Track Luggage Status'}
          </h1>
          <p className="text-xs sm:text-base text-gray-600 max-w-xl mx-auto">
            {lang === 'sw'
              ? 'Weka namba ya kumbukumbu na simu kuona eneo la mzigo wako, salio, na kuongeza muda.'
              : 'Enter your booking reference and registered phone number to verify rack location, security lock, and pickup status.'}
          </p>
        </div>

        {/* SEARCH CARD */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-36 h-36 bg-[#13B5B1]/5 rounded-bl-full pointer-events-none"></div>

          <form onSubmit={handleTrack} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#0B2545] uppercase tracking-wider">
                  {lang === 'sw' ? 'Namba ya Uhifadhi (Ref) *' : 'Booking Reference Number *'}
                </label>
                <input
                  type="text"
                  value={refInput}
                  onChange={(e) => setRefInput(e.target.value.toUpperCase())}
                  placeholder="e.g. MZP-2026-0001"
                  className="w-full text-sm font-mono font-bold tracking-wider px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:border-[#13B5B1] focus:ring-2 focus:ring-[#13B5B1]/20 transition-all uppercase"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#0B2545] uppercase tracking-wider">
                  {lang === 'sw' ? 'Nambari ya Simu *' : 'Registered Phone Number *'}
                </label>
                <input
                  type="tel"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  placeholder="e.g. 0719 234 567"
                  className="w-full text-sm px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:border-[#13B5B1] focus:ring-2 focus:ring-[#13B5B1]/20 transition-all font-medium"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-2">
              <div className="text-xs text-gray-500 flex items-center gap-2">
                <span>Demo quick-fill:</span>
                <button
                  type="button"
                  onClick={() => { setRefInput('MZP-2026-0001'); setPhoneInput('0719234567'); }}
                  className="px-2.5 py-1 rounded-lg bg-[#FF6B4A]/10 text-[#FF6B4A] hover:bg-[#FF6B4A]/20 font-mono font-bold text-xs transition-colors"
                >
                  MZP-2026-0001
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto bg-[#FF6B4A] hover:bg-[#e85535] text-white px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Locating Luggage...</span>
                  </span>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>{lang === 'sw' ? 'Kagua Hali ya Mzigo' : 'Track My Luggage'}</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {errorMsg && (
            <div className="mt-5 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-center gap-2.5">
              <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* TRACKING RESULTS CARD */}
        {booking && (
          <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-400">
            {/* Header Strip with Swahili flair */}
            <div className="bg-[#0B2545] text-white p-6 sm:p-8 flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-white/10">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="text-2xl sm:text-3xl font-black font-['Syne'] tracking-wider">
                    {booking.booking_ref}
                  </span>
                  <span className={`text-[10px] font-mono uppercase font-bold px-3 py-1 rounded-full ${
                    booking.status === 'overdue'
                      ? 'bg-rose-500 text-white animate-pulse'
                      : booking.status === 'collected'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-[#13B5B1] text-[#0B2545]'
                  }`}>
                    ● {booking.status.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-xs text-amber-200/90 font-mono">
                  Owner: <span className="font-bold text-white">{booking.customer_name}</span> • Phone: {booking.customer_phone}
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowReceipt(true)}
                  className="bg-white/10 hover:bg-white/20 text-white text-xs px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all border border-white/15"
                >
                  <Printer className="w-4 h-4 text-[#13B5B1]" />
                  <span>Luggage Slip</span>
                </button>

                {booking.status !== 'collected' && (
                  <button
                    type="button"
                    onClick={() => {
                      const d = new Date(booking.expected_pickup_date);
                      d.setDate(d.getDate() + 2);
                      setNewDate(d.toISOString().split('T')[0]);
                      setExtendModalOpen(true);
                    }}
                    className="bg-[#FF6B4A] hover:bg-[#e85535] text-white text-xs px-5 py-2.5 rounded-xl font-bold shadow-md flex items-center gap-2 transition-all"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Extend Storage</span>
                  </button>
                )}
              </div>
            </div>

            {/* OVERDUE WARNING IF APPLICABLE */}
            {booking.status === 'overdue' && (
              <div className="bg-rose-50 border-b border-rose-200 p-4 sm:p-5 flex items-start gap-3.5 text-rose-900 text-xs sm:text-sm">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold uppercase font-['Syne']">STORAGE OVERDUE ALERT</strong>
                  <p className="text-xs text-rose-800 mt-0.5 leading-relaxed">
                    This reservation has exceeded its scheduled collection date ({booking.expected_pickup_date}). Standard late surcharge of KES {booking.late_fee || 100} has been added. Extend online or visit our Moi Avenue desk today.
                  </p>
                </div>
              </div>
            )}

            {/* COASTAL ROUTE TIMELINE */}
            <div className="p-6 sm:p-8 border-b border-gray-100 bg-[#FAF8F5]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-[#0B2545]">
                  Luggage Custody Lifecycle
                </h3>
                <span className="text-[11px] text-gray-500 font-mono">Location: Moi Ave, Mombasa Island</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative">
                {statusSteps.map((step, idx) => {
                  const currentIdx = getStatusIndex(booking.status);
                  const isPassed = currentIdx >= idx;
                  const isCurrent = currentIdx === idx;

                  return (
                    <div key={step.key} className="flex flex-col items-center text-center space-y-2 relative">
                      <div
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-xs shadow-sm transition-all ${
                          isPassed
                            ? 'bg-[#13B5B1] text-white ring-4 ring-[#13B5B1]/20'
                            : isCurrent
                            ? 'bg-[#FF6B4A] text-white ring-4 ring-[#FF6B4A]/20'
                            : 'bg-white border border-gray-200 text-gray-400'
                        }`}
                      >
                        {isPassed ? <CheckCircle className="w-5 h-5 text-white" /> : idx + 1}
                      </div>

                      <div>
                        <span className={`text-xs block font-bold ${
                          isCurrent ? 'text-[#FF6B4A]' : isPassed ? 'text-[#0B2545]' : 'text-gray-400'
                        }`}>
                          {step.label}
                        </span>
                        <span className="text-[10px] text-gray-400 block font-mono">
                          {step.sub}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* STORAGE METRICS GRID */}
            <div className="p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/80">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-500 block mb-1">
                  Days in Custody
                </span>
                <div className="text-2xl font-black font-['Syne'] text-[#0B2545]">
                  {booking.days_stored_calculated || 1} day(s)
                </div>
                <p className="text-[11px] text-gray-500 mt-1">
                  Checked in: {booking.dropoff_date}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#13B5B1]/10 border border-[#13B5B1]/30">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#0B2545] block mb-1">
                  Assigned Bay / Locker
                </span>
                <div className="text-2xl font-black font-['Syne'] text-[#0B2545]">
                  {booking.shelf_location || 'Bay #104'}
                </div>
                <p className="text-[11px] text-gray-600 mt-1 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#13B5B1]" />
                  <span>24/7 CCTV Monitored</span>
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-800 block mb-1">
                  Amount Paid
                </span>
                <div className="text-2xl font-black font-['Syne'] text-emerald-900">
                  KES {booking.paid_amount?.toLocaleString()}
                </div>
                <p className="text-[11px] text-emerald-700 mt-1 uppercase font-bold font-mono">
                  ● {booking.payment_status}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FF6B4A]/10 border border-[#FF6B4A]/30">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#FF6B4A] block mb-1">
                  Balance Due
                </span>
                <div className="text-2xl font-black font-['Syne'] text-[#0B2545]">
                  KES {booking.balance_amount?.toLocaleString()}
                </div>
                <p className="text-[11px] text-gray-500 mt-1">
                  Due upon bag handover
                </p>
              </div>
            </div>

            {/* ITEM SUMMARY & QR SLIP FOOTER */}
            <div className="p-6 sm:p-8 bg-gray-50/70 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="space-y-2 text-xs text-gray-700">
                <div className="flex items-center gap-2">
                  <Luggage className="w-4 h-4 text-[#FF6B4A]" />
                  <strong className="text-sm font-bold text-[#0B2545]">
                    {booking.quantity}x {booking.item_type} ({booking.item_size})
                  </strong>
                  {booking.is_fragile ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                      ⚠️ FRAGILE
                    </span>
                  ) : null}
                </div>

                {booking.description && (
                  <p className="text-gray-500 italic bg-white p-2.5 rounded-xl border border-gray-200">
                    "{booking.description}"
                  </p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-mono text-[11px] text-gray-500">
                  <div>Scheduled Pick-up: <strong className="text-[#0B2545]">{booking.expected_pickup_date}</strong></div>
                  <div>Counter: <strong className="text-[#0B2545]">Moi Ave, Opp. Mombasa Tusks</strong></div>
                </div>
              </div>

              {qrCodeUrl && (
                <div className="text-center shrink-0 bg-white p-3 rounded-2xl border border-gray-200 shadow-sm">
                  <img
                    src={qrCodeUrl}
                    alt="Luggage QR Tag"
                    className="w-24 h-24 mx-auto rounded-lg"
                  />
                  <span className="text-[9px] font-mono text-gray-400 block mt-1">Official Claim Tag</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* EXTEND STORAGE MODAL */}
        {extendModalOpen && (
          <div className="fixed inset-0 z-50 bg-[#0B2545]/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-100 space-y-5 animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2 text-[#0B2545]">
                  <RefreshCw className="w-5 h-5 text-[#FF6B4A]" />
                  <h3 className="font-black text-lg font-['Syne']">
                    Extend Storage Period
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setExtendModalOpen(false)}
                  className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {extendSuccess ? (
                <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl text-xs font-semibold text-center border border-emerald-200">
                  {extendSuccess}
                </div>
              ) : (
                <form onSubmit={handleExtendSubmit} className="space-y-4 text-xs">
                  <p className="text-gray-600 leading-relaxed">
                    Select a new collection date. Daily rates will be prorated automatically and added to your luggage balance.
                  </p>

                  <div className="space-y-1.5">
                    <label className="block font-bold text-[#0B2545] uppercase tracking-wider">
                      New Expected Collection Date *
                    </label>
                    <input
                      type="date"
                      min={booking.expected_pickup_date}
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="w-full text-sm font-bold text-[#0B2545] px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#13B5B1] focus:ring-2 focus:ring-[#13B5B1]/20"
                      required
                    />
                  </div>

                  <div className="p-3.5 bg-[#FAF8F5] rounded-xl text-gray-700 border border-gray-200 text-[11px] leading-relaxed">
                    💡 Payment difference can be cleared online with M-Pesa STK push or at the Moi Avenue counter during pick-up.
                  </div>

                  <div className="flex justify-end gap-2.5 pt-2">
                    <button
                      type="button"
                      onClick={() => setExtendModalOpen(false)}
                      className="px-5 py-2.5 border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isExtending}
                      className="px-6 py-2.5 bg-[#FF6B4A] hover:bg-[#e85535] text-white rounded-xl font-bold shadow-md"
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
    </div>
  );
}
