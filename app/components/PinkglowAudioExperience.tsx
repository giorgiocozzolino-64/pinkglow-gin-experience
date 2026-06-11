"use client";

import { useEffect, useRef, useState } from "react";

export default function PinkglowAudioExperience() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.25;

    audio
      .play()
      .then(() => {
        setPlaying(true);
        setBlocked(false);
      })
      .catch(() => {
        setPlaying(false);
        setBlocked(true);
      });
  }, []);

  function toggleAudio() {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.25;

    if (!audio.paused) {
      audio.pause();
      setPlaying(false);
      return;
    }

    audio.play().then(() => {
      setPlaying(true);
      setBlocked(false);
    });
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <audio ref={audioRef} loop preload="auto">
        <source src="/audio/pinkglow-scottish-pipes.mp3" type="audio/mpeg" />
      </audio>

      <button
        type="button"
        onClick={toggleAudio}
        className="rounded-full border border-pink-300/30 bg-black/85 px-5 py-3 text-sm font-semibold text-pink-300 shadow-2xl backdrop-blur transition hover:bg-pink-500 hover:text-black"
      >
        {playing
          ? "⏸ Pause Soundscape"
          : blocked
          ? "▶ Start Soundscape"
          : "▶ Enter Pinkglow Experience"}
      </button>
    </div>
  );
}