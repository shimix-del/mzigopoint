import React, { useState } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';

export default function WhatsAppFloating({ lang }) {
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');

  const phone = '254712345678';
  const defaultMsg = lang === 'sw'
    ? 'Habari Mzingo Point! Ningependa kuuliza kuhusu kuhifadhi mzigo wangu Mombasa.'
    : 'Hello Mzingo Point! I would like to inquire about storing my belongings in Mombasa.';

  const handleSend = (textToSend) => {
    const msg = encodeURIComponent(textToSend || defaultMsg);
    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 no-print font-sans">
      {/* Popover popup */}
      {isOpen && (
        <div className="mb-3 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className="bg-[#075E54] text-white p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-white">
                  MP
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#075E54] rounded-full"></span>
              </div>
              <div>
                <h4 className="font-bold text-sm leading-tight">Mzingo Point Support</h4>
                <p className="text-[11px] text-emerald-200">Online • Typically replies instantly</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-3.5 bg-[#ECE5DD] space-y-2.5 text-xs">
            <div className="bg-white p-2.5 rounded-lg rounded-tl-none shadow-sm max-w-[85%] text-gray-800">
              <p className="font-semibold text-emerald-800 mb-0.5">Mzingo Attendant</p>
              <p>
                {lang === 'sw'
                  ? 'Jambo! Unahitaji msaada wa kuhifadhi mzigo wako Mombasa leo? Tupo hapa kukusaidia!'
                  : 'Hello! Need help storing your luggage or boxes in Mombasa today? How can we help?'}
              </p>
              <span className="block text-[10px] text-gray-400 text-right mt-1">Just now</span>
            </div>

            {/* Quick action chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              <button
                onClick={() => handleSend(lang === 'sw' ? 'Nahitaji kujua bei ya kuhifadhi mzigo' : 'I want to check storage prices')}
                className="bg-white/90 hover:bg-white text-gray-700 text-[11px] px-2.5 py-1 rounded-full border border-gray-200 shadow-xs"
              >
                💰 {lang === 'sw' ? 'Kujua Bei' : 'Check Prices'}
              </button>
              <button
                onClick={() => handleSend(lang === 'sw' ? 'Mpo wapi haswa Mombasa?' : 'Where exactly are you located in Mombasa?')}
                className="bg-white/90 hover:bg-white text-gray-700 text-[11px] px-2.5 py-1 rounded-full border border-gray-200 shadow-xs"
              >
                📍 {lang === 'sw' ? 'Eneo / Maelekezo' : 'Location & Directions'}
              </button>
              <button
                onClick={() => handleSend(lang === 'sw' ? 'Je, naweza kuhifadhi fenicha / godoro?' : 'Can I store furniture or a mattress?')}
                className="bg-white/90 hover:bg-white text-gray-700 text-[11px] px-2.5 py-1 rounded-full border border-gray-200 shadow-xs"
              >
                📦 {lang === 'sw' ? 'Fenicha & Magodoro' : 'Furniture & Mattresses'}
              </button>
            </div>
          </div>

          <div className="p-2.5 bg-white border-t border-gray-100 flex items-center gap-2">
            <input
              type="text"
              placeholder={lang === 'sw' ? 'Andika ujumbe wako...' : 'Type a message...'}
              value={customMsg}
              onChange={(e) => setCustomMsg(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend(customMsg)}
              className="flex-1 text-xs px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-emerald-500"
            />
            <button
              onClick={() => handleSend(customMsg)}
              className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:bg-[#1ebc59] transition-colors shrink-0 shadow-sm"
              title="Send to WhatsApp"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </div>
        </div>
      )}

      {/* Trigger floating button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white px-4 py-3 rounded-full shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 active:scale-95 group focus:outline-none"
        aria-label="Chat on WhatsApp"
      >
        <div className="relative">
          <MessageSquare className="w-6 h-6 fill-white stroke-none" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-300 rounded-full animate-ping"></span>
        </div>
        <span className="font-semibold text-xs tracking-wide pr-1 hidden sm:inline">
          {isOpen ? (lang === 'sw' ? 'Funga' : 'Close') : (lang === 'sw' ? 'Wasiliana WhatsApp' : 'Chat with Us')}
        </span>
      </button>
    </div>
  );
}
