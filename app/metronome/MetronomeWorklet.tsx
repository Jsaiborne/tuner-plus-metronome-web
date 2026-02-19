"use client";
/* eslint-disable react/no-unescaped-entities */

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { createWorker } from "./MetronomeWorker";
import { useAudioContext } from "../context/AudioContextProvider";
import { Poppins, Inter } from "next/font/google";

// Fonts
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600", "700"], variable: "--font-poppins", display: "swap" });
const inter = Inter({ subsets: ["latin"], weight: ["300", "400", "600"], variable: "--font-inter", display: "swap" });

const MetronomeWorklet: React.FC = () => {
  const { getAudioContext, createAudioContextOnGesture } = useAudioContext();

  // UI state
  const [unlocked, setUnlocked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [current16thNoteState, setCurrent16thNoteState] = useState(0); 
  const [tempo, setTempo] = useState(120.0);
  const [lookahead, setLookAhead] = useState(25.0); 
  const [scheduleAheadTime, setScheduleAheadTime] = useState(0.1);
  const [nextNoteTimeState, setNextNoteTimeState] = useState(0);
  const [noteResolution, setNoteResolution] = useState(0);
  const [noteLength, setNoteLength] = useState(0.05);

  // time signature
  const [beatsPerMeasure, setBeatsPerMeasure] = useState(4);
  const [beatUnit, setBeatUnit] = useState(4);

  // tap tempo
  const tapTimesRef = useRef<number[]>([]);
  const TAP_TIMEOUT_MS = 2000;
  const TAP_MAX = 6;

  // timing-critical refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const workerRef = useRef<Worker | null>(null);
  const nextNoteTimeRef = useRef<number>(0);
  const currentTickRef = useRef<number>(0); 

  // refs for avoiding stale closures
  const tempoRef = useRef<number>(tempo);
  const scheduleAheadRef = useRef<number>(scheduleAheadTime);
  const noteLengthRef = useRef<number>(noteLength);
  const noteResolutionRef = useRef<number>(noteResolution);
  const beatsPerMeasureRef = useRef<number>(beatsPerMeasure);
  const beatUnitRef = useRef<number>(beatUnit);
  const lookaheadRef = useRef<number>(lookahead);

  useEffect(() => { tempoRef.current = tempo; }, [tempo]);
  useEffect(() => { scheduleAheadRef.current = scheduleAheadTime; }, [scheduleAheadTime]);
  useEffect(() => { noteLengthRef.current = noteLength; }, [noteLength]);
  useEffect(() => { noteResolutionRef.current = noteResolution; }, [noteResolution]);
  useEffect(() => { beatsPerMeasureRef.current = beatsPerMeasure; }, [beatsPerMeasure]);
  useEffect(() => { beatUnitRef.current = beatUnit; }, [beatUnit]);
  useEffect(() => { lookaheadRef.current = lookahead; }, [lookahead]);

  const subdivisionsPerBeatFor = (resolution: number) => {
    if (resolution === 0) return 4;
    if (resolution === 1) return 2;
    if (resolution === 2) return 1;
    if (resolution === 3) return 3;
    return 4;
  };

  function getMeasureLengthInTicks(resolution?: number) {
    const res = resolution ?? noteResolutionRef.current;
    const subs = subdivisionsPerBeatFor(res);
    const bp = beatsPerMeasureRef.current || 4;
    return Math.max(1, bp * subs);
  }

  function scheduleNote(tickNumber: number, time: number) {
    const ctx = audioContextRef.current;
    if (!ctx) return;

    const res = noteResolutionRef.current;
    const subs = subdivisionsPerBeatFor(res);

    const measureLen = getMeasureLengthInTicks();
    const positionInMeasure = ((tickNumber % measureLen) + measureLen) % measureLen;

    const isMeasureStart = positionInMeasure === 0;
    const isBeatBoundary = (positionInMeasure % subs) === 0;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (isMeasureStart) osc.frequency.value = 920.0;
    else if (isBeatBoundary) osc.frequency.value = 520.0;
    else osc.frequency.value = 260.0;

    const len = noteLengthRef.current;
    gain.gain.setValueAtTime(1, time);
    gain.gain.linearRampToValueAtTime(0, time + len);

    osc.start(time);
    osc.stop(time + len + 0.02);
    osc.onended = () => { try { osc.disconnect(); gain.disconnect(); } catch {} };
  }

  function advanceNote() {
    const secondsPerBeat = 60.0 / tempoRef.current; 
    const subs = subdivisionsPerBeatFor(noteResolutionRef.current);
    const tickDuration = secondsPerBeat / subs; 

    nextNoteTimeRef.current += tickDuration;

    const measureLen = getMeasureLengthInTicks();
    currentTickRef.current = (currentTickRef.current + 1) % measureLen;

    setNextNoteTimeState(nextNoteTimeRef.current);
    setCurrent16thNoteState(currentTickRef.current);
  }

  function scheduler() {
    const ctx = audioContextRef.current;
    if (!ctx) return;

    while (nextNoteTimeRef.current < ctx.currentTime + scheduleAheadRef.current) {
      scheduleNote(currentTickRef.current, nextNoteTimeRef.current);
      advanceNote();
    }
  }

  const handleClick = () => {
    const willPlay = !isPlaying;
    setIsPlaying(willPlay);

    let ctx: AudioContext | null = audioContextRef.current;
    try { if (!ctx && typeof createAudioContextOnGesture === "function") ctx = createAudioContextOnGesture(); } catch (err) {}
    if (!ctx && typeof getAudioContext === "function") ctx = getAudioContext();
    if (!ctx) { console.warn("No AudioContext available"); return; }

    audioContextRef.current = ctx;
    const resumePromise = ctx.resume().catch((err) => console.warn("audio resume failed:", err));

    resumePromise.then(() => {
      if (!unlocked) {
        try {
          const buffer = ctx.createBuffer(1, 1, ctx.sampleRate);
          const node = ctx.createBufferSource();
          node.buffer = buffer;
          node.start(0);
          setUnlocked(true);
        } catch (err) {}
      }

      if (willPlay) {
        currentTickRef.current = 0;
        nextNoteTimeRef.current = ctx.currentTime;
        setCurrent16thNoteState(0);
        setNextNoteTimeState(nextNoteTimeRef.current);

        try {
          if (workerRef.current) {
            workerRef.current.postMessage({ interval: lookaheadRef.current });
            workerRef.current.postMessage("start");
            workerRef.current.postMessage({ cmd: "start" });
          }
        } catch (err) { console.warn("failed to post start to worker:", err); }

        try { scheduler(); } catch (err) { console.error("scheduler error:", err); }
      } else {
        try { if (workerRef.current) { workerRef.current.postMessage("stop"); workerRef.current.postMessage({ cmd: "stop" }); } } catch (err) { console.warn("failed to post stop to worker:", err); }
      }
    });
  };

  useEffect(() => {
    const w = createWorker();
    workerRef.current = w;
    const onMessage = (ev: MessageEvent) => { if (ev.data === "tick") scheduler(); };
    w.addEventListener("message", onMessage);
    w.postMessage({ interval: lookaheadRef.current });

    return () => {
      try { w.postMessage({ cmd: "stop" }); } catch {}
      w.removeEventListener("message", onMessage);
      try { w.terminate(); } catch {}
      workerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (workerRef.current) {
      try { workerRef.current.postMessage({ interval: lookahead }); } catch {}
    }
  }, [lookahead]);

  const tapTempo = () => {
    const now = performance.now();
    const arr = tapTimesRef.current;
    while (arr.length && now - arr[0] > TAP_TIMEOUT_MS) arr.shift();
    arr.push(now);
    if (arr.length > TAP_MAX) arr.splice(0, arr.length - TAP_MAX);

    if (arr.length >= 2) {
      const diffs: number[] = [];
      for (let i = 1; i < arr.length; i++) diffs.push(arr[i] - arr[i - 1]);
      const avgMs = diffs.reduce((a, b) => a + b, 0) / diffs.length;
      const secondsPerBeat = avgMs / 1000;
      const newBpm = Math.round(60 / secondsPerBeat);
      setTempo(newBpm);
      tempoRef.current = newBpm;
    }
  };

  const incrementTempo = (delta: number) => {
    setTempo((t) => {
      const next = Math.max(20, Math.min(400, Math.round(t + delta)));
      tempoRef.current = next;
      return next;
    });
  };

  const selectResolution = (r: number) => setNoteResolution(r);
  const changeBeatsPerMeasure = (v: number) => setBeatsPerMeasure(Math.max(1, Math.min(16, Math.floor(v))));
  const changeBeatUnit = (u: number) => { const allowed = [1,2,4,8,16]; if (allowed.includes(u)) setBeatUnit(u); };
  const resolutionLabel = (r: number) => (r === 2 ? "Quarter" : r === 1 ? "8th" : r === 3 ? "Triplet" : "16th");

  function describeSector(cx: number, cy: number, r: number, startAngleDeg: number, endAngleDeg: number) {
    const startRad = (Math.PI / 180) * startAngleDeg;
    const endRad = (Math.PI / 180) * endAngleDeg;
    const x1 = cx + r * Math.cos(startRad);
    const y1 = cy + r * Math.sin(startRad);
    const x2 = cx + r * Math.cos(endRad);
    const y2 = cy + r * Math.sin(endRad);
    const largeArcFlag = endAngleDeg - startAngleDeg <= 180 ? 0 : 1;
    return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  }

  const svgSize = 420;
  const cx = svgSize / 2;
  const cy = svgSize / 2;
  const outerR = 180;
  const innerR = 98;
  const anglePerSlice = 360 / Math.max(1, beatsPerMeasure);

  const subsForUI = subdivisionsPerBeatFor(noteResolution);
  const activeBeatIndex = isPlaying ? Math.floor(current16thNoteState / subsForUI) % beatsPerMeasure : -1;

  return (
    <div className={`${poppins.variable} ${inter.variable} metronome-wrapper`}>
      <style>{`
        :root { --primary: #06b6d4; --accent: #7c3aed; --bg: #f8fafc; --panel-bg: rgba(255,255,255,0.9); --text:#0f172a; --muted:#64748b; --donut-bg:#fff; --slice-stroke: rgba(15,23,42,0.06); }
        @media (prefers-color-scheme: dark) { :root { --primary: #06b6d4; --accent:#7c3aed; --bg:#071023; --panel-bg:rgba(7,16,35,0.6); --text:#e6eef6; --muted:#94a3b8; --donut-bg:#071023; --slice-stroke: rgba(255,255,255,0.06);} }

        .metronome-wrapper { padding:32px; background: var(--bg); border-radius:20px; box-shadow: 0 20px 60px rgba(2,6,23,0.06); display:flex; flex-direction:column; gap:24px; align-items:center; justify-content:center; max-width:1100px; width:95vw; margin:0 auto; font-family:var(--font-inter); color:var(--text); }
        .main-row { display:flex; gap:32px; align-items:flex-start; justify-content:center; width:100%; }
        .circle-container { width:420px; height:420px; position:relative; flex-shrink:0; }
        .controls { min-width:420px; display:flex; flex-direction:column; gap:24px; }

        .metronome-svg { display:block; width:100%; height:100%; }
        .slice { transition: fill 220ms ease, stroke 220ms ease, transform 320ms cubic-bezier(.2,.9,.25,1), filter 320ms; transform-box: fill-box; transform-origin: 50% 50%; }
        .slice.active { fill: rgba(6,182,212,0.12); stroke: var(--primary); transform: scale(1.03); filter: drop-shadow(0 10px 28px rgba(6,182,212,0.06)); }
        .slice.strong { fill: rgba(124,58,237,0.16); stroke: var(--accent); animation: pulse 700ms ease-out; transform: scale(1.07); filter: drop-shadow(0 18px 40px rgba(124,58,237,0.08)); }
        @keyframes pulse { 0% { transform: scale(1); } 30% { transform: scale(1.10); } 100% { transform: scale(1.05); } }
        .donut-hole { transition: transform 260ms ease; fill: var(--donut-bg); stroke: var(--slice-stroke); }

        .center-btn { width:160px; height:160px; border-radius:9999px; display:flex; align-items:center; justify-content:center; cursor:pointer; border:none; }
        .center-btn.playing { background: linear-gradient(180deg,var(--primary),var(--primary)); box-shadow: 0 18px 40px rgba(6,182,212,0.14); }
        .center-btn.paused { background: linear-gradient(180deg,rgba(255,255,255,0.9),var(--panel-bg)); box-shadow: 0 8px 20px rgba(15,23,42,0.04); }
        .center-icon { width:56px; height:56px; }

        .tempo-label { font-size:20px; color: var(--text); font-family:var(--font-poppins); font-weight:600; }
        .tempo-block { display:flex; flex-direction:column; gap:10px; }
        .tempo-slider { width:360px; accent-color: var(--primary); }
        .tempo-row { display:flex; align-items:center; gap:20px; flex-wrap: wrap; }
        .tempo-arrows { display:flex; gap:10px; }
        .arrow-btn { width:46px; height:46px; border-radius:10px; border:1px solid rgba(15,23,42,0.06); font-size:18px; background:transparent; cursor:pointer; }
        .tempo-input { width:100px; padding:10px; font-size:18px; }
        .tap-btn { padding:10px 14px; border-radius:10px; border:1px solid rgba(15,23,42,0.06); background:transparent; cursor:pointer; font-size:16px; }
        .controls-row { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
        .subdivision-btn { padding:10px 14px; border-radius:10px; font-size:16px; font-family:var(--font-poppins); }
        select { padding:8px 10px; font-size:16px; border-radius:8px; }

        .info-row { width:100%; display:flex; justify-content:space-between; flex-wrap: wrap; gap:16px; font-size:18px; color:var(--muted); margin-top:6px; }

        @media (max-width: 900px) { .metronome-wrapper { padding:24px; gap:20px; } .circle-container { width:360px; height:360px; } .controls { min-width:320px; } .tempo-slider { width:100%; max-width:300px; } .center-btn { width:140px; height:140px; } .center-icon { width:48px; height:48px; } .main-row { gap:20px; } }
        @media (max-width: 640px) { .metronome-wrapper { padding:20px; } .main-row { flex-direction:column; align-items:center; gap:18px; } .circle-container { width:320px; height:320px; } .controls { min-width:unset; width:100%; order:2; align-items:center; padding-top:6px; } .tempo-block { align-items:center; width: 100%; } .tempo-slider { width:92vw; max-width:320px; } .tempo-row { justify-content:center; width: 100%; } .controls-row { justify-content: center; width: 100%; } .center-btn { width:128px; height:128px; } .center-icon { width:44px; height:44px; } .info-row { flex-direction:column; align-items:center; gap:8px; } }
        @media (max-width: 380px) { .circle-container { width:280px; height:280px; } .tempo-slider { width:86vw; } .center-btn { width:112px; height:112px; } .center-icon { width:40px; height:40px; } .arrow-btn { width:40px; height:40px; font-size:16px; } .tempo-input { width:88px; font-size:16px; } }
      `}</style>

      <div className="main-row">
        <div className="circle-container">
          <svg className="metronome-svg" viewBox={`0 0 ${svgSize} ${svgSize}`} aria-hidden>
            {Array.from({ length: beatsPerMeasure }, (_, i) => {
              const startAngle = -90 + i * anglePerSlice;
              const endAngle = startAngle + anglePerSlice;
              const path = describeSector(cx, cy, outerR, startAngle, endAngle);
              const isActive = i === activeBeatIndex;
              const isStrongSlice = i === 0;
              return (
                <path
                  key={i}
                  d={path}
                  className={`slice ${isActive ? (isStrongSlice ? 'strong' : 'active') : ''}`}
                  strokeWidth={3}
                  stroke={isActive ? (isStrongSlice ? 'var(--accent)' : 'var(--primary)') : 'var(--slice-stroke)'}
                  fill={isActive ? (isStrongSlice ? 'rgba(124,58,237,0.16)' : 'rgba(6,182,212,0.12)') : 'transparent'}
                />
              );
            })}
            <circle className="donut-hole" cx={cx} cy={cy} r={innerR} />
          </svg>

          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
            <button
              onClick={handleClick}
              aria-pressed={isPlaying}
              className={`center-btn pointer-events-auto ${isPlaying ? 'playing' : 'paused'}`}
              title={isPlaying ? 'Pause metronome' : 'Play metronome'}
              style={{ pointerEvents: 'auto' }}
            >
              {!isPlaying ? (
                <svg className="center-icon" viewBox="0 0 24 24" aria-hidden>
                  <path d="M6 4l14 8-14 8V4z" fill="var(--text)" />
                </svg>
              ) : (
                <svg className="center-icon" viewBox="0 0 24 24" aria-hidden>
                  <rect x="6" y="5" width="4" height="14" rx="1" fill="#fff" />
                  <rect x="14" y="5" width="4" height="14" rx="1" fill="#fff" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className="controls">
          <div className="tempo-block">
            <div className="tempo-label">Tempo</div>
            <input aria-label="Tempo slider" className="tempo-slider" type="range" min={20} max={400} step={1} value={tempo} onChange={(e) => setTempo(Number(e.target.value))} />
          </div>

          <div className="tempo-row">
            <div className="tempo-arrows">
              <button className="arrow-btn" aria-label="Decrease tempo" onClick={() => incrementTempo(-1)}>-</button>
              <button className="arrow-btn" aria-label="Increase tempo" onClick={() => incrementTempo(1)}>+</button>
            </div>

            <div className="controls-row">
              <input aria-label="Tempo BPM" className="tempo-input" type="number" min={20} max={400} value={tempo} onChange={(e) => setTempo(Number(e.target.value))} />
              <button className="tap-btn" onClick={tapTempo} aria-label="Tap tempo">Tap</button>
            </div>
          </div>

          <div className="controls-row">
            <div style={{ fontSize: 16, color: 'var(--muted)' }}>Subdivision</div>
            {[0,1,2,3].map((r) => (
              <button key={r} onClick={() => selectResolution(r)} className={`subdivision-btn ${noteResolution === r ? 'bg-[var(--primary)] text-white' : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200'}`}>
                {resolutionLabel(r)}
              </button>
            ))}
          </div>

          <div className="controls-row">
            <div style={{ fontSize: 16, color: 'var(--muted)' }}>Time signature</div>
            <select aria-label="Beats per measure" value={beatsPerMeasure} onChange={(e) => changeBeatsPerMeasure(Number(e.target.value))}>
              {Array.from({ length: 16 }, (_, i) => i + 1).map((n) => (<option key={n} value={n}>{n}</option>))}
            </select>

            <select aria-label="Beat unit" value={beatUnit} onChange={(e) => changeBeatUnit(Number(e.target.value))}>
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={4}>4</option>
              <option value={8}>8</option>
              <option value={16}>16</option>
            </select>
          </div>
        </div>
      </div>

      <div className="info-row">
        <div>Resolution: <strong style={{ fontFamily: 'var(--font-poppins)' }}>{resolutionLabel(noteResolution)}</strong></div>
        <div>Time signature: <strong style={{ fontFamily: 'var(--font-poppins)' }}>{beatsPerMeasure}/{beatUnit}</strong></div>
        <div>Current 16th: <strong style={{ fontFamily: 'var(--font-poppins)' }}>{current16thNoteState}</strong></div>
      </div>

      <article className="prose max-w-4xl mt-6 p-4 bg-white/60 rounded-lg border border-slate-100 space-y-6">
        <h2>About this web metronome</h2>

        <p>
          This web-based metronome provides a low-latency, rhythmic click track implemented with the Web Audio API. It schedules
          precise clicks ahead of time using an internal worker for timing and an AudioContext for sample-accurate playback.
          The metronome supports configurable tempo, subdivisions, and time signatures so you can practice everything from simple
          quarter-note grooves to complex polyrhythms.
        </p>

        <h3 className="mt-6 font-semibold text-lg leading-tight tracking-tight text-slate-900">The Importance of Practicing with a Click</h3>
        <p>
          A metronome is an absolute necessity for any serious musician. It serves as an impartial judge of your timing, helping you
          develop a solid internal clock. When you practice consistently with a click track, you build the muscle memory required to keep your
          performance steady, even during high-pressure live shows. Furthermore, modern recording studios rely heavily on grid-based sessions.
          Being comfortable playing to a click allows engineers to seamlessly edit takes and layer complex instrumentation without
          experiencing muddy timing conflicts.
        </p>

        <h3 className="mt-6 font-semibold text-lg leading-tight tracking-tight text-slate-900">How it works (plain language)</h3>
        <p>
          A small background worker sends regular callback messages, which we call the lookahead. The scheduler uses those ticks to plan
          future note events slightly ahead of the current audio time. This ensures the clicks play with flawless timing even if the
          main thread of your browser becomes temporarily busy rendering the user interface. Notes are generated utilizing short oscillators
          and gain envelopes to create crisp audio clicks, featuring built-in accents for the downbeat and measure starts to keep you oriented.
        </p>
        

        <h3 className="mt-6 font-semibold text-lg leading-tight tracking-tight text-slate-900">Mechanical vs. Digital Metronomes</h3>
        <p>
          Historically, musicians relied on mechanical devices governed by a swinging pendulum and a sliding counterweight to establish tempo.
          While those physical devices possess an undeniable visual charm, they can eventually suffer from mechanical wear that impacts their precision.
          A digital web metronome, on the other hand, relies on exact mathematical timing. It never requires winding and offers advanced capabilities—such
          as distinct beat subdivisions and variable time signatures—that physical clockwork models simply cannot replicate.
        </p>

        <h3 className="mt-6 font-semibold text-lg leading-tight tracking-tight text-slate-900">How to use</h3>
        <ol>
          <li>Press the central Play button to start. Your browser may request audio permission; rest assured the metronome runs entirely locally.</li>
          <li>Adjust the tempo utilizing the slider, arrows, or by typing a specific BPM value directly into the input field.</li>
          <li>Choose your preferred subdivisions (16th, 8th, quarter, or triplet) and adjust the time signature to match the piece you are practicing.</li>
          <li>Use the Tap button to determine a tempo by rhythmically tapping the beat.</li>
        </ol>

        <h3 className="mt-6 font-semibold text-lg leading-tight tracking-tight text-slate-900">Advanced Practice techniques</h3>
        <p>
          Begin slowly and prioritize consistent quarter-note placement. Increase the speed only after you complete five flawless repetitions.
          Practice with varied subdivisions to internalize the smallest rhythmic increments. Another excellent exercise involves alternating between
          playing directly on the click and leaving space—meaning you play in silence while internalizing the beat—which dramatically improves
          your natural sense of groove.
        </p>
      </article>
    </div>
  );
};

export default MetronomeWorklet;