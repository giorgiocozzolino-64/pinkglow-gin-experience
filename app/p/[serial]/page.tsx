import { notFound } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/app/lib/supabase";
import ClaimForm from "@/app/components/ClaimForm";
import TransferOwnershipForm from "@/app/components/TransferOwnershipForm";
import OpenBottleForm from "@/app/components/OpenBottleForm";
import TrackPinkglowView from "@/app/components/TrackPinkglowView";
import Link from "next/link";

async function getBottle(serial: string) {
  const { data, error } = await supabase
    .from("pinkglow_bottles")
    .select("*")
    .eq("serial", serial)
    .single();

  if (error || !data) return null;
  return data;
}

async function getClaim(serial: string) {
  const { data } = await supabase
    .from("pinkglow_claims")
    .select("*")
    .eq("serial", serial)
    .order("claimed_at", { ascending: false })
    .limit(1)
    .single();

  return data;
}

async function getCoupon(serial: string) {
  const { data } = await supabase
    .from("pinkglow_coupons")
    .select("*")
    .eq("bottle_serial", serial)
    .limit(1)
    .single();

  return data;
}

async function getOwnershipHistory(serial: string) {
  const { data } = await supabase
    .from("pinkglow_ownership_history")
    .select("*")
    .eq("bottle_serial", serial)
    .order("transferred_at", { ascending: false });

  return data || [];
}

async function getBottleEvents(serial: string) {
  const { data } = await supabase
    .from("pinkglow_bottle_events")
    .select("*")
    .eq("bottle_serial", serial)
    .order("created_at", { ascending: false });

  return data || [];
}

function buildCouponCode(serial: string) {
  return serial.replace("PG-FC26-", "PG10-FC26-");
}

const fifeGallery = [
  "/gallery/fife-business-awards-2026/fife-2026-01.jpg",
  "/gallery/fife-business-awards-2026/fife-2026-02.jpg",
  "/gallery/fife-business-awards-2026/fife-2026-03.jpg",
  "/gallery/fife-business-awards-2026/fife-2026-05.jpg",
  "/gallery/fife-business-awards-2026/fife-2026-06.jpg",
  "/gallery/fife-business-awards-2026/fife-2026-07.jpg",
  "/gallery/fife-business-awards-2026/fife-2026-08.jpg",
  "/gallery/fife-business-awards-2026/fife-2026-09.jpg",
  "/gallery/fife-business-awards-2026/fife-2026-10.jpg",
  "/gallery/fife-business-awards-2026/fife-2026-11.jpg",
  "/gallery/fife-business-awards-2026/fife-2026-12.jpg",
];

