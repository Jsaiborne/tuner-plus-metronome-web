"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function HowWebAudioWorks() {
  // Schema for Google (TechArticle)
  const ld = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": "How Web Audio Tuners Work: The Science of Browser-Based Pitch Detection",
    "url": "https://tunermetronome.com/resources/how-web-audio-works",
    "description": "A technical deep dive into using the Web Audio API and autocorrelation algorithms to build a real-time instrument tuner in the browser.",
    "author": {
      "@type": "Person",
      "name": "Jotham Saiborne"
    },
    "datePublished": "2026-01-30",
    "image": "https://your-domain.com/og-image-tuner.jpg" // Update if you have one, or remove
  };

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />

      <article className="prose prose-lg dark:prose-invert max-w-none">
        {/* Header */}
        <header className="mb-10 text-center">
          <div className="text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider text-sm mb-3">
            Engineering & Audio
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-gray-100 mb-6 leading-tight">
            How Web Audio Tuners Work: The Science of Pitch Detection
          </h1>
          <div className="flex items-center justify-center space-x-4 text-gray-500 text-sm">
            <span>By <strong>Jotham Saiborne</strong></span>
            <span>•</span>
            <span>8 min read</span>
            <span>•</span>
            <time>January 30, 2026</time>
          </div>
        </header>

        {/* Introduction */}
        <p className="lead text-xl text-gray-600 dark:text-gray-300 mb-8">
          Until recently, tuning a guitar required a physical device or a native mobile app. But with the evolution of the <strong>Web Audio API</strong>, modern browsers like Chrome and Firefox can now process real-time audio with near-native performance.
        </p>

        <p>
          As a developer and musician, I built this <Link href="/" className="text-indigo-600 underline">Tuner + Metronome</Link> to see if I could replicate the precision of a hardware tuner using only JavaScript. The result is a system that processes microphone input locally, ensuring zero network latency and total privacy. Here is a look under the hood at how it works.
        </p>

        <hr className="my-10 border-gray-200 dark:border-gray-800" />

        {/* Section 1: Capturing Audio */}
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-12 mb-4">
          1. Capturing the Sound Wave
        </h2>
        <p>
          The first step is accessing the user's microphone. In the browser, we use `navigator.mediaDevices.getUserMedia`. This prompts the user for permission—a critical security step—and returns a `MediaStream`.
        </p>
        <p>
          Once we have the stream, we create an <strong>AudioContext</strong>. Think of the AudioContext as a virtual patch bay where we can wire together different audio nodes. We connect the microphone (SourceNode) to an <strong>AnalyserNode</strong>, which allows us to peek at the raw audio data in real-time.
        </p>

        <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-800 text-sm font-mono overflow-x-auto my-6">
          <p className="text-gray-500 mb-2">{'// Simplified Audio Setup'}</p>
          <p>const audioCtx = new window.AudioContext();</p>
          <p>const analyser = audioCtx.createAnalyser();</p>
          <p>const source = audioCtx.createMediaStreamSource(stream);</p>
          <p>source.connect(analyser);</p>
        </div>

        {/* Section 2: Time Domain vs. Frequency Domain */}
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-12 mb-4">
          2. The Problem with FFT
        </h2>
        <p>
          Most developers instinctively reach for the <strong>Fast Fourier Transform (FFT)</strong> when dealing with audio. FFT converts a signal from the time domain (amplitude over time) to the frequency domain (loudness of specific frequencies).
        </p>
        

{/* Image: time domain vs frequency domain signal graph */}

        <p>
          While FFT is great for visualizers, it has a "resolution" problem for tuners. The gaps between "bins" in an FFT can be too wide to distinguish between a slightly sharp or flat note, especially at low frequencies (like a bass guitar&apos;s low E). For a professional tuner, we need more precision.
        </p>

       {/* Section 3: Autocorrelation */}
<h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-12 mb-4">
  3. The Solution: Autocorrelation
</h2>
<p>
  Instead of looking at frequencies directly, we use an algorithm called <strong>Autocorrelation</strong>. This technique works in the time domain.
</p>
<p>
  Imagine taking a waveform and sliding a copy of it over itself. When the copy lines up perfectly with the original repeating pattern, the signals "correlate" strongly. The distance (in time) between these peak correlations tells us the <strong>period</strong> of the wave.
</p>
<p>
  Once we know the period ($T$), calculating the frequency ($f$) is simple physics:
</p>

{/* Wrapping in quotes/braces stops TypeScript from looking for a variable named T */}
<div className="my-6 text-center text-2xl font-serif italic text-gray-800 dark:text-gray-200">
  {"$$ f = \\frac{1}{T} $$"}
</div>

<p>
  This method is incredibly robust for monophonic instruments (like a single guitar string) because it ignores a lot of the harmonic noise that confuses simple FFTs.
</p>

        {/* Section 4: Privacy & Performance */}
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-12 mb-4">
          4. Why Local Processing Matters
        </h2>
        <p>
          One of the core architectural decisions for this app was to process everything client-side using <strong>AudioWorklets</strong>.
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-6">
          <li>
            <strong>Latency:</strong> Sending audio to a server takes 100ms+. Local processing takes &lt;5ms. This responsiveness is non-negotiable for tuning.
          </li>
          <li>
            <strong>Privacy:</strong> Because the code runs in your browser, your microphone data <em>never</em> leaves your device. There is no cloud recording or data mining of your practice sessions.
          </li>
        </ul>

        {/* Conclusion */}
        <div className="bg-indigo-50 dark:bg-indigo-900/20 border-l-4 border-indigo-600 p-6 mt-12 rounded-r-lg">
          <h3 className="text-xl font-bold text-indigo-900 dark:text-indigo-100 mb-2">
            Try it yourself
          </h3>
          <p className="text-indigo-800 dark:text-indigo-200 mb-4">
            Now that you know how the technology works, give it a try. The tuner is free, private, and ready to use.
          </p>
          <Link 
            href="/" 
            className="inline-block bg-indigo-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Launch Tuner
          </Link>
        </div>

      </article>

      {/* Footer Navigation */}
      <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800 flex justify-between text-sm text-gray-500">
        <Link href="/resources" className="hover:text-indigo-600">&larr; Back to Resources</Link>
        <Link href="/metronome" className="hover:text-indigo-600">Try Metronome &rarr;</Link>
      </div>
    </main>
  );
}