'use client'

import Image from "next/image";
import { useState } from "react";

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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-white">
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
          {bpm} BPM
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
        value={bpm}
        onChange={handleChange}
        className="mt-4 w-1/2 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
      />

      {/* Play Button */}
      <button
        className="mt-6 p-2 md:p-3 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
      >
        <Image
          src="/icons/play_button.svg"
          alt="Play"
          width={56}
          height={56}
          className="w-10 h-10 md:w-14 md:h-14"
        />
      </button>
    </div>
  );
}
