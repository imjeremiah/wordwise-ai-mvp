/*
<ai_context>
This is the root layout for the application.
It wraps all pages and provides the basic HTML structure.
</ai_context>
*/

import "./globals.css"

import { Inter, Instrument_Sans } from "next/font/google"
import { ReactNode } from "react"

import { PostHogPageview } from "@/components/utilities/posthog/posthog-pageview"
import { PostHogUserIdentify } from "@/components/utilities/posthog/posthog-user-identity"
import { Toaster } from "@/components/ui/sonner"
import { Metadata } from "next"
import { ThemeProvider } from "next-themes"

// Configure Instrument Sans font (from cco-vibe)
const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-instrument"
})

// Keep Inter as fallback
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter"
})

export const metadata: Metadata = {
  title: "DevAgency - Build Custom Software You'll Own Forever",
  description:
    "Stop paying monthly for generic SaaS. We build exactly what you need in 2 weeks, not 6 months. 100% ownership, no monthly fees ever.",
  keywords: [
    "custom software",
    "ai development",
    "saas alternative",
    "software ownership"
  ],
  openGraph: {
    title: "DevAgency - Build Custom Software You'll Own Forever",
    description:
      "Stop paying monthly for generic SaaS. We build exactly what you need in 2 weeks.",
    type: "website",
    locale: "en_US",
    siteName: "DevAgency"
  },
  twitter: {
    card: "summary_large_image",
    title: "DevAgency - Build Custom Software You'll Own Forever",
    description:
      "Stop paying monthly for generic SaaS. We build exactly what you need in 2 weeks."
  }
}

export default async function RootLayout({
  children
}: {
  children: ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${instrumentSans.className} ${instrumentSans.variable} ${inter.variable} bg-background text-foreground overscroll-none antialiased`}
      >
        {/* SVG Background */}
        <div className="fixed inset-0 -z-20 size-full">
          <svg
            className="absolute inset-0 size-full"
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <radialGradient id="subtleBlue1" cx="25%" cy="25%">
                <stop offset="0%" stopColor="#9333EA" stopOpacity="0.06"></stop>
                <stop
                  offset="50%"
                  stopColor="#A855F7"
                  stopOpacity="0.03"
                ></stop>
                <stop offset="100%" stopColor="#7C3AED" stopOpacity="0"></stop>
              </radialGradient>
              <radialGradient id="subtleBlue2" cx="75%" cy="35%">
                <stop offset="0%" stopColor="#A855F7" stopOpacity="0.05"></stop>
                <stop
                  offset="50%"
                  stopColor="#9333EA"
                  stopOpacity="0.02"
                ></stop>
                <stop offset="100%" stopColor="#7C3AED" stopOpacity="0"></stop>
              </radialGradient>
              <radialGradient id="subtleBlue3" cx="50%" cy="75%">
                <stop offset="0%" stopColor="#C084FC" stopOpacity="0.04"></stop>
                <stop
                  offset="50%"
                  stopColor="#A855F7"
                  stopOpacity="0.02"
                ></stop>
                <stop offset="100%" stopColor="#9333EA" stopOpacity="0"></stop>
              </radialGradient>
              <filter
                id="softBlur"
                x="-50%"
                y="-50%"
                width="200%"
                height="200%"
              >
                <feGaussianBlur
                  in="SourceGraphic"
                  stdDeviation="100"
                ></feGaussianBlur>
              </filter>
            </defs>
            <rect
              width="100%"
              height="100%"
              fill="#FAFBFD"
              className="dark:fill-[#030712]"
            ></rect>
            <ellipse
              cx="50%"
              cy="-10%"
              rx="100%"
              ry="60%"
              fill="url(#subtleBlue1)"
              filter="url(#softBlur)"
            ></ellipse>
            <ellipse
              cx="20%"
              cy="50%"
              rx="80%"
              ry="60%"
              fill="url(#subtleBlue2)"
              filter="url(#softBlur)"
            ></ellipse>
            <ellipse
              cx="80%"
              cy="70%"
              rx="90%"
              ry="70%"
              fill="url(#subtleBlue3)"
              filter="url(#softBlur)"
            ></ellipse>
          </svg>
        </div>

        {/* Gradient overlay */}
        <div className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-transparent via-transparent to-[#FAFBFD]/30 dark:to-[#030712]/30"></div>

        <PostHogPageview />
        <PostHogUserIdentify />
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
