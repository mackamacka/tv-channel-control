/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/tv-channel-control', // Add this line
  images: {
    unoptimized: true,
  }
}

module.exports = nextConfig