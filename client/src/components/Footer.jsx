import React from 'react';
import { ShieldCheck, Phone, Mail, MapPin, Clock, Lock, CheckCircle2 } from 'lucide-react';
import { translations } from '../translations';
import { DhowIcon, TagGrommet } from './SwahiliMotifs';

export default function Footer({ lang, setView }) {
  const t = translations[lang];

  return (
    <footer className="bg-[#0B2545] text-[#F6EBD9] pt-12 sm:pt-16 pb-8 sm:pb-10 border-t-2 border-[#13B5B1]/30 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 mb-10 sm:mb-14">
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FF6B4A] flex items-center justify-center text-white shadow">
                <DhowIcon className="w-6 h-6" />
              </div>
              <span className="font-display font-extrabold text-2xl text-white">
                MZINGO <span className="text-[#FF6B4A]">POINT</span>
              </span>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              {t.footer.aboutText}
            </p>
            <div className="flex items-center gap-2 text-xs text-[#13B5B1] bg-white/5 border border-[#13B5B1]/30 px-3.5 py-2 rounded-2xl">
              <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
              <span className="font-mono text-[11px]">24/7 CCTV • Licensed Storage</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h3 className="font-mono text-xs uppercase tracking-widest text-[#13B5B1] font-bold mb-4 border-b border-white/10 pb-2">
              {lang === 'sw' ? 'Viungo vya Haraka' : 'Navigation'}
            </h3>
            <ul className="space-y-2.5 text-xs font-mono">
              {['home', 'pricing', 'book', 'track', 'about', 'faq'].map((viewId) => (
                <li key={viewId}>
                  <button
                    onClick={() => { setView(viewId); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="hover:text-[#FF6B4A] transition-colors cursor-pointer capitalize flex items-center gap-1.5 py-0.5"
                  >
                    <span>➔</span>
                    <span>{t.nav[viewId]}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Hours & Safekeeping */}
          <div>
            <h3 className="font-mono text-xs uppercase tracking-widest text-[#13B5B1] font-bold mb-4 border-b border-white/10 pb-2">
              {t.footer.hoursTitle}
            </h3>
            <div className="space-y-3 text-xs text-gray-300">
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#FF6B4A] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-white font-mono">Daily Service Desk</strong>
                  <p className="text-[11px] text-gray-400">Monday to Sunday: 6:30 AM – 8:30 PM EAT</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Lock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-white font-mono">Overnight & Multi-Month</strong>
                  <p className="text-[11px] text-gray-400">Locked safe storage during non-business hours with security attendants.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Col 4: Contact & Directions */}
          <div>
            <h3 className="font-mono text-xs uppercase tracking-widest text-[#13B5B1] font-bold mb-4 border-b border-white/10 pb-2">
              {t.footer.contactTitle}
            </h3>
            <ul className="space-y-3 text-xs text-gray-300">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#FF6B4A] shrink-0 mt-0.5" />
                <span className="text-[11px] leading-snug">{t.footer.location}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#13B5B1] shrink-0" />
                <a href="tel:+254712345678" className="hover:text-white font-mono">{t.footer.phone}</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#13B5B1] shrink-0" />
                <a href="mailto:info@mzingopoint.co.ke" className="hover:text-white font-mono">{t.footer.email}</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Huge Outlined Bottom Wordmark */}
        <div className="pt-6 pb-2 text-center border-t border-white/10 select-none overflow-hidden">
          <div className="font-display font-black text-3xl sm:text-6xl md:text-7xl lg:text-8xl text-stroke-white opacity-15 tracking-widest whitespace-nowrap overflow-hidden">
            MZINGO POINT MOMBASA
          </div>
        </div>

        {/* Legal & Compliance Bottom Bar */}
        <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] font-mono text-gray-400 text-center sm:text-left">
          <p>{t.footer.copyright}</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => { setView('terms'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="hover:text-white transition-colors cursor-pointer py-1"
            >
              Terms of Bailment
            </button>
            <span className="opacity-40">•</span>
            <button
              onClick={() => { setView('privacy'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="hover:text-white transition-colors cursor-pointer py-1"
            >
              Privacy (ODPC Kenya)
            </button>
            <span className="opacity-40">•</span>
            <button
              onClick={() => { setView('admin_login'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="text-[#FF6B4A] hover:underline cursor-pointer py-1 font-bold"
            >
              Desk Attendant Login
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
