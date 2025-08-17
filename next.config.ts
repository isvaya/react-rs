import createNextIntlPlugin from 'next-intl/plugin';
// import { NextConfig } from 'next';

/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: './dist',
  images: {
    unoptimized: true,
  },
  experimental: {
    serverActions: {},
  },
};

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

export default withNextIntl(nextConfig);
