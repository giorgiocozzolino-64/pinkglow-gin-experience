import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { serial, notes } = body;

    if (!serial) {
      return NextResponse.json(
        { error: "Missing serial" },
        { status: 400 }
      );
    }

    const { data: bottle, error: bottleError } = await supabase
      .from("pinkglow_bottles")
      .select("*")
      .eq("serial", serial)
      .single();

    if (bottleError || !bottle) {
      return NextResponse.json(
        { error: "Bottle not found" },
        { status: 404 }
      );
    }

    if (bottle.status === "opened") {
      return NextResponse.json(
        { error: "Bottle already opened" },
        { status: 409 }
      );
    }

    const { data: existingEvent } = await supabase
      .from("pinkglow_bottle_events")
      .select("*")
      .eq("bottle_serial", serial)
      .eq("event_type", "opened")
      .limit(1)
      .maybeSingle();

    if (existingEvent) {
      return NextResponse.json(
        { error: "Bottle already opened" },
        { status: 409 }
      );
    }

    const { data: owner } = await supabase
      .from("pinkglow_claims")
      .select("*")
      .eq("serial", serial)
      .order("claimed_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const ownerName =
      owner?.owner_name ||
      bottle.owner_name ||
      "Registered Owner";

    const ownerEmail =
      owner?.owner_email ||
      bottle.owner_email ||
      "";

    const { error: eventError } = await supabase
      .from("pinkglow_bottle_events")
      .insert({
        bottle_serial: serial,
        event_type: "opened",
        notes:
          notes ||
          `Bottle opened by ${ownerName}`,
        owner_name: ownerName,
        owner_email: ownerEmail,
      });

    if (eventError) {
      return NextResponse.json(
        { error: eventError.message },
        { status: 500 }
      );
    }

    const { error: updateError } = await supabase
      .from("pinkglow_bottles")
      .update({
        status: "opened",
      })
      .eq("serial", serial);

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Bottle opening recorded successfully",
    });
  } catch {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}