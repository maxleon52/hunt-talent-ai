// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// module.exports = nextConfig;

/** @type {import("next").NextConfig} */
module.exports = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
    };
    config.externals = [...config.externals, "canvas", "jsdom"];
    return config;
  },
};
