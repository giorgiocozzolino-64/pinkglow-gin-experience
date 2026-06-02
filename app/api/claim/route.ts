import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      serial,
      name,
      email,
      company,
      marketing_consent,
    } = body;

    if (!serial || !name || !email) {
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

    if (bottle.status === "claimed") {
      return NextResponse.json(
        { error: "Bottle already claimed" },
        { status: 409 }
      );
    }

    const { error: claimError } = await supabase
      .from("pinkglow_claims")
      .insert({
        bottle_id: bottle.id,
        serial,
        owner_name: name,
        owner_email: email,
        owner_message: company || "",
        marketing_consent: marketing_consent || false,
      });

    if (claimError) {
      return NextResponse.json(
        { error: claimError.message },
        { status: 500 }
      );
    }

    await supabase
      .from("pinkglow_bottles")
      .update({
        status: "claimed",
      })
      .eq("serial", serial);

    const couponCode = `PG10-${serial}`;

    const { error: couponError } = await supabase
      .from("pinkglow_coupons")
      .insert({
        bottle_serial: serial,
        coupon_code: couponCode,
        value_gbp: 10,
        product:
          "Pinkglow Gin 0.7L Limited Edition - Single Cask",
        status: "active",
      });

    if (couponError) {
      console.error(couponError);
    }

    return NextResponse.json({
      success: true,
      coupon_code: couponCode,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}