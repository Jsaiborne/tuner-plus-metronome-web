"use client";
/* eslint-disable react/no-unescaped-entities */

import React from "react";
import Link from "next/link";

export default function HowWebAudioWorks() {
  // Schema for Google (TechArticle)
  const ld = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": "How Web Audio Tuners Work: The Science of Browser-Based Pitch Detection",
    "url": "https://tunermetronome.com/resources/how-web-audio-works",
    "author": { "@type": "Person", "name": "Jotham Saiborne" },
    "datePublished": "2026-01-30",
    "description": "A deep-dive explanation of how browser-based audio tuners capture, analyse and present pitch information in real-time.",
  };

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <script type="application/ld+json">{JSON.stringify(ld)}</script>

      <article className="prose lg:prose-xl dark:prose-invert">
        {/* Single hero image placed above the title */}
        <div className="w-full rounded-lg overflow-hidden mb-8 shadow-sm">
          <img
            src="/images/Digital tuner with waveform and spectrum.png"
            alt="Illustration: waveform and tuner interface"
            width="1200"
            height="630"
            loading="eager"
            className="w-full h-auto object-cover"
          />
        </div>

        <header>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-gray-100 mb-6 leading-tight">
            How Web Audio Tuners Work: The Science of Pitch Detection
          </h1>
          <div className="flex items-center justify-start space-x-4 text-gray-500 text-sm">
            <span>By <strong>Jotham Saiborne</strong></span>
            <span>•</span>
            <span>Estimated read: 12 min</span>
            <span>•</span>
            <time>January 30, 2026</time>
          </div>
        </header>

        {/* Top summary */}
        <section className="mt-6">
          <p className="lead text-lg text-gray-600 dark:text-gray-300 mb-6">
            Browser-based tuners are now accurate enough for everyday musicians and many teachers. This article
            explains the full signal chain — from microphone access to the pitch algorithms (autocorrelation, YIN,
            and hybrid methods), common trade-offs, and best practices for building reliable, low-latency tuners that
            run in modern browsers.
          </p>
        </section>

        <hr className="my-8" />

        {/* Section: Capturing Audio */}
        <section>
          <h2 className="text-3xl font-bold mt-8 mb-4">1. Capturing the Sound Wave</h2>
          <p>
            The first step is to request microphone permission via <code>navigator.mediaDevices.getUserMedia</code>.
            Modern browsers require a secure origin (HTTPS) and explicit user consent. Once granted, the API returns a
            <code>MediaStream</code> which can be used as a source in the Web Audio API.
          </p>

          <p>
            Typical low-latency setups create a single shared <code>AudioContext</code> and then a
            <code>MediaStreamAudioSourceNode</code> connected to an <code>AnalyserNode</code> or an
            <code>AudioWorklet</code>. For production-ready apps prefer <code>AudioWorklet</code> for sample-accurate
            processing and to avoid main-thread jitter. Below is a simplified setup (already present in the app):
          </p>

          <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded text-sm overflow-auto font-mono">
{`const audioCtx = new AudioContext();
const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
const source = audioCtx.createMediaStreamSource(stream);
const analyser = audioCtx.createAnalyser();
source.connect(analyser);`}
          </pre>

          <p>
            Notes: Always create a single AudioContext and reuse it. Creating multiple contexts increases memory and can
            cause inconsistent behavior on some devices (especially mobile). Consider showing clear UI feedback when the
            microphone is in use and an easy way for users to revoke permission or switch input devices.
          </p>
        </section>

        <hr className="my-8" />

        {/* Section: Time vs Frequency */}
        <section>
          <h2 className="text-3xl font-bold mt-8 mb-4">2. Time Domain vs Frequency Domain</h2>

          <p>
            A common early optimization is to take an FFT of the signal and look for peaks. FFT-based methods work well
            for visualizers and spectrograms, but for precise single-pitch detection they have limitations: frequency
            resolution, windowing artifacts, and the need for zero-padding or very long windows to resolve low notes.
          </p>

          <p>
            Time-domain techniques (autocorrelation, YIN) analyse the waveform structure directly and often give better
            pitch accuracy and stability for monophonic sources (single note at a time). Many modern tuners use a
            hybrid approach: a fast FFT to get a coarse estimate and a time-domain method to refine the pitch.
          </p>
        </section>

        <hr className="my-8" />

        {/* Section: Algorithms deep dive */}
        <section>
          <h2 className="text-3xl font-bold mt-8 mb-4">3. Algorithms: Autocorrelation, YIN and Hybrids</h2>

          <p>
            <strong>Autocorrelation</strong> finds repeating patterns in the waveform. It's robust and conceptually simple
            but can be computationally expensive for large buffers. It's great for steady, sustained tones like bowed
            strings.
          </p>

          <p>
            <strong>YIN</strong> improves on autocorrelation by explicitly estimating the period and using parabolic
            interpolation to give sub-sample accuracy. YIN includes internal steps to reduce octave errors and handle
            noisy signals better.
          </p>

          <p>
            <strong>Hybrid approaches</strong> combine a coarse FFT (cheap) with a time-domain refinement (accurate).
            This is especially useful on low-power devices where doing a full high-resolution autocorrelation each frame
            may be too heavy.
          </p>

          <p>
            Implementation tip: process audio in small overlapping buffers (e.g. 1024–4096 samples at 48kHz) and use a
            rolling median to smooth pitch readings. Provide a user-adjustable smoothing slider in the UI for "Studio"
            vs "Live" modes — musicians often prefer different latencies and smoothing tradeoffs.
          </p>
        </section>

        <hr className="my-8" />

        {/* Section: Practical engineering */}
        <section>
          <h2 className="text-3xl font-bold mt-8 mb-4">4. Practical Engineering & Testing</h2>

          <ul>
            <li>
              <strong>Latency:</strong> Keep audio buffer sizes as small as practical. Offer an option to use an
              <code>AudioWorklet</code> for lower latency.
            </li>
            <li>
              <strong>Noise handling:</strong> Add a gate or minimum amplitude threshold so the algorithm ignores silence
              and background noise.
            </li>
            <li>
              <strong>Device differences:</strong> Test across a variety of microphones: smartphone built-ins, laptop
              headsets, and USB mics. Each device has a different frequency response and noise floor.
            </li>
            <li>
              <strong>Accessibility:</strong> include large, colorblind-friendly tuners (avoid red/green-only indicators) and
              keyboard controls so users can quickly start/stop and change reference pitch.
            </li>
          </ul>
        </section>

       


    
   

        <hr className="my-8" />

        {/* Footer / Author Bio */}
        <footer className="mt-10 pt-6 border-t">
          <div>
            <p className="font-semibold">Jotham Saiborne</p>
            <p className="text-sm text-gray-600">Musician & developer. I build browser-based audio tools and write about
            real-time audio engineering.</p>
          </div>
        </footer>
      </article>

      
    
    </main>
  );
}
