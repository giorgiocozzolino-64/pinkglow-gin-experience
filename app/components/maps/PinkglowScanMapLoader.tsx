"use client";

import dynamic from "next/dynamic";

const PinkglowScanMap = dynamic(
  () => import("./PinkglowScanMap"),
  {
    ssr: false,
  }
);

export default function PinkglowScanMapLoader({
  scans,
}: {
  scans: any[];
}) {
  return <PinkglowScanMap scans={scans} />;
}