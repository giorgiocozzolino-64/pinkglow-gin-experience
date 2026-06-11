import fs from "fs";
import path from "path";
import Image from "next/image";
import Link from "next/link";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const GALLERY_DIR = "gallery/fife-business-awards-2026";

function getGalleryImages(): string[] {
  const dir = path.join(process.cwd(), "public", GALLERY_DIR);
  return fs
    .readdirSync(dir)
    .filter((file) => /\.(jpg|jpeg|png|webp)$/i.test(file))
    .sort()
    .map((file) => `/${GALLERY_DIR}/${file}`);
}

export default function FifeBusinessAwardsGallery() {
  const galleryImages = getGalleryImages();

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex items-center justify-between">
          <div>
            <p className="uppercase tracking-[0.35em] text-pink-400">
              E.L.Y.A.S.-A.I. Event Archive
            </p>

            <h1 className="mt-4 text-5xl font-bold">
              Fife Business Awards 2026
            </h1>

            <p className="mt-4 max-w-3xl text-zinc-400">
              Official event gallery documenting the launch and live testing
              of the Pinkglow Gin Digital Passport during the Fife Business
              Awards 2026.
            </p>
          </div>

          <Link
            href="/"
            className="rounded-xl border border-pink-300/20 px-5 py-3 text-sm text-zinc-300 hover:bg-white/5"
          >
            ← Back
          </Link>
        </div>

        <section className="mt-10 rounded-3xl border border-pink-300/20 bg-white/5 p-8">
          <div className="grid gap-6 md:grid-cols-4">
            <StatCard title="Event" value="Fife Awards" />
            <StatCard title="Year" value="2026" />
            <StatCard title="Photos" value={String(galleryImages.length)} />
            <StatCard title="Digital Passport" value="LIVE" />
          </div>
        </section>

        <section className="mt-10">
          <h2 className="mb-6 text-3xl font-bold">
            Official Photo Gallery
          </h2>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {galleryImages.map((src, index) => (
              <div
                key={src}
                className="overflow-hidden rounded-3xl border border-pink-300/10 bg-white/5"
              >
                <Image
                  src={src}
                  alt={`Fife Business Awards ${index + 1}`}
                  width={1200}
                  height={800}
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  loading={index < 6 ? "eager" : "lazy"}
                  className="h-80 w-full object-cover transition duration-500 hover:scale-105"
                />
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12 rounded-3xl border border-pink-300/20 bg-white/5 p-8">
          <h2 className="text-3xl font-bold text-pink-300">
            Historic Milestone
          </h2>

          <div className="mt-6 space-y-6 text-zinc-300 leading-8">
            <p>
              <strong>Fife Business Awards 2026</strong>
              <br />
              Old Course Hotel, St Andrews, Scotland
            </p>

            <p>
              <strong>Mc Fratm Ltd</strong>
              <br />
              Digital Innovation & Technology Award Finalist
            </p>

            <p>
              The Fife Business Awards 2026 represented the first
              large-scale public demonstration of the E.L.Y.A.S.-A.I.
              Digital Product Passport ecosystem.
            </p>

            <p>
              During the event, guests interacted directly with
              certified products through QR-enabled digital passports,
              ownership registration, digital certification and
              traceability technologies.
            </p>

            <p>
              The event marked an important milestone in the evolution
              of E.L.Y.A.S.-A.I., demonstrating how physical products can
              be connected to verified digital identities and
              authenticated provenance records.
            </p>

            <p className="font-semibold text-pink-300">
              Every certified product has a story.
              <br />
              Every story deserves to be preserved.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
      <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
        {title}
      </p>

      <p className="mt-3 text-3xl font-bold text-pink-300">
        {value}
      </p>
    </div>
  );
}