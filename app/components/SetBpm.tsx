'use client'

import Image from "next/image";
import { useState } from "react";
import { useMetronome } from "../context/MetronomeContext";

export default function SetBPM() {
  const { tempo, setTempo } = useMetronome();

  const increaseBpm = (): void => {
    setTempo((prev) => prev + 1);
  };

  const decreaseBpm = (): void => {
    setTempo((prev) => prev - 1);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setTempo(Number(e.target.value))
  }

  return (
    <div>
      <div className="flex flex-row items-center space-x-6">
        {/* Decrease BPM */}
        <button
          onClick={decreaseBpm}
          className="p-2 md:p-3 bg-gray-100 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        >
          <Image
            src="/icons/left_arrow.svg"
            alt="Previous BPM"
            width={48}
            height={48}
            className="w-8 h-8 md:w-12 md:h-12"
          />
        </button>

        {/* BPM Display */}
        <p className="text-2xl md:text-4xl font-semibold text-gray-800">
          {tempo} BPM
        </p>

        {/* Increase BPM */}
        <button
          onClick={increaseBpm}
          className="p-2 md:p-3 bg-gray-100 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        >
          <Image
            src="/icons/right_arrow.svg"
            alt="Next BPM"
            width={48}
            height={48}
            className="w-8 h-8 md:w-12 md:h-12"
          />
        </button>


      </div>

     
         {/* Slider */}

         <input
        type="range"
        min="0"
        max="300"
        value={tempo}
        onChange={handleChange}
        className="mt-4 w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
      />
         </div>
  );
}
