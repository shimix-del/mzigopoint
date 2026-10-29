import React from 'react';
import { Printer, X, Download, ShieldCheck, CheckCircle } from 'lucide-react';

export default function ReceiptPrint({ booking, qrCodeDataUrl, onClose }) {
  if (!booking) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl sm:rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden my-3 sm:my-6 border border-gray-100 flex flex-col max-h-[92vh]">
        {/* Modal Controls Header */}
        <div className="bg-[#0B2545] text-white p-3.5 sm:p-4 flex items-center justify-between no-print shrink-0 gap-2">
          <div className="flex items-center gap-2 truncate min-w-0">
            <Printer className="w-4 h-4 text-[#13B5B1] shrink-0" />
            <h3 className="font-bold text-xs sm:text-sm font-['Syne'] truncate">Print Receipt & Luggage Tag</h3>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handlePrint}
              className="bg-[#FF6B4A] hover:bg-[#e85535] text-white text-xs px-3 sm:px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 shadow min-h-[36px]"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 min-h-[36px] min-w-[36px] flex items-center justify-center"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Area */}
        <div className="print-area p-4 sm:p-6 bg-white font-mono text-gray-800 text-xs overflow-y-auto">
          {/* 1. Official Receipt Section */}
          <div className="border-2 border-dashed border-gray-400 p-4 sm:p-5 rounded-2xl mb-5 sm:mb-6 bg-amber-50/30">
            <div className="text-center pb-3 border-b border-gray-300 mb-3">
              <h2 className="text-base sm:text-lg font-black tracking-tight font-sans text-[#0B2545]">
                MZINGO POINT STORAGE
              </h2>
              <p className="text-[10px] sm:text-[11px] text-gray-600 font-sans">
                Moi Avenue, Opp. Mombasa Tusks, Mombasa, Kenya
              </p>
              <p className="text-[10px] sm:text-[11px] text-gray-600 font-sans">
                Tel / WhatsApp: +254 712 345 678 • info@mzingopoint.co.ke
              </p>
              <p className="text-[9px] sm:text-[10px] text-gray-500 font-sans mt-0.5">
                Reg: PVT-MZP2026 • Kenya Data Protection Act Compliant
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start mb-3 pb-2 border-b border-gray-200 gap-2">
              <div>
                <p><span className="text-gray-500">Booking Ref:</span> <strong className="text-sm font-sans text-[#0B2545]">{booking.booking_ref}</strong></p>
                <p><span className="text-gray-500">Customer:</span> <strong>{booking.customer_name || 'Walk-in Mteja'}</strong></p>
                <p><span className="text-gray-500">Phone:</span> {booking.customer_phone}</p>
                <p><span className="text-gray-500">National ID / Passport:</span> {booking.customer_id_number || 'Verified'}</p>
              </div>
              <div className="sm:text-right">
                <p><span className="text-gray-500">Drop-off:</span> {booking.dropoff_date}</p>
                <p><span className="text-gray-500">Expected Pick-up:</span> <strong className="text-rose-700">{booking.expected_pickup_date}</strong></p>
                <p><span className="text-gray-500">Storage Rack Bay:</span> <strong className="text-[#FF6B4A]">{booking.shelf_location || 'Receiving Bay'}</strong></p>
              </div>
            </div>

            {/* Itemized Table */}
            <table className="w-full text-left mb-3">
              <thead>
                <tr className="border-b border-gray-300 text-[10px] text-gray-500 uppercase">
                  <th className="py-1">Description</th>
                  <th className="py-1 text-center">Qty</th>
                  <th className="py-1 text-center">Size</th>
                  <th className="py-1 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-xs">
                <tr>
                  <td className="py-1.5">
                    <strong>{booking.item_type}</strong>
                    {booking.description && <span className="block text-[10px] text-gray-500">"{booking.description}"</span>}
                    {booking.is_fragile ? <span className="text-[9px] text-rose-600 font-bold">⚠️ FRAGILE HANDLING</span> : null}
                  </td>
                  <td className="py-1.5 text-center">{booking.quantity}</td>
                  <td className="py-1.5 text-center uppercase">{booking.item_size}</td>
                  <td className="py-1.5 text-right font-bold">KES {booking.total_amount?.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>

            {/* Financial Summary */}
            <div className="border-t-2 border-gray-400 pt-2 space-y-1 text-xs">
              <div className="flex justify-between">
                <span>Total Storage Fee:</span>
                <strong className="text-[#0B2545]">KES {booking.total_amount?.toLocaleString()}</strong>
              </div>
              <div className="flex justify-between text-emerald-700">
                <span>Amount Paid:</span>
                <strong>KES {booking.paid_amount?.toLocaleString()} ({booking.payment_status?.toUpperCase()})</strong>
              </div>
              <div className="flex justify-between text-rose-700 font-bold border-t border-gray-200 pt-1">
                <span>Balance Due at Collection:</span>
                <strong>KES {booking.balance_amount > 0 ? booking.balance_amount?.toLocaleString() : '0 (CLEARED)'}</strong>
              </div>
            </div>
          </div>

          {/* 2. Tear-off Luggage Tag Strip */}
          <div className="border-2 border-[#0B2545] p-4 sm:p-5 rounded-2xl bg-white space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <span className="font-bold uppercase tracking-wider text-[10px] text-gray-500">
                Official Baggage Claim Tag • Mzingo Point
              </span>
              <span className="bg-[#FF6B4A] text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase">
                Attach to Bag
              </span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] text-gray-400 uppercase block">Ref Code:</span>
                <span className="text-xl sm:text-2xl font-black font-sans text-[#0B2545] tracking-widest">
                  {booking.booking_ref}
                </span>
                <p className="text-xs">
                  Bay Location: <strong className="text-base text-[#FF6B4A] font-sans">{booking.shelf_location || 'Receiving Bay'}</strong>
                </p>
                <p className="text-[11px] text-gray-600">
                  Customer: <strong>{booking.customer_name}</strong>
                </p>
              </div>

              {qrCodeDataUrl && (
                <div className="text-center shrink-0">
                  <img
                    src={qrCodeDataUrl}
                    alt="Booking QR Code"
                    className="w-20 h-20 sm:w-24 sm:h-24 p-1 border border-gray-300 rounded-xl"
                  />
                  <span className="text-[9px] text-gray-400 block mt-0.5">Scan to verify</span>
                </div>
              )}
            </div>

            <div className="text-[9px] text-gray-500 border-t pt-2 leading-snug">
              Notice: Items uncollected after the agreed pickup date attract a late holding fee of KES 100/day. Presented National ID must match the booking record for luggage release.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
