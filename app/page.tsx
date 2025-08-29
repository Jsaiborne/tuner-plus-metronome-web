"use client";

import { AudioContextProvider } from "./context/AudioContextProvider";
import TunerWorklet from "./tuner/TunerWorklet";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-white">
      <AudioContextProvider>
        <TunerWorklet />
      </AudioContextProvider>
    </div>
  );
}
