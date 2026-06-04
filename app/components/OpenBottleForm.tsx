"use client";

import { useState } from "react";

export default function OpenBottleForm({ serial }: { serial: string }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleOpenBottle() {
    setLoading(true);
    setMessage("");

    const response = await fetch("/api/open", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        serial,
        notes: "Bottle opened by registered owner",
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      setMessage(result.error || "Bottle opening failed");
      setLoading(false);
      return;
    }

    setMessage("Bottle opening recorded successfully.");
    setLoading(false);
  }

  return (
    <section className="mt-8 rounded-3xl border border-orange-400/20 bg-orange-950/20 p-8">
      <p className="text-sm uppercase tracking-[0.25em] text-orange-300">
        Bottle Opening
      </p>

      <h3 className="mt-3 text-3xl font-bold text-white">
        Record Bottle Opening
      </h3>

      <p className="mt-4 text-zinc-300">
        Record when this bottle is opened, tasted or consumed.
      </p>

      <button
        type="button"
        onClick={handleOpenBottle}
        disabled={loading}
        className="mt-6 rounded-xl bg-orange-500 px-6 py-3 font-medium text-black transition hover:bg-orange-400 disabled:opacity-50"
      >
        {loading ? "Recording..." : "Open Bottle"}
      </button>

      {message && <p className="mt-4 text-sm text-orange-200">{message}</p>}
    </section>
  );
}