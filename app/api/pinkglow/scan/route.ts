import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { serial } = body;

    const forwardedFor = req.headers.get("x-forwarded-for");
    const ip = forwardedFor?.split(",")[0] || "unknown";
    const userAgent = req.headers.get("user-agent") || "unknown";

    const { error } = await supabase.from("pinkglow_scan_events").insert({
      serial,
      ip,
      user_agent: userAgent,
      gps_allowed: false,
    });

    if (error) {
      console.error("Scan insert error:", error);
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Scan tracking error:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}