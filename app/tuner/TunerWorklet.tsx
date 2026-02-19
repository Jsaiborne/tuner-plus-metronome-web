"use client";
/* eslint-disable react/no-unescaped-entities */

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useAudioContext } from "../context/AudioContextProvider";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], weight: ["400", "600", "700"], display: "swap" });

/* (Worklet JS unchanged) */
const WORKLET_JS = `
// YIN AudioWorkletProcessor with octave-correction heuristic
// Runs in AudioWorkletGlobalScope (audio thread)

class YinProcessor extends AudioWorkletProcessor {
  constructor(options = {}) {
    super();

    const opts = (options && options.processorOptions) || {};
    this.sampleRate = sampleRate;
    this.FRAME_SIZE = opts.frameSize || 4096;
    this.HOP_SIZE = opts.hopSize || 512;
    this.MIN_FREQ = opts.minFreq || 50;
    this.MAX_FREQ = opts.maxFreq || 2000;
    this.THRESHOLD = opts.threshold || 0.12;
    this.RMS_GATE = opts.rmsGate || 0.0015;

    this.buffer = new Float32Array(this.FRAME_SIZE);
    this.writePos = 0;
    this.filled = 0;
    this.samplesSinceLastAnalysis = 0;

    this.d = new Float32Array(this.FRAME_SIZE + 1);
    this.cmnd = new Float32Array(this.FRAME_SIZE + 1);
    this.tempFrame = new Float32Array(this.FRAME_SIZE);

    this.hann = new Float32Array(this.FRAME_SIZE);
    for (let i = 0; i < this.FRAME_SIZE; i++) {
      this.hann[i] = 0.5 * (1 - Math.cos((2 * Math.PI * i) / (this.FRAME_SIZE - 1)));
    }

    this.port.onmessage = (ev) => {
      const d = ev.data;
      if (d && d.type === "setOptions") {
        if (typeof d.minFreq === "number") this.MIN_FREQ = d.minFreq;
        if (typeof d.maxFreq === "number") this.MAX_FREQ = d.maxFreq;
        if (typeof d.threshold === "number") this.THRESHOLD = d.threshold;
      }
    };
  }

  _rms(frame) {
    let s = 0;
    for (let i = 0; i < frame.length; i++) {
      const v = frame[i];
      s += v * v;
    }
    return Math.sqrt(s / frame.length);
  }

  _parabolicInterpolate(arr, idx) {
    if (idx <= 0 || idx >= arr.length - 1) return idx;
    const x0 = arr[idx - 1], x1 = arr[idx], x2 = arr[idx + 1];
    const denom = x0 + x2 - 2 * x1;
    if (Math.abs(denom) < 1e-12) return idx;
    const shift = 0.5 * (x0 - x2) / denom;
    return idx + shift;
  }

  _yin(frame) {
    const sampleRateLocal = this.sampleRate;
    const N = frame.length;
    const minFreq = this.MIN_FREQ;
    const maxFreq = this.MAX_FREQ;
    const threshold = this.THRESHOLD;

    const maxLag = Math.min(N - 1, Math.floor(sampleRateLocal / minFreq));
    const minLag = Math.max(2, Math.floor(sampleRateLocal / maxFreq));
    const tauMax = maxLag;

    const d = this.d;
    const cmnd = this.cmnd;

    for (let tau = 1; tau <= tauMax; tau++) {
      let s = 0.0;
      const NmTau = N - tau;
      for (let j = 0; j < NmTau; j++) {
        const diff = frame[j] - frame[j + tau];
        s += diff * diff;
      }
      d[tau] = s;
    }
    d[0] = 0;

    let runningSum = 0;
    cmnd[0] = 1;
    for (let tau = 1; tau <= tauMax; tau++) {
      runningSum += d[tau];
      cmnd[tau] = d[tau] * tau / (runningSum || 1e-12);
    }

    let tauEstimate = -1;
    for (let tau = minLag; tau <= tauMax; tau++) {
      if (cmnd[tau] < threshold) {
        while (tau + 1 <= tauMax && cmnd[tau + 1] < cmnd[tau]) tau++;
        tauEstimate = tau;
        break;
      }
    }
    if (tauEstimate === -1) {
      let bestTau = minLag;
      let bestVal = cmnd[minLag];
      for (let tau = minLag + 1; tau <= tauMax; tau++) {
        if (cmnd[tau] < bestVal) {
          bestVal = cmnd[tau];
          bestTau = tau;
        }
      }
      tauEstimate = bestTau;
    }

    let chosenTau = tauEstimate;
    {
      const IMPROVEMENT_FACTOR = 0.80;
      const baseVal = cmnd[Math.round(tauEstimate)] || 1.0;
      for (let m = 2; m <= 6; m++) {
        const idx = Math.round(tauEstimate * m);
        if (idx >= minLag && idx <= tauMax) {
          const val = cmnd[idx];
          if (val < baseVal * IMPROVEMENT_FACTOR && val < 0.8) {
            chosenTau = idx;
            break;
          }
        }
      }
      if (chosenTau === tauEstimate) {
        for (let k = 2; k <= 4; k++) {
          const idx = Math.round(tauEstimate / k);
          if (idx >= minLag && idx <= tauMax) {
            const val = cmnd[idx];
            if (val < cmnd[chosenTau] * IMPROVEMENT_FACTOR && val < 0.8) {
              chosenTau = idx;
              break;
            }
          }
        }
      }
    }

    let refinedTau = chosenTau;
    if (chosenTau > 1 && chosenTau < tauMax) {
      refinedTau = this._parabolicInterpolate(cmnd, chosenTau);
    }

    const freq = sampleRateLocal / refinedTau;
    const prob = Math.max(0, 1 - cmnd[Math.round(chosenTau)]);
    const cmndValue = cmnd[Math.round(chosenTau)];

    return { frequency: freq, probability: prob, cmnd: cmndValue, rawTau: chosenTau };
  }

  process(inputs) {
    const input = inputs[0];
    if (!input || input.length === 0) return true;
    const channelData = input[0];
    const inLen = channelData.length;
    const N = this.FRAME_SIZE;

    for (let i = 0; i < inLen; i++) {
      this.buffer[this.writePos] = channelData[i];
      this.writePos++;
      if (this.writePos >= N) this.writePos = 0;
      if (this.filled < N) this.filled++;
      this.samplesSinceLastAnalysis++;
    }

    if (this.filled >= N && this.samplesSinceLastAnalysis >= this.HOP_SIZE) {
      const start = (this.writePos - N + N) % N;
      if (start + N <= N) this.tempFrame.set(this.buffer.subarray(start, start + N));
      else {
        const firstLen = N - start;
        this.tempFrame.set(this.buffer.subarray(start, start + firstLen), 0);
        this.tempFrame.set(this.buffer.subarray(0, N - firstLen), firstLen);
      }

      for (let i = 0; i < N; i++) this.tempFrame[i] *= this.hann[i];

      const rms = this._rms(this.tempFrame);

      if (rms >= this.RMS_GATE) {
        const res = this._yin(this.tempFrame);
        this.port.postMessage({ type: "pitch", frequency: res.frequency, probability: res.probability, rms: rms, timestamp: currentTime, rawTau: res.rawTau, cmnd: res.cmnd });
      } else {
        this.port.postMessage({ type: "pitch", frequency: null, probability: 0, rms: rms, timestamp: currentTime, rawTau: null, cmnd: null });
      }

      this.samplesSinceLastAnalysis = 0;
    }

    return true;
  }
}

registerProcessor('yin-processor', YinProcessor);
`;

