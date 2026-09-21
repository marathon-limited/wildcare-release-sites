import { getDb } from './db';

export function allSites() {
  return getDb().prepare(`
    SELECT s.*, (SELECT count(*) FROM jobs j WHERE j.site_id = s.id) AS job_count
    FROM sites s ORDER BY s.suburb`).all() as any[];
}

export function siteByRef(ref: string) {
  return getDb().prepare('SELECT * FROM sites WHERE ref = ?').get(ref) as any;
}

export function jobsForSite(siteId: number) {
  return getDb().prepare('SELECT * FROM jobs WHERE site_id = ? ORDER BY target_date DESC').all(siteId) as any[];
}

export function officers() {
  return getDb().prepare('SELECT * FROM officers ORDER BY name').all() as any[];
}
