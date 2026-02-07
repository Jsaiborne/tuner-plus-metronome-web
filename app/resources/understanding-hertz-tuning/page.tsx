"use client";
/* eslint-disable react/no-unescaped-entities */

import React from "react";
import Link from "next/link";

export default function HertzTuningGuide() {
  const ld = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Understanding Hertz: A440 vs. A432 Tuning Standards Explained",
    "url": "https://tunermetronome.com/resources/understanding-hertz-tuning",
    "description": "Learn the physics of sound, how frequencies relate to musical notes, and the history behind different tuning standards.",
    "author": {
      "@type": "Person",
      "name": "Jotham Saiborne"
    },
    "datePublished": "2026-01-30",
    "image": "https://tunermetronome.com/images/placeholder-hertz.jpg"
  };

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />

      <article className="prose prose-lg dark:prose-invert max-w-none text-gray-800 dark:text-gray-200">

        {/* Single hero image - top of article */}
        <div className="w-full rounded-lg overflow-hidden mb-8 shadow-sm">
          <img
            src="/images/hertz.png"
            alt="Visualization: frequency spectrum with A440 and A432 markers"
            width="1200"
            height="630"
            loading="eager"
            className="w-full h-auto object-cover"
          />
        </div>

        {/* Header */}
        <header className="mb-10 text-center">
          <div className="text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider text-sm mb-3">
            Music Theory & Practice
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-gray-100 mb-6 leading-tight">
            A440 vs. A432: Understanding Hertz in Music
          </h1>
          <div className="flex items-center justify-center space-x-4 text-gray-500 text-sm">
            <span>By <strong>Jotham Saiborne</strong></span>
            <span>•</span>
            <span>8–12 min read</span>
            <span>•</span>
            <time>January 30, 2026</time>
          </div>
        </header>

        {/* Intro */}
        <p className="lead text-xl text-gray-600 dark:text-gray-300 mb-6">
          Seeing "440 Hz" on a tuner is only the start. Frequency (measured in Hertz) underpins pitch, instrument setup, and even perceived timbre.
          This guide explains what Hertz means, why historical and modern standards exist, how changing A affects instruments and recordings, and how you can experiment safely.
        </p>

        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-10 mb-4">
          What does Hertz (Hz) actually measure?
        </h2>
        <p>
          Hertz is cycles per second. A note labelled A4 (the A above middle C) is commonly set to 440 cycles per second (440 Hz).
          That number is a physical descriptor: your string vibrates 440 times each second and that periodic motion produces pressure waves the ear perceives as pitch.
        </p>

        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-10 mb-4">
          Why do different tuning standards exist?
        </h2>
        <p>
          Tuning standards evolved because earlier pitch references varied by geography and era. Pitches drifted (a phenomenon called pitch inflation), and orchestras did not always agree.
          ISO standardized A = 440 Hz in the 20th century to make instrument manufacturing, orchestral performance and recordings interoperable.
        </p>
        <p>
          Alternatives like A432 or Baroque pitch (≈415 Hz) persist for musical, historical, or aesthetic reasons. Musicians choose them for period authenticity, perceived warmth, or personal preference.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600 p-6 my-8 rounded-r-lg">
          <h3 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-2">Quick comparison</h3>
          <ul className="list-disc pl-6">
            <li><strong>A440:</strong> Modern standard. Common in orchestras, pop, and most digital instruments.</li>
            <li><strong>A432:</strong> Slightly lower; proponents describe it as "warmer" — tension on strings is marginally reduced.</li>
            <li><strong>A415 (Baroque):</strong> Historical pitch used for period ensembles and authentic reconstructions.</li>
          </ul>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-10 mb-4">
          Practical effects on instruments and timbre
        </h2>
        <p>
          Lowering concert pitch (e.g., 440 → 432 Hz) reduces string tension for fixed-scale string instruments if scale length and note are unchanged.
          That reduction can slightly change attack, sustain, and perceived brightness. For wind instruments, smaller pitch changes influence intonation and resonance points.
        </p>
        <p>
          Important: these are subtle differences. For ensemble work, authoritative tuning matters more — everyone must agree on the standard before rehearsals or recordings.
        </p>

        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-10 mb-4">
          How to tune to a different reference (practical steps)
        </h2>
        <ol className="list-decimal ml-6 mb-6">
          <li><strong>Digital tuners / DAW:</strong> change the reference frequency setting to 432 Hz (or your target).</li>
          <li><strong>Hardware tuners:</strong> many allow +/- Hz adjustment or choose a preset like "A432".</li>
          <li><strong>Acoustic instruments:</strong> tune slowly and re-check octaves after adjusting the base A — decreased tension affects multiple strings.</li>
          <li><strong>Pianos:</strong> require full re-tuning by a technician if you permanently change concert pitch.</li>
        </ol>

        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-10 mb-4">
          Recording and mixing considerations
        </h2>
        <p>
          If your source recording uses a non-standard reference, you have two choices: retune instruments to match the recording, or pitch-shift the recording in a DAW.
          Pitch-shifting small amounts (e.g., 440 ↔ 432) is feasible with good algorithms — but watch for artifacts and formant distortions on vocals.
        </p>

        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg my-8">
          <h4 className="font-semibold mb-2">Measuring pitch precisely</h4>
          <p className="text-sm">
            Use a high-quality tuner or spectrum analyzer and measure multiple harmonics (not just the fundamental). Averaging measurements over a few seconds reduces transient errors.
          </p>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-10 mb-4">
          Experiment: small study you can run
        </h2>
        <p>
          Try A/B listening: record the same short phrase at A440 and A432, normalize levels, and listen blind. Note differences in perceived warmth, clarity, and emotional response.
          Document conditions (room, mic, instrument) — this helps separate actual timbral change from expectation bias.
        </p>

        <hr className="my-8" />

    

        <hr className="my-8" />

        {/* FAQ */}
        <section>
          <h3 className="text-2xl font-semibold mb-4">FAQ</h3>

          <h4 className="font-semibold">Q: Will tuning to A432 damage my instrument?</h4>
          <p className="mb-4">A: No — tuning slightly lower reduces tension. The main cost is compatibility: if you're playing with others tuned to A440 you'll need to agree on a reference.</p>

          <h4 className="font-semibold">Q: Is A432 objectively better?</h4>
          <p className="mb-4">A: Not objectively — perceived differences often come from psychoacoustics and listener expectation. The best choice depends on artistic goals and ensemble requirements.</p>

          <h4 className="font-semibold">Q: How do I know what a recording uses?</h4>
          <p className="mb-4">A: Use a reliable spectrum analyzer or tuner and measure a sustained reference tone (vocals or instruments) across the track; compare measured frequency to 440 Hz.</p>
        </section>

        <hr className="my-8" />

        {/* Further reading & CTA */}
        <section>
          <h3 className="text-2xl font-semibold mb-4">Further reading & tools</h3>
          <p className="mb-4">
            For deeper study, look for texts on musical acoustics and ISO documentation for pitch standards. Try our <Link href="/" className="underline text-blue-600">online tuner</Link> and experiment by switching reference frequency.
          </p>

          <div className="flex gap-4">
            <Link href="/" className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">Start Tuning</Link>
            <Link href="/resources" className="px-6 py-3 bg-transparent border border-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">Browse Resources</Link>
          </div>
        </section>

        <hr className="my-8" />

        {/* Footer / Author */}
        <footer className="mt-10 pt-6 border-t">
          <div>
            <p className="font-semibold">Jotham Saiborne</p>
            <p className="text-sm text-gray-600">Musician & developer. I build practical audio tools and write about the intersection of signal processing and musical practice.</p>
          </div>
        </footer>
      </article>
    </main>
  );
}
