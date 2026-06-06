"use client";

import { useEffect } from "react";

export default function TrackPinkglowView({ serial }: { serial: string }) {
  useEffect(() => {
    if (!serial) return;

    fetch("/api/pinkglow/track-view", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ serial }),
    }).catch((err) => {
      console.error("Pinkglow tracking error:", err);
    });
  }, [serial]);

  return null;
}