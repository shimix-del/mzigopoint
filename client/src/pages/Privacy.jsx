import React from 'react';
import { ShieldCheck, Lock } from 'lucide-react';

export default function Privacy({ lang }) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8 text-gray-700 text-xs sm:text-sm leading-relaxed">
      <div className="border-b border-gray-200 pb-4">
        <span className="text-xs font-bold uppercase tracking-wider text-[#E75A2D]">Kenya Data Protection Act 2019</span>
        <h1 className="text-3xl font-extrabold font-['Poppins'] text-[#0F2A4A] mt-1">
          Privacy Policy & Data Security
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Office of the Data Protection Commissioner (ODPC) Guidelines Compliant
        </p>
      </div>

      <div className="space-y-6 bg-white p-6 sm:p-10 rounded-3xl border border-gray-200 shadow-xs">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#0F2A4A] font-['Poppins']">1. What Information We Collect</h2>
          <p>
            When using Mzingo Point storage services, we collect:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Customer Name, Mobile Phone Number, and Optional Email address.</li>
            <li>National ID Number or Passport Number (required under Kenyan security regulations for verifiable property custody).</li>
            <li>Booking timestamps, item descriptions, and digital signatures collected upon item dispatch.</li>
            <li>CCTV footage captured within public and storage areas of our Moi Avenue branch for physical security and dispute resolution.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#0F2A4A] font-['Poppins']">2. Lawful Basis for Processing</h2>
          <p>
            We process your personal data under the lawful grounds of Contractual Necessity (fulfilling the storage bailment agreement), Legal Obligation (Kenyan identity verification & property custody laws), and Legitimate Interest (protecting customer goods against theft or unauthorized release).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#0F2A4A] font-['Poppins']">3. Data Retention & Protection</h2>
          <p>
            Personal data is stored on encrypted, access-restricted databases. We do not sell or monetize personal contact numbers. Customer data is retained for the legally stipulated period required for financial auditing and unclaimed property records, after which it is anonymized or purged.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#0F2A4A] font-['Poppins']">4. Your Rights under the Kenya Data Protection Act</h2>
          <p>
            You have the right to request access to the personal data we hold about you, request corrections to inaccurate records, and object to promotional communications. For any privacy queries, contact our Data Protection Officer at: <strong>privacy@mzingopoint.co.ke</strong>.
          </p>
        </section>
      </div>
    </div>
  );
}
