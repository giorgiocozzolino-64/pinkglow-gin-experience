"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function PinkglowScanMap({ scans }: { scans: any[] }) {
  const validScans = scans.filter((s) => s.latitude && s.longitude);

  if (validScans.length === 0) {
    return <p className="text-zinc-400">No GPS points available.</p>;
  }

  const first = validScans[0];

  return (
    <div className="h-[520px] overflow-hidden rounded-3xl border border-pink-300/20">
      <MapContainer
        center={[first.latitude, first.longitude]}
        zoom={8}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {validScans.map((scan) => (
          <Marker
            key={scan.id}
            position={[scan.latitude, scan.longitude]}
            icon={markerIcon}
          >
            <Popup>
              <strong>{scan.serial}</strong>
              <br />
              {[scan.city, scan.region, scan.country].filter(Boolean).join(", ")}
              <br />
              {new Date(scan.created_at).toLocaleString("en-GB", {
                timeZone: "Europe/London",
              })}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}