import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, MessageSquare, Send, CheckCircle2, Compass, ShieldCheck } from 'lucide-react';
import { translations } from '../translations';
import { DhowIcon } from '../components/SwahiliMotifs';

export default function Contact({ lang }) {
  const t = translations[lang];
  const [sent, setSent] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'Storage Inquiry',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen py-10 sm:py-16 px-4 sm:px-6 lg:px-8 relative bg-gradient-to-b from-[#F6EBD9]/40 via-white to-[#F6EBD9]/20">
      <div className="max-w-7xl mx-auto space-y-12">

        {/* Title */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FF6B4A]/10 border border-[#FF6B4A]/20 text-[#FF6B4A] text-xs font-bold uppercase tracking-widest">
            <Compass className="w-3.5 h-3.5" />
            <span>{lang === 'sw' ? 'Wasiliana Nasi • Mombasa Island' : 'Get in Touch • Mombasa Island'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black font-['Syne',sans-serif] text-[#0B2545] tracking-tight">
            {lang === 'sw' ? 'Tuko Hapa Kukusaidia' : 'Drop In or Speak With Us'}
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            {lang === 'sw'
              ? 'Una swali kuhusu mzigo wako, uhifadhi wa vitu vizito, au unaelekea kwenye kituo chetu? Wasiliana nasi mara moja.'
              : 'Have luggage questions, bulk household storage requests, or need directions from SGR/Likoni? Our team is on standby.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Col: Contact Info & Opening Hours */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xl space-y-6 relative overflow-hidden">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <h3 className="font-black text-xl text-[#0B2545] font-['Syne']">
                  Moi Avenue Facility
                </h3>
                <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>OPEN DAILY</span>
                </span>
              </div>

              <div className="space-y-4 text-xs text-gray-700">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-[#FF6B4A]/10 text-[#FF6B4A] flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-sm font-bold text-[#0B2545]">Physical Location:</strong>
                    <p className="text-gray-600 leading-relaxed mt-0.5">
                      Moi Avenue, Directly Opposite the Famous Mombasa Tusks, Next to Central Post Office (GPO), Mombasa Island, Kenya.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-sm font-bold text-[#0B2545]">Opening Hours (Every Day):</strong>
                    <p className="text-gray-600 leading-relaxed mt-0.5">
                      Monday to Sunday: <strong>7:00 AM – 8:00 PM</strong> (Open through all public holidays).
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-[#13B5B1]/10 text-[#13B5B1] flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-sm font-bold text-[#0B2545]">Call Desk:</strong>
                    <a href="tel:+254712345678" className="text-[#0B2545] font-bold text-sm block mt-0.5 hover:text-[#FF6B4A]">
                      +254 712 345 678
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-[#0B2545]/10 text-[#0B2545] flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-sm font-bold text-[#0B2545]">Official Inquiries:</strong>
                    <a href="mailto:info@mzingopoint.co.ke" className="text-[#0B2545] font-bold text-sm block mt-0.5 hover:text-[#FF6B4A]">
                      info@mzingopoint.co.ke
                    </a>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <a
                  href="https://wa.me/254712345678?text=Habari%20Mzingo%20Point!%20I%20have%20an%20inquiry%20about%20luggage%20storage."
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat Directly on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Col: Interactive Contact Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-gray-200 p-6 sm:p-10 shadow-xl">
            {sent ? (
              <div className="text-center py-12 space-y-4 animate-in zoom-in-95 duration-300">
                <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black font-['Syne'] text-[#0B2545]">
                  Ujumbe Umepokelewa! (Message Sent)
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 max-w-sm mx-auto">
                  Thank you {formData.name}. Our Mombasa desk attendant will reply to your phone or WhatsApp shortly.
                </p>
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="text-xs font-bold text-[#FF6B4A] underline pt-2"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="pb-3 border-b border-gray-100">
                  <h3 className="font-black text-xl text-[#0B2545] font-['Syne']">
                    Send an Inquiry to Attendant
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">We respond to online inquiries within 15 minutes during operating hours.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#0B2545] uppercase tracking-wider">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. David Mutua"
                      className="w-full text-sm px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:border-[#13B5B1] focus:ring-2 focus:ring-[#13B5B1]/20 font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#0B2545] uppercase tracking-wider">
                      Phone Number (WhatsApp) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. 0733 678 912"
                      className="w-full text-sm px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:border-[#13B5B1] focus:ring-2 focus:ring-[#13B5B1]/20 font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#0B2545] uppercase tracking-wider">
                    Inquiry Topic
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full text-sm px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:border-[#13B5B1] focus:ring-2 focus:ring-[#13B5B1]/20 font-medium"
                  >
                    <option value="Storage Inquiry">Storage pricing & duration inquiry</option>
                    <option value="Directions / Finding Location">Directions to Moi Avenue store</option>
                    <option value="Bulk / Furniture Storage">Bulk / Furniture / Trade booth storage</option>
                    <option value="Extension / Collection Help">Luggage extension or collection assistance</option>
                    <option value="Other">Other question</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#0B2545] uppercase tracking-wider">
                    Your Message *
                  </label>
                  <textarea
                    required
                    rows="4"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us what you are storing and how we can assist you..."
                    className="w-full text-sm px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:border-[#13B5B1] focus:ring-2 focus:ring-[#13B5B1]/20 font-medium"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#0B2545] hover:bg-[#163a63] text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4 text-[#13B5B1]" />
                  <span>Send Inquiry to Mombasa Desk</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Full Google Map Embed */}
        <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-xl">
          <div className="p-4 bg-[#0B2545] text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <span className="text-xs font-bold flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#FF6B4A]" />
              <span>Moi Avenue, Opp. Mombasa Tusks & GPO • Mombasa Island</span>
            </span>
            <span className="text-[11px] text-[#13B5B1] font-mono">Accessible from SGR Shuttle & Likoni Ferry</span>
          </div>
          <iframe
            title="Mzingo Point Google Map"
            src="https://maps.google.com/maps?q=Moi%20Avenue%20Mombasa%20Tusks&t=&z=15&ie=UTF8&iwloc=&output=embed"
            className="w-full h-80 border-0"
            loading="lazy"
          ></iframe>
        </div>

      </div>
    </div>
  );
}
