/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  experimental: { serverActions: { bodySizeLimit: "25mb" } },
  images: { remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com" }] },
};

export default nextConfig;
