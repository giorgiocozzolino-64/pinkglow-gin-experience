"use client";

import { useRef, useState } from "react";

export default function PinkglowAudioExperience() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  async function toggleAudio() {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.25;

    if (!audio.paused) {
      audio.pause();
      setPlaying(false);
      return;
    }

    try {
      await audio.play();
      setPlaying(true);
    } catch (error) {
      console.error("Pinkglow audio error:", error);
      setPlaying(false);
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <audio ref={audioRef} loop preload="metadata">
        <source src="/audio/pinkglow-scottish-pipes.mp3" type="audio/mpeg" />
      </audio>

      <button
        type="button"
        onClick={toggleAudio}
        className="rounded-full border border-pink-300/30 bg-black/85 px-5 py-3 text-sm font-semibold text-pink-300 shadow-2xl backdrop-blur transition hover:bg-pink-500 hover:text-black"
      >
        {playing ? "⏸ Pause Soundscape" : "▶ Enter Pinkglow Experience"}
      </button>
    </div>
  );
}