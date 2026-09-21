import { allSites } from '@/lib/queries';
import MapView from './MapView';

export const dynamic = 'force-dynamic';

export default function MapPage() {
  const sites = allSites().map((s) => ({
    ref: s.ref, name: s.applicant_name, suburb: s.suburb, lat: s.lat, lng: s.lng,
    hectares: s.hectares, species: s.species, status: s.status, jobs: s.job_count,
  }));

  return (
    <div className="wrap">
      <h1>Release site map</h1>
      <p className="sub">
        Drawn from the same records as the database. Nothing is copied across by hand.
      </p>
      <MapView sites={sites} />
      <div className="legend">
        <span><i className="dot" style={{ background: '#2f6d4f' }} />Active</span>
        <span><i className="dot" style={{ background: '#2b5f7e' }} />Approved</span>
        <span><i className="dot" style={{ background: '#b5762a' }} />Pending review</span>
        <span><i className="dot" style={{ background: '#8a968f' }} />Inactive</span>
        <span style={{ marginLeft: 'auto' }}>{sites.length} sites plotted</span>
      </div>
    </div>
  );
}
