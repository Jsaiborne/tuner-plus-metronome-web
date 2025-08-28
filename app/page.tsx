'use client'

import Image from "next/image";
import { useState } from "react";
import SetBPM from "./components/SetBpm";
// import Play from "./components/Play";
import MetronomeWorklet from "./context/MetronomeWorklet";
import { AudioContextProvider } from "./context/AudioContextProvider";
import TunerWorklet from "./tuner/TunerWorklet";

export default function Home() {
  const [bpm, setBpm] = useState<number>(100);

  const increaseBpm = (): void => {
    setBpm((prev) => prev + 1);
  };

  const decreaseBpm = (): void => {
    setBpm((prev) => prev - 1);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setBpm(Number(e.target.value))
  }

   /* <MetronomeProvider>
       </MetronomeProvider> */

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-white">
      <AudioContextProvider>
        <MetronomeWorklet />
     
    </AudioContextProvider>
    </div>
  );
}
