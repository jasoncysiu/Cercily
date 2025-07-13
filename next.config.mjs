/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // Removed unoptimized: true to allow Next.js Image component to optimize images
    // If you add images to your app, use the `next/image` component for automatic optimization.
  },
  // Add this to make environment variables available on the server side
  serverRuntimeConfig: {
    NOTION_API_KEY: process.env.NOTION_API_KEY,
    NOTION_DATABASE_ID: process.env.NOTION_DATABASE_ID,
  },
}

export default nextConfig