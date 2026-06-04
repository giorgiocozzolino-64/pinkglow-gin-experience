import Link from "next/link";
import { supabase } from "@/app/lib/supabase";

export default async function AdminPage({
  searchParams,
}: {
  searchParams?: Promise<{ search?: string }>;
}) {
  const params = await searchParams;
  const search = params?.search?.trim() || "";

  const { count: totalBottles } = await supabase
    .from("pinkglow_bottles")
    .select("*", { count: "exact", head: true });

  const { count: claimedBottles } = await supabase
    .from("pinkglow_claims")
    .select("*", { count: "exact", head: true });

  const { count: transfers } = await supabase
    .from("pinkglow_ownership_history")
    .select("*", { count: "exact", head: true });

  const { count: opened } = await supabase
    .from("pinkglow_bottle_events")
    .select("*", { count: "exact", head: true })
    .eq("event_type", "opened");

  let bottlesQuery = supabase
    .from("pinkglow_bottles")
    .select("*")
    .order("serial");

  if (search) {
    bottlesQuery = bottlesQuery.ilike("serial", `%${search}%`);
  }

  const { data: bottles } = await bottlesQuery;

  return (
    <main className="min-h-screen bg-black p-10 text-white">
      <h1 className="mb-10 text-4xl font-bold">
        Pinkglow Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <div className="rounded-2xl border border-pink-500 p-6">
          <p className="text-zinc-400">Total Bottles</p>
          <h2 className="text-4xl font-bold">{totalBottles || 0}</h2>
        </div>

        <div className="rounded-2xl border border-emerald-500 p-6">
          <p className="text-zinc-400">Claimed</p>
          <h2 className="text-4xl font-bold">{claimedBottles || 0}</h2>
        </div>

        <div className="rounded-2xl border border-blue-500 p-6">
          <p className="text-zinc-400">Transfers</p>
          <h2 className="text-4xl font-bold">{transfers || 0}</h2>
        </div>

        <div className="rounded-2xl border border-orange-500 p-6">
          <p className="text-zinc-400">Opened</p>
          <h2 className="text-4xl font-bold">{opened || 0}</h2>
        </div>
      </div>

      <div className="mt-12">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h2 className="text-2xl font-bold">Bottle Registry</h2>

          <form action="/admin" className="flex gap-3">
            <input
              name="search"
              defaultValue={search}
              placeholder="Search serial..."
              className="rounded-xl border border-zinc-700 bg-black px-4 py-3 text-white outline-none focus:border-pink-400"
            />

            <button
              type="submit"
              className="rounded-xl bg-pink-500 px-5 py-3 font-semibold text-black hover:bg-pink-400"
            >
              Search
            </button>

            {search && (
              <Link
                href="/admin"
                className="rounded-xl border border-zinc-700 px-5 py-3 text-zinc-300 hover:border-pink-400"
              >
                Reset
              </Link>
            )}
          </form>
        </div>

        <div className="overflow-auto rounded-2xl border border-zinc-800">
          <table className="w-full text-left">
            <thead className="bg-zinc-900">
              <tr>
                <th className="p-4">Serial</th>
                <th className="p-4">Bottle</th>
                <th className="p-4">Cask</th>
                <th className="p-4">Edition</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>

            <tbody>
              {bottles?.map((bottle) => (
                <tr key={bottle.serial} className="border-t border-zinc-800">
                  <td className="p-4 font-mono">
                    <Link
                      href={`/p/${bottle.serial}`}
                      className="text-pink-300 hover:text-pink-200 hover:underline"
                    >
                      {bottle.serial}
                    </Link>
                  </td>

                  <td className="p-4">
                    #{bottle.bottle_number} / {bottle.total_in_series}
                  </td>

                  <td className="p-4">{bottle.cask_code}</td>

                  <td className="p-4 text-zinc-300">
                    {bottle.edition_name}
                  </td>

                  <td className="p-4 capitalize">
                    <span className="rounded-full border border-zinc-700 px-3 py-1 text-sm">
                      {bottle.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}