import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Next 16 requires every quality used by next/image to be allowlisted.
  // Our preview screenshots use 82 (sharper JPEG sweet spot), and BorderBeam-
  // wrapped product cards use 85. Explicit list avoids dev warnings.
  images: {
    qualities: [75, 82, 85],
  },
};

export default nextConfig;
