/*
<ai_context>
This is the pricing page with purple-centric design and glassmorphism effects.
</ai_context>
*/

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { auth } from "@/lib/firebase-auth"
import { getProfileByUserIdAction } from "@/actions/db/profiles-actions"
import { Check, Sparkles } from "lucide-react"

export default async function PricingPage() {
  const { userId } = await auth()

  let stripeCustomerId = null
  if (userId) {
    const profile = await getProfileByUserIdAction(userId)
    if (profile.isSuccess && profile.data) {
      stripeCustomerId = profile.data.stripeCustomerId || null
    }
  }

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container max-w-5xl">
        <div className="mb-12 text-center">
          <h1 className="font-instrument mb-4 text-5xl font-bold tracking-tight text-black">
            Simple, Transparent Pricing
          </h1>
          <p className="text-muted-foreground text-xl">
            Choose the perfect plan for your project. No hidden fees.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
          <PricingCard
            title="Monthly"
            price="$10"
            period="/month"
            description="Perfect for getting started"
            features={[
              "All core features",
              "Up to 10,000 API calls",
              "Priority support",
              "Regular updates"
            ]}
            buttonText="Start Monthly Plan"
            buttonLink={
              process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK_MONTHLY || "#"
            }
            userId={userId}
            stripeCustomerId={stripeCustomerId}
          />

          <PricingCard
            title="Yearly"
            price="$100"
            period="/year"
            description="Best value for growing businesses"
            features={[
              "Everything in Monthly",
              "Unlimited API calls",
              "24/7 dedicated support",
              "Early access to new features",
              "2 months free"
            ]}
            buttonText="Start Yearly Plan"
            buttonLink={
              process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK_YEARLY || "#"
            }
            userId={userId}
            stripeCustomerId={stripeCustomerId}
            recommended
          />
        </div>

        {/* Trust indicators */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-200/30 bg-white/50 px-4 py-2 backdrop-blur-sm">
            <Sparkles className="size-4 text-purple-600" />
            <span className="text-muted-foreground text-sm font-medium">
              30-day money-back guarantee
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

interface PricingCardProps {
  title: string
  price: string
  period: string
  description: string
  features: string[]
  buttonText: string
  buttonLink: string
  userId: string | null
  stripeCustomerId: string | null
  recommended?: boolean
}

function PricingCard({
  title,
  price,
  period,
  description,
  features,
  buttonText,
  buttonLink,
  userId,
  stripeCustomerId,
  recommended = false
}: PricingCardProps) {
  const portalLink = process.env.NEXT_PUBLIC_STRIPE_PORTAL_LINK || "#"

  return (
    <div className="group relative">
      {recommended && (
        <div className="absolute -top-4 left-1/2 z-10 -translate-x-1/2 rounded-full bg-purple-600 px-5 py-2 text-[13px] font-semibold text-white shadow-lg">
          Most Popular
        </div>
      )}

      <Card
        className={cn(
          "relative h-full transition-all duration-300",
          recommended
            ? "border-purple-300/40 bg-white/90 shadow-[0_8px_30px_rgba(147,51,234,0.15)] dark:bg-gray-900/90"
            : "bg-white/80 dark:bg-gray-900/80",
          "hover:scale-[1.02] hover:shadow-[0_15px_50px_rgba(147,51,234,0.2)]"
        )}
      >
        <CardHeader className="pb-8 text-center">
          <CardTitle className="mb-2 text-2xl font-semibold">{title}</CardTitle>
          <CardDescription className="text-muted-foreground mb-4">
            {description}
          </CardDescription>
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-5xl font-bold text-purple-600">{price}</span>
            <span className="text-muted-foreground text-lg">{period}</span>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Features */}
          <ul className="space-y-3">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-purple-50">
                  <Check className="size-3.5 text-purple-600" />
                </div>
                <span className="text-muted-foreground text-sm">{feature}</span>
              </li>
            ))}
          </ul>

          {/* CTA Button */}
          {stripeCustomerId ? (
            <Button
              className="w-full"
              variant={recommended ? "gradient" : "outline"}
              size="lg"
              asChild
            >
              <Link href={portalLink}>Manage Subscription</Link>
            </Button>
          ) : (
            <Button
              className={cn("w-full", !userId && "opacity-50")}
              variant={recommended ? "gradient" : "outline"}
              size="lg"
              disabled={!userId}
              asChild
            >
              <Link
                href={
                  userId ? `${buttonLink}?client_reference_id=${userId}` : "#"
                }
              >
                {userId ? buttonText : "Sign in to subscribe"}
              </Link>
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
