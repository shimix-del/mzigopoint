import React from 'react';
import { ShieldCheck, MapPin, Users, Lock, HeartHandshake, Award, Clock } from 'lucide-react';
import { translations } from '../translations';

export default function About({ lang, setView }) {
  const t = translations[lang];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      {/* Hero Intro */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-[#E75A2D] bg-[#E75A2D]/10 px-3.5 py-1.5 rounded-full">
          About Mzingo Point Storage
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-['Poppins'] text-[#0F2A4A]">
          {lang === 'sw' ? 'Usalama na Utulivu kwa Kila Mzigo' : 'Leave Your Things. Go Get Your Future.'}
        </h1>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
          {lang === 'sw'
            ? 'Mzingo Point ilianzishwa katikati ya jiji la Mombasa kutatua changamoto ya wageni, wasafiri, wanaotafuta nyumba, na watafuta kazi wanaotembea na mizigo mizito barabarani.'
            : 'Mzingo Point was founded in the bustling heart of Mombasa to eliminate the heavy burden of dragging luggage around town. We give job seekers, travellers, house hunters, and students a trustworthy sanctuary for their belongings.'}
        </p>
      </div>

      {/* The Story & Mission */}
      <div className="bg-white rounded-3xl border border-gray-200 p-8 sm:p-12 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4 text-xs sm:text-sm text-gray-700 leading-relaxed">
          <h2 className="text-2xl font-bold font-['Poppins'] text-[#0F2A4A]">
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

        <div className="bg-gradient-to-tr from-[#0F2A4A] to-[#1A3D66] rounded-2xl p-6 sm:p-8 text-white space-y-4 shadow-md">
          <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
            Our Core Promise
          </span>
          <h3 className="text-xl font-bold font-['Poppins']">
            "Your belongings will be returned to you in the exact same pristine condition you left them."
          </h3>
          <ul className="space-y-2.5 text-xs text-gray-200 pt-2 border-t border-white/15">
            <li className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Full compliance with Kenya Data Protection Act 2019</span>
            </li>
            <li className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-400 shrink-0" />
              <span>24/7 CCTV surveillance with offsite cloud backup</span>
            </li>
            <li className="flex items-center gap-2">
              <Award className="w-4 h-4 text-rose-400 shrink-0" />
              <span>Vetted, uniformed Mombasa attendants on duty</span>
            </li>
          </ul>
        </div>
      </div>

      {/* 3 Pillars of Security */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#FAF8F5] p-6 rounded-2xl border border-amber-200 space-y-3">
          <ShieldCheck className="w-8 h-8 text-[#0F2A4A]" />
          <h3 className="font-bold text-base text-[#0F2A4A] font-['Poppins']">
            Ironclad Security
          </h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Multi-angle CCTV recording, physical padlock points, fire suppression gear, and nighttime security attendants guarantee absolute protection.
          </p>
        </div>

        <div className="bg-[#FAF8F5] p-6 rounded-2xl border border-amber-200 space-y-3">
          <Users className="w-8 h-8 text-[#E75A2D]" />
          <h3 className="font-bold text-base text-[#0F2A4A] font-['Poppins']">
            Swahili Hospitality
          </h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Warm coastal welcome in both Swahili and English. Our team is trained to handle your delicate luggage, documents, and appliances with gentleness.
          </p>
        </div>

        <div className="bg-[#FAF8F5] p-6 rounded-2xl border border-amber-200 space-y-3">
          <Clock className="w-8 h-8 text-emerald-600" />
          <h3 className="font-bold text-base text-[#0F2A4A] font-['Poppins']">
            Always Accessible
          </h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Open daily from 6:30 AM to 8:30 PM (seven days a week, including public holidays). Early morning drop-offs and late-night pickups welcome.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center pt-6">
        <button
          onClick={() => { setView('book'); window.scrollTo(0, 0); }}
          className="bg-[#E75A2D] hover:bg-[#d0451b] text-white px-8 py-3.5 rounded-xl font-bold text-sm shadow-md transition-all inline-flex items-center gap-2"
        >
          <span>{lang === 'sw' ? 'Weka Nafasi ya Uhifadhi Sasa' : 'Book Storage Space Now'}</span>
        </button>
      </div>
    </div>
  );
}
