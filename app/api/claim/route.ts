import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";

function buildCouponCode(serial: string) {
  return serial.replace("PG-FC26-", "PG10-FC26-");
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { serial, name, email, company, marketingConsent } = body;

    if (!serial || !name || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { data: bottle, error: bottleError } = await supabase
      .from("pinkglow_bottles")
      .select("*")
      .eq("serial", serial)
      .single();

    if (bottleError || !bottle) {
      return NextResponse.json({ error: "Bottle not found" }, { status: 404 });
    }

    if (bottle.status !== "unclaimed") {
      return NextResponse.json({ error: "Bottle already claimed" }, { status: 409 });
    }

    const couponCode = buildCouponCode(serial);

    const { error: claimError } = await supabase.from("pinkglow_claims").insert({
      bottle_id: bottle.id,
      serial,
      owner_name: name,
      owner_email: email,
      owner_message: company || null,
      marketing_consent: Boolean(marketingConsent),
    });

    if (claimError) {
      return NextResponse.json({ error: claimError.message }, { status: 500 });
    }

    await supabase.from("pinkglow_ownership_history").insert({
      bottle_serial: serial,
      previous_owner_name: null,
      previous_owner_email: null,
      new_owner_name: name,
      new_owner_email: email,
      transfer_message: "Initial bottle claim",
    });

    await supabase.from("pinkglow_coupons").insert({
      bottle_serial: serial,
      coupon_code: couponCode,
      value_gbp: 10,
      product: "Pinkglow Gin 0.7L Limited Edition - Single Cask",
      status: "active",
    });

    await supabase
      .from("pinkglow_bottles")
      .update({ status: "claimed" })
      .eq("serial", serial);

    return NextResponse.json({
      success: true,
      coupon_code: couponCode,
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}