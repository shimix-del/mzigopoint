import React, { useState } from 'react';
import { Calculator, Check, ArrowRight, ShieldCheck, AlertCircle, Info, Luggage, Sparkles, Tag } from 'lucide-react';
import { translations } from '../translations';
import { TagGrommet, DhowIcon } from '../components/SwahiliMotifs';

export default function Pricing({ lang, setView, setBookingPrefill }) {
  const t = translations[lang];

  // Pricing rates
  const rates = {
    small: {
      name: "Small Luggage",
      swName: "Mzigo Mdogo",
      examples: "Backpack, handbag, laptop bag, briefcase",
      swExamples: "Begi la mgongoni, mkoba, begi la laptop",
      day: 150,
      week: 900,
      month: 3200,
      popular: false,
      tag: "Interviews & Exams"
    },
    medium: {
      name: "Medium Luggage",
      swName: "Mzigo wa Kati",
      examples: "Carry-on trolley suitcase, medium box, duffel",
      swExamples: "Sanduku la kawaida la magurudumu, katoni ya wastani",
      day: 250,
      week: 1500,
      month: 5500,
      popular: true,
      tag: "Most Popular"
    },
    large: {
      name: "Large Luggage",
      swName: "Mzigo Mkubwa",
      examples: "Big 28-inch suitcase, large moving box, trunk",
      swExamples: "Sanduku kubwa la nguo, katoni kubwa, sanduku la bati",
      day: 400,
      week: 2400,
      month: 8800,
      popular: false,
      tag: "Relocation & Long Stay"
    },
    xlarge: {
      name: "Extra Large / Bulky",
      swName: "Mzigo Mkubwa / Fenicha",
      examples: "Mattress, disassembled furniture, appliances",
      swExamples: "Godoro, fenicha iliyofunguliwa, vyombo vya nyumbani",
      day: 750,
      week: 4500,
      month: 16000,
      popular: false,
      tag: "Students & Bulk"
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
    <div className="min-h-screen py-8 sm:py-16 px-3 sm:px-6 lg:px-8 relative bg-gradient-to-b from-[#F6EBD9]/40 via-white to-[#F6EBD9]/20">
      <div className="max-w-7xl mx-auto space-y-10 sm:space-y-16">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-[#FF6B4A]/10 border border-[#FF6B4A]/20 text-[#FF6B4A] text-[10px] sm:text-xs font-bold uppercase tracking-widest">
            <Tag className="w-3.5 h-3.5" />
            <span>{lang === 'sw' ? 'Bei na Viwango vya Uwazi' : 'Transparent Mombasa Rates'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black font-['Syne',sans-serif] text-[#0B2545] tracking-tight">
            {lang === 'sw' ? 'Gharama za Uhifadhi wa Mzigo' : 'Simple, Transparent Storage Pricing'}
          </h1>
          <p className="text-xs sm:text-base text-gray-600 leading-relaxed px-2">
            {lang === 'sw'
              ? 'Lipa kwa siku, wiki, au mwezi bila ada za siri. Punguzo kubwa la bei kwa uhifadhi wa muda mrefu.'
              : 'Affordable daily, weekly, and monthly rates. Automatic bulk savings applied for 7+ days and 30+ days.'}
          </p>
        </div>

        {/* PRICING RATE CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {Object.entries(rates).map(([key, item]) => (
            <div
              key={key}
              className={`rounded-3xl p-5 sm:p-7 flex flex-col justify-between transition-all duration-300 relative border ${
                item.popular
                  ? 'bg-[#0B2545] text-white shadow-xl ring-2 ring-[#FF6B4A]'
                  : 'bg-white text-gray-900 border-gray-200/90 shadow-md hover:shadow-xl'
              }`}
            >
              {item.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#FF6B4A] to-[#13B5B1] text-white text-[9px] sm:text-[10px] font-mono font-bold px-3 py-0.5 sm:py-1 rounded-full uppercase tracking-widest shadow-md whitespace-nowrap">
                  {lang === 'sw' ? '★ INAYOPENDEZWA' : '★ MOST POPULAR'}
                </div>
              )}

              <div>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-[10px] font-mono uppercase font-bold text-[#FF6B4A] block">
                      {item.tag}
                    </span>
                    <h3 className="font-black text-lg sm:text-xl font-['Syne']">
                      {lang === 'sw' ? item.swName : item.name}
                    </h3>
                  </div>
                  <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                    item.popular ? 'bg-white/10 text-[#13B5B1]' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {key}
                  </span>
                </div>

                <p className={`text-xs mb-4 sm:mb-6 min-h-[32px] sm:min-h-[36px] ${item.popular ? 'text-gray-300' : 'text-gray-500'}`}>
                  {lang === 'sw' ? item.swExamples : item.examples}
                </p>

                {/* Rates breakdown */}
                <div className="space-y-3 mb-5 sm:mb-6 pb-4 sm:pb-6 border-b border-gray-200/40">
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-wider opacity-75 block">Per Day / Kwa Siku</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl sm:text-3xl font-black font-['Syne']">KES {item.day}</span>
                      <span className="text-xs opacity-75">/ day</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                    <div className={`p-2.5 rounded-xl ${item.popular ? 'bg-white/10' : 'bg-gray-50'}`}>
                      <span className="block opacity-75 text-[10px] font-mono uppercase">Per Week</span>
                      <strong className="text-xs sm:text-sm font-['Syne']">KES {item.week}</strong>
                    </div>
                    <div className={`p-2.5 rounded-xl ${item.popular ? 'bg-white/10' : 'bg-gray-50'}`}>
                      <span className="block opacity-75 text-[10px] font-mono uppercase">Per Month</span>
                      <strong className="text-xs sm:text-sm font-['Syne']">KES {item.month}</strong>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-2 sm:space-y-2.5 text-xs mb-5 sm:mb-6">
                  <li className="flex items-center gap-2">
                    <Check className={`w-4 h-4 shrink-0 ${item.popular ? 'text-[#13B5B1]' : 'text-emerald-600'}`} />
                    <span>24/7 CCTV surveillance & bay</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className={`w-4 h-4 shrink-0 ${item.popular ? 'text-[#13B5B1]' : 'text-emerald-600'}`} />
                    <span>Instant M-Pesa STK or cash</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className={`w-4 h-4 shrink-0 ${item.popular ? 'text-[#13B5B1]' : 'text-emerald-600'}`} />
                    <span>Free online duration extension</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() => {
                  setCalcSize(key);
                  const el = document.getElementById('price-calculator');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`w-full py-3 sm:py-3.5 rounded-xl font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 min-h-[44px] ${
                  item.popular
                    ? 'bg-[#FF6B4A] hover:bg-[#e85535] text-white shadow-lg'
                    : 'bg-[#0B2545] hover:bg-[#163a63] text-white'
                }`}
              >
                <span>{lang === 'sw' ? 'Piga Hesabu na Uhifadhi' : 'Calculate & Book'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* INTERACTIVE PRICE CALCULATOR */}
        <div id="price-calculator" className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200 p-4 sm:p-8 lg:p-10 shadow-xl relative overflow-hidden">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-gray-100">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#FF6B4A]/10 text-[#FF6B4A] flex items-center justify-center shrink-0">
                <Calculator className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h2 className="text-xl sm:text-3xl font-black font-['Syne',sans-serif] text-[#0B2545]">
                  {t.pricing.calculatorTitle}
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                  {t.pricing.calculatorDesc}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
              {/* Inputs Column */}
              <div className="lg:col-span-7 space-y-5 sm:space-y-6">
                <div>
                  <label className="block text-xs font-bold text-[#0B2545] uppercase tracking-wider mb-2">
                    {t.pricing.selectSize}
                  </label>
                  <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                    {Object.entries(rates).map(([k, item]) => (
                      <button
                        key={k}
                        type="button"
                        onClick={() => setCalcSize(k)}
                        className={`p-3 sm:p-3.5 rounded-2xl text-left border transition-all ${
                          calcSize === k
                            ? 'border-[#FF6B4A] bg-[#FF6B4A]/10 text-[#0B2545] ring-2 ring-[#FF6B4A]/20 shadow-xs'
                            : 'border-gray-200 hover:border-gray-300 text-gray-700 bg-gray-50/50'
                        }`}
                      >
                        <span className="block text-xs font-bold font-['Syne'] truncate">{lang === 'sw' ? item.swName : item.name}</span>
                        <span className="block text-[11px] text-[#FF6B4A] font-extrabold font-mono mt-0.5">KES {item.day}/day</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-xs font-bold text-[#0B2545] uppercase tracking-wider mb-2">
                    {t.pricing.selectQty}
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setCalcQty(Math.max(1, calcQty - 1))}
                      className="w-11 h-11 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#0B2545] font-bold text-lg flex items-center justify-center transition-colors min-h-[44px]"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="w-12 text-center text-xl font-black font-['Syne'] text-[#0B2545]">
                      {calcQty}
                    </span>
                    <button
                      type="button"
                      onClick={() => setCalcQty(calcQty + 1)}
                      className="w-11 h-11 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#0B2545] font-bold text-lg flex items-center justify-center transition-colors min-h-[44px]"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                    <span className="text-xs text-gray-500 font-medium font-mono">bag(s) / box(es)</span>
                  </div>
                </div>

                {/* Duration Slider */}
                <div>
                  <div className="flex justify-between items-center mb-2 text-xs">
                    <label className="font-bold text-[#0B2545] uppercase tracking-wider">
                      {t.pricing.selectDays}
                    </label>
                    <span className="font-bold text-white bg-[#0B2545] px-2.5 py-1 rounded-lg font-mono">
                      {calcDays} {calcDays === 1 ? 'day' : 'days'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="60"
                    value={calcDays}
                    onChange={(e) => setCalcDays(parseInt(e.target.value) || 1)}
                    className="w-full accent-[#FF6B4A] h-2.5 bg-gray-200 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 font-mono mt-1.5">
                    <span>1 day</span>
                    <span>7 days (Weekly)</span>
                    <span>30 days (Monthly)</span>
                    <span>60 days</span>
                  </div>
                </div>

                {/* Fragile */}
                <label className="flex items-center gap-3 text-xs text-gray-700 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={isFragile}
                    onChange={(e) => setIsFragile(e.target.checked)}
                    className="w-4 h-4 text-[#FF6B4A] rounded border-gray-300 focus:ring-[#FF6B4A]"
                  />
                  <span className="font-medium">{t.pricing.fragileAddon}</span>
                </label>
              </div>

              {/* Output Column */}
              <div className="lg:col-span-5 bg-[#0B2545] rounded-3xl p-5 sm:p-8 text-white space-y-5 flex flex-col justify-between shadow-xl border border-white/10 relative overflow-hidden">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#13B5B1] font-bold">
                      Calculated Luggage Quote
                    </span>
                    {calcDays >= 7 && (
                      <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-mono px-2 py-0.5 rounded-full font-bold">
                        DISCOUNT ACTIVE
                      </span>
                    )}
                  </div>

                  <div className="space-y-2 text-xs text-gray-300 pb-3 sm:pb-4 border-b border-white/10 font-mono">
                    <div className="flex justify-between">
                      <span>Size:</span>
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
                  </div>

                  <div>
                    <span className="text-xs text-gray-300 block">{t.pricing.estimatedTotal}</span>
                    <div className="text-2xl sm:text-4xl font-black font-['Syne'] text-amber-400 mt-1">
                      KES {calculatedCost.toLocaleString()}
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1">
                      Exact total payable online or at Moi Avenue counter.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleBookWithCalculated}
                  className="w-full bg-[#FF6B4A] hover:bg-[#e85535] text-white py-3.5 sm:py-4 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group min-h-[44px]"
                >
                  <span>{t.pricing.bookWithThis}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* POLICY NOTES */}
        <div className="bg-[#FAF8F5] rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-amber-200/70 space-y-4">
          <h3 className="font-black text-base text-[#0B2545] font-['Syne'] flex items-center gap-2">
            <Info className="w-5 h-5 text-amber-600 shrink-0" />
            <span>Mombasa Storage Policies & Legal Bailment</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 text-xs text-gray-700">
            <div className="p-4 bg-white rounded-2xl border border-gray-200 space-y-1">
              <strong className="text-[#0B2545] block font-bold">Minimum Charge</strong>
              <p className="text-gray-600 leading-relaxed">{t.pricing.ratesNotice}</p>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-gray-200 space-y-1">
              <strong className="text-[#0B2545] block font-bold">Late Pick-Up Fee</strong>
              <p className="text-gray-600 leading-relaxed">{t.pricing.lateNotice}</p>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-gray-200 space-y-1">
              <strong className="text-[#0B2545] block font-bold">Unclaimed Items Policy</strong>
              <p className="text-gray-600 leading-relaxed">{t.pricing.unclaimedNotice}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
