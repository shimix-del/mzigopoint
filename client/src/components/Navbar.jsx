import React, { useState } from 'react';
import { ShieldCheck, Luggage, Menu, X, Globe, UserCheck, CalendarCheck, Search } from 'lucide-react';
import { translations } from '../translations';

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
    <header className="sticky top-0 z-50 bg-[#0F2A4A] text-white shadow-md">
      {/* Top micro-bar */}
      <div className="bg-[#091D34] text-xs py-1.5 px-4 text-gray-300 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="hidden sm:inline">Moi Avenue, Opp. Mombasa Tusks | Open Daily 6:30 AM - 8:30 PM</span>
            <span className="sm:hidden">Moi Ave, Mombasa | Open Daily</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 transition-colors text-amber-300"
              title="Change Language / Badili Lugha"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Swahili (SW)' : 'English (EN)'}</span>
            </button>
            <button
              onClick={() => handleNav('admin_login')}
              className="text-xs text-gray-300 hover:text-white flex items-center gap-1 transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Staff / Owner</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Brand Logo */}
          <button
            onClick={() => handleNav('home')}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#E75A2D] to-amber-500 flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
              <Luggage className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="font-extrabold text-xl sm:text-2xl tracking-tight text-white flex items-center gap-1.5 font-['Poppins']">
                <span>MZINGO</span>
                <span className="text-[#E75A2D]">POINT</span>
              </div>
              <p className="text-[10px] sm:text-xs text-amber-200 font-medium tracking-wider uppercase">
                Mombasa Safe Luggage Storage
              </p>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => handleNav('home')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'home' ? 'text-amber-400 font-semibold' : 'text-gray-200 hover:text-white hover:bg-white/5'
              }`}
            >
              {t.nav.home}
            </button>
            <button
              onClick={() => handleNav('pricing')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'pricing' ? 'text-amber-400 font-semibold' : 'text-gray-200 hover:text-white hover:bg-white/5'
              }`}
            >
              {t.nav.pricing}
            </button>
            <button
              onClick={() => handleNav('track')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                currentView === 'track' ? 'text-amber-400 font-semibold' : 'text-gray-200 hover:text-white hover:bg-white/5'
              }`}
            >
              <Search className="w-4 h-4" />
              {t.nav.track}
            </button>
            <button
              onClick={() => handleNav('about')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'about' ? 'text-amber-400 font-semibold' : 'text-gray-200 hover:text-white hover:bg-white/5'
              }`}
            >
              {t.nav.about}
            </button>
            <button
              onClick={() => handleNav('faq')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'faq' ? 'text-amber-400 font-semibold' : 'text-gray-200 hover:text-white hover:bg-white/5'
              }`}
            >
              {t.nav.faq}
            </button>
            <button
              onClick={() => handleNav('contact')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'contact' ? 'text-amber-400 font-semibold' : 'text-gray-200 hover:text-white hover:bg-white/5'
              }`}
            >
              {t.nav.contact}
            </button>
          </nav>

          {/* Desktop Right CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={() => handleNav('book')}
              className="bg-[#E75A2D] hover:bg-[#d0451b] text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 transform active:scale-95"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>{t.nav.book}</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => handleNav('book')}
              className="bg-[#E75A2D] text-white text-xs px-3 py-1.5 rounded-lg font-bold shadow flex items-center gap-1"
            >
              <CalendarCheck className="w-3.5 h-3.5" />
              <span>{t.nav.book}</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-white/10 text-gray-200 hover:text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0D243F] border-t border-white/10 px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top duration-200">
          <button
            onClick={() => handleNav('home')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-base font-medium flex items-center justify-between ${
              currentView === 'home' ? 'bg-white/10 text-amber-400 font-bold' : 'text-gray-200 hover:bg-white/5'
            }`}
          >
            <span>{t.nav.home}</span>
          </button>
          <button
            onClick={() => handleNav('pricing')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-base font-medium flex items-center justify-between ${
              currentView === 'pricing' ? 'bg-white/10 text-amber-400 font-bold' : 'text-gray-200 hover:bg-white/5'
            }`}
          >
            <span>{t.nav.pricing}</span>
          </button>
          <button
            onClick={() => handleNav('track')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-base font-medium flex items-center justify-between ${
              currentView === 'track' ? 'bg-white/10 text-amber-400 font-bold' : 'text-gray-200 hover:bg-white/5'
            }`}
          >
            <span className="flex items-center gap-2">
              <Search className="w-4 h-4 text-amber-400" />
              {t.nav.track}
            </span>
          </button>
          <button
            onClick={() => handleNav('about')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-base font-medium ${
              currentView === 'about' ? 'bg-white/10 text-amber-400 font-bold' : 'text-gray-200 hover:bg-white/5'
            }`}
          >
            <span>{t.nav.about}</span>
          </button>
          <button
            onClick={() => handleNav('faq')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-base font-medium ${
              currentView === 'faq' ? 'bg-white/10 text-amber-400 font-bold' : 'text-gray-200 hover:bg-white/5'
            }`}
          >
            <span>{t.nav.faq}</span>
          </button>
          <button
            onClick={() => handleNav('contact')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-base font-medium ${
              currentView === 'contact' ? 'bg-white/10 text-amber-400 font-bold' : 'text-gray-200 hover:bg-white/5'
            }`}
          >
            <span>{t.nav.contact}</span>
          </button>

          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            <button
              onClick={() => handleNav('book')}
              className="w-full bg-[#E75A2D] hover:bg-[#d0451b] text-white py-3 rounded-xl font-bold text-center shadow flex items-center justify-center gap-2"
            >
              <CalendarCheck className="w-5 h-5" />
              <span>{t.nav.book}</span>
            </button>
            <div className="flex justify-between items-center pt-2">
              <button
                onClick={toggleLanguage}
                className="text-xs text-amber-300 font-semibold flex items-center gap-1.5 p-2"
              >
                <Globe className="w-4 h-4" />
                <span>{lang === 'en' ? 'Badili kwenda Kiswahili' : 'Switch to English'}</span>
              </button>
              <button
                onClick={() => handleNav('admin_login')}
                className="text-xs text-gray-300 hover:text-white flex items-center gap-1 p-2"
              >
                <UserCheck className="w-4 h-4" />
                <span>{t.nav.admin}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
