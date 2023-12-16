/* eslint-disable */

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      use: ["@svgr/webpack"],
    });

    return config;
  },
};

module.exports = nextConfig;
