/** @type {import('next').NextConfig} */
export default {
  webpack: (config) => {
    config.externals = [...(config.externals || []), 'better-sqlite3'];
    return config;
  },
};
