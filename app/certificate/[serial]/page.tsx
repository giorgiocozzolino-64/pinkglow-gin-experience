import Image from "next/image";
import { notFound } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import PrintCertificateButton from "@/app/components/PrintCertificateButton";

async function getBottle(serial: string) {
  const { data } = await supabase
    .from("pinkglow_bottles")
    .select("*")
    .eq("serial", serial)
    .single();

  return data;
}

async function getClaim(serial: string) {
  const { data } = await supabase
    .from("pinkglow_claims")
    .select("*")
    .eq("serial", serial)
    .order("claimed_at", { ascending: false })
    .limit(1)
    .single();

  return data;
}

export default async function CertificatePage({
  params,
}: {
  params: Promise<{ serial: string }>;
}) {
  const { serial } = await params;

  const bottle = await getBottle(serial);
  const claim = await getClaim(serial);

  if (!bottle || !claim) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#efe6d1] p-6 text-black print:bg-[#efe6d1] print:p-3">
      <div className="mx-auto max-w-4xl border-4 border-[#4a3b24] bg-[#f8f1e2] p-7 shadow-2xl print:p-5">
        <div className="flex items-center justify-between border-b-2 border-[#4a3b24] pb-5">
          <div>
            <Image
              src="/images/otg-logo.png"
              alt="Old Tom Gin Company"
              width={96}
              height={96}
            />

            <p className="mt-2 text-xs uppercase tracking-[0.2em] text-[#8b7355]">
              Heritage Collection
            </p>
          </div>

          <div className="text-right">
            <h1 className="text-4xl font-bold tracking-[0.15em] text-pink-600">
              PINKGLOW GIN
            </h1>
            <p className="mt-2 text-sm">
              Old Tom Gin Company in St Andrews Ltd
            </p>
            <p className="text-sm">Established 2021</p>
          </div>
        </div>

        <section className="py-6 text-center">
          <p className="tracking-[0.35em] text-pink-700">
            DIGITAL OWNERSHIP CERTIFICATE
          </p>

          <h2 className="mt-4 text-5xl font-bold">
            Certificate of Authenticity
          </h2>

          <p className="mt-2 text-xs uppercase tracking-[0.2em] text-[#8b7355]">
            Limited Edition Digital Passport
          </p>

          <p className="mt-4 text-base">
            This document certifies the digital ownership record of the bottle
            listed below.
          </p>
        </section>

        <section className="grid grid-cols-2 gap-5 border-y-2 border-[#4a3b24] py-5">
          <div>
            <p className="text-xs uppercase text-[#8b7355]">Bottle Serial</p>
            <p className="mt-1 text-2xl font-bold">{bottle.serial}</p>
          </div>

          <div>
            <p className="text-xs uppercase text-[#8b7355]">
              Registered Owner
            </p>
            <p className="mt-1 text-2xl font-bold">{claim.owner_name}</p>
          </div>

          <div>
            <p className="text-xs uppercase text-[#8b7355]">Email</p>
            <p className="mt-1 text-base">{claim.owner_email}</p>
          </div>

          <div>
            <p className="text-xs uppercase text-[#8b7355]">Bottle Number</p>
            <p className="mt-1 text-base">
              #{bottle.bottle_number} of {bottle.total_in_series}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase text-[#8b7355]">Edition</p>
            <p className="mt-1 text-base">{bottle.edition_name}</p>
          </div>

          <div>
            <p className="text-xs uppercase text-[#8b7355]">Status</p>
            <p className="mt-1 text-base capitalize">{bottle.status}</p>
          </div>
        </section>

        <section className="mt-4">
          <p className="text-xs uppercase text-[#8b7355]">Certificate ID</p>
          <p className="mt-1 font-mono text-base">
            OTG-PINKGLOW-{bottle.serial}
          </p>
        </section>

        <section className="mt-4 text-xs leading-5 text-[#4a3b24]">
          <p>
            This certificate is generated from the Pinkglow Digital Passport
            Registry. The ownership record, bottle identity and status are
            connected to the unique QR passport assigned to this bottle.
          </p>
        </section>

        <section className="mt-4 border-t border-[#4a3b24] pt-3 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-[#8b7355]">
            Certified by
          </p>

          <p className="mt-1 text-xl font-bold">E.L.Y.A.S.-A.I.</p>

          <p className="text-[11px] text-[#6f5b3e]">
            Enhanced Living Systems through Acoustic Stimulation – Artisanal
            Intelligence
          </p>

          <p className="mt-1 text-[11px] uppercase tracking-[0.15em] text-[#8b7355]">
            Digital Traceability & Ownership Verification System
          </p>
        </section>

        <div className="mt-4 flex justify-between border-t-2 border-[#4a3b24] pt-3 text-sm">
          <div>
            <p className="font-bold">Issued by</p>
            <p>Old Tom Gin Company in St Andrews Ltd</p>
          </div>

          <div className="text-right">
            <p className="font-bold">Issued Date</p>
            <p>{new Date().toLocaleDateString()}</p>
          </div>
        </div>

        <p className="mt-3 text-center text-[11px] text-[#8b7355]">
          Ownership record verified through the E.L.Y.A.S.-A.I. Digital Passport
          Network.
        </p>
      </div>

      <div className="mx-auto mt-6 max-w-4xl print:hidden">
        <PrintCertificateButton />
      </div>
    </main>
  );
}