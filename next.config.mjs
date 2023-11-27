/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config) => {
      config.externals = [...config.externals, 'canvas', 'jsdom'];
      return config;
    },
}

export default nextConfig
