"use client";

import { useEffect, useState } from "react";

export default function PinkglowIntro() {
  const [visible, setVisible] = useState(true);
  const [step, setStep] = useState(1);

  useEffect(() => {
    const step2 = setTimeout(() => setStep(2), 1800);
    const step3 = setTimeout(() => setStep(3), 3000);
    const hide = setTimeout(() => setVisible(false), 4500);

    return () => {
      clearTimeout(step2);
      clearTimeout(step3);
      clearTimeout(hide);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black text-center">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.18),transparent_55%)]" />

      <div className="relative z-10 px-6">
        <p className="mb-4 text-sm tracking-[0.55em] text-pink-400">
          E.L.Y.A.S.
        </p>

        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full border border-pink-300/30 bg-white/5 shadow-[0_0_50px_rgba(236,72,153,0.35)]">
          <span className="text-4xl">✦</span>
        </div>

        <h1 className="text-5xl font-bold text-white md:text-6xl">
          Pinkglow Gin
        </h1>

        <p className="mt-4 text-sm uppercase tracking-[0.35em] text-zinc-500">
          Digital Product Passport
        </p>

        <div className="mt-10">
          {step === 1 && (
            <p className="animate-pulse text-zinc-300">
              Authenticating Digital Passport...
            </p>
          )}

          {step === 2 && (
            <p className="text-emerald-300">
              ✓ Certificate Verified
            </p>
          )}

          {step === 3 && (
            <p className="animate-pulse text-pink-300">
              Opening Pinkglow Experience...
            </p>
          )}
        </div>

        <div className="mx-auto mt-8 h-1 w-72 overflow-hidden rounded-full bg-zinc-800">
          <div
            className={`h-full rounded-full bg-pink-400 transition-all duration-700 ${
              step === 1 ? "w-1/3" : step === 2 ? "w-2/3" : "w-full"
            }`}
          />
        </div>

        <p className="mt-10 text-xs uppercase tracking-[0.3em] text-zinc-600">
          Verified by E.L.Y.A.S. Certification Authority
        </p>
      </div>
    </div>
  );
}