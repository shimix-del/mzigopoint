import React, { useState } from 'react';
import { X, PlusCircle, Luggage, User, Calendar, CreditCard, CheckCircle } from 'lucide-react';
import ReceiptPrint from '../components/ReceiptPrint';

export default function ManualBookingModal({ token, user, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    id_number: '',
    item_type: 'Travel Suitcase',
    item_size: 'medium',
    quantity: 1,
    description: '',
    is_fragile: false,
    dropoff_date: new Date().toISOString().split('T')[0],
    dropoff_time: '10:00 AM',
    expected_pickup_date: '',
    storage_reason: 'Travelling',
    shelf_location: 'Shelf A-01',
    payment_choice: 'cash', // 'cash' or 'mpesa_counter'
    payment_type: 'full',
    paid_now: '',
    notes: 'Walk-in customer at counter'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [createdBooking, setCreatedBooking] = useState(null);

  // Set default pickup to tomorrow
  React.useEffect(() => {
    const tmrw = new Date();
    tmrw.setDate(tmrw.getDate() + 1);
    setFormData(prev => ({
      ...prev,
      expected_pickup_date: tmrw.toISOString().split('T')[0]
    }));
  }, []);

  const rates = {
    small: { day: 150, week: 900, month: 3200 },
    medium: { day: 250, week: 1500, month: 5500 },
    large: { day: 400, week: 2400, month: 8800 },
    xlarge: { day: 750, week: 4500, month: 16000 }
  };

  const calculateDays = () => {
    if (!formData.dropoff_date || !formData.expected_pickup_date) return 1;
    const dDrop = new Date(formData.dropoff_date);
    const dPick = new Date(formData.expected_pickup_date);
    const diff = Math.ceil((dPick - dDrop) / (1000 * 60 * 60 * 24));
    return Math.max(1, diff);
  };

  const days = calculateDays();
  const r = rates[formData.item_size] || rates.medium;
  const totalCost = (days >= 30 ? Math.floor(days / 30) * r.month + (days % 30) * r.day : days >= 7 ? Math.floor(days / 7) * r.week + (days % 7) * r.day : days * r.day) * formData.quantity;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.id_number) {
      setErrorMsg('Name, Phone, and National ID are required.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          is_walkin: true,
          deposit_amount: formData.payment_type === 'full' ? totalCost : (parseFloat(formData.paid_now) || Math.ceil(totalCost * 0.5))
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setCreatedBooking({
        ...formData,
        booking_ref: data.bookingRef,
        id: data.bookingId,
        total_amount: data.totalAmount,
        paid_amount: data.paidAmount,
        balance_amount: data.balanceAmount,
        payment_status: data.paymentStatus,
        customer_name: formData.name,
        customer_phone: formData.phone,
        customer_id_number: formData.id_number,
        qrCodeDataUrl: data.qrCodeDataUrl
      });
    } catch (err) {
      setErrorMsg(err.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-gray-100 my-6 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-[#0F2A4A] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-base font-['Poppins']">
              Fast Walk-In Booking (Counter Desk)
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>

        {createdBooking ? (
          <div className="p-8 text-center space-y-5 text-xs">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full uppercase">
                Walk-In Intake Recorded
              </span>
              <h4 className="text-xl font-bold font-mono text-[#0F2A4A] mt-2">
                {createdBooking.booking_ref}
              </h4>
              <p className="text-gray-500 mt-1">
                Assigned Rack: <strong>{createdBooking.shelf_location}</strong>
              </p>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => onSuccess()}
                className="bg-[#0F2A4A] text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase"
              >
                Done & View Bookings
              </button>
            </div>

            {/* Auto preview Receipt */}
            <ReceiptPrint
              booking={createdBooking}
              qrCodeDataUrl={createdBooking.qrCodeDataUrl}
              onClose={() => onSuccess()}
            />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs overflow-y-auto max-h-[80vh]">
            {errorMsg && (
              <div className="p-3 bg-rose-50 text-rose-700 rounded-xl border border-rose-200">
                {errorMsg}
              </div>
            )}

            {/* Customer */}
            <div className="space-y-3">
              <span className="font-bold text-gray-700 uppercase tracking-wider block border-b pb-1">
                Customer Information
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Halima Omar"
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="07..."
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">National ID / Passport *</label>
                  <input
                    type="text"
                    required
                    value={formData.id_number}
                    onChange={(e) => setFormData({ ...formData, id_number: e.target.value })}
                    placeholder="ID number"
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Luggage Details & Shelf */}
            <div className="space-y-3 pt-2">
              <span className="font-bold text-gray-700 uppercase tracking-wider block border-b pb-1">
                Item & Storage Assignment
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Size *</label>
                  <select
                    value={formData.item_size}
                    onChange={(e) => setFormData({ ...formData, item_size: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  >
                    <option value="small">Small (KES 150/d)</option>
                    <option value="medium">Medium (KES 250/d)</option>
                    <option value="large">Large (KES 400/d)</option>
                    <option value="xlarge">Extra Large (KES 750/d)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Assign Shelf / Bay *</label>
                  <input
                    type="text"
                    required
                    value={formData.shelf_location}
                    onChange={(e) => setFormData({ ...formData, shelf_location: e.target.value.toUpperCase() })}
                    placeholder="e.g. Shelf A-04"
                    className="w-full px-3 py-2 border rounded-xl uppercase font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Expected Pick-up *</label>
                  <input
                    type="date"
                    required
                    value={formData.expected_pickup_date}
                    onChange={(e) => setFormData({ ...formData, expected_pickup_date: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Description & Bag Marks</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g. Red trolley with padlock"
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_fragile}
                    onChange={(e) => setFormData({ ...formData, is_fragile: e.target.checked })}
                    className="w-4 h-4 text-[#E75A2D] rounded"
                  />
                  <span>⚠️ Mark Fragile (Electronics / Glass)</span>
                </label>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="p-3.5 bg-gray-50 rounded-2xl border flex justify-between items-center">
              <div>
                <span className="text-gray-500 block">Calculated Total ({days} days):</span>
                <strong className="text-base text-[#0F2A4A]">KES {totalCost.toLocaleString()}</strong>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={formData.payment_choice}
                  onChange={(e) => setFormData({ ...formData, payment_choice: e.target.value })}
                  className="px-3 py-1.5 border rounded-xl bg-white"
                >
                  <option value="cash">Paid in Cash</option>
                  <option value="mpesa_counter">Paid via M-Pesa Counter</option>
                </select>

                <select
                  value={formData.payment_type}
                  onChange={(e) => setFormData({ ...formData, payment_type: e.target.value })}
                  className="px-3 py-1.5 border rounded-xl bg-white"
                >
                  <option value="full">Paid in Full</option>
                  <option value="deposit">Deposit Only</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border rounded-xl text-gray-700 font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-5 py-2 bg-[#E75A2D] hover:bg-[#d0451b] text-white rounded-xl font-bold shadow flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{isLoading ? 'Registering...' : 'Register Walk-In & Print Tag'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
