/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_URL:
      process.env.API_URL ||
      // "http://localhost:20374" || 
      "https://apilamp.azalupka.cc" ||
      "http://srv23.mikr.us:20374" ||
      "http://192.168.0.104:20374",
  },
};

export default nextConfig;
