"use client";

import Image from "next/image"
import { useContext, useState } from "react";
import { useMetronome } from "../context/MetronomeContext";
import { audioContext } from "../context/audioContext";
import { timerWorker } from "../context/MetronomeContext";

export default function Play() {

    const ctx = useMetronome();
    const {isPlaying, setIsPlaying, current16thNote, setCurrent16thNote, nextNoteTime, setNextNoteTime} = ctx;
    
    // if (!unlocked) {
    //     // play silent buffer to unlock the audio
    //     let buffer = audioContext.createBuffer(1, 1, 22050);
    //     let node = audioContext.createBufferSource();
    //     node.buffer = buffer;
    //     node.start(0);
    //     setUnlocked(true);
    //   }
  
       const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {

        setIsPlaying(!isPlaying);
  
      if (isPlaying) { // start playing
          setCurrent16thNote(0);
          setNextNoteTime(audioContext.currentTime);
          timerWorker.postMessage("start");
          
      } else {
          timerWorker.postMessage("stop");
                }

       }
     
      

    return(
        <>
        <button
        className="mt-6 p-2 md:p-3 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition" onClick={handleClick}
      >
        <Image
          src="/icons/play_button.svg"
          alt="Play"
          width={56}
          height={56}
          className="w-10 h-10 md:w-14 md:h-14"
          
        />
      </button >
      </>
    )
}