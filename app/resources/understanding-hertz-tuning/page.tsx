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
    "datePublished": "2026-01-30"
  };

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />

      <article className="prose prose-lg dark:prose-invert max-w-none text-gray-800 dark:text-gray-200">
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
            <span>7 min read</span>
            <span>•</span>
            <time>January 30, 2026</time>
          </div>
        </header>

        <p className="lead text-xl text-gray-600 dark:text-gray-300 mb-8">
          When you use a <Link href="/" className="text-blue-600 underline">digital tuner</Link>, you&apos;ll see a number like "440Hz" displayed. But what does that actually mean for your instrument, and why do some musicians insist on changing it?
        </p>

        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-12 mb-4">
          What is a Hertz (Hz)?
        </h2>
        <p>
          In physics, <strong>Hertz (Hz)</strong> is a unit of frequency defined as one cycle per second. When a guitar string vibrates back and forth 440 times in one second, it pushes the air at that same rate, creating a sound wave that our brain interprets as the musical note <strong>A4</strong> (the A above middle C).
        </p>

        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-12 mb-4">
          The Standard: A440
        </h2>
        <p>
          Before the 20th century, tuning was chaotic. An &quot;A&quot; in London might be different from an &quot;A&quot; in Paris. This made it nearly impossible for traveling musicians to play together or for instrument manufacturers to standardize their products.
        </p>
        <p>
          In 1936, the International Organization for Standardization (ISO) adopted <strong>A = 440Hz</strong> as the universal pitch standard. Today, almost every piano, digital keyboard, and symphony orchestra uses this reference point.
        </p>

        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-12 mb-4">
          The Alternative: A432
        </h2>
        <p>
          Despite the 440Hz standard, a growing community of musicians prefers tuning to <strong>432Hz</strong>. Proponents of 432Hz—often called &quot;Verdi&apos;s Tuning&quot;—claim that it sounds &quot;warmer&quot; or more &quot;natural.&quot;
        </p>
        <p>
          While many of the spiritual claims regarding 432Hz are debated, from a purely physical standpoint, tuning lower reduces the tension on the strings of an instrument. This can lead to a slightly mellower tone, which many players find relaxing during solo practice.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600 p-6 my-10 rounded-r-lg">
          <h3 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-2">
            Comparison Table
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead>
                <tr className="border-b border-blue-200 dark:border-blue-800">
                  <th className="py-2">Standard</th>
                  <th className="py-2">Frequency</th>
                  <th className="py-2">Common Use</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-2">ISO Standard</td>
                  <td className="py-2">440 Hz</td>
                  <td className="py-2">Modern Pop, Rock, Classical</td>
                </tr>
                <tr>
                  <td className="py-2">Scientific Pitch</td>
                  <td className="py-2">432 Hz</td>
                  <td className="py-2">Meditation, Baroque Soloists</td>
                </tr>
                <tr>
                  <td className="py-2">Baroque Pitch</td>
                  <td className="py-2">415 Hz</td>
                  <td className="py-2">Historical Reconstructions</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-12 mb-4">
          How to Use This in Your Practice
        </h2>
        <p>
          Our <Link href="/" className="text-blue-600 underline">chromatic tuner</Link> is calibrated by default to A440, but the visual feedback is designed to show you exactly where you land on the frequency spectrum.
        </p>
        <p>
          If you are practicing with a recording, it is vital to know if the track was recorded in a non-standard tuning. Some famous bands occasionally recorded slightly sharp or flat of 440Hz, making it difficult to play along unless you adjust your tuning accordingly.
        </p>

        {/* Conclusion */}
        <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-2xl mt-12 text-center">
          <h3 className="text-2xl font-bold mb-4">Ready to find your pitch?</h3>
          <p className="mb-6">
            Whether you&apos;re tuning to 440Hz for a gig or 432Hz for a session, our tool provides the real-time accuracy you need.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/" className="px-8 py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-all">
              Start Tuning
            </Link>
            <Link href="/resources" className="px-8 py-3 bg-transparent border border-gray-400 rounded-full font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">
              More Resources
            </Link>
          </div>
        </div>
      </article>
    </main>
  );
}
