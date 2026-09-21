import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function POST(req: Request) {
  const b = await req.json();
  if (!b.site_id || !b.species || !b.officer) {
    return NextResponse.json({ error: 'Species and release officer are both required.' }, { status: 400 });
  }
  getDb().prepare(`INSERT INTO jobs (site_id,species,animal_count,officer,target_date,notes,status,created_at)
    VALUES (?,?,?,?,?,?,?,?)`).run(
    Number(b.site_id), b.species, Number(b.animal_count) || 1, b.officer,
    b.target_date || '', b.notes || '', 'Scheduled', new Date().toISOString()
  );
  return NextResponse.json({ ok: true });
}
