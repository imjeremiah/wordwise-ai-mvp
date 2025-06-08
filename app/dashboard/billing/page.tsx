"use server"

import { Suspense } from "react"
import { auth } from "@/lib/firebase-auth"
import { redirect } from "next/navigation"
import { BillingDashboard } from "./_components/billing-dashboard"
import { Skeleton } from "@/components/ui/skeleton"

export default async function BillingPage() {
  // Check authentication
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  console.log(
    "[BillingPage] Loading billing dashboard for user:",
    session.userId
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Billing & Subscription</h1>
        <p className="text-muted-foreground mt-2">
          Manage your subscription, payment methods, and billing history
        </p>
      </div>

      <Suspense fallback={<BillingSkeleton />}>
        <BillingDashboard userId={session.userId!} />
      </Suspense>
    </div>
  )
}

function BillingSkeleton() {
  return (
    <div className="space-y-6">
      {/* Subscription status skeleton */}
      <div className="rounded-lg border p-6">
        <Skeleton className="mb-4 h-6 w-32" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-36" />
        </div>
        <div className="mt-4 flex gap-2">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>

      {/* Billing history skeleton */}
      <div className="rounded-lg border p-6">
        <Skeleton className="mb-4 h-6 w-40" />
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between border-b py-3 last:border-0"
            >
              <div className="space-y-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
