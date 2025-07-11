/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  output: 'export',      // <-- add this line for static export
  trailingSlash: true,   // <-- add this line for GitHub Pages routing
}

export default nextConfig
