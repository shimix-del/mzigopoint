import React, { useState } from 'react';
import { Luggage, Plus, Minus, ArrowRight, ShieldCheck, Sparkles, Check } from 'lucide-react';
import MagneticButton from './MagneticButton';
import { TagGrommet } from './SwahiliMotifs';

export default function PackYourBagCalculator({ lang, onBookWithSelection }) {
  const [selectedSize, setSelectedSize] = useState('medium');
  const [quantity, setQuantity] = useState(1);
  const [days, setDays] = useState(3);
  const [isFragile, setIsFragile] = useState(false);

  const rates = {
    small: {
      name: lang === 'sw' ? 'Begi Dogo / Laptop' : 'Small Daypack',
      icon: '🎒',
      day: 150,
      week: 900,
      month: 3200,
      desc: 'Backpack, handbag, laptop briefcase'
    },
    medium: {
      name: lang === 'sw' ? 'Sanduku la Kawaida' : 'Standard Suitcase',
      icon: '🧳',
      day: 250,
      week: 1500,
      month: 5500,
      desc: 'Carry-on suitcase, medium carton box'
    },
    large: {
      name: lang === 'sw' ? 'Sanduku Kubwa / Bati' : 'Large Trunk',
      icon: '📦',
      day: 400,
      week: 2400,
      month: 8800,
      desc: 'Big 28-inch suitcase, metal trunk'
    },
    xlarge: {
      name: lang === 'sw' ? 'Fenicha & Magodoro' : 'Bulky / Mattress',
      icon: '🛋️',
      day: 750,
      week: 4500,
      month: 16000,
      desc: 'Mattress, appliances, furniture'
    }
  };

  const calculateTotal = () => {
    const r = rates[selectedSize] || rates.medium;
    const d = Math.max(1, days);
    const q = Math.max(1, quantity);

    let unit = 0;
    if (d >= 30) {
      const months = Math.floor(d / 30);
      const rem = d % 30;
      unit = (months * r.month) + (rem * r.day);
    } else if (d >= 7) {
      const weeks = Math.floor(d / 7);
      const rem = d % 7;
      unit = (weeks * r.week) + (rem * r.day);
    } else {
      unit = d * r.day;
    }
    return unit * q;
  };

  const total = calculateTotal();
  const savings = (days >= 7) ? Math.round((rates[selectedSize].day * days * quantity) - total) : 0;

  return (
    <div className="bg-[#0B2545] text-[#F6EBD9] rounded-3xl p-5 sm:p-8 lg:p-10 shadow-2xl border-2 border-[#13B5B1]/30 relative overflow-hidden">
      {/* Decorative grommet */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
        <TagGrommet className="w-5 h-5 sm:w-6 sm:h-6 text-[#13B5B1]" />
      </div>

      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#13B5B1]/20 text-[#13B5B1] text-xs font-mono font-bold tracking-widest uppercase mb-2 sm:mb-3">
            <span>PACK YOUR STORAGE</span>
          </div>
          <h3 className="font-display font-extrabold text-xl sm:text-3xl text-white">
            {lang === 'sw' ? 'Kikokotoo cha Uhifadhi' : 'Interactive Storage Calculator'}
          </h3>
          <p className="text-xs text-gray-300 mt-1 max-w-xl leading-relaxed">
            Pick your belongings, slide the days, and see your exact KES cost with automatic duration discounts.
          </p>
        </div>

        {/* 1. Item Selection Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
          {Object.entries(rates).map(([k, item]) => (
            <button
              key={k}
              type="button"
              onClick={() => setSelectedSize(k)}
              className={`p-3 sm:p-4 rounded-2xl text-left border transition-all duration-200 cursor-pointer ${
                selectedSize === k
                  ? 'bg-gradient-to-b from-[#13B5B1]/20 to-transparent border-[#FF6B4A] shadow-lg ring-2 ring-[#FF6B4A]/40'
                  : 'bg-white/5 border-white/10 hover:border-white/30'
              }`}
            >
              <div className="text-xl sm:text-2xl mb-1.5 sm:mb-2">{item.icon}</div>
              <strong className="block font-display font-bold text-xs text-white leading-tight truncate">
                {item.name}
              </strong>
              <span className="block text-[11px] font-mono text-[#FF6B4A] font-bold mt-1">
                KES {item.day}/day
              </span>
            </button>
          ))}
        </div>

        {/* 2. Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 items-center pt-2 border-t border-white/10">
          {/* Quantity Controls */}
          <div className="md:col-span-5 space-y-2">
            <label className="block text-xs font-mono uppercase tracking-wider text-gray-300">
              Quantity of Items
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-11 h-11 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white font-bold flex items-center justify-center transition-colors min-h-[44px]"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-12 text-center font-display font-black text-2xl text-white">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-11 h-11 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white font-bold flex items-center justify-center transition-colors min-h-[44px]"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
              <span className="text-xs text-gray-400 font-mono">
                {quantity === 1 ? 'item' : 'items'}
              </span>
            </div>
          </div>

          {/* Days Range Slider */}
          <div className="md:col-span-7 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-mono uppercase tracking-wider text-gray-300">
                Storage Duration
              </label>
              <span className="font-mono font-bold text-[#FF6B4A] bg-[#FF6B4A]/20 px-2.5 py-0.5 rounded-full">
                {days} {days === 1 ? 'day' : 'days'}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="60"
              value={days}
              onChange={(e) => setDays(parseInt(e.target.value) || 1)}
              className="w-full accent-[#FF6B4A] h-2.5 bg-white/20 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-400 font-mono">
              <span>1d</span>
              <span>7d (1 Week)</span>
              <span>30d (1 Month)</span>
              <span>60d</span>
            </div>
          </div>
        </div>

        {/* 3. Live Total Bar & CTAs */}
        <div className="p-4 sm:p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="w-full sm:w-auto">
            <span className="text-[10px] sm:text-[11px] uppercase font-mono tracking-wider text-gray-300 block">
              Estimated Total Storage Fee
            </span>
            <div className="flex items-baseline gap-2 mt-1 flex-wrap">
              <span className="text-2xl sm:text-4xl font-display font-black text-white">
                KES {total.toLocaleString()}
              </span>
              {savings > 0 && (
                <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                  Save KES {savings.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          <MagneticButton
            onClick={() => onBookWithSelection({ size: selectedSize, qty: quantity, days })}
            className="w-full sm:w-auto bg-[#FF6B4A] hover:bg-[#E55332] text-white px-6 sm:px-7 py-3.5 sm:py-4 rounded-2xl font-bold text-xs uppercase tracking-wider shadow-xl flex items-center justify-center gap-2 min-h-[44px]"
          >
            <span>{lang === 'sw' ? 'Weka Nafasi kwa Bei Hii' : 'Book Storage With This'}</span>
            <ArrowRight className="w-4 h-4" />
          </MagneticButton>
        </div>
      </div>
    </div>
  );
}
