import { supabase } from "@/app/lib/supabase";

async function getDashboardStats() {
  const { data: timeline } = await supabase
    .from("pinkglow_timeline")
    .select("*");

  const { count: totalBottles } = await supabase
    .from("pinkglow_bottles")
    .select("*", { count: "exact", head: true });

  const { count: totalClaims } = await supabase
    .from("pinkglow_claims")
    .select("*", { count: "exact", head: true });

  const { count: totalContacts } = await supabase
    .from("pinkglow_contacts")
    .select("*", { count: "exact", head: true });

  const { count: consentContacts } = await supabase
    .from("pinkglow_contacts")
    .select("*", { count: "exact", head: true })
    .eq("marketing_consent", true);

  const events = timeline || [];

  const pageViews = events.filter((e) => e.event_type === "page_view").length;
  const opened = events.filter((e) => e.event_type === "opened").length;
  const transfers = events.filter((e) => e.event_type === "transfer").length;

  const uniqueBottles = new Set(
    events.filter((e) => e.event_type === "page_view").map((e) => e.serial)
  ).size;

  return {
    totalBottles: totalBottles || 0,
    totalClaims: totalClaims || 0,
    totalContacts: totalContacts || 0,
    consentContacts: consentContacts || 0,
    pageViews,
    uniqueBottles,
    opened,
    transfers,
    claimRate: totalBottles
      ? (((totalClaims || 0) / totalBottles) * 100).toFixed(1)
      : "0",
    consentRate: totalContacts
      ? (((consentContacts || 0) / totalContacts) * 100).toFixed(1)
      : "0",
    conversionRate: uniqueBottles
      ? (((totalClaims || 0) / uniqueBottles) * 100).toFixed(1)
      : "0",
  };
}

async function getTopBottles() {
  const { data } = await supabase
    .from("pinkglow_timeline")
    .select("serial, event_type")
    .eq("event_type", "page_view");

  const counts: Record<string, number> = {};

  (data || []).forEach((row) => {
    counts[row.serial] = (counts[row.serial] || 0) + 1;
  });

  return Object.entries(counts)
    .map(([serial, views]) => ({ serial, views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);
}

async function getTopCompanies() {
  const { data } = await supabase
    .from("pinkglow_timeline")
    .select("notes, event_type")
    .eq("event_type", "claim");

  const counts: Record<string, number> = {};

  (data || []).forEach((row) => {
    const company = row.notes || "Unknown";
    counts[company] = (counts[company] || 0) + 1;
  });

  return Object.entries(counts)
    .map(([company, contacts]) => ({ company, contacts }))
    .sort((a, b) => b.contacts - a.contacts);
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
  const topCompanies = await getTopCompanies();
  const latestActivity = await getLatestActivity();

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <p className="tracking-[0.4em] text-pink-400">
          PINKGLOW DIGITAL PASSPORT
        </p>

        <h1 className="mt-4 text-5xl font-bold">Executive Dashboard</h1>

        <p className="mt-3 text-zinc-400">
          Live overview of QR scans, bottle claims, contacts, openings and transfers.
        </p>

        <section className="mt-10 grid gap-5 md:grid-cols-3 lg:grid-cols-5">
          <StatCard title="Bottles Issued" value={stats.totalBottles} />
          <StatCard title="Page Views" value={stats.pageViews} />
          <StatCard title="Bottles Scanned" value={stats.uniqueBottles} />
          <StatCard title="Claims" value={stats.totalClaims} />
          <StatCard title="Contacts" value={stats.totalContacts} />
          <StatCard title="Marketing Consent" value={`${stats.consentRate}%`} />
          <StatCard title="Claim Rate" value={`${stats.claimRate}%`} />
          <StatCard title="Opened" value={stats.opened} />
          <StatCard title="Transfers" value={stats.transfers} />
         
        </section>

        <section className="mt-12 grid gap-8 lg:grid-cols-3">
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
            <h2 className="text-2xl font-bold text-pink-300">Top Companies</h2>

            <div className="mt-6 space-y-3">
              {topCompanies.map((company) => (
                <div
                  key={company.company}
                  className="flex justify-between rounded-2xl bg-black/40 p-4"
                >
                  <span>{company.company}</span>
                  <span className="text-pink-300">{company.contacts}</span>
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
                      <span className="text-pink-300">{event.owner_name}</span>
                    </p>
                  )}

                  {event.owner_email && (
                    <p className="text-sm text-zinc-400">{event.owner_email}</p>
                  )}

                  {event.notes && (
                    <p className="mt-2 text-sm text-zinc-300">{event.notes}</p>
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