import React from 'react';
import { ShieldCheck, FileText, Scale } from 'lucide-react';

export default function Terms({ lang }) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8 text-gray-700 text-xs sm:text-sm leading-relaxed">
      <div className="border-b border-gray-200 pb-4">
        <span className="text-xs font-bold uppercase tracking-wider text-[#E75A2D]">Legal Terms of Bailment</span>
        <h1 className="text-3xl font-extrabold font-['Poppins'] text-[#0F2A4A] mt-1">
          Terms & Conditions of Storage
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Effective Date: January 1, 2026 • Mzingo Point Storage Ltd, Mombasa, Kenya
        </p>
      </div>

      <div className="space-y-6 bg-white p-6 sm:p-10 rounded-3xl border border-gray-200 shadow-xs">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#0F2A4A] font-['Poppins']">1. Storage Contract & Acceptance</h2>
          <p>
            By booking online, presenting goods at our Moi Avenue counter, or paying storage fees, the customer ("Depositor") enters into a legal bailment contract with Mzingo Point Storage Ltd ("Bailee"). All storage is subject to available capacity and compliance with these rules.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#0F2A4A] font-['Poppins']">2. Identification & Release of Belongings</h2>
          <p>
            Belongings will strictly be released only upon presentation of:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>The official unique Booking Reference or digital QR code.</li>
            <li>Original physical National ID Card, Passport, or Alien Registration Card matching the booking record.</li>
            <li>If collected by a third party, advance written SMS/WhatsApp authorization from the owner's registered number with the collector's full name and ID number.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#0F2A4A] font-['Poppins']">3. Prohibited & Hazardous Goods</h2>
          <p>
            The Depositor certifies that items stored do not contain perishable foodstuffs, flammable chemicals, gas canisters, firearms, ammunition, corrosive liquids, explosive materials, narcotics, or any goods prohibited under the laws of the Republic of Kenya. Mzingo Point reserves the right to inspect any item before acceptance.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#0F2A4A] font-['Poppins']">4. Overdue Items & Unclaimed Goods Policy</h2>
          <p>
            Depositors must collect items on or before the agreed pick-up date. Any uncollected goods after the due date incur a late storage fee of <strong>KES 100 per item per day</strong>.
          </p>
          <p>
            In accordance with the <strong>Kenya Disposal of Uncollected Goods Act (Cap. 38)</strong>, goods remaining uncollected for more than thirty (30) days without official communication or payment of arrears will be subject to a formal statutory notice. If still unclaimed after the statutory notice period, the goods may be disposed of or sold at public auction to recover accrued storage fees.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#0F2A4A] font-['Poppins']">5. Limitation of Liability & Care</h2>
          <p>
            Mzingo Point maintains 24/7 CCTV surveillance, secured racking, and pest-free facilities. However, Mzingo Point is not liable for indirect or consequential damages, pre-existing structural wear, inherent vice of items, or events caused by acts of God (flooding, civil unrest). Fragile items (glassware, delicate instruments) must be declared at drop-off.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#0F2A4A] font-['Poppins']">6. Governing Law & Jurisdiction</h2>
          <p>
            These terms are governed by the Laws of the Republic of Kenya. Any legal proceedings shall fall under the competent jurisdiction of the courts of Mombasa.
          </p>
        </section>
      </div>
    </div>
  );
}
