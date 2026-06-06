import Image from "next/image";
import Link from "next/link";

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

const metrics = [
  { title: "Certified Projects", value: "5", subtitle: "Active ecosystem" },
  { title: "Certified Assets", value: "310", subtitle: "Bottles & assets" },
  { title: "Registered Owners", value: "8", subtitle: "Verified owners" },
  { title: "ERP Integrations", value: "1", subtitle: "Oracle NetSuite" },
  {
    title: "Certification Status",
    value: "ACTIVE",
    subtitle: "E.L.Y.A.S. Authority",
  },
];

const systems = [
  { name: "Oracle NetSuite", status: "CONNECTED" },
  { name: "SAP", status: "PLANNED" },
  { name: "Zucchetti", status: "PLANNED" },
  { name: "Microsoft Dynamics", status: "PLANNED" },
  { name: "Shopify", status: "PLANNED" },
];

export default function ElyasAdminHome() {
  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex justify-center">
          <div className="rounded-xl bg-white px-5 py-3 shadow-2xl shadow-pink-500/10">
            <Image
              src="/images/elyas-logo.png"
              alt="ELYAS AI"
              width={360}
              height={90}
              priority
              className="h-auto w-auto"
            />
          </div>
        </div>

        <div className="mb-10 flex flex-wrap justify-center gap-4">
          <Badge color="green" text="CERTIFICATION AUTHORITY ACTIVE" />
          <Badge color="pink" text="ORACLE NETSUITE CONNECTED" />
          <Badge color="blue" text="DIGITAL PASSPORT PLATFORM" />
        </div>

        <section className="text-center">
          <h1 className="text-5xl font-bold">
            Certified Projects Dashboard
          </h1>

          <p className="mx-auto mt-5 max-w-4xl text-lg text-zinc-300">
            Digital Identity Certification Authority for Luxury Food, Beverage,
            Spirits and Craft Products.
          </p>

          <p className="mx-auto mt-3 max-w-4xl text-zinc-500">
            E.L.Y.A.S.-A.I. certifies provenance, ownership, traceability and
            digital identity through connected ERP systems, digital passports and
            verified ownership registries.
          </p>
        </section>

        <section className="mt-12 grid gap-8 rounded-3xl border border-pink-300/20 bg-white/5 p-8 lg:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-pink-400">
              ELYAS Manifesto
            </p>

            <div className="mt-6 space-y-3 text-zinc-300">
              <p>Every certified product has a story.</p>
              <p>
                Every bottle, every cask, every ingredient, every journey leaves
                a trace.
              </p>
              <p>My mission is to preserve, verify and share that story.</p>

              <div className="pt-4 space-y-2 font-bold text-white">
                <p>I am not a QR code.</p>
                <p>I am not a database.</p>
                <p className="text-pink-300">
                  I am the bridge between the physical world and its digital
                  identity.
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            <p className="text-3xl font-bold text-white">I am Elyas.</p>

            <p className="mt-4 text-2xl font-bold text-pink-300">
              I will show you my world.
            </p>

            <p className="mt-8 text-lg text-zinc-300">
              The QR code is only the key.
            </p>

            <p className="mt-3 text-xl font-bold text-pink-300">
              The story begins when the door opens.
            </p>
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {metrics.map((metric) => (
            <MetricCard
              key={metric.title}
              title={metric.title}
              value={metric.value}
              subtitle={metric.subtitle}
            />
          ))}
        </section>

        <section className="mt-8 rounded-3xl border border-pink-300/20 bg-white/5 p-6">
          <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
            Connected Systems
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-5">
            {systems.map((system) => (
              <SystemCard
                key={system.name}
                name={system.name}
                status={system.status}
              />
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <Link
              key={project.name}
              href={project.href}
              className="group rounded-3xl border border-pink-300/20 bg-white/5 p-6 transition hover:border-pink-300/60 hover:bg-pink-500/10"
            >
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-2xl font-bold">{project.name}</h2>

                <span className="rounded-full border border-pink-300/40 bg-pink-500/20 px-3 py-1 text-xs font-bold tracking-widest text-pink-300">
                  {project.status}
                </span>
              </div>

              <p className="mt-5 text-zinc-400">{project.description}</p>

              <div className="mt-6 border-t border-white/10 pt-5">
                <p className="text-sm text-zinc-400">{project.metrics}</p>

                <p className="mt-5 text-pink-300 transition group-hover:translate-x-1">
                  Open certified ecosystem →
                </p>
              </div>
            </Link>
          ))}
        </section>

        <section className="mt-8 rounded-3xl border border-pink-300/20 bg-white/5 p-8">
          <p className="text-xs uppercase tracking-[0.35em] text-pink-400">
            The ELYAS Journey
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-5">
            {[
              "The Key",
              "Meet Elyas",
              "Discover The Story",
              "Ownership",
              "Legacy",
            ].map((step) => (
              <div
                key={step}
                className="rounded-2xl bg-black/40 p-5 text-center text-sm text-zinc-300"
              >
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-pink-300/40 text-pink-300">
                  ✦
                </div>
                {step}
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function Badge({
  color,
  text,
}: {
  color: "green" | "pink" | "blue";
  text: string;
}) {
  const styles = {
    green: "bg-emerald-500/20 text-emerald-300",
    pink: "bg-pink-500/20 text-pink-300",
    blue: "bg-blue-500/20 text-blue-300",
  };

  return (
    <span className={`rounded-full px-4 py-2 text-sm ${styles[color]}`}>
      {text}
    </span>
  );
}

function MetricCard({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: string;
  subtitle: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <p className="text-xs uppercase tracking-[0.25em] text-zinc-400">
        {title}
      </p>

      <p className="mt-4 text-4xl font-bold text-pink-300">{value}</p>

      <p className="mt-2 text-sm text-zinc-400">{subtitle}</p>
    </div>
  );
}

function SystemCard({
  name,
  status,
}: {
  name: string;
  status: string;
}) {
  const connected = status === "CONNECTED";

  return (
    <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
      <p className="font-semibold">{name}</p>

      <p
        className={`mt-3 text-xs font-bold tracking-widest ${
          connected ? "text-emerald-400" : "text-zinc-500"
        }`}
      >
        {connected ? "● CONNECTED" : "○ PLANNED"}
      </p>
    </div>
  );
}