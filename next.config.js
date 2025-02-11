/** @type {import('next').NextConfig} */

module.exports = {
  images: {
    domains: ['utfs.io'], 
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
      },
    ],
  },
};
