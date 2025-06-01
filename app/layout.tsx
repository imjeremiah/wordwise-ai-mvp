/*
<ai_context>
This is the root layout for the app.
It includes the Toaster, PostHog tracking, and ThemeProvider.
</ai_context>
*/

import "./globals.css"

import { Inter } from "next/font/google"
import { ReactNode } from "react"

import { PostHogPageview } from "@/components/utilities/posthog/posthog-pageview"
import { PostHogUserIdentify } from "@/components/utilities/posthog/posthog-user-identity"
import { Toaster } from "@/components/ui/sonner"
import { auth } from "@/lib/firebase-auth"
import { Metadata } from "next"
import { ThemeProvider } from "next-themes"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "NextJS Firebase SaaS Template",
  description:
    "A production-ready SaaS template built with NextJS and Firebase."
}

interface RootLayoutProps {
  children: ReactNode
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const { userId } = await auth()

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
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
