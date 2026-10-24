import React from 'react';
import { ShieldCheck, FileText, Scale } from 'lucide-react';

export default function Terms({ lang }) {
  return (
    <div className="min-h-screen py-10 sm:py-16 px-4 sm:px-6 lg:px-8 relative bg-gradient-to-b from-[#F6EBD9]/40 via-white to-[#F6EBD9]/20">
      <div className="max-w-4xl mx-auto space-y-8 text-gray-700 text-xs sm:text-sm leading-relaxed">
        <div className="border-b border-gray-200 pb-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FF6B4A]/10 text-[#FF6B4A] text-xs font-bold uppercase tracking-widest mb-3">
            <Scale className="w-3.5 h-3.5" />
            <span>Legal Bailment Framework • Mombasa</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black font-['Syne',sans-serif] text-[#0B2545] tracking-tight">
            Terms & Conditions of Storage
          </h1>
          <p className="text-xs text-gray-500 mt-2 font-mono">
            Effective Date: January 1, 2026 • Mzingo Point Storage Ltd, Moi Avenue, Mombasa Island, Kenya
          </p>
        </div>

        <div className="space-y-6 bg-white p-6 sm:p-10 rounded-3xl border border-gray-200 shadow-xl">
          <section className="space-y-2">
            <h2 className="text-lg font-black text-[#0B2545] font-['Syne']">1. Storage Contract & Acceptance</h2>
            <p>
              By booking online, presenting goods at our Moi Avenue counter, or paying storage fees, the customer ("Depositor") enters into a legal bailment contract with Mzingo Point Storage Ltd ("Bailee"). All storage is subject to available capacity and compliance with these rules.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-black text-[#0B2545] font-['Syne']">2. Identification & Release of Belongings</h2>
            <p>
              Belongings will strictly be released only upon presentation of:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>The official unique Booking Reference or digital QR code.</li>
              <li>Original physical National ID Card, Passport, or Alien Registration Card matching the booking record.</li>
              <li>If collected by a third party, advance written SMS/WhatsApp authorization from the owner's registered number with the collector's full name and ID number.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-black text-[#0B2545] font-['Syne']">3. Prohibited & Hazardous Goods</h2>
            <p>
              The Depositor certifies that items stored do not contain perishable foodstuffs, flammable chemicals, gas canisters, firearms, ammunition, corrosive liquids, explosive materials, narcotics, or any goods prohibited under the laws of the Republic of Kenya. Mzingo Point reserves the right to inspect any item before acceptance.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-black text-[#0B2545] font-['Syne']">4. Overdue Items & Unclaimed Goods Policy</h2>
            <p>
              Depositors must collect items on or before the agreed pick-up date. Any uncollected goods after the due date incur a late storage fee of <strong>KES 100 per item per day</strong>.
            </p>
            <p>
              In accordance with the <strong>Kenya Disposal of Uncollected Goods Act (Cap. 38)</strong>, goods remaining uncollected for more than thirty (30) days without official communication or payment of arrears will be subject to a formal statutory notice. If still unclaimed after the statutory notice period, the goods may be disposed of or sold at public auction to recover accrued storage fees.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
