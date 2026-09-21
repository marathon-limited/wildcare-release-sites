'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const SPECIES = ['possums', 'gliders', 'macropods', 'birds', 'reptiles', 'bats'];

export default function AssignPanel({ siteId, officers }: { siteId: number; officers: string[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null);
    const form = e.currentTarget;
    const body: any = Object.fromEntries(new FormData(form).entries());
    body.site_id = siteId;
    setBusy(true);
    const res = await fetch('/api/assign', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
    });
    setBusy(false);
    if (!res.ok) { setErr((await res.json()).error || 'Could not assign.'); return; }
    form.reset();
    router.refresh();
  }

  return (
    <div className="card" style={{ borderColor: '#b8dcc7', background: '#fbfdfc' }}>
      <h2 style={{ marginTop: 0 }}>Assign a rehabilitation job</h2>
      <form onSubmit={submit}>
        <div className="grid g2">
          <div className="field">
            <label>Species</label>
            <select name="species" required defaultValue="">
              <option value="" disabled>Choose…</option>
              {SPECIES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="field">
            <label>Number of animals</label>
            <input type="number" name="animal_count" min="1" defaultValue="1" />
          </div>
        </div>
        <div className="grid g2">
          <div className="field">
            <label>Release officer</label>
            <select name="officer" required defaultValue="">
              <option value="" disabled>Choose…</option>
              {officers.map((o) => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div className="field">
            <label>Target release date</label>
            <input type="date" name="target_date" />
          </div>
        </div>
        <div className="field">
          <label>Notes</label>
          <textarea name="notes" placeholder="Condition, handling requirements, anything the landholder needs to know." />
        </div>
        {err && <p className="note" style={{ color: '#8c3a3a', marginBottom: 10 }}>{err}</p>}
        <button className="primary" disabled={busy}>{busy ? 'Assigning…' : 'Assign job'}</button>
      </form>
    </div>
  );
}
