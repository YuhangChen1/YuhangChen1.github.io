import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // Emit folder/index.html so /blog/ and /blog/<slug>/ resolve on GitHub Pages.
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