export default async function BottlePage({
  params,
}: {
  params: Promise<{ serial: string }>;
}) {
  const { serial } = await params;

  const bottle = await getBottle(serial);

  if (!bottle) {
    notFound();
  }

  const claim = await getClaim(serial);
  const coupon = await getCoupon(serial);
  const ownershipHistory = await getOwnershipHistory(serial);
  const bottleEvents = await getBottleEvents(serial);

  const couponCode = coupon?.coupon_code || buildCouponCode(bottle.serial);
  const couponStatus = coupon?.status || "active";
  const isOpened = bottle.status === "opened";

  return (
    <main className="min-h-screen bg-black text-white">
      <TrackPinkglowView serial={bottle.serial} />

      <div className="mx-auto max-w-6xl px-6 py-14">
        <header className="flex items-center gap-8 border-b border-white/10 pb-10">
          <Image
            src="/images/otg-logo.png"
            alt="Old Tom Gin Company"
            width={130}
            height={130}
            priority
            className="h-auto w-28"
          />

          <div>
            <p className="text-5xl font-bold tracking-[0.15em] text-pink-300 drop-shadow-[0_0_18px_rgba(244,114,182,0.55)]">
              PINKGLOW GIN
            </p>

            <p className="mt-4 text-lg text-zinc-400">
              Old Tom Gin Company in St Andrews Ltd • Established 1821
            </p>
          </div>
        </header>

        <section className="mt-12 grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <h1 className="text-7xl font-bold tracking-tight">
              Bottle Identity
            </h1>

            <p className="mt-6 max-w-3xl text-2xl leading-relaxed text-zinc-300">
              An experimental single cask gin inspired by the original Royal
              Navy Pink Gin tradition.
            </p>

            <div className="mt-10 rounded-3xl border border-pink-300/20 bg-white/5 p-8 backdrop-blur">
              <p className="tracking-[0.3em] text-zinc-400">SERIAL NUMBER</p>

              <h2 className="mt-4 text-6xl font-bold">{bottle.serial}</h2>

              <div className="mt-10 grid gap-8 md:grid-cols-3">
                <div>
                  <p className="text-sm text-zinc-500">Cask</p>
                  <p className="mt-2 text-3xl text-pink-100">
                    {bottle.cask_code}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-zinc-500">Bottle</p>
                  <p className="mt-2 text-3xl text-pink-100">
                    {bottle.bottle_number} / {bottle.total_in_series}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-zinc-500">Status</p>
                  <p className="mt-2 text-3xl text-pink-100 capitalize">
                    {bottle.status}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <aside className="rounded-3xl border border-pink-400/20 bg-gradient-to-b from-pink-950/30 to-black p-8">
            <Image
              src="/images/otg-logo.png"
              alt="OTG Seal"
              width={260}
              height={260}
              className="mx-auto h-auto w-56 opacity-90"
            />

            <div className="mt-8 rounded-2xl border border-pink-400/20 bg-black/40 p-6">
              <p className="text-sm uppercase tracking-[0.25em] text-pink-300">
                Digital Passport
              </p>

              <p className="mt-4 text-zinc-300">
                This QR passport verifies authenticity, ownership, transfer
                history and bottle opening status.
              </p>

              <Link
                href={`/certificate/${bottle.serial}`}
                className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-pink-500 px-5 py-3 font-semibold text-black hover:bg-pink-400"
              >
                Download Certificate
              </Link>
            </div>
          </aside>
        </section>

        {claim && (
          <section className="mt-10 rounded-3xl border border-emerald-300/20 bg-emerald-950/20 p-8">
            <p className="text-sm uppercase tracking-[0.25em] text-emerald-300">
              Digital Ownership Certificate
            </p>

            <h3 className="mt-3 text-4xl font-bold text-emerald-100">
              {isOpened ? "Opened & Archived" : "Authentic & Registered"}
            </h3>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <div>
                <p className="text-sm text-zinc-500">Registered Owner</p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  {claim.owner_name}
                </p>
              </div>

              <div>
                <p className="text-sm text-zinc-500">Email</p>
                <p className="mt-2 text-lg text-zinc-300">
                  {claim.owner_email}
                </p>
              </div>

              <div>
                <p className="text-sm text-zinc-500">Bottle</p>
                <p className="mt-2 text-lg text-zinc-300">{bottle.serial}</p>
              </div>

              <div>
                <p className="text-sm text-zinc-500">Owner Number</p>
                <p className="mt-2 text-lg text-zinc-300">
                  #{bottle.bottle_number} of {bottle.total_in_series}
                </p>
              </div>

              <div>
                <p className="text-sm text-zinc-500">Edition</p>
                <p className="mt-2 text-lg text-zinc-300">
                  {bottle.edition_name}
                </p>
              </div>

              <div>
                <p className="text-sm text-zinc-500">Marketing Consent</p>
                <p className="mt-2 text-lg text-zinc-300">
                  {claim.marketing_consent ? "Yes" : "No"}
                </p>
              </div>
            </div>
          </section>
        )}

        {claim && (
          <section className="mt-8 rounded-3xl border border-pink-500/20 bg-pink-500/10 p-8">
            <p className="text-sm uppercase tracking-[0.25em] text-pink-300">
              Owner Benefit
            </p>

            <h3 className="mt-3 text-3xl font-bold text-white">
              £10 Owner Credit
            </h3>

            <div className="mt-6 rounded-2xl border border-pink-500/20 bg-black/30 p-6">
              <p className="text-sm text-zinc-400">Coupon Code</p>

              <p className="mt-2 text-3xl font-mono text-pink-300">
                {couponCode}
              </p>

              <p className="mt-4 text-sm text-zinc-400">
                Valid on the purchase of one Pinkglow Gin 70cl Limited Edition
                Single Cask bottle.
              </p>

              <p className="mt-4 text-sm uppercase tracking-widest text-pink-300">
                Status: {couponStatus}
              </p>
            </div>
          </section>
        )}

        <section className="mt-8 rounded-3xl border border-pink-300/20 bg-white/5 p-8 backdrop-blur">
          <h3 className="text-3xl font-semibold">The Origin</h3>

          <p className="mt-6 leading-9 text-zinc-300">
            Pinkglow Gin began as a real experiment. Three casks that had
            previously matured Negroni for four years were filled with gin and
            left to rest for twelve months. Inside the wood remained the memory
            of gin, vermouth and bitter. Over time, the spirit absorbed the
            bitter glow left behind by the Negroni, creating its natural
            Pinkglow.
          </p>
        </section>

        <section className="mt-8 rounded-3xl border border-pink-300/20 bg-white/5 p-8 backdrop-blur">
          <h3 className="text-3xl font-semibold">Event Edition</h3>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <div>
              <p className="text-sm text-zinc-500">Event</p>
              <p className="mt-2 text-lg text-zinc-200">
                {bottle.event_name}
              </p>
            </div>

            <div>
              <p className="text-sm text-zinc-500">Edition</p>
              <p className="mt-2 text-lg text-zinc-200">
                {bottle.edition_name}
              </p>
            </div>

            <div>
              <p className="text-sm text-zinc-500">Size</p>
              <p className="mt-2 text-lg text-zinc-200">{bottle.size_ml} ml</p>
            </div>
          </div>
        </section>

        {ownershipHistory.length > 0 && (
          <section className="mt-8 rounded-3xl border border-cyan-500/20 bg-cyan-950/10 p-8">
            <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">
              Provenance
            </p>

            <h3 className="mt-3 text-3xl font-bold text-white">
              Ownership History
            </h3>

            <div className="mt-6 space-y-4">
              {ownershipHistory.map((transfer) => (
                <div
                  key={transfer.id}
                  className="rounded-2xl border border-cyan-500/10 bg-black/30 p-5"
                >
                  <p className="font-medium text-cyan-300">
                    Ownership Transfer
                  </p>

                  <p className="mt-3 text-zinc-300">
                    From: {transfer.previous_owner_name || "Producer"}
                  </p>

                  <p className="text-zinc-300">
                    To: {transfer.new_owner_name}
                  </p>

                  {transfer.transfer_message && (
                    <p className="mt-2 italic text-zinc-500">
                      &quot;{transfer.transfer_message}&quot;
                    </p>
                  )}

                  <p className="mt-3 text-sm text-zinc-500">
                    {new Date(transfer.transferred_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {bottleEvents.length > 0 && (
          <section className="mt-8 rounded-3xl border border-orange-400/20 bg-orange-950/10 p-8">
            <p className="text-sm uppercase tracking-[0.25em] text-orange-300">
              Bottle Events
            </p>

            <h3 className="mt-3 text-3xl font-bold text-white">
              Event Timeline
            </h3>

            <div className="mt-6 space-y-4">
              {bottleEvents.map((event) => (
                <div
                  key={event.id}
                  className="rounded-2xl border border-orange-400/10 bg-black/30 p-5"
                >
                  <p className="font-medium capitalize text-orange-300">
                    {event.event_type}
                  </p>

                  {event.owner_name && (
                    <p className="mt-2 text-zinc-300">
                      Opened by: {event.owner_name}
                    </p>
                  )}

                  {event.notes && (
                    <p className="mt-2 text-zinc-400">{event.notes}</p>
                  )}

                  <p className="mt-3 text-sm text-zinc-500">
                    {new Date(event.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="mt-8 rounded-3xl border border-pink-300/20 bg-white/5 p-8 backdrop-blur">
          <p className="text-sm uppercase tracking-[0.25em] text-pink-300">
            Fife Business Awards 2026
          </p>

          <h3 className="mt-3 text-4xl font-bold text-white">Event Gallery</h3>

          <p className="mt-4 text-zinc-300">
            Pinkglow Gin Digital Passport was showcased during the Fife Business
            Awards 2026, where guests interacted with the bottles through live
            QR scans, ownership registration and digital certification.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {fifeGallery.map((src, index) => (
              <div
                key={src}
                className="overflow-hidden rounded-2xl border border-pink-300/10 bg-black/40"
              >
                <Image
                  src={src}
                  alt={`Fife Business Awards 2026 gallery image ${index + 1}`}
                  width={900}
                  height={650}
                  className="h-72 w-full object-cover transition duration-500 hover:scale-105"
                />
              </div>
            ))}
          </div>
        </section>

        {bottle.status === "unclaimed" ? (
          <ClaimForm serial={bottle.serial} />
        ) : isOpened ? (
          <div className="mt-8 rounded-3xl border border-orange-400/20 bg-orange-950/20 p-8">
            <p className="text-sm uppercase tracking-[0.25em] text-orange-300">
              Digital Passport Archived
            </p>

            <h3 className="mt-3 text-3xl font-bold text-white">
              Bottle Opened
            </h3>

            <p className="mt-4 text-zinc-300">
              This bottle has been opened. Ownership transfer is permanently
              locked. The digital passport remains available as a provenance
              record.
            </p>
          </div>
        ) : (
          <>
            <div className="mt-8 rounded-3xl border border-emerald-300/20 bg-emerald-950/20 p-8">
              <h3 className="text-2xl font-semibold text-emerald-200">
                Digital Passport Active
              </h3>

              <p className="mt-2 text-zinc-300">
                This bottle has been authenticated and registered by its owner.
                Ownership record secured.
              </p>
            </div>

            <TransferOwnershipForm serial={bottle.serial} />

            <OpenBottleForm serial={bottle.serial} />
          </>
        )}
      </div>
    </main>
  );
}