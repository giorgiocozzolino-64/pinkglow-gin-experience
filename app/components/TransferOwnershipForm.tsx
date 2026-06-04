"use client";

import { useState } from "react";

export default function TransferOwnershipForm({
  serial,
}: {
  serial: string;
}) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    const form = new FormData(event.currentTarget);

    const response = await fetch("/api/transfer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        serial,
        newOwnerName: form.get("newOwnerName"),
        newOwnerEmail: form.get("newOwnerEmail"),
        transferMessage: form.get("transferMessage"),
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      setMessage(result.error || "Transfer failed");
      setLoading(false);
      return;
    }

    setMessage("Ownership transferred successfully.");
    setLoading(false);
  }

  return (
    <section className="mt-8 rounded-3xl border border-blue-400/20 bg-blue-950/20 p-8">
      <p className="text-sm uppercase tracking-[0.25em] text-blue-300">
        Ownership Transfer
      </p>

      <h3 className="mt-3 text-3xl font-bold text-white">
        Transfer This Bottle
      </h3>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
        <input
          name="newOwnerName"
          placeholder="New Owner Name"
          required
          className="rounded-xl border border-zinc-700 bg-black/40 px-4 py-3 text-white"
        />

        <input
          name="newOwnerEmail"
          type="email"
          placeholder="New Owner Email"
          required
          className="rounded-xl border border-zinc-700 bg-black/40 px-4 py-3 text-white"
        />

        <textarea
          name="transferMessage"
          placeholder="Optional transfer message"
          className="rounded-xl border border-zinc-700 bg-black/40 px-4 py-3 text-white"
        />

        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-blue-500 px-6 py-3 font-medium text-white"
        >
          {loading ? "Transferring..." : "Transfer Ownership"}
        </button>

        {message && (
          <p className="text-sm text-blue-200">
            {message}
          </p>
        )}
      </form>
    </section>
  );
}