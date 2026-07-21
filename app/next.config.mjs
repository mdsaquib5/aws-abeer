const nextConfig = {
  output: 'standalone',
  reactCompiler: true,
  experimental: {
    optimizeCss: true,
  },
  images: {
    deviceSizes: [480, 576, 768, 992, 1200, 1440, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-cb079d032bb540259b2f627128c60f40.r2.dev',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
