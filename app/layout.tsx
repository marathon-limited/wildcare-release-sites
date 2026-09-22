import './globals.css';
import Link from 'next/link';

export const metadata = { title: 'Wildcare · Release Site Database' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-AU">
      <head>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      </head>
      <body>
        <nav className="top">
          <div className="brand">Wildcare <span>· Release Site Database</span></div>
          <Link href="/sites">Release sites</Link>
          <Link href="/map">Map</Link>
          <Link href="/apply">New application</Link>
        </nav>
        {children}
      </body>
    </html>
  );
}
