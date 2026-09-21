import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dir = path.join(process.cwd(), 'data');
fs.mkdirSync(dir, { recursive: true });
const file = path.join(dir, 'wildcare.db');
for (const f of [file, file + '-wal', file + '-shm']) if (fs.existsSync(f)) fs.unlinkSync(f);

const db = new Database(file);
db.pragma('journal_mode = WAL');

db.exec(`
CREATE TABLE sites (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ref TEXT UNIQUE NOT NULL, applicant_name TEXT NOT NULL, email TEXT, phone TEXT,
  street TEXT, suburb TEXT, postcode TEXT, lat REAL, lng REAL,
  hectares REAL, habitats TEXT, species TEXT,
  fencing INTEGER, dogs INTEGER, water INTEGER,
  availability TEXT, member_no TEXT,
  status TEXT NOT NULL DEFAULT 'Pending review',
  created_at TEXT NOT NULL
);
CREATE TABLE officers (
  id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, region TEXT
);
CREATE TABLE jobs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  site_id INTEGER NOT NULL REFERENCES sites(id),
  species TEXT NOT NULL, animal_count INTEGER NOT NULL,
  officer TEXT NOT NULL, target_date TEXT, notes TEXT,
  status TEXT NOT NULL DEFAULT 'Scheduled', created_at TEXT NOT NULL
);
`);

const LOC = [
  ['Samford Valley',-27.3700,152.8800,'4520'], ['Dayboro',-27.1970,152.8230,'4521'],
  ['Mount Nebo',-27.3970,152.7830,'4520'],     ['Upper Brookfield',-27.4830,152.8670,'4069'],
  ['Pullenvale',-27.5200,152.8830,'4069'],     ['Karana Downs',-27.5400,152.8000,'4306'],
  ['Mount Glorious',-27.3330,152.7670,'4520'], ['Cedar Creek',-27.3200,152.9200,'4520'],
  ['Wamuran',-27.0330,152.8670,'4512'],        ['Beerburrum',-26.9600,152.9600,'4517'],
  ['Maleny',-26.7580,152.8500,'4552'],         ['Conondale',-26.7330,152.7000,'4552'],
  ['Jimboomba',-27.8330,153.0330,'4280'],      ['Canungra',-28.0200,153.1670,'4275'],
  ['Tamborine',-27.9400,153.1200,'4270'],      ['Beechmont',-28.1330,153.1930,'4211'],
  ['Springbrook',-28.1970,153.2750,'4213'],    ['Numinbah Valley',-28.1670,153.2170,'4211'],
  ['Ormeau',-27.7700,153.2500,'4208'],         ['Cornubia',-27.6470,153.1800,'4130'],
  ['Redland Bay',-27.6100,153.3000,'4165'],    ['Thornlands',-27.5600,153.2700,'4164'],
  ['Burbank',-27.5670,153.1330,'4156'],        ['Chandler',-27.5200,153.1500,'4155'],
];
const NAMES = ['Margaret Hollis','Trevor Nguyen','Alison Pethick','Bruce Tanner','Jodie Marchetti',
 'Keith Abernethy','Fiona Cadwallader','Raymond Oyelaran','Prue Stanwix','Darren Kuipers',
 'Helen Broadfoot','Sam Ridgway','Yvonne Castellano','Neil Harrowsmith','Bev Tanaka',
 'Gordon Pethybridge','Lucia Fenwick','Ian Corrigan','Denise Vukovic','Paul Hardgrave',
 'Marion Elliffe','Wesley Tuffnell','Carol Brightwell','Dougal McIlwraith'];
const STREETS = ['Ridge Track','Gully Road','Wattle Lane','Ironbark Drive','Bunya Close',
 'Creek Bend Road','Blackbutt Court','Lomandra Way','Silky Oak Road','Casuarina Rise',
 'Kurrajong Place','Melaleuca Drive','Grasstree Lane','Coachwood Road','Banksia Track',
 'Tallowwood Close','Brush Box Road','Fig Tree Lane','Hoop Pine Drive','Native Bee Court',
 'Stringybark Road','Rosewood Place','Paperbark Way','Sassafras Road'];
const COASTAL = new Set(['Redland Bay','Thornlands','Ormeau','Cornubia','Chandler','Burbank']);
const RANGES  = new Set(['Mount Glorious','Mount Nebo','Maleny','Conondale','Springbrook',
  'Beechmont','Numinbah Valley','Canungra','Tamborine','Cedar Creek','Samford Valley']);
const habitatsFor = (suburb) => {
  const pool = ['bushland','open grassland','wetland'];
  if (COASTAL.has(suburb)) pool.push('coastal');
  if (RANGES.has(suburb)) pool.push('rainforest');
  return pool;
};
const SPP = ['possums','gliders','macropods','birds','reptiles','bats'];
const STATUS = ['Active','Active','Active','Active','Active','Active','Active','Active','Active','Active',
 'Approved','Approved','Approved','Approved','Approved','Approved','Approved',
 'Pending review','Pending review','Pending review','Pending review','Pending review','Inactive','Inactive'];

