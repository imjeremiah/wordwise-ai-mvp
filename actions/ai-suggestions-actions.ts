"use server"

/*
<ai_context>
AI Suggestions Actions for WordWise AI
Connects frontend to Firebase Cloud Functions for grammar and style analysis
Handles caching, rate limiting, and error management
</ai_context>
*/

import { auth } from "@/lib/firebase-auth"
import { ActionState } from "@/types"

// Types for AI suggestions
export interface WritingSuggestion {
  id: string
  type: "grammar" | "style" | "clarity" | "tone"
  severity: "low" | "medium" | "high"
  title: string
  description: string
  suggestion: string
  position?: {
    start: number
    end: number
  }
  originalText?: string
  suggestedText?: string
}

export interface SuggestionResponse {
  suggestions: WritingSuggestion[]
  wordCount: number
  readabilityScore: number
  processingTime: number
  cached: boolean
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}

export interface UsageStats {
  monthly: {
    used: number
    limit: number
    remaining: number
  }
  daily: {
    used: number
    limit: number
    remaining: number
  }
  hourly: {
    used: number
    limit: number
    remaining: number
  }
}

/**
 * Get AI suggestions for text content
 */
export async function getAISuggestionsAction(
  text: string,
  documentId?: string
): Promise<ActionState<SuggestionResponse>> {
  console.log("[getAISuggestionsAction] Starting AI suggestions request")
  const startTime = Date.now()

  try {
    const session = await auth()
    if (!session || !session.userId) {
      console.error("[getAISuggestionsAction] No authenticated session")
      return { isSuccess: false, message: "Authentication failed" }
    }

    console.log("[getAISuggestionsAction] Authenticated user:", session.userId)

    if (!text || text.trim().length < 10) {
      return {
        isSuccess: true,
        message: "Text too short for analysis.",
        data: {
          suggestions: [],
          wordCount: 0,
          readabilityScore: 0,
          processingTime: 0,
          cached: false
        }
      }
    }

    if (text.length > 10000) {
      return {
        isSuccess: false,
        message: "Text must be less than 10,000 characters"
      }
    }

    // Call Firebase Cloud Function directly via HTTP
    const functionUrl = `https://us-central1-${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.cloudfunctions.net/analyzeSuggestions`
    console.log("[getAISuggestionsAction] Calling Cloud Function via HTTP:", functionUrl)

    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          text: text,
          userId: session.userId,
          documentId
        }
      })
    })

    if (!response.ok) {
      console.error("[getAISuggestionsAction] HTTP error:", response.status, response.statusText)
      const errorText = await response.text()
      console.error("[getAISuggestionsAction] Error response:", errorText)
      
      if (response.status === 401) {
        return { isSuccess: false, message: "Authentication failed. Please sign in again." }
      }
      if (response.status === 403) {
        return { isSuccess: false, message: "Access denied." }
      }
      if (response.status === 429) {
        return { isSuccess: false, message: "Rate limit exceeded. Please try again later." }
      }
      
      return { isSuccess: false, message: "Failed to analyze text. Please try again." }
    }

    const responseData = await response.json()
    console.log("[getAISuggestionsAction] Received response from Cloud Function")
    
    // The response should have a 'result' field containing our data
    const suggestionsData = responseData.result as SuggestionResponse
    
    if (!suggestionsData) {
      console.error("[getAISuggestionsAction] No result data in response:", responseData)
      return { isSuccess: false, message: "Invalid response from AI service" }
    }

    console.log("[getAISuggestionsAction] Suggestions count:", suggestionsData.suggestions.length)
    console.log("[getAISuggestionsAction] Processing time:", suggestionsData.processingTime + "ms")

    const totalTime = Date.now() - startTime
    console.log("[getAISuggestionsAction] Total request time:", totalTime + "ms")

    return {
      isSuccess: true,
      message: suggestionsData.cached
        ? "Suggestions retrieved from cache"
        : "AI analysis completed successfully",
      data: {
        ...suggestionsData,
        processingTime: totalTime // Include total round-trip time
      }
    }
  } catch (error: any) {
    const totalTime = Date.now() - startTime
    console.error("[getAISuggestionsAction] Error calling Cloud Function:", error)
    console.error("[getAISuggestionsAction] Total time before error:", totalTime + "ms")

    // Handle network and other errors
    const errorMessage = error.message || "An unexpected error occurred."
    
    // Handle network errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return { 
        isSuccess: false, 
        message: "Network error. Please check your connection and try again." 
      }
    }

    return {
      isSuccess: false,
      message: `Analysis failed: ${errorMessage}`
    }
  }
}

/**
 * Get user's AI usage statistics
 */
export async function getUserUsageAction(): Promise<ActionState<UsageStats>> {
  console.log("[getUserUsageAction] Getting user usage statistics")

  try {
    const session = await auth()
    if (!session || !session.userId) {
      console.error("[getUserUsageAction] No authenticated session")
      return { isSuccess: false, message: "Authentication required" }
    }

    console.log("[getUserUsageAction] Getting usage for user:", session.userId)

    // Call Firebase Cloud Function directly via HTTP
    const functionUrl = `https://us-central1-${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.cloudfunctions.net/getUserUsage`
    console.log("[getUserUsageAction] Calling Cloud Function via HTTP:", functionUrl)

    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: { userId: session.userId }
      })
    })

    if (!response.ok) {
      console.error("[getUserUsageAction] HTTP error:", response.status, response.statusText)
      const errorText = await response.text()
      console.error("[getUserUsageAction] Error response:", errorText)
      return { isSuccess: false, message: "Failed to get usage statistics" }
    }

    const responseData = await response.json()
    const usageData = responseData.result as UsageStats

    if (!usageData) {
      console.error("[getUserUsageAction] No result data in response:", responseData)
      return { isSuccess: false, message: "Invalid response from service" }
    }

    console.log("[getUserUsageAction] Usage statistics retrieved")

    return {
      isSuccess: true,
      message: "Usage statistics retrieved successfully",
      data: usageData
    }
  } catch (error: any) {
    console.error("[getUserUsageAction] Error getting usage statistics:", error)
    
    // Handle network errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return { 
        isSuccess: false, 
        message: "Network error. Please check your connection and try again." 
      }
    }
    
    const errorMessage = error.message || "An unexpected error occurred."
    return {
      isSuccess: false,
      message: `Failed to get usage statistics: ${errorMessage}`
    }
  }
}

/**
 * Log suggestion acceptance/dismissal
 */
export async function logSuggestionInteractionAction(
  action: "accept" | "dismiss",
  suggestionId: string,
  metadata?: Record<string, any>
): Promise<ActionState<undefined>> {
  console.log("[logSuggestionInteractionAction] Logging suggestion interaction:", action)
  console.log("[logSuggestionInteractionAction] Suggestion ID:", suggestionId)
  
  try {
    // Check authentication
    const session = await auth()
    if (!session || !session.userId) {
      console.error("[logSuggestionInteractionAction] No authenticated session")
      return { isSuccess: false, message: "Authentication required" }
    }

    // Import logging action to avoid circular dependencies
    const { logSuggestionEventAction } = await import("@/actions/db/logs-actions")
    
    // Log the interaction
    const result = await logSuggestionEventAction(session.userId, action, {
      suggestionId,
      timestamp: new Date().toISOString(),
      ...metadata
    })

    if (result.isSuccess) {
      console.log("[logSuggestionInteractionAction] Interaction logged successfully")
      return {
        isSuccess: true,
        message: `Suggestion ${action} logged successfully`,
        data: undefined
      }
    } else {
      console.error("[logSuggestionInteractionAction] Failed to log interaction:", result.message)
      return result
    }

  } catch (error) {
    console.error("[logSuggestionInteractionAction] Error logging interaction:", error)
    return { 
      isSuccess: false, 
      message: "Failed to log suggestion interaction" 
    }
  }
}

