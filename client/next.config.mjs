/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_URL:
      process.env.API_URL ||
      "http://srv23.mikr.us:20374" ||
      "http://192.168.0.104:20374",
  },
};

export default nextConfig;
