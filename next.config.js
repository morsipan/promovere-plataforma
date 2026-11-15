const { withPayload } = require('@payloadcms/next/withPayload');

/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: [
    'sharp',
    '@payloadcms/db-sqlite',
    '@payloadcms/db-postgres',
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      },
    ],
  },
};

module.exports = withPayload(nextConfig);
