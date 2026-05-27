"use client";

import { useState } from "react";

export default function ClaimForm({ serial }: { serial: string }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const form = new FormData(event.currentTarget);

    const response = await fetch("/api/claim", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        serial,
        name: form.get("name"),
        email: form.get("email"),
        company: form.get("company"),
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      setMessage(result.error || "Claim failed");
      setLoading(false);
      return;
    }

    setMessage("Bottle successfully claimed.");
    setLoading(false);
    window.location.reload();
  }

  return (
    <div className="mt-8 rounded-3xl border border-pink-300/20 bg-white/5 p-8 backdrop-blur">
      <h3 className="text-2xl font-semibold">Claim This Bottle</h3>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
        <input
          name="name"
          placeholder="Full Name"
          required
          className="rounded-xl border border-zinc-700 bg-black/40 px-4 py-3 text-white outline-none"
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          className="rounded-xl border border-zinc-700 bg-black/40 px-4 py-3 text-white outline-none"
        />

        <input
          name="company"
          placeholder="Company / Venue"
          className="rounded-xl border border-zinc-700 bg-black/40 px-4 py-3 text-white outline-none"
        />

        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-pink-500 px-6 py-3 font-medium text-black transition hover:bg-pink-400 disabled:opacity-50"
        >
          {loading ? "Claiming..." : "Claim Bottle"}
        </button>

        {message && <p className="text-sm text-pink-200">{message}</p>}
      </form>
    </div>
  );
}