import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";

async function reverseGeocode(latitude: number, longitude: number) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
      {
        headers: {
          "User-Agent": "ELYAS-AI Pinkglow Digital Passport",
        },
      }
    );

    if (!res.ok) return null;

    const data = await res.json();
    const address = data.address || {};

    return {
      country: address.country || null,
      region: address.state || address.region || address.county || null,
      city:
        address.city ||
        address.town ||
        address.village ||
        address.hamlet ||
        null,
    };
  } catch (error) {
    console.error("Reverse geocoding failed:", error);
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { serial, latitude, longitude, gps_allowed } = body;

    if (!serial) {
      return NextResponse.json({ error: "Missing serial" }, { status: 400 });
    }

    const forwardedFor = req.headers.get("x-forwarded-for");
    const ip = forwardedFor?.split(",")[0] || "unknown";

    const userAgent = req.headers.get("user-agent");
    const referrer = req.headers.get("referer");

    let geo = null;

    if (gps_allowed && latitude && longitude) {
      geo = await reverseGeocode(latitude, longitude);
    }

    const { error } = await supabase.from("pinkglow_page_views").insert({
      serial,
      event_type: "page_view",
      user_agent: userAgent,
      referrer,
      ip,
      latitude: latitude || null,
      longitude: longitude || null,
      gps_allowed: gps_allowed || false,
      country: geo?.country || null,
      region: geo?.region || null,
      city: geo?.city || null,
    });

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Tracking failed:", err);
    return NextResponse.json({ error: "Tracking failed" }, { status: 500 });
  }
}