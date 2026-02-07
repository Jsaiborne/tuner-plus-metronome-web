"use client";
/* eslint-disable @next/next/no-img-element */

import React from "react";
import Link from "next/link";

export default function LocalProcessingArticle() {
  const ld = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": "Privacy by Design: Why Local Audio Processing Matters for Musicians",
    "url": "https://tunermetronome.com/resources/why-local-processing-matters",
    "description": "An exploration of client-side audio processing, privacy, and why keeping microphone data out of the cloud is essential for modern web tools.",
    "author": {
      "@type": "Person",
      "name": "Jotham Saiborne"
    },
    "datePublished": "2026-01-30",
    "image": "https://tunermetronome.com/images/placeholder-local-processing.jpg"
  };

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />

      <article className="prose prose-lg dark:prose-invert max-w-none text-gray-800 dark:text-gray-100">

        {/* Single hero image - top of article */}
        <div className="w-full rounded-lg overflow-hidden mb-8 shadow-sm">
          <img
            src="/images/local-processing.png"
            alt="Illustration: schematic showing audio captured in-browser and processed locally (no cloud)."
            width="1200"
            height="630"
            loading="eager"
            className="w-full h-auto object-cover"
          />
        </div>

        {/* Header */}
        <header className="mb-10 text-center">
          <div className="text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider text-sm mb-3">
            Privacy &amp; Performance
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
            Privacy by Design: Why We Process Audio Locally
          </h1>
          <div className="flex items-center justify-center space-x-4 text-gray-500 text-sm">
            <span>By <strong>Jotham Saiborne</strong></span>
            <span>•</span>
            <span>6–9 min read</span>
            <span>•</span>
            <time>January 30, 2026</time>
          </div>
        </header>

        {/* Intro */}
        <p className="lead text-xl text-gray-600 dark:text-gray-300 mb-6">
          In an era where &quot;the cloud&quot; is the default destination for unknown data, many users are rightly cautious about granting microphone access.
          We built this tuner and metronome tooling with a different philosophy: <strong>your audio stays on your device.</strong> This article explains how and why.
        </p>

        <h2 className="text-3xl font-bold mt-8 mb-4">What is client-side audio processing?</h2>
        <p>
          Client-side audio processing means that audio capture, analysis, and feature extraction (pitch detection, beat detection, spectrogram computation)
          all happen inside the user&apos;s browser or device. No raw audio is uploaded to any remote server for processing. The browser APIs (Web Audio API, AudioWorklet)
          and local compute (JavaScript + WebAssembly) are used to implement real-time algorithms.
        </p>

        <h2 className="text-3xl font-bold mt-8 mb-4">How it works — a simple signal flow</h2>
        <ol className="list-decimal ml-6 mb-6">
          <li><strong>Capture:</strong> Browser requests microphone access via <code>getUserMedia()</code>.</li>
          <li><strong>Process:</strong> An <code>AudioWorklet</code> or worker performs sample-accurate analysis (YIN, autocorrelation, HPS, etc.).</li>
          <li><strong>Display:</strong> Visual feedback (needle, waveform, tuning bar) is rendered in the UI with low-latency updates.</li>
          <li><strong>(Optional)</strong> Small telemetry (non-sensitive usage stats) can be sent if the user opts in &mdash; never raw audio.</li>
        </ol>

        <h2 className="text-3xl font-bold mt-8 mb-4">Why local processing matters</h2>
        <p>
          There are three strong reasons to process audio locally: <strong>privacy</strong>, <strong>latency</strong>, and <strong>reliability</strong>.
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li>
            <strong>Privacy:</strong> If audio never leaves the device, there is no recording on a server that could be leaked, subpoenaed, or misused.
          </li>
          <li>
            <strong>Latency:</strong> Local processing eliminates the network round trip. Real-time feedback (under ~20ms) is achievable on modern devices.
          </li>
          <li>
            <strong>Reliability:</strong> The tool can run offline or on unstable networks; musicians can practice anywhere.
          </li>
        </ul>

        <h2 className="text-3xl font-bold mt-8 mb-4">Technologies we use</h2>
        <p>
          Modern browsers provide two critical capabilities: the Web Audio API for routing and scheduling, and <code>AudioWorklet</code> for low-jitter,
          high-priority audio processing on a separate thread. For heavier math (FFT, convolution) we sometimes compile C/C++ to <strong>WebAssembly (WASM)</strong>
          for faster execution.
        </p>

        <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded text-sm overflow-auto font-mono">
{`// minimal pattern to register an AudioWorklet
await audioContext.audioWorklet.addModule('/worklets/pitch-processor.js');
const node = new AudioWorkletNode(audioContext, 'pitch-processor');
mediaStreamSource.connect(node);
node.port.onmessage = (e) => { /* pitch updates */ };`}
        </pre>

        <h2 className="text-3xl font-bold mt-8 mb-4">Fallbacks and progressive enhancement</h2>
        <p>
          Not every browser supports <code>AudioWorklet</code> (older ones may only support <code>ScriptProcessorNode</code>). We detect capabilities at runtime and gracefully fallback
          to a slightly higher-latency but functional method. Progressive enhancement ensures the core experience works widely while modern browsers get the best performance.
        </p>

        <h2 className="text-3xl font-bold mt-8 mb-4">Performance considerations</h2>
        <p>
          Local audio work must balance CPU, memory, and battery. Some practical tuning knobs:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li><strong>Buffer size:</strong> smaller buffers = lower latency but more CPU. Choose defaults based on device type.</li>
          <li><strong>Algorithm quality:</strong> allow the user to select &quot;Studio&quot; (high quality, higher CPU) or &quot;Live&quot; (fast, light smoothing).</li>
          <li><strong>WASM acceleration:</strong> heavy DSP (e.g., high-resolution FFTs) can be compiled to WASM for large speedups on desktop.</li>
        </ul>

        <h2 className="text-3xl font-bold mt-8 mb-4">Security and trust — what we don't do</h2>
        <p>
          Transparency is essential. We explicitly do not:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li>Record or store raw audio on remote servers by default.</li>
          <li>Send raw audio for processing without user consent and a clear opt-in.</li>
          <li>Share user audio with third parties.</li>
        </ul>

        <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-600 p-6 my-8 rounded-r-lg">
          <h3 className="text-xl font-bold text-amber-900 dark:text-amber-100 mb-2">Privacy checklist for developers</h3>
          <ol className="list-decimal ml-6">
            <li>Declare microphone use clearly in the UI before calling <code>getUserMedia()</code>.</li>
            <li>Document what data (if any) is sent to servers; prefer aggregated non-sensitive telemetry.</li>
            <li>Provide an explicit toggle for any opt-in cloud features (e.g., &quot;Upload recordings&quot;).</li>
            <li>Open-source critical parts so auditors can confirm no hidden uploads.</li>
          </ol>
        </div>

        <h2 className="text-3xl font-bold mt-8 mb-4">Testing &amp; validation</h2>
        <p>
          Test on a matrix of devices (desktop, mid-range phone, low-end phone), browsers (Chromium, Safari, Firefox), and under constrained CPU conditions (other tabs open).
          Include automated unit tests for DSP functions (frequency detection, windowing), and smoke tests that verify the UI responds when a mock audio stream is injected.
        </p>

        <h2 className="text-3xl font-bold mt-8 mb-4">Battery &amp; mobile tip</h2>
        <p>
          Mobile devices throttle background work aggressively. To give the best mobile experience:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li>Keep UI rendering efficient (avoid per-sample DOM updates &mdash; batch at animation frames).</li>
          <li>Allow users to disable visualizers to save battery during long practice sessions.</li>
        </ul>

        <hr className="my-8" />

        <hr className="my-8" />

        {/* CTA / Contact */}
        <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-600 p-8 mt-8 rounded-r-lg">
          <h3 className="text-2xl font-bold mb-2">Want to see the code?</h3>
          <p className="mb-4">
            We publish the core audio worklet and DSP helpers in our public repo. If you&apos;re building similar tools and want pointers or a code review, <Link href="/contact" className="underline font-bold">contact us</Link>.
          </p>
          <div className="flex gap-4">
            <Link href="/resources" className="px-6 py-3 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700">Browse Resources</Link>
            <Link href="/" className="px-6 py-3 bg-transparent border border-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">Open Tuner</Link>
          </div>
        </div>

        <hr className="my-8" />

        {/* Footer / Author */}
        <footer className="mt-10 pt-6 border-t">
          <div>
            <p className="font-semibold">Jotham Saiborne</p>
            <p className="text-sm text-gray-600">Musician &amp; developer. I build practical, privacy-first audio tools for practice and performance.</p>
          </div>
        </footer>
      </article>

      <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800 flex justify-between text-sm text-gray-500">
        <Link href="/resources" className="hover:text-amber-600">&larr; Back to Resources Hub</Link>
        <Link href="/" className="hover:text-amber-600">Back to Tuner &rarr;</Link>
      </div>
    </main>
  );
}
