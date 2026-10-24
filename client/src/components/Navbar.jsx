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
      <div className="bg-[#061527] text-xs py-1.5 px-4 text-gray-300 border-b border-white/5">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-[11px] font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="hidden sm:inline">Moi Avenue, Opp. Mombasa Tusks • Daily 6:30 AM – 8:30 PM EAT</span>
            <span className="sm:hidden">Moi Ave, Mombasa • Open Daily</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 text-xs font-bold px-2.5 py-0.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-amber-300 cursor-pointer"
              title="Badili Lugha / Switch Language"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? '🇰🇪 SWAHILI' : '🇬🇧 ENGLISH'}</span>
            </button>

            <button
              onClick={() => handleNav('admin_login')}
              className="text-xs text-gray-300 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5 text-[#13B5B1]" />
              <span className="hidden sm:inline">Staff / Owner Portal</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo with Dhow + Luggage Motif */}
          <button
            onClick={() => handleNav('home')}
            className="flex items-center gap-3 text-left group focus:outline-none cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF6B4A] to-amber-500 flex items-center justify-center text-white shadow-xl group-hover:scale-105 transition-transform duration-300 border border-white/20">
              <DhowIcon className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="font-display font-extrabold text-2xl tracking-tight text-white flex items-center gap-1.5">
                <span>MZINGO</span>
                <span className="text-[#FF6B4A]">POINT</span>
              </div>
              <p className="text-[10px] text-[#13B5B1] font-mono tracking-widest uppercase">
                Mombasa Safe Luggage Storage
              </p>
            </div>
          </button>

          {/* Desktop Links */}
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
                  className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
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
              className="bg-[#FF6B4A] hover:bg-[#E55332] text-white px-5 py-2.5 rounded-xl font-display font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-2"
            >
              <CalendarCheck className="w-4 h-4 stroke-[2.5]" />
              <span>{t.nav.book}</span>
            </MagneticButton>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => handleNav('book')}
              className="bg-[#FF6B4A] text-white text-xs px-3 py-1.5 rounded-xl font-bold shadow flex items-center gap-1 font-display"
            >
              <CalendarCheck className="w-3.5 h-3.5" />
              <span>{t.nav.book}</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-white/10 text-gray-200 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#061527] border-t border-white/10 px-5 pt-4 pb-8 space-y-2 animate-in slide-in-from-top duration-200 font-mono text-xs">
          {['home', 'pricing', 'track', 'about', 'faq', 'contact'].map((viewId) => (
            <button
              key={viewId}
              onClick={() => handleNav(viewId)}
              className={`w-full text-left px-4 py-3 rounded-xl uppercase font-bold flex items-center justify-between ${
                currentView === viewId ? 'bg-white/10 text-[#FF6B4A]' : 'text-gray-300 hover:bg-white/5'
              }`}
            >
              <span>{t.nav[viewId]}</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-50" />
            </button>
          ))}

          <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
            <button
              onClick={() => handleNav('book')}
              className="w-full bg-[#FF6B4A] text-white py-3.5 rounded-xl font-display font-bold text-center text-xs uppercase shadow flex items-center justify-center gap-2"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>{t.nav.book}</span>
            </button>

            <div className="flex justify-between items-center pt-2">
              <button onClick={toggleLanguage} className="text-amber-300 font-bold flex items-center gap-1.5">
                <Globe className="w-4 h-4" />
                <span>{lang === 'en' ? 'Badili: Kiswahili' : 'Switch: English'}</span>
              </button>
              <button onClick={() => handleNav('admin_login')} className="text-gray-400 hover:text-white">
                {t.nav.admin}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
