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
  AlertCircle,
  QrCode,
  Tag,
  Package,
  Layers,
  MapPin,
  Lock
} from 'lucide-react';
import { translations } from '../translations';
import ReceiptPrint from '../components/ReceiptPrint';
import { DhowIcon, TagGrommet, SwahiliPatternBg } from '../components/SwahiliMotifs';

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
    window.scrollTo({ top: 100, behavior: 'smooth' });
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

      // Celebration Confetti
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#FF6B4A', '#13B5B1', '#F6EBD9', '#0B2545']
        });
      } catch (err) {}

      setCurrentStep(5);
      window.scrollTo({ top: 60, behavior: 'smooth' });
    } catch (err) {
      setErrorMsg(err.message || 'An error occurred while booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { num: 1, label: lang === 'sw' ? 'Mteja' : 'Customer', sub: 'ID & Phone' },
    { num: 2, label: lang === 'sw' ? 'Mzigo' : 'Luggage', sub: 'Size & Type' },
    { num: 3, label: lang === 'sw' ? 'Tarehe' : 'Dates', sub: 'Drop & Pick' },
    { num: 4, label: lang === 'sw' ? 'Malipo' : 'Payment', sub: 'M-Pesa / Cash' },
    { num: 5, label: lang === 'sw' ? 'Tiketi' : 'Manifest', sub: 'QR Tag' }
  ];

  return (
    <div className="min-h-screen py-8 sm:py-16 px-3 sm:px-6 lg:px-8 relative bg-gradient-to-b from-[#F6EBD9]/40 via-white to-[#F6EBD9]/20">
      <div className="max-w-4xl mx-auto">

        {/* Header / Boarding Pass Title */}
        <div className="text-center mb-6 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-[#FF6B4A]/10 border border-[#FF6B4A]/20 text-[#FF6B4A] text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-2 sm:mb-3">
            <Tag className="w-3.5 h-3.5" />
            <span>{lang === 'sw' ? 'Manifesti ya Uhifadhi • Mombasa' : 'Luggage Manifest • Mombasa Island'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black font-['Syne',sans-serif] text-[#0B2545] tracking-tight">
            {lang === 'sw' ? 'Hifadhi Mzigo Wako' : 'Book Your Storage Bay'}
          </h1>
          <p className="text-xs sm:text-base text-gray-600 max-w-xl mx-auto mt-1 sm:mt-2 px-2">
            {lang === 'sw'
              ? 'Weka nafasi kwa hatua rahisi. Mzigo wako hufungiwa na kuangaliwa 24/7 Moi Avenue.'
              : 'Issue your luggage tag in minutes. CCTV secured, lockable units on Moi Avenue.'}
          </p>
        </div>

        {/* STEPPER PROGRESS BAR */}
        <div className="mb-6 sm:mb-10">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl p-3 sm:p-6 border border-gray-200/80 shadow-sm">
            <div className="flex items-center justify-between relative">
              {/* Connector line */}
              <div className="absolute left-4 right-4 sm:left-6 sm:right-6 top-4 sm:top-5 h-0.5 bg-gray-200 -z-0"></div>
              <div
                className="absolute left-4 sm:left-6 top-4 sm:top-5 h-0.5 bg-gradient-to-r from-[#FF6B4A] to-[#13B5B1] transition-all duration-500 -z-0"
                style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
              ></div>

              {steps.map((s) => {
                const isPassed = currentStep > s.num;
                const isCurrent = currentStep === s.num;
                return (
                  <div key={s.num} className="flex flex-col items-center z-10 flex-1 min-w-0">
                    <button
                      type="button"
                      disabled={s.num > currentStep}
                      onClick={() => s.num < currentStep && setCurrentStep(s.num)}
                      className={`w-8 h-8 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-300 ${
                        isPassed
                          ? 'bg-[#13B5B1] text-white shadow-md'
                          : isCurrent
                          ? 'bg-[#FF6B4A] text-white ring-2 sm:ring-4 ring-[#FF6B4A]/25 shadow-lg'
                          : 'bg-white text-gray-400 border border-gray-200'
                      }`}
                      aria-label={`Step ${s.num}: ${s.label}`}
                    >
                      {isPassed ? <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" /> : s.num}
                    </button>
                    <span className={`text-[10px] sm:text-xs mt-1.5 sm:mt-2 font-bold transition-colors truncate max-w-[60px] sm:max-w-none text-center ${
                      isCurrent ? 'text-[#FF6B4A]' : isPassed ? 'text-[#0B2545]' : 'text-gray-400'
                    }`}>
                      {s.label}
                    </span>
                    <span className="text-[9px] text-gray-400 hidden sm:block">
                      {s.sub}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ERROR MESSAGE */}
        {errorMsg && (
          <div className="mb-6 p-3.5 sm:p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-center gap-3 shadow-xs">
            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
            <span className="font-medium">{errorMsg}</span>
          </div>
        )}

        {/* MAIN BOARDING PASS CARD CONTAINER */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200 shadow-xl overflow-hidden relative">
          {/* Top Boarding Pass Header Strip */}
          <div className="bg-[#0B2545] text-white px-4 sm:px-8 py-3.5 sm:py-4 flex flex-wrap items-center justify-between gap-2 border-b border-white/10">
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white/10 flex items-center justify-center text-[#13B5B1] shrink-0">
                <DhowIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="truncate">
                <span className="text-[9px] sm:text-[10px] text-amber-300 font-mono tracking-widest uppercase block">
                  MZINGO MANIFEST № 2026-MSA
                </span>
                <span className="text-xs sm:text-sm font-black font-['Syne'] tracking-wide truncate block">
                  MOMBASA ISLAND FACILITY • MOI AVE
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-white/80 font-mono shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-[10px] sm:text-xs">LIVE DESK</span>
            </div>
          </div>

          <div className="p-4 sm:p-8 lg:p-10">

            {/* STEP 1: CUSTOMER CONTACT DETAILS */}
            {currentStep === 1 && (
              <div className="space-y-5 sm:space-y-6 animate-in fade-in duration-300">
                <div className="border-b border-gray-100 pb-3 sm:pb-4">
                  <div className="flex items-center gap-2 text-[#FF6B4A] mb-1">
                    <User className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-xs font-bold uppercase tracking-wider">Step 1 of 4</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black font-['Syne',sans-serif] text-[#0B2545]">
                    {lang === 'sw' ? 'Maelezo Yako Binafsi' : 'Primary Customer Information'}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    Required by Kenya storage bailment laws so only authorized individuals can collect your bags.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#0B2545] uppercase tracking-wider">
                      Full Legal Name (Jina Kamili) *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Kiprono Cheruiyot"
                      className="w-full text-base sm:text-sm px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:border-[#13B5B1] focus:ring-2 focus:ring-[#13B5B1]/20 transition-all font-medium min-h-[44px]"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#0B2545] uppercase tracking-wider">
                      Phone Number (Safaricom / Airtel) *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="e.g. 0712 345 678"
                      className="w-full text-base sm:text-sm px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:border-[#13B5B1] focus:ring-2 focus:ring-[#13B5B1]/20 transition-all font-medium min-h-[44px]"
                      required
                    />
                    <span className="text-[10px] text-gray-400 block">We send your instant digital QR slip and M-Pesa STK push here.</span>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#0B2545] uppercase tracking-wider">
                      National ID / Passport Number *
                    </label>
                    <input
                      type="text"
                      name="id_number"
                      value={formData.id_number}
                      onChange={handleChange}
                      placeholder="e.g. 31289456 or PASS-12345"
                      className="w-full text-base sm:text-sm px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:border-[#13B5B1] focus:ring-2 focus:ring-[#13B5B1]/20 transition-all font-medium min-h-[44px]"
                      required
                    />
                    <span className="text-[10px] text-gray-400 block">Checked at the counter when you come to claim your bags.</span>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#0B2545] uppercase tracking-wider">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. kiprono@gmail.com"
                      className="w-full text-base sm:text-sm px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:border-[#13B5B1] focus:ring-2 focus:ring-[#13B5B1]/20 transition-all font-medium min-h-[44px]"
                    />
                    <span className="text-[10px] text-gray-400 block">Receive an extra PDF receipt copy in your inbox.</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end">
                  <button
                    type="button"
                    onClick={handleNext}
                    className="w-full sm:w-auto bg-[#FF6B4A] hover:bg-[#e85535] text-white px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group min-h-[44px]"
                  >
                    <span>{lang === 'sw' ? 'Endelea: Maelezo ya Mzigo' : 'Next: Luggage Details'}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: LUGGAGE SELECTION & ATTRIBUTES */}
            {currentStep === 2 && (
              <div className="space-y-5 sm:space-y-6 animate-in fade-in duration-300">
                <div className="border-b border-gray-100 pb-3 sm:pb-4">
                  <div className="flex items-center gap-2 text-[#FF6B4A] mb-1">
                    <Luggage className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-xs font-bold uppercase tracking-wider">Step 2 of 4</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black font-['Syne',sans-serif] text-[#0B2545]">
                    {lang === 'sw' ? 'Chagua Saizi na Aina ya Mzigo' : 'Luggage Size & Characteristics'}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    We assign a dedicated numbered locker, rack bay, or reinforced pallet space based on your selection.
                  </p>
                </div>

                {/* Size options */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[#0B2545] uppercase tracking-wider">
                    Select Size Category *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
                    {[
                      { key: 'small', label: 'Small Bag', tag: 'Handbag / Daypack', desc: 'Backpacks, laptop bags, daypacks, handbags', price: 'KES 150', unit: '/day' },
                      { key: 'medium', label: 'Medium Suitcase', tag: 'Most Popular', desc: 'Standard cabin trolley, medium box, duffel', price: 'KES 250', unit: '/day' },
                      { key: 'large', label: 'Large Trunk', tag: 'Relocation & Long Trips', desc: 'Big 28" suitcase, metal trunk, heavy carton', price: 'KES 400', unit: '/day' },
                      { key: 'xlarge', label: 'Extra Large / Bulky', tag: 'Oversized', desc: 'Mattress, dismantled furniture, appliances', price: 'KES 750', unit: '/day' }
                    ].map((s) => {
                      const isSelected = formData.item_size === s.key;
                      return (
                        <div
                          key={s.key}
                          onClick={() => setFormData(prev => ({ ...prev, item_size: s.key }))}
                          className={`p-3.5 sm:p-4 rounded-2xl cursor-pointer transition-all border relative ${
                            isSelected
                              ? 'border-[#FF6B4A] bg-[#FF6B4A]/5 ring-2 ring-[#FF6B4A]/30 shadow-md'
                              : 'border-gray-200 hover:border-gray-300 bg-gray-50/30'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <div>
                              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#FF6B4A] block">
                                {s.tag}
                              </span>
                              <strong className="text-sm sm:text-base font-black font-['Syne'] text-[#0B2545]">
                                {s.label}
                              </strong>
                            </div>
                            <div className="text-right">
                              <span className="text-sm sm:text-base font-black font-['Syne'] text-[#0B2545]">
                                {s.price}
                              </span>
                              <span className="text-[10px] text-gray-500 block font-mono">{s.unit}</span>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{s.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 pt-1">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#0B2545] uppercase tracking-wider">
                      Item Category / Type *
                    </label>
                    <select
                      name="item_type"
                      value={formData.item_type}
                      onChange={handleChange}
                      className="w-full text-base sm:text-sm px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:border-[#13B5B1] focus:ring-2 focus:ring-[#13B5B1]/20 font-medium min-h-[44px]"
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

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#0B2545] uppercase tracking-wider">
                      Quantity of Items *
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      className="w-full text-base sm:text-sm px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:border-[#13B5B1] focus:ring-2 focus:ring-[#13B5B1]/20 font-bold min-h-[44px]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#0B2545] uppercase tracking-wider">
                    Item Description & Distinguishing Features
                  </label>
                  <textarea
                    rows="2"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="e.g. Navy blue Delsey suitcase with yellow ribbon on handle, lock code 449"
                    className="w-full text-base sm:text-sm px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:border-[#13B5B1] focus:ring-2 focus:ring-[#13B5B1]/20 font-medium"
                  ></textarea>
                </div>

                <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="is_fragile"
                      checked={formData.is_fragile}
                      onChange={handleChange}
                      className="w-5 h-5 text-[#FF6B4A] rounded border-gray-300 focus:ring-[#FF6B4A]"
                    />
                    <div>
                      <strong className="text-xs font-bold text-[#0B2545] block">
                        Mark as Fragile / Delicate (Kinaweza kuvunjika)
                      </strong>
                      <span className="text-[11px] text-gray-600 block">
                        Our attendants will store this on a padded lower shelf with top-level priority tag.
                      </span>
                    </div>
                  </label>
                </div>

                <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="w-full sm:w-auto px-6 py-3 border border-gray-200 text-gray-700 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-gray-50 flex items-center justify-center gap-2 min-h-[44px]"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="w-full sm:w-auto bg-[#FF6B4A] hover:bg-[#e85535] text-white px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group min-h-[44px]"
                  >
                    <span>{lang === 'sw' ? 'Endelea: Tarehe na Saa' : 'Next: Dates & Schedule'}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: DATES, SCHEDULE & DURATION */}
            {currentStep === 3 && (
              <div className="space-y-5 sm:space-y-6 animate-in fade-in duration-300">
                <div className="border-b border-gray-100 pb-3 sm:pb-4">
                  <div className="flex items-center gap-2 text-[#FF6B4A] mb-1">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-xs font-bold uppercase tracking-wider">Step 3 of 4</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black font-['Syne',sans-serif] text-[#0B2545]">
                    {lang === 'sw' ? 'Tarehe na Ratiba ya Uhifadhi' : 'Drop-off & Expected Collection'}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    Facility opens from 6:30 AM to 8:30 PM daily. You can extend online anytime.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#0B2545] uppercase tracking-wider">
                      Drop-off Date (Tarehe ya Kuleta) *
                    </label>
                    <input
                      type="date"
                      name="dropoff_date"
                      value={formData.dropoff_date}
                      onChange={handleChange}
                      className="w-full text-base sm:text-sm px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:border-[#13B5B1] focus:ring-2 focus:ring-[#13B5B1]/20 font-bold text-[#0B2545] min-h-[44px]"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#0B2545] uppercase tracking-wider">
                      Drop-off Time Window
                    </label>
                    <select
                      name="dropoff_time"
                      value={formData.dropoff_time}
                      onChange={handleChange}
                      className="w-full text-base sm:text-sm px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:border-[#13B5B1] focus:ring-2 focus:ring-[#13B5B1]/20 font-medium min-h-[44px]"
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

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#0B2545] uppercase tracking-wider">
                      Expected Pick-up Date (Tarehe ya Kuchukua) *
                    </label>
                    <input
                      type="date"
                      name="expected_pickup_date"
                      value={formData.expected_pickup_date}
                      onChange={handleChange}
                      className="w-full text-base sm:text-sm px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:border-[#13B5B1] focus:ring-2 focus:ring-[#13B5B1]/20 font-bold text-[#0B2545] min-h-[44px]"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#0B2545] uppercase tracking-wider">
                      Reason for Storage (Optional)
                    </label>
                    <select
                      name="storage_reason"
                      value={formData.storage_reason}
                      onChange={handleChange}
                      className="w-full text-base sm:text-sm px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:border-[#13B5B1] focus:ring-2 focus:ring-[#13B5B1]/20 font-medium min-h-[44px]"
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

                {/* Live Cost calculation summary banner */}
                <div className="p-4 sm:p-6 rounded-2xl bg-[#0B2545] text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 border border-[#13B5B1]/30">
                  <div className="space-y-0.5 sm:space-y-1">
                    <span className="text-[10px] sm:text-[11px] text-[#13B5B1] font-mono tracking-wider uppercase font-bold">
                      Calculated Duration & Rate
                    </span>
                    <div className="text-sm sm:text-lg font-bold">
                      {calculatedDays} day(s) storage for {formData.quantity} {formData.item_size} item(s)
                    </div>
                    <span className="text-xs text-gray-300 block">
                      Includes 24/7 CCTV surveillance, physical lock, and check-in tag.
                    </span>
                  </div>

                  <div className="sm:text-right bg-white/10 sm:bg-transparent p-3 sm:p-0 rounded-xl w-full sm:w-auto">
                    <span className="text-[10px] sm:text-[11px] text-gray-300 block uppercase font-mono">Estimated Total</span>
                    <span className="text-xl sm:text-3xl font-black font-['Syne'] text-amber-400">
                      KES {totalCost.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="w-full sm:w-auto px-6 py-3 border border-gray-200 text-gray-700 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-gray-50 flex items-center justify-center gap-2 min-h-[44px]"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="w-full sm:w-auto bg-[#FF6B4A] hover:bg-[#e85535] text-white px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group min-h-[44px]"
                  >
                    <span>{lang === 'sw' ? 'Endelea: Chaguo la Malipo' : 'Next: Payment Selection'}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: PAYMENT OPTIONS & CONFIRMATION TRIGGER */}
            {currentStep === 4 && (
              <div className="space-y-5 sm:space-y-6 animate-in fade-in duration-300">
                <div className="border-b border-gray-100 pb-3 sm:pb-4">
                  <div className="flex items-center gap-2 text-[#FF6B4A] mb-1">
                    <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-xs font-bold uppercase tracking-wider">Step 4 of 4</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black font-['Syne',sans-serif] text-[#0B2545]">
                    {lang === 'sw' ? 'Chagua Njia ya Kulipa' : 'Select Payment Method'}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    Pay seamlessly with instant Safaricom M-Pesa STK push or pay cash/M-Pesa at our counter on drop-off.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                  {/* Option A: M-Pesa STK */}
                  <div
                    onClick={() => setFormData(prev => ({ ...prev, payment_choice: 'mpesa_stk' }))}
                    className={`p-4 sm:p-5 rounded-2xl cursor-pointer transition-all border ${
                      formData.payment_choice === 'mpesa_stk'
                        ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500 shadow-md'
                        : 'border-gray-200 hover:border-gray-300 bg-gray-50/30'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1.5 sm:mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                        <strong className="text-sm font-bold text-emerald-950">Pay with M-Pesa (STK Push)</strong>
                      </div>
                      <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                        Instant
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Instant PIN prompt pops up directly on your Safaricom phone <strong>{formData.phone || '07...'}</strong>. Zero transaction delay.
                    </p>
                  </div>

                  {/* Option B: Pay at Counter */}
                  <div
                    onClick={() => setFormData(prev => ({ ...prev, payment_choice: 'counter' }))}
                    className={`p-4 sm:p-5 rounded-2xl cursor-pointer transition-all border ${
                      formData.payment_choice === 'counter'
                        ? 'border-[#0B2545] bg-[#0B2545]/5 ring-2 ring-[#0B2545] shadow-md'
                        : 'border-gray-200 hover:border-gray-300 bg-gray-50/30'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1.5 sm:mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#0B2545]"></span>
                        <strong className="text-sm font-bold text-[#0B2545]">Pay on Drop-off (Counter)</strong>
                      </div>
                      <span className="bg-gray-100 text-gray-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                        On Arrival
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Pay cash or Lipa na M-Pesa Buy Goods Till when you bring your items to our Moi Avenue counter.
                    </p>
                  </div>
                </div>

                {/* If M-Pesa chosen: full vs deposit */}
                {formData.payment_choice === 'mpesa_stk' && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-[#F6EBD9]/40 border border-[#F6EBD9] space-y-3">
                    <span className="text-xs font-bold text-[#0B2545] uppercase tracking-wider block">
                      Choose Payment Breakdown
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                      <label className={`p-3.5 sm:p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        formData.payment_type === 'full' ? 'border-[#FF6B4A] bg-white ring-2 ring-[#FF6B4A]/20 shadow-xs' : 'border-gray-200 bg-white/70'
                      }`}>
                        <div className="flex items-center gap-2.5">
                          <input
                            type="radio"
                            name="payment_type"
                            value="full"
                            checked={formData.payment_type === 'full'}
                            onChange={handleChange}
                            className="text-[#FF6B4A] focus:ring-[#FF6B4A]"
                          />
                          <div>
                            <span className="text-xs font-bold text-[#0B2545] block">Full Payment (100%)</span>
                            <span className="text-[10px] text-gray-500">Zero balance due at pick-up</span>
                          </div>
                        </div>
                        <span className="text-sm sm:text-base font-black font-['Syne'] text-[#0B2545]">
                          KES {totalCost.toLocaleString()}
                        </span>
                      </label>

                      <label className={`p-3.5 sm:p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        formData.payment_type === 'deposit' ? 'border-[#FF6B4A] bg-white ring-2 ring-[#FF6B4A]/20 shadow-xs' : 'border-gray-200 bg-white/70'
                      }`}>
                        <div className="flex items-center gap-2.5">
                          <input
                            type="radio"
                            name="payment_type"
                            value="deposit"
                            checked={formData.payment_type === 'deposit'}
                            onChange={handleChange}
                            className="text-[#FF6B4A] focus:ring-[#FF6B4A]"
                          />
                          <div>
                            <span className="text-xs font-bold text-[#0B2545] block">50% Advance Deposit</span>
                            <span className="text-[10px] text-gray-500">Remaining KES {depositAmount.toLocaleString()} upon pickup</span>
                          </div>
                        </div>
                        <span className="text-sm sm:text-base font-black font-['Syne'] text-[#0B2545]">
                          KES {depositAmount.toLocaleString()}
                        </span>
                      </label>
                    </div>
                  </div>
                )}

                {/* Terms and conditions agreement checkbox */}
                <div className="p-3.5 sm:p-4 rounded-2xl border border-gray-200 bg-gray-50/50">
                  <label className="flex items-start gap-3 text-xs text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      name="terms_agreed"
                      checked={formData.terms_agreed}
                      onChange={handleChange}
                      className="w-4 h-4 mt-0.5 text-[#FF6B4A] rounded border-gray-300 focus:ring-[#FF6B4A]"
                      required
                    />
                    <span className="leading-relaxed">
                      I accept the <button type="button" onClick={() => setView('terms')} className="text-[#FF6B4A] font-bold underline">Terms & Conditions of Storage</button>, including the standard late collection fee policy (KES 100/day after scheduled pickup) and bailment safety regulations in Mombasa.
                    </span>
                  </label>
                </div>

                <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="w-full sm:w-auto px-6 py-3 border border-gray-200 text-gray-700 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-gray-50 flex items-center justify-center gap-2 min-h-[44px]"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSubmitBooking}
                    disabled={isSubmitting || !formData.terms_agreed}
                    className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 min-h-[44px]"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        <span>Confirming Storage...</span>
                      </span>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span>{formData.payment_choice === 'mpesa_stk' ? 'Confirm & Trigger M-Pesa STK' : 'Complete & Generate Tag'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 5: BOARDING PASS MANIFEST CONFIRMATION & QR */}
            {currentStep === 5 && bookingSuccess && (
              <div className="space-y-6 sm:space-y-8 text-center animate-in zoom-in-95 duration-500">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12" />
                </div>

                <div>
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Booking Confirmed • Imethibitishwa!</span>
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-black font-['Syne',sans-serif] text-[#0B2545] mt-2">
                    Karibu Sana, {bookingSuccess.customer_name}!
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto mt-1 px-2">
                    Your luggage tag is registered in the Mombasa storage desk. Present your reference code or digital QR slip on arrival.
                  </p>
                </div>

                {/* BOARDING PASS LUGGAGE TAG CONTAINER */}
                <div className="max-w-md mx-auto bg-gradient-to-b from-[#F6EBD9] via-white to-[#F6EBD9] rounded-3xl border-2 border-[#0B2545]/20 shadow-2xl overflow-hidden relative text-left">
                  {/* Top punch hole grommet */}
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-white border-2 border-[#0B2545] flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#0B2545]/30"></div>
                  </div>

                  <div className="p-5 sm:p-6 pt-9 sm:pt-10 border-b border-dashed border-gray-300">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-gray-500">MZINGO POINT MSA</span>
                      <span className="text-[10px] font-mono font-bold bg-[#FF6B4A] text-white px-2 py-0.5 rounded">CLAIM TAG</span>
                    </div>

                    <div className="text-xs text-gray-500 uppercase tracking-wider">Reference Code</div>
                    <div className="text-xl sm:text-3xl font-black font-mono tracking-widest text-[#0B2545] truncate">
                      {bookingSuccess.booking_ref}
                    </div>
                  </div>

                  {/* QR Code section */}
                  {bookingSuccess.qrCodeDataUrl && (
                    <div className="p-4 sm:p-6 flex flex-col items-center bg-white">
                      <img
                        src={bookingSuccess.qrCodeDataUrl}
                        alt="Booking QR Code"
                        className="w-36 h-36 sm:w-44 sm:h-44 border-2 border-gray-100 p-2 rounded-2xl shadow-sm bg-white"
                      />
                      <span className="text-[10px] font-mono text-gray-400 mt-2">Scan at Moi Avenue Counter to check-in/out</span>
                    </div>
                  )}

                  {/* Perforation divider */}
                  <div className="relative h-6 flex items-center justify-between px-[-12px] bg-white">
                    <div className="w-5 h-5 rounded-full bg-gray-100 -ml-2.5 border border-gray-300"></div>
                    <div className="border-b-2 border-dashed border-gray-300 w-full"></div>
                    <div className="w-5 h-5 rounded-full bg-gray-100 -mr-2.5 border border-gray-300"></div>
                  </div>

                  {/* Details grid */}
                  <div className="p-5 sm:p-6 bg-white/90 space-y-3 text-xs text-gray-700">
                    <div className="grid grid-cols-2 gap-3 pb-3 border-b border-gray-100">
                      <div>
                        <span className="text-[10px] font-mono text-gray-400 uppercase block">Drop-off:</span>
                        <strong className="text-[#0B2545]">{bookingSuccess.dropoff_date}</strong>
                        <span className="text-[10px] text-gray-500 block">{bookingSuccess.dropoff_time}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-mono text-gray-400 uppercase block">Expected Pickup:</span>
                        <strong className="text-[#0B2545]">{bookingSuccess.expected_pickup_date}</strong>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-1">
                      <span className="text-xs text-gray-600">Payment Status:</span>
                      <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full uppercase ${
                        bookingSuccess.payment_status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {bookingSuccess.payment_status} (Paid KES {bookingSuccess.paid_amount})
                      </span>
                    </div>

                    {bookingSuccess.balance_amount > 0 && (
                      <div className="flex justify-between items-center text-xs text-rose-700 font-bold bg-rose-50 p-2.5 rounded-xl">
                        <span>Balance Due:</span>
                        <span>KES {bookingSuccess.balance_amount.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowReceiptModal(true)}
                    className="w-full sm:w-auto bg-[#0B2545] hover:bg-[#163a63] text-white px-6 py-3.5 rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-2 transition-all min-h-[44px]"
                  >
                    <Printer className="w-4 h-4 text-[#13B5B1]" />
                    <span>Print Receipt & Tag</span>
                  </button>

                  <a
                    href={`https://wa.me/254712345678?text=${encodeURIComponent(
                      `Habari Mzingo Point! I just booked storage. Ref: ${bookingSuccess.booking_ref}. Customer: ${bookingSuccess.customer_name}. Dropoff: ${bookingSuccess.dropoff_date}`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-auto bg-[#25D366] hover:bg-[#20ba59] text-white px-6 py-3.5 rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-2 transition-all min-h-[44px]"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Send to WhatsApp</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => { setView('track'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="w-full sm:w-auto px-6 py-3.5 border border-gray-300 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-50 transition-all min-h-[44px]"
                  >
                    Track Live Booking
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

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
