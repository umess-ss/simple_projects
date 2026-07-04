/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: __dirname,
  },
  async rewrites() {
    return [
      {
        source: "/projects/:id",
        destination: "/projects/:id/index.html",
      },
      {
        source: "/projects/:id/",
        destination: "/projects/:id/index.html",
      },
    ];
  },
};

module.exports = nextConfig;