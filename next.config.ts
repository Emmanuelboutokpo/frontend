import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "cf.bstatic.com" },
      { protocol: "https", hostname: "i.pravatar.cc" },
      { protocol: "https", hostname: "tile.openstreetmap.org" },
      { protocol: "https", hostname: "*.tile.openstreetmap.org" },
    ],
  },
};

export default nextConfig;
