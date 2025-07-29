/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cho phép kết nối đến localhost với HTTPS
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://localhost:7029/:path*',
      },
    ];
  },
  
  // Cấu hình cho development
  ...(process.env.NODE_ENV === 'development' && {
    experimental: {
      serverComponentsExternalPackages: ['axios'],
    },
  }),
  
  // Tắt chỉ báo phát triển
  devIndicators: {
    buildActivity: false,
    buildActivityPosition: 'bottom-right',
    autoPrerender: false,
    buildError: false,
    routeIndicator: false,
  },
};

module.exports = nextConfig;
