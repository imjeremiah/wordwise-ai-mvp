"use server"

import { stripe } from "@/lib/stripe"
import { ActionState } from "@/types"
import { getProfileByUserIdAction } from "@/actions/db/profiles-actions"
import Stripe from "stripe"

// Get all products and prices
export async function getProductsAndPricesAction(): Promise<
  ActionState<{ products: Stripe.Product[]; prices: Stripe.Price[] }>
> {
  console.log("[getProductsAndPricesAction] Fetching products and prices")
  
  try {
    // Fetch all active products
    const products = await stripe.products.list({
      active: true,
      expand: ["data.default_price"]
    })
    
    // Fetch all active prices
    const prices = await stripe.prices.list({
      active: true,
      expand: ["data.product"]
    })
    
    console.log("[getProductsAndPricesAction] Found", products.data.length, "products and", prices.data.length, "prices")
    
    return {
      isSuccess: true,
      message: "Products and prices fetched successfully",
      data: {
        products: products.data,
        prices: prices.data
      }
    }
  } catch (error) {
    console.error("[getProductsAndPricesAction] Error fetching products:", error)
    return {
      isSuccess: false,
      message: "Failed to fetch products and prices"
    }
  }
}

// Get subscription prices only
export async function getSubscriptionPricesAction(): Promise<ActionState<Stripe.Price[]>> {
  console.log("[getSubscriptionPricesAction] Fetching subscription prices")
  
  try {
    const prices = await stripe.prices.list({
      active: true,
      type: "recurring",
      expand: ["data.product"]
    })
    
    console.log("[getSubscriptionPricesAction] Found", prices.data.length, "subscription prices")
    
    return {
      isSuccess: true,
      message: "Subscription prices fetched successfully",
      data: prices.data
    }
  } catch (error) {
    console.error("[getSubscriptionPricesAction] Error fetching prices:", error)
    return {
      isSuccess: false,
      message: "Failed to fetch subscription prices"
    }
  }
}

// Get customer invoices
export async function getCustomerInvoicesAction(
  userId: string,
  limit: number = 10
): Promise<ActionState<Stripe.Invoice[]>> {
  console.log("[getCustomerInvoicesAction] Fetching invoices for user:", userId)
  
  try {
    const profileResult = await getProfileByUserIdAction(userId)
    
    if (!profileResult.isSuccess || !profileResult.data.stripeCustomerId) {
      return {
        isSuccess: true,
        message: "No Stripe customer found",
        data: []
      }
    }
    
    const invoices = await stripe.invoices.list({
      customer: profileResult.data.stripeCustomerId,
      limit
    })
    
    console.log("[getCustomerInvoicesAction] Found", invoices.data.length, "invoices")
    
    return {
      isSuccess: true,
      message: "Invoices fetched successfully",
      data: invoices.data
    }
  } catch (error) {
    console.error("[getCustomerInvoicesAction] Error fetching invoices:", error)
    return {
      isSuccess: false,
      message: "Failed to fetch invoices"
    }
  }
}

// Get upcoming invoice
export async function getUpcomingInvoiceAction(
  userId: string
): Promise<ActionState<Stripe.UpcomingInvoice | null>> {
  console.log("[getUpcomingInvoiceAction] Fetching upcoming invoice for user:", userId)
  
  try {
    const profileResult = await getProfileByUserIdAction(userId)
    
    if (!profileResult.isSuccess || !profileResult.data.stripeCustomerId) {
      return {
        isSuccess: true,
        message: "No Stripe customer found",
        data: null
      }
    }
    
    // Check if user has active subscription
    const subscriptions = await stripe.subscriptions.list({
      customer: profileResult.data.stripeCustomerId,
      status: "active",
      limit: 1
    })
    
    if (subscriptions.data.length === 0) {
      return {
        isSuccess: true,
        message: "No active subscription",
        data: null
      }
    }
    
    const upcomingInvoice = await stripe.invoices.retrieveUpcoming({
      customer: profileResult.data.stripeCustomerId
    })
    
    console.log("[getUpcomingInvoiceAction] Found upcoming invoice")
    
    return {
      isSuccess: true,
      message: "Upcoming invoice fetched successfully",
      data: upcomingInvoice
    }
  } catch (error) {
    console.error("[getUpcomingInvoiceAction] Error fetching upcoming invoice:", error)
    // Stripe throws an error if there's no upcoming invoice
    if (error instanceof Error && error.message.includes("No upcoming invoices")) {
      return {
        isSuccess: true,
        message: "No upcoming invoice",
        data: null
      }
    }
    return {
      isSuccess: false,
      message: "Failed to fetch upcoming invoice"
    }
  }
}

// Download invoice PDF
export async function getInvoicePdfUrlAction(
  invoiceId: string
): Promise<ActionState<{ url: string }>> {
  console.log("[getInvoicePdfUrlAction] Getting PDF URL for invoice:", invoiceId)
  
  try {
    const invoice = await stripe.invoices.retrieve(invoiceId)
    
    if (!invoice.invoice_pdf) {
      return {
        isSuccess: false,
        message: "Invoice PDF not available"
      }
    }
    
    console.log("[getInvoicePdfUrlAction] Invoice PDF URL retrieved")
    
    return {
      isSuccess: true,
      message: "Invoice PDF URL retrieved successfully",
      data: { url: invoice.invoice_pdf }
    }
  } catch (error) {
    console.error("[getInvoicePdfUrlAction] Error getting invoice PDF:", error)
    return {
      isSuccess: false,
      message: "Failed to get invoice PDF"
    }
  }
}

// Get payment history
export async function getPaymentHistoryAction(
  userId: string,
  limit: number = 10
): Promise<ActionState<Stripe.PaymentIntent[]>> {
  console.log("[getPaymentHistoryAction] Fetching payment history for user:", userId)
  
  try {
    const profileResult = await getProfileByUserIdAction(userId)
    
    if (!profileResult.isSuccess || !profileResult.data.stripeCustomerId) {
      return {
        isSuccess: true,
        message: "No Stripe customer found",
        data: []
      }
    }
    
    const paymentIntents = await stripe.paymentIntents.list({
      customer: profileResult.data.stripeCustomerId,
      limit
    })
    
    console.log("[getPaymentHistoryAction] Found", paymentIntents.data.length, "payments")
    
    return {
      isSuccess: true,
      message: "Payment history fetched successfully",
      data: paymentIntents.data
    }
  } catch (error) {
    console.error("[getPaymentHistoryAction] Error fetching payment history:", error)
    return {
      isSuccess: false,
      message: "Failed to fetch payment history"
    }
  }
}

// Retry failed payment
export async function retryFailedPaymentAction(
  invoiceId: string
): Promise<ActionState<Stripe.Invoice>> {
  console.log("[retryFailedPaymentAction] Retrying payment for invoice:", invoiceId)
  
  try {
    const invoice = await stripe.invoices.pay(invoiceId)
    
    console.log("[retryFailedPaymentAction] Payment retry successful")
    
    return {
      isSuccess: true,
      message: "Payment retry successful",
      data: invoice
    }
  } catch (error) {
    console.error("[retryFailedPaymentAction] Error retrying payment:", error)
    return {
      isSuccess: false,
      message: "Failed to retry payment"
    }
  }
} 