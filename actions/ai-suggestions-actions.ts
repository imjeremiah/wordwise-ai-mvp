"use server"

/*
<ai_context>
AI Suggestions Actions for WordWise AI
Connects frontend to Firebase Cloud Functions for grammar and style analysis
Handles caching, rate limiting, and error management
</ai_context>
*/

import { auth } from "@/lib/firebase-auth"
import { adminAuth } from "@/lib/firebase-config"
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
  console.log("[getAISuggestionsAction] Text length:", text.length)
  console.log("[getAISuggestionsAction] Document ID:", documentId)
  
  const startTime = Date.now()
  
  try {
    // Check authentication
    const session = await auth()
    if (!session || !session.userId) {
      console.error("[getAISuggestionsAction] No authenticated session")
      return { isSuccess: false, message: "Authentication required" }
    }

    console.log("[getAISuggestionsAction] Authenticated user:", session.userId)

    // Validate input
    if (!text || text.trim().length === 0) {
      console.log("[getAISuggestionsAction] Empty text provided")
      return { isSuccess: false, message: "Text content is required" }
    }

    if (text.length > 10000) {
      console.error("[getAISuggestionsAction] Text too long:", text.length)
      return { isSuccess: false, message: "Text must be less than 10,000 characters" }
    }

    // Check if Firebase Admin is available
    if (!adminAuth) {
      console.error("[getAISuggestionsAction] Firebase Admin not initialized")
      return { isSuccess: false, message: "AI service unavailable - Firebase not configured" }
    }

    // Create custom token and exchange it for an ID token
    console.log("[getAISuggestionsAction] Creating custom token for user:", session.userId)
    const customToken = await adminAuth.createCustomToken(session.userId)
    console.log("[getAISuggestionsAction] Custom token created successfully")

    // Exchange custom token for ID token using Firebase Auth REST API
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY
    
    if (!projectId || !apiKey) {
      console.error("[getAISuggestionsAction] Firebase config not complete")
      return { isSuccess: false, message: "AI service unavailable - Firebase not configured" }
    }

    console.log("[getAISuggestionsAction] Exchanging custom token for ID token")
    const tokenExchangeResponse = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: customToken,
        returnSecureToken: true
      })
    })

    if (!tokenExchangeResponse.ok) {
      const errorText = await tokenExchangeResponse.text()
      console.error("[getAISuggestionsAction] Token exchange failed:", errorText)
      return { isSuccess: false, message: "Authentication failed" }
    }

    const tokenData = await tokenExchangeResponse.json()
    const idToken = tokenData.idToken

    if (!idToken) {
      console.error("[getAISuggestionsAction] No ID token received")
      return { isSuccess: false, message: "Authentication failed" }
    }

    console.log("[getAISuggestionsAction] ID token obtained successfully")

    // Prepare request data
    const functionData = {
      text: text.trim(),
      userId: session.userId,
      documentId,
      language: 'en'
    }

    // Cloud Functions endpoint URL for callable functions
    const functionUrl = `https://us-central1-${projectId}.cloudfunctions.net/analyzeSuggestions`
    console.log("[getAISuggestionsAction] Making HTTP request to:", functionUrl)

    // Make authenticated HTTP request to Cloud Function with ID token
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`,
      },
      body: JSON.stringify({ data: functionData })
    })

    console.log("[getAISuggestionsAction] HTTP response status:", response.status)
    console.log("[getAISuggestionsAction] HTTP response headers:", Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[getAISuggestionsAction] HTTP error response:", errorText)
      
      if (response.status === 401) {
        return { isSuccess: false, message: "Authentication failed" }
      }
      if (response.status === 403) {
        return { isSuccess: false, message: "Access denied" }
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
    console.log("[getAISuggestionsAction] Cached:", suggestionsData.cached)
    console.log("[getAISuggestionsAction] Readability score:", suggestionsData.readabilityScore)

    // Log the request duration
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
    console.error("[getAISuggestionsAction] Error getting AI suggestions:", error)
    console.error("[getAISuggestionsAction] Error message:", error.message)
    console.error("[getAISuggestionsAction] Total time before error:", totalTime + "ms")

    // Handle network errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return { 
        isSuccess: false, 
        message: "Network error. Please check your connection and try again." 
      }
    }

    return { 
      isSuccess: false, 
      message: "Failed to analyze text. Please try again." 
    }
  }
}

/**
 * Get user's AI usage statistics
 */
export async function getUserUsageAction(): Promise<ActionState<UsageStats>> {
  console.log("[getUserUsageAction] Getting user usage statistics")
  
  try {
    // Check authentication
    const session = await auth()
    if (!session || !session.userId) {
      console.error("[getUserUsageAction] No authenticated session")
      return { isSuccess: false, message: "Authentication required" }
    }

    console.log("[getUserUsageAction] Getting usage for user:", session.userId)

    // Check if Firebase Admin is available
    if (!adminAuth) {
      console.error("[getUserUsageAction] Firebase Admin not initialized")
      return { isSuccess: false, message: "Service unavailable - Firebase not configured" }
    }

    // Create custom token and exchange it for an ID token
    console.log("[getUserUsageAction] Creating custom token for user:", session.userId)
    const customToken = await adminAuth.createCustomToken(session.userId)
    console.log("[getUserUsageAction] Custom token created successfully")

    // Exchange custom token for ID token using Firebase Auth REST API
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY
    
    if (!projectId || !apiKey) {
      console.error("[getUserUsageAction] Firebase config not complete")
      return { isSuccess: false, message: "Service unavailable - Firebase not configured" }
    }

    console.log("[getUserUsageAction] Exchanging custom token for ID token")
    const tokenExchangeResponse = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: customToken,
        returnSecureToken: true
      })
    })

    if (!tokenExchangeResponse.ok) {
      const errorText = await tokenExchangeResponse.text()
      console.error("[getUserUsageAction] Token exchange failed:", errorText)
      return { isSuccess: false, message: "Authentication failed" }
    }

    const tokenData = await tokenExchangeResponse.json()
    const idToken = tokenData.idToken

    if (!idToken) {
      console.error("[getUserUsageAction] No ID token received")
      return { isSuccess: false, message: "Authentication failed" }
    }

    console.log("[getUserUsageAction] ID token obtained successfully")

    // Cloud Functions endpoint URL
    const functionUrl = `https://us-central1-${projectId}.cloudfunctions.net/getUserUsage`
    console.log("[getUserUsageAction] Making HTTP request to:", functionUrl)

    // Make authenticated HTTP request to Cloud Function with ID token
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`,
      },
      body: JSON.stringify({ data: { userId: session.userId } })
    })

    console.log("[getUserUsageAction] HTTP response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[getUserUsageAction] HTTP error response:", errorText)
      return { isSuccess: false, message: "Failed to get usage statistics" }
    }

    const responseData = await response.json()
    const usageData = responseData.result as UsageStats

    if (!usageData) {
      console.error("[getUserUsageAction] No result data in response:", responseData)
      return { isSuccess: false, message: "Invalid response from service" }
    }

    console.log("[getUserUsageAction] Usage statistics retrieved:")
    console.log("[getUserUsageAction] Monthly:", usageData.monthly)
    console.log("[getUserUsageAction] Daily:", usageData.daily)
    console.log("[getUserUsageAction] Hourly:", usageData.hourly)

    return {
      isSuccess: true,
      message: "Usage statistics retrieved successfully",
      data: usageData
    }

  } catch (error: any) {
    console.error("[getUserUsageAction] Error getting usage statistics:", error)
    
    return { 
      isSuccess: false, 
      message: "Failed to get usage statistics" 
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

