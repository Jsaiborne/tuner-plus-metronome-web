"use client";

import React from "react";
import Link from "next/link";

export default function TermsOfUse() {
  const effectiveDate = "February 20, 2026";

  const ld = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Terms of Use — Tuner + Metronome",
    "url": "https://tunermetronome.com/terms",
    "description": "Terms and conditions for using the Tuner + Metronome web application, including disclaimers and user responsibilities.",
  };

  return (
    <div className="prose max-w-3xl mx-auto px-4 py-10 text-gray-800">
      {/* JSON-LD metadata */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />

      <header>
        <h1 className="text-3xl font-bold mb-2">Terms of Use</h1>
        <div className="text-sm text-slate-600 mb-6">
          Effective date: <span className="font-medium">{effectiveDate}</span>
        </div>
      </header>

      <section className="space-y-4">
        <p>
          By accessing or using this website and the musical tools provided (the &quot;Service&quot;), you agree to be bound by these Terms of Use. 
          These terms act as a legal agreement between you and Tuner + Metronome. If you do not agree with any part of these terms, you are prohibited 
          from using or accessing this site.
        </p>

        <h2 className="mt-6 font-semibold text-lg leading-tight tracking-tight text-slate-900">1. Acceptance of Terms</h2>
        <p>
          These Terms govern your use of all content, functionality, and services offered on or through the website. We reserve the right to 
          update or change these Terms at any time without prior notice. Your continued use of the Service following the posting of any changes 
          constitutes acceptance of those changes.
        </p>

        <h2 className="mt-6 font-semibold text-lg leading-tight tracking-tight text-slate-900">2. Description of Service</h2>
        <p>
          Tuner + Metronome provides web-based utility applications designed for musicians. These services include audio frequency analysis 
          (the Tuner) and rhythmic pulse generation (the Metronome). These tools are provided through your web browser and rely on the 
          standard Web Audio API for local processing.
        </p>

        <h2 className="mt-6 font-semibold text-lg leading-tight tracking-tight text-slate-900">3. Permitted Use and Restrictions</h2>
        <p>
          You are granted a limited, non-exclusive, non-transferable, and revocable license to use the Service for personal, non-commercial 
          educational or practice purposes. You agree not to:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Use the Service for any purpose that is unlawful or prohibited by these Terms.</li>
          <li>Attempt to decompile, reverse engineer, or extract the source code of the applications.</li>
          <li>Use any automated system, including &quot;robots&quot; or &quot;spiders,&quot; to access the Service in a manner that sends more request messages to our servers than a human can reasonably produce.</li>
          <li>Interfere with the proper working of the Service or circumvent any measures we may use to prevent or restrict access.</li>
        </ul>

        <h2 className="mt-6 font-semibold text-lg leading-tight tracking-tight text-slate-900">4. Intellectual Property Rights</h2>
        <p>
          The Service and its original content (excluding user-provided feedback), features, and functionality are and will remain the 
          exclusive property of Tuner + Metronome. Our intellectual property may not be used in connection with any product or service 
          without the prior written consent of the site operator.
        </p>

        <h2 className="mt-6 font-semibold text-lg leading-tight tracking-tight text-slate-900">5. Disclaimer of Warranties</h2>
        <p>
          THE SERVICE IS PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; BASIS. WE MAKE NO REPRESENTATIONS OR WARRANTIES OF ANY KIND, 
          EXPRESS OR IMPLIED, AS TO THE OPERATION OF THE SERVICE OR THE ACCURACY OF THE RESULTS (SUCH AS TUNING PRECISION). 
        </p>
        <p>
          TO THE FULL EXTENT PERMISSIBLE BY APPLICABLE LAW, WE DISCLAIM ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES 
          OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE. WE DO NOT WARRANT THAT THE SERVICE, ITS SERVERS, OR EMAILS SENT FROM 
          US ARE FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS.
        </p>

        <h2 className="mt-6 font-semibold text-lg leading-tight tracking-tight text-slate-900">6. Limitation of Liability</h2>
        <p>
          In no event shall Tuner + Metronome, nor its directors, employees, or partners, be liable for any indirect, incidental, special, 
          consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible 
          losses, resulting from your access to or use of (or inability to access or use) the Service.
        </p>

        <h2 className="mt-6 font-semibold text-lg leading-tight tracking-tight text-slate-900">7. Third-Party Links and Advertisements</h2>
        <p>
          Our Service may contain links to third-party web sites or services that are not owned or controlled by us. We have no control over, 
          and assume no responsibility for, the content, privacy policies, or practices of any third-party web sites. 
        </p>
        <p>
          Additionally, the Service may display advertisements from third-party networks. Your correspondence or business dealings with 
          advertisers found on or through the Service are solely between you and such advertiser. You agree that we shall not be responsible 
          or liable for any loss or damage of any sort incurred as the result of any such dealings.
        </p>

        <h2 className="mt-6 font-semibold text-lg leading-tight tracking-tight text-slate-900">8. Governing Law</h2>
        <p>
          These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions. 
          Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
        </p>

        <h2 className="mt-6 font-semibold text-lg leading-tight tracking-tight text-slate-900">9. Contact Us</h2>
        <p>
          If you have any questions about these Terms, please contact us at:
          <br />
          Email: <a href="mailto:bahehdowski@gmail.com" className="font-medium text-indigo-600 underline">bahehdowski@gmail.com</a>
        </p>

        <hr className="my-8 border-slate-200" />

        <div className="flex flex-wrap gap-4 text-sm font-medium">
          <Link href="/" className="text-indigo-600 hover:text-indigo-800">Tuner</Link>
          <Link href="/metronome" className="text-indigo-600 hover:text-indigo-800">Metronome</Link>
          <Link href="/about" className="text-indigo-600 hover:text-indigo-800">About Our Tools</Link>
          <Link href="/privacy" className="text-indigo-600 hover:text-indigo-800">Privacy Policy</Link>
          <Link href="/contact" className="text-indigo-600 hover:text-indigo-800">Contact</Link>
        </div>
      </section>
    </div>
  );
}