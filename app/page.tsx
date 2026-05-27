import { supabase } from "./lib/supabase";

async function getStats() {
  const { data, error } = await supabase
    .from("pinkglow_bottles")
    .select("id, serial")
    .limit(250);

  return {
    casks: 3,
    bottles: data?.length || 0,
    maturation: 12,
    error: error?.message || null,
    sample: data?.slice(0, 3) || [],
  };
}

export default async function HomePage() {
  const stats = await getStats();

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="pink-aura" />

      <section className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-20">
        <p className="text-sm uppercase tracking-[0.5em] text-pink-300">
          Pinkglow Gin
        </p>

        <h1 className="mt-6 max-w-5xl text-6xl font-semibold tracking-tight md:text-8xl">
          The glow was never added.
          <br />
          It was inherited.
        </h1>

        <p className="mt-8 max-w-2xl text-xl leading-8 text-zinc-300">
          An experimental single cask gin inspired by the original Royal Navy
          Pink Gin tradition.
        </p>

        {stats.error && (
          <div className="mt-8 rounded-2xl border border-red-400/30 bg-red-950/40 p-4 text-red-200">
            Supabase error: {stats.error}
          </div>
        )}

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-pink-300/20 bg-white/5 p-6 backdrop-blur">
            <p className="text-4xl font-semibold">{stats.casks}</p>
            <p className="mt-2 text-zinc-300">Negroni-seasoned casks</p>
          </div>

          <div className="rounded-3xl border border-pink-300/20 bg-white/5 p-6 backdrop-blur">
            <p className="text-4xl font-semibold">{stats.bottles}</p>
            <p className="mt-2 text-zinc-300">collectible bottles</p>
          </div>

          <div className="rounded-3xl border border-pink-300/20 bg-white/5 p-6 backdrop-blur">
            <p className="text-4xl font-semibold">{stats.maturation}</p>
            <p className="mt-2 text-zinc-300">months maturation</p>
          </div>
        </div>

        <div className="mt-8 text-xs text-zinc-500">
          Debug sample: {JSON.stringify(stats.sample)}
        </div>
        <div className="mt-8 rounded-3xl border border-pink-300/20 bg-white/5 p-8 backdrop-blur">
  <h3 className="text-2xl font-semibold">Claim This Bottle</h3>

  <form
    action="/api/claim"
    method="POST"
    className="mt-6 grid gap-4"
  >
    <input
      type="hidden"
      name="serial"
      value={bottle.serial}
    />

    <input
      name="name"
      placeholder="Full Name"
      required
      className="rounded-xl border border-zinc-700 bg-black/40 px-4 py-3 text-white outline-none"
    />

    <input
      name="email"
      type="email"
      placeholder="Email"
      required
      className="rounded-xl border border-zinc-700 bg-black/40 px-4 py-3 text-white outline-none"
    />

    <input
      name="company"
      placeholder="Company / Venue"
      className="rounded-xl border border-zinc-700 bg-black/40 px-4 py-3 text-white outline-none"
    />

    <button
      type="submit"
      className="rounded-xl bg-pink-500 px-6 py-3 font-medium text-black transition hover:bg-pink-400"
    >
      Claim Bottle
    </button>
  </form>
</div>
      </section>
    </main>
  );
}