/*
<ai_context>
This is the root layout for the app.
It includes the Toaster, PostHog tracking, ThemeProvider, and beautiful gradient background.
</ai_context>
*/

import "./globals.css"

import { Inter } from "next/font/google"
import localFont from "next/font/local"
import { ReactNode } from "react"

import { PostHogPageview } from "@/components/utilities/posthog/posthog-pageview"
import { PostHogUserIdentify } from "@/components/utilities/posthog/posthog-user-identity"
import { Toaster } from "@/components/ui/sonner"
import { auth } from "@/lib/firebase-auth"
import { Metadata } from "next"
import { ThemeProvider } from "next-themes"

// Load fonts
const geistSans = localFont({
  src: [
    {
      path: "../public/fonts/GeistVF.woff",
      weight: "100 900"
    }
  ],
  variable: "--font-geist-sans",
  display: "swap"
})

const instrumentSans = localFont({
  src: "../public/fonts/InstrumentSans-Regular.ttf",
  variable: "--font-instrument-sans",
  display: "swap"
})

// Fallback to Inter if custom fonts fail
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
})

export const metadata: Metadata = {
  title: "CCO Vibe - Build Custom Apps 10x Faster",
  description:
    "Custom AI-powered software development. Build internal tools, MVPs, and automation in 2 weeks instead of 4 months. 100% satisfaction guaranteed.",
  keywords: [
    "custom software development",
    "AI development",
    "MVP development",
    "internal tools",
    "automation",
    "SaaS replacement"
  ],
  authors: [{ name: "CCO Vibe Team" }],
  creator: "CCO Vibe",
  robots: "index, follow",
  openGraph: {
    title: "CCO Vibe - Build Custom Apps 10x Faster",
    description:
      "Replace expensive SaaS with custom solutions. We build in 2 weeks what others deliver in 4 months. 100% satisfaction guaranteed.",
    url: "https://ccovibe.com",
    siteName: "CCO Vibe",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CCO Vibe - Custom Software Development"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    creator: "@ccovibe",
    title: "CCO Vibe - Build Custom Apps 10x Faster",
    description:
      "Replace expensive SaaS with custom solutions. We build in 2 weeks what others deliver in 4 months.",
    images: ["/og-image.png"]
  },
  category: "technology"
}

interface RootLayoutProps {
  children: ReactNode
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const { userId } = await auth()

  return (
    <html
      lang="en"
      className={`${instrumentSans.variable} ${geistSans.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <body
        className={`${geistSans.className} bg-background text-foreground overscroll-none antialiased`}
      >
        {/* Beautiful gradient background */}
        <div className="fixed inset-0 -z-20 size-full">
          <svg
            className="absolute inset-0 size-full"
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <radialGradient id="subtleBlue1" cx="25%" cy="25%">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.06" />
                <stop offset="50%" stopColor="#2563EB" stopOpacity="0.03" />
                <stop offset="100%" stopColor="#1E40AF" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="subtleBlue2" cx="75%" cy="35%">
                <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.05" />
                <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.02" />
                <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="subtleBlue3" cx="50%" cy="75%">
                <stop offset="0%" stopColor="#93C5FD" stopOpacity="0.04" />
                <stop offset="50%" stopColor="#60A5FA" stopOpacity="0.02" />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
              </radialGradient>
              <filter
                id="softBlur"
                x="-50%"
                y="-50%"
                width="200%"
                height="200%"
              >
                <feGaussianBlur in="SourceGraphic" stdDeviation="100" />
              </filter>
            </defs>
            <rect
              width="100%"
              height="100%"
              fill="#FAFBFD"
              className="dark:fill-[#030712]"
            />
            <ellipse
              cx="50%"
              cy="-10%"
              rx="100%"
              ry="60%"
              fill="url(#subtleBlue1)"
              filter="url(#softBlur)"
            />
            <ellipse
              cx="20%"
              cy="50%"
              rx="80%"
              ry="60%"
              fill="url(#subtleBlue2)"
              filter="url(#softBlur)"
            />
            <ellipse
              cx="80%"
              cy="70%"
              rx="90%"
              ry="70%"
              fill="url(#subtleBlue3)"
              filter="url(#softBlur)"
            />
          </svg>
        </div>

        {/* Gradient overlay */}
        <div className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-transparent via-transparent to-[#FAFBFD]/30 dark:to-[#030712]/30" />

        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster />
          <PostHogPageview />
          <PostHogUserIdentify />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
