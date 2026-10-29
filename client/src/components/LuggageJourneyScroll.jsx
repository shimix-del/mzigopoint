import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { Smartphone, Store, Lock, UserCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { TagGrommet, DhowIcon } from './SwahiliMotifs';

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

export default function LuggageJourneyScroll({ lang }) {
  const containerRef = useRef(null);
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      num: "01",
      badge: "RESERVE",
      icon: Smartphone,
      title: lang === 'sw' ? 'Weka Nafasi Mtandaoni' : 'Book in 60 Seconds',
      desc: lang === 'sw'
        ? 'Chagua saizi ya mzigo kwenye simu yako na upate nambari ya kipekee ya QR.'
        : 'Select your luggage size on your phone, choose drop-off dates, and receive your instant QR reference.'
    },
    {
      num: "02",
      badge: "CHECK-IN",
      icon: Store,
      title: lang === 'sw' ? 'Kabidhi Moi Avenue' : 'Drop Off on Moi Avenue',
      desc: lang === 'sw'
        ? 'Fika kaunta yetu mkabala na Pembe za Ndovu. Mhudumu anabandika lebo ya kipekee.'
        : 'Hand over your bags at our counter opposite Mombasa Tusks. Our attendant inspects and fastens your baggage tag.'
    },
    {
      num: "03",
      badge: "SECURITY",
      icon: Lock,
      title: lang === 'sw' ? 'Ulinzi wa CCTV Masaa 24' : 'Safely Held & Guarded',
      desc: lang === 'sw'
        ? 'Mzigo wako unafungiwa kwenye rafu salama chini ya ulinzi mkali wa kamera na wahudumu.'
        : 'Locked in climate-protected racks monitored by multi-angle HD CCTV with 24/7 on-site attendant presence.'
    },
    {
      num: "04",
      badge: "COLLECT",
      icon: UserCheck,
      title: lang === 'sw' ? 'Chukua Ukiwa Tayari' : 'Collect With Verified ID',
      desc: lang === 'sw'
        ? 'Onyesha kitambulisho chako na QR code, saini kwenye skrini, na uendelee na safari yako.'
        : 'Present your phone QR tag, verify your National ID, sign the digital manifest, and step out completely luggage-free.'
    }
  ];

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top 75%',
        end: 'bottom 35%',
        scrub: 0.5,
        onUpdate: (self) => {
          const stepIdx = Math.min(3, Math.floor(self.progress * 4));
          setActiveStep(stepIdx);
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative py-6 sm:py-10">
      {/* 4 Step Cards in Boarding Pass / Luggage Tag Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 relative z-10">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isCurrent = activeStep === idx;
          const isPassed = activeStep > idx;

          return (
            <div
              key={idx}
              onClick={() => setActiveStep(idx)}
              className={`rounded-3xl p-5 sm:p-6 transition-all duration-300 relative cursor-pointer border ${
                isCurrent
                  ? 'bg-[#0B2545] text-[#F6EBD9] shadow-xl sm:scale-102 border-[#FF6B4A] ring-2 ring-[#FF6B4A]/30'
                  : isPassed
                  ? 'bg-white/95 text-[#0B2545] border-[#13B5B1]/50 shadow-md'
                  : 'bg-white/80 text-[#12161A] border-amber-900/10 hover:border-amber-900/30'
              }`}
            >
              {/* Grommet punch hole for luggage tag feel */}
              <div className="flex justify-between items-start mb-3 sm:mb-4">
                <TagGrommet className="w-5 h-5 text-[#FF6B4A]" />
                <span className={`text-[10px] font-mono font-bold tracking-widest px-2.5 py-0.5 rounded-full ${
                  isCurrent ? 'bg-[#FF6B4A] text-white' : 'bg-gray-100 text-gray-700'
                }`}>
                  STEP {step.num} • {step.badge}
                </span>
              </div>

              {/* Icon circle */}
              <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center mb-3 sm:mb-4 transition-transform duration-300 ${
                isCurrent
                  ? 'bg-[#13B5B1] text-[#0B2545] shadow-md'
                  : 'bg-amber-100/70 text-amber-900'
              }`}>
                <Icon className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
              </div>

              <h3 className={`font-display font-bold text-base sm:text-lg mb-1.5 ${isCurrent ? 'text-[#F6EBD9]' : 'text-[#0B2545]'}`}>
                {step.title}
              </h3>

              <p className={`text-xs leading-relaxed ${isCurrent ? 'text-gray-300' : 'text-gray-600'}`}>
                {step.desc}
              </p>

              {/* Perforated bottom line */}
              <div className="mt-4 pt-3 border-t border-dashed border-gray-300/40 flex items-center justify-between text-[10px] font-mono">
                <span className={isCurrent ? 'text-[#13B5B1]' : 'text-gray-400'}>
                  MZP // S{step.num}
                </span>
                {isPassed && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
