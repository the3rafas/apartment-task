import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5050',
        pathname: '/**',
        search: '',
      },
    ],
  },
  env: {
    GQL_API_URL: process.env.GQL_API_URL,
  },
};

export default nextConfig;
