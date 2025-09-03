"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useAudioContext } from "../context/AudioContextProvider";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], weight: ["400", "600", "700"], display: "swap" });

type WorkletMsg = {
  type: "pitch";
  frequency: number | null;
  probability: number;
  rms: number;
  timestamp: number;
  rawTau?: number;
  cmnd?: number;
};

/* AudioWorklet JS (YIN) - unchanged */
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

export default function TunerWorklet() {
  const { createAudioContextOnGesture, close, resume } = useAudioContext();

  // visible UI state
  const [running, setRunning] = useState(false);
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
  // use the plain Float32Array type (no generic) to avoid platform-generic mismatch
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

  // wheel physics
  const smoothedCentsRef = useRef<number>(0);
  const wheelAngleRef = useRef<number>(0);
  const wheelVelRef = useRef<number>(0);
  const wheelTargetRef = useRef<number>(0);

  // constants
  const MAX_CENTS_DISPLAY = 50;
  const MAX_NEEDLE_ANGLE = 60;
  const CENTS_SMOOTH_ALPHA = 0.08;
  const TIGHT_CENTS = 3;
  const OK_CENTS = 15;

  const NUMERIC_FREQ_ALPHA = 0.06;
  const NUMERIC_CENTS_ALPHA = 0.06;
  const DISPLAY_UPDATE_MS = 200;
  const PROB_THRESHOLD_DISPLAY = 0.03;

  const noteAngles = useRef<number[]>(Array.from({ length: 12 }, (_, i) => (i / 12) * 360));

  // helper to refresh displayed note/cents when refA or smoothed freq changes
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
  }, []);

  useEffect(() => {
    // whenever user changes reference A, recalc displayed values immediately
    refreshDisplayedFromSmoothed();
  }, [refA, refreshDisplayedFromSmoothed]);

  // ensure canvas redraws on size changes using ResizeObserver
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ro = new ResizeObserver(() => {
      // force the render loop to recompute DPR/size on next frame
      lastTimeRef.current = null;
      if (!rafRef.current) rafRef.current = requestAnimationFrame(render);
    });
    // observe the canvas wrapper (parent) so layout-driven size changes are caught
    const parent = canvas.parentElement || canvas;
    ro.observe(parent);
    // also observe document body to catch orientation changes in some browsers
    ro.observe(document.body);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // render loop
  const render = useCallback((timeMs?: number) => {
    const canvas = canvasRef.current;
    if (!canvas) {
      rafRef.current = requestAnimationFrame(render);
      return;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      rafRef.current = requestAnimationFrame(render);
      return;
    }

    const now = timeMs ?? performance.now();
    const last = lastTimeRef.current ?? now;
    const dt = Math.max(0.001, (now - last) / 1000);
    lastTimeRef.current = now;

    // DPR-aware sizing (keeps canvas crisp on high-DPI)
    const DPR = Math.max(1, window.devicePixelRatio || 1);
    // responsive sizing: canvas fills available width up to max
    const cssW = Math.min(window.innerWidth * 0.86, 520);
    const cssH = cssW; // keep square
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
    const outerR = Math.min(w, h) * 0.46;
    const strobeOuter = outerR + 10;
    const dialR = outerR * 0.82;

    const rawCents = centsRef.current ?? 0;
    const displayFreq = smoothedFreqRef.current;
    const displayCents = smoothedCentsNumRef.current ?? 0;

    smoothedCentsRef.current = smoothedCentsRef.current * (1 - CENTS_SMOOTH_ALPHA) + rawCents * CENTS_SMOOTH_ALPHA;
    const sCents = smoothedCentsRef.current;

    // wheel target - use smoothed freq if present, else raw
    {
      const srcFreq = smoothedFreqRef.current ?? freqRef.current;
      if (srcFreq != null) {
        const midiF = midiFromFreq(srcFreq, refARef.current);
        const frac = ((midiF % 12) + 12) % 12;
        const noteAngle = (frac / 12) * 360;
        const desired = (-noteAngle + 360) % 360;
        const current = wheelAngleRef.current % 360;
        let diff = ((desired - current + 540) % 360) - 180;

        const HIGH_CONF = 0.7;
        const MED_CONF = 0.45;

        if (probRef.current >= HIGH_CONF) {
          if (Math.abs(diff) < 8) {
            wheelAngleRef.current = current + diff;
            wheelVelRef.current = 0;
            wheelTargetRef.current = wheelAngleRef.current;
          } else {
            const snapFactor = 0.9;
            wheelTargetRef.current = current + diff * snapFactor;
            wheelVelRef.current += diff * 6.0;
          }
        } else if (probRef.current >= MED_CONF) {
          wheelTargetRef.current = current + diff * 0.85;
        } else {
          wheelTargetRef.current = current + diff * 0.45;
        }
      }
    }

    // wheel physics
    const WHEEL_SPRING = 14.0;
    const WHEEL_DAMP = 8.5;
    const wheelAcc = WHEEL_SPRING * (wheelTargetRef.current - wheelAngleRef.current) - WHEEL_DAMP * wheelVelRef.current;
    wheelVelRef.current += wheelAcc * dt;
    const MAX_WHEEL_V = 720;
    if (wheelVelRef.current > MAX_WHEEL_V) wheelVelRef.current = MAX_WHEEL_V;
    if (wheelVelRef.current < -MAX_WHEEL_V) wheelVelRef.current = -MAX_WHEEL_V;
    wheelAngleRef.current += wheelVelRef.current * dt;

    // strobe visuals
    const strobeSpeed = -sCents * 2.2;
    const strobePhase = (now / 1000) * 12 + strobeSpeed * (now / 2000);

    // drawing
    ctx.clearRect(0, 0, w, h);
    const gBg = ctx.createLinearGradient(0, 0, w, h);
    gBg.addColorStop(0, "#fbfbff");
    gBg.addColorStop(1, "#f7f8fb");
    ctx.fillStyle = gBg;
    ctx.fillRect(0, 0, w, h);

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, outerR + 20, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(6,6,6,0.02)";
    ctx.fill();
    ctx.restore();

    drawStrobeRing(ctx, cx, cy, strobeOuter, strobePhase, sCents);
    drawNoteWheelRotated(ctx, cx, cy, outerR, wheelAngleRef.current, smoothedFreqRef.current, sCents);

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, dialR * 0.98, 0, Math.PI * 2);
    const cardGrad = ctx.createLinearGradient(cx - dialR, cy - dialR, cx + dialR, cy + dialR);
    cardGrad.addColorStop(0, "rgba(255,255,255,0.98)");
    cardGrad.addColorStop(1, "rgba(250,250,252,0.94)");
    ctx.fillStyle = cardGrad;
    ctx.fill();
    ctx.restore();

    drawTicks(ctx, cx, cy, dialR, sCents);

    // needle
    ctx.save();
    ctx.translate(cx, cy);
    ctx.beginPath();
    ctx.arc(0, 0, dialR * 0.08, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0,0,0,0.12)";
    ctx.fill();
    const needleAngleDeg = Math.max(-MAX_NEEDLE_ANGLE, Math.min(MAX_NEEDLE_ANGLE, (sCents / MAX_CENTS_DISPLAY) * MAX_NEEDLE_ANGLE));
    ctx.rotate((needleAngleDeg * Math.PI) / 180);
    const absCents = Math.abs(sCents);
    const needleColor = absCents <= TIGHT_CENTS ? "#1e9b55" : (absCents <= OK_CENTS ? "#d68b2e" : "#c43f3f");
    const grad = ctx.createLinearGradient(0, -dialR * 0.02, 0, -dialR * 0.72);
    grad.addColorStop(0, "#fff");
    grad.addColorStop(0.2, needleColor);
    grad.addColorStop(1, "#6b0000");
    ctx.beginPath();
    ctx.moveTo(-7, dialR * 0.06);
    ctx.lineTo(0, -dialR * 0.72);
    ctx.lineTo(7, dialR * 0.06);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(0, 0, dialR * 0.06, 0, Math.PI * 2);
    ctx.fillStyle = "#111";
    ctx.fill();
    ctx.restore();

    // center text (use smoothed/throttled values)
    ctx.save();
    ctx.textAlign = "center";
    ctx.fillStyle = "#111";
    ctx.font = "22px Inter, system-ui, -apple-system, sans-serif";
    ctx.fillText(noteRef.current ?? "-", cx, cy + dialR * 0.40);
    ctx.font = "14px monospace";
    ctx.fillStyle = "#333";
    ctx.fillText(displayFreq ? `${displayFreq.toFixed(2)} Hz` : "—", cx, cy + dialR * 0.56);
    ctx.fillStyle = absCents <= TIGHT_CENTS ? "#1e9b55" : (absCents <= OK_CENTS ? "#d68b2e" : "#c43f3f");
    ctx.fillText(displayCents !== null ? (displayCents > 0 ? `+${displayCents!.toFixed(2)}¢` : `${displayCents!.toFixed(2)}¢`) : "—", cx, cy + dialR * 0.70);
    ctx.restore();

    rafRef.current = requestAnimationFrame(render);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // drawing helpers (unchanged)
  function drawStrobeRing(ctx: CanvasRenderingContext2D, cx: number, cy: number, outerR: number, phase: number, sCents: number) {
    const innerR = outerR - 36;
    const stripes = 64;
    const absC = Math.min(1, Math.abs(sCents) / MAX_CENTS_DISPLAY);
    const baseAlpha = 0.16 + (1 - absC) * 0.18;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate((phase * Math.PI) / 180);
    for (let i = 0; i < stripes; i++) {
      const t = i / stripes;
      const a1 = t * Math.PI * 2;
      const a2 = a1 + (Math.PI * 2) / stripes * 0.9;
      const bright = (Math.cos(t * Math.PI * 4 - (sCents / MAX_CENTS_DISPLAY) * Math.PI) * 0.5 + 0.5) * (1 - absC);
      const c = Math.floor(200 + 20 * bright);
      ctx.beginPath();
      ctx.moveTo(Math.cos(a1) * innerR, Math.sin(a1) * innerR);
      ctx.arc(0, 0, innerR, a1, a2, false);
      ctx.lineTo(Math.cos(a2) * outerR, Math.sin(a2) * outerR);
      ctx.arc(0, 0, outerR, a2, a1, true);
      ctx.closePath();
      ctx.fillStyle = `rgba(${c},${c},${c},${baseAlpha})`;
      ctx.fill();
    }
    ctx.beginPath();
    ctx.arc(0, 0, outerR + 2, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(0,0,0,0.05)";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();
  }

  function drawNoteTrackSolid(ctx: CanvasRenderingContext2D, cx: number, cy: number, outerRadius: number, trackWidth: number, fillColor: string) {
    const innerR = Math.max(0, outerRadius - trackWidth);
    ctx.save();
    ctx.translate(cx, cy);
    ctx.beginPath();
    ctx.arc(0, 0, outerRadius, 0, Math.PI * 2, false);
    ctx.arc(0, 0, innerR, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fillStyle = fillColor;
    ctx.fill();
    ctx.restore();
  }

  function drawNoteWheelRotated(ctx: CanvasRenderingContext2D, cx: number, cy: number, outerRadius: number, wheelRotationDeg: number, currFreq: number | null, sCents: number) {
    ctx.save();
    ctx.translate(cx, cy);

    const TRACK_WIDTH = Math.max(36, Math.round(outerRadius * 0.11));
    const TRACK_COLOR = "#fbfdff";
    drawNoteTrackSolid(ctx, 0, 0, outerRadius, TRACK_WIDTH, TRACK_COLOR);

    const labels = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    const fontSize = Math.max(12, Math.round(outerRadius * 0.075));
    ctx.font = `${fontSize}px Inter, system-ui, -apple-system, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    let activeIndex: number | null = null;
    if (currFreq !== null) {
      const midiRounded = Math.round(midiFromFreq(currFreq, refARef.current));
      activeIndex = ((midiRounded % 12) + 12) % 12;
    }

    const labelRadius = outerRadius - TRACK_WIDTH * 0.5;
    for (let i = 0; i < 12; i++) {
      const baseAngleDeg = noteAngles.current[i];
      const absAngleDeg = (baseAngleDeg + wheelRotationDeg) % 360;
      const angRad = ((absAngleDeg - 90) * Math.PI) / 180;
      const x = Math.cos(angRad) * labelRadius;
      const y = Math.sin(angRad) * labelRadius;

      const isActive = activeIndex === i;
      const alpha = isActive ? 1 : 0.92;
      const textColor = isActive ? "#0f172a" : "#0b1220";

      ctx.beginPath();
      ctx.arc(x, y, isActive ? 18 : 16, 0, Math.PI * 2);
      ctx.fillStyle = isActive ? "rgba(79,70,229,0.10)" : "rgba(2,6,23,0.03)";
      ctx.fill();

      ctx.save();
      ctx.translate(x, y);
      const norm = ((absAngleDeg % 360) + 360) % 360;
      if (norm > 90 && norm < 270) ctx.rotate(Math.PI);
      ctx.fillStyle = textColor;
      ctx.globalAlpha = alpha;
      ctx.fillText(labels[i], 0, 0);
      ctx.globalAlpha = 1;
      ctx.restore();
    }
    ctx.restore();
  }

  function drawTicks(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number, sCents: number) {
    ctx.save();
    ctx.translate(cx, cy);
    const majors = [-50, -25, 0, 25, 50];
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#444";
    ctx.fillStyle = "#222";
    ctx.font = "12px Inter, system-ui, -apple-system, sans-serif";
    for (let v of majors) {
      const ang = ((v / MAX_CENTS_DISPLAY) * MAX_NEEDLE_ANGLE) * (Math.PI / 180);
      const x1 = Math.sin(ang) * (radius * 0.86);
      const y1 = -Math.cos(ang) * (radius * 0.86);
      const x2 = Math.sin(ang) * (radius * 0.70);
      const y2 = -Math.cos(ang) * (radius * 0.70);
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.textAlign = v === 0 ? "center" : (v < 0 ? "right" : "left");
      const labelX = Math.sin(ang) * (radius * 0.60);
      const labelY = -Math.cos(ang) * (radius * 0.60) + 6;
      ctx.fillText(`${v}`, labelX, labelY);
    }

    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgba(20,20,20,0.10)";
    const micro = 20;
    for (let i = 0; i <= micro; i++) {
      const v = (i / micro) * 2 * MAX_CENTS_DISPLAY - MAX_CENTS_DISPLAY;
      const ang = ((v / MAX_CENTS_DISPLAY) * MAX_NEEDLE_ANGLE) * (Math.PI / 180);
      const x1 = Math.sin(ang) * (radius * 0.86);
      const y1 = -Math.cos(ang) * (radius * 0.86);
      const x2 = Math.sin(ang) * (radius * 0.80);
      const y2 = -Math.cos(ang) * (radius * 0.80);
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
    ctx.restore();
  }

  // AudioWorklet + verifier + smoothing + throttled UI updates
  const start = useCallback(async () => {
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
    // create a plain typed Float32Array (no generics)
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

    // Use explicit typed message event and robust null checks
    node.port.onmessage = (ev: MessageEvent) => {
      const msg = ev.data as WorkletMsg;
      if (!msg || msg.type !== "pitch") return;

      const reportedFreq = msg.frequency;
      const reportedProb = msg.probability;
      const reportedRms = msg.rms;

      const analyserLocal = analyserRef.current;
      const freqData = freqDataRef.current;
      const audioCtxLocal = audioCtxRef.current;

      // Only proceed if we have the analyser, typed array and audioCtx
      if (reportedFreq != null && analyserLocal && freqData && audioCtxLocal) {
        // pass the plain Float32Array directly — no weird generic casts
        // @ts-ignore: library DOM typing mismatch (ArrayBufferLike vs ArrayBuffer)
        analyserLocal.getFloatFrequencyData(freqData);
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

        // update raw refs
        freqRef.current = finalFreq;
        probRef.current = reportedProb;
        rmsRef.current = reportedRms;
        centsRef.current = Number(freqToNoteName(finalFreq, refARef.current).cents);

        // smoothing
        if (finalFreq != null && reportedProb >= PROB_THRESHOLD_DISPLAY) {
          if (smoothedFreqRef.current == null) smoothedFreqRef.current = finalFreq;
          else smoothedFreqRef.current = smoothedFreqRef.current * (1 - NUMERIC_FREQ_ALPHA) + finalFreq * NUMERIC_FREQ_ALPHA;

          const noteCents = Number(freqToNoteName(finalFreq, refARef.current).cents);
          if (smoothedCentsNumRef.current == null) smoothedCentsNumRef.current = noteCents;
          else smoothedCentsNumRef.current = smoothedCentsNumRef.current * (1 - NUMERIC_CENTS_ALPHA) + noteCents * NUMERIC_CENTS_ALPHA;
        } else {
          smoothedFreqRef.current = null;
          smoothedCentsNumRef.current = null;
        }

        // throttled UI updates
        const nowMs = performance.now();
        if (nowMs - lastDisplayUpdateRef.current >= DISPLAY_UPDATE_MS) {
          lastDisplayUpdateRef.current = nowMs;
          if (reportedProb >= PROB_THRESHOLD_DISPLAY && smoothedFreqRef.current != null) {
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
        // fallback (less precise path when analyser not ready)
        if (reportedFreq != null && reportedProb > 0.01) {
          freqRef.current = reportedFreq;
          probRef.current = reportedProb;
          rmsRef.current = reportedRms;

          if (smoothedFreqRef.current == null) smoothedFreqRef.current = reportedFreq;
          else smoothedFreqRef.current = smoothedFreqRef.current * (1 - NUMERIC_FREQ_ALPHA) + reportedFreq * NUMERIC_FREQ_ALPHA;

          const noteCents = Number(freqToNoteName(reportedFreq, refARef.current).cents);
          if (smoothedCentsNumRef.current == null) smoothedCentsNumRef.current = noteCents;
          else smoothedCentsNumRef.current = smoothedCentsNumRef.current * (1 - NUMERIC_CENTS_ALPHA) + noteCents * NUMERIC_CENTS_ALPHA;

          const nowMs = performance.now();
          if (nowMs - lastDisplayUpdateRef.current >= DISPLAY_UPDATE_MS) {
            lastDisplayUpdateRef.current = nowMs;
            if (reportedProb >= PROB_THRESHOLD_DISPLAY && smoothedFreqRef.current != null) {
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
          rmsRef.current = reportedRms;
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

    if (!rafRef.current) rafRef.current = requestAnimationFrame(render);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createAudioContextOnGesture, running]);

  const stop = useCallback(async () => {
    setRunning(false);
    if (sourceRef.current && nodeRef.current) { try { sourceRef.current.disconnect(nodeRef.current); } catch {} }
    if (nodeRef.current) { try { nodeRef.current.port.postMessage({ type: "shutdown" }); } catch {} try { nodeRef.current.disconnect(); } catch {} nodeRef.current = null; }
    if (analyserRef.current && sourceRef.current) { try { sourceRef.current.disconnect(analyserRef.current); } catch {} analyserRef.current = null; freqDataRef.current = null; }
    if (sourceRef.current) { try { sourceRef.current.disconnect(); } catch {} sourceRef.current = null; }
    if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null; }
    if (audioCtxRef.current) { try { await close(); } catch {} audioCtxRef.current = null; }
    if (blobUrlRef.current) { try { URL.revokeObjectURL(blobUrlRef.current); } catch {} blobUrlRef.current = null; }
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [close]);

  useEffect(() => { return () => { stop().catch(() => {}); if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; } }; // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // UI: change reference A handler
  const onChangeRefA = (val: number) => {
    if (!isFinite(val) || val <= 0) return;
    setRefA(val);
    refARef.current = val;
    // refresh display immediately
    refreshDisplayedFromSmoothed();
  };

  return (
    <div className={`${inter.className} min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white p-6`}>
      <div className="max-w-6xl w-full bg-white/60 rounded-2xl shadow-lg p-6 backdrop-blur-sm border border-slate-100">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="flex-shrink-0 w-full md:w-auto flex justify-center">
            <div className="rounded-xl shadow-2xl bg-white border border-slate-100 p-4">
              {/* responsive canvas: fills up to 86% of viewport width on small screens, caps at 520px */}
              <canvas
                ref={canvasRef}
                className="block rounded-lg"
                aria-label="tuner canvas"
              />
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-4">
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

                <button onClick={() => resume().catch(() => {})} aria-label="Resume audio context" className="px-4 py-3 rounded-lg bg-emerald-500 text-white font-semibold shadow hover:brightness-105 transition">Resume</button>
              </div>
            </div>

            {/* Reference A controls: responsive layout */}
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
                  <input type="number" step="0.1" min="300" max="600" value={refA} onChange={(e) => onChangeRefA(Number(e.target.value))} className="w-[110px] px-2 py-1 rounded-md border" />
                  <div className="text-xs text-slate-500 hidden sm:block">You can enter a custom reference A.</div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className={`min-w-[120px] px-4 py-3 rounded-xl font-semibold text-lg ${Math.abs(cents ?? 999) <= TIGHT_CENTS ? "bg-emerald-50 text-emerald-700" : (Math.abs(cents ?? 999) <= OK_CENTS ? "bg-amber-50 text-amber-700" : "bg-rose-50 text-rose-700")}`}>{cents !== null ? (cents > 0 ? `+${cents.toFixed(2)}¢` : `${cents.toFixed(2)}¢`) : "—"}</div>
            </div>

            <div className="p-4 rounded-lg bg-white/60 border border-slate-100">
              <div className="text-sm text-slate-700 hidden">Tip: play a single sustained note. The wheel rotates so the detected note sits under the fixed needle at the top — use the strobe + needle to lock pitch.</div>
            </div>

            <div className="text-xs text-slate-500 hidden">Built with WebAudio YIN in an AudioWorklet — conservative octave correction + main-thread verifier.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
