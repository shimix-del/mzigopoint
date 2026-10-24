import React, { useState } from 'react';
import { Search, HelpCircle, ChevronDown, ChevronUp, AlertCircle, ShieldAlert, Sparkles, MessageSquare } from 'lucide-react';
import { translations } from '../translations';
import { DhowIcon, TagGrommet } from '../components/SwahiliMotifs';

export default function Faq({ lang, setView }) {
  const t = translations[lang];
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const faqList = [
    {
      category: 'items',
      q_en: 'What items are strictly NOT accepted for storage?',
      q_sw: 'Ni vitu gani ambavyo HAVIRUHUSIWI kabisa kuhifadhiwa?',
      a_en: 'To ensure safety and comply with Kenyan law, Mzingo Point strictly prohibits: 1) Illegal goods, narcotics, and contraband; 2) Perishable foodstuffs, fresh seafood, raw meats, or rotting organic matter; 3) Hazardous chemicals, petrol, solvents, gas cylinders, and fireworks; 4) Firearms, ammunition, or prohibited bladed weapons; 5) Live animals or biological specimens. All items may be visually inspected prior to acceptance.',
      a_sw: 'Kwa ajili ya usalama wa jengo na kuzingatia sheria za Kenya, Mzingo Point haikubali: 1) Dawa za kulevya au bidhaa haramu; 2) Vyakula vibichi vinavyoharibika kama samaki, nyama, au maziwa; 3) Mafuta ya petroli, mitungi ya gesi, na baruti; 4) Silaha za moto au risasi; 5) Wanyama hai. Mizigo yote inakaguliwa kabla ya kupokelewa.'
    },
    {
      category: 'collection',
      q_en: 'Can someone else collect my luggage on my behalf?',
      q_sw: 'Je, mtu mwingine anaweza kunichukulia mzigo wangu?',
      a_en: 'Yes. If you cannot pick up your items personally, you must send an authorization SMS or WhatsApp message from your registered phone number stating the nominated person’s full name and National ID number. The nominated collector must present your Booking Reference (or QR tag) and their physical National ID card at our counter before goods are released.',
      a_sw: 'Ndiyo. Ikiwa huwezi kufika mwenyewe, unatakiwa kutuma ujumbe wa SMS au WhatsApp kutoka namba yako uliyosajili, ukimtaja jina kamili na namba ya kitambulisho cha mtu anayekuja. Mtu huyo lazima aonyeshe namba ya mzigo (au picha ya QR) na kitambulisho chake halisi kabla ya kukabidhiwa.'
    },
    {
      category: 'collection',
      q_en: 'What happens if I lose my digital receipt or booking reference?',
      q_sw: 'Nini kitatokea nikipoteza risiti yangu au nambari ya uhifadhi?',
      a_en: 'Do not panic! Come directly to our counter with the original physical National ID or Passport you used during booking. Our attendant will verify your identity, verify your registered phone number with an instant one-time SMS verification code, and release your belongings after you sign the collection registry.',
      a_sw: 'Usijali! Fika kaunta yetu na Kitambulisho chako halisi cha Taifa au Pasipoti uliyotumia wakati wa kuhifadhi. Mhudumu atathibitisha namba yako ya simu kwa kutuma msimbo wa OTP na kukukabidhi vitu vyako baada ya kuweka saini.'
    },
    {
      category: 'policy',
      q_en: 'What happens if I do not come back to collect my items?',
      q_sw: 'Nini kinatokea nisiporudi kuchukua mzigo wangu?',
      a_en: 'We hold your items safely. For any overdue days past your scheduled pick-up date, a standard late storage charge of KES 100 per item/day is added. If goods remain unclaimed after 30 days and the customer cannot be reached after multiple official notifications via SMS, WhatsApp, and registered mail, the items are handled in strict accordance with the Kenya Disposal of Uncollected Goods Act (Cap. 38).',
      a_sw: 'Tunatunza vitu vyako kwa usalama. Kwa kila siku inayozidi tarehe uliyopanga, ada ya kawaida ya KES 100 kwa siku inaongezwa. Mzigo usipochukuliwa baada ya siku 30 na mteja asipopatikana kwenye simu au SMS, taratibu za kisheria za Kenya za Vitu Visivyodaiwa (Cap. 38) hufuatwa.'
    },
    {
      category: 'duration',
      q_en: 'How do I extend my storage duration if my plans change?',
      q_sw: 'Je, nawezaje kuongeza siku za uhifadhi mipango ikibadilika?',
      a_en: 'You can extend your booking in under 30 seconds! Go to our "Track Booking" page on our website, enter your reference (e.g. MZP-2026-0001) and phone number, and click "Extend My Storage Period". Select your new date, and pay the difference online via M-Pesa or at the counter upon collection.',
      a_sw: 'Unaweza kuongeza muda wako mtandaoni chini ya sekunde 30! Fungua ukurasa wa "Kagua Uhifadhi", weka nambari yako ya uhifadhi na simu, kisha bonyeza "Ongeza Muda". Chagua tarehe mpya, na unaweza kulipa salio mtandaoni kwa M-Pesa au kaunta ukija kuchukua.'
    },
    {
      category: 'safety',
      q_en: 'Is it safe to store laptops, electronics, and documents?',
      q_sw: 'Je, ni salama kuhifadhi kompyuta (laptop), nyaraka na vifaa vya elektroniki?',
      a_en: 'Yes. We offer lockable internal secure compartments for laptops, cameras, and delicate work folders. Be sure to check the "Fragile" box during booking so our staff assigns a padded shelf. Note that high-value jewelry or large sums of cash must not be left in storage.',
      a_sw: 'Ndiyo. Tuna sehemu maalum zilizofungwa kwa ajili ya kompyuta mpakato, kamera na nyaraka muhimu. Hakikisha unachagua chaguo la "Fragile" ili mhudumu akuwekee kwenye sehemu salama zaidi. Hata hivyo, fedha taslimu nyingi na dhahabu haziruhusiwi kuachwa.'
    },
    {
      category: 'payment',
      q_en: 'What payment methods do you accept?',
      q_sw: 'Mnakubali njia zipi za malipo?',
      a_en: 'We accept M-Pesa STK push online (instant prompt on your phone), Lipa na M-Pesa Till Number at our counter, and Cash in Kenya Shillings (KES). Receipts with itemised breakdown and QR code are issued immediately.',
      a_sw: 'Tunakubali M-Pesa mtandaoni (STK push moja kwa moja kwenye simu yako), Lipa na M-Pesa Buy Goods Till kaunta, na Pesa Taslimu (Cash) kwa Shilingi za Kenya (KES).'
    }
  ];

  const [expandedFaq, setExpandedFaq] = useState(0);

  const filteredFaqs = faqList.filter((f) => {
    const matchesCategory = activeCategory === 'all' || f.category === activeCategory;
    const query = searchTerm.toLowerCase();
    const matchesSearch =
      f.q_en.toLowerCase().includes(query) ||
      f.a_en.toLowerCase().includes(query) ||
      f.q_sw.toLowerCase().includes(query) ||
      f.a_sw.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen py-10 sm:py-16 px-4 sm:px-6 lg:px-8 relative bg-gradient-to-b from-[#F6EBD9]/40 via-white to-[#F6EBD9]/20">
      <div className="max-w-4xl mx-auto space-y-12">

        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#13B5B1]/10 border border-[#13B5B1]/20 text-[#0B2545] text-xs font-bold uppercase tracking-widest">
            <HelpCircle className="w-3.5 h-3.5 text-[#13B5B1]" />
            <span>{lang === 'sw' ? 'Msaada na Mwongozo • Mombasa' : 'Knowledge Base & Answers'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black font-['Syne',sans-serif] text-[#0B2545] tracking-tight">
            {lang === 'sw' ? 'Maswali Yanayoulizwa Mara kwa Mara' : 'Frequently Asked Questions'}
          </h1>
          <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto">
            {lang === 'sw'
              ? 'Majibu ya haraka kuhusu usalama wa mizigo, vitu visivyoruhusiwa, malipo ya M-Pesa, na jinsi ya kuchukua mzigo wako.'
              : 'Clear answers on security procedures, acceptable luggage, M-Pesa payments, and collection verification.'}
          </p>
        </div>

        {/* Search Input */}
        <div className="relative max-w-xl mx-auto">
          <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={lang === 'sw' ? 'Tafuta swali lolote (M-Pesa, Laptop, Kuchelewa)...' : 'Search any question (e.g. M-Pesa, Laptop, Extension, Legal)...'}
            className="w-full text-sm pl-12 pr-4 py-4 rounded-2xl border border-gray-200 bg-white focus:outline-none focus:border-[#13B5B1] focus:ring-2 focus:ring-[#13B5B1]/20 shadow-md transition-all font-medium"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap justify-center gap-2 text-xs">
          {[
            { id: 'all', label: lang === 'sw' ? 'Yote' : 'All Questions' },
            { id: 'items', label: lang === 'sw' ? 'Vitu Visivyoruhusiwa' : 'Prohibited Goods' },
            { id: 'collection', label: lang === 'sw' ? 'Kuchukua Mzigo' : 'Collection & Receipts' },
            { id: 'duration', label: lang === 'sw' ? 'Kuongeza Muda' : 'Extending Storage' },
            { id: 'safety', label: lang === 'sw' ? 'Usalama wa Vifaa' : 'Safety & Electronics' },
            { id: 'payment', label: lang === 'sw' ? 'Malipo ya M-Pesa' : 'Payments & Pricing' }
          ].map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              className={`px-4 py-2 rounded-full font-bold transition-all ${
                activeCategory === c.id
                  ? 'bg-[#0B2545] text-white shadow-md'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Prohibited items warning callout */}
        <div className="p-5 rounded-3xl bg-amber-50 border border-amber-200/90 text-xs sm:text-sm text-amber-950 flex items-start gap-3.5 shadow-xs">
          <ShieldAlert className="w-5 h-5 text-[#FF6B4A] shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="block font-bold text-[#0B2545] mb-0.5">Strict Prohibited Goods Policy:</strong>
            Perishables (raw meat, fresh seafood), petroleum solvents, gas cylinders, weapons, and narcotics are strictly forbidden on premises. Any violation will be handed over to the Kenya Police immediately.
          </div>
        </div>

        {/* Accordion FAQ Items */}
        <div className="space-y-3.5">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, idx) => {
              const isExpanded = expandedFaq === idx;
              return (
                <div
                  key={idx}
                  className={`bg-white rounded-3xl border transition-all duration-300 overflow-hidden ${
                    isExpanded
                      ? 'border-[#13B5B1] shadow-lg ring-1 ring-[#13B5B1]/20'
                      : 'border-gray-200 hover:border-gray-300 shadow-xs'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setExpandedFaq(isExpanded ? -1 : idx)}
                    className="w-full text-left p-6 flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-[#0B2545] hover:bg-gray-50/50 transition-colors"
                  >
                    <span className="font-['Syne'] font-bold">{lang === 'sw' ? faq.q_sw : faq.q_en}</span>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform ${
                      isExpanded ? 'bg-[#FF6B4A] text-white rotate-180' : 'bg-gray-100 text-gray-500'
                    }`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>
                  {isExpanded && (
                    <div className="px-6 pb-6 pt-1 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100 animate-in fade-in duration-200">
                      {lang === 'sw' ? faq.a_sw : faq.a_en}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 text-xs sm:text-sm text-gray-400">
              No matching questions found for "{searchTerm}". Search another term or chat with our desk on WhatsApp below.
            </div>
          )}
        </div>

        {/* Still need help callout */}
        <div className="bg-[#0B2545] rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-5 border border-white/10 shadow-xl">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-black text-lg font-['Syne']">Need assistance with your luggage right now?</h4>
            <p className="text-xs sm:text-sm text-gray-300">Our Mombasa attendants are stationed at Moi Avenue and reply in minutes.</p>
          </div>
          <a
            href="https://wa.me/254712345678"
            target="_blank"
            rel="noreferrer"
            className="bg-[#25D366] hover:bg-[#20ba59] text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg shrink-0 flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>

      </div>
    </div>
  );
}
