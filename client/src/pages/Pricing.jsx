import React, { useState } from 'react';
import { Calculator, Check, ArrowRight, ShieldCheck, AlertCircle, Info, Luggage } from 'lucide-react';
import { translations } from '../translations';

export default function Pricing({ lang, setView, setBookingPrefill }) {
  const t = translations[lang];

  // Pricing rates
  const rates = {
    small: {
      name: "Small Luggage",
      swName: "Mzigo Mdogo",
      examples: "Backpack, handbag, laptop bag, document briefcase",
      swExamples: "Begi la mgongoni, mkoba, begi la laptop",
      day: 150,
      week: 900,
      month: 3200,
      popular: false,
      tag: "Ideal for interviews & exams"
    },
    medium: {
      name: "Medium Luggage",
      swName: "Mzigo wa Kati",
      examples: "Carry-on trolley suitcase, medium cardboard box, duffel",
      swExamples: "Sanduku la kawaida la magurudumu, katoni ya wastani",
      day: 250,
      week: 1500,
      month: 5500,
      popular: true,
      tag: "Most popular for travellers"
    },
    large: {
      name: "Large Luggage",
      swName: "Mzigo Mkubwa",
      examples: "Big 28-inch suitcase, large moving box, metal trunk, heavy duffel",
      swExamples: "Sanduku kubwa la nguo, katoni kubwa, sanduku la bati",
      day: 400,
      week: 2400,
      month: 8800,
      popular: false,
      tag: "Great for movers & tourists"
    },
    xlarge: {
      name: "Extra Large / Bulky",
      swName: "Mzigo Mkubwa Sana / Fenicha",
      examples: "Mattress, disassembled furniture, appliances, bulk inventory",
      swExamples: "Godoro, fenicha iliyofunguliwa, vyombo vya nyumbani",
      day: 750,
      week: 4500,
      month: 16000,
      popular: false,
      tag: "Students & home relocations"
    }
  };

  // Calculator State
  const [calcSize, setCalcSize] = useState('medium');
  const [calcQty, setCalcQty] = useState(1);
  const [calcDays, setCalcDays] = useState(3);
  const [isFragile, setIsFragile] = useState(false);

  // Calculate pricing logic with weekly & monthly discounts
  const calculateTotal = (sizeKey, qty, days) => {
    const r = rates[sizeKey] || rates.medium;
    const d = Math.max(1, parseInt(days) || 1);
    const q = Math.max(1, parseInt(qty) || 1);

    let unitCost = 0;
    if (d >= 30) {
      const months = Math.floor(d / 30);
      const remDays = d % 30;
      unitCost = (months * r.month) + (remDays * r.day);
    } else if (d >= 7) {
      const weeks = Math.floor(d / 7);
      const remDays = d % 7;
      unitCost = (weeks * r.week) + (remDays * r.day);
    } else {
      unitCost = d * r.day;
    }

    return unitCost * q;
  };

  const calculatedCost = calculateTotal(calcSize, calcQty, calcDays);

  const handleBookWithCalculated = () => {
    if (setBookingPrefill) {
      setBookingPrefill({
        size: calcSize,
        qty: calcQty,
        days: calcDays,
        fragile: isFragile
      });
    }
    setView('book');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-[#E75A2D] bg-[#E75A2D]/10 px-3.5 py-1.5 rounded-full">
          {t.pricing.badge}
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-['Poppins'] text-[#0F2A4A]">
          {t.pricing.title}
        </h1>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
          {t.pricing.subtitle}
        </p>
      </div>

      {/* PRICING RATE CARDS / TABLE */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(rates).map(([key, item]) => (
          <div
            key={key}
            className={`rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all relative ${
              item.popular
                ? 'bg-[#0F2A4A] text-white shadow-xl ring-2 ring-[#E75A2D]'
                : 'bg-white text-gray-900 border border-gray-200 shadow-xs hover:border-gray-300'
            }`}
          >
            {item.popular && (
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#E75A2D] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                {lang === 'sw' ? 'Inayopendwa Zaidi' : 'Most Popular'}
              </span>
            )}

            <div>
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg font-['Poppins']">
                  {lang === 'sw' ? item.swName : item.name}
                </h3>
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                  item.popular ? 'bg-white/20 text-amber-300' : 'bg-gray-100 text-gray-600'
                }`}>
                  {key}
                </span>
              </div>

              <p className={`text-xs mb-6 min-h-[36px] ${item.popular ? 'text-gray-300' : 'text-gray-500'}`}>
                {lang === 'sw' ? item.swExamples : item.examples}
              </p>

              {/* Price figures */}
              <div className="space-y-3 mb-6 pb-6 border-b border-gray-200/40">
                <div>
                  <span className="text-xs uppercase tracking-wider opacity-75 block">Per Day / Kwa Siku</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl sm:text-3xl font-black">KES {item.day}</span>
                    <span className="text-xs opacity-75">/ day</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
                  <div className={`p-2 rounded-xl ${item.popular ? 'bg-white/10' : 'bg-gray-50'}`}>
                    <span className="block opacity-75 text-[10px] uppercase">Per Week</span>
                    <strong className="text-sm">KES {item.week}</strong>
                  </div>
                  <div className={`p-2 rounded-xl ${item.popular ? 'bg-white/10' : 'bg-gray-50'}`}>
                    <span className="block opacity-75 text-[10px] uppercase">Per Month</span>
                    <strong className="text-sm">KES {item.month}</strong>
                  </div>
                </div>
              </div>

              {/* Features bullets */}
              <ul className="space-y-2.5 text-xs mb-6">
                <li className="flex items-center gap-2">
                  <Check className={`w-4 h-4 shrink-0 ${item.popular ? 'text-emerald-400' : 'text-emerald-600'}`} />
                  <span>24/7 CCTV surveillance & rack tag</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className={`w-4 h-4 shrink-0 ${item.popular ? 'text-emerald-400' : 'text-emerald-600'}`} />
                  <span>Instant M-Pesa or Cash payment</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className={`w-4 h-4 shrink-0 ${item.popular ? 'text-emerald-400' : 'text-emerald-600'}`} />
                  <span>Extend online anytime</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => {
                setCalcSize(key);
                const el = document.getElementById('price-calculator');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`w-full py-3 rounded-xl font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 ${
                item.popular
                  ? 'bg-[#E75A2D] hover:bg-[#d0451b] text-white shadow-md'
                  : 'bg-[#0F2A4A] hover:bg-[#1a406c] text-white'
              }`}
            >
              <span>{lang === 'sw' ? 'Chagua Hii' : 'Calculate & Book'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* INTERACTIVE PRICE CALCULATOR */}
      <div id="price-calculator" className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-10 shadow-lg">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-['Poppins'] text-[#0F2A4A]">
                {t.pricing.calculatorTitle}
              </h2>
              <p className="text-xs text-gray-500">
                {t.pricing.calculatorDesc}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Inputs */}
            <div className="space-y-5">
              {/* Size selection */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  {t.pricing.selectSize}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(rates).map(([k, item]) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => setCalcSize(k)}
                      className={`p-3 rounded-xl text-left border transition-all ${
                        calcSize === k
                          ? 'border-[#E75A2D] bg-[#E75A2D]/10 text-[#0F2A4A] font-bold shadow-xs'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      <span className="block text-xs">{lang === 'sw' ? item.swName : item.name}</span>
                      <span className="block text-[11px] text-[#E75A2D] font-extrabold mt-0.5">KES {item.day}/day</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  {t.pricing.selectQty}
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setCalcQty(Math.max(1, calcQty - 1))}
                    className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-base flex items-center justify-center"
                  >
                    −
                  </button>
                  <span className="w-12 text-center text-lg font-bold text-[#0F2A4A]">
                    {calcQty}
                  </span>
                  <button
                    type="button"
                    onClick={() => setCalcQty(calcQty + 1)}
                    className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-base flex items-center justify-center"
                  >
                    +
                  </button>
                  <span className="text-xs text-gray-500 ml-2">item(s)</span>
                </div>
              </div>

              {/* Duration in Days */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    {t.pricing.selectDays}
                  </label>
                  <span className="text-xs font-extrabold text-[#0F2A4A] bg-gray-100 px-2 py-0.5 rounded">
                    {calcDays} {calcDays === 1 ? 'day' : 'days'}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="60"
                  value={calcDays}
                  onChange={(e) => setCalcDays(parseInt(e.target.value) || 1)}
                  className="w-full accent-[#E75A2D] h-2 bg-gray-200 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                  <span>1 day</span>
                  <span>1 week (7d)</span>
                  <span>1 month (30d)</span>
                  <span>2 months (60d)</span>
                </div>
              </div>

              {/* Fragile handling */}
              <label className="flex items-center gap-2.5 text-xs text-gray-700 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={isFragile}
                  onChange={(e) => setIsFragile(e.target.checked)}
                  className="w-4 h-4 text-[#E75A2D] rounded border-gray-300 focus:ring-[#E75A2D]"
                />
                <span>{t.pricing.fragileAddon}</span>
              </label>
            </div>

            {/* Output Calculation Card */}
            <div className="bg-[#0F2A4A] rounded-2xl p-6 sm:p-8 text-white space-y-6 flex flex-col justify-between shadow-md">
              <div className="space-y-4">
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                  Cost Breakdown
                </span>

                <div className="space-y-2 text-xs text-gray-300 pb-4 border-b border-white/10">
                  <div className="flex justify-between">
                    <span>Item Size:</span>
                    <strong className="text-white capitalize">{calcSize}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Quantity:</span>
                    <strong className="text-white">{calcQty} item(s)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <strong className="text-white">{calcDays} day(s)</strong>
                  </div>
                  {calcDays >= 7 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Long-term Savings Applied:</span>
                      <strong>Active Discount</strong>
                    </div>
                  )}
                </div>

                <div>
                  <span className="text-xs text-gray-300 block">{t.pricing.estimatedTotal}</span>
                  <div className="text-3xl sm:text-4xl font-black text-amber-400 font-['Poppins']">
                    KES {calculatedCost.toLocaleString()}
                  </div>
                  <p className="text-[11px] text-gray-300 mt-1">
                    No hidden charges. Exact total payable.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleBookWithCalculated}
                className="w-full bg-[#E75A2D] hover:bg-[#d0451b] text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <span>{t.pricing.bookWithThis}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* POLICY NOTES */}
      <div className="bg-[#FAF8F5] rounded-3xl p-6 sm:p-8 border border-amber-200/70 space-y-4">
        <h3 className="font-bold text-base text-[#0F2A4A] font-['Poppins'] flex items-center gap-2">
          <Info className="w-5 h-5 text-amber-600 shrink-0" />
          <span>Storage Rules & Policies (Sheria na Masharti)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-700">
          <div className="p-3.5 bg-white rounded-xl border border-gray-200 space-y-1">
            <strong className="text-[#0F2A4A] block">Minimum Charge</strong>
            <p className="text-gray-600 leading-relaxed">{t.pricing.ratesNotice}</p>
          </div>
          <div className="p-3.5 bg-white rounded-xl border border-gray-200 space-y-1">
            <strong className="text-[#0F2A4A] block">Late Pick-Up Fee</strong>
            <p className="text-gray-600 leading-relaxed">{t.pricing.lateNotice}</p>
          </div>
          <div className="p-3.5 bg-white rounded-xl border border-gray-200 space-y-1">
            <strong className="text-[#0F2A4A] block">Unclaimed Items Policy</strong>
            <p className="text-gray-600 leading-relaxed">{t.pricing.unclaimedNotice}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
