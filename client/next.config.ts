import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Add a webpack fallback for Node built-ins that some WASM/emscripten bundles
  // (like certain RDKit builds) reference. This prevents bundlers from
  // failing when `fs`, `path`, or `os` are required at build time for
  // environments that don't have those modules (browser).
  webpack: (config) => {
    config.resolve = config.resolve ?? {};
    config.resolve.fallback = {
      ...(config.resolve.fallback ?? {}),
      fs: false,
      path: false,
      os: false,
    };
    return config;
  },
};

export default nextConfig;
