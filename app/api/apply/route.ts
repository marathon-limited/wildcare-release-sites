import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

// Approximate centroids so a new application lands in roughly the right place on the
// map without an external geocoding call. A real build geocodes the address properly.
const SUBURB_COORDS: Record<string, [number, number]> = {
  'samford valley': [-27.37, 152.88], dayboro: [-27.197, 152.823], 'mount nebo': [-27.397, 152.783],
  'upper brookfield': [-27.483, 152.867], pullenvale: [-27.52, 152.883], 'karana downs': [-27.54, 152.8],
  'mount glorious': [-27.333, 152.767], 'cedar creek': [-27.32, 152.92], wamuran: [-27.033, 152.867],
  beerburrum: [-26.96, 152.96], maleny: [-26.758, 152.85], conondale: [-26.733, 152.7],
  jimboomba: [-27.833, 153.033], canungra: [-28.02, 153.167], tamborine: [-27.94, 153.12],
  beechmont: [-28.133, 153.193], springbrook: [-28.197, 153.275], 'numinbah valley': [-28.167, 153.217],
  ormeau: [-27.77, 153.25], cornubia: [-27.647, 153.18], 'redland bay': [-27.61, 153.3],
  thornlands: [-27.56, 153.27], burbank: [-27.567, 153.133], chandler: [-27.52, 153.15],
};

export async function POST(req: Request) {
  const b = await req.json();

  for (const f of ['applicant_name', 'email', 'phone', 'street', 'suburb', 'postcode', 'hectares']) {
    if (!String(b[f] ?? '').trim()) {
      return NextResponse.json({ error: `Missing required field: ${f}` }, { status: 400 });
    }
  }

  const db = getDb();
  const last = db.prepare("SELECT ref FROM sites ORDER BY id DESC LIMIT 1").get() as any;
  const next = last ? parseInt(String(last.ref).replace('RS-', ''), 10) + 3 : 1041;
  const ref = 'RS-' + next;

  const key = String(b.suburb).trim().toLowerCase();
  const base = SUBURB_COORDS[key] ?? [-27.55, 153.0];
  const jitter = () => (Math.random() - 0.5) * 0.02;

  db.prepare(`INSERT INTO sites
    (ref,applicant_name,email,phone,street,suburb,postcode,lat,lng,hectares,habitats,species,
     fencing,dogs,water,availability,member_no,status,created_at)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).run(
    ref, b.applicant_name, b.email, b.phone, b.street, b.suburb, b.postcode,
    +(base[0] + jitter()).toFixed(5), +(base[1] + jitter()).toFixed(5),
    Number(b.hectares), b.habitats || '', b.species || '',
    Number(b.fencing ?? 0), Number(b.dogs ?? 0), Number(b.water ?? 0),
    b.availability || '', b.member_no || '', 'Pending review', new Date().toISOString()
  );

  return NextResponse.json({ ref });
}
