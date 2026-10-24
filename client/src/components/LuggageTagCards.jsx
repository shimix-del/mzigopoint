import React, { useState } from 'react';
import { TagGrommet, DhowIcon } from './SwahiliMotifs';
import { Briefcase, Home, Plane, GraduationCap, Truck, Store, ArrowRight, RotateCw } from 'lucide-react';

export default function LuggageTagCards({ lang, onSelectUseCase }) {
  const [flippedCards, setFlippedCards] = useState({});

  const toggleFlip = (id) => {
    setFlippedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const useCases = [
    {
      id: "interview",
      tagCode: "KPA-01",
      icon: Briefcase,
      color: "bg-blue-600",
      accent: "border-blue-400",
      title_en: "Job Interviews & Exams",
      title_sw: "Mahojiano ya Kazi & Usaili",
      short_en: "Arrived via Modern Coast or Tahmeed at 6 AM? Walk into KPA, Kenya Navy, or Coast General interviews sharp, fresh, and unburdened.",
      short_sw: "Umetoka mashambani asubuhi na mapema kwa usaili KPA au Hospitali Kuu? Acha masanduku hapa na uingie ukiwa nadhifu.",
      story_en: "Kiprono arrived from Eldoret with two bulky suitcases. Instead of dragging them to the port gates, he locked them in Locker S-04, freshened up, and aced his interview.",
      story_sw: "Kiprono aliwasili kutoka Eldoret na masanduku mawili. Badala ya kuburuta hadi geti la bandari, aliweka salama Mzingo Point na kufanya usaili kwa utulivu mkubwa."
    },
    {
      id: "househunting",
      tagCode: "NYL-02",
      icon: Home,
      color: "bg-amber-600",
      accent: "border-amber-400",
      title_en: "House Hunting in Mombasa",
      title_sw: "Kusaka Nyumba ya Kupanga",
      short_en: "Searching for rentals in Nyali, Kizingo, or Bamburi? Don't pay steep hotel bills just to store your cartons while touring houses.",
      short_sw: "Unatafuta chumba Nyali, Bamburi au Kizingo? Usilipe hoteli ghali kwa ajili ya kutunza masanduku yako ukisaka nyumba.",
      story_en: "Amina had a 3-day gap between moving to the Coast and getting her apartment keys. She safely stored 3 cartons for KES 750/day and toured apartments bag-free.",
      story_sw: "Amina alikuwa na pengo la siku 3 kabla ya kuingia kwenye nyumba yake mpya. Alihifadhi katoni zake 3 kwa usalama na kutembelea nyumba bila mzigo wowote."
    },
    {
      id: "travelling",
      tagCode: "SGR-03",
      icon: Plane,
      color: "bg-[#FF6B4A]",
      accent: "border-orange-400",
      title_en: "SGR Layover & Travellers",
      title_sw: "Wasafiri wa Treni ya SGR",
      short_en: "Resort check-out is 10:00 AM, but your SGR train leaves at 8:00 PM? Leave your bags on Moi Avenue and spend your day at Fort Jesus & Old Town.",
      short_sw: "Check-out ya hoteli ni saa 4 asubuhi lakini treni ya SGR ni saa 2 usiku? Acha mizigo yako Moi Avenue na utembee Fort Jesus bila shida.",
      story_en: "Sophie & Pierre enjoyed traditional Swahili biryani and historical alleyway walks in Old Town all afternoon before boarding their evening train.",
      story_sw: "Sophie na Pierre walifurahia chakula cha biryani na kutembea Mji Mkongwe mchana mzima kabla ya kwenda kituo cha treni ya jioni."
    },
    {
      id: "students",
      tagCode: "TUM-04",
      icon: GraduationCap,
      color: "bg-emerald-600",
      accent: "border-emerald-400",
      title_en: "University Recess",
      title_sw: "Wanafunzi wa Vyuo Vikuu",
      short_en: "Students at TUM, UoN, or KMTC: avoid exorbitant bus luggage freight back upcountry. Store trunks, mattresses & appliances safely for the holiday.",
      short_sw: "Wanafunzi wa TUM au KMTC: epuka usumbufu wa kusafirisha magodoro na masanduku mashambani. Hifadhi kwa bei nafuu wakati wa likizo.",
      story_en: "Brian stored his student mattress and metal trunk for a full month for just KES 3,200. Returned to college with everything exactly as left.",
      story_sw: "Brian alihifadhi godoro na sanduku la chuma kwa mwezi mzima kwa KES 3,200 tu. Alirudi chuoni akakuta vitu vyake vikiwa safi kabisa."
    },
    {
      id: "moving",
      tagCode: "MOV-05",
      icon: Truck,
      color: "bg-purple-600",
      accent: "border-purple-400",
      title_en: "Moving House & Rentals",
      title_sw: "Kuhama Nyumba & Makazi",
      short_en: "Temporary gap between rental lease dates? Store your living room furniture, appliances, and crates in our dry, secure ground bays.",
      short_sw: "Una siku chache kabla ya kuingia kwenye nyumba mpya? Hifadhi vyombo, fenicha na masanduku kwenye vyumba vyetu salama.",
      story_en: "David kept his disassembled furniture and kitchen crates safe for 5 days while his new house in Bamburi was being painted.",
      story_sw: "David alitunza fenicha na vyombo vyake kwa siku 5 nyumba yake mpya Bamburi ilipokuwa ikipakwa rangi."
    },
    {
      id: "traders",
      tagCode: "TRD-06",
      icon: Store,
      color: "bg-rose-600",
      accent: "border-rose-400",
      title_en: "Trade Shows & Vendors",
      title_sw: "Maonyesho ya Biashara",
      short_en: "Exhibiting at the Mombasa International Show or CBD trade fairs? Safe central overnight inventory and display booth storage.",
      short_sw: "Una maonyesho ya biashara Mombasa? Hifadhi bidhaa, sampuli na mabango yako katikati ya jiji ukiwa na uwezo wa kuchukua kila siku.",
      story_en: "Exhibitors store merchandise samples right on Moi Avenue with easy 6:30 AM retrieval before trade doors open.",
      story_sw: "Wafanyabiashara wanahifadhi sampuli zao Moi Avenue na kuzichukua asubuhi mapema saa 12:30 kabla milango ya maonyesho kufunguliwa."
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {useCases.map((uc) => {
        const Icon = uc.icon;
        const isFlipped = flippedCards[uc.id];

        return (
          <div
            key={uc.id}
            onClick={() => toggleFlip(uc.id)}
            className="group relative cursor-pointer select-none perspective-1000 min-h-[320px] transition-transform duration-300 hover:-translate-y-1"
          >
            {/* Luggage Tag Shaped Container */}
            <div
              className={`w-full h-full rounded-3xl p-6 transition-all duration-500 border-2 ${
                isFlipped
                  ? 'bg-[#0B2545] text-[#F6EBD9] border-[#FF6B4A] shadow-2xl'
                  : 'bg-white text-[#12161A] border-amber-900/15 hover:border-amber-900/30 shadow-md hover:shadow-xl'
              } flex flex-col justify-between`}
            >
              {/* Tag Header with Brass Grommet and Tag Code */}
              <div>
                <div className="flex justify-between items-center pb-3 border-b border-dashed border-gray-300/50 mb-4">
                  <div className="flex items-center gap-2">
                    <TagGrommet className="w-5 h-5" />
                    <span className="font-mono text-[10px] font-bold tracking-widest uppercase opacity-75">
                      MZP // TAG {uc.tagCode}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#FF6B4A] font-bold flex items-center gap-1 group-hover:rotate-180 transition-transform duration-500">
                    <RotateCw className="w-3 h-3" />
                    <span>{isFlipped ? 'BACK' : 'STORY'}</span>
                  </span>
                </div>

                {/* Front Side Content */}
                {!isFlipped ? (
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-900 border border-amber-200 flex items-center justify-center mb-3">
                      <Icon className="w-6 h-6 stroke-[2.2] text-[#0B2545]" />
                    </div>

                    <h3 className="font-display font-bold text-xl text-[#0B2545] leading-snug">
                      {lang === 'sw' ? uc.title_sw : uc.title_en}
                    </h3>

                    <p className="text-xs text-gray-600 leading-relaxed">
                      {lang === 'sw' ? uc.short_sw : uc.short_en}
                    </p>
                  </div>
                ) : (
                  /* Back Side Real Customer Story */
                  <div className="space-y-3 animate-in fade-in duration-300">
                    <div className="inline-block px-2.5 py-0.5 rounded-full bg-[#FF6B4A]/20 text-[#FF6B4A] text-[10px] font-mono font-bold tracking-wider uppercase">
                      REAL MOMBASA STORY
                    </div>

                    <h4 className="font-display font-bold text-lg text-white">
                      {lang === 'sw' ? uc.title_sw : uc.title_en}
                    </h4>

                    <p className="text-xs text-gray-200 leading-relaxed italic border-l-2 border-[#13B5B1] pl-3 py-1">
                      "{lang === 'sw' ? uc.story_sw : uc.story_en}"
                    </p>
                  </div>
                )}
              </div>

              {/* Tag Bottom Perforation / CTA */}
              <div className="pt-4 border-t border-dashed border-gray-300/40 flex justify-between items-center text-xs">
                <span className="font-mono text-[11px] text-[#13B5B1] font-bold uppercase">
                  MOMBASA SAFE STORAGE
                </span>
                <span className="text-[11px] font-bold text-[#FF6B4A] flex items-center gap-1">
                  <span>{isFlipped ? 'Tap to flip' : 'Read Story'}</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
