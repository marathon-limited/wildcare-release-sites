'use client';
import { useRouter, useSearchParams } from 'next/navigation';

export default function Filters({ suburbs, species }: { suburbs: string[]; species: string[] }) {
  const router = useRouter();
  const sp = useSearchParams();

  const set = (k: string, v: string) => {
    const p = new URLSearchParams(sp.toString());
    v ? p.set(k, v) : p.delete(k);
    router.push('/sites?' + p.toString());
  };

  return (
    <div className="filters">
      <div className="field">
        <label>Suburb</label>
        <select value={sp.get('suburb') || ''} onChange={(e) => set('suburb', e.target.value)}>
          <option value="">All suburbs</option>
          {suburbs.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>
      <div className="field">
        <label>Species accepted</label>
        <select value={sp.get('species') || ''} onChange={(e) => set('species', e.target.value)}>
          <option value="">Any species</option>
          {species.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>
      <div className="field">
        <label>Status</label>
        <select value={sp.get('status') || ''} onChange={(e) => set('status', e.target.value)}>
          <option value="">Any status</option>
          {['Active', 'Approved', 'Pending review', 'Inactive'].map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>
      <div className="field" style={{ minWidth: 'auto' }}>
        <button className="primary" onClick={() => router.push('/sites')} type="button">Clear</button>
      </div>
    </div>
  );
}
