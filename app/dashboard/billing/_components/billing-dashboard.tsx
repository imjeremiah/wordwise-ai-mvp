"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { format } from "date-fns"
import { CreditCard, Download, Loader2, Receipt, RefreshCw } from "lucide-react"
import {
  getActiveSubscriptionAction,
  cancelSubscriptionAction,
  resumeSubscriptionAction
} from "@/actions/stripe-subscription-actions"
import { createCustomerPortalSessionAction } from "@/actions/stripe-customer-actions"
import {
  getCustomerInvoicesAction,
  getInvoicePdfUrlAction,
  getUpcomingInvoiceAction
} from "@/actions/stripe-billing-actions"
import type { Stripe } from "stripe"

interface BillingDashboardProps {
  userId: string
}

export function BillingDashboard({ userId }: BillingDashboardProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [subscription, setSubscription] = useState<Stripe.Subscription | null>(
    null
  )
  const [invoices, setInvoices] = useState<Stripe.Invoice[]>([])
  const [upcomingInvoice, setUpcomingInvoice] =
    useState<Stripe.UpcomingInvoice | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    loadBillingData()
  }, [userId])

  const loadBillingData = async () => {
    console.log("[BillingDashboard] Loading billing data")
    setLoading(true)

    try {
      // Load subscription, invoices, and upcoming invoice in parallel
      const [subResult, invoicesResult, upcomingResult] = await Promise.all([
        getActiveSubscriptionAction(userId),
        getCustomerInvoicesAction(userId, 10),
        getUpcomingInvoiceAction(userId)
      ])

      if (subResult.isSuccess) {
        setSubscription(subResult.data)
      }

      if (invoicesResult.isSuccess) {
        setInvoices(invoicesResult.data)
      }

      if (upcomingResult.isSuccess) {
        setUpcomingInvoice(upcomingResult.data)
      }
    } catch (error) {
      console.error("[BillingDashboard] Error loading billing data:", error)
      toast.error("Failed to load billing information")
    } finally {
      setLoading(false)
    }
  }

  const handleManageSubscription = async () => {
    console.log("[BillingDashboard] Opening customer portal")
    setActionLoading("portal")

    try {
      const result = await createCustomerPortalSessionAction(
        userId,
        `${window.location.origin}/dashboard/billing`
      )

      if (result.isSuccess) {
        window.location.href = result.data.url
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      console.error("[BillingDashboard] Error opening portal:", error)
      toast.error("Failed to open billing portal")
    } finally {
      setActionLoading(null)
    }
  }

  const handleCancelSubscription = async () => {
    if (!subscription) return

    console.log("[BillingDashboard] Canceling subscription")
    setActionLoading("cancel")

    try {
      const result = await cancelSubscriptionAction(subscription.id)

      if (result.isSuccess) {
        toast.success(
          "Subscription will be canceled at the end of the billing period"
        )
        setSubscription(result.data)
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      console.error("[BillingDashboard] Error canceling subscription:", error)
      toast.error("Failed to cancel subscription")
    } finally {
      setActionLoading(null)
    }
  }

  const handleResumeSubscription = async () => {
    if (!subscription) return

    console.log("[BillingDashboard] Resuming subscription")
    setActionLoading("resume")

    try {
      const result = await resumeSubscriptionAction(subscription.id)

      if (result.isSuccess) {
        toast.success("Subscription resumed successfully")
        setSubscription(result.data)
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      console.error("[BillingDashboard] Error resuming subscription:", error)
      toast.error("Failed to resume subscription")
    } finally {
      setActionLoading(null)
    }
  }

  const handleDownloadInvoice = async (invoiceId: string) => {
    console.log("[BillingDashboard] Downloading invoice:", invoiceId)
    setActionLoading(`invoice-${invoiceId}`)

    try {
      const result = await getInvoicePdfUrlAction(invoiceId)

      if (result.isSuccess) {
        window.open(result.data.url, "_blank")
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      console.error("[BillingDashboard] Error downloading invoice:", error)
      toast.error("Failed to download invoice")
    } finally {
      setActionLoading(null)
    }
  }

  const formatCurrency = (amount: number, currency: string = "usd") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase()
    }).format(amount / 100)
  }

  const getSubscriptionStatus = (sub: Stripe.Subscription) => {
    if (sub.cancel_at_period_end) {
      return { label: "Canceling", variant: "secondary" as const }
    }

    switch (sub.status) {
      case "active":
        return { label: "Active", variant: "default" as const }
      case "trialing":
        return { label: "Trial", variant: "secondary" as const }
      case "past_due":
        return { label: "Past Due", variant: "destructive" as const }
      case "unpaid":
        return { label: "Unpaid", variant: "destructive" as const }
      case "canceled":
        return { label: "Canceled", variant: "secondary" as const }
      default:
        return { label: "Unknown", variant: "secondary" as const }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="size-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Current Subscription */}
      <Card>
        <CardHeader>
          <CardTitle>Current Subscription</CardTitle>
          <CardDescription>
            Manage your subscription and billing preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          {subscription ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">
                    {(subscription.items.data[0].price.product as any).name ||
                      "Subscription"}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {formatCurrency(
                      subscription.items.data[0].price.unit_amount || 0,
                      subscription.items.data[0].price.currency
                    )}
                    /{subscription.items.data[0].price.recurring?.interval}
                  </p>
                </div>
                <Badge variant={getSubscriptionStatus(subscription).variant}>
                  {getSubscriptionStatus(subscription).label}
                </Badge>
              </div>

              {subscription.current_period_end && (
                <p className="text-muted-foreground text-sm">
                  {subscription.cancel_at_period_end
                    ? `Ends on ${format(new Date(subscription.current_period_end * 1000), "PPP")}`
                    : `Renews on ${format(new Date(subscription.current_period_end * 1000), "PPP")}`}
                </p>
              )}
            </div>
          ) : (
            <p className="text-muted-foreground">No active subscription</p>
          )}
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button
            onClick={handleManageSubscription}
            disabled={actionLoading !== null}
          >
            {actionLoading === "portal" ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <CreditCard className="mr-2 size-4" />
            )}
            Manage Billing
          </Button>

          {subscription && !subscription.cancel_at_period_end && (
            <Button
              variant="secondary"
              onClick={handleCancelSubscription}
              disabled={actionLoading !== null}
            >
              {actionLoading === "cancel" && (
                <Loader2 className="mr-2 size-4 animate-spin" />
              )}
              Cancel Subscription
            </Button>
          )}

          {subscription && subscription.cancel_at_period_end && (
            <Button
              variant="secondary"
              onClick={handleResumeSubscription}
              disabled={actionLoading !== null}
            >
              {actionLoading === "resume" ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 size-4" />
              )}
              Resume Subscription
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* Upcoming Invoice */}
      {upcomingInvoice && (
        <Card>
          <CardHeader>
            <CardTitle>Next Payment</CardTitle>
            <CardDescription>Your upcoming charge</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">
                  {formatCurrency(
                    upcomingInvoice.amount_due,
                    upcomingInvoice.currency
                  )}
                </p>
                <p className="text-muted-foreground text-sm">
                  Due on{" "}
                  {format(new Date(upcomingInvoice.period_end * 1000), "PPP")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>
            Download your past invoices and receipts
          </CardDescription>
        </CardHeader>
        <CardContent>
          {invoices.length > 0 ? (
            <div className="space-y-2">
              {invoices.map(invoice => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between border-b py-3 last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium">
                      {formatCurrency(
                        invoice.amount_paid || 0,
                        invoice.currency
                      )}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {invoice.created
                        ? format(new Date(invoice.created * 1000), "PPP")
                        : "Date unavailable"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={invoice.paid ? "default" : "secondary"}>
                      {invoice.paid ? "Paid" : "Pending"}
                    </Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDownloadInvoice(invoice.id)}
                      disabled={actionLoading === `invoice-${invoice.id}`}
                    >
                      {actionLoading === `invoice-${invoice.id}` ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Download className="size-4" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No invoices yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
