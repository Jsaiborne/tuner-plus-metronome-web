"use client";

import React, { createContext, useContext, useEffect, useRef, useCallback } from "react";

type AudioValue = {
  /** current AudioContext (may be null until created) */
  audioCtx: AudioContext | null;
  /** return the existing AudioContext or null if not created */
  getAudioContext: () => AudioContext | null;
  /** create (if needed) and return an AudioContext — MUST be called from a user gesture */
  createAudioContextOnGesture: () => AudioContext;
  /** resume the context if suspended (does not create one) */
  resume: () => Promise<void>;
  /** close and clear */
  close: () => Promise<void>;
};

const AudioCtx = createContext<AudioValue | undefined>(undefined);

export function AudioContextProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<AudioContext | null>(null);

  // helper to safely get the AudioContext constructor in browsers
  const getCtor = useCallback(() => {
    if (typeof window === "undefined") return undefined;
    return (window.AudioContext || (window as any).webkitAudioContext) as
      | typeof AudioContext
      | undefined;
  }, []);

  // cleanup on unmount (if we created one at some point)
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.close().catch(() => {});
        audioRef.current = null;
      }
    };
  }, []);

  const getAudioContext = useCallback(() => {
    return audioRef.current;
  }, []);

  const createAudioContextOnGesture = useCallback(() => {
    if (audioRef.current) return audioRef.current;
    const C = getCtor();
    if (!C) throw new Error("AudioContext constructor not available in this environment");
    audioRef.current = new C();
    return audioRef.current;
  }, [getCtor]);

  const resume = useCallback(async () => {
    const c = audioRef.current;
    if (!c) return;
    if (c.state === "suspended") await c.resume();
  }, []);

  const close = useCallback(async () => {
    if (!audioRef.current) return;
    try {
      await audioRef.current.close();
    } catch (e) {
      // ignore
    }
    audioRef.current = null;
  }, []);

  const value: AudioValue = {
    audioCtx: audioRef.current,
    getAudioContext,
    createAudioContextOnGesture,
    resume,
    close,
  };

  return <AudioCtx.Provider value={value}>{children}</AudioCtx.Provider>;
}

/**
 * Hook to use the audio context.
 * Throws if used outside of the provider to make mistakes obvious.
 */
export function useAudioContext() {
  const v = useContext(AudioCtx);
  if (!v) throw new Error("useAudioContext must be used inside an AudioContextProvider");
  return v;
}
