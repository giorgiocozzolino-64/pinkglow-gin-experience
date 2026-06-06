import { supabase } from "@/app/lib/supabase";

async function getDashboardStats() {
  const { data } = await supabase
    .from("pinkglow_timeline")
    .select("*");

  const events = data || [];

  const pageViews = events.filter((e) => e.event_type === "page_view");
  const claims = events.filter((e) => e.event_type === "claim");
  const opened = events.filter((e) => e.event_type === "opened");
  const transfers = events.filter((e) => e.event_type === "transfer");

  const uniqueBottles = new Set(pageViews.map((e) => e.serial)).size;

  return {
    pageViews: pageViews.length,
    uniqueBottles,
    claims: claims.length,
    opened: opened.length,
    transfers: transfers.length,
    conversionRate:
      uniqueBottles > 0 ? ((claims.length / uniqueBottles) * 100).toFixed(1) : "0",
  };
}

async function getTopBottles() {
  const { data } = await supabase
    .from("pinkglow_page_views")
    .select("serial");

  const counts: Record<string, number> = {};

  (data || []).forEach((row) => {
    counts[row.serial] = (counts[row.serial] || 0) + 1;
  });

  return Object.entries(counts)
    .map(([serial, views]) => ({ serial, views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);
}

async function getLatestActivity() {
  const { data } = await supabase
    .from("pinkglow_timeline")
    .select("*")
    .order("event_time", { ascending: false })
    .limit(20);

  return data || [];
}

export default async function AdminPage() {
  const stats = await getDashboardStats();
  const topBottles = await getTopBottles();
  const latestActivity = await getLatestActivity();

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <p className="tracking-[0.4em] text-pink-400">
          PINKGLOW DIGITAL PASSPORT
        </p>

        <h1 className="mt-4 text-5xl font-bold">
          Admin Dashboard
        </h1>

        <p className="mt-3 text-zinc-400">
          Live overview of QR scans, bottle claims, openings and transfers.
        </p>

        <section className="mt-10 grid gap-5 md:grid-cols-3 lg:grid-cols-6">
          <StatCard title="Page Views" value={stats.pageViews} />
          <StatCard title="Bottles Scanned" value={stats.uniqueBottles} />
          <StatCard title="Claims" value={stats.claims} />
          <StatCard title="Opened" value={stats.opened} />
          <StatCard title="Transfers" value={stats.transfers} />
          <StatCard title="Conversion" value={`${stats.conversionRate}%`} />
        </section>

        <section className="mt-12 grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl border border-pink-300/20 bg-white/5 p-6">
            <h2 className="text-2xl font-bold text-pink-300">
              Top Scanned Bottles
            </h2>

            <div className="mt-6 space-y-3">
              {topBottles.length === 0 && (
                <p className="text-zinc-400">No scans recorded yet.</p>
              )}

              {topBottles.map((bottle) => (
                <div
                  key={bottle.serial}
                  className="flex items-center justify-between rounded-2xl bg-black/40 p-4"
                >
                  <span className="font-mono text-sm">{bottle.serial}</span>
                  <span className="rounded-full bg-pink-500/20 px-3 py-1 text-sm text-pink-300">
                    {bottle.views} views
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-pink-300/20 bg-white/5 p-6">
            <h2 className="text-2xl font-bold text-pink-300">
              Latest Activity
            </h2>

            <div className="mt-6 space-y-3">
              {latestActivity.map((event: any, index) => (
                <div
                  key={`${event.serial}-${event.event_time}-${index}`}
                  className="rounded-2xl bg-black/40 p-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-mono text-sm text-white">
                      {event.serial}
                    </span>

                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-wider text-pink-300">
                      {event.event_type}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-zinc-400">
                    {new Date(event.event_time).toLocaleString()}
                  </p>

                  {event.owner_name && (
                    <p className="mt-2 text-sm">
                      Owner:{" "}
                      <span className="text-pink-300">
                        {event.owner_name}
                      </span>
                    </p>
                  )}

                  {event.owner_email && (
                    <p className="text-sm text-zinc-400">
                      {event.owner_email}
                    </p>
                  )}

                  {event.notes && (
                    <p className="mt-2 text-sm text-zinc-300">
                      {event.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
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
  value: string | number;
}) {
  return (
    <div className="rounded-3xl border border-pink-300/20 bg-white/5 p-5">
      <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
        {title}
      </p>
      <p className="mt-3 text-3xl font-bold text-pink-300">{value}</p>
    </div>
  );
}