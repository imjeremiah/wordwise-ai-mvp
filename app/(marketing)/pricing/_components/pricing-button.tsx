"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { createCheckoutSessionAction } from "@/actions/stripe-customer-actions"
import { cn } from "@/lib/utils"

interface PricingButtonProps {
  userId: string
  priceId: string
  buttonText: string
  variant?: "gradient" | "outline"
  className?: string
}

export function PricingButton({
  userId,
  priceId,
  buttonText,
  variant = "outline",
  className
}: PricingButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleCheckout = async () => {
    console.log("[PricingButton] Starting checkout for price:", priceId)
    setLoading(true)

    try {
      const result = await createCheckoutSessionAction(
        userId,
        priceId,
        `${window.location.origin}/dashboard?checkout=success`,
        `${window.location.origin}/pricing?checkout=cancelled`
      )

      if (result.isSuccess) {
        console.log("[PricingButton] Redirecting to checkout:", result.data.url)
        window.location.href = result.data.url
      } else {
        console.error("[PricingButton] Checkout failed:", result.message)
        toast.error(result.message)
      }
    } catch (error) {
      console.error("[PricingButton] Error creating checkout session:", error)
      toast.error("Failed to start checkout process")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      className={cn("w-full", className)}
      variant={variant}
      size="lg"
      onClick={handleCheckout}
      disabled={loading}
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 size-4 animate-spin" />
          Loading...
        </>
      ) : (
        buttonText
      )}
    </Button>
  )
}
