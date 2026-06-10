"use client";

import { useEffect, useState } from "react";

export default function TrackPinkglowView({ serial }: { serial: string }) {
  const [sent, setSent] = useState(false);
  const [showButton, setShowButton] = useState(false);

  async function sendTracking(payload: {
    serial: string;
    latitude?: number | null;
    longitude?: number | null;
    gps_allowed: boolean;
  }) {
    await fetch("/api/pinkglow/track-view", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    setSent(true);
  }

  useEffect(() => {
    if (!serial || sent) return;

    sendTracking({
      serial,
      latitude: null,
      longitude: null,
      gps_allowed: false,
    });

    setShowButton(true);
  }, [serial]);

  function requestLocation() {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        await sendTracking({
          serial,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          gps_allowed: true,
        });

        setShowButton(false);
      },
      async () => {
        await sendTracking({
          serial,
          latitude: null,
          longitude: null,
          gps_allowed: false,
        });

        setShowButton(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }

  if (!showButton) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 rounded-2xl border border-pink-300/30 bg-black/90 p-4 text-center text-white shadow-2xl backdrop-blur md:left-auto md:right-6 md:w-96">
      <p className="text-sm text-zinc-300">
        Help verify this bottle scan location.
      </p>

      <button
        onClick={requestLocation}
        className="mt-3 w-full rounded-xl bg-pink-500 px-4 py-3 font-semibold text-black hover:bg-pink-400"
      >
        Share scan location
      </button>
    </div>
  );
}