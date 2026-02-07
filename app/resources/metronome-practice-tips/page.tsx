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
    "image": "https://tunermetronome.com/images/placeholder-metronome.jpg" // update when you upload
  };

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />

      <article className="prose prose-lg dark:prose-invert max-w-none">

        {/* Single hero image above the title (placeholder) */}
        <div className="w-full rounded-lg overflow-hidden mb-8 shadow-sm">
          <img
            src="/images/metronome.png"
            alt="Illustration: digital metronome with beats and subdivision grid"
            width="1200"
            height="630"
            loading="eager"
            className="w-full h-auto object-cover"
          />
        </div>

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
            <span>6–10 min read</span>
            <span>•</span>
            <time>January 30, 2026</time>
          </div>
        </header>

        {/* Introduction */}
        <p className="lead text-xl text-gray-600 dark:text-gray-300 mb-6">
          Many musicians treat the metronome like a safety net: useful, but regained freedom comes as soon as the device is switched off.
          These exercises train you to internalize pulse, develop subdivision awareness, and deal with real-world playing situations (drums, ensembles, variable tempo).
        </p>

        <p className="text-sm text-gray-500 mb-6">
          Use the free <Link href="/metronome" className="underline text-emerald-600">Web Metronome</Link> to try each exercise. Each section below includes goals, BPM recommendations, and progression notes so you can structure practice sessions that actually stick.
        </p>

        <hr className="my-10 border-gray-200 dark:border-gray-800" />

        {/* Exercise 1 */}
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-12 mb-4">
          1. Burying the Click (Micro-timing awareness)
        </h2>
        <p>
          The aim is to make the click disappear by aligning your attack precisely with it. If the click is audible on top of your note, your timing is off.
        </p>
        <p>
          <strong>How:</strong> Set BPM to 60–80. Play sustained notes or slow quarter-note patterns and focus on aligning the instantaneous attack of each note with the metronome pulse. Record short clips and listen back — recording reveals small timing biases you may not notice while playing.
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-6">
          <li><strong>Target:</strong> 90% of attacks masked by the click in a 1-minute run.</li>
          <li><strong>Progression:</strong> Decrease dynamic contrast (softer notes) and still keep alignment — this is harder and exposes timing drift.</li>
          <li><strong>Why it works:</strong> Masking requires microsecond alignment — this builds sub-beat precision.</li>
        </ul>

        {/* Exercise 2 */}
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-12 mb-4">
          2. The Gap Method (Silent-interval training)
        </h2>
        <p>
          The metronome sometimes acts as a psychological crutch. The Gap Method removes that crutch and forces internal pulse maintenance.
        </p>
        <p>
          <strong>How:</strong> Use a programmable metronome or DAW to mute the click for one bar every two or four bars. Play continuously and try to return precisely with the next audible click.
        </p>
        <div className="bg-gray-100 dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800 my-6">
          <h4 className="font-bold text-gray-800 dark:text-gray-100 mb-2">Pattern example</h4>
          <p className="font-mono text-sm">
            | CLICK CLICK CLICK CLICK | (Play) <br/>
            | SILENCE SILENCE SILENCE SILENCE | (Keep playing) <br/>
            | CLICK ... Did you hit beat 1?
          </p>
        </div>
        <p>
          <strong>Progression:</strong> Start by muting just one bar; gradually increase the silent span to four bars as you improve. If you consistently return early or late, shorten the silent window and practice more.
        </p>

        {/* Exercise 3 */}
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-12 mb-4">
          3. Subdivision Grid (Mental metronome)
        </h2>
        <p>
          Slow tempos are deceptively difficult. When clicks are sparse, subdividing the beat mentally keeps the pulse anchored.
        </p>
        <p>
          <strong>How:</strong> Set tempo to 40–60 BPM and internally subdivide using 8th or 16th notes ("1 e & a"). Play rhythms that cross bar lines while counting subdivisions aloud or in your head. Tap a foot on the main beats while voicing the subdivisions.
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-6">
          <li><strong>Tip:</strong> Clap or play metronome subdivisions (off-beats) every 2 or 4 bars to check internal counting.</li>
          <li><strong>Goal:</strong> Keep a steady grid for 2 minutes without losing the downbeat.</li>
        </ul>

        {/* Exercise 4 */}
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-12 mb-4">
          4. Displacing the Beat (Feeling the backbeat & syncopation)
        </h2>
        <p>
          Practice pretending the metronome click is only the backbeat (2 and 4). This forces you to generate the downbeat (1) internally and helps when playing with drum kits or looped grooves.
        </p>
        <p>
          <strong>How:</strong> Set a comfortable tempo (90–120 BPM). Play grooves while accenting imagined beats that the click does not mark. Try comping a jazz 2/4 feel or a funk backbeat while keeping internal track of phrase starts.
        </p>

        {/* Exercise 5 */}
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-12 mb-4">
          5. Variable Tempo & Transport Practice (Real-world adaptability)
        </h2>
        <p>
          Real music rarely stays at one steady tempo. Train to maintain pulse while the backing tempo slightly drifts or accelerates — just like a live ensemble.
        </p>
        <p>
          <strong>How:</strong> Use a DAW or metronome that supports slight accelerando/ritardando settings. Practice sustaining a line while the click slowly speeds up or slows down by 3–8% over 8–16 bars. Your aim is musical stability, not robotic precision — learn to adjust smoothly.
        </p>
        <p>
          <strong>Progression:</strong> Start with micro-changes (±2%) and increase range as you gain control. This exercise is especially valuable for accompanists and section players.
        </p>

        <hr className="my-10 border-gray-200 dark:border-gray-800" />

        {/* Practice plans + tips */}
        <section>
          <h3 className="text-2xl font-semibold mb-4">Practice Plans & Tips</h3>
          <p>
            Structure practice around short, focused blocks. A typical session that builds rhythm might look like:
          </p>
          <ol className="list-decimal ml-6 mb-6">
            <li>Warm-up (5 minutes): scales with buried clicks at 60–80 BPM.</li>
            <li>Focused block (10–15 minutes): gap method & subdivisions.</li>
            <li>Context (10 minutes): displaced-beat grooves and variable tempo.</li>
            <li>Reflect (5 minutes): record and listen back; note tendencies.</li>
          </ol>

          <p>
            <strong>Equipment note:</strong> use headphones for click-based practice to avoid bleed. If using a phone or laptop, prefer a USB or dedicated audio interface for lower latency.
          </p>

          <h4 className="text-lg font-semibold mt-6 mb-2">Common mistakes</h4>
          <ul className="list-disc pl-6 mb-6">
            <li>Rushing in transitions — fix by slowing the BPM dramatically and practicing phrasing.</li>
            <li>Over-reliance on the metronome sound (not the pulse) — try using a subtle or lower-volume click.</li>
            <li>Ignoring subdivisions — when alone, always count subdivisions out loud at least occasionally.</li>
          </ul>
        </section>

        <hr className="my-10 border-gray-200 dark:border-gray-800" />

        <hr className="my-10 border-gray-200 dark:border-gray-800" />

        {/* FAQ */}
        <section>
          <h3 className="text-2xl font-semibold mb-4">FAQ</h3>
          <h4 className="font-semibold">Q: How long until I notice improvement?</h4>
          <p className="mb-4">A: With focused 20–30 minute sessions 4–5 times per week, many players notice meaningful improvement in 2–4 weeks. The key is consistency and recording progress.</p>

          <h4 className="font-semibold">Q: Should I use a click with accents or a flat click?</h4>
          <p className="mb-4">A: Both. Accented clicks help phrase understanding; flat clicks are better for internalizing even subdivision and micro-timing.</p>

          <div className="mt-6">
            <Link href="/metronome" className="inline-block rounded bg-emerald-600 text-white px-4 py-2">Try the Web Metronome</Link>
            <Link href="/resources/how-web-audio-works" className="ml-3 text-sm text-gray-600 hover:underline">Read the technical tuner guide →</Link>
          </div>
        </section>

        <hr className="my-10 border-gray-200 dark:border-gray-800" />

        {/* Footer / Author */}
        <footer className="mt-10 pt-6 border-t">
          <div>
            <p className="font-semibold">Jotham Saiborne</p>
            <p className="text-sm text-gray-600">Musician & developer. I build audio tools for practice, performance, and education.</p>
          </div>
        </footer>
      </article>

      {/* Footer Navigation */}
      <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800 flex justify-between text-sm text-gray-500">
        <Link href="/resources" className="hover:text-emerald-600">&larr; Back to Resources</Link>
        <Link href="/resources/how-web-audio-works" className="hover:text-emerald-600">Technical Guide: Web Audio →</Link>
      </div>
    </main>
  );
}
