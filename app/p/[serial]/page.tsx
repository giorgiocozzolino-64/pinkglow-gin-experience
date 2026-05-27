import { notFound } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import ClaimForm from "@/app/components/ClaimForm";

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

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-5xl px-6 py-20">
        <p className="tracking-[0.4em] text-pink-300">PINKGLOW GIN</p>

        <h1 className="mt-6 text-6xl font-bold">Bottle Identity</h1>

        <p className="mt-6 max-w-2xl text-xl text-zinc-300">
          An experimental single cask gin inspired by the original Royal Navy
          Pink Gin tradition.
        </p>

        <section className="mt-12 rounded-3xl border border-pink-300/20 bg-white/5 p-8 backdrop-blur">
          <p className="tracking-[0.3em] text-zinc-400">SERIAL NUMBER</p>

          <h2 className="mt-4 text-5xl font-bold">{bottle.serial}</h2>

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
        </section>

        {claim && (
          <section className="mt-8 rounded-3xl border border-emerald-300/20 bg-emerald-950/20 p-8">
            <h3 className="text-2xl font-semibold text-emerald-200">
              Current Owner
            </h3>

            <p className="mt-4 text-3xl font-semibold">
              {claim.owner_name}
            </p>

            <p className="mt-2 text-zinc-300">
              {claim.owner_email}
            </p>

            {claim.owner_message && (
              <p className="mt-2 text-zinc-400">
                {claim.owner_message}
              </p>
            )}
          </section>
        )}

        <section className="mt-8 rounded-3xl border border-pink-300/20 bg-white/5 p-8 backdrop-blur">
          <h3 className="text-2xl font-semibold">The Origin</h3>

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
          <h3 className="text-2xl font-semibold">Event Edition</h3>

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
              <p className="mt-2 text-lg text-zinc-200">
                {bottle.size_ml} ml
              </p>
            </div>
          </div>
        </section>

        {bottle.status === "unclaimed" ? (
          <ClaimForm serial={bottle.serial} />
        ) : (
          <div className="mt-8 rounded-3xl border border-emerald-300/20 bg-emerald-950/20 p-8">
            <h3 className="text-2xl font-semibold text-emerald-200">
              Bottle Claimed
            </h3>

            <p className="mt-2 text-zinc-300">
              This Pinkglow Gin miniature has already been claimed.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}