import Link from 'next/link';
import { notFound } from 'next/navigation';
import { siteByRef, jobsForSite, officers } from '@/lib/queries';
import AssignPanel from './AssignPanel';

export const dynamic = 'force-dynamic';

const jobPill = (s: string) =>
  s === 'Completed' ? 'completed' : s === 'In progress' ? 'progress' : 'scheduled';
const sitePill = (s: string) =>
  s === 'Active' ? 'active' : s === 'Approved' ? 'approved' : s === 'Inactive' ? 'inactive' : 'pending';
const yn = (v: number) => (v ? 'Yes' : 'No');

export default function SiteDetail({ params }: { params: { ref: string } }) {
  const site = siteByRef(params.ref);
  if (!site) notFound();
  const jobs = jobsForSite(site.id);
  const offs = officers();

  return (
    <div className="wrap">
      <p className="note" style={{ marginBottom: 8 }}><Link href="/sites">← Release Site Database</Link></p>
      <h1>{site.ref} — {site.applicant_name}</h1>
      <p className="sub">
        {site.street}, {site.suburb} {site.postcode} ·{' '}
        <span className={`pill ${sitePill(site.status)}`}>{site.status}</span>
      </p>

      <div className="grid g2" style={{ alignItems: 'start' }}>
        <div>
          <div className="card">
            <h2 style={{ marginTop: 0 }}>Property</h2>
            <dl className="kv">
              <dt>Size</dt><dd>{site.hectares} hectares</dd>
              <dt>Habitat</dt><dd>{site.habitats}</dd>
              <dt>Species accepted</dt><dd>{site.species}</dd>
              <dt>Stock-proof fencing</dt><dd>{yn(site.fencing)}</dd>
              <dt>Dogs on property</dt><dd>{yn(site.dogs)}</dd>
              <dt>Permanent water</dt><dd>{yn(site.water)}</dd>
              <dt>Coordinates</dt><dd>{site.lat}, {site.lng}</dd>
            </dl>
          </div>

          <div className="card">
            <h2 style={{ marginTop: 0 }}>Landholder</h2>
            <dl className="kv">
              <dt>Email</dt><dd>{site.email}</dd>
              <dt>Phone</dt><dd>{site.phone}</dd>
              <dt>Member number</dt><dd>{site.member_no || '—'}</dd>
              <dt>Applied</dt><dd>{new Date(site.created_at).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}</dd>
            </dl>
            {site.availability && (
              <p className="note" style={{ marginTop: 14 }}><strong>Availability:</strong> {site.availability}</p>
            )}
          </div>
        </div>

        <div>
          <AssignPanel siteId={site.id} officers={offs.map((o) => o.name)} />

          <div className="card">
            <h2 style={{ marginTop: 0 }}>Rehabilitation jobs at this property</h2>
            {jobs.length === 0 && <p className="note">No jobs assigned yet.</p>}
            {jobs.length > 0 && (
              <table>
                <thead>
                  <tr><th>Species</th><th>No.</th><th>Officer</th><th>Target</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {jobs.map((j) => (
                    <tr key={j.id}>
                      <td>{j.species}</td>
                      <td>{j.animal_count}</td>
                      <td>{j.officer}</td>
                      <td>{j.target_date || '—'}</td>
                      <td><span className={`pill ${jobPill(j.status)}`}>{j.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
