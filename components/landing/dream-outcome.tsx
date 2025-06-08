/*
<ai_context>
This server component provides the dream outcome section.
Shows the transformation from monthly fees to ownership.
</ai_context>
*/

import { ArrowRight } from "lucide-react"

export async function DreamOutcomeSection() {
  console.log("[DreamOutcomeSection] Rendering dream outcome section")

  return (
    <section className="from-background/50 to-muted/20 bg-gradient-to-b py-12 md:py-24">
      <div className="container max-w-6xl">
        <div className="mx-auto mb-12 text-center">
          <h2 className="text-primary font-mono text-sm font-bold uppercase tracking-wider">
            Dream Outcome
          </h2>
          <h3 className="mx-auto mt-4 max-w-3xl text-3xl font-semibold sm:text-4xl md:text-5xl">
            Get off the monthly{" "}
            <span className="bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
              SaaS treadmill
            </span>
          </h3>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 items-center gap-8 md:grid-cols-3">
          {/* Before */}
          <div className="text-center md:text-right">
            <div className="mb-4">
              <div className="mb-4 inline-flex size-20 items-center justify-center rounded-full bg-red-100">
                <svg
                  className="size-10 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h4 className="mb-2 text-xl font-semibold">Before</h4>
              <p className="mb-2 text-2xl font-bold text-red-600">
                $2,750/month
              </p>
              <p className="text-muted-foreground text-sm">
                Forever paying for Slack, Notion, Jira, Mixpanel, Airtable...
              </p>
            </div>
            <div className="mt-6 space-y-2">
              <div className="text-muted-foreground flex items-center justify-end gap-2 text-sm">
                <span>Never own anything</span>
                <svg
                  className="size-4 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <div className="text-muted-foreground flex items-center justify-end gap-2 text-sm">
                <span>Price increases yearly</span>
                <svg
                  className="size-4 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <div className="text-muted-foreground flex items-center justify-end gap-2 text-sm">
                <span>Generic features</span>
                <svg
                  className="size-4 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-purple-600 to-purple-400 opacity-30 blur-xl" />
              <ArrowRight className="relative z-10 size-16 text-purple-600" />
            </div>
          </div>

          {/* After */}
          <div className="text-center md:text-left">
            <div className="mb-4">
              <div className="mb-4 inline-flex size-20 items-center justify-center rounded-full bg-green-100">
                <svg
                  className="size-10 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h4 className="mb-2 text-xl font-semibold">After</h4>
              <p className="mb-2 text-2xl font-bold text-green-600">$0/month</p>
              <p className="text-muted-foreground text-sm">
                Own your custom platform forever. No monthly fees ever.
              </p>
            </div>
            <div className="mt-6 space-y-2">
              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <svg
                  className="size-4 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>100% ownership</span>
              </div>
              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <svg
                  className="size-4 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>One-time payment</span>
              </div>
              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <svg
                  className="size-4 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Built for your needs</span>
              </div>
            </div>
          </div>
        </div>

        {/* ROI Calculator */}
        <div className="mx-auto mt-16 max-w-3xl rounded-2xl border border-purple-100/20 bg-white/50 p-8 text-center backdrop-blur-sm dark:bg-gray-900/50">
          <h4 className="mb-4 text-xl font-semibold">Quick Math</h4>
          <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
            <div className="rounded-lg bg-gradient-to-br from-purple-50 to-purple-100/50 p-4 dark:from-purple-900/20 dark:to-purple-800/10">
              <p className="text-muted-foreground mb-1">Monthly SaaS costs</p>
              <p className="text-2xl font-bold text-purple-900 dark:text-purple-300">
                $2,750
              </p>
            </div>
            <div className="flex items-center justify-center">
              <svg
                className="size-6 text-purple-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <div className="rounded-lg bg-gradient-to-br from-green-50 to-green-100/50 p-4 dark:from-green-900/20 dark:to-green-800/10">
              <p className="text-muted-foreground mb-1">Months to break even</p>
              <p className="text-2xl font-bold text-green-900 dark:text-green-300">
                4-6
              </p>
            </div>
          </div>
          <p className="text-muted-foreground mt-6 text-lg">
            = <span className="font-bold text-green-600">$33,000 saved</span> in
            the first year alone
          </p>
        </div>
      </div>
    </section>
  )
}
