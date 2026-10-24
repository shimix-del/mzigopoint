import React, { useState, useEffect } from 'react';
import { Lock, Luggage } from 'lucide-react';
import { DhowIcon } from './SwahiliMotifs';

export default function Preloader({ onComplete }) {
  const [isVisible, setIsVisible] = useState(true);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    // Check reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || sessionStorage.getItem('mzingo_seen_preloader')) {
      setIsVisible(false);
      if (onComplete) onComplete();
      return;
    }

    const lockTimer = setTimeout(() => {
      setLocked(true);
    }, 500);

    const finishTimer = setTimeout(() => {
      setIsVisible(false);
      sessionStorage.setItem('mzingo_seen_preloader', 'true');
      if (onComplete) onComplete();
    }, 1200);

    return () => {
      clearTimeout(lockTimer);
      clearTimeout(finishTimer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-[#0B2545] text-[#F6EBD9] flex flex-col items-center justify-center transition-opacity duration-500">
      <div className="relative flex flex-col items-center">
        {/* Animated Suitcase with Latches */}
        <div className="relative w-24 h-20 rounded-2xl bg-gradient-to-b from-[#13B5B1] to-[#0E8E8B] border-2 border-[#F6EBD9]/40 shadow-2xl flex items-center justify-center transform transition-transform duration-300">
          {/* Top Handle */}
          <div className="absolute -top-4 w-10 h-4 border-t-3 border-x-3 border-[#F6EBD9] rounded-t-lg"></div>

          {/* Center Lock Badge */}
          <div className={`w-8 h-8 rounded-full bg-[#0B2545] border border-amber-300 flex items-center justify-center transition-all duration-300 ${
            locked ? 'scale-110 text-emerald-400' : 'text-amber-300'
          }`}>
            <Lock className="w-4 h-4 stroke-[2.5]" />
          </div>

          {/* Left/Right Latches */}
          <div className="absolute top-3 left-2 w-2 h-4 rounded-xs bg-[#FF6B4A]"></div>
          <div className="absolute top-3 right-2 w-2 h-4 rounded-xs bg-[#FF6B4A]"></div>
        </div>

        {/* Wordmark */}
        <div className="mt-5 text-center">
          <div className="font-display font-extrabold text-xl tracking-wider text-[#F6EBD9] flex items-center gap-1.5 justify-center">
            <span>MZINGO</span>
            <span className="text-[#FF6B4A]">POINT</span>
          </div>
          <p className="text-[10px] uppercase font-mono tracking-widest text-[#13B5B1] mt-1">
            Mombasa • Safely Held
          </p>
        </div>
      </div>
    </div>
  );
}
