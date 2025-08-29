'use client'

import { AudioContextProvider } from "../context/AudioContextProvider";
import MetronomeWorklet from "./MetronomeWorklet";

export default function Home() {
 

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-white">
      <AudioContextProvider>
        <MetronomeWorklet />
     
    </AudioContextProvider>
    </div>
  );
}
