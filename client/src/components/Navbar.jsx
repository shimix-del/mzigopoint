import React, { useState } from 'react';
import { ShieldCheck, Luggage, Menu, X, Globe, UserCheck, CalendarCheck, Search, ArrowRight } from 'lucide-react';
import { translations } from '../translations';
import { DhowIcon, TagGrommet } from './SwahiliMotifs';
import MagneticButton from './MagneticButton';

export default function Navbar({ lang, setLang, currentView, setView }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = translations[lang];

  const handleNav = (viewName) => {
    setView(viewName);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleLanguage = () => {
    setLang(lang === 'en' ? 'sw' : 'en');
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0B2545] text-[#F6EBD9] shadow-lg border-b border-[#13B5B1]/20">
      {/* Top Coastal Micro-bar */}
      <div className="bg-[#061527] text-xs py-1.5 px-3 sm:px-4 text-gray-300 border-b border-white/5">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-[11px] font-mono gap-2">
          <div className="flex items-center gap-2 truncate min-w-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
            <span className="hidden md:inline truncate">Moi Avenue, Opp. Mombasa Tusks • Daily 6:30 AM – 8:30 PM EAT</span>
            <span className="md:hidden truncate">Moi Ave, Mombasa • Open Daily</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold px-2 sm:px-2.5 py-0.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-amber-300 cursor-pointer min-h-[28px]"
              title="Badili Lugha / Switch Language"
            >
              <Globe className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>{lang === 'en' ? 'SWAHILI' : 'ENGLISH'}</span>
            </button>

            <button
              onClick={() => handleNav('admin_login')}
              className="text-[10px] sm:text-xs text-gray-300 hover:text-white flex items-center gap-1 transition-colors cursor-pointer min-h-[28px]"
            >
              <UserCheck className="w-3.5 h-3.5 text-[#13B5B1]" />
              <span className="hidden sm:inline">Desk Portal</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2">
          {/* Brand Logo with Dhow + Luggage Motif */}
          <button
            onClick={() => handleNav('home')}
            className="flex items-center gap-2 sm:gap-3 text-left group focus:outline-none cursor-pointer min-w-0"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-[#FF6B4A] to-amber-500 flex items-center justify-center text-white shadow-xl group-hover:scale-105 transition-transform duration-300 border border-white/20 shrink-0">
              <DhowIcon className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
            </div>
            <div className="truncate min-w-0">
              <div className="font-display font-extrabold text-lg sm:text-2xl tracking-tight text-white flex items-center gap-1 sm:gap-1.5 leading-none">
                <span>MZINGO</span>
                <span className="text-[#FF6B4A]">POINT</span>
              </div>
              <p className="text-[9px] sm:text-[10px] text-[#13B5B1] font-mono tracking-wider sm:tracking-widest uppercase mt-0.5 truncate">
                Mombasa Luggage Storage
              </p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {[
              { id: 'home', label: t.nav.home },
              { id: 'pricing', label: t.nav.pricing },
              { id: 'track', label: t.nav.track, icon: Search },
              { id: 'about', label: t.nav.about },
              { id: 'faq', label: t.nav.faq },
              { id: 'contact', label: t.nav.contact }
            ].map((link) => {
              const Icon = link.icon;
              const isActive = currentView === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNav(link.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 min-h-[40px] ${
                    isActive
                      ? 'text-[#FF6B4A] bg-white/10 shadow-xs'
                      : 'text-gray-200 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {Icon && <Icon className="w-3.5 h-3.5 text-[#13B5B1]" />}
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Desktop Right CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <MagneticButton
              onClick={() => handleNav('book')}
              className="bg-[#FF6B4A] hover:bg-[#E55332] text-white px-5 py-2.5 rounded-xl font-display font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 min-h-[44px]"
            >
              <CalendarCheck className="w-4 h-4 stroke-[2.5]" />
              <span>{t.nav.book}</span>
            </MagneticButton>
          </div>

          {/* Mobile Right Controls: Compact Book + Menu */}
          <div className="flex lg:hidden items-center gap-2 shrink-0">
            <button
              onClick={() => handleNav('book')}
              className="bg-[#FF6B4A] hover:bg-[#E55332] text-white text-xs px-3 py-2 rounded-xl font-bold shadow flex items-center gap-1.5 font-display min-h-[40px]"
            >
              <CalendarCheck className="w-3.5 h-3.5" />
              <span>{t.nav.book}</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-white/10 text-gray-200 hover:text-white min-h-[40px] min-w-[40px] flex items-center justify-center cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#061527] border-t border-white/10 px-4 sm:px-6 pt-4 pb-8 space-y-2 animate-in slide-in-from-top duration-200 font-mono text-xs shadow-2xl">
          {['home', 'pricing', 'track', 'about', 'faq', 'contact'].map((viewId) => (
            <button
              key={viewId}
              onClick={() => handleNav(viewId)}
              className={`w-full text-left px-4 py-3 rounded-2xl uppercase font-bold flex items-center justify-between min-h-[44px] transition-colors ${
                currentView === viewId ? 'bg-white/10 text-[#FF6B4A]' : 'text-gray-300 hover:bg-white/5 active:bg-white/10'
              }`}
            >
              <span>{t.nav[viewId]}</span>
              <ArrowRight className="w-4 h-4 opacity-50" />
            </button>
          ))}

          <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
            <button
              onClick={() => handleNav('book')}
              className="w-full bg-[#FF6B4A] hover:bg-[#E55332] text-white py-3.5 rounded-2xl font-display font-bold text-center text-xs uppercase shadow-lg flex items-center justify-center gap-2 min-h-[48px]"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>{t.nav.book}</span>
            </button>

            <div className="flex justify-between items-center pt-2 px-1 text-xs">
              <button
                onClick={toggleLanguage}
                className="text-amber-300 font-bold flex items-center gap-1.5 min-h-[40px]"
              >
                <Globe className="w-4 h-4" />
                <span>{lang === 'en' ? 'Badili: Kiswahili' : 'Switch: English'}</span>
              </button>
              <button
                onClick={() => handleNav('admin_login')}
                className="text-gray-400 hover:text-white min-h-[40px] flex items-center"
              >
                {t.nav.admin}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
