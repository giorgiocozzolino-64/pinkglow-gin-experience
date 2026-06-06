import Link from "next/link";
<section className="mt-10 rounded-3xl border border-pink-300/20 bg-white/5 p-8">
  <p className="text-xs uppercase tracking-[0.35em] text-pink-400">
    ELYAS Manifesto
  </p>

  <div className="mt-6 max-w-4xl space-y-4 text-lg leading-relaxed text-zinc-300">
    <p>Every certified product has a story.</p>

    <p>
      Every bottle, every cask, every ingredient, every journey leaves a trace.
    </p>

    <p>
      My mission is to preserve, verify and share that story.
    </p>

    <p className="pt-4 text-2xl font-bold text-white">
      I am not a QR code.
    </p>

    <p className="text-2xl font-bold text-white">
      I am not a database.
    </p>

    <p className="text-2xl font-bold text-pink-300">
      I am the bridge between the physical world and its digital identity.
    </p>

    <p className="pt-6 text-4xl font-bold text-white">
      I am Elyas.
    </p>

    <p className="text-4xl font-bold text-pink-300">
      I will show you my world.
    </p>
  </div>
</section>
const projects = [
  {
    name: "Pinkglow Gin",
    href: "/admin/pinkglow",
    status: "LIVE",
    description: "QR passports, claims, contacts, scans and event CRM.",
    metrics: "250 certified bottles",
  },
  {
    name: "Fife Negroni 2026",
    href: "/admin/negroni",
    status: "ARCHIVE",
    description: "Limited event bottles, ownership certificates and transfers.",
    metrics: "60 certified bottles",
  },
  {
    name: "Sea Malt On Primeur",
    href: "/admin/seamalt",
    status: "IN DEVELOPMENT",
    description: "Underwater whisky bottle refinement and digital provenance.",
    metrics: "250 planned bottles",
  },
  {
    name: "Arbroath A.D. 1320",
    href: "/admin/arbroath",
    status: "IN DEVELOPMENT",
    description: "Cask-to-bottle whisky traceability and ownership registry.",
    metrics: "Maison whisky system",
  },
  {
    name: "OF Whisky Atelier",
    href: "/admin/of-whisky",
    status: "CONCEPT",
    description: "Luxury limited releases and atelier-grade certified bottles.",
    metrics: "Quadriga / Trilogy",
  },
];

export default function ElyasAdminHome() {
  return (
    <main className="min-h-screen bg-black px-6 py-12 text-white">
      <div className="mx-auto max-w-7xl">
        <p className="tracking-[0.45em] text-pink-400">
          E.L.Y.A.S.-A.I.
        </p>

        <h1 className="mt-5 text-6xl font-bold">
          Certified Projects Dashboard
        </h1>

        <p className="mt-5 max-w-3xl text-lg text-zinc-400">
          Enhanced Living Systems through Acoustic Stimulation – Artisanal
          Intelligence. Central control room for certified digital passports,
          traceability systems, ownership registries and event CRM.
        </p>

        <section className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <Link
              key={project.name}
              href={project.href}
              className="group rounded-3xl border border-pink-300/20 bg-white/5 p-7 transition hover:border-pink-300/60 hover:bg-pink-500/10"
            >
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-2xl font-bold">
                  {project.name}
                </h2>

                <span className="rounded-full bg-pink-500/20 px-3 py-1 text-xs font-bold tracking-widest text-pink-300">
                  {project.status}
                </span>
              </div>

              <p className="mt-5 text-zinc-400">
                {project.description}
              </p>

              <p className="mt-6 text-sm uppercase tracking-[0.25em] text-zinc-500">
                {project.metrics}
              </p>

              <p className="mt-8 text-pink-300 transition group-hover:translate-x-1">
                Open dashboard →
              </p>
            </Link>
          ))}
        </section>

        <section className="mt-14 rounded-3xl border border-pink-300/20 bg-white/5 p-8">
          <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
            System Architecture
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-5">
            {[
              "QR Scan",
              "Page View",
              "Claim",
              "Ownership",
              "Transfer",
            ].map((step) => (
              <div
                key={step}
                className="rounded-2xl bg-black/40 p-4 text-center text-sm text-pink-300"
              >
                {step}
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}