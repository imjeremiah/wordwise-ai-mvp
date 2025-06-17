/*
<ai_context>
Configures Next.js for the WordWise AI app with static export capability.
Static export temporarily disabled in Phase 1 due to dynamic auth routes.
</ai_context>
*/

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ hostname: "localhost" }],
    // Uncomment below when static export is enabled
    // unoptimized: true // Required for static export
  },
  // TODO: Re-enable static export in Phase 2 after proper route configuration
  // output: 'export', // Enable static export
  // trailingSlash: true, // Required for static export
  // basePath: process.env.NODE_ENV === 'production' ? '/wordwise-ai' : '',
  // assetPrefix: process.env.NODE_ENV === 'production' ? '/wordwise-ai' : '',
}

export default nextConfig
