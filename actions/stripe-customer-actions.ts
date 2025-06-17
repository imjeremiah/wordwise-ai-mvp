"use server"

import { stripe } from "@/lib/stripe"
import { ActionState } from "@/types"
import { getProfileByUserIdAction, updateProfileAction } from "@/actions/db/profiles-actions"
import Stripe from "stripe"

// Create a Stripe customer for a user
export async function createStripeCustomerAction(
  userId: string,
  email: string,
  name?: string
): Promise<ActionState<{ customerId: string }>> {
  console.log("[createStripeCustomerAction] Creating Stripe customer for user:", userId)
  
  try {
    // Check if user already has a Stripe customer ID
    const profileResult = await getProfileByUserIdAction({ userId })
    
    if (profileResult.isSuccess && profileResult.data.stripeCustomerId) {
      console.log("[createStripeCustomerAction] User already has Stripe customer ID")
      return {
        isSuccess: true,
        message: "Stripe customer already exists",
        data: { customerId: profileResult.data.stripeCustomerId }
      }
    }
    
    // Create new Stripe customer
    const customer = await stripe.customers.create({
      email,
      name,
      metadata: {
        userId
      }
    })
    
    console.log("[createStripeCustomerAction] Created Stripe customer:", customer.id)
    
    // Update user profile with Stripe customer ID
    const updateResult = await updateProfileAction(userId, {
      stripeCustomerId: customer.id
    })
    
    if (!updateResult.isSuccess) {
      console.error("[createStripeCustomerAction] Failed to update profile with customer ID")
      // Note: Customer was created in Stripe but not linked to profile
      // You may want to handle this case differently
    }
    
    return {
      isSuccess: true,
      message: "Stripe customer created successfully",
      data: { customerId: customer.id }
    }
  } catch (error) {
    console.error("[createStripeCustomerAction] Error creating Stripe customer:", error)
    return {
      isSuccess: false,
      message: "Failed to create Stripe customer"
    }
  }
}

// Create a checkout session for subscription
export async function createCheckoutSessionAction(
  userId: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string,
  mode: "payment" | "subscription" = "subscription"
): Promise<ActionState<{ sessionId: string; url: string }>> {
  console.log("[createCheckoutSessionAction] Creating checkout session for user:", userId)
  
  try {
    // Get user profile to check for existing customer
    const profileResult = await getProfileByUserIdAction({ userId })
    
    if (!profileResult.isSuccess) {
      return {
        isSuccess: false,
        message: "User profile not found"
      }
    }
    
    const sessionData: Stripe.Checkout.SessionCreateParams = {
      mode,
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      client_reference_id: userId,
      metadata: {
        userId
      }
    }
    
    // If user already has a Stripe customer ID, use it
    if (profileResult.data.stripeCustomerId) {
      sessionData.customer = profileResult.data.stripeCustomerId
    } else {
      // Otherwise, create a new customer during checkout
      sessionData.customer_email = profileResult.data.email
    }
    
    const session = await stripe.checkout.sessions.create(sessionData)
    
    console.log("[createCheckoutSessionAction] Created checkout session:", session.id)
    
    return {
      isSuccess: true,
      message: "Checkout session created successfully",
      data: {
        sessionId: session.id,
        url: session.url!
      }
    }
  } catch (error) {
    console.error("[createCheckoutSessionAction] Error creating checkout session:", error)
    return {
      isSuccess: false,
      message: "Failed to create checkout session"
    }
  }
}

// Get customer portal session
export async function createCustomerPortalSessionAction(
  userId: string,
  returnUrl: string
): Promise<ActionState<{ url: string }>> {
  console.log("[createCustomerPortalSessionAction] Creating portal session for user:", userId)
  
  try {
    // Get user profile to get Stripe customer ID
    const profileResult = await getProfileByUserIdAction({ userId })
    
    if (!profileResult.isSuccess || !profileResult.data.stripeCustomerId) {
      return {
        isSuccess: false,
        message: "No Stripe customer found for user"
      }
    }
    
    const session = await stripe.billingPortal.sessions.create({
      customer: profileResult.data.stripeCustomerId,
      return_url: returnUrl
    })
    
    console.log("[createCustomerPortalSessionAction] Created portal session")
    
    return {
      isSuccess: true,
      message: "Customer portal session created successfully",
      data: { url: session.url }
    }
  } catch (error) {
    console.error("[createCustomerPortalSessionAction] Error creating portal session:", error)
    return {
      isSuccess: false,
      message: "Failed to create customer portal session"
    }
  }
}

// Get customer's payment methods
export async function getCustomerPaymentMethodsAction(
  userId: string
): Promise<ActionState<Stripe.PaymentMethod[]>> {
  console.log("[getCustomerPaymentMethodsAction] Fetching payment methods for user:", userId)
  
  try {
    const profileResult = await getProfileByUserIdAction({ userId })
    
    if (!profileResult.isSuccess || !profileResult.data.stripeCustomerId) {
      return {
        isSuccess: false,
        message: "No Stripe customer found for user"
      }
    }
    
    const paymentMethods = await stripe.paymentMethods.list({
      customer: profileResult.data.stripeCustomerId,
      type: "card"
    })
    
    console.log("[getCustomerPaymentMethodsAction] Found", paymentMethods.data.length, "payment methods")
    
    return {
      isSuccess: true,
      message: "Payment methods fetched successfully",
      data: paymentMethods.data
    }
  } catch (error) {
    console.error("[getCustomerPaymentMethodsAction] Error fetching payment methods:", error)
    return {
      isSuccess: false,
      message: "Failed to fetch payment methods"
    }
  }
} 