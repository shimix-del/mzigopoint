import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, Users, Clock, Award, CheckCircle2 } from 'lucide-react';
import { SwahiliPatternBg, DhowIcon } from './SwahiliMotifs';

export default function SecurityTrustSection({ lang }) {
  // Animated stats
  const [counts, setCounts] = useState({ items: 0, customers: 0, hours: 0 });

  useEffect(() => {
    let start = 0;
    const duration = 1200;
    const stepTime = 30;
    const steps = duration / stepTime;
    const itemTarget = 4850;
    const customerTarget = 2650;
    const hourTarget = 24;

    const timer = setInterval(() => {
      start++;
      const progress = Math.min(1, start / steps);
      setCounts({
        items: Math.floor(progress * itemTarget),
        customers: Math.floor(progress * customerTarget),
        hours: Math.floor(progress * hourTarget)
      });
      if (progress >= 1) clearInterval(timer);
    }, stepTime);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative rounded-3xl bg-[#0B2545] text-[#F6EBD9] p-8 sm:p-14 overflow-hidden shadow-2xl border-2 border-[#13B5B1]/30">
      {/* Decorative Swahili Pattern Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <SwahiliPatternBg color="#13B5B1" />
      </div>

      <div className="relative z-10 space-y-12 max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#13B5B1]/20 text-[#13B5B1] text-xs font-mono font-bold tracking-widest uppercase">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>MOMBASA SECURITY PLEDGE</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white">
            {lang === 'sw' ? 'Ulinzi wa Uhakika Masaa 24' : 'Your Belongings, Guaranteed Safe.'}
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
            {lang === 'sw'
              ? 'Kila begi, sanduku au kifaa kinalindwa kwa kamera za CCTV, lebo maalum ya QR, na wahudumu waliofunzwa vizuri.'
              : 'Every single bag, carton, and household item is guarded by continuous multi-angle HD CCTV, individual shelf tags, and strict National ID verification.'}
          </p>
        </div>

        {/* 3 Animated Number Counters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center space-y-1 backdrop-blur-xs">
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#13B5B1] block">
              Items Safely Stored
            </span>
            <div className="font-display font-black text-4xl sm:text-5xl text-white">
              {counts.items.toLocaleString()}+
            </div>
            <span className="text-xs text-gray-400 block pt-1">
              Zero loss or mix-up incidents
            </span>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center space-y-1 backdrop-blur-xs">
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#FF6B4A] block">
              Verified Customers Served
            </span>
            <div className="font-display font-black text-4xl sm:text-5xl text-white">
              {counts.customers.toLocaleString()}+
            </div>
            <span className="text-xs text-gray-400 block pt-1">
              Job seekers, travellers, students & movers
            </span>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center space-y-1 backdrop-blur-xs">
            <span className="font-mono text-[11px] uppercase tracking-wider text-emerald-400 block">
              Continuous CCTV Watch
            </span>
            <div className="font-display font-black text-4xl sm:text-5xl text-white">
              {counts.hours}/7
            </div>
            <span className="text-xs text-gray-400 block pt-1">
              Cloud backed-up surveillance cameras
            </span>
          </div>
        </div>

        {/* 4 Trust Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-white/10 text-xs">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
            <Lock className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <strong className="block text-white">Padlocked Racks</strong>
              <span className="text-[11px] text-gray-400">Lockable compartments</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
            <Award className="w-5 h-5 text-[#FF6B4A] shrink-0" />
            <div>
              <strong className="block text-white">Itemised QR Tags</strong>
              <span className="text-[11px] text-gray-400">Barcode baggage manifests</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
            <Users className="w-5 h-5 text-[#13B5B1] shrink-0" />
            <div>
              <strong className="block text-white">Vetted Attendants</strong>
              <span className="text-[11px] text-gray-400">Trained uniformed staff</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <strong className="block text-white">ODPC Privacy Act</strong>
              <span className="text-[11px] text-gray-400">Kenya data protection compliant</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
