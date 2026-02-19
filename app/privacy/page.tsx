"use client";

import React from "react";
import Link from "next/link";

export default function PrivacyPolicy() {
  const effectiveDate = "February 20, 2026";

  const ld = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Privacy Policy — Tuner + Metronome",
    "url": "https://tunermetronome.com/privacy",
    "description": "Privacy policy describing how Tuner + Metronome processes audio locally and uses Adsterra for third-party advertising.",
  };

  return (
    <div className="prose max-w-3xl mx-auto px-4 py-10 text-gray-800">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />

      <header>
        <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
        <div className="text-sm text-slate-600 mb-6">Effective date: <span className="font-medium">{effectiveDate}</span></div>
      </header>

      <section className="space-y-4">
        <p>
          Your privacy is important to us. This website provides web-based tools (a tuner and metronome) designed 
          to process audio locally in your browser. We avoid collecting personal information unless you explicitly 
          provide it to us.
        </p>

        <h2 className="mt-6 font-semibold text-lg leading-tight tracking-tight text-slate-900">Audio &amp; Local Processing</h2>
        <p>
          The tuner and metronome run in your browser using the Web Audio API. When you press <strong>Start</strong>, 
          the app requests permission to access your microphone. Audio analysis is performed 100% locally on your device; 
          we never transmit microphone audio to our servers or any third parties.
        </p>

        <h2 className="mt-6 font-semibold text-lg leading-tight tracking-tight text-slate-900">Third-Party Advertising</h2>
        <p>
          We use <strong>Adsterra</strong> and other third-party advertising companies to serve ads when you visit our website. 
          These companies may use information (not including your name, address, email address, or telephone number) about 
          your visits to this and other websites in order to provide advertisements about goods and services of interest to you.
        </p>
        <p>
          Adsterra and its partners may use cookies and web beacons to collect data during the ad-serving process. 
          For more information on how Adsterra handles data, please review the{" "}
          <a
            href="https://adsterra.com/privacy-policy/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 underline"
          >
            Adsterra Privacy Policy
          </a>.
        </p>

        <h2 className="mt-6 font-semibold text-lg leading-tight tracking-tight text-slate-900">Cookies &amp; Similar Technologies</h2>
        <p>
          Cookies are small text files placed on your device. Our advertising partners use them to track ad performance 
          and prevent you from seeing the same ad repeatedly. You can manage or disable cookies through your browser settings, 
          though this may impact how ads are displayed.
        </p>

        <h2 className="mt-6 font-semibold text-lg leading-tight tracking-tight text-slate-900">Analytics</h2>
        <p>
          We may use third-party analytics services to understand usage patterns and improve our tools. 
          These services are configured to minimize the collection of personally identifiable information.
        </p>

        <h2 className="mt-6 font-semibold text-lg leading-tight tracking-tight text-slate-900">Your Choices &amp; Opt-Outs</h2>
        <p>
          You have several options to control your privacy:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Adjust your browser settings to block or delete cookies.</li>
          <li>Use an ad-blocking extension or a privacy-focused browser.</li>
          <li>
            Opt out of interest-based advertising from participating companies via the{" "}
            <a href="https://optout.networkadvertising.org/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline">
              Network Advertising Initiative (NAI)
            </a>{" "}
            or the{" "}
            <a href="https://optout.aboutads.info/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline">
              Digital Advertising Alliance (DAA)
            </a>.
          </li>
        </ul>

        <h2 className="mt-6 font-semibold text-lg leading-tight tracking-tight text-slate-900">Children&apos;s Privacy</h2>
        <p>
          This site is not intended for children under the age of 13. We do not knowingly collect personal information 
          from children. If you believe such data has been collected, please contact us for immediate removal.
        </p>

        <h2 className="mt-6 font-semibold text-lg leading-tight tracking-tight text-slate-900">Data Retention</h2>
        <p>
          We do not retain personal data unless you contact us directly. Email correspondence is kept only as long 
          as necessary to address your inquiry.
        </p>

        <h2 className="mt-6 font-semibold text-lg leading-tight tracking-tight text-slate-900">Site Links</h2>
        <ul className="flex flex-wrap gap-4 list-none p-0">
          <li><Link href="/" className="text-indigo-600">Tuner</Link></li>
          <li><Link href="/metronome" className="text-indigo-600">Metronome</Link></li>
          <li><Link href="/about" className="text-indigo-600">About</Link></li>
          <li><Link href="/terms" className="text-indigo-600">Terms</Link></li>
          <li><Link href="/contact" className="text-indigo-600">Contact</Link></li>
        </ul>

        <h2 className="mt-6 font-semibold text-lg leading-tight tracking-tight text-slate-900">Contact</h2>
        <p>
          If you have questions about this policy, please reach out:
        </p>
        <p>
          Email:{" "}
          <a href="mailto:bahehdowski@gmail.com" className="font-medium text-indigo-600 underline">
            bahehdowski@gmail.com
          </a>
        </p>
      </section>
    </div>
  );
}