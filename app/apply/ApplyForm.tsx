'use client';
import { useState } from 'react';
import Link from 'next/link';

const HABITATS = ['bushland', 'wetland', 'open grassland', 'rainforest', 'coastal'];
const SPECIES = ['possums', 'gliders', 'macropods', 'birds', 'reptiles', 'bats'];

export default function ApplyForm() {
  const [habitats, setHabitats] = useState<string[]>([]);
  const [species, setSpecies] = useState<string[]>([]);
  const [done, setDone] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const toggle = (list: string[], set: (v: string[]) => void, v: string) =>
    set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null);
    const fd = new FormData(e.currentTarget);
    const body: Record<string, any> = Object.fromEntries(fd.entries());
    body.habitats = habitats.join(', ');
    body.species = species.join(', ');

    if (!species.length) { setErr('Please choose at least one species you can accept.'); return; }
    if (!habitats.length) { setErr('Please choose at least one habitat type.'); return; }

    setBusy(true);
    const res = await fetch('/api/apply', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
    });
    setBusy(false);
    const json = await res.json();
    if (!res.ok) { setErr(json.error || 'Something went wrong.'); return; }
    setDone(json.ref);
  }

  if (done)
    return (
      <div className="card">
        <div className="banner">
          <strong>Application received.</strong> Your reference is <strong>{done}</strong>.
        </div>
        <p className="note">
          A release officer will review the property and be in touch. The record is already in the
          database and on the map — nothing needs to be typed up.
        </p>
        <p style={{ marginTop: 16 }}>
          <Link href={`/sites/${done}`}>View the site record</Link> · <Link href="/map">See it on the map</Link>
        </p>
      </div>
    );

  return (
    <form onSubmit={submit}>
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Your details</h2>
        <div className="grid g2">
          <div className="field"><label>Full name *</label><input type="text" name="applicant_name" required /></div>
          <div className="field"><label>Wildcare member number (if you have one)</label><input type="text" name="member_no" placeholder="e.g. WC4821" /></div>
        </div>
        <div className="grid g2">
          <div className="field"><label>Email *</label><input type="email" name="email" required /></div>
          <div className="field"><label>Phone *</label><input type="tel" name="phone" required /></div>
        </div>
      </div>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>The property</h2>
        <div className="field"><label>Street address *</label><input type="text" name="street" required /></div>
        <div className="grid g3">
          <div className="field"><label>Suburb *</label><input type="text" name="suburb" required /></div>
          <div className="field"><label>Postcode *</label><input type="text" name="postcode" required /></div>
          <div className="field"><label>Size in hectares *</label><input type="number" name="hectares" step="0.1" min="0.1" required /></div>
        </div>

        <div className="field">
          <label>Habitat types on the property *</label>
          <div className="chips">
            {HABITATS.map((h) => (
              <span key={h} className={'chip' + (habitats.includes(h) ? ' on' : '')}
                onClick={() => toggle(habitats, setHabitats, h)}>{h}</span>
            ))}
          </div>
        </div>

        <div className="grid g3">
          <div className="field"><label>Stock-proof fencing?</label>
            <div className="radios"><label><input type="radio" name="fencing" value="1" defaultChecked /> Yes</label><label><input type="radio" name="fencing" value="0" /> No</label></div>
          </div>
          <div className="field"><label>Dogs on the property?</label>
            <div className="radios"><label><input type="radio" name="dogs" value="1" /> Yes</label><label><input type="radio" name="dogs" value="0" defaultChecked /> No</label></div>
          </div>
          <div className="field"><label>Permanent water on site?</label>
            <div className="radios"><label><input type="radio" name="water" value="1" defaultChecked /> Yes</label><label><input type="radio" name="water" value="0" /> No</label></div>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>What you can take</h2>
        <div className="field">
          <label>Species you can accept *</label>
          <div className="chips">
            {SPECIES.map((s) => (
              <span key={s} className={'chip' + (species.includes(s) ? ' on' : '')}
                onClick={() => toggle(species, setSpecies, s)}>{s}</span>
            ))}
          </div>
        </div>
        <div className="field">
          <label>Availability notes</label>
          <textarea name="availability" placeholder="Anything the release officers should know about when you are and are not available." />
        </div>
      </div>

      {err && <div className="card" style={{ borderColor: '#d8a5a5', background: '#fdf3f3', color: '#8c3a3a' }}>{err}</div>}

      <button className="primary" disabled={busy}>{busy ? 'Submitting…' : 'Submit application'}</button>
      <p className="note" style={{ marginTop: 12 }}>
        Submitting writes straight to the Release Site Database and places the property on the map.
      </p>
    </form>
  );
}
