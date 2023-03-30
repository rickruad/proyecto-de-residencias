/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'telegra.ph',
        port: '',
        pathname: '/file/**',
      }
    ]
  }
}

module.exports = nextConfig
