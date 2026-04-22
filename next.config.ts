import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Opt out of Turbopack for build (using webpack config for db file ignoring)
  turbopack: {},
  webpack: (config) => {
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/*.db', '**/*.db-journal', '**/*.db-wal', '**/*.db-shm', '**/tsc_output*.txt'],
    }
    return config
  },
};

export default nextConfig;
