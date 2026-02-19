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
    "description": "Our commitment to privacy regarding local audio processing and third-party data practices.",
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
          At Tuner + Metronome, the privacy of our visitors is a top priority. This document outlines the types of information 
          that are collected and recorded by our platform and how we use it. We are committed to providing helpful musical 
          tools while maintaining a transparent and secure environment.
        </p>

        <h2 className="mt-6 font-semibold text-lg leading-tight tracking-tight text-slate-900">Audio &amp; Local Processing</h2>
        <p>
          Our tuner and metronome applications are built using the Web Audio API. When you grant permission to use your 
          microphone, the audio analysis is performed <strong>strictly on your local device</strong>. 
        </p>
        <p>
          We do not record, store, or transmit your audio data to any external servers. The processing happens in your 
          browser&apos;s memory and is discarded immediately after the analysis is complete. Your musical practice 
          remains private to you.
        </p>

        <h2 className="mt-6 font-semibold text-lg leading-tight tracking-tight text-slate-900">Log Files</h2>
        <p>
          Like most standard website servers, we use log files. These files merely log visitors to the site&mdash;usually 
          a standard procedure for hosting companies and a part of hosting services&apos; analytics. The information 
          inside the log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), 
          date/time stamp, and referring/exit pages. This information is used to analyze trends and administer the site.
        </p>

        <h2 className="mt-6 font-semibold text-lg leading-tight tracking-tight text-slate-900">Cookies and Web Beacons</h2>
        <p>
          Our website uses &quot;cookies&quot; to store information about visitors&apos; preferences and the pages on the 
          website that the visitor accessed or visited. This information is used to optimize the users&apos; experience by 
          customizing our web page content based on visitors&apos; browser type and/or other information.
        </p>

      
        <h2 className="mt-6 font-semibold text-lg leading-tight tracking-tight text-slate-900">Children&apos;s Information</h2>
        <p>
          Another part of our priority is adding protection for children while using the internet. We encourage parents 
          and guardians to observe, participate in, and/or monitor and guide their online activity.
        </p>
        <p>
          Tuner + Metronome does not knowingly collect any Personal Identifiable Information from children under the 
          age of 13. If you think that your child provided this kind of information on our website, we strongly 
          encourage you to contact us immediately and we will do our best efforts to promptly remove such 
          information from our records.
        </p>

        <h2 className="mt-6 font-semibold text-lg leading-tight tracking-tight text-slate-900">Consent</h2>
        <p>
          By using our website, you hereby consent to our Privacy Policy and agree to its Terms and Conditions.
        </p>

        <hr className="my-8 border-slate-200" />

        <div className="flex flex-wrap gap-4 text-sm font-medium">
          <Link href="/" className="text-indigo-600 hover:text-indigo-800">Tuner</Link>
          <Link href="/metronome" className="text-indigo-600 hover:text-indigo-800">Metronome</Link>
          <Link href="/about" className="text-indigo-600 hover:text-indigo-800">About</Link>
          <Link href="/terms" className="text-indigo-600 hover:text-indigo-800">Terms of Service</Link>
          <Link href="/contact" className="text-indigo-600 hover:text-indigo-800">Contact Us</Link>
        </div>

        <h2 className="mt-8 font-semibold text-lg text-slate-900">Contact Information</h2>
        <p>
          If you have additional questions or require more information about our Privacy Policy, do not hesitate to 
          contact us via email at:{" "}
          <a href="mailto:bahehdowski@gmail.com" className="font-medium text-indigo-600 underline">
            bahehdowski@gmail.com
          </a>
        </p>
      </section>
    </div>
  );
}