import React, { useState, useEffect } from 'react';
import {
  X,
  Printer,
  CheckCircle,
  Clock,
  Luggage,
  Calendar,
  CreditCard,
  MessageSquare,
  AlertTriangle,
  FileText,
  UserCheck,
  Send,
  Edit2,
  Trash2,
  Tag
} from 'lucide-react';
import ReceiptPrint from '../components/ReceiptPrint';
import SignaturePad from '../components/SignaturePad';

export default function BookingDetailModal({ bookingId, token, user, onClose, onDataChanged }) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState('details'); // 'details', 'payments', 'timeline'

  // Action Forms
  const [shelfInput, setShelfInput] = useState('');
  const [shelfEditing, setShelfEditing] = useState(false);

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [payAmount, setPayAmount] = useState('');
  const [payMethod, setPayMethod] = useState('mpesa_counter');
  const [mpesaCode, setMpesaCode] = useState('');
  const [payNotes, setPayNotes] = useState('');

  const [collectModalOpen, setCollectModalOpen] = useState(false);
  const [collectorName, setCollectorName] = useState('');
  const [collectorId, setCollectorId] = useState('');
  const [collectorSig, setCollectorSig] = useState('');

  const [extendModalOpen, setExtendModalOpen] = useState(false);
  const [newPickupDate, setNewPickupDate] = useState('');

  const [newNote, setNewNote] = useState('');
  const [receiptOpen, setReceiptOpen] = useState(false);

  useEffect(() => {
    fetchDetails();
  }, [bookingId]);

  const fetchDetails = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setData(json);
      setShelfInput(json.booking.shelf_location || '');
      setCollectorName(json.booking.collector_name || json.booking.customer_name);
      setCollectorId(json.booking.collector_id || json.booking.customer_id_number);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Update Status & Shelf
  const handleUpdateStatus = async (newStatus) => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (!res.ok) throw new Error('Status update failed');
      fetchDetails();
      if (onDataChanged) onDataChanged();
    } catch (err) {
      alert(err.message);
    }
  };

  // Save Shelf Location
  const handleSaveShelf = async () => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ shelf_location: shelfInput.trim().toUpperCase() })
      });
      if (!res.ok) throw new Error('Shelf update failed');
      setShelfEditing(false);
      fetchDetails();
      if (onDataChanged) onDataChanged();
    } catch (err) {
      alert(err.message);
    }
  };

  // Record Manual Payment
  const handleRecordPayment = async (e) => {
    e.preventDefault();
    if (!payAmount || parseFloat(payAmount) <= 0) return;

    try {
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          booking_id: bookingId,
          amount: parseFloat(payAmount),
          payment_method: payMethod,
          mpesa_code: mpesaCode,
          notes: payNotes
        })
      });
      if (!res.ok) throw new Error('Failed to record payment');
      setPaymentModalOpen(false);
      setPayAmount('');
      setMpesaCode('');
      setPayNotes('');
      fetchDetails();
      if (onDataChanged) onDataChanged();
    } catch (err) {
      alert(err.message);
    }
  };

  // Confirm Collection with Signature
  const handleConfirmCollection = async () => {
    if (!collectorName || !collectorId) {
      alert('Collector Name and National ID Number are required.');
      return;
    }

    try {
      const res = await fetch(`/api/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          status: 'collected',
          collector_name: collectorName,
          collector_id: collectorId,
          collector_signature: collectorSig || null
        })
      });
      if (!res.ok) throw new Error('Failed to mark collected');
      setCollectModalOpen(false);
      fetchDetails();
      if (onDataChanged) onDataChanged();
    } catch (err) {
      alert(err.message);
    }
  };

  // Extend booking
  const handleExtendBooking = async (e) => {
    e.preventDefault();
    if (!newPickupDate) return;

    try {
      const res = await fetch(`/api/bookings/${bookingId}/extend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          new_pickup_date: newPickupDate
        })
      });
      if (!res.ok) throw new Error('Failed to extend');
      setExtendModalOpen(false);
      fetchDetails();
      if (onDataChanged) onDataChanged();
    } catch (err) {
      alert(err.message);
    }
  };

  // Send Notification
  const handleSendNotification = async (type) => {
    try {
      const res = await fetch('/api/notifications/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          booking_id: bookingId,
          type
        })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      window.open(json.whatsAppLink, '_blank');
      fetchDetails();
    } catch (err) {
      alert(err.message);
    }
  };

  // Add Note
  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    const existingNotes = data.booking.notes ? `${data.booking.notes}\n[${user.name}]: ${newNote}` : `[${user.name}]: ${newNote}`;

    try {
      await fetch(`/api/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ notes: existingNotes })
      });
      setNewNote('');
      fetchDetails();
    } catch (err) {
      alert(err.message);
    }
  };

  if (isLoading || !data) {
    return (
      <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center text-xs">
          Loading booking details...
        </div>
      </div>
    );
  }

  const { booking, payments, auditLogs, qrCodeDataUrl } = data;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-gray-100 my-6 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Top Header */}
        <div className="bg-[#0F2A4A] text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold font-mono tracking-wider text-amber-400">
              {booking.booking_ref}
            </span>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-white/20">
              {booking.status.replace('_', ' ')}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setReceiptOpen(true)}
              className="bg-white/10 hover:bg-white/20 text-white text-xs px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Tag & Receipt</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-2 flex items-center justify-between text-xs shrink-0">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('details')}
              className={`pb-2 font-bold transition-colors ${
                activeTab === 'details' ? 'border-b-2 border-[#E75A2D] text-[#0F2A4A]' : 'text-gray-500'
              }`}
            >
              Storage & Customer
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`pb-2 font-bold transition-colors ${
                activeTab === 'payments' ? 'border-b-2 border-[#E75A2D] text-[#0F2A4A]' : 'text-gray-500'
              }`}
            >
              Payments ({payments.length})
            </button>
            <button
              onClick={() => setActiveTab('timeline')}
              className={`pb-2 font-bold transition-colors ${
                activeTab === 'timeline' ? 'border-b-2 border-[#E75A2D] text-[#0F2A4A]' : 'text-gray-500'
              }`}
            >
              Audit Trail ({auditLogs.length})
            </button>
          </div>

          {/* WhatsApp Direct Action */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-gray-500 hidden sm:inline">Send WhatsApp:</span>
            <button
              onClick={() => handleSendNotification('confirmation')}
              className="text-[10px] bg-[#25D366] text-white font-bold px-2 py-1 rounded hover:bg-[#20ba59]"
              title="Send Confirmation"
            >
              Confirm
            </button>
            <button
              onClick={() => handleSendNotification('reminder_due')}
              className="text-[10px] bg-amber-500 text-white font-bold px-2 py-1 rounded hover:bg-amber-600"
              title="Send Due Reminder"
            >
              Due Today
            </button>
            <button
              onClick={() => handleSendNotification('overdue_alert')}
              className="text-[10px] bg-rose-600 text-white font-bold px-2 py-1 rounded hover:bg-rose-700"
              title="Send Overdue Notice"
            >
              Overdue
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs text-gray-700">
          {/* TAB 1: DETAILS */}
          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* Quick Status Bar */}
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 font-semibold">Change Status:</span>
                  <div className="flex flex-wrap gap-1">
                    <button
                      onClick={() => handleUpdateStatus('in_storage')}
                      className={`px-2.5 py-1 rounded-lg font-bold uppercase text-[10px] ${
                        booking.status === 'in_storage' ? 'bg-[#0F2A4A] text-white' : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                    >
                      In Storage
                    </button>
                    <button
                      onClick={() => handleUpdateStatus('ready')}
                      className={`px-2.5 py-1 rounded-lg font-bold uppercase text-[10px] ${
                        booking.status === 'ready' ? 'bg-amber-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                    >
                      Ready
                    </button>
                    <button
                      onClick={() => setCollectModalOpen(true)}
                      className={`px-2.5 py-1 rounded-lg font-bold uppercase text-[10px] ${
                        booking.status === 'collected' ? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                      }`}
                    >
                      ✓ Mark Collected
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setPayAmount(booking.balance_amount);
                      setPaymentModalOpen(true);
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 shadow-xs"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Record Payment</span>
                  </button>
                  <button
                    onClick={() => {
                      setNewPickupDate(booking.expected_pickup_date);
                      setExtendModalOpen(true);
                    }}
                    className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 shadow-xs"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Extend Date</span>
                  </button>
                </div>
              </div>

              {/* Grid: Customer & Storage Rack */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Customer card */}
                <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-2">
                  <h4 className="font-bold text-[#0F2A4A] text-sm uppercase tracking-wider border-b border-gray-100 pb-1">
                    Customer Details
                  </h4>
                  <div className="space-y-1">
                    <p><span className="text-gray-400">Name:</span> <strong className="text-gray-900">{booking.customer_name}</strong></p>
                    <p><span className="text-gray-400">Phone:</span> <strong className="font-mono">{booking.customer_phone}</strong></p>
                    <p><span className="text-gray-400">National ID / Passport:</span> <strong className="text-[#0F2A4A] bg-gray-100 px-1 rounded">{booking.customer_id_number}</strong></p>
                    {booking.customer_email && <p><span className="text-gray-400">Email:</span> {booking.customer_email}</p>}
                    <p><span className="text-gray-400">Reason:</span> {booking.storage_reason}</p>
                  </div>
                </div>

                {/* Storage & Shelf Location card */}
                <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-2">
                  <div className="flex justify-between items-center border-b border-gray-100 pb-1">
                    <h4 className="font-bold text-[#0F2A4A] text-sm uppercase tracking-wider">
                      Storage Rack Allocation
                    </h4>
                    {!shelfEditing ? (
                      <button
                        onClick={() => setShelfEditing(true)}
                        className="text-[10px] text-[#E75A2D] font-bold flex items-center gap-0.5 hover:underline"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Change</span>
                      </button>
                    ) : (
                      <button
                        onClick={handleSaveShelf}
                        className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded"
                      >
                        Save Shelf
                      </button>
                    )}
                  </div>

                  {shelfEditing ? (
                    <div className="pt-1 flex gap-2">
                      <input
                        type="text"
                        value={shelfInput}
                        onChange={(e) => setShelfInput(e.target.value)}
                        placeholder="e.g. Shelf A-03, Bay C-02"
                        className="flex-1 px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs"
                      />
                      <button onClick={handleSaveShelf} className="px-3 py-1 bg-[#0F2A4A] text-white rounded-lg font-bold">
                        OK
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <p>
                        <span className="text-gray-400">Current Shelf / Bin:</span>{' '}
                        <strong className="text-base text-amber-900 bg-amber-100 px-2 py-0.5 rounded font-mono">
                          {booking.shelf_location || 'UNASSIGNED'}
                        </strong>
                      </p>
                      <p><span className="text-gray-400">Drop-off:</span> {booking.dropoff_date} ({booking.dropoff_time})</p>
                      <p><span className="text-gray-400">Expected Pick-up:</span> <strong className="text-gray-900">{booking.expected_pickup_date}</strong></p>
                      <p><span className="text-gray-400">Days Stored:</span> {booking.days_stored_calculated || 1} day(s)</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Items Table */}
              <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-2">
                <h4 className="font-bold text-[#0F2A4A] text-sm uppercase tracking-wider border-b border-gray-100 pb-1">
                  Luggage & Items Stored
                </h4>

                <div className="flex items-start justify-between gap-4 pt-1">
                  <div>
                    <span className="text-sm font-bold text-gray-900">
                      {booking.quantity}x {booking.item_type} ({booking.item_size.toUpperCase()})
                    </span>
                    {booking.is_fragile ? (
                      <span className="ml-2 text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                        ⚠️ FRAGILE / DELICATE
                      </span>
                    ) : null}

                    {booking.description && (
                      <p className="text-gray-600 italic mt-1 bg-gray-50 p-2 rounded-lg border border-gray-100">
                        "{booking.description}"
                      </p>
                    )}
                  </div>

                  {qrCodeDataUrl && (
                    <img src={qrCodeDataUrl} alt="Tag QR" className="w-16 h-16 border rounded p-1" />
                  )}
                </div>
              </div>

              {/* Financial Balance Summary */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex justify-between items-center text-xs">
                <div>
                  <span className="text-gray-500 block">Total Due:</span>
                  <strong className="text-base text-gray-900">KES {booking.total_amount?.toLocaleString()}</strong>
                  {booking.late_fee > 0 && (
                    <span className="text-[10px] text-rose-600 block">+ KES {booking.late_fee} late fee</span>
                  )}
                </div>

                <div>
                  <span className="text-gray-500 block">Total Paid:</span>
                  <strong className="text-base text-emerald-700">KES {booking.paid_amount?.toLocaleString()}</strong>
                </div>

                <div className="text-right">
                  <span className="text-gray-500 block">Balance Remaining:</span>
                  <strong className={`text-base ${booking.balance_amount > 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                    KES {booking.balance_amount?.toLocaleString()}
                  </strong>
                </div>
              </div>

              {/* Internal Staff Notes */}
              <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-2">
                <h4 className="font-bold text-[#0F2A4A] text-sm uppercase tracking-wider border-b border-gray-100 pb-1">
                  Staff Internal Notes
                </h4>

                {booking.notes ? (
                  <pre className="text-xs bg-gray-50 p-2.5 rounded-xl border border-gray-100 whitespace-pre-wrap font-sans text-gray-700">
                    {booking.notes}
                  </pre>
                ) : (
                  <p className="text-gray-400 italic text-[11px]">No internal notes yet.</p>
                )}

                <form onSubmit={handleAddNote} className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add an internal note or observation..."
                    className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs"
                  />
                  <button type="submit" className="px-3 py-1.5 bg-[#0F2A4A] text-white rounded-lg font-bold text-xs">
                    Add Note
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 2: PAYMENTS */}
          {activeTab === 'payments' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-sm text-[#0F2A4A]">Payments & M-Pesa Receipts</h4>
                <button
                  onClick={() => {
                    setPayAmount(booking.balance_amount);
                    setPaymentModalOpen(true);
                  }}
                  className="bg-emerald-600 text-white px-3 py-1.5 rounded-xl font-bold text-xs"
                >
                  + Record Payment
                </button>
              </div>

              <div className="space-y-2">
                {payments.map((p) => (
                  <div key={p.id} className="p-3 rounded-xl border border-gray-200 bg-white flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900">KES {p.amount?.toLocaleString()}</span>
                        <span className="text-[10px] font-bold uppercase bg-gray-100 px-1.5 py-0.5 rounded text-gray-700">
                          {p.payment_method}
                        </span>
                        {p.mpesa_code && (
                          <span className="font-mono text-[11px] text-emerald-800 bg-emerald-50 px-1 rounded">
                            {p.mpesa_code}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-gray-400 mt-0.5 block">
                        Logged by {p.recorded_by} on {p.created_at}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: TIMELINE & AUDIT LOG */}
          {activeTab === 'timeline' && (
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-[#0F2A4A]">Complete Activity Audit Trail</h4>
              <div className="border-l-2 border-gray-200 pl-4 space-y-4">
                {auditLogs.map((log) => (
                  <div key={log.id} className="space-y-0.5 relative">
                    <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#E75A2D]"></div>
                    <span className="font-bold text-[#0F2A4A] block">{log.action}</span>
                    <p className="text-gray-600">{log.details}</p>
                    <span className="text-[10px] text-gray-400 font-mono block">
                      {log.performed_by} • {log.created_at}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RECORD PAYMENT SUB-MODAL */}
      {paymentModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-xl border">
            <h4 className="font-bold text-sm text-[#0F2A4A]">Record Payment at Counter</h4>
            <form onSubmit={handleRecordPayment} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Amount (KES) *</label>
                <input
                  type="number"
                  required
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Payment Method *</label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl"
                >
                  <option value="mpesa_counter">M-Pesa Counter / Till Number</option>
                  <option value="cash">Cash (Pesa Taslimu)</option>
                  <option value="mpesa_stk">M-Pesa STK Push</option>
                </select>
              </div>

              {payMethod !== 'cash' && (
                <div>
                  <label className="block font-bold text-gray-700 mb-1">M-Pesa Transaction Code (e.g. QKJ8912)</label>
                  <input
                    type="text"
                    value={mpesaCode}
                    onChange={(e) => setMpesaCode(e.target.value.toUpperCase())}
                    placeholder="e.g. QKL8921"
                    className="w-full px-3 py-2 border rounded-xl uppercase font-mono"
                  />
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPaymentModalOpen(false)}
                  className="px-3 py-1.5 border rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 text-white rounded-lg font-bold"
                >
                  Save Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* COLLECT ITEM & SIGNATURE SUB-MODAL */}
      {collectModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-xl border">
            <h4 className="font-bold text-base text-[#0F2A4A] font-['Poppins']">
              Verify Collection & Collect Signature
            </h4>
            <p className="text-xs text-gray-600">
              Verify customer ID before releasing items from rack {booking.shelf_location || 'Receiving'}.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Collector Full Name *</label>
                <input
                  type="text"
                  required
                  value={collectorName}
                  onChange={(e) => setCollectorName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Collector National ID / Passport *</label>
                <input
                  type="text"
                  required
                  value={collectorId}
                  onChange={(e) => setCollectorId(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              {/* HTML5 Canvas Signature Pad */}
              <div>
                <SignaturePad
                  onSave={(dataUrl) => setCollectorSig(dataUrl)}
                />
                {collectorSig && (
                  <span className="text-[10px] text-emerald-700 font-bold block mt-1">
                    ✓ Signature captured successfully!
                  </span>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setCollectModalOpen(false)}
                  className="px-4 py-2 border rounded-xl text-gray-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmCollection}
                  className="px-5 py-2 bg-emerald-600 text-white rounded-xl font-bold shadow"
                >
                  Release Belongings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EXTEND STORAGE SUB-MODAL */}
      {extendModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 space-y-3 shadow-xl border">
            <h4 className="font-bold text-sm text-[#0F2A4A]">Extend Pick-up Date</h4>
            <form onSubmit={handleExtendBooking} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">New Collection Date *</label>
                <input
                  type="date"
                  min={booking.expected_pickup_date}
                  value={newPickupDate}
                  onChange={(e) => setNewPickupDate(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setExtendModalOpen(false)}
                  className="px-3 py-1.5 border rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-600 text-white rounded-lg font-bold"
                >
                  Confirm Extension
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRINT RECEIPT & LUGGAGE TAG MODAL */}
      {receiptOpen && (
        <ReceiptPrint
          booking={booking}
          qrCodeDataUrl={qrCodeDataUrl}
          onClose={() => setReceiptOpen(false)}
        />
      )}
    </div>
  );
}
