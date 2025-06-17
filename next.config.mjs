/*
<ai_context>
Configures Next.js for the WordWise AI app with static export capability.
Static export temporarily disabled in Phase 1 due to dynamic auth routes ([[...login]], [[...signup]]).
These routes need generateStaticParams() to work with output: 'export'.
Will be fixed in Phase 2 when auth routes are properly configured.
</ai_context>
*/

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export configuration - enabled when NEXT_EXPORT=true
  ...(process.env.NEXT_EXPORT === 'true' && {
    output: 'export',
    trailingSlash: true,
    images: {
      unoptimized: true, // Required for static export
      remotePatterns: [{ hostname: "localhost" }],
    }
  }),
  // Default images configuration
  ...(!process.env.NEXT_EXPORT && {
    images: {
      remotePatterns: [{ hostname: "localhost" }],
    }
  }),
}

export default nextConfig
