/*
<ai_context>
The server pricing page displays available subscription plans and handles user authentication.
</ai_context>
*/

"use server"

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
    <div className="container mx-auto py-12">
      <h1 className="mb-8 text-center text-3xl font-bold">Choose Your Plan</h1>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <PricingCard
          title="Monthly Plan"
          price="$10"
          description="Billed monthly"
          buttonText="Subscribe Monthly"
          buttonLink={
            process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK_MONTHLY || "#"
          }
          userId={userId}
          stripeCustomerId={stripeCustomerId}
        />
        <PricingCard
          title="Yearly Plan"
          price="$100"
          description="Billed annually"
          buttonText="Subscribe Yearly"
          buttonLink={process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK_YEARLY || "#"}
          userId={userId}
          stripeCustomerId={stripeCustomerId}
        />
      </div>
    </div>
  )
}

interface PricingCardProps {
  title: string
  price: string
  description: string
  buttonText: string
  buttonLink: string
  userId: string | null
  stripeCustomerId: string | null
}

function PricingCard({
  title,
  price,
  description,
  buttonText,
  buttonLink,
  userId,
  stripeCustomerId
}: PricingCardProps) {
  const portalLink = process.env.NEXT_PUBLIC_STRIPE_PORTAL_LINK || "#"

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-4xl font-bold">{price}</p>
        {stripeCustomerId ? (
          <Button className="w-full" asChild>
            <Link href={portalLink}>Manage Subscription</Link>
          </Button>
        ) : (
          <Button
            className={cn("w-full", !userId && "opacity-50")}
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
  )
}
