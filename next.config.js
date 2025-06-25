/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    domains: ["placeholder.svg", "localhost"],
    unoptimized: true,
  },
  // 성능 최적화
  compress: true,
  poweredByHeader: false,
}

module.exports = nextConfig
