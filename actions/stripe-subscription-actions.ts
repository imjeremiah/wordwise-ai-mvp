"use server"

import { stripe } from "@/lib/stripe"
import { ActionState } from "@/types"
import { getProfileByUserIdAction } from "@/actions/db/profiles-actions"
import Stripe from "stripe"

// Get user's active subscription
export async function getActiveSubscriptionAction(
  userId: string
): Promise<ActionState<Stripe.Subscription | null>> {
  console.log("[getActiveSubscriptionAction] Fetching active subscription for user:", userId)
  
  try {
    const profileResult = await getProfileByUserIdAction({ userId })
    
    if (!profileResult.isSuccess || !profileResult.data.stripeCustomerId) {
      console.log("[getActiveSubscriptionAction] No Stripe customer found")
      return {
        isSuccess: true,
        message: "No Stripe customer found",
        data: null
      }
    }
    
    const subscriptions = await stripe.subscriptions.list({
      customer: profileResult.data.stripeCustomerId,
      status: "active",
      limit: 1
    })
    
    const activeSubscription = subscriptions.data[0] || null
    
    console.log("[getActiveSubscriptionAction] Active subscription:", activeSubscription?.id || "none")
    
    return {
      isSuccess: true,
      message: activeSubscription ? "Active subscription found" : "No active subscription",
      data: activeSubscription
    }
  } catch (error) {
    console.error("[getActiveSubscriptionAction] Error fetching subscription:", error)
    return {
      isSuccess: false,
      message: "Failed to fetch subscription"
    }
  }
}

// Get all user's subscriptions (including canceled)
export async function getAllSubscriptionsAction(
  userId: string
): Promise<ActionState<Stripe.Subscription[]>> {
  console.log("[getAllSubscriptionsAction] Fetching all subscriptions for user:", userId)
  
  try {
    const profileResult = await getProfileByUserIdAction({ userId })
    
    if (!profileResult.isSuccess || !profileResult.data.stripeCustomerId) {
      return {
        isSuccess: true,
        message: "No Stripe customer found",
        data: []
      }
    }
    
    const subscriptions = await stripe.subscriptions.list({
      customer: profileResult.data.stripeCustomerId,
      limit: 100
    })
    
    console.log("[getAllSubscriptionsAction] Found", subscriptions.data.length, "subscriptions")
    
    return {
      isSuccess: true,
      message: "Subscriptions fetched successfully",
      data: subscriptions.data
    }
  } catch (error) {
    console.error("[getAllSubscriptionsAction] Error fetching subscriptions:", error)
    return {
      isSuccess: false,
      message: "Failed to fetch subscriptions"
    }
  }
}

// Cancel subscription at period end
export async function cancelSubscriptionAction(
  subscriptionId: string
): Promise<ActionState<Stripe.Subscription>> {
  console.log("[cancelSubscriptionAction] Canceling subscription:", subscriptionId)
  
  try {
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true
    })
    
    console.log("[cancelSubscriptionAction] Subscription set to cancel at period end")
    
    return {
      isSuccess: true,
      message: "Subscription will be canceled at the end of the billing period",
      data: subscription
    }
  } catch (error) {
    console.error("[cancelSubscriptionAction] Error canceling subscription:", error)
    return {
      isSuccess: false,
      message: "Failed to cancel subscription"
    }
  }
}

// Resume a subscription that was set to cancel
export async function resumeSubscriptionAction(
  subscriptionId: string
): Promise<ActionState<Stripe.Subscription>> {
  console.log("[resumeSubscriptionAction] Resuming subscription:", subscriptionId)
  
  try {
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: false
    })
    
    console.log("[resumeSubscriptionAction] Subscription resumed")
    
    return {
      isSuccess: true,
      message: "Subscription resumed successfully",
      data: subscription
    }
  } catch (error) {
    console.error("[resumeSubscriptionAction] Error resuming subscription:", error)
    return {
      isSuccess: false,
      message: "Failed to resume subscription"
    }
  }
}

// Update subscription (change plan)
export async function updateSubscriptionAction(
  subscriptionId: string,
  newPriceId: string,
  prorate: boolean = true
): Promise<ActionState<Stripe.Subscription>> {
  console.log("[updateSubscriptionAction] Updating subscription:", subscriptionId, "to price:", newPriceId)
  
  try {
    // Get current subscription
    const subscription = await stripe.subscriptions.retrieve(subscriptionId)
    
    if (!subscription || subscription.status !== "active") {
      return {
        isSuccess: false,
        message: "No active subscription found"
      }
    }
    
    // Update the subscription item with new price
    const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
      items: [
        {
          id: subscription.items.data[0].id,
          price: newPriceId
        }
      ],
      proration_behavior: prorate ? "create_prorations" : "none"
    })
    
    console.log("[updateSubscriptionAction] Subscription updated successfully")
    
    return {
      isSuccess: true,
      message: "Subscription plan updated successfully",
      data: updatedSubscription
    }
  } catch (error) {
    console.error("[updateSubscriptionAction] Error updating subscription:", error)
    return {
      isSuccess: false,
      message: "Failed to update subscription"
    }
  }
}

// Pause subscription
export async function pauseSubscriptionAction(
  subscriptionId: string,
  resumeAt?: Date
): Promise<ActionState<Stripe.Subscription>> {
  console.log("[pauseSubscriptionAction] Pausing subscription:", subscriptionId)
  
  try {
    const pauseData: Stripe.SubscriptionUpdateParams.PauseCollection = {
      behavior: "mark_uncollectible"
    }
    
    if (resumeAt) {
      pauseData.resumes_at = Math.floor(resumeAt.getTime() / 1000)
    }
    
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      pause_collection: pauseData
    })
    
    console.log("[pauseSubscriptionAction] Subscription paused")
    
    return {
      isSuccess: true,
      message: "Subscription paused successfully",
      data: subscription
    }
  } catch (error) {
    console.error("[pauseSubscriptionAction] Error pausing subscription:", error)
    return {
      isSuccess: false,
      message: "Failed to pause subscription"
    }
  }
}

// Resume paused subscription
export async function unpauseSubscriptionAction(
  subscriptionId: string
): Promise<ActionState<Stripe.Subscription>> {
  console.log("[unpauseSubscriptionAction] Unpausing subscription:", subscriptionId)
  
  try {
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      pause_collection: null
    })
    
    console.log("[unpauseSubscriptionAction] Subscription unpaused")
    
    return {
      isSuccess: true,
      message: "Subscription resumed successfully",
      data: subscription
    }
  } catch (error) {
    console.error("[unpauseSubscriptionAction] Error unpausing subscription:", error)
    return {
      isSuccess: false,
      message: "Failed to resume subscription"
    }
  }
} 