'use client';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import Link from 'next/link';

const colour = (s: string) =>
  s === 'Active' ? '#2f6d4f' : s === 'Approved' ? '#2b5f7e' : s === 'Inactive' ? '#8a968f' : '#b5762a';

type S = {
  ref: string; name: string; suburb: string; lat: number; lng: number;
  hectares: number; species: string; status: string; jobs: number;
};

export default function MapView({ sites }: { sites: S[] }) {
  return (
    <MapContainer center={[-27.55, 153.0]} zoom={9} scrollWheelZoom>
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {sites.map((s) => (
        <CircleMarker
          key={s.ref}
          center={[s.lat, s.lng]}
          radius={9}
          pathOptions={{ color: '#fff', weight: 2, fillColor: colour(s.status), fillOpacity: 0.92 }}
        >
          <Popup>
            <div style={{ minWidth: 200, lineHeight: 1.5 }}>
              <strong style={{ fontSize: 14 }}>{s.ref} — {s.name}</strong><br />
              {s.suburb} · {s.hectares} ha<br />
              <span style={{ color: '#5f6f68' }}>Accepts: {s.species}</span><br />
              <span style={{ color: '#5f6f68' }}>Status: {s.status} · {s.jobs} job(s)</span><br />
              <Link href={`/sites/${s.ref}`}>Open site record</Link>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
