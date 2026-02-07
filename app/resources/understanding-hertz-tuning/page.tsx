"use client";
/* eslint-disable @next/next/no-img-element */

import React from "react";
import Link from "next/link";

export default function HertzTuningGuide() {
  const ld = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Understanding Hertz: A440 vs. A432 Tuning Standards Explained",
    "url": "https://tunermetronome.com/resources/understanding-hertz-tuning",
    "description":
      "Learn the physics of sound, how frequencies relate to musical notes, and the history behind different tuning standards.",
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

        {/* Single hero image */}
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
            Music Theory &amp; Practice
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
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
          Seeing &quot;440 Hz&quot; on a tuner is only the start. Frequency (measured in Hertz) underpins pitch,
          instrument setup, and even perceived timbre. This guide explains what Hertz means, why historical
          and modern standards exist, how changing A affects instruments and recordings, and how you can
          experiment safely.
        </p>

        <h2 className="text-3xl font-bold mt-10 mb-4">
          What does Hertz (Hz) actually measure?
        </h2>
        <p>
          Hertz is cycles per second. A note labelled A4 (the A above middle C) is commonly set to 440 cycles
          per second (440 Hz). That number is a physical descriptor: your string vibrates 440 times each
          second and that periodic motion produces pressure waves the ear perceives as pitch.
        </p>

        <h2 className="text-3xl font-bold mt-10 mb-4">
          Why do different tuning standards exist?
        </h2>
        <p>
          Tuning standards evolved because earlier pitch references varied by geography and era. Pitches
          drifted (a phenomenon called pitch inflation), and orchestras did not always agree. ISO standardized
          A = 440 Hz in the 20th century to make instrument manufacturing, orchestral performance, and
          recordings interoperable.
        </p>
        <p>
          Alternatives like A432 or Baroque pitch (≈415 Hz) persist for musical, historical, or aesthetic
          reasons. Musicians choose them for period authenticity, perceived warmth, or personal preference.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600 p-6 my-8 rounded-r-lg">
          <h3 className="text-xl font-bold mb-2">Quick comparison</h3>
          <ul className="list-disc pl-6">
            <li><strong>A440:</strong> Modern standard used in most genres.</li>
            <li><strong>A432:</strong> Slightly lower; often described as &quot;warmer&quot;.</li>
            <li><strong>A415:</strong> Baroque pitch used in historical performance.</li>
          </ul>
        </div>

        <h2 className="text-3xl font-bold mt-10 mb-4">
          Practical effects on instruments and timbre
        </h2>
        <p>
          Lowering concert pitch (for example, 440 → 432 Hz) reduces string tension for fixed-scale string
          instruments. This can subtly affect attack, sustain, and perceived brightness. For ensemble work,
          consistency matters more than the exact reference.
        </p>

        <h2 className="text-3xl font-bold mt-10 mb-4">
          How to tune to a different reference
        </h2>
        <ol className="list-decimal ml-6 mb-6">
          <li>Change reference frequency in digital tuners or DAWs.</li>
          <li>Adjust hardware tuners that support ±Hz calibration.</li>
          <li>Retune acoustic instruments carefully and recheck octaves.</li>
          <li>Pianos require a technician for permanent pitch changes.</li>
        </ol>

        <h2 className="text-3xl font-bold mt-10 mb-4">
          Recording and mixing considerations
        </h2>
        <p>
          If a recording uses a non-standard reference, retune instruments or pitch-shift the track.
          Small shifts are feasible, but watch for artifacts and vocal formant distortion.
        </p>

        <h2 className="text-3xl font-bold mt-10 mb-4">
          Experiment: a simple listening test
        </h2>
        <p>
          Record the same phrase at A440 and A432, normalize levels, and listen blind. Document room,
          microphone, and instrument to avoid expectation bias.
        </p>

        <hr className="my-8" />

        {/* FAQ */}
        <section>
          <h3 className="text-2xl font-semibold mb-4">FAQ</h3>

          <p><strong>Q:</strong> Will tuning to A432 damage my instrument?<br />
            <strong>A:</strong> No. It slightly reduces tension; compatibility is the main concern.</p>

          <p><strong>Q:</strong> Is A432 objectively better?<br />
            <strong>A:</strong> No. Preference depends on musical context and listener perception.</p>

          <p><strong>Q:</strong> How do I identify tuning in recordings?<br />
            <strong>A:</strong> Measure sustained tones with a reliable tuner or spectrum analyzer.</p>
        </section>

        <hr className="my-8" />

        {/* Footer */}
        <footer className="mt-10 pt-6 border-t">
          <p className="font-semibold">Jotham Saiborne</p>
          <p className="text-sm text-gray-600">
            Musician &amp; developer writing about sound, tuning, and signal processing.
          </p>
        </footer>
      </article>
    </main>
  );
}
