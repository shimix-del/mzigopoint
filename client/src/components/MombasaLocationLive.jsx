import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Phone, MessageSquare, Navigation, ExternalLink } from 'lucide-react';
import { DhowIcon, TagGrommet } from './SwahiliMotifs';

export default function MombasaLocationLive({ lang }) {
  const [isOpenNow, setIsOpenNow] = useState(true);

  useEffect(() => {
    // Check Mombasa operating hours: 6:30 AM (6.5) to 8:30 PM (20.5)
    const checkOpen = () => {
      const now = new Date();
      // UTC + 3 hours for East Africa Time
      const utcHours = now.getUTCHours() + 3;
      const hours = (utcHours % 24) + now.getUTCMinutes() / 60;
      setIsOpenNow(hours >= 6.5 && hours <= 20.5);
    };

    checkOpen();
    const interval = setInterval(checkOpen, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-3xl border-2 border-amber-900/15 overflow-hidden shadow-xl grid grid-cols-1 lg:grid-cols-12">
      {/* Information Side */}
      <div className="lg:col-span-5 p-5 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
        <div className="space-y-4 sm:space-y-5">
          {/* Live Open / Closed Indicator */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-mono font-bold tracking-wider uppercase shadow-xs">
            {isOpenNow ? (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-emerald-800">OPEN NOW • CLOSES 8:30 PM EAT</span>
              </>
            ) : (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span className="text-amber-800">CLOSED • OPENS 6:30 AM DAILY</span>
              </>
            )}
          </div>

          <h3 className="font-display font-extrabold text-xl sm:text-3xl text-[#0B2545] leading-tight">
            Moi Avenue, Opp. Mombasa Tusks
          </h3>

          <p className="text-xs text-gray-600 leading-relaxed">
            Positioned at the bustling crossroad of Mombasa Island. Quick 5-minute hop from Likoni Ferry, SGR shuttle drop-offs, and bus stations.
          </p>

          <div className="space-y-3 pt-1 text-xs text-gray-700">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-[#FF6B4A] shrink-0 mt-0.5" />
              <span>Moi Avenue, Near Central Post Office, Mombasa CBD, Kenya</span>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 text-[#13B5B1] shrink-0 mt-0.5" />
              <span>Daily 6:30 AM to 8:30 PM (Mon – Sun including public holidays)</span>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-[#0B2545] shrink-0 mt-0.5" />
              <a href="tel:+254712345678" className="hover:underline font-mono font-bold text-[#0B2545]">
                +254 712 345 678
              </a>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-dashed border-gray-200 flex flex-col sm:flex-row gap-3">
          <a
            href="https://maps.google.com/?q=Moi+Avenue+Mombasa+Tusks"
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto bg-[#0B2545] hover:bg-[#061527] text-white px-5 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider shadow flex items-center justify-center gap-2 transition-colors cursor-pointer min-h-[44px]"
          >
            <Navigation className="w-4 h-4 text-[#FF6B4A]" />
            <span>Get Directions</span>
          </a>

          <a
            href="https://wa.me/254712345678"
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto bg-[#25D366] hover:bg-[#20ba59] text-white px-5 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider shadow flex items-center justify-center gap-2 transition-colors cursor-pointer min-h-[44px]"
          >
            <MessageSquare className="w-4 h-4" />
            <span>WhatsApp Us</span>
          </a>
        </div>
      </div>

      {/* Stylized Google Map Visual */}
      <div className="lg:col-span-7 bg-[#F6EBD9] min-h-[260px] sm:min-h-[360px] relative border-t lg:border-t-0 lg:border-l-2 border-amber-900/15">
        <iframe
          title="Mzingo Point Mombasa Location"
          src="https://maps.google.com/maps?q=Moi%20Avenue%20Mombasa%20Tusks&t=&z=15&ie=UTF8&iwloc=&output=embed"
          className="w-full h-full min-h-[260px] sm:min-h-[360px] border-0"
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
}
