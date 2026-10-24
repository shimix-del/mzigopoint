import React from 'react';
import { Printer, X, Download, ShieldCheck, CheckCircle } from 'lucide-react';

export default function ReceiptPrint({ booking, qrCodeDataUrl, onClose }) {
  if (!booking) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden my-6 border border-gray-100 flex flex-col">
        {/* Modal Controls Header */}
        <div className="bg-[#0F2A4A] text-white p-4 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-base">Print Receipt & Luggage Tag</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-[#E75A2D] hover:bg-[#d0451b] text-white text-xs px-3.5 py-1.5 rounded-lg font-bold flex items-center gap-1.5 shadow"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Now</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-gray-300 hover:text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Area */}
        <div className="print-area p-6 bg-white font-mono text-gray-800 text-xs">
          {/* 1. Official Receipt Section */}
          <div className="border-2 border-dashed border-gray-400 p-5 rounded-xl mb-6 bg-amber-50/30">
            <div className="text-center pb-3 border-b border-gray-300 mb-3">
              <h2 className="text-lg font-extrabold tracking-tight font-sans text-[#0F2A4A]">
                MZINGO POINT STORAGE
              </h2>
              <p className="text-[11px] text-gray-600 font-sans">
                Moi Avenue, Opp. Mombasa Tusks, Mombasa, Kenya
              </p>
              <p className="text-[11px] text-gray-600 font-sans">
                Tel / WhatsApp: +254 712 345 678 • info@mzingopoint.co.ke
              </p>
              <p className="text-[10px] text-gray-500 font-sans mt-0.5">
                Reg: PVT-MZP2026 • Kenya Data Protection Act Compliant
              </p>
            </div>

            <div className="flex justify-between items-start mb-3 pb-2 border-b border-gray-200">
              <div>
                <p><span className="text-gray-500">Booking Ref:</span> <strong className="text-sm font-sans text-[#0F2A4A]">{booking.booking_ref}</strong></p>
                <p><span className="text-gray-500">Customer:</span> <strong>{booking.customer_name || 'Walk-in Mteja'}</strong></p>
                <p><span className="text-gray-500">Phone:</span> {booking.customer_phone}</p>
                <p><span className="text-gray-500">ID / Passport:</span> {booking.customer_id_number || 'Verified on Counter'}</p>
              </div>
              <div className="text-right">
                <p><span className="text-gray-500">Drop-off:</span> {booking.dropoff_date}</p>
                <p><span className="text-gray-500">Pick-up:</span> <strong>{booking.expected_pickup_date}</strong></p>
                <p><span className="text-gray-500">Rack / Shelf:</span> <strong className="text-amber-700 bg-amber-100 px-1 rounded">{booking.shelf_location || 'Receiving Bay'}</strong></p>
              </div>
            </div>

            {/* Items details */}
            <div className="mb-4">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-300 text-gray-600 font-semibold">
                    <th className="py-1">Item Description</th>
                    <th className="py-1">Size</th>
                    <th className="py-1 text-center">Qty</th>
                    <th className="py-1 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="py-1.5 font-sans">
                      {booking.item_type}
                      {booking.is_fragile ? ' ⚠️ [FRAGILE]' : ''}
                      {booking.description && <span className="block text-[10px] text-gray-500 italic">{booking.description}</span>}
                    </td>
                    <td className="py-1.5 uppercase font-sans text-[11px]">{booking.item_size}</td>
                    <td className="py-1.5 text-center font-sans">{booking.quantity}</td>
                    <td className="py-1.5 text-right font-sans">KES {booking.total_amount?.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Financial Summary */}
            <div className="border-t border-gray-300 pt-2 space-y-1 text-right font-sans">
              <div className="flex justify-between">
                <span className="text-gray-600">Storage Total:</span>
                <span className="font-semibold">KES {booking.total_amount?.toLocaleString()}</span>
              </div>
              {booking.late_fee > 0 && (
                <div className="flex justify-between text-rose-600">
                  <span>Late Fee Applied:</span>
                  <span className="font-semibold">+ KES {booking.late_fee?.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-emerald-700">
                <span>Amount Paid:</span>
                <span className="font-semibold">KES {booking.paid_amount?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm font-bold border-t border-gray-300 pt-1 text-[#0F2A4A]">
                <span>Balance Due on Collection:</span>
                <span className={booking.balance_amount > 0 ? 'text-rose-600' : 'text-emerald-700'}>
                  KES {booking.balance_amount?.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-dashed border-gray-300 text-[10px] text-gray-500 leading-snug">
              <p>• Retain this receipt. Present original ID/Passport and reference when picking up.</p>
              <p>• Late fee: KES 100/day per item applied after {booking.expected_pickup_date}.</p>
              <p>• Unclaimed items policy: Handled under Kenya Disposal of Uncollected Goods Act after 30 days.</p>
            </div>
          </div>

          {/* 2. Tear-off Luggage Tag Section */}
          <div className="border-2 border-black p-4 rounded-xl bg-white relative">
            <div className="text-[10px] font-sans font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>✂️ TEAR-OFF ITEM LUGGAGE TAG (ATTACH TO BAG HANDLE)</span>
              <span>MZINGO POINT MOMBASA</span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1 flex-1 font-sans">
                <div className="text-xl font-black text-[#0F2A4A] tracking-wider">
                  {booking.booking_ref}
                </div>
                <div className="text-sm font-bold text-amber-800 bg-amber-100 inline-block px-2 py-0.5 rounded">
                  SHELF: {booking.shelf_location || 'UNASSIGNED'}
                </div>
                <p className="text-xs">
                  <strong>{booking.customer_name}</strong> • {booking.customer_phone}
                </p>
                <p className="text-xs text-gray-600">
                  {booking.quantity}x {booking.item_type} ({booking.item_size})
                  {booking.is_fragile ? ' • ⚠️ FRAGILE' : ''}
                </p>
                <p className="text-[11px] text-gray-500">
                  Drop-off: {booking.dropoff_date} | Due: <strong>{booking.expected_pickup_date}</strong>
                </p>
              </div>

              {/* QR Code */}
              {qrCodeDataUrl ? (
                <div className="text-center shrink-0">
                  <img src={qrCodeDataUrl} alt="Luggage QR Code" className="w-24 h-24 border border-gray-300 p-1 rounded" />
                  <span className="text-[9px] text-gray-500 block mt-0.5">Scan to verify</span>
                </div>
              ) : (
                <div className="w-24 h-24 border border-dashed border-gray-300 flex items-center justify-center text-[10px] text-gray-400">
                  QR Tag
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal footer controls */}
        <div className="bg-gray-50 p-4 border-t border-gray-200 flex justify-end gap-3 no-print">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-100"
          >
            Close Preview
          </button>
          <button
            onClick={handlePrint}
            className="px-5 py-2 bg-[#E75A2D] hover:bg-[#d0451b] text-white rounded-xl text-xs font-bold shadow flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Print Receipt & Tag</span>
          </button>
        </div>
      </div>
    </div>
  );
}
