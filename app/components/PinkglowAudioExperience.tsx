"use client";

import { usePathname } from "next/navigation";
import { useRef, useState } from "react";

export default function PinkglowAudioExperience() {
  const pathname = usePathname();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [entered, setEntered] = useState(false);
  const [playing, setPlaying] = useState(false);

  const isPinkglowRoute =
    pathname.startsWith("/p/") ||
    pathname.startsWith("/event/fife-business-awards-2026");

  if (!isPinkglowRoute) return null;

  async function enterExperience() {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.25;

    try {
      await audio.play();
      setPlaying(true);
    } catch (error) {
      console.error("Pinkglow audio error:", error);
    }

    setEntered(true);
  }

  function toggleAudio() {
    const audio = audioRef.current;
    if (!audio) return;

    if (!audio.paused) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play();
      setPlaying(true);
    }
  }

  return (
    <>
      <audio ref={audioRef} loop preload="auto">
        <source src="/audio/pinkglow-scottish-pipes.mp3" type="audio/mpeg" />
      </audio>

      {!entered && pathname.startsWith("/p/") && (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black px-6 text-center text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.18),transparent_55%)]" />

          <div className="relative z-10">
            <p className="text-sm uppercase tracking-[0.5em] text-pink-400">
              E.L.Y.A.S-A.I.
            </p>

            <div className="mx-auto mt-6 flex h-24 w-24 items-center justify-center rounded-full border border-pink-300/30 bg-white/5 shadow-[0_0_50px_rgba(236,72,153,0.35)]">
              <span className="text-4xl">✦</span>
            </div>

            <h1 className="mt-8 text-5xl font-bold md:text-6xl">
              Pinkglow Gin
            </h1>

            <p className="mt-4 text-sm uppercase tracking-[0.35em] text-zinc-500">
              Digital Product Passport
            </p>

            <p className="mx-auto mt-8 max-w-xl text-zinc-400">
              Authenticating Digital Passport. Enter the certified Pinkglow
              experience with Scottish Highland soundscape.
            </p>

            <button
              type="button"
              onClick={enterExperience}
              className="mt-10 rounded-full bg-pink-500 px-8 py-4 font-semibold text-black shadow-2xl transition hover:bg-pink-400"
            >
              ▶ Enter Pinkglow Experience
            </button>

            <p className="mt-10 text-xs uppercase tracking-[0.3em] text-zinc-600">
              Verified by E.L.Y.A.S-A.I. Certification Authority
            </p>
          </div>
        </div>
      )}

      {entered && (
        <div className="fixed bottom-4 right-4 z-50">
          <button
            type="button"
            onClick={toggleAudio}
            className="rounded-full border border-pink-300/30 bg-black/85 px-5 py-3 text-sm font-semibold text-pink-300 shadow-2xl backdrop-blur transition hover:bg-pink-500 hover:text-black"
          >
            {playing ? "⏸ Pause Soundscape" : "▶ Start Soundscape"}
          </button>
        </div>
      )}
    </>
  );
}