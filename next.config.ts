/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true, // Only if you're using the App Router (app/ directory)
    // Remove serverActions if not using it
  },
  images: {
    domains: ['localhost', 'your-image-domain.com'], // Add domains if you're using <Image />
  },
};

module.exports = nextConfig;
