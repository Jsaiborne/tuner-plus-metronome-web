"use client";
/* eslint-disable react/no-unescaped-entities */

import React from "react";
import Link from "next/link";

export default function Resources() {
  const ld = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Music & Tech Resources — Tuner + Metronome",
    "description": "Guides on instrument tuning, rhythm practice, and the audio technology behind our web tools.",
    "url": "https://your-domain.com/resources", // UPDATE THIS
    "author": {
      "@type": "Person",
      "name": "Jotham Saiborne"
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />

      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-4">
          Resources & Learning Hub
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Deep dives into music theory, practice techniques, and the computer science behind digital audio processing.
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        
        {/* Article Card 1: Technical Authority (High Value for AdSense) */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="text-indigo-600 dark:text-indigo-400 text-sm font-bold uppercase tracking-wide mb-2">
            Technology
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3">
            <Link href="/resources/how-web-audio-works" className="hover:text-indigo-600 dark:hover:text-indigo-400">
              How Web Audio Tuners Work
            </Link>
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Curious how your browser knows you're playing an 'A'? We break down the <strong>Web Audio API</strong>, autocorrelation algorithms, and how we process pitch data locally without sending it to a server.
          </p>
          <Link href="/resources/how-web-audio-works" className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline inline-flex items-center">
            Read technical breakdown &rarr;
          </Link>
        </div>

        {/* Article Card 2: Music Education (Utility Value) */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="text-emerald-600 dark:text-emerald-400 text-sm font-bold uppercase tracking-wide mb-2">
            Practice Guide
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3">
            <Link href="/resources/metronome-practice-tips" className="hover:text-emerald-600 dark:hover:text-emerald-400">
              Mastering Your Internal Clock
            </Link>
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            A metronome is more than just a clicking sound. Learn 5 essential exercises to improve your rhythmic precision, including "gap clicking" and subdivision practice for drummers and guitarists.
          </p>
          <Link href="/resources/metronome-practice-tips" className="text-emerald-600 dark:text-emerald-400 font-medium hover:underline inline-flex items-center">
            View practice tips &rarr;
          </Link>
        </div>

        {/* Article Card 3: Privacy & Ethics (Trust Signal) */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="text-amber-600 dark:text-amber-400 text-sm font-bold uppercase tracking-wide mb-2">
            Privacy
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3">
            <Link href="/resources/why-local-processing-matters" className="hover:text-amber-600 dark:hover:text-amber-400">
              Why We Process Audio Locally
            </Link>
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Most apps send your data to the cloud. We chose a different path. Learn why local processing reduces latency for musicians and protects your privacy by keeping microphone data on your device.
          </p>
          <Link href="/resources/why-local-processing-matters" className="text-amber-600 dark:text-amber-400 font-medium hover:underline inline-flex items-center">
             Read our privacy philosophy &rarr;
          </Link>
        </div>

        {/* Article Card 4: Tuning Standards */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="text-blue-600 dark:text-blue-400 text-sm font-bold uppercase tracking-wide mb-2">
            Music Theory
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3">
            <Link href="/resources/understanding-hertz-tuning" className="hover:text-blue-600 dark:hover:text-blue-400">
              A440 vs. A432: Understanding Hertz
            </Link>
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            What does "440Hz" actually mean? We explore the physics of sound frequencies, historical tuning standards, and how to use our tuner for alternative reference pitches.
          </p>
          <Link href="/resources/understanding-hertz-tuning" className="text-blue-600 dark:text-blue-400 font-medium hover:underline inline-flex items-center">
            Learn about frequencies &rarr;
          </Link>
        </div>

      </div>

      {/* Bottom CTA to Tools */}
      <div className="mt-16 text-center border-t border-gray-200 dark:border-gray-800 pt-12">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
          Ready to practice?
        </h3>
        <div className="flex justify-center gap-4">
          <Link href="/" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors">
            Open Tuner
          </Link>
          <Link href="/metronome" className="px-6 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg font-medium border border-gray-200 dark:border-gray-700 transition-colors">
            Open Metronome
          </Link>
        </div>
      </div>
    </main>
  );
}