/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'pub-cb079d032bb540259b2f627128c60f40.r2.dev',
      },
    ],
  },
};

export default nextConfig;
