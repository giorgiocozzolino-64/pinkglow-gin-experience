import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { serial } = body;

    if (!serial) {
      return NextResponse.json(
        { error: "Missing serial" },
        { status: 400 }
      );
    }

    const userAgent = req.headers.get("user-agent");
    const referrer = req.headers.get("referer");

    const { error } = await supabase
      .from("pinkglow_page_views")
      .insert({
        serial,
        event_type: "page_view",
        user_agent: userAgent,
        referrer,
      });

    if (error) {
      console.error(error);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "Tracking failed" },
      { status: 500 }
    );
  }
}