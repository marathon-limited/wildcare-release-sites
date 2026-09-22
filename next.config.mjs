/** @type {import('next').NextConfig} */
export default {
  // '/' is handled here rather than with redirect() in app/page.tsx. A redirect()
  // inside a statically prerendered page is emitted as a 307 with no Location
  // header, which leaves a visitor stranded on the root URL.
  async redirects() {
    return [{ source: '/', destination: '/sites', permanent: false }];
  },
  webpack: (config) => {
    config.externals = [...(config.externals || []), 'better-sqlite3'];
    return config;
  },
};
