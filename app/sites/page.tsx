import Link from 'next/link';
import { allSites } from '@/lib/queries';
import Filters from './Filters';

export const dynamic = 'force-dynamic';

const pillClass = (s: string) =>
  s === 'Active' ? 'active' : s === 'Approved' ? 'approved' : s === 'Inactive' ? 'inactive' : 'pending';

export default function SitesPage({ searchParams }: { searchParams: Record<string, string> }) {
  const all = allSites();
  const { suburb = '', species = '', status = '' } = searchParams;

  const rows = all.filter(
    (r) =>
      (!suburb || r.suburb === suburb) &&
      (!species || String(r.species).includes(species)) &&
      (!status || r.status === status)
  );

  const suburbs = [...new Set(all.map((r) => r.suburb))].sort();
  const allSpecies = [...new Set(all.flatMap((r) => String(r.species).split(', ')))].sort();

  return (
    <div className="wrap">
      <h1>Release Site Database</h1>
      <p className="sub">
        Live for all release officers. No spreadsheet to download, no version to keep in step.
      </p>

      <div className="stats">
        <div className="stat"><div className="n">{all.length}</div><div className="l">Release sites</div></div>
        <div className="stat"><div className="n">{all.filter((r) => r.status === 'Active').length}</div><div className="l">Active</div></div>
        <div className="stat"><div className="n">{all.filter((r) => r.status === 'Pending review').length}</div><div className="l">Awaiting review</div></div>
        <div className="stat"><div className="n">{all.reduce((a, r) => a + r.job_count, 0)}</div><div className="l">Rehabilitation jobs</div></div>
        <div className="stat"><div className="n">{all.reduce((a, r) => a + r.hectares, 0).toFixed(0)}</div><div className="l">Hectares available</div></div>
      </div>

      <div className="card">
        <Filters suburbs={suburbs} species={allSpecies} />
        <table>
          <thead>
            <tr>
              <th>Ref</th><th>Landholder</th><th>Suburb</th><th>Ha</th>
              <th>Species accepted</th><th>Status</th><th>Jobs</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.ref}>
                <td><Link href={`/sites/${r.ref}`}><strong>{r.ref}</strong></Link></td>
                <td>{r.applicant_name}</td>
                <td>{r.suburb}</td>
                <td>{r.hectares}</td>
                <td className="note">{r.species}</td>
                <td><span className={`pill ${pillClass(r.status)}`}>{r.status}</span></td>
                <td>{r.job_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && <p className="note" style={{ padding: '18px 2px' }}>No sites match those filters.</p>}
        <p className="note" style={{ marginTop: 14 }}>
          Showing {rows.length} of {all.length} sites.
        </p>
      </div>
    </div>
  );
}
