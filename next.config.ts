import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true, // or true depending on your URL style
  // basePath / assetPrefix if hosting under subpath
};

export default nextConfig;
