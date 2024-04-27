/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_BACKEND_URL: process.env.API_BACKEND_URL,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        port: '',
        pathname: '/heihei-arcade-storage/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'heihei-game-content.s3.ap-southeast-2.amazonaws.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig
