/** @type {import('next').NextConfig} */
const nextConfig = {
  // experimental.appDir 제거 (Next.js 14에서는 기본값)
  images: {
    domains: [
      'localhost',
      'images.unsplash.com',
      'via.placeholder.com'
    ],
  },
}

export default nextConfig