"use client";

import { useState } from "react";

export default function ClaimForm({ serial }: { serial: string }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setMessage("");
    setCouponCode("");
    setSuccess(false);

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
        marketingConsent: form.get("marketingConsent") === "on",
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      setMessage(result.error || "Claim failed");
      setLoading(false);
      return;
    }

    setCouponCode(result.coupon_code || "");
    setSuccess(true);
    setMessage("Bottle successfully claimed.");
    setLoading(false);
  }

  if (success) {
    return (
      <div className="mt-8 rounded-3xl border border-emerald-300/20 bg-emerald-950/20 p-8 backdrop-blur">
        <h3 className="text-2xl font-semibold text-emerald-200">
          Welcome to Pinkglow Gin
        </h3>

        <p className="mt-4 text-zinc-300">
          Your bottle has been successfully registered.
        </p>

        <div className="mt-6 rounded-2xl border border-pink-500/20 bg-pink-500/10 p-6">
          <p className="text-sm uppercase tracking-widest text-pink-300">
            Exclusive Owner Coupon
          </p>

          <p className="mt-3 text-4xl font-bold text-pink-300">
            £10 OFF
          </p>

          <p className="mt-3 text-zinc-300">
            Coupon Code:
          </p>

          <p className="mt-1 text-2xl font-mono text-white">
            {couponCode}
          </p>

          <p className="mt-4 text-sm text-zinc-400">
            Valid on the purchase of one Pinkglow Gin 70cl Limited Edition
            Single Cask bottle.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mt-8 rounded-3xl border border-pink-500/20 bg-pink-500/10 p-8">
        <p className="text-sm uppercase tracking-[0.25em] text-pink-300">
          Exclusive Owner Benefit
        </p>

        <h3 className="mt-3 text-3xl font-bold text-white">
          Unlock Your Pinkglow Reward
        </h3>

        <p className="mt-4 text-lg text-zinc-300">
          This bottle includes a{" "}
          <span className="font-semibold text-pink-300">
            £10 Owner Credit
          </span>
          .
        </p>

        <p className="mt-4 leading-relaxed text-zinc-400">
          Register your bottle to unlock your credit and join the official
          Pinkglow Gin Ownership Registry.
        </p>

        <p className="mt-4 leading-relaxed text-zinc-400">
          Redeem your credit against a Pinkglow Gin 70cl Limited Edition
          Single Cask and receive access to future releases reserved for
          registered owners.
        </p>

        <p className="mt-6 text-sm uppercase tracking-wider text-pink-300">
          Exclusively available to owners of the Fife Chamber 2026 Edition.
        </p>
      </div>

      <div className="mt-8 rounded-3xl border border-pink-300/20 bg-white/5 p-8 backdrop-blur">
        <h3 className="text-2xl font-semibold">
          Claim This Bottle
        </h3>

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

          <label className="flex items-start gap-3 rounded-xl border border-zinc-700 bg-black/20 p-4">
            <input
              type="checkbox"
              name="marketingConsent"
              defaultChecked
              className="mt-1 h-4 w-4"
            />

            <span className="text-sm text-zinc-300">
              Keep me informed about future Pinkglow Gin releases,
              limited editions, collector opportunities and exclusive offers.
            </span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-pink-500 px-6 py-3 font-medium text-black transition hover:bg-pink-400 disabled:opacity-50"
          >
            {loading ? "Claiming..." : "Claim Bottle"}
          </button>

          {message && (
            <p className="text-sm text-pink-200">
              {message}
            </p>
          )}
        </form>
      </div>
    </>
  );
}