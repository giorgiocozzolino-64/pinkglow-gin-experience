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
  const validScans = scans.filter(
    (s) => s.latitude !== null && s.longitude !== null
  );

  if (validScans.length === 0) {
    return <p className="text-zinc-400">No GPS points available.</p>;
  }

  const grouped = Object.values(
    validScans.reduce((acc: any, scan: any) => {
      const key = `${scan.latitude}-${scan.longitude}`;

      if (!acc[key]) {
        acc[key] = {
          latitude: scan.latitude,
          longitude: scan.longitude,
          city: scan.city,
          region: scan.region,
          country: scan.country,
          scans: [],
        };
      }

      acc[key].scans.push(scan);
      return acc;
    }, {})
  ) as any[];

  const first = grouped[0];

  return (
    <div className="h-[520px] overflow-hidden rounded-3xl border border-pink-300/20">
      <MapContainer
        center={[first.latitude, first.longitude]}
        zoom={5}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {grouped.map((location: any) => (
          <Marker
            key={`${location.latitude}-${location.longitude}`}
            position={[location.latitude, location.longitude]}
            icon={markerIcon}
          >
            <Popup>
              <strong>
                {location.city || "Unknown city"}
              </strong>
              <br />
              {[location.region, location.country].filter(Boolean).join(", ")}
              <br />
              <br />
              <strong>{location.scans.length} scans</strong>
              <br />
              <br />

              {location.scans.slice(0, 10).map((scan: any) => (
                <div key={scan.id}>
                  {scan.serial} —{" "}
                  {new Date(scan.created_at).toLocaleString("en-GB", {
                    timeZone: "Europe/London",
                  })}
                </div>
              ))}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}