let s = 7;
const rnd = () => { s = (s * 1103515245 + 12345) % 2147483648; return s / 2147483648; };
const pick = (a) => a[Math.floor(rnd() * a.length)];
const pickN = (a, n) => { const c=[...a]; const o=[]; for(let i=0;i<n && c.length;i++) o.push(c.splice(Math.floor(rnd()*c.length),1)[0]); return o.sort(); };

const insSite = db.prepare(`INSERT INTO sites
 (ref,applicant_name,email,phone,street,suburb,postcode,lat,lng,hectares,habitats,species,
  fencing,dogs,water,availability,member_no,status,created_at)
 VALUES (@ref,@applicant_name,@email,@phone,@street,@suburb,@postcode,@lat,@lng,@hectares,@habitats,@species,
  @fencing,@dogs,@water,@availability,@member_no,@status,@created_at)`);

const AVAIL = ['Weekends only, happy to take overflow at short notice.',
 'Available year round. Prefer at least two days notice.',
 'Not available during calving season, otherwise flexible.',
 'Retired, home most days. Can collect if needed.',
 'School holidays are difficult, otherwise fine.',
 'Happy to take long-term rehabilitation cases.',
 'Can host soft release enclosures on the eastern boundary.',
 'Away through July. Available the rest of the year.'];

for (let i = 0; i < 24; i++) {
  const [suburb, lat, lng, pc] = LOC[i];
  const name = NAMES[i];
  insSite.run({
    ref: 'RS-' + String(1041 + i * 3),
    applicant_name: name,
    // example.com is reserved by RFC 2606 and can never belong to a real person.
    email: name.toLowerCase().replace(/[^a-z]+/g, '.') + '@example.com',
    // 0491 570 xxx is the ACMA range reserved for fiction, so these dial nowhere.
    phone: '0491 570 ' + String(100 + i),
    street: String(Math.floor(rnd() * 480) + 12) + ' ' + STREETS[i],
    suburb, postcode: pc,
    lat: +(lat + (rnd() - 0.5) * 0.035).toFixed(5),
    lng: +(lng + (rnd() - 0.5) * 0.035).toFixed(5),
    hectares: +(0.4 + rnd() * 44.6).toFixed(1),
    habitats: pickN(habitatsFor(suburb), 1 + Math.floor(rnd() * 2)).join(', '),
    species: pickN(SPP, 1 + Math.floor(rnd() * 4)).join(', '),
    fencing: rnd() > 0.35 ? 1 : 0,
    dogs: rnd() > 0.7 ? 1 : 0,
    water: rnd() > 0.25 ? 1 : 0,
    availability: pick(AVAIL),
    member_no: rnd() > 0.4 ? 'WC' + String(Math.floor(rnd() * 8000) + 1200) : '',
    status: STATUS[i],
    created_at: new Date(Date.now() - Math.floor(rnd() * 600) * 86400000).toISOString(),
  });
}

const OFFICERS = [['Robyn Askew','Moreton Bay'],['Dennis Polkinghorne','Somerset'],
 ['Kath Merriman','Sunshine Coast'],['Greg Vandeleur','Scenic Rim'],['Ngaire Paterson','Redlands'],
 ['Colin Dunwoody','Logan'],['Sharon Beaumont','Gold Coast Hinterland'],['Malcolm Treharne','Brisbane West'],
 ['Julie Ashgrove','Pine Rivers'],['Barry Cottesloe','Lockyer Valley']];
const insOff = db.prepare('INSERT INTO officers (name,region) VALUES (?,?)');
for (const [n, r] of OFFICERS) insOff.run(n, r);

const insJob = db.prepare(`INSERT INTO jobs (site_id,species,animal_count,officer,target_date,notes,status,created_at)
 VALUES (?,?,?,?,?,?,?,?)`);
const JOBNOTES = ['Hand raised, needs soft release enclosure for two weeks.',
 'Two juveniles from the same litter, release together.',
 'Wing fracture healed, flight tested and cleared.',
 'Orphaned joey, out of pouch, feeding independently.',
 'Relocated from a development site at Coomera.',
 'Cleared by vet 12 days ago. Ready to go.',
 'Needs a property with permanent water.',
 'Second attempt, first site had dog pressure.'];
const JOBSTATUS = ['Scheduled','Scheduled','Scheduled','In progress','In progress','Completed','Completed'];
const accepts = db.prepare('SELECT id, species FROM sites WHERE status IN (?,?)').all('Active','Approved')
  .map((r) => ({ id: r.id, spp: String(r.species).split(', ') }));
for (let i = 0; i < 15; i++) {
  const site = pick(accepts);
  const siteId = site.id;
  insJob.run(siteId, pick(site.spp), 1 + Math.floor(rnd() * 4), pick(OFFICERS)[0],
    new Date(Date.now() + Math.floor((rnd() - 0.3) * 60) * 86400000).toISOString().slice(0, 10),
    pick(JOBNOTES), pick(JOBSTATUS), new Date(Date.now() - Math.floor(rnd() * 40) * 86400000).toISOString());
}

for (const t of ['sites', 'officers', 'jobs'])
  console.log(t, db.prepare(`SELECT count(*) c FROM ${t}`).get().c);
db.close();
