/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  trailingSlash: true,
  images: {
    loader: 'custom',
    loaderFile: './imageLoader.js',
  },
  // Exclude archive folder from page generation
  pageExtensions: ["js", "jsx", "mdx"],
  // Enable Turbopack
  turbopack: {},
};

module.exports = nextConfig;
