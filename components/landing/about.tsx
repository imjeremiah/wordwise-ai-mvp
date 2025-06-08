/*
<ai_context>
This server component provides the about section.
Explains the company's expertise and value proposition.
</ai_context>
*/

"use server"

import { Sparkles, Shield, Code2 } from "lucide-react"

export async function AboutSection() {
  console.log("[AboutSection] Rendering about section")

  return (
    <section className="from-background to-muted/30 bg-gradient-to-b py-16 md:py-24">
      <div className="container max-w-7xl">
        <div className="mx-auto mb-16 text-center">
          <h2 className="text-primary font-mono text-sm font-bold uppercase tracking-wider">
            About Us
          </h2>
          <h3 className="mx-auto mt-4 max-w-3xl text-3xl font-semibold sm:text-4xl md:text-5xl">
            Graduates of the World's Most Elite{" "}
            <span className="bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
              AI Program
            </span>
          </h3>
          <p className="text-muted-foreground mx-auto mt-6 max-w-3xl text-lg">
            While traditional developers are still coding by hand, we learned
            directly from the pioneers of AI development. Gauntlet AI accepts
            less than 1% of applicants. We made it through.
          </p>
        </div>

        <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="text-center">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-purple-100">
              <Sparkles className="size-8 text-purple-600" />
            </div>
            <h4 className="mb-2 text-lg font-semibold">
              10x Faster = 10x Cheaper
            </h4>
            <p className="text-muted-foreground text-sm">
              We code at AI speed. What takes agencies 6 months, we ship in 2
              weeks. Less time = less cost = your savings.
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-purple-100">
              <Shield className="size-8 text-purple-600" />
            </div>
            <h4 className="mb-2 text-lg font-semibold">
              Built by Builders, Not Talkers
            </h4>
            <p className="text-muted-foreground text-sm">
              Gauntlet AI graduates who've shipped to real users. We build, you
              own, SaaS companies cry.
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-purple-100">
              <Code2 className="size-8 text-purple-600" />
            </div>
            <h4 className="mb-2 text-lg font-semibold">Risk Free Guarantee</h4>
            <p className="text-muted-foreground text-sm">
              We work until you love it or it's free. No contracts, no deposits,
              no risk. Pay only when you see it working.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-4xl rounded-3xl border border-purple-100/20 bg-white/50 p-8 text-center backdrop-blur-sm md:p-12 dark:bg-gray-900/50">
          <h4 className="mb-4 text-2xl font-semibold">
            Paying monthly for software is like renting an apartment{" "}
            <span className="bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
              you'll never own
            </span>
          </h4>
          <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
            Every month you send money to Slack, Notion, Jira... and what do you
            have to show for it? Nothing. You're building their equity, not
            yours. We build you custom software that you own forever. One
            payment. No monthly fees. Ever.
          </p>
          <div className="grid grid-cols-1 gap-6 text-sm md:grid-cols-3">
            <div className="flex items-center justify-center gap-2">
              <svg
                className="size-5 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="font-medium">Own it forever</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <svg
                className="size-5 text-purple-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <span className="font-medium">Built in 2 weeks</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <svg
                className="size-5 text-purple-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span className="font-medium">Exactly what you need</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
