"use client";
/* eslint-disable react/no-unescaped-entities */

import React from "react";
import Link from "next/link";

export default function MetronomePracticeTips() {
  // Schema for Google (Article)
  const ld = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Mastering Your Internal Clock: Advanced Metronome Practice Techniques",
    "url": "https://tunermetronome.com/resources/metronome-practice-tips",
    "description": "Stop just playing along. Learn 5 essential metronome exercises to improve rhythmic precision, including gap clicking and subdivision training.",
    "author": {
      "@type": "Person",
      "name": "Jotham Saiborne"
    },
    "datePublished": "2026-01-30",
    "image": "https://your-domain.com/og-image-metronome.jpg" // Update or remove
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
          <div className="text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider text-sm mb-3">
            Musicianship & Practice
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-gray-100 mb-6 leading-tight">
            Mastering Your Internal Clock: 5 Metronome Exercises
          </h1>
          <div className="flex items-center justify-center space-x-4 text-gray-500 text-sm">
            <span>By <strong>Jotham Saiborne</strong></span>
            <span>•</span>
            <span>6 min read</span>
            <span>•</span>
            <time>January 30, 2026</time>
          </div>
        </header>

        {/* Introduction */}
        <p className="lead text-xl text-gray-600 dark:text-gray-300 mb-8">
          Many musicians treat a metronome like a seatbelt: they only use it because they have to, and they take it off as soon as possible. But a metronome isn't just for keeping you from speeding up—it is a tool for calibrating your brain's perception of time.
        </p>

        <p>
          As a developer, I built this <Link href="/metronome" className="text-emerald-600 underline">Web Metronome</Link> to be "sample-accurate," meaning the click happens at the exact millisecond required by the BPM. But accuracy in the tool means nothing without accuracy in the player. Here are five exercises to turn that clicking sound into solid rhythm.
        </p>

        <hr className="my-10 border-gray-200 dark:border-gray-800" />

        {/* Exercise 1 */}
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-12 mb-4">
          1. Burying the Click
        </h2>
        <p>
          This is the gold standard for rhythmic precision. The goal isn't to hear the click; the goal is to make it disappear.
        </p>
        <p>
          When your note's attack happens at the exact same millisecond as the metronome's click, the sound of your instrument "masks" the click. If you can still hear the metronome clearly, you are either slightly early or slightly late.
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-6">
          <li><strong>Set BPM:</strong> 60-80 BPM.</li>
          <li><strong>Task:</strong> Play a simple scale or open string quarter notes.</li>
          <li><strong>Goal:</strong> Adjust your timing until the click seems to vanish under your note.</li>
        </ul>

        {/* Exercise 2 */}
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-12 mb-4">
          2. The "Gap" Method
        </h2>
        <p>
          Most players rely on the click as a crutch. If the click stops, they drift. This exercise forces you to become the timekeeper.
        </p>
        <p>
          Using a DAW or a programmable metronome, mute the click for one bar, then unmute it for the next.
        </p>
        <div className="bg-gray-100 dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800 my-6">
          <h4 className="font-bold text-gray-800 dark:text-gray-100 mb-2">Try this pattern:</h4>
          <p className="font-mono text-sm">
            | CLICK - CLICK - CLICK - CLICK | (Play)<br/>
            | SILENCE - SILENCE - SILENCE - SILENCE | (Keep playing)<br/>
            | CLICK... (Did you land on beat 1?)
          </p>
        </div>
        <p>
          If you come back in early, you are rushing (anxiety). If you are late, you are dragging (lethargy). This exposes your internal tendency so you can fix it.
        </p>

        {/* Exercise 3 */}
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-12 mb-4">
          3. Subdividing the Slow Beat
        </h2>
        <p>
          Playing fast is easy; playing slow is hard. When the clicks are far apart (e.g., 40 BPM), there is a massive amount of empty space where you can get lost.
        </p>
        <p>
          Set the metronome to <strong>40 BPM</strong>. Instead of just waiting for the next click, fill the empty space in your head with 16th notes (<em>"1-e-and-a, 2-e-and-a"</em>). This grid in your mind keeps you locked in even when the external reference is sparse.
        </p>

        {/* Exercise 4 */}
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-12 mb-4">
          4. Displacing the Beat
        </h2>
        <p>
          Jazz and funk players often feel the "2" and "4" rather than the "1" and "3."
        </p>
        <p>
          Set your metronome to a comfortable tempo, but pretend the click is <strong>only the backbeat</strong> (beats 2 and 4). This completely changes the feel of the rhythm and forces you to generate the downbeat (beat 1) yourself. It’s excellent training for playing with a drummer.
        </p>

        {/* Conclusion / CTA */}
        <div className="bg-emerald-50 dark:bg-emerald-900/20 border-l-4 border-emerald-600 p-6 mt-12 rounded-r-lg">
          <h3 className="text-xl font-bold text-emerald-900 dark:text-emerald-100 mb-2">
            Ready to test your timing?
          </h3>
          <p className="text-emerald-800 dark:text-emerald-200 mb-4">
            Our free browser-based metronome is precise, adjustable, and ready for your practice session.
          </p>
          <div className="flex gap-4">
            <Link 
                href="/metronome" 
                className="inline-block bg-emerald-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
            >
                Launch Metronome
            </Link>
            <Link 
                href="/" 
                className="inline-block bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 font-medium px-6 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
                Check Tuner
            </Link>
          </div>
        </div>

      </article>

      {/* Footer Navigation */}
      <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800 flex justify-between text-sm text-gray-500">
        <Link href="/resources" className="hover:text-emerald-600">&larr; Back to Resources</Link>
        <Link href="/resources/how-web-audio-works" className="hover:text-emerald-600">Technical Guide: Web Audio &rarr;</Link>
      </div>
    </main>
  );
}