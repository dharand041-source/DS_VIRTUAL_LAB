/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config, { dev }) => {
    if (dev) {
      // Disable persistent filesystem pack cache in dev to prevent Windows vendor-chunk ENOENT 404s
      config.cache = false;
    }
    return config;
  },
};

module.exports = nextConfig;
