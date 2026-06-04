import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { serial, newOwnerName, newOwnerEmail, transferMessage } = body;

    if (!serial || !newOwnerName || !newOwnerEmail) {
      return NextResponse.json(
        { error: "Missing required fields" },
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

    if (bottle.status === "opened" || bottle.status === "consumed") {
      return NextResponse.json(
        {
          error:
            "Ownership cannot be transferred after the bottle has been opened.",
        },
        { status: 409 }
      );
    }

    const { data: openedEvents, error: openedError } = await supabase
      .from("pinkglow_bottle_events")
      .select("id")
      .eq("bottle_serial", serial)
      .eq("event_type", "opened");

    if (openedError) {
      return NextResponse.json(
        { error: openedError.message },
        { status: 500 }
      );
    }

    if (openedEvents && openedEvents.length > 0) {
      return NextResponse.json(
        {
          error:
            "Ownership cannot be transferred after the bottle has been opened.",
        },
        { status: 409 }
      );
    }

    const { data: currentClaim, error: claimError } = await supabase
      .from("pinkglow_claims")
      .select("*")
      .eq("serial", serial)
      .order("claimed_at", { ascending: false })
      .limit(1)
      .single();

    if (claimError || !currentClaim) {
      return NextResponse.json(
        { error: "Current owner not found" },
        { status: 404 }
      );
    }

    const { error: historyError } = await supabase
      .from("pinkglow_ownership_history")
      .insert({
        bottle_serial: serial,
        previous_owner_name: currentClaim.owner_name,
        previous_owner_email: currentClaim.owner_email,
        new_owner_name: newOwnerName,
        new_owner_email: newOwnerEmail,
        transfer_message: transferMessage || null,
      });

    if (historyError) {
      return NextResponse.json(
        { error: historyError.message },
        { status: 500 }
      );
    }

    const { error: updateError } = await supabase
      .from("pinkglow_claims")
      .update({
        owner_name: newOwnerName,
        owner_email: newOwnerEmail,
        owner_message: transferMessage || currentClaim.owner_message,
      })
      .eq("id", currentClaim.id);

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Ownership transferred successfully",
    });
  } catch {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}