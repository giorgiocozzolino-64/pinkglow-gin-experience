"use client";

import { useEffect } from "react";

export default function TrackPinkglowView({ serial }: { serial: string }) {
  useEffect(() => {
    if (!serial) return;

    const sendTracking = async (payload: {
      serial: string;
      latitude?: number | null;
      longitude?: number | null;
      gps_allowed: boolean;
    }) => {
      try {
        await fetch("/api/pinkglow/track-view", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
      } catch (err) {
        console.error("Pinkglow tracking error:", err);
      }
    };

    if (!navigator.geolocation) {
      sendTracking({
        serial,
        latitude: null,
        longitude: null,
        gps_allowed: false,
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        sendTracking({
          serial,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          gps_allowed: true,
        });
      },
      () => {
        sendTracking({
          serial,
          latitude: null,
          longitude: null,
          gps_allowed: false,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 0,
      }
    );
  }, [serial]);

  return null;
}