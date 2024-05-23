/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_URL: process.env.API_URL || "http://192.168.0.104:5000",
  },
};

export default nextConfig;