/* helpers that respect reference A */
function midiFromFreq(freq: number, refA = 440) {
  return 69 + 12 * Math.log2(freq / refA);
}

function freqToNoteName(freq: number, refA = 440) {
  if (!isFinite(freq) || freq <= 0) return { midi: null as number | null, name: "-", targetFreq: NaN, cents: NaN };
  const midiFloat = midiFromFreq(freq, refA);
  const midi = Math.round(midiFloat);
  const noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const name = noteNames[(midi + 120) % 12] + (Math.floor(midi / 12) - 1);
  const targetFreq = refA * Math.pow(2, (midi - 69) / 12);
  const cents = 1200 * Math.log2(freq / targetFreq);
  return { midi, name, targetFreq, cents };
}

type AudioHooks = {
  createAudioContextOnGesture: () => AudioContext;
  close: () => Promise<void>;
  resume: () => Promise<void>;
};

// eslint-disable-next-line @typescript-eslint/ban-types
// @ts-ignore: TS2503 - JSX namespace not found in some TS configs
export default function TunerWorklet(): JSX.Element {
  // safely typed context
  const audioHooks = useAudioContext() as unknown as AudioHooks;
  const { createAudioContextOnGesture, close, resume } = audioHooks;

  // visible UI state
  const [running, setRunning] = useState<boolean>(false);
  const [frequency, setFrequency] = useState<number | null>(null);
  const [noteLabel, setNoteLabel] = useState<string>("-");
  const [cents, setCents] = useState<number | null>(null);

  // reference pitch (A4)
  const [refA, setRefA] = useState<number>(440);
  const refARef = useRef<number>(440);
  useEffect(() => { refARef.current = refA; }, [refA]);

  // audio refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const nodeRef = useRef<AudioWorkletNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const blobUrlRef = useRef<string | null>(null);

  // analyser
  const analyserRef = useRef<AnalyserNode | null>(null);
  // allow null so we can set/unset the buffer without type errors
  const freqDataRef = useRef<Float32Array | null>(null);

  // raw/live refs
  const freqRef = useRef<number | null>(null);
  const probRef = useRef<number>(0);
  const rmsRef = useRef<number>(0);
  const noteRef = useRef<string>("-");
  const centsRef = useRef<number | null>(null);

  // smoothed numeric refs
  const smoothedFreqRef = useRef<number | null>(null);
  const smoothedCentsNumRef = useRef<number | null>(null);

  // display throttle
  const lastDisplayUpdateRef = useRef<number>(0);

  // canvas + RAF
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  // smoothing for visual cents
  const smoothedCentsRef = useRef<number>(0);

  // constants
  const MAX_CENTS_DISPLAY = 50;
  const CENTS_SMOOTH_ALPHA = 0.08;
  const TIGHT_CENTS = 3;
  const OK_CENTS = 15;

  const NUMERIC_FREQ_ALPHA = 0.06;
  const NUMERIC_CENTS_ALPHA = 0.06;
  const DISPLAY_UPDATE_MS = 200;
  const PROB_THRESHOLD_DISPLAY = 0.03;

  const refreshDisplayedFromSmoothed = useCallback(() => {
    const sFreq = smoothedFreqRef.current;
    const p = probRef.current;
    if (sFreq != null && p >= PROB_THRESHOLD_DISPLAY) {
      const note = freqToNoteName(sFreq, refARef.current);
      setFrequency(Number(sFreq.toFixed(2)));
      setCents(Number(note.cents.toFixed(2)));
      setNoteLabel(note.name);
      noteRef.current = note.name;
    } else {
      setFrequency(null);
      setCents(null);
      setNoteLabel("-");
      noteRef.current = "-";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    refreshDisplayedFromSmoothed();
  }, [refA, refreshDisplayedFromSmoothed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ro = new ResizeObserver(() => {
      lastTimeRef.current = null;
      if (!rafRef.current) rafRef.current = requestAnimationFrame(render as FrameRequestCallback) as unknown as number;
    });
    const parent = canvas.parentElement || canvas;
    ro.observe(parent);
    ro.observe(document.body);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function hexToRgb(hex: string): [number, number, number] {
    const h = hex.replace('#', '');
    const bigint = parseInt(h, 16);
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
  }

  const render = useCallback((timeMs?: number) => {
    const canvas = canvasRef.current;
    if (!canvas) {
      rafRef.current = requestAnimationFrame(render as FrameRequestCallback) as unknown as number;
      return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      rafRef.current = requestAnimationFrame(render as FrameRequestCallback) as unknown as number;
      return;
    }

    const now = (typeof timeMs === 'number') ? timeMs : performance.now();
    const last = lastTimeRef.current ?? now;
    const dt = Math.max(0.001, (now - last) / 1000);
    lastTimeRef.current = now;

    const DPR = Math.max(1, (window.devicePixelRatio as number) || 1);

    // FIX: Get the width from the parent container, fallback to fixed max
    const parent = canvas.parentElement;
    const cssW = parent ? parent.clientWidth : Math.min(window.innerWidth * 0.86, 520);
    const cssH = cssW * 0.6;

    const w = cssW;
    const h = cssH;
    const width = Math.round(cssW * DPR);
    const height = Math.round(cssH * DPR);

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      canvas.style.width = `${cssW}px`;
      canvas.style.height = `${cssH}px`;
    }
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

    const cx = w / 2;
    const cy = h / 2;
    const outerR = Math.min(w, h) * 0.38;

    const rawCents = centsRef.current ?? 0;
    const displayFreq = smoothedFreqRef.current ?? null;

    smoothedCentsRef.current = smoothedCentsRef.current * (1 - CENTS_SMOOTH_ALPHA) + rawCents * CENTS_SMOOTH_ALPHA;
    const sCents = smoothedCentsRef.current;
    const absCents = Math.abs(sCents);

    const proximity = Math.max(0, 1 - Math.min(absCents, MAX_CENTS_DISPLAY) / OK_CENTS);

    const green = '#16a34a';
    const amber = '#d68b2e';
    const red = '#c43f3f';
    let ringColor = red;
    if (absCents <= TIGHT_CENTS) ringColor = green;
    else if (absCents <= OK_CENTS) ringColor = amber;

    ctx.clearRect(0, 0, w, h);
    const gBg = ctx.createLinearGradient(0, 0, w, h);
    gBg.addColorStop(0, '#fbfbff');
    gBg.addColorStop(1, '#f7f8fb');
    ctx.fillStyle = gBg;
    ctx.fillRect(0, 0, w, h);

    ctx.save();
    ctx.beginPath();
    const cardW = Math.min(w * 0.96, 520);
    const cardH = h * 0.96;
    ctx.fillStyle = 'rgba(255,255,255,0.96)';
    ctx.fillRect((w - cardW) / 2, (h - cardH) / 2, cardW, cardH);
    ctx.restore();

    const scaleW = Math.min(w * 0.75, outerR * 2.4);
    const scaleH = Math.max(8, outerR * 0.12);
    const trackX1 = cx - scaleW / 2;
    const trackX2 = cx + scaleW / 2;
    const trackY = cy + outerR * 0.14;
    const halfScale = scaleW / 2;

    ctx.beginPath();
    ctx.lineWidth = scaleH;
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'rgba(15,23,42,0.06)';
    ctx.moveTo(trackX1, trackY);
    ctx.lineTo(trackX2, trackY);
    ctx.stroke();

    const okHalfPx = Math.min(OK_CENTS, MAX_CENTS_DISPLAY) / MAX_CENTS_DISPLAY * halfScale;
    const tightHalfPx = Math.min(TIGHT_CENTS, MAX_CENTS_DISPLAY) / MAX_CENTS_DISPLAY * halfScale;

    ctx.fillStyle = 'rgba(214,139,46,0.06)';
    ctx.fillRect(cx - okHalfPx, trackY - scaleH / 2, okHalfPx * 2, scaleH);
    ctx.fillStyle = 'rgba(22,163,74,0.08)';
    ctx.fillRect(cx - tightHalfPx, trackY - scaleH / 2, tightHalfPx * 2, scaleH);

    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(15,23,42,0.12)';
    ctx.fillStyle = '#334155';
    ctx.font = `${Math.max(10, Math.round(scaleH * 0.9))}px Inter, system-ui, -apple-system, sans-serif`;
    const ticks: number[] = [-50, -25, 0, 25, 50];
    for (const v of ticks) {
      const x = cx + (v / MAX_CENTS_DISPLAY) * halfScale;
      ctx.beginPath();
      ctx.moveTo(x, trackY - scaleH / 2 - 6);
      ctx.lineTo(x, trackY - scaleH / 2);
      ctx.stroke();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(`${v}¢`, x, trackY + scaleH * 0.5 + 2);
    }

    const pointerX = cx + Math.max(-halfScale, Math.min(halfScale, (sCents / MAX_CENTS_DISPLAY) * halfScale));
    const pH = Math.max(12, outerR * 0.14);
    const pW = Math.max(12, pH * 0.9);
    const pointerApexY = trackY + scaleH / 2 + 6;

    const pointerColor = absCents <= TIGHT_CENTS ? '#16a34a' : (absCents <= OK_CENTS ? '#d68b2e' : '#c43f3f');

    ctx.beginPath();
    ctx.moveTo(pointerX, pointerApexY);
    ctx.lineTo(pointerX - pW / 2, pointerApexY + pH);
    ctx.lineTo(pointerX + pW / 2, pointerApexY + pH);
    ctx.closePath();
    ctx.fillStyle = pointerColor;
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.08)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cx, trackY - scaleH / 2 - 4);
    ctx.lineTo(cx, trackY + scaleH / 2 + 4);
    ctx.strokeStyle = 'rgba(15,23,42,0.12)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.font = `${Math.max(10, Math.round(scaleH * 0.75))}px Inter, system-ui, -apple-system, sans-serif`;
    ctx.fillStyle = '#64748b';
    ctx.textAlign = 'left';
    ctx.fillText('Tune up ↑', trackX2 + 8, trackY - scaleH * 0.6 - 6);
    ctx.textAlign = 'right';
    ctx.fillText('↓ Tune down', trackX1 - 8, trackY - scaleH * 0.6 - 6);

    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const noteFontSize = Math.max(36, Math.round(outerR * 0.5));
    ctx.font = `${noteFontSize}px Inter, system-ui, -apple-system, sans-serif`;
    ctx.fillStyle = '#0f172a';
    const noteY = trackY - scaleH / 2 - Math.max(8, noteFontSize * 0.6);
    ctx.fillText(noteRef.current ?? '-', cx, noteY);

    ctx.font = `14px monospace`;
    ctx.fillStyle = '#334155';
    ctx.fillText(displayFreq ? `${displayFreq.toFixed(2)} Hz` : '—', cx, trackY + outerR * 0.6);

    const centsText = cents !== null ? (cents > 0 ? `+${cents.toFixed(2)}¢` : `${cents.toFixed(2)}¢`) : '—';
    const centsColor = absCents <= TIGHT_CENTS ? green : (absCents <= OK_CENTS ? amber : red);
    ctx.fillStyle = centsColor;
    ctx.fillText(centsText, cx, trackY + outerR * 0.78);
    ctx.restore();

    rafRef.current = requestAnimationFrame(render as FrameRequestCallback) as unknown as number;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const start = useCallback(async (): Promise<void> => {
    if (running) return;
    const audioCtx = createAudioContextOnGesture();
    audioCtxRef.current = audioCtx;
    if (audioCtx.state === "suspended") await audioCtx.resume();

    const blob = new Blob([WORKLET_JS], { type: "application/javascript" });
    const blobUrl = URL.createObjectURL(blob);
    blobUrlRef.current = blobUrl;

    try {
      await audioCtx.audioWorklet.addModule(blobUrl);
    } catch (err) {
      console.error("Failed to add AudioWorklet module:", err);
      URL.revokeObjectURL(blobUrl);
      blobUrlRef.current = null;
      return;
    }

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;
    const source = audioCtx.createMediaStreamSource(stream);
    sourceRef.current = source;

    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 8192;
    analyser.smoothingTimeConstant = 0;
    source.connect(analyser);
    analyserRef.current = analyser;
    freqDataRef.current = new Float32Array(analyser.frequencyBinCount);

    const node = new AudioWorkletNode(audioCtx, "yin-processor", {
      processorOptions: {
        frameSize: 4096,
        hopSize: 512,
        minFreq: 50,
        maxFreq: 2000,
        threshold: 0.12,
        rmsGate: 0.0015
      },
      numberOfInputs: 1,
      numberOfOutputs: 0,
      channelCount: 1
    });

    node.port.onmessage = (ev: MessageEvent) => {
      const msg = ev.data as any;
      if (!msg || msg.type !== "pitch") return;

      const reportedFreq = msg.frequency as number | null;
      const reportedProb = msg.probability as number | null;
      const reportedRms = msg.rms as number | null;

      const analyserLocal = analyserRef.current;
      const freqData = freqDataRef.current;
      const audioCtxLocal = audioCtxRef.current;

      if (reportedFreq != null && analyserLocal && freqData && audioCtxLocal) {
        // @ts-ignore: allow Float32Array/SharedArrayBuffer variance
        analyserLocal.getFloatFrequencyData(freqData as unknown as Float32Array);
        const sampleRate = audioCtxLocal.sampleRate;
        const fftSize = analyserLocal.fftSize;

        const readDbAt = (freqVal: number) => {
          if (!isFinite(freqVal) || freqVal <= 0) return -200;
          const bin = Math.round(freqVal / (sampleRate / fftSize));
          const half = 1;
          let sum = 0;
          let count = 0;
          for (let b = bin - half; b <= bin + half; b++) {
            if (b >= 0 && b < freqData.length) {
              const v = freqData[b];
              if (isFinite(v)) { sum += v; count++; }
            }
          }
          return count ? (sum / count) : -200;
        };

        const candidates: { freq: number; db: number }[] = [];
        candidates.push({ freq: reportedFreq, db: readDbAt(reportedFreq) });
        for (let k = 2; k <= 4; k++) {
          const fSub = reportedFreq / k;
          if (fSub >= 30) candidates.push({ freq: fSub, db: readDbAt(fSub) });
        }

        candidates.sort((a, b) => b.db - a.db);
        const best = candidates[0];
        const original = candidates.find(c => c.freq === reportedFreq) || candidates[candidates.length - 1];

        const DB_IMPROVEMENT = 6.0;
        let finalFreq = reportedFreq;
        if ((best.db - original.db) >= DB_IMPROVEMENT && best.db > -120) {
          const origNote = freqToNoteName(reportedFreq, refARef.current);
          const bestNote = freqToNoteName(best.freq, refARef.current);
          const origAbsCents = Math.abs(origNote.cents);
          const bestAbsCents = Math.abs(bestNote.cents);
          if ((origAbsCents - bestAbsCents) >= 4) {
            finalFreq = best.freq;
          } else {
            if ((best.db - original.db) >= 10 && (origAbsCents - bestAbsCents) >= 1) {
              finalFreq = best.freq;
            }
          }
        }

        freqRef.current = finalFreq;
        probRef.current = (reportedProb ?? 0);
        rmsRef.current = (reportedRms ?? 0);
        centsRef.current = Number(freqToNoteName(finalFreq, refARef.current).cents);

        if (finalFreq != null && (reportedProb ?? 0) >= PROB_THRESHOLD_DISPLAY) {
          if (smoothedFreqRef.current == null) smoothedFreqRef.current = finalFreq;
          else smoothedFreqRef.current = smoothedFreqRef.current * (1 - NUMERIC_FREQ_ALPHA) + finalFreq * NUMERIC_FREQ_ALPHA;

          const noteCents = Number(freqToNoteName(finalFreq, refARef.current).cents);
          if (smoothedCentsNumRef.current == null) smoothedCentsNumRef.current = noteCents;
          else smoothedCentsNumRef.current = smoothedCentsNumRef.current * (1 - NUMERIC_CENTS_ALPHA) + noteCents * NUMERIC_CENTS_ALPHA;
        } else {
          smoothedFreqRef.current = null;
          smoothedCentsNumRef.current = null;
        }

        const nowMs = performance.now();
        if (nowMs - lastDisplayUpdateRef.current >= DISPLAY_UPDATE_MS) {
          lastDisplayUpdateRef.current = nowMs;
          if ((reportedProb ?? 0) >= PROB_THRESHOLD_DISPLAY && smoothedFreqRef.current != null) {
            const note = freqToNoteName(smoothedFreqRef.current, refARef.current);
            freqRef.current = smoothedFreqRef.current;
            noteRef.current = note.name;
            setFrequency(Number(smoothedFreqRef.current.toFixed(2)));
            setCents(Number((smoothedCentsNumRef.current ?? 0).toFixed(2)));
            setNoteLabel(note.name);
          } else {
            setFrequency(null);
            setCents(null);
            setNoteLabel("-");
            noteRef.current = "-";
          }
        }

      } else {
        if (reportedFreq != null && (reportedProb ?? 0) > 0.01) {
          freqRef.current = reportedFreq;
          probRef.current = (reportedProb ?? 0);
          rmsRef.current = (reportedRms ?? 0);

          if (smoothedFreqRef.current == null) smoothedFreqRef.current = reportedFreq;
          else smoothedFreqRef.current = smoothedFreqRef.current * (1 - NUMERIC_FREQ_ALPHA) + reportedFreq * NUMERIC_FREQ_ALPHA;

          const noteCents = Number(freqToNoteName(reportedFreq, refARef.current).cents);
          if (smoothedCentsNumRef.current == null) smoothedCentsNumRef.current = noteCents;
          else smoothedCentsNumRef.current = smoothedCentsNumRef.current * (1 - NUMERIC_CENTS_ALPHA) + noteCents * NUMERIC_CENTS_ALPHA;

          const nowMs = performance.now();
          if (nowMs - lastDisplayUpdateRef.current >= DISPLAY_UPDATE_MS) {
            lastDisplayUpdateRef.current = nowMs;
            if ((reportedProb ?? 0) >= PROB_THRESHOLD_DISPLAY && smoothedFreqRef.current != null) {
              const note = freqToNoteName(smoothedFreqRef.current, refARef.current);
              noteRef.current = note.name;
              setFrequency(Number(smoothedFreqRef.current.toFixed(2)));
              setCents(Number((smoothedCentsNumRef.current ?? 0).toFixed(2)));
              setNoteLabel(note.name);
            } else {
              setFrequency(null);
              setCents(null);
              setNoteLabel("-");
              noteRef.current = "-";
            }
          }
        } else {
          freqRef.current = null;
          probRef.current = 0;
          rmsRef.current = (reportedRms ?? 0);
          noteRef.current = "-";
          centsRef.current = null;
          smoothedFreqRef.current = null;
          smoothedCentsNumRef.current = null;

          const nowMs = performance.now();
          if (nowMs - lastDisplayUpdateRef.current >= DISPLAY_UPDATE_MS) {
            lastDisplayUpdateRef.current = nowMs;
            setFrequency(null);
            setCents(null);
            setNoteLabel("-");
          }
        }
      }
    };

    source.connect(node);
    nodeRef.current = node;
    setRunning(true);

    if (!rafRef.current) rafRef.current = requestAnimationFrame(render as FrameRequestCallback) as unknown as number;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createAudioContextOnGesture, running]);

  const stop = useCallback(async (): Promise<void> => {
    setRunning(false);
    if (sourceRef.current && nodeRef.current) { try { sourceRef.current.disconnect(nodeRef.current); } catch {} }
    if (nodeRef.current) { try { nodeRef.current.port.postMessage({ type: "shutdown" }); } catch {} try { nodeRef.current.disconnect(); } catch {} nodeRef.current = null; }
    if (analyserRef.current && sourceRef.current) { try { sourceRef.current.disconnect(analyserRef.current); } catch {} analyserRef.current = null; freqDataRef.current = null; }
    if (sourceRef.current) { try { sourceRef.current.disconnect(); } catch {} sourceRef.current = null; }
    if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null; }
    if (audioCtxRef.current) { try { await close(); } catch {} audioCtxRef.current = null; }
    if (blobUrlRef.current) { try { URL.revokeObjectURL(blobUrlRef.current); } catch {} blobUrlRef.current = null; }
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
  }, [close]);

  useEffect(() => { 
    return () => { 
      stop().catch(() => {}); 
      if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; } 
    }; 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChangeRefA = (val: number) => {
    if (!isFinite(val) || val <= 0) return;
    setRefA(val);
    refARef.current = val;
    refreshDisplayedFromSmoothed();
  };

  const ld = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Tuner + Metronome — Online Tuner",
    "url": (typeof window !== 'undefined') ? window.location.href : "https://example.com/tuner",
    "description": "A lightweight web-based tuner using AudioWorklet and a YIN-inspired pitch detector to help musicians tune instruments accurately in the browser.",
    "applicationCategory": "Music",
    "operatingSystem": "Web",
  } as const;

  return (
    // FIX: Changed to p-4 sm:p-6 for better mobile margins
    <div className={`${inter.className} min-h-screen flex flex-col items-center justify-start bg-gradient-to-b from-slate-50 to-white p-4 sm:p-6`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />

      <div className="w-full max-w-6xl bg-white/60 rounded-2xl shadow-lg p-4 sm:p-6 backdrop-blur-sm border border-slate-100">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="flex-shrink-0 w-full md:w-auto flex justify-center">
            <div className="rounded-xl shadow-2xl bg-white border border-slate-100 p-4 w-full max-w-[560px]">
              <canvas
                ref={canvasRef}
                className="block rounded-lg w-full"
                aria-label="tuner canvas"
              />
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-4 w-full px-2 sm:px-0">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div>
                <div className="text-2xl font-semibold text-slate-900">{noteLabel}</div>
                <div className="text-sm text-slate-600 mt-1">{frequency ? `${frequency.toFixed(2)} Hz` : "—"}</div>
              </div>

              <div className="flex items-center gap-3">
                {!running ? (
                  <button onClick={start} aria-label="Start tuner" className="px-4 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-400 text-white font-semibold shadow hover:scale-[1.02] transition-transform">Start</button>
                ) : (
                  <button onClick={stop} aria-label="Stop tuner" className="px-4 py-3 rounded-lg bg-gradient-to-r from-rose-500 to-rose-400 text-white font-semibold shadow hover:scale-[1.02] transition-transform">Stop</button>
                )}
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <label className="text-sm text-slate-600 md:mr-2">Reference A (Hz):</label>
              <div className="flex gap-3 w-full md:w-auto flex-wrap">
                <select className="px-2 py-1 rounded-md border min-w-[140px]" value={String(refA)} onChange={(e) => onChangeRefA(Number(e.target.value))}>
                  <option value="415.3">415.30 (Baroque)</option>
                  <option value="432">432</option>
                  <option value="440">440</option>
                  <option value="444">444</option>
                  <option value="478.5">478.5 (example)</option>
                </select>

                <div className="flex items-center gap-2">
                  <input type="number" step="0.1" min={300} max={600} value={refA} onChange={(e) => onChangeRefA(Number(e.target.value))} className="w-[110px] px-2 py-1 rounded-md border" />
                  <div className="text-xs text-slate-500 hidden sm:block">Custom reference A.</div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className={`min-w-[120px] px-4 py-3 rounded-xl font-semibold text-lg text-center ${Math.abs(cents ?? 999) <= TIGHT_CENTS ? "bg-emerald-50 text-emerald-700" : (Math.abs(cents ?? 999) <= OK_CENTS ? "bg-amber-50 text-amber-700" : "bg-rose-50 text-rose-700")}`}>
                {cents !== null ? (cents > 0 ? `+${cents.toFixed(2)}¢` : `${cents.toFixed(2)}¢`) : "—"}
              </div>
            </div>

            {/* FIX: Properly closed the cut-off div and added substantial SEO/approval text content */}
            <div className="mt-6 p-4 sm:p-6 rounded-lg bg-white/80 border border-slate-100 shadow-sm text-slate-700 space-y-4 text-sm sm:text-base leading-relaxed max-w-[60ch] w-full mx-auto">
              <h2 className="text-xl font-bold text-slate-900 mb-2">How to Use This Online Chromatic Tuner</h2>
              
              <p>
                Whether you play the guitar, bass, violin, ukulele, or any other stringed or wind instrument, keeping your instrument perfectly in tune is the foundation of great music. This online chromatic tuner uses your device's built-in microphone to detect the pitch of the note you are playing in real-time. Simply click "Start", grant microphone permissions if prompted, and play a single, clear note.
              </p>

              <p>
                The digital display will immediately show the closest musical note, alongside a cent meter indicating how sharp or flat you are. When the indicator hits the green center and reads 0¢, your instrument is in tune! We utilize a highly accurate <strong>YIN pitch detection algorithm</strong> running directly in your browser's AudioWorklet, ensuring zero latency and precise readings down to the fraction of a Hertz.
              </p>

              <h3 className="text-lg font-semibold text-slate-900 mt-4">Understanding Reference Frequencies (A4)</h3>
              <p>
                By default, this tuner is set to the international standard pitch of <strong>A4 = 440 Hz</strong>. This means the A above middle C vibrates exactly 440 times per second. While this is the modern standard for most orchestras and bands, you may want to experiment with alternative tunings. 
              </p>
              
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li><strong>A = 432 Hz:</strong> Often favored for its warmer, slightly darker tone. Many musicians believe it resonates more naturally with the human ear and environmental frequencies.</li>
                <li><strong>A = 415.3 Hz (Baroque Pitch):</strong> Essential for playing historical instruments or performing Baroque music authentically, roughly a half-step lower than modern standard pitch.</li>
                <li><strong>A = 444 Hz:</strong> Sometimes used by orchestras seeking a brighter, more piercing tone that carries well in large concert halls.</li>
              </ul>

              <p>
                You can easily switch between these standards using the dropdown menu above or by typing in your own custom reference frequency. Remember to always tune in a quiet environment, muting other strings to ensure the microphone picks up only the fundamental frequency of the note you intend to tune.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
