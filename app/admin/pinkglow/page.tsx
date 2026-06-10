import { supabaseAdmin as supabase } from "@/app/lib/supabaseAdmin";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getDashboardStats() {
  const { data: timeline } = await supabase.from("pinkglow_timeline").select("*");

  const { data: pageViewsData } = await supabase
    .from("pinkglow_page_views")
    .select("*");

  const { count: totalBottles } = await supabase
    .from("pinkglow_bottles")
    .select("*", { count: "exact", head: true });

  const { count: totalClaims } = await supabase
    .from("pinkglow_claims")
    .select("*", { count: "exact", head: true });

  const { data: contacts } = await supabase
    .from("pinkglow_contacts")
    .select("*");

  const totalContacts = contacts?.length || 0;

  const consentContacts =
    contacts?.filter((c) => c.marketing_consent === true).length || 0;

  const events = timeline || [];
  const scans = pageViewsData || [];

  const pageViews = scans.length;
  const opened = events.filter((e) => e.event_type === "opened").length;
  const transfers = events.filter((e) => e.event_type === "transfer").length;

  const uniqueBottles = new Set(scans.map((e) => e.serial)).size;

  const gpsScans = scans.filter(
    (scan) => scan.gps_allowed === true && scan.latitude && scan.longitude
  );

  const uniqueCities = new Set(
    gpsScans.map((scan) => scan.city).filter(Boolean)
  ).size;

  const uniqueRegions = new Set(
    gpsScans.map((scan) => scan.region).filter(Boolean)
  ).size;

  const uniqueCountries = new Set(
    gpsScans.map((scan) => scan.country).filter(Boolean)
  ).size;

  return {
    totalBottles: totalBottles || 0,
    totalClaims: totalClaims || 0,
    totalContacts,
    consentContacts,
    pageViews,
    uniqueBottles,
    opened,
    transfers,
    gpsVerifiedScans: gpsScans.length,
    uniqueCities,
    uniqueRegions,
    uniqueCountries,
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
    .from("pinkglow_page_views")
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

async function getTopLocations() {
  const { data } = await supabase
    .from("pinkglow_page_views")
    .select("city, region, country, gps_allowed")
    .eq("gps_allowed", true);

  const counts: Record<string, number> = {};

  (data || []).forEach((row) => {
    const label = [row.city, row.region, row.country].filter(Boolean).join(", ");
    if (!label) return;
    counts[label] = (counts[label] || 0) + 1;
  });

  return Object.entries(counts)
    .map(([location, scans]) => ({ location, scans }))
    .sort((a, b) => b.scans - a.scans)
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

async function getLatestGpsActivity() {
  const { data } = await supabase
    .from("pinkglow_page_views")
    .select("*")
    .eq("gps_allowed", true)
    .order("created_at", { ascending: false })
    .limit(10);

  return data || [];
}

export default async function AdminPage() {
  const stats = await getDashboardStats();
  const topBottles = await getTopBottles();
  const topCompanies = await getTopCompanies();
  const topLocations = await getTopLocations();
  const latestActivity = await getLatestActivity();
  const latestGpsActivity = await getLatestGpsActivity();

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <p className="tracking-[0.4em] text-pink-400">
          PINKGLOW DIGITAL PASSPORT
        </p>

        <h1 className="mt-4 text-5xl font-bold">Executive Dashboard</h1>

        <p className="mt-3 text-zinc-400">
          Live overview of QR scans, bottle claims, contacts, openings,
          transfers and verified scan locations.
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
          <StatCard title="GPS Verified" value={stats.gpsVerifiedScans} />
          <StatCard title="Cities" value={stats.uniqueCities} />
          <StatCard title="Regions" value={stats.uniqueRegions} />
          <StatCard title="Countries" value={stats.uniqueCountries} />
        </section>

        <section className="mt-12 grid gap-8 lg:grid-cols-3">
          <Panel title="Top Scanned Bottles">
            {topBottles.length === 0 && (
              <p className="text-zinc-400">No scans recorded yet.</p>
            )}

            {topBottles.map((bottle) => (
              <Row key={bottle.serial} left={bottle.serial} right={`${bottle.views} views`} mono />
            ))}
          </Panel>

          <Panel title="Top Companies">
            {topCompanies.map((company) => (
              <Row
                key={company.company}
                left={company.company}
                right={company.contacts}
              />
            ))}
          </Panel>

          <Panel title="Top Locations">
            {topLocations.length === 0 && (
              <p className="text-zinc-400">No verified GPS locations yet.</p>
            )}

            {topLocations.map((location) => (
              <Row
                key={location.location}
                left={location.location}
                right={`${location.scans} scans`}
              />
            ))}
          </Panel>
        </section>

        <section className="mt-8 grid gap-8 lg:grid-cols-2">
          <Panel title="Latest GPS Activity">
            {latestGpsActivity.length === 0 && (
              <p className="text-zinc-400">No GPS activity yet.</p>
            )}

            {latestGpsActivity.map((event: any, index) => (
              <div
                key={`${event.serial}-${event.created_at}-${index}`}
                className="rounded-2xl bg-black/40 p-4"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="font-mono text-sm text-white">
                    {event.serial}
                  </span>

                  <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs uppercase tracking-wider text-emerald-300">
                    GPS Verified
                  </span>
                </div>

                <p className="mt-2 text-sm text-zinc-300">
                  {[event.city, event.region, event.country]
                    .filter(Boolean)
                    .join(", ")}
                </p>

                <p className="mt-2 text-xs text-zinc-500">
                  {new Date(event.created_at).toLocaleString("en-GB", {
                    timeZone: "Europe/London",
                  })}
                </p>

                {event.latitude && event.longitude && (
                  <p className="mt-2 font-mono text-xs text-zinc-500">
                    {event.latitude}, {event.longitude}
                  </p>
                )}
              </div>
            ))}
          </Panel>

          <Panel title="Latest Activity">
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
                  {new Date(event.event_time).toLocaleString("en-GB", {
                    timeZone: "Europe/London",
                  })}
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
          </Panel>
        </section>
      </div>
    </main>
  );
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-pink-300/20 bg-white/5 p-6">
      <h2 className="text-2xl font-bold text-pink-300">{title}</h2>
      <div className="mt-6 space-y-3">{children}</div>
    </div>
  );
}

function Row({
  left,
  right,
  mono = false,
}: {
  left: string;
  right: string | number;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-black/40 p-4">
      <span className={mono ? "font-mono text-sm" : ""}>{left}</span>
      <span className="rounded-full bg-pink-500/20 px-3 py-1 text-sm text-pink-300">
        {right}
      </span>
    </div>
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