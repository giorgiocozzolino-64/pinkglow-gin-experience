"use client";

export default function PrintCertificateButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-xl bg-black px-6 py-3 font-semibold text-white transition hover:bg-zinc-800"
    >
      Print / Save as PDF
    </button>
  );
}