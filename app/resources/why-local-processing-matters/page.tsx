"use client";


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
    "datePublished": "2026-01-30"
  };

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />

      <article className="prose prose-lg dark:prose-invert max-w-none text-gray-800 dark:text-gray-100">
        {/* Header */}
        <header className="mb-10 text-center">
          <div className="text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider text-sm mb-3">
            Privacy & Performance
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
            Privacy by Design: Why We Process Audio Locally
          </h1>
          <div className="flex items-center justify-center space-x-4 text-gray-500 text-sm">
            <span>By <strong>Jotham Saiborne</strong></span>
            <span>•</span>
            <span>5 min read</span>
            <span>•</span>
            <time>January 30, 2026</time>
          </div>
        </header>

        <p className="lead text-xl text-gray-600 dark:text-gray-300 mb-8">
          In an era where &quot;the cloud&quot; is the default destination for data, many users are rightfully hesitant to grant microphone access to a website. We built this <Link href="/" className="text-amber-600 underline">tuner</Link> with a different philosophy: <strong>Your data should never leave your room.</strong>
        </p>

        <h2 className="text-3xl font-bold mt-12 mb-4">What is Client-Side Processing?</h2>
        <p>
          &quot;Local processing&quot; or &quot;Client-side execution&quot; means that all the heavy mathematical lifting required to find the pitch of your guitar or the timing of your metronome happens entirely within your device&apos;s RAM and CPU. 
        </p>
        <p>
          When you click &quot;Start&quot; on our tool, the browser captures the audio stream, runs it through our <strong>AudioWorklet</strong> algorithms, and displays the result. At no point is a recording of your instrument sent to our servers.
        </p>

        <h2 className="text-3xl font-bold mt-12 mb-4">The Latency Factor</h2>
        <p>
          For musicians, <strong>latency is the enemy.</strong> If you play a note and the tuner takes 200 milliseconds to tell you it&apos;s flat, you&apos;ve already moved on. 
        </p>
        
        

        <p>
          By processing audio locally, we eliminate the &quot;Round Trip Time&quot; (RTT) required to send data to a server and wait for a response. This allows our tuner to provide feedback in real-time, matching the responsiveness of a hardware pedal.
        </p>

        <h2 className="text-3xl font-bold mt-12 mb-4">Security and Trust</h2>
        <p>
          As a Masters Computer Science student, I believe developers have an ethical obligation to minimize data collection. By keeping audio processing local:
        </p>
        <ul className="list-disc pl-6 space-y-4 mb-6">
          <li>
            <strong>Zero-Knowledge:</strong> We cannot accidentally leak your audio data because we never possessed it in the first place.
          </li>
          <li>
            <strong>Offline Capability:</strong> Once the page is loaded, the core tuner and metronome logic can function without an active internet connection.
          </li>
          <li>
            <strong>Reduced Fingerprinting:</strong> We don&apos;t need to track your location or identity to provide the service.
          </li>
        </ul>

        <h2 className="text-3xl font-bold mt-12 mb-4">Supporting the Project</h2>
        <p>
          While we don&apos;t monetize your data, running a high-performance web app does involve infrastructure costs. To keep these tools free for everyone, we display a limited number of ads. 
        </p>
        <p>
          This model allows us to sustain the project while strictly adhering to the <strong>Privacy Policy</strong> you can find in our footer—ensuring that while an ad might load, your music remains yours and yours alone.
        </p>

        <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-600 p-8 rounded-r-lg mt-12">
          <h3 className="text-2xl font-bold text-amber-900 dark:text-amber-100 mb-4">Our Commitment</h3>
          <p className="text-amber-800 dark:text-amber-200">
            We are committed to building tools that respect the user. If you have questions about how our Web Audio implementation works or want to see the open-source spirit behind the code, feel free to <Link href="/contact" className="underline font-bold">contact us</Link>.
          </p>
        </div>
      </article>

      <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800 flex justify-between text-sm text-gray-500">
        <Link href="/resources" className="hover:text-amber-600">&larr; Back to Resources Hub</Link>
        <Link href="/" className="hover:text-amber-600">Back to Tuner &rarr;</Link>
      </div>
    </main>
  );
}