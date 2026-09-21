import Database from 'better-sqlite3';
import path from 'path';

let db: Database.Database;

export function getDb() {
  if (!db) {
    db = new Database(path.join(process.cwd(), 'data', 'wildcare.db'));
    db.pragma('journal_mode = WAL');
  }
  return db;
}

export type Site = {
  id: number; ref: string; applicant_name: string; email: string; phone: string;
  street: string; suburb: string; postcode: string; lat: number; lng: number;
  hectares: number; habitats: string; species: string;
  fencing: number; dogs: number; water: number;
  availability: string; member_no: string; status: string; created_at: string;
};

export type Job = {
  id: number; site_id: number; species: string; animal_count: number;
  officer: string; target_date: string; notes: string; status: string; created_at: string;
};
