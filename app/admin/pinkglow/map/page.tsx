import { supabaseAdmin as supabase } from "@/app/lib/supabaseAdmin";
import dynamicImport from "next/dynamic";
const PinkglowScanMap = dynamicImport(
  () => import("@/app/components/maps/PinkglowScanMap"),
  { ssr: false }
);
export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getGpsScans() {
  const { data } = await supabase
    .from("pinkglow_page_views")
    .select("*")
    .eq("gps_allowed", true)
    .order("created_at", { ascending: false });

  return data || [];
}

export default async function PinkglowMapPage() {
  const scans = await getGpsScans();

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <p className="tracking-[0.4em] text-pink-400">
          PINKGLOW GEO INTELLIGENCE
        </p>

        <h1 className="mt-4 text-5xl font-bold">Scan Location Map</h1>

        <p className="mt-3 text-zinc-400">
          Verified GPS scan locations for Pinkglow Digital Passport bottles.
        </p>
        <section className="mt-10">
  <PinkglowScanMap scans={scans} />
</section>

        <section className="mt-10 rounded-3xl border border-pink-300/20 bg-white/5 p-6">
          <h2 className="text-2xl font-bold text-pink-300">
            Verified GPS Scans
          </h2>

          <div className="mt-6 space-y-3">
            {scans.length === 0 && (
              <p className="text-zinc-400">No verified GPS scans yet.</p>
            )}

            {scans.map((scan: any) => (
              <div
                key={scan.id}
                className="rounded-2xl bg-black/40 p-4"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="font-mono text-sm">{scan.serial}</span>
                  <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs uppercase tracking-wider text-emerald-300">
                    GPS Verified
                  </span>
                </div>

                <p className="mt-3 text-zinc-300">
                  {[scan.city, scan.region, scan.country]
                    .filter(Boolean)
                    .join(", ")}
                </p>

                <p className="mt-2 font-mono text-xs text-zinc-500">
                  {scan.latitude}, {scan.longitude}
                </p>

                <p className="mt-2 text-xs text-zinc-500">
                  {new Date(scan.created_at).toLocaleString("en-GB", {
                    timeZone: "Europe/London",
                  })}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}