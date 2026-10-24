import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import {
  CalendarCheck,
  Search,
  ArrowRight,
  ShieldCheck,
  Luggage,
  Lock,
  MapPin,
  Clock,
  Sparkles
} from 'lucide-react';
import { translations } from '../translations';
import MagneticButton from '../components/MagneticButton';
import MarqueeTicker from '../components/MarqueeTicker';
import LuggageJourneyScroll from '../components/LuggageJourneyScroll';
import LuggageTagCards from '../components/LuggageTagCards';
import PackYourBagCalculator from '../components/PackYourBagCalculator';
import SecurityTrustSection from '../components/SecurityTrustSection';
import TestimonialsSection from '../components/TestimonialsSection';
import MombasaLocationLive from '../components/MombasaLocationLive';
import { TagGrommet, DhowIcon, SwahiliPatternBg } from '../components/SwahiliMotifs';

export default function Home({ lang, setView, setSelectedPriceTier }) {
  const t = translations[lang];
  const heroRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Stagger in hero elements
      gsap.from('.hero-reveal', {
        y: 40,
        opacity: 0,
        stagger: 0.12,
        duration: 0.9,
        ease: 'power3.out'
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="space-y-20 sm:space-y-28 pb-20 overflow-hidden">
      {/* 1. SIGNATURE HERO SECTION */}
      <section ref={heroRef} className="relative pt-12 pb-20 sm:pt-20 sm:pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-[#F6EBD9] via-[#F8F2E6] to-[#F6EBD9]">
        {/* Subtle coastal Swahili pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <SwahiliPatternBg color="#0B2545" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            {/* Pill Landmark Badge */}
            <div className="hero-reveal inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#0B2545] text-[#F6EBD9] text-xs font-mono font-bold tracking-wider uppercase shadow-md">
              <span className="w-2 h-2 rounded-full bg-[#FF6B4A] animate-ping"></span>
              <MapPin className="w-3.5 h-3.5 text-[#13B5B1]" />
              <span>MOI AVENUE • OPP. MOMBASA TUSKS</span>
            </div>

            {/* Giant Display Headline with Outline Text Contrast */}
            <h1 className="hero-reveal font-display font-black text-4xl sm:text-6xl lg:text-7xl leading-[1.08] text-[#0B2545] tracking-tight">
              {lang === 'sw' ? (
                <>
                  ACHA MIZIGO YAKO. <br />
                  <span className="text-[#FF6B4A]">KIMBIZA</span>{' '}
                  <span className="text-stroke-ocean font-extrabold">NDOTO ZAKO.</span>
                </>
              ) : (
                <>
                  LEAVE YOUR THINGS. <br />
                  <span className="text-[#FF6B4A]">GO GET</span>{' '}
                  <span className="text-stroke-ocean font-extrabold">YOUR FUTURE.</span>
                </>
              )}
            </h1>

            {/* Reassuring Subheading */}
            <p className="hero-reveal text-sm sm:text-lg text-gray-700 leading-relaxed max-w-2xl mx-auto">
              {lang === 'sw'
                ? 'Unatafuta nyumba ya kupanga, unakwenda kwenye usaili wa kazi, unazuru Mombasa, au unahama makazi? Hifadhi mabegi, masanduku na vifaa vyako salama na ulinzi wa CCTV masaa 24.'
                : 'House hunting in Nyali, interviewing at KPA, exploring Old Town, or between semester rentals? Store your bags, suitcases, boxes, and household goods safely on Moi Avenue.'}
            </p>

            {/* Magnetic CTA Buttons */}
            <div className="hero-reveal flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <MagneticButton
                onClick={() => { setView('book'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="w-full sm:w-auto bg-[#FF6B4A] hover:bg-[#E55332] text-white px-8 py-4 rounded-2xl font-display font-bold text-sm uppercase tracking-wider shadow-xl flex items-center justify-center gap-2.5 transition-all"
              >
                <CalendarCheck className="w-4 h-4 stroke-[2.5]" />
                <span>{t.hero.ctaBook}</span>
                <ArrowRight className="w-4 h-4" />
              </MagneticButton>

              <MagneticButton
                onClick={() => { setView('track'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="w-full sm:w-auto bg-[#0B2545] hover:bg-[#061527] text-[#F6EBD9] px-7 py-4 rounded-2xl font-display font-bold text-sm uppercase tracking-wider shadow-md flex items-center justify-center gap-2 transition-all border border-white/10"
              >
                <Search className="w-4 h-4 text-[#13B5B1]" />
                <span>{t.hero.ctaTrack}</span>
              </MagneticButton>
            </div>

            {/* Quick Micro Trust Highlights */}
            <div className="hero-reveal pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-gray-600 font-mono">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>24/7 CCTV & LOCKABLE RACKS</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B4A]"></span>
                <span>FROM KES 150 / DAY</span>
              </div>
              <div className="flex items-center gap-2">
                <DhowIcon className="w-4 h-4 text-[#13B5B1]" />
                <span>INSTANT M-PESA STK PUSH</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. MARQUEE STRIP */}
      <MarqueeTicker lang={lang} />

      {/* 3. PINNED HOW IT WORKS SCROLL (4 STEPS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-6">
          <span className="text-xs font-mono font-bold tracking-widest text-[#FF6B4A] uppercase bg-[#FF6B4A]/10 px-3.5 py-1 rounded-full">
            THE STORAGE JOURNEY
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[#0B2545] mt-3">
            {t.howItWorks.title}
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Drop your bags in 2 minutes, get your tamper-evident QR receipt, and go get your future.
          </p>
        </div>

        <LuggageJourneyScroll lang={lang} />
      </section>

      {/* 4. USE-CASE CARDS (LUGGAGE TAG SHAPES WITH FLIP REVEAL) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-mono font-bold tracking-widest text-[#13B5B1] uppercase bg-[#13B5B1]/10 px-3.5 py-1 rounded-full">
            BUILT FOR MOMBASA LIFE
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[#0B2545] mt-3">
            {t.useCases.title}
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Tap any luggage tag to flip and read how fellow travellers and movers use Mzingo Point.
          </p>
        </div>

        <LuggageTagCards
          lang={lang}
          onSelectUseCase={() => { setView('book'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        />
      </section>

      {/* 5. PLAYFUL PACK-YOUR-BAG CALCULATOR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PackYourBagCalculator
          lang={lang}
          onBookWithSelection={(params) => {
            if (setSelectedPriceTier) setSelectedPriceTier(params.size);
            setView('book');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      </section>

      {/* 6. SECURITY & TRUST PLEDGE (ANIMATED COUNTERS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SecurityTrustSection lang={lang} />
      </section>

      {/* 7. TESTIMONIALS CAROUSEL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <TestimonialsSection lang={lang} />
      </section>

      {/* 8. MOMBASA LOCATION & LIVE OPERATING STATUS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <MombasaLocationLive lang={lang} />
      </section>

      {/* 9. BOTTOM OUTLINED WORDMARK STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8">
        <div className="rounded-3xl bg-[#0B2545] p-10 sm:p-14 text-white relative overflow-hidden shadow-xl">
          <div className="relative z-10 space-y-4 max-w-xl mx-auto">
            <h3 className="font-display font-black text-3xl sm:text-4xl text-white">
              {lang === 'sw' ? 'Mizigo yako ipo mikononi salama.' : 'Your life, safely held.'}
            </h3>
            <p className="text-xs text-gray-300">
              Book online in 60 seconds or walk in to our Moi Avenue counter today.
            </p>
            <div className="pt-2">
              <MagneticButton
                onClick={() => { setView('book'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="bg-[#FF6B4A] hover:bg-[#E55332] text-white px-8 py-3.5 rounded-2xl font-display font-bold text-xs uppercase tracking-wider shadow-lg"
              >
                <span>{t.hero.ctaBook}</span>
              </MagneticButton>
            </div>
          </div>

          {/* Huge background wordmark outline */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-stroke-white opacity-10 text-6xl sm:text-9xl font-display font-black pointer-events-none select-none">
            MZINGO POINT
          </div>
        </div>
      </section>
    </div>
  );
}
