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
        hostname: 'heihei-bucket.syd1.digitaloceanspaces.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'heihei-bucket.syd1.digitaloceanspaces.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig
