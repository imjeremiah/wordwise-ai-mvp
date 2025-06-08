/*
<ai_context>
This server component provides the pricing section.
Shows pricing options with purple-centric design.
</ai_context>
*/

"use server"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Check, Sparkles, ArrowRight } from "lucide-react"
import Link from "next/link"

interface PricingTier {
  name: string
  description: string
  price: string
  originalPrice?: string
  period?: string
  features: string[]
  highlighted?: boolean
  ctaText: string
  ctaLink: string
  badge?: string
}

const pricingTiers: PricingTier[] = [
  {
    name: "Discovery Call",
    description: "Let's explore if we're a good fit",
    price: "Free",
    features: [
      "30-minute strategy call",
      "Review your current tech stack",
      "Identify cost-saving opportunities",
      "Get a custom project roadmap",
      "No obligation to proceed"
    ],
    ctaText: "Book Discovery Call",
    ctaLink: "#consultation-form"
  },
  {
    name: "Custom Software",
    description: "Replace your SaaS subscriptions forever",
    price: "$8,900",
    originalPrice: "$15,000",
    features: [
      "Complete custom platform",
      "100% source code ownership",
      "Built in 2 weeks flat",
      "6 months of free support",
      "Unlimited revisions until perfect",
      "AI-powered features included",
      "No monthly fees ever"
    ],
    highlighted: true,
    ctaText: "Start Building",
    ctaLink: "#consultation-form",
    badge: "Most Popular"
  },
  {
    name: "Enterprise",
    description: "For complex, multi-system projects",
    price: "Custom",
    features: [
      "Everything in Custom Software",
      "Multiple integrated systems",
      "Dedicated project team",
      "Priority development queue",
      "Extended 12-month support",
      "Custom AI model training",
      "White-glove onboarding"
    ],
    ctaText: "Contact Sales",
    ctaLink: "#consultation-form"
  }
]

export async function PricingSection() {
  console.log("[PricingSection] Rendering pricing section")

  return (
    <section className="from-background to-muted/30 bg-gradient-to-b py-12 md:py-24">
      <div className="container max-w-7xl">
        <div className="mx-auto mb-16 text-center">
          <h2 className="text-primary font-mono text-sm font-bold uppercase tracking-wider">
            Pricing
          </h2>
          <h3 className="mx-auto mt-4 max-w-3xl text-3xl font-semibold sm:text-4xl md:text-5xl">
            Stop renting.{" "}
            <span className="bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
              Start owning
            </span>
          </h3>
          <p className="text-muted-foreground mx-auto mt-6 max-w-3xl text-lg">
            One payment. Own it forever. Save thousands every month.
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
          {pricingTiers.map((tier, index) => (
            <div
              key={tier.name}
              className={`relative ${tier.highlighted ? "z-10 scale-105" : ""}`}
            >
              {tier.badge && (
                <div className="absolute -top-4 left-1/2 z-20 -translate-x-1/2">
                  <div className="rounded-full bg-gradient-to-r from-purple-600 to-purple-500 px-4 py-1 text-sm font-medium text-white shadow-lg">
                    {tier.badge}
                  </div>
                </div>
              )}

              <Card
                className={`h-full p-6 ${
                  tier.highlighted
                    ? "border-purple-300 bg-gradient-to-b from-purple-50/50 to-white shadow-[0_0_40px_rgba(147,51,234,0.15)] dark:from-purple-900/10 dark:to-gray-900"
                    : "border-purple-100/20 bg-white/50 dark:bg-gray-900/50"
                } backdrop-blur-sm transition-all duration-300 hover:scale-[1.02]`}
              >
                <div className="mb-6">
                  <h3 className="mb-2 text-xl font-semibold">{tier.name}</h3>
                  <p className="text-muted-foreground text-sm">
                    {tier.description}
                  </p>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">{tier.price}</span>
                    {tier.originalPrice && (
                      <span className="text-muted-foreground text-xl line-through">
                        {tier.originalPrice}
                      </span>
                    )}
                  </div>
                  {tier.period && (
                    <p className="text-muted-foreground mt-1 text-sm">
                      {tier.period}
                    </p>
                  )}
                </div>

                <ul className="mb-8 space-y-3">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className="mt-0.5 size-5 shrink-0 text-purple-600" />
                      <span className="text-muted-foreground text-sm">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link href={tier.ctaLink} className="block">
                  <Button
                    variant={tier.highlighted ? "gradient" : "outline"}
                    className={`w-full ${
                      tier.highlighted
                        ? "shadow-purple-md hover:shadow-purple-lg bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:from-purple-700 hover:to-purple-600"
                        : "border-purple-200 hover:border-purple-300 hover:bg-purple-50"
                    }`}
                  >
                    <span className="flex items-center justify-center gap-2">
                      {tier.ctaText}
                      <ArrowRight className="size-4" />
                    </span>
                  </Button>
                </Link>
              </Card>
            </div>
          ))}
        </div>

        {/* Money-back guarantee */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-3 rounded-full bg-green-50 px-6 py-3 dark:bg-green-900/20">
            <Sparkles className="size-5 text-green-600" />
            <span className="text-sm font-medium text-green-900 dark:text-green-300">
              100% satisfaction guarantee or it's free
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
