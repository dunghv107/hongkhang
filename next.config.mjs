/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  experimental: { serverActions: { bodySizeLimit: "25mb" } },
  images: { remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com" }] },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.nhatrohongkhang.site" }],
        destination: "https://nhatrohongkhang.site/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
