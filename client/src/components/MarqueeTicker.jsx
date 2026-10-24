import React from 'react';
import { ShieldCheck, Luggage, Star, MapPin } from 'lucide-react';
import { DhowIcon } from './SwahiliMotifs';

export default function MarqueeTicker({ lang }) {
  const items = lang === 'sw' ? [
    'USAFIRI WA SGR',
    'MAHOJIANO YA KAZI KPA',
    'KUSAKA NYUMBA YA KUPANGA',
    'WANAFUNZI WA VYUO VIKUU',
    'KUHAMA MAKAZI',
    'ZIARA YA MJI MKONGWE & FORT JESUS',
    'UHIFADHI SALAMA WA SIKU MOJA AU MIEZI'
  ] : [
    'SGR MADARAKA EXPRESS LAYOVERS',
    'KPA & NAVY JOB INTERVIEWS',
    'MOMBASA HOUSE HUNTING',
    'UNIVERSITY SEMESTER BREAKS',
    'MOVING HOMES & RENTALS',
    'FORT JESUS & OLD TOWN TOURS',
    'DAILY, WEEKLY & MONTHLY SAFE RACKS'
  ];

  return (
    <div className="relative w-full overflow-hidden bg-[#0B2545] text-[#F6EBD9] py-3.5 border-y-2 border-[#13B5B1]/40 select-none">
      <div className="flex w-max animate-marquee space-x-8 text-xs font-mono tracking-widest uppercase items-center">
        {[...items, ...items, ...items].map((text, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <span className="text-[#FF6B4A] font-bold">✦</span>
            <span className="font-semibold text-gray-200">{text}</span>
            {idx % 2 === 0 ? (
              <DhowIcon className="w-3.5 h-3.5 text-[#13B5B1]" />
            ) : (
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            )}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        .animate-marquee {
          animation: marquee 35s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-marquee {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
