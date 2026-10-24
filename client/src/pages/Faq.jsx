import React, { useState } from 'react';
import { Search, HelpCircle, ChevronDown, ChevronUp, AlertCircle, ShieldAlert } from 'lucide-react';
import { translations } from '../translations';

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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-[#E75A2D] bg-[#E75A2D]/10 px-3.5 py-1.5 rounded-full">
          Knowledge Base & Help
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-['Poppins'] text-[#0F2A4A]">
          {lang === 'sw' ? 'Maswali Yanayoulizwa Mara kwa Mara' : 'Frequently Asked Questions'}
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 max-w-xl mx-auto">
          {lang === 'sw'
            ? 'Majibu ya haraka kuhusu usalama, vitu vinavyoruhusiwa, malipo ya M-Pesa, na jinsi ya kuchukua mzigo wako.'
            : 'Everything you need to know about our security rules, prohibited goods, M-Pesa payments, and collection policies.'}
        </p>
      </div>

      {/* Search Input */}
      <div className="relative max-w-xl mx-auto">
        <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={lang === 'sw' ? 'Tafuta swali lolote (mfano: M-Pesa, Laptop, Kuchelewa)...' : 'Search any question (e.g., M-Pesa, Laptop, Prohibited, Late)...'}
          className="w-full text-sm pl-12 pr-4 py-3.5 rounded-2xl border border-gray-300 focus:outline-none focus:border-[#E75A2D] shadow-xs"
        />
      </div>

      {/* Category Pills */}
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
            className={`px-3.5 py-1.5 rounded-full font-semibold transition-all ${
              activeCategory === c.id
                ? 'bg-[#0F2A4A] text-white shadow-xs'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Prohibited items callout alert */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-xs text-amber-900 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <strong className="block font-bold mb-0.5">Notice on Prohibited Storage:</strong>
          Perishables (raw meat, seafood), gas cylinders, firearms, and illegal substances are strictly prohibited on premises and subject to immediate confiscation and police notification.
        </div>
      </div>

      {/* Accordion FAQ Items */}
      <div className="space-y-3">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs transition-all"
            >
              <button
                onClick={() => setExpandedFaq(expandedFaq === idx ? -1 : idx)}
                className="w-full text-left p-5 flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-[#0F2A4A] hover:bg-gray-50/80 transition-colors"
              >
                <span>{lang === 'sw' ? faq.q_sw : faq.q_en}</span>
                {expandedFaq === idx ? (
                  <ChevronUp className="w-5 h-5 text-[#E75A2D] shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
                )}
              </button>
              {expandedFaq === idx && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100">
                  {lang === 'sw' ? faq.a_sw : faq.a_en}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-xs text-gray-400">
            No FAQs found matching "{searchTerm}". Try another keyword or contact our support team.
          </div>
        )}
      </div>

      {/* Still need help strip */}
      <div className="bg-[#0F2A4A] rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-base font-['Poppins']">Have a specific question about your items?</h4>
          <p className="text-xs text-gray-300 mt-0.5">Our Mombasa attendants are ready to assist you on WhatsApp right now.</p>
        </div>
        <a
          href="https://wa.me/254712345678"
          target="_blank"
          rel="noreferrer"
          className="bg-[#25D366] hover:bg-[#20ba59] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow shrink-0"
        >
          Chat with Support
        </a>
      </div>
    </div>
  );
}
