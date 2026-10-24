import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  CalendarCheck,
  User,
  Luggage,
  Calendar,
  CreditCard,
  CheckCircle,
  Clock,
  ArrowRight,
  ArrowLeft,
  Camera,
  ShieldCheck,
  Printer,
  MessageSquare,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { translations } from '../translations';
import ReceiptPrint from '../components/ReceiptPrint';

export default function BookStorage({ lang, setView, prefill }) {
  const t = translations[lang];

  // Multi-step form step state: 1, 2, 3, 4, 5
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    id_number: '',
    item_type: 'Travel Suitcase',
    item_size: (prefill && prefill.size) || 'medium',
    quantity: (prefill && prefill.qty) || 1,
    description: '',
    is_fragile: (prefill && prefill.fragile) || false,
    photo_url: '',
    dropoff_date: new Date().toISOString().split('T')[0],
    dropoff_time: '09:00 AM',
    expected_pickup_date: '',
    storage_reason: 'Travelling',
    payment_choice: 'mpesa_stk', // 'mpesa_stk' or 'counter'
    payment_type: 'full', // 'full' or 'deposit'
    terms_agreed: false
  });

  // Calculate default expected pickup (dropoff + prefill days or 2 days)
  useEffect(() => {
    const daysToAdd = (prefill && prefill.days) || 2;
    const d = new Date();
    d.setDate(d.getDate() + daysToAdd);
    setFormData(prev => ({
      ...prev,
      expected_pickup_date: d.toISOString().split('T')[0]
    }));
  }, [prefill]);

  // Pricing rates
  const rates = {
    small: { day: 150, week: 900, month: 3200 },
    medium: { day: 250, week: 1500, month: 5500 },
    large: { day: 400, week: 2400, month: 8800 },
    xlarge: { day: 750, week: 4500, month: 16000 }
  };

  // Duration in days
  const calculateDays = () => {
    if (!formData.dropoff_date || !formData.expected_pickup_date) return 1;
    const dDrop = new Date(formData.dropoff_date);
    const dPick = new Date(formData.expected_pickup_date);
    const diff = Math.ceil((dPick - dDrop) / (1000 * 60 * 60 * 24));
    return Math.max(1, diff);
  };

  const calculatedDays = calculateDays();

  // Price Calculation
  const calculateTotal = () => {
    const r = rates[formData.item_size] || rates.medium;
    const days = calculatedDays;
    const qty = Math.max(1, parseInt(formData.quantity) || 1);

    let unit = 0;
    if (days >= 30) {
      const months = Math.floor(days / 30);
      const rem = days % 30;
      unit = (months * r.month) + (rem * r.day);
    } else if (days >= 7) {
      const weeks = Math.floor(days / 7);
      const rem = days % 7;
      unit = (weeks * r.week) + (rem * r.day);
    } else {
      unit = days * r.day;
    }

    return unit * qty;
  };

  const totalCost = calculateTotal();
  const depositAmount = Math.ceil(totalCost * 0.5);

  // Completed Booking Details
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [mpesaPromptOpen, setMpesaPromptOpen] = useState(false);

  // Field handler
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Step 1 Validation
  const validateStep1 = () => {
    if (!formData.name.trim()) return 'Please enter your full name.';
    if (!formData.phone.trim() || formData.phone.length < 9) return 'Please enter a valid Kenyan phone number.';
    if (!formData.id_number.trim()) return 'Please enter your National ID or Passport number.';
    return '';
  };

  // Step 2 Validation
  const validateStep2 = () => {
    if (!formData.item_type) return 'Please select an item type.';
    if (formData.quantity < 1) return 'Quantity must be at least 1.';
    return '';
  };

  // Step 3 Validation
  const validateStep3 = () => {
    if (!formData.dropoff_date) return 'Drop-off date is required.';
    if (!formData.expected_pickup_date) return 'Expected pick-up date is required.';
    if (new Date(formData.expected_pickup_date) < new Date(formData.dropoff_date)) {
      return 'Pick-up date cannot be earlier than drop-off date.';
    }
    return '';
  };

  // Next Step handler
  const handleNext = () => {
    setErrorMsg('');
    if (currentStep === 1) {
      const err = validateStep1();
      if (err) { setErrorMsg(err); return; }
    } else if (currentStep === 2) {
      const err = validateStep2();
      if (err) { setErrorMsg(err); return; }
    } else if (currentStep === 3) {
      const err = validateStep3();
      if (err) { setErrorMsg(err); return; }
    }
    setCurrentStep(prev => prev + 1);
  };

  // Submit Booking handler
  const handleSubmitBooking = async (e) => {
    if (e) e.preventDefault();
    if (!formData.terms_agreed) {
      setErrorMsg('You must agree to the Terms and Conditions to proceed.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const payload = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        id_number: formData.id_number,
        item_type: formData.item_type,
        item_size: formData.item_size,
        quantity: parseInt(formData.quantity) || 1,
        description: formData.description,
        is_fragile: formData.is_fragile,
        photo_url: formData.photo_url,
        dropoff_date: formData.dropoff_date,
        dropoff_time: formData.dropoff_time,
        expected_pickup_date: formData.expected_pickup_date,
        storage_reason: formData.storage_reason,
        payment_choice: formData.payment_choice,
        payment_type: formData.payment_type,
        deposit_amount: depositAmount
      };

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create booking.');
      }

      setBookingSuccess({
        ...payload,
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

      // Celebration Confetti!
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {}

      setCurrentStep(5); // Move to confirmation step!
    } catch (err) {
      setErrorMsg(err.message || 'An error occurred while booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Page Title */}
      <div className="text-center mb-10">
        <span className="text-xs font-bold uppercase tracking-wider text-[#E75A2D] bg-[#E75A2D]/10 px-3 py-1 rounded-full">
          Safe Luggage Storage Mombasa
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-['Poppins'] text-[#0F2A4A] mt-2">
          {lang === 'sw' ? 'Weka Nafasi ya Uhifadhi' : 'Book Storage Service'}
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">
          {lang === 'sw'
            ? 'Jaza maelezo kwa hatua 5 rahisi. Lipa kupitia M-Pesa au kaunta ukifika.'
            : 'Fill in your details in 5 simple steps. Pay online with M-Pesa or at the counter.'}
        </p>
      </div>

      {/* STEP PROGRESS BAR */}
      <div className="mb-8">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 -z-0"></div>
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#E75A2D] transition-all duration-300 -z-0"
            style={{ width: `${((currentStep - 1) / 4) * 100}%` }}
          ></div>

          {[
            { num: 1, label: lang === 'sw' ? 'Mteja' : 'Customer' },
            { num: 2, label: lang === 'sw' ? 'Mzigo' : 'Items' },
            { num: 3, label: lang === 'sw' ? 'Tarehe' : 'Dates' },
            { num: 4, label: lang === 'sw' ? 'Malipo' : 'Payment' },
            { num: 5, label: lang === 'sw' ? 'Kamilisha' : 'Finish' }
          ].map((s) => (
            <div key={s.num} className="flex flex-col items-center z-10">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-sm ${
                  currentStep >= s.num
                    ? 'bg-[#E75A2D] text-white ring-4 ring-[#E75A2D]/20'
                    : 'bg-white text-gray-500 border-2 border-gray-300'
                }`}
              >
                {currentStep > s.num ? <CheckCircle className="w-5 h-5 text-white" /> : s.num}
              </div>
              <span className={`text-[11px] mt-1.5 font-medium hidden sm:inline ${
                currentStep >= s.num ? 'text-[#0F2A4A] font-bold' : 'text-gray-400'
              }`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ERROR ALERT */}
      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* FORM CARD CONTAINER */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden p-6 sm:p-10">
        {/* STEP 1: CUSTOMER DETAILS */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="border-b border-gray-100 pb-4">
              <h2 className="text-xl font-bold font-['Poppins'] text-[#0F2A4A] flex items-center gap-2">
                <User className="w-5 h-5 text-[#E75A2D]" />
                <span>{lang === 'sw' ? '1. Maelezo ya Mteja' : '1. Customer Contact Details'}</span>
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Required for safety verification and collection validation per Kenya storage regulations.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Full Name (Jina Kamili) *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Kiprono Cheruiyot"
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-[#E75A2D] focus:ring-1 focus:ring-[#E75A2D]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Phone Number (Safaricom / Airtel) *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. 0712 345 678"
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-[#E75A2D] focus:ring-1 focus:ring-[#E75A2D]"
                  required
                />
                <span className="text-[10px] text-gray-400">Used for booking SMS and M-Pesa STK push.</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  National ID / Passport Number *
                </label>
                <input
                  type="text"
                  name="id_number"
                  value={formData.id_number}
                  onChange={handleChange}
                  placeholder="e.g. 31289456 or PASS-12345"
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-[#E75A2D] focus:ring-1 focus:ring-[#E75A2D]"
                  required
                />
                <span className="text-[10px] text-gray-400">Required to safely verify owner upon item collection.</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. name@example.com"
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-[#E75A2D] focus:ring-1 focus:ring-[#E75A2D]"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={handleNext}
                className="bg-[#E75A2D] hover:bg-[#d0451b] text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider shadow flex items-center gap-2"
              >
                <span>{lang === 'sw' ? 'Endelea: Maelezo ya Mzigo' : 'Next: Luggage Details'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: ITEM INFORMATION */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="border-b border-gray-100 pb-4">
              <h2 className="text-xl font-bold font-['Poppins'] text-[#0F2A4A] flex items-center gap-2">
                <Luggage className="w-5 h-5 text-[#E75A2D]" />
                <span>{lang === 'sw' ? '2. Aina na Saizi ya Mzigo' : '2. Items & Baggage Details'}</span>
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Tell us about your items so we allocate the proper secure rack or bay.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Select Item Size *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { key: 'small', label: 'Small', desc: 'Backpack, handbag, small bag', price: 'KES 150/day' },
                    { key: 'medium', label: 'Medium', desc: 'Carry-on suitcase, medium box', price: 'KES 250/day' },
                    { key: 'large', label: 'Large', desc: 'Big suitcase, large box, trunk', price: 'KES 400/day' },
                    { key: 'xlarge', label: 'Extra Large', desc: 'Furniture, mattress, appliances', price: 'KES 750/day' }
                  ].map((s) => (
                    <button
                      key={s.key}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, item_size: s.key }))}
                      className={`p-3.5 rounded-2xl text-left border transition-all ${
                        formData.item_size === s.key
                          ? 'border-[#E75A2D] bg-[#E75A2D]/10 ring-1 ring-[#E75A2D]'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <strong className="text-sm font-bold text-[#0F2A4A]">{s.label}</strong>
                        <span className="text-xs font-bold text-[#E75A2D]">{s.price}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{s.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Item Category / Type
                  </label>
                  <select
                    name="item_type"
                    value={formData.item_type}
                    onChange={handleChange}
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-[#E75A2D]"
                  >
                    <option value="Travel Suitcase">Travel Suitcase (Sanduku)</option>
                    <option value="Backpack / Rucksack">Backpack / Daypack (Begi la mgongoni)</option>
                    <option value="Cardboard Boxes">Cardboard Boxes / Cartons (Katoni)</option>
                    <option value="Metal Trunk">Metal Student Trunk (Sanduku la bati)</option>
                    <option value="Mattress & Bedding">Mattress & Bedding (Godoro)</option>
                    <option value="Furniture / Appliances">Furniture / Household items (Fenicha)</option>
                    <option value="Other Belongings">Other Belongings</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Quantity of Items *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-[#E75A2D]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Item Description & Distinct Features
                </label>
                <textarea
                  rows="2"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="e.g. Navy blue Samsonite with yellow ribbon on handle, combination lock"
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-[#E75A2D]"
                ></textarea>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-1">
                <label className="flex items-center gap-2.5 text-xs text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_fragile"
                    checked={formData.is_fragile}
                    onChange={handleChange}
                    className="w-4 h-4 text-[#E75A2D] rounded border-gray-300 focus:ring-[#E75A2D]"
                  />
                  <span>⚠️ Mark as Fragile (Vitu vinavyoweza kuvunjika / electronics)</span>
                </label>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-gray-50 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="bg-[#E75A2D] hover:bg-[#d0451b] text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider shadow flex items-center gap-2"
              >
                <span>{lang === 'sw' ? 'Endelea: Tarehe na Saa' : 'Next: Dates & Schedule'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: DATES & REASON */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="border-b border-gray-100 pb-4">
              <h2 className="text-xl font-bold font-['Poppins'] text-[#0F2A4A] flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#E75A2D]" />
                <span>{lang === 'sw' ? '3. Tarehe za Uhifadhi' : '3. Dates & Schedule'}</span>
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                When will you bring the items and when do you expect to pick them up?
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Drop-off Date (Tarehe ya Kuleta) *
                </label>
                <input
                  type="date"
                  name="dropoff_date"
                  value={formData.dropoff_date}
                  onChange={handleChange}
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-[#E75A2D]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Expected Drop-off Time
                </label>
                <select
                  name="dropoff_time"
                  value={formData.dropoff_time}
                  onChange={handleChange}
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-[#E75A2D]"
                >
                  <option value="07:00 AM">07:00 AM (Early Arrival)</option>
                  <option value="09:00 AM">09:00 AM</option>
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="01:00 PM">01:00 PM</option>
                  <option value="03:00 PM">03:00 PM</option>
                  <option value="05:00 PM">05:00 PM</option>
                  <option value="07:30 PM">07:30 PM (Evening Arrival)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Expected Pick-up Date (Tarehe ya Kuchukua) *
                </label>
                <input
                  type="date"
                  name="expected_pickup_date"
                  value={formData.expected_pickup_date}
                  onChange={handleChange}
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-[#E75A2D]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Reason for Storage (Optional)
                </label>
                <select
                  name="storage_reason"
                  value={formData.storage_reason}
                  onChange={handleChange}
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-[#E75A2D]"
                >
                  <option value="House hunting">House hunting in Mombasa (Kusaka nyumba)</option>
                  <option value="Interview / Exams">Job interview / Exams (Usaili au mitihani)</option>
                  <option value="Travelling">Travelling / SGR layover (Kusafiri)</option>
                  <option value="Moving">Moving house / rentals (Kuhama makazi)</option>
                  <option value="Students">University semester recess (Mwanafunzi)</option>
                  <option value="Other">Other reason</option>
                </select>
              </div>
            </div>

            {/* Live calculation banner */}
            <div className="bg-[#0F2A4A] text-white p-4 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-xs text-amber-300 uppercase tracking-wider block">Duration & Rate</span>
                <span className="text-sm font-semibold">{calculatedDays} day(s) storage for {formData.quantity} item(s)</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-gray-300 block">Total Storage Cost</span>
                <span className="text-xl sm:text-2xl font-black text-amber-400">KES {totalCost.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-gray-50 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="bg-[#E75A2D] hover:bg-[#d0451b] text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider shadow flex items-center gap-2"
              >
                <span>{lang === 'sw' ? 'Endelea: Chaguo la Malipo' : 'Next: Payment Selection'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: PAYMENT SELECTION */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="border-b border-gray-100 pb-4">
              <h2 className="text-xl font-bold font-['Poppins'] text-[#0F2A4A] flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#E75A2D]" />
                <span>{lang === 'sw' ? '4. Njia ya Malipo' : '4. Payment Options'}</span>
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Choose how you want to pay: online via M-Pesa STK push or at our counter on drop-off.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Option 1: M-Pesa STK */}
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, payment_choice: 'mpesa_stk' }))}
                className={`p-5 rounded-2xl text-left border transition-all ${
                  formData.payment_choice === 'mpesa_stk'
                    ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-sm text-emerald-800">Pay with M-Pesa (STK Push)</span>
                  <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">Fastest</span>
                </div>
                <p className="text-xs text-gray-600">
                  Instant prompt sent to your Safaricom line <strong>{formData.phone || '07...'}</strong>. Enter your PIN on your phone.
                </p>
              </button>

              {/* Option 2: Pay at Counter */}
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, payment_choice: 'counter' }))}
                className={`p-5 rounded-2xl text-left border transition-all ${
                  formData.payment_choice === 'counter'
                    ? 'border-[#0F2A4A] bg-blue-50/50 ring-2 ring-[#0F2A4A]'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-sm text-[#0F2A4A]">Pay on Drop-off</span>
                  <span className="bg-gray-100 text-gray-700 text-[10px] font-bold px-2 py-0.5 rounded">Counter</span>
                </div>
                <p className="text-xs text-gray-600">
                  Pay cash or via Till Number / M-Pesa when you hand over your items at Moi Avenue.
                </p>
              </button>
            </div>

            {/* Full payment or deposit selection */}
            {formData.payment_choice === 'mpesa_stk' && (
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                  Select Payment Amount
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer ${
                    formData.payment_type === 'full' ? 'border-[#E75A2D] bg-white font-bold' : 'border-gray-200'
                  }`}>
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="payment_type"
                        value="full"
                        checked={formData.payment_type === 'full'}
                        onChange={handleChange}
                        className="text-[#E75A2D] focus:ring-[#E75A2D]"
                      />
                      <span className="text-xs">Full Payment</span>
                    </div>
                    <span className="text-sm font-black text-[#0F2A4A]">KES {totalCost.toLocaleString()}</span>
                  </label>

                  <label className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer ${
                    formData.payment_type === 'deposit' ? 'border-[#E75A2D] bg-white font-bold' : 'border-gray-200'
                  }`}>
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="payment_type"
                        value="deposit"
                        checked={formData.payment_type === 'deposit'}
                        onChange={handleChange}
                        className="text-[#E75A2D] focus:ring-[#E75A2D]"
                      />
                      <span className="text-xs">50% Deposit</span>
                    </div>
                    <span className="text-sm font-black text-[#0F2A4A]">KES {depositAmount.toLocaleString()}</span>
                  </label>
                </div>
              </div>
            )}

            {/* Terms and conditions agreement checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-3 text-xs text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  name="terms_agreed"
                  checked={formData.terms_agreed}
                  onChange={handleChange}
                  className="w-4 h-4 mt-0.5 text-[#E75A2D] rounded border-gray-300 focus:ring-[#E75A2D]"
                  required
                />
                <span className="leading-relaxed">
                  I agree to the <button type="button" onClick={() => setView('terms')} className="text-[#E75A2D] font-bold underline">Terms & Conditions</button>, including the late collection fee policy (KES 100/day) and storage liability declaration under Kenyan law.
                </span>
              </label>
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-gray-50 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={handleSubmitBooking}
                disabled={isSubmitting || !formData.terms_agreed}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-2"
              >
                {isSubmitting ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>{formData.payment_choice === 'mpesa_stk' ? 'Confirm & Trigger M-Pesa STK' : 'Confirm Booking'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: CONFIRMATION & QR CODE */}
        {currentStep === 5 && bookingSuccess && (
          <div className="space-y-6 text-center animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                Booking Confirmed • Imethibitishwa!
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-['Poppins'] text-[#0F2A4A] mt-2">
                Thank You, {bookingSuccess.customer_name}!
              </h2>
              <p className="text-xs text-gray-600 max-w-md mx-auto mt-1">
                Your belongings reservation has been recorded. Present this QR code or booking reference at our counter on Moi Avenue.
              </p>
            </div>

            {/* QR Card & Ref */}
            <div className="bg-[#FAF8F5] border-2 border-dashed border-amber-300 rounded-3xl p-6 max-w-md mx-auto space-y-4">
              <div className="text-xs text-gray-500 uppercase tracking-wider">
                Booking Reference
              </div>
              <div className="text-2xl sm:text-3xl font-black font-['Poppins'] text-[#0F2A4A] tracking-wider">
                {bookingSuccess.booking_ref}
              </div>

              {bookingSuccess.qrCodeDataUrl && (
                <div className="flex justify-center">
                  <img
                    src={bookingSuccess.qrCodeDataUrl}
                    alt="Booking QR Code"
                    className="w-40 h-40 border border-gray-200 p-2 bg-white rounded-2xl shadow-sm"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 text-xs text-gray-700 pt-2 border-t border-gray-200">
                <div className="text-left">
                  <span className="text-gray-400 block text-[10px] uppercase">Drop-off:</span>
                  <strong>{bookingSuccess.dropoff_date} ({bookingSuccess.dropoff_time})</strong>
                </div>
                <div className="text-right">
                  <span className="text-gray-400 block text-[10px] uppercase">Pick-up Due:</span>
                  <strong>{bookingSuccess.expected_pickup_date}</strong>
                </div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-gray-200 flex justify-between items-center text-xs">
                <span>Payment Status:</span>
                <span className={`font-bold px-2 py-0.5 rounded uppercase text-[10px] ${
                  bookingSuccess.payment_status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {bookingSuccess.payment_status} (Paid KES {bookingSuccess.paid_amount})
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowReceiptModal(true)}
                className="bg-[#0F2A4A] hover:bg-[#1a406c] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print Receipt & Luggage Tag</span>
              </button>

              <a
                href={`https://wa.me/254712345678?text=${encodeURIComponent(
                  `Habari Mzingo Point! I just booked storage. Ref: ${bookingSuccess.booking_ref}. Customer: ${bookingSuccess.customer_name}`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="bg-[#25D366] hover:bg-[#20ba59] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Send to WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={() => { setView('track'); window.scrollTo(0, 0); }}
                className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-50"
              >
                Track My Booking
              </button>
            </div>
          </div>
        )}
      </div>

      {/* RECEIPT MODAL */}
      {showReceiptModal && bookingSuccess && (
        <ReceiptPrint
          booking={bookingSuccess}
          qrCodeDataUrl={bookingSuccess.qrCodeDataUrl}
          onClose={() => setShowReceiptModal(false)}
        />
      )}
    </div>
  );
}
