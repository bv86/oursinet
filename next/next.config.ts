import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  images: {
    domains: ['s3.oursi.net'],
  },
  outputFileTracingRoot: path.join(__dirname, '../'),
};

export default nextConfig;
