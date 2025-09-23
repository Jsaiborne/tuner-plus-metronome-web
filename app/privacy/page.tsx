"use client";

import React from "react";
import Link from "next/link";

export default function PrivacyPolicy() {
  const effectiveDate = "September 24, 2025";

  const ld = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Privacy Policy — Tuner + Metronome",
    "url": typeof window !== "undefined" ? window.location.href : "https://example.com/privacy",
    "description": "Privacy policy describing how the Tuner + Metronome web app processes audio locally, uses third-party advertising, and provides opt-out links.",
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
          Your privacy is important to us. This website is focused on providing web-based tools (a tuner and metronome). We design the site
          to process audio locally in your browser and avoid collecting personal information unless you explicitly provide it (for example,
          by contacting us via email or a contact form).
        </p>

        <h2 className="mt-6 font-semibold text-lg leading-tight tracking-tight text-slate-900">Audio & Local Processing</h2>
        <p>
          The tuner and metronome run in your browser using the Web Audio API. When you press <strong>Start</strong>, the app will request
          permission to access your microphone. Audio analysis (pitch detection or click generation) is performed locally on your device;
          we do not transmit microphone audio to our servers for processing.
        </p>

        <h2 className="mt-6 font-semibold text-lg leading-tight tracking-tight text-slate-900">Third-Party Advertising</h2>
        <p>
          We display third-party ads (for example, Google AdSense). These advertising partners may use cookies, device identifiers,
          and similar technologies to collect information about your visits and show relevant ads. They operate under their own privacy
          policies, and we do not control their data collection or use of information.
        </p>
        <p>
          To opt out of personalized ads from Google, visit{" "}
          <a
            href="https://www.google.com/settings/ads/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 underline"
          >
            Google Ads Settings
          </a>
          . For general information about how Google uses data on partner sites, see{" "}
          <a
            href="https://policies.google.com/technologies/partner-sites"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 underline"
          >
            Google Privacy & Terms
          </a>
          .
        </p>

        <h2 className="mt-6 font-semibold text-lg leading-tight tracking-tight text-slate-900">Cookies & Similar Technologies</h2>
        <p>
          Cookies are small text files placed on your device by websites and services. Advertising partners may place cookies to remember
          preferences or measure ad performance. You can manage or disable cookies through your browser settings, but disabling cookies may
          affect ad personalization and some site features.
        </p>

        <h2 className="mt-6 font-semibold text-lg leading-tight tracking-tight text-slate-900">Analytics</h2>
        <p>
          We may use third-party analytics or measurement services to understand usage patterns and improve the site. If analytics are in use,
          they are configured to respect user privacy and minimize personally identifiable information. If you would like a specific statement
          about whether a particular analytics provider is enabled, contact us (see the Contact section below).
        </p>

        <h2 className="mt-6 font-semibold text-lg leading-tight tracking-tight text-slate-900">Your Choices</h2>
        <ul>
          <li>Block or delete cookies through your browser settings.</li>
          <li>Use browser privacy extensions to limit tracking.</li>
          <li>Opt out of ad personalization through Google Ads Settings linked above.</li>
        </ul>

        <h2 className="mt-6 font-semibold text-lg leading-tight tracking-tight text-slate-900">Children's Privacy</h2>
        <p>
          This site is not intended for children under the age of 13. We do not knowingly collect personal information from children. If you
          believe we have collected information about a child, please contact us and we will take steps to remove that information.
        </p>

        <h2 className="mt-6 font-semibold text-lg leading-tight tracking-tight text-slate-900">Data Retention & Requests</h2>
        <p>
          We generally do not retain any personal data about visitors unless you contact us or opt into a feature that requires data storage.
          If you ask us to delete personal information you have provided, we will make reasonable efforts to do so.
        </p>

        <h2 className="mt-6 font-semibold text-lg leading-tight tracking-tight text-slate-900">Links to Other Pages</h2>
        <p className="mb-2">
          For more information about the site and tools:
        </p>
        <ul>
          <li><Link href="/" className="text-indigo-600">Tuner</Link></li>
          <li><Link href="/metronome" className="text-indigo-600">Metronome</Link></li>
          <li><Link href="/about" className="text-indigo-600">About</Link></li>
          <li><Link href="/terms" className="text-indigo-600">Terms</Link></li>
          <li><Link href="/contact" className="text-indigo-600">Contact</Link></li>
        </ul>

        <h2 className="mt-6 font-semibold text-lg leading-tight tracking-tight text-slate-900">Changes to this Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. If we make material changes, we will update the "Effective date" at the top
          and/or provide a prominent notice on the site. Please check back periodically.
        </p>

        <h2 className="mt-6 font-semibold text-lg leading-tight tracking-tight text-slate-900">Contact</h2>
        <p>
          If you have questions, requests, or concerns about this policy or our data practices, please contact:
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
