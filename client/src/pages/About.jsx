import React from 'react';
import { ShieldCheck, MapPin, Users, Lock, HeartHandshake, Award, Clock, ArrowRight } from 'lucide-react';
import { translations } from '../translations';
import { DhowIcon, TagGrommet } from '../components/SwahiliMotifs';

export default function About({ lang, setView }) {
  const t = translations[lang];

  return (
    <div className="min-h-screen py-8 sm:py-16 px-3 sm:px-6 lg:px-8 relative bg-gradient-to-b from-[#F6EBD9]/40 via-white to-[#F6EBD9]/20">
      <div className="max-w-5xl mx-auto space-y-10 sm:space-y-16">
        {/* Hero Intro */}
        <div className="text-center space-y-3 sm:space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-[#FF6B4A]/10 border border-[#FF6B4A]/20 text-[#FF6B4A] text-[10px] sm:text-xs font-bold uppercase tracking-widest">
            <DhowIcon className="w-3.5 h-3.5" />
            <span>Mombasa Heritage & Safekeeping</span>
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black font-['Syne',sans-serif] text-[#0B2545] tracking-tight">
            {lang === 'sw' ? 'Usalama na Utulivu kwa Kila Mzigo' : 'Leave Your Things. Go Get Your Future.'}
          </h1>
          <p className="text-xs sm:text-base text-gray-600 leading-relaxed px-2">
            {lang === 'sw'
              ? 'Mzingo Point ilianzishwa katikati ya jiji la Mombasa kutatua changamoto ya wageni, wasafiri, wanaotafuta nyumba, na watafuta kazi wanaotembea na mizigo mizito barabarani.'
              : 'Mzingo Point was founded in the bustling heart of Mombasa to eliminate the heavy burden of dragging luggage around town. We give job seekers, travellers, house hunters, and students a trustworthy sanctuary for their belongings.'}
          </p>
        </div>

        {/* The Story & Mission */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200 p-5 sm:p-10 lg:p-12 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-center">
          <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm text-gray-700 leading-relaxed">
            <h2 className="text-xl sm:text-2xl font-black font-['Syne'] text-[#0B2545]">
              {lang === 'sw' ? 'Hadithi Yetu ya Pwani' : 'Our Mombasa Story'}
            </h2>
            <p>
              Every day, hundreds of Kenyans arrive in Mombasa via the SGR Madaraka Express, overnight upcountry buses, and flights. Many are job seekers heading to interviews at the Kenya Ports Authority (KPA), Kenya Navy, or regional medical centers. Others are university students or individuals moving into new apartments.
            </p>
            <p>
              Dragging heavy suitcases through humid coastal streets, into interview rooms, or onto matatus is exhausting, inconvenient, and risky.
            </p>
            <p>
              <strong>Mzingo Point</strong> changed that. Situated on Moi Avenue, right opposite the historic Mombasa Tusks, our modern facility offers safe, climate-protected, CCTV-monitored lockers and shelving bays. You leave your things in 2 minutes, and proceed to chase your ambitions unhindered.
            </p>
          </div>

          <div className="bg-gradient-to-tr from-[#0B2545] to-[#13325c] rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-white space-y-4 shadow-xl border border-white/10">
            <span className="text-[10px] font-mono font-bold text-amber-300 uppercase tracking-widest block">
              OUR SACRED PROMISE
            </span>
            <h3 className="text-lg sm:text-xl font-black font-['Syne'] leading-snug">
              "Your belongings will be returned to you in the exact same pristine condition you left them."
            </h3>
            <ul className="space-y-2.5 text-xs text-gray-200 pt-3 border-t border-white/15">
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Full compliance with Kenya Data Protection Act 2019</span>
              </li>
              <li className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>24/7 CCTV surveillance with offsite cloud backup</span>
              </li>
              <li className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#FF6B4A] shrink-0" />
                <span>Vetted, uniformed Mombasa attendants on duty</span>
              </li>
            </ul>
          </div>
        </div>

        {/* 3 Pillars of Security */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-[#FAF8F5] p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-amber-200/80 space-y-3">
            <ShieldCheck className="w-8 h-8 text-[#0B2545]" />
            <h3 className="font-black text-base text-[#0B2545] font-['Syne']">
              Ironclad Security
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Multi-angle CCTV recording, physical padlock points, fire suppression gear, and nighttime security attendants guarantee absolute protection.
            </p>
          </div>

          <div className="bg-[#FAF8F5] p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-amber-200/80 space-y-3">
            <Users className="w-8 h-8 text-[#FF6B4A]" />
            <h3 className="font-black text-base text-[#0B2545] font-['Syne']">
              Swahili Hospitality
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Warm coastal welcome in both Swahili and English. Our team is trained to handle your delicate luggage, documents, and appliances with gentleness.
            </p>
          </div>

          <div className="bg-[#FAF8F5] p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-amber-200/80 space-y-3">
            <Clock className="w-8 h-8 text-[#13B5B1]" />
            <h3 className="font-black text-base text-[#0B2545] font-['Syne']">
              Always Accessible
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Open daily from 6:30 AM to 8:30 PM (seven days a week, including public holidays). Early morning drop-offs and late-night pickups welcome.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-2">
          <button
            onClick={() => { setView('book'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="w-full sm:w-auto bg-[#FF6B4A] hover:bg-[#E55332] text-white px-8 py-4 rounded-2xl font-bold text-xs uppercase tracking-wider shadow-lg transition-all inline-flex items-center justify-center gap-2 min-h-[48px]"
          >
            <span>{lang === 'sw' ? 'Weka Nafasi ya Uhifadhi Sasa' : 'Book Storage Space Now'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
