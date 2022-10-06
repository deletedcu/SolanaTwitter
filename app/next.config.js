/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    domains: ["avatars.dicebear.com"],
    unoptimized: true,
  },
};

module.exports = nextConfig;
