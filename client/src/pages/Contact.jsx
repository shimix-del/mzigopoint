import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import { translations } from '../translations';

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Title */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-[#E75A2D] bg-[#E75A2D]/10 px-3.5 py-1.5 rounded-full">
          Get In Touch • Wasiliana Nasi
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-['Poppins'] text-[#0F2A4A]">
          {lang === 'sw' ? 'Wasiliana na Mzingo Point' : 'We’d Love to Hear From You'}
        </h1>
        <p className="text-xs sm:text-sm text-gray-600">
          Have an inquiry, bulk storage requirement, or questions about directions? Reach our team in Mombasa today.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Col: Contact Info & Opening Hours */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-6">
            <h3 className="font-bold text-lg text-[#0F2A4A] font-['Poppins']">
              Mombasa Facility Contacts
            </h3>

            <div className="space-y-4 text-xs text-gray-700">
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-orange-100 text-[#E75A2D] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <strong className="block text-sm text-[#0F2A4A]">Physical Location:</strong>
                  <p className="text-gray-600 leading-relaxed mt-0.5">
                    Moi Avenue, Opposite the Famous Mombasa Tusks, Next to Central Post Office, Mombasa Island, Kenya.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <strong className="block text-sm text-[#0F2A4A]">Working Hours:</strong>
                  <p className="text-gray-600 leading-relaxed mt-0.5">
                    Monday to Sunday (Including Holidays): 6:30 AM to 8:30 PM.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <strong className="block text-sm text-[#0F2A4A]">Customer Call Center:</strong>
                  <a href="tel:+254712345678" className="text-emerald-700 font-bold block mt-0.5 hover:underline">
                    +254 712 345 678
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <strong className="block text-sm text-[#0F2A4A]">Email Address:</strong>
                  <a href="mailto:info@mzingopoint.co.ke" className="text-blue-700 font-bold block mt-0.5 hover:underline">
                    info@mzingopoint.co.ke
                  </a>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <a
                href="https://wa.me/254712345678?text=Habari%20Mzingo%20Point!%20I%20have%20an%20inquiry%20about%20storage."
                target="_blank"
                rel="noreferrer"
                className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider shadow flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat Directly on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right Col: Interactive Contact Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-gray-200 p-6 sm:p-10 shadow-xs">
          {sent ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold font-['Poppins'] text-[#0F2A4A]">
                Message Received!
              </h3>
              <p className="text-xs text-gray-600 max-w-sm mx-auto">
                Thank you {formData.name}. Our Mombasa desk attendant will reply to your phone or WhatsApp shortly.
              </p>
              <button
                type="button"
                onClick={() => setSent(false)}
                className="text-xs font-bold text-[#E75A2D] underline pt-2"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="font-bold text-lg text-[#0F2A4A] font-['Poppins'] pb-2 border-b border-gray-100">
                Send an Online Inquiry
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. David Mutua"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-[#E75A2D]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Phone Number (WhatsApp) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. 0733 678 912"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-[#E75A2D]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Inquiry Topic
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-[#E75A2D]"
                >
                  <option value="Storage Inquiry">Storage pricing & duration inquiry</option>
                  <option value="Directions / Finding Location">Directions to Moi Avenue store</option>
                  <option value="Bulk / Furniture Storage">Bulk / Furniture / Trade booth storage</option>
                  <option value="Extension / Collection Help">Luggage extension or collection assistance</option>
                  <option value="Other">Other question</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Your Message *
                </label>
                <textarea
                  required
                  rows="4"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="How can we assist you with storage in Mombasa?"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-[#E75A2D]"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-[#0F2A4A] hover:bg-[#1a406c] text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider shadow flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Inquiry</span>
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Full Google Map Embed */}
      <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-xs">
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <span className="text-xs font-bold text-[#0F2A4A] flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-[#E75A2D]" />
            <span>Mombasa Landmark: Moi Avenue Opp. Tusks & GPO</span>
          </span>
          <span className="text-[11px] text-gray-500">Accessible from SGR shuttle, Likoni Ferry & Airport Taxi</span>
        </div>
        <iframe
          title="Mzingo Point Google Map"
          src="https://maps.google.com/maps?q=Moi%20Avenue%20Mombasa%20Tusks&t=&z=15&ie=UTF8&iwloc=&output=embed"
          className="w-full h-80 border-0"
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
}
