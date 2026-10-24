import React, { useState } from 'react';
import {
  ShieldCheck,
  Luggage,
  Clock,
  MapPin,
  CalendarCheck,
  Search,
  CheckCircle2,
  Lock,
  ArrowRight,
  Briefcase,
  Home as HomeIcon,
  Plane,
  GraduationCap,
  Truck,
  Store,
  Star,
  ChevronRight,
  ChevronLeft,
  Phone,
  MessageSquare,
  HelpCircle
} from 'lucide-react';
import { translations } from '../translations';

export default function Home({ lang, setView, setSelectedPriceTier }) {
  const t = translations[lang];

  // Testimonials state
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const testimonials = [
    {
      name: "Kiprono Cheruiyot",
      role: "Job Applicant at Kenya Ports Authority (KPA)",
      location: "Eldoret to Mombasa",
      avatar: "KC",
      rating: 5,
      text_en: "Arrived at 6 AM by bus from Eldoret for a crucial interview at KPA Headquarters. Storing my heavy suitcase at Mzingo Point on Moi Avenue allowed me to shower at a nearby hotel, dress in my suit, and walk into the interview completely relaxed. Collected in the evening. Total lifesaver!",
      text_sw: "Nilifika saa 12 asubuhi kutoka Eldoret kwa ajili ya mahojiano KPA. Kuacha sanduku langu Mzingo Point Moi Avenue kulinisaidia kwenda kwenye usaili nikiwa nadhifu na bila msongo wa mawazo. Nilirudi kuchukua jioni. Huduma bora kabisa!"
    },
    {
      name: "Amina Nassir Bakari",
      role: "Relocating House Hunter",
      location: "Bamburi, Mombasa",
      avatar: "AB",
      rating: 5,
      text_en: "I was moving from Nairobi to Mombasa and had 3 days between leaving my old house and getting keys to my Nyali apartment. Stored 3 cartons and my duffel bag at Mzingo Point safely. Everything was intact and handled with extreme care.",
      text_sw: "Nilikuwa nahamia Nyali na nilikuwa na pengo la siku 3 kabla ya kupata funguo. Nilihifadhi masanduku 3 na mabegi yangu Mzingo Point. Kila kitu kilibaki salama na kilitunzwa vizuri sana."
    },
    {
      name: "Sophie Laurent",
      role: "Holiday Traveller",
      location: "Paris, France / SGR Train",
      avatar: "SL",
      rating: 5,
      text_en: "Checked out of our Nyali beach resort at 10:00 AM, but our SGR Madaraka Express train to Nairobi was scheduled for 8:00 PM. Mzingo Point held our suitcases all afternoon while we explored Fort Jesus and enjoyed Swahili dishes in Old Town bag-free!",
      text_sw: "Tulitoka hotelini saa 4 asubuhi lakini treni ya SGR ilikuwa ya saa 2 usiku. Mzingo Point walitutunzia masanduku yetu mchana mzima tukiwa tunatembelea Fort Jesus na Old Town bila kuburuta mizigo!"
    },
    {
      name: "Brian Ochieng Otieno",
      role: "Engineering Student",
      location: "Technical University of Mombasa (TUM)",
      avatar: "BO",
      rating: 5,
      text_en: "During end-of-semester recess, transporting my mattress and metal trunk back to Kisumu costs too much on buses. Storing them at Mzingo Point for a month is cheap and 100% safe. Highly recommended to all TUM students!",
      text_sw: "Wakati wa likizo ya chuo, kusafirisha godoro na sanduku la chuma hadi Kisumu ni gharama kubwa sana. Kuhifadhi Mzingo Point kwa mwezi mmoja ni bei nafuu sana na salama kabisa kwa wanafunzi wa TUM!"
    }
  ];

  const faqs = [
    {
      q_en: "What items are prohibited from storage?",
      q_sw: "Ni vitu gani haviruhusiwi kuhifadhiwa?",
      a_en: "For the safety of all clients, we strictly do not accept illegal contraband, perishable raw foods, firearms/weapons, hazardous flammable liquids, gas cylinders, or living creatures.",
      a_sw: "Kwa usalama wa wote, hatukubali dawa za kulevya au bidhaa haramu, vyakula vinavyoharibika haraka, silaha, gesi au kemikali zinazoweza kulipuka, na viumbe hai."
    },
    {
      q_en: "How does the M-Pesa payment work?",
      q_sw: "Je, malipo ya M-Pesa yanafanyikaje?",
      a_en: "When you book online, an instant M-Pesa STK push prompt is sent to your Safaricom line. Simply enter your M-Pesa PIN on your phone to complete payment. You can also pay cash or via Till Number at our counter.",
      a_sw: "Unapohifadhi mtandaoni, ujumbe wa M-Pesa STK unatumwa papo hapo kwenye simu yako. Ingiza namba yako ya siri (PIN) kukamilisha. Pia unaweza kulipa pesa taslimu au Lipa na M-Pesa kaunta."
    },
    {
      q_en: "Can a friend or family member collect my items on my behalf?",
      q_sw: "Je, rafiki au ndugu anaweza kunichukulia mzigo wangu?",
      a_en: "Yes! During collection, the nominated person must present your Booking Reference number, an authorization SMS/WhatsApp message from your registered phone number, and their own original National ID or Passport.",
      a_sw: "Ndiyo! Mtu huyo anapaswa kuonyesha nambari ya uhifadhi, ujumbe wa idhini uliotumwa kutoka kwa simu yako iliyosajiliwa, pamoja na kitambulisho chake halisi cha taifa."
    },
    {
      q_en: "What happens if I cannot collect my items on the agreed date?",
      q_sw: "Nini kitatokea nisipoweza kuchukua mzigo kwa tarehe tuliyokubaliana?",
      a_en: "No worries! You can extend your booking online through the 'Track Booking' page, or simply call us. A standard late fee of KES 100 per day applies to overdue items until collected.",
      a_sw: "Hakuna wasiwasi! Unaweza kuongeza muda mtandaoni kupitia ukurasa wa 'Kagua Uhifadhi', au kutupigia simu. Ada ya kawaida ya ucheleweshaji ni KES 100 kwa siku."
    }
  ];

  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0F2A4A] via-[#133863] to-[#0A1D33] text-white pt-12 pb-20 sm:pt-20 sm:pb-28">
        {/* Subtle Mombasa wave background overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#E75A2D_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Hero Text */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Pill Location Badge */}
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold text-amber-300 border border-white/15">
                <MapPin className="w-4 h-4 text-[#E75A2D]" />
                <span>{t.hero.locationBadge}</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-['Poppins'] leading-[1.15] text-white">
                {t.hero.title}
              </h1>

              {/* Subheading */}
              <p className="text-base sm:text-lg text-gray-200 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                {t.hero.subtitle}
              </p>

              {/* Call-to-action buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={() => { setView('book'); window.scrollTo(0, 0); }}
                  className="w-full sm:w-auto bg-[#E75A2D] hover:bg-[#d0451b] text-white px-8 py-4 rounded-xl font-bold text-base shadow-xl hover:shadow-2xl transition-all transform active:scale-95 flex items-center justify-center gap-2.5"
                >
                  <CalendarCheck className="w-5 h-5" />
                  <span>{t.hero.ctaBook}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => { setView('track'); window.scrollTo(0, 0); }}
                  className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-4 rounded-xl font-semibold text-base transition-all flex items-center justify-center gap-2 backdrop-blur-sm"
                >
                  <Search className="w-5 h-5 text-amber-300" />
                  <span>{t.hero.ctaTrack}</span>
                </button>
              </div>

              {/* Trust Badges Bar */}
              <div className="pt-6 border-t border-white/15 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-gray-200">
                <div className="flex items-center justify-center lg:justify-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{t.hero.badge1}</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
                  <span>{t.hero.badge2}</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start gap-2">
                  <Luggage className="w-4 h-4 text-[#E75A2D] shrink-0" />
                  <span>{t.hero.badge3}</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Feature Card */}
            <div className="lg:col-span-5">
              <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 text-gray-900 shadow-2xl border border-white/40 space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#E75A2D]">
                      Mombasa Storage Rates
                    </span>
                    <h3 className="text-xl font-bold font-['Poppins'] text-[#0F2A4A]">
                      Starting from KES 150
                    </h3>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-[#E75A2D]">
                    <Luggage className="w-6 h-6" />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs">
                        S
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-900">Small Luggage</p>
                        <p className="text-[11px] text-gray-500">Backpack, handbag, laptop bag</p>
                      </div>
                    </div>
                    <span className="text-sm font-extrabold text-[#0F2A4A]">KES 150 / day</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50/60 border border-amber-200">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold text-xs">
                        M
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-900">Medium Suitcase</p>
                        <p className="text-[11px] text-gray-500">Standard trolley, medium box</p>
                      </div>
                    </div>
                    <span className="text-sm font-extrabold text-[#0F2A4A]">KES 250 / day</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold text-xs">
                        L
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-900">Large Suitcase / Trunk</p>
                        <p className="text-[11px] text-gray-500">Big suitcase, 90L duffel</p>
                      </div>
                    </div>
                    <span className="text-sm font-extrabold text-[#0F2A4A]">KES 400 / day</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                        XL
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-900">Extra Large / Furniture</p>
                        <p className="text-[11px] text-gray-500">Mattress, household boxes</p>
                      </div>
                    </div>
                    <span className="text-sm font-extrabold text-[#0F2A4A]">KES 750 / day</span>
                  </div>
                </div>

                <button
                  onClick={() => { setView('pricing'); window.scrollTo(0, 0); }}
                  className="w-full bg-[#0F2A4A] hover:bg-[#1a406c] text-white py-3 rounded-xl font-bold text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-2"
                >
                  <span>Open Interactive Price Calculator</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS (4 STEPS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[#E75A2D] bg-[#E75A2D]/10 px-3 py-1 rounded-full">
            {t.howItWorks.badge}
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-['Poppins'] text-[#0F2A4A] mt-3">
            {t.howItWorks.title}
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            {t.howItWorks.desc}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Step 1 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md hover:border-amber-300 transition-all relative group">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-lg mb-4 group-hover:scale-110 transition-transform">
              1
            </div>
            <h3 className="font-bold text-base text-[#0F2A4A] mb-2 font-['Poppins']">
              {t.howItWorks.step1Title}
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              {t.howItWorks.step1Desc}
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md hover:border-amber-300 transition-all relative group">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 text-[#E75A2D] flex items-center justify-center font-bold text-lg mb-4 group-hover:scale-110 transition-transform">
              2
            </div>
            <h3 className="font-bold text-base text-[#0F2A4A] mb-2 font-['Poppins']">
              {t.howItWorks.step2Title}
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              {t.howItWorks.step2Desc}
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md hover:border-amber-300 transition-all relative group">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-lg mb-4 group-hover:scale-110 transition-transform">
              3
            </div>
            <h3 className="font-bold text-base text-[#0F2A4A] mb-2 font-['Poppins']">
              {t.howItWorks.step3Title}
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              {t.howItWorks.step3Desc}
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md hover:border-amber-300 transition-all relative group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg mb-4 group-hover:scale-110 transition-transform">
              4
            </div>
            <h3 className="font-bold text-base text-[#0F2A4A] mb-2 font-['Poppins']">
              {t.howItWorks.step4Title}
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              {t.howItWorks.step4Desc}
            </p>
          </div>
        </div>
      </section>

      {/* USE CASE CARDS */}
      <section className="bg-white py-16 border-y border-gray-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#E75A2D] bg-[#E75A2D]/10 px-3 py-1 rounded-full">
              {t.useCases.badge}
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold font-['Poppins'] text-[#0F2A4A] mt-3">
              {t.useCases.title}
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mt-2">
              {t.useCases.desc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="p-6 rounded-2xl bg-[#F8F9FA] border border-gray-200 hover:border-[#0F2A4A] hover:bg-white transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <Briefcase className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-[#0F2A4A] font-['Poppins']">
                {t.useCases.c1Title}
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                {t.useCases.c1Desc}
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-6 rounded-2xl bg-[#F8F9FA] border border-gray-200 hover:border-[#0F2A4A] hover:bg-white transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <HomeIcon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-[#0F2A4A] font-['Poppins']">
                {t.useCases.c2Title}
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                {t.useCases.c2Desc}
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-6 rounded-2xl bg-[#F8F9FA] border border-gray-200 hover:border-[#0F2A4A] hover:bg-white transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#E75A2D] flex items-center justify-center">
                <Plane className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-[#0F2A4A] font-['Poppins']">
                {t.useCases.c3Title}
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                {t.useCases.c3Desc}
              </p>
            </div>

            {/* Card 4 */}
            <div className="p-6 rounded-2xl bg-[#F8F9FA] border border-gray-200 hover:border-[#0F2A4A] hover:bg-white transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-[#0F2A4A] font-['Poppins']">
                {t.useCases.c4Title}
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                {t.useCases.c4Desc}
              </p>
            </div>

            {/* Card 5 */}
            <div className="p-6 rounded-2xl bg-[#F8F9FA] border border-gray-200 hover:border-[#0F2A4A] hover:bg-white transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-[#0F2A4A] font-['Poppins']">
                {t.useCases.c5Title}
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                {t.useCases.c5Desc}
              </p>
            </div>

            {/* Card 6 */}
            <div className="p-6 rounded-2xl bg-[#F8F9FA] border border-gray-200 hover:border-[#0F2A4A] hover:bg-white transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
                <Store className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-[#0F2A4A] font-['Poppins']">
                {t.useCases.c6Title}
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                {t.useCases.c6Desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[#E75A2D] bg-[#E75A2D]/10 px-3 py-1 rounded-full">
            {t.whyUs.badge}
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-['Poppins'] text-[#0F2A4A] mt-3">
            {t.whyUs.title}
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            {t.whyUs.desc}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-2.5">
            <ShieldCheck className="w-7 h-7 text-[#0F2A4A]" />
            <h3 className="font-bold text-base text-[#0F2A4A] font-['Poppins']">{t.whyUs.p1Title}</h3>
            <p className="text-xs text-gray-600 leading-relaxed">{t.whyUs.p1Desc}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-2.5">
            <Luggage className="w-7 h-7 text-[#E75A2D]" />
            <h3 className="font-bold text-base text-[#0F2A4A] font-['Poppins']">{t.whyUs.p2Title}</h3>
            <p className="text-xs text-gray-600 leading-relaxed">{t.whyUs.p2Desc}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-2.5">
            <Clock className="w-7 h-7 text-amber-500" />
            <h3 className="font-bold text-base text-[#0F2A4A] font-['Poppins']">{t.whyUs.p3Title}</h3>
            <p className="text-xs text-gray-600 leading-relaxed">{t.whyUs.p3Desc}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-2.5">
            <Lock className="w-7 h-7 text-indigo-600" />
            <h3 className="font-bold text-base text-[#0F2A4A] font-['Poppins']">{t.whyUs.p4Title}</h3>
            <p className="text-xs text-gray-600 leading-relaxed">{t.whyUs.p4Desc}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-2.5">
            <CheckCircle2 className="w-7 h-7 text-emerald-600" />
            <h3 className="font-bold text-base text-[#0F2A4A] font-['Poppins']">{t.whyUs.p5Title}</h3>
            <p className="text-xs text-gray-600 leading-relaxed">{t.whyUs.p5Desc}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-2.5">
            <MapPin className="w-7 h-7 text-rose-600" />
            <h3 className="font-bold text-base text-[#0F2A4A] font-['Poppins']">{t.whyUs.p6Title}</h3>
            <p className="text-xs text-gray-600 leading-relaxed">{t.whyUs.p6Desc}</p>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS CAROUSEL */}
      <section className="bg-gradient-to-r from-[#0F2A4A] to-[#163863] text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300 bg-white/10 px-3 py-1 rounded-full">
              Customer Reviews • Shuhuda za Wateja
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-['Poppins'] mt-3">
              Trusted by Travellers, Job Seekers & Movers
            </h2>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 sm:p-10 border border-white/20 relative shadow-xl">
            <div className="flex items-center gap-1 text-amber-400 mb-4">
              {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-400 stroke-none" />
              ))}
            </div>

            <p className="text-base sm:text-xl font-normal leading-relaxed text-gray-100 italic min-h-[90px]">
              "{lang === 'sw' ? testimonials[activeTestimonial].text_sw : testimonials[activeTestimonial].text_en}"
            </p>

            <div className="flex items-center justify-between pt-6 border-t border-white/15 mt-6">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-[#E75A2D] text-white flex items-center justify-center font-bold text-sm shadow">
                  {testimonials[activeTestimonial].avatar}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">
                    {testimonials[activeTestimonial].name}
                  </h4>
                  <p className="text-xs text-amber-200">
                    {testimonials[activeTestimonial].role} • {testimonials[activeTestimonial].location}
                  </p>
                </div>
              </div>

              {/* Prev / Next Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTestimonial((prev) => (prev > 0 ? prev - 1 : testimonials.length - 1))}
                  className="p-2 rounded-full bg-white/15 hover:bg-white/30 text-white transition-colors"
                  aria-label="Previous Testimonial"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setActiveTestimonial((prev) => (prev < testimonials.length - 1 ? prev + 1 : 0))}
                  className="p-2 rounded-full bg-white/15 hover:bg-white/30 text-white transition-colors"
                  aria-label="Next Testimonial"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ PREVIEW ACCORDION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#E75A2D] bg-[#E75A2D]/10 px-3 py-1 rounded-full">
            Frequently Asked Questions
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-['Poppins'] text-[#0F2A4A] mt-3">
            Got Questions? We Have Answers.
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-[#0F2A4A] hover:bg-gray-50 transition-colors"
              >
                <span>{lang === 'sw' ? faq.q_sw : faq.q_en}</span>
                <span className="text-[#E75A2D] text-lg font-bold">
                  {openFaq === idx ? '−' : '+'}
                </span>
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-5 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                  {lang === 'sw' ? faq.a_sw : faq.a_en}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-6">
          <button
            onClick={() => { setView('faq'); window.scrollTo(0, 0); }}
            className="text-xs font-bold text-[#E75A2D] hover:underline inline-flex items-center gap-1"
          >
            <span>{lang === 'sw' ? 'Tazama maswali yote (FAQ)' : 'View full FAQ page'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* MOMBASA LOCATION MAP & CONTACT STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm grid grid-cols-1 lg:grid-cols-12">
          {/* Location info */}
          <div className="lg:col-span-5 p-8 sm:p-10 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#E75A2D] bg-[#E75A2D]/10 px-3 py-1 rounded-full">
                Mombasa CBD Hub
              </span>
              <h3 className="text-2xl font-extrabold font-['Poppins'] text-[#0F2A4A]">
                Easy to Find on Moi Avenue
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Right opposite the world-famous aluminum Mombasa Tusks and adjacent to the Central Post Office. Perfectly central for arriving via SGR shuttle, Likoni Ferry, or airport taxi.
              </p>

              <div className="space-y-3 pt-2 text-xs text-gray-700">
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-[#E75A2D] shrink-0" />
                  <span>Moi Avenue, Opp. Mombasa Tusks, Mombasa</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Open Daily 6:30 AM to 8:30 PM (Mon - Sun)</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>+254 712 345 678 (Calls & WhatsApp)</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex flex-wrap gap-3">
              <a
                href="https://wa.me/254712345678"
                target="_blank"
                rel="noreferrer"
                className="bg-[#25D366] hover:bg-[#20ba59] text-white text-xs px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-xs transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp Us</span>
              </a>
              <a
                href="tel:+254712345678"
                className="bg-[#0F2A4A] hover:bg-[#1a406c] text-white text-xs px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-xs transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>Direct Call</span>
              </a>
            </div>
          </div>

          {/* Interactive Map Visual */}
          <div className="lg:col-span-7 bg-gray-100 min-h-[300px] relative border-t lg:border-t-0 lg:border-l border-gray-200">
            {/* Google Map iframe simulation centered on Moi Ave Mombasa */}
            <iframe
              title="Mzingo Point Location Mombasa"
              src="https://maps.google.com/maps?q=Moi%20Avenue%20Mombasa%20Tusks&t=&z=15&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full min-h-[320px] border-0"
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </section>

      {/* BOTTOM CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#E75A2D] to-amber-500 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-extrabold font-['Poppins']">
              {lang === 'sw' ? 'Mizigo yako ipo mikononi salama.' : 'Your belongings are in safe hands.'}
            </h3>
            <p className="text-amber-100 text-sm max-w-xl">
              {lang === 'sw'
                ? 'Weka nafasi sasa kwa sekunde chache. Hakuna haja ya kuburuta masanduku Mombasa!'
                : 'Book online in seconds or walk in directly. Move freely across Mombasa today.'}
            </p>
          </div>
          <button
            onClick={() => { setView('book'); window.scrollTo(0, 0); }}
            className="bg-[#0F2A4A] hover:bg-[#071626] text-white px-8 py-3.5 rounded-xl font-bold text-sm shadow-md transition-all shrink-0 active:scale-95"
          >
            {t.hero.ctaBook}
          </button>
        </div>
      </section>
    </div>
  );
}
