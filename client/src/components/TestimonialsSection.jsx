import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { TagGrommet, DhowIcon } from './SwahiliMotifs';

export default function TestimonialsSection({ lang }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "Kiprono Cheruiyot",
      route: "Eldoret ➔ Mombasa",
      purpose: "KPA Interview Candidate",
      avatar: "KC",
      quote_en: "Arrived at 6 AM on a night bus from Eldoret for an interview at KPA Headquarters. Storing my heavy suitcase at Mzingo Point on Moi Avenue allowed me to freshen up nearby and walk into the interview completely relaxed. Collected in the evening. Total lifesaver!",
      quote_sw: "Nilifika saa 12 asubuhi kutoka Eldoret kwa ajili ya mahojiano KPA. Kuacha sanduku langu Mzingo Point Moi Avenue kulinisaidia kwenda kwenye usaili nikiwa nadhifu na bila msongo wa mawazo. Nilirudi kuchukua jioni. Huduma bora kabisa!"
    },
    {
      id: 2,
      name: "Sophie & Pierre Laurent",
      route: "Paris ➔ Diani Beach / SGR",
      purpose: "Old Town & SGR Layover",
      avatar: "SL",
      quote_en: "Checked out of our Nyali beach resort at 10 AM, but our SGR train to Nairobi was at 8 PM. Mzingo Point held our suitcases all afternoon while we explored Fort Jesus and enjoyed Swahili dishes in Old Town completely bag-free!",
      quote_sw: "Tulitoka hotelini saa 4 asubuhi lakini treni ya SGR ilikuwa ya saa 2 usiku. Mzingo Point walitutunzia masanduku yetu mchana mzima tukiwa tunatembelea Fort Jesus na Old Town bila kuburuta mizigo!"
    },
    {
      id: 3,
      name: "Amina Nassir Bakari",
      route: "Nairobi ➔ Nyali",
      purpose: "Relocating House Hunter",
      avatar: "AB",
      quote_en: "I was moving from Nairobi to Mombasa and had 3 days between leaving my old house and getting keys to my Nyali apartment. Stored 3 cartons and my duffel bag at Mzingo Point safely. Everything was intact and handled with extreme care.",
      quote_sw: "Nilikuwa nahamia Nyali na nilikuwa na pengo la siku 3 kabla ya kupata funguo. Nilihifadhi masanduku 3 na mabegi yangu Mzingo Point. Kila kitu kilibaki salama na kilitunzwa vizuri sana."
    },
    {
      id: 4,
      name: "Brian Ochieng Otieno",
      route: "TUM ➔ Kisumu",
      purpose: "Engineering Student Recess",
      avatar: "BO",
      quote_en: "Transporting my mattress and metal trunk back to Kisumu costs too much on buses during recess. Storing them at Mzingo Point for a month is cheap, lockable, and 100% safe. Highly recommended to all TUM students!",
      quote_sw: "Wakati wa likizo ya chuo, kusafirisha godoro na sanduku la chuma hadi Kisumu ni gharama kubwa sana. Kuhifadhi Mzingo Point kwa mwezi mmoja ni bei nafuu sana na salama kabisa kwa wanafunzi wa TUM!"
    }
  ];

  const current = testimonials[currentIndex];

  const handlePrev = () => {
    setCurrentIndex(prev => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-mono font-bold tracking-widest text-[#FF6B4A] uppercase bg-[#FF6B4A]/10 px-3.5 py-1 rounded-full">
          TRAVEL STORIES • SHUHUDA
        </span>
        <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-[#0B2545]">
          {lang === 'sw' ? 'Wateja Wetu Wanasemaje?' : 'Trusted Across the Swahili Coast'}
        </h2>
        <p className="text-xs sm:text-sm text-gray-600 max-w-lg mx-auto">
          Hear from job applicants, holiday makers, students, and movers who entrusted their belongings to us.
        </p>
      </div>

      {/* Main Review Card */}
      <div className="max-w-3xl mx-auto bg-white rounded-3xl p-5 sm:p-8 lg:p-12 border-2 border-amber-900/15 shadow-xl relative overflow-hidden">
        {/* Giant decorative quotation mark */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-8 text-amber-200/40 select-none pointer-events-none">
          <Quote className="w-16 h-16 sm:w-24 sm:h-24 stroke-none fill-current" />
        </div>

        <div className="relative z-10 space-y-4 sm:space-y-6">
          <div className="flex items-center gap-1 text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-400 stroke-none" />
            ))}
          </div>

          <p className="font-display text-base sm:text-xl text-[#0B2545] leading-relaxed italic">
            "{lang === 'sw' ? current.quote_sw : current.quote_en}"
          </p>

          <div className="pt-4 sm:pt-6 border-t border-dashed border-gray-200 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-[#0B2545] to-[#13B5B1] text-white flex items-center justify-center font-display font-bold text-sm sm:text-base shadow-sm shrink-0">
                {current.avatar}
              </div>
              <div className="min-w-0">
                <strong className="block font-display font-bold text-sm sm:text-base text-[#0B2545] truncate">
                  {current.name}
                </strong>
                <span className="text-[11px] text-[#FF6B4A] font-mono font-bold block truncate">
                  {current.purpose} • {current.route}
                </span>
              </div>
            </div>

            {/* Prev / Next controls */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                type="button"
                onClick={handlePrev}
                className="w-11 h-11 rounded-2xl bg-gray-100 hover:bg-[#0B2545] hover:text-white active:scale-95 text-gray-700 flex items-center justify-center transition-all cursor-pointer min-h-[44px] min-w-[44px]"
                aria-label="Previous Testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="w-11 h-11 rounded-2xl bg-gray-100 hover:bg-[#0B2545] hover:text-white active:scale-95 text-gray-700 flex items-center justify-center transition-all cursor-pointer min-h-[44px] min-w-[44px]"
                aria-label="Next Testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
