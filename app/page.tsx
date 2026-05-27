export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-5xl px-6 py-24">
        <p className="tracking-[0.4em] text-pink-300">
          PINKGLOW GIN
        </p>

        <h1 className="mt-6 text-7xl font-bold leading-none">
          The glow was never added.
          <br />
          It was inherited.
        </h1>

        <p className="mt-8 max-w-2xl text-xl leading-9 text-zinc-300">
          An experimental single cask gin inspired by the original Royal Navy
          Pink Gin tradition.
        </p>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-pink-300/20 bg-white/5 p-8 backdrop-blur">
            <p className="text-5xl font-bold">3</p>
            <p className="mt-3 text-zinc-400">
              Negroni-seasoned casks
            </p>
          </div>

          <div className="rounded-3xl border border-pink-300/20 bg-white/5 p-8 backdrop-blur">
            <p className="text-5xl font-bold">250</p>
            <p className="mt-3 text-zinc-400">
              collectible bottles
            </p>
          </div>

          <div className="rounded-3xl border border-pink-300/20 bg-white/5 p-8 backdrop-blur">
            <p className="text-5xl font-bold">12</p>
            <p className="mt-3 text-zinc-400">
              months maturation
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}