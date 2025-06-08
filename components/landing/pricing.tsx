/*
<ai_context>
This server component provides the pricing section.
Shows pricing options with purple-centric design.
</ai_context>
*/

import { Card } from "@/components/ui/card"
import { Check } from "lucide-react"
import { auth } from "@/lib/firebase-auth"
import { PricingButton } from "@/app/(marketing)/pricing/_components/pricing-button"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface PricingTier {
  name: string
  description: string
  price: string
  period: string
  priceId?: string
  features: string[]
  highlighted?: boolean
  ctaText: string
  isSubscription?: boolean
}

export async function PricingSection() {
  console.log("[PricingSection] Rendering pricing section")

  // Get current user session
  const session = await auth()
  const userId = session?.userId || null

  const pricingTiers: PricingTier[] = [
    {
      name: "Monthly",
      description: "Perfect for getting started",
      price: "$10",
      period: "/month",
      priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY,
      features: [
        "All core features",
        "Up to 10,000 API calls",
        "Priority support",
        "Regular updates"
      ],
      ctaText: "Sign in to subscribe",
      isSubscription: true
    },
    {
      name: "Yearly",
      description: "Best value for growing businesses",
      price: "$100",
      period: "/year",
      priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_YEARLY,
      features: [
        "Everything in Monthly",
        "Unlimited API calls",
        "24/7 dedicated support",
        "Early access to new features",
        "2 months free"
      ],
      highlighted: true,
      ctaText: "Sign in to subscribe",
      isSubscription: true
    }
  ]

  return (
    <section className="from-background to-muted/30 bg-gradient-to-b py-12 md:py-24">
      <div className="container max-w-7xl">
        <div className="mx-auto mb-16 text-center">
          <h2 className="text-primary font-mono text-sm font-bold uppercase tracking-wider">
            Pricing
          </h2>
          <h3 className="mx-auto mt-4 max-w-3xl text-3xl font-semibold sm:text-4xl md:text-5xl">
            Simple,{" "}
            <span className="bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
              Transparent Pricing
            </span>
          </h3>
          <p className="text-muted-foreground mx-auto mt-6 max-w-3xl text-lg">
            Choose the perfect plan for your project. No hidden fees.
          </p>
        </div>

        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
          {pricingTiers.map((tier, index) => (
            <div
              key={tier.name}
              className={`relative ${tier.highlighted ? "z-10 scale-105" : ""}`}
            >
              {tier.highlighted && (
                <div className="absolute -top-4 left-1/2 z-20 -translate-x-1/2">
                  <div className="rounded-full bg-gradient-to-r from-purple-600 to-purple-500 px-4 py-1 text-sm font-medium text-white shadow-lg">
                    Most Popular
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
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">{tier.price}</span>
                    <span className="text-muted-foreground text-lg">
                      {tier.period}
                    </span>
                  </div>
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

                {tier.isSubscription && userId && tier.priceId ? (
                  <PricingButton
                    userId={userId}
                    priceId={tier.priceId}
                    buttonText={tier.ctaText}
                    variant={tier.highlighted ? "gradient" : "outline"}
                    className={
                      tier.highlighted
                        ? "shadow-purple-md hover:shadow-purple-lg bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:from-purple-700 hover:to-purple-600"
                        : "border-purple-200 hover:border-purple-300 hover:bg-purple-50"
                    }
                  />
                ) : (
                  <Link href="/signup" className="block">
                    <Button
                      variant={tier.highlighted ? "gradient" : "outline"}
                      className={`w-full ${
                        tier.highlighted
                          ? "shadow-purple-md hover:shadow-purple-lg bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:from-purple-700 hover:to-purple-600"
                          : "border-purple-200 hover:border-purple-300 hover:bg-purple-50"
                      }`}
                    >
                      {tier.ctaText}
                    </Button>
                  </Link>
                )}
              </Card>
            </div>
          ))}
        </div>

        {/* Money-back guarantee */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-3 rounded-full bg-purple-50 px-6 py-3 dark:bg-purple-900/20">
            <span className="text-sm font-medium text-purple-900 dark:text-purple-300">
              💜 30-day money-back guarantee
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
