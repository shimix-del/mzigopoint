import React from 'react';
import { ShieldCheck, Phone, Mail, MapPin, Clock, Lock, CheckCircle2 } from 'lucide-react';
import { translations } from '../translations';

export default function Footer({ lang, setView }) {
  const t = translations[lang];

  return (
    <footer className="bg-[#0A1D33] text-gray-300 pt-14 pb-8 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Col 1: About & Trust */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-[#E75A2D] flex items-center justify-center text-white font-bold text-lg font-['Poppins']">
                M
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white font-['Poppins']">
                MZINGO <span className="text-[#E75A2D]">POINT</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              {t.footer.aboutText}
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-3 py-2 rounded-lg">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>CCTV Monitored • Licensed & Insured Facility</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 border-b border-white/10 pb-2">
              {lang === 'en' ? 'Quick Navigation' : 'Viungo vya Haraka'}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => { setView('home'); window.scrollTo(0,0); }} className="hover:text-amber-400 transition-colors">
                  {t.nav.home}
                </button>
              </li>
              <li>
                <button onClick={() => { setView('pricing'); window.scrollTo(0,0); }} className="hover:text-amber-400 transition-colors">
                  {t.nav.pricing}
                </button>
              </li>
              <li>
                <button onClick={() => { setView('book'); window.scrollTo(0,0); }} className="hover:text-amber-400 transition-colors">
                  {t.nav.book}
                </button>
              </li>
              <li>
                <button onClick={() => { setView('track'); window.scrollTo(0,0); }} className="hover:text-amber-400 transition-colors">
                  {t.nav.track}
                </button>
              </li>
              <li>
                <button onClick={() => { setView('about'); window.scrollTo(0,0); }} className="hover:text-amber-400 transition-colors">
                  {t.nav.about}
                </button>
              </li>
              <li>
                <button onClick={() => { setView('faq'); window.scrollTo(0,0); }} className="hover:text-amber-400 transition-colors">
                  {t.nav.faq}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Operating Hours */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 border-b border-white/10 pb-2">
              {t.footer.hoursTitle}
            </h3>
            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Daily Service</p>
                  <p className="text-xs text-gray-400">Monday to Sunday: 6:30 AM – 8:30 PM</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Lock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Overnight & Multi-Day</p>
                  <p className="text-xs text-gray-400">Locked safe storage during non-business hours with night security attendant.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Col 4: Contact & Location */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 border-b border-white/10 pb-2">
              {t.footer.contactTitle}
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#E75A2D] shrink-0 mt-0.5" />
                <span className="text-xs text-gray-300 leading-snug">{t.footer.location}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a href="tel:+254712345678" className="hover:text-white transition-colors">{t.footer.phone}</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <a href="mailto:info@mzingopoint.co.ke" className="hover:text-white transition-colors">{t.footer.email}</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal & Compliance Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>{t.footer.copyright}</p>
          <div className="flex items-center gap-4">
            <button onClick={() => { setView('terms'); window.scrollTo(0,0); }} className="hover:text-white transition-colors">
              Terms & Conditions
            </button>
            <span>•</span>
            <button onClick={() => { setView('privacy'); window.scrollTo(0,0); }} className="hover:text-white transition-colors">
              Privacy Policy (ODPC)
            </button>
            <span>•</span>
            <button onClick={() => { setView('admin_login'); window.scrollTo(0,0); }} className="text-amber-400 hover:underline">
              Staff Portal
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
