/*
<ai_context>
WordWise AI Application Logger
Centralized logging utility for monitoring user actions, performance, and errors.
Integrates with Firebase Firestore for persistent logging with automatic cleanup.
</ai_context>
*/

import {
  logAuthEventAction,
  logDocumentEventAction,
  logSuggestionEventAction,
  logErrorEventAction,
  logPerformanceEventAction
} from "@/actions/db/logs-actions"

// Generate session ID for tracking user sessions
export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
}

// Logger class for structured logging
export class AppLogger {
  private sessionId: string
  private uid?: string

  constructor(uid?: string, sessionId?: string) {
    this.uid = uid
    this.sessionId = sessionId || generateSessionId()
    console.log(
      `[AppLogger] Initialized for user: ${uid || "anonymous"}, session: ${this.sessionId}`
    )
  }

  // Update user ID when user logs in/out
  setUser(uid?: string) {
    console.log(`[AppLogger] Setting user ID: ${uid || "anonymous"}`)
    this.uid = uid
  }

  // Log authentication events
  async logAuth(
    action: "login" | "logout" | "signup" | "password_reset",
    metadata?: Record<string, any>
  ) {
    if (!this.uid) {
      console.warn("[AppLogger] Cannot log auth event without user ID")
      return
    }

    console.log(`[AppLogger] Auth: ${action} for user ${this.uid}`)
    try {
      await logAuthEventAction(this.uid, action, this.sessionId, {
        ...metadata,
        timestamp: new Date().toISOString(),
        userAgent:
          typeof window !== "undefined" ? window.navigator.userAgent : "server"
      })
    } catch (error) {
      console.error("[AppLogger] Failed to log auth event:", error)
    }
  }

  // Log document operations
  async logDocument(
    action: "create" | "read" | "update" | "delete",
    documentId?: string,
    metadata?: Record<string, any>
  ) {
    if (!this.uid) {
      console.warn("[AppLogger] Cannot log document event without user ID")
      return
    }

    console.log(
      `[AppLogger] Document: ${action} for user ${this.uid}, doc: ${documentId || "unknown"}`
    )
    try {
      await logDocumentEventAction(this.uid, action, documentId, {
        ...metadata,
        sessionId: this.sessionId,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error("[AppLogger] Failed to log document event:", error)
    }
  }

  // Log AI suggestion events
  async logSuggestion(
    action: "request" | "accept" | "dismiss",
    metadata?: Record<string, any>
  ) {
    if (!this.uid) {
      console.warn("[AppLogger] Cannot log suggestion event without user ID")
      return
    }

    console.log(`[AppLogger] Suggestion: ${action} for user ${this.uid}`)
    try {
      await logSuggestionEventAction(this.uid, action, {
        ...metadata,
        sessionId: this.sessionId,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error("[AppLogger] Failed to log suggestion event:", error)
    }
  }

  // Log errors with context
  async logError(error: string | Error, metadata?: Record<string, any>) {
    const errorMessage = error instanceof Error ? error.message : error
    const stack = error instanceof Error ? error.stack : undefined

    console.error(`[AppLogger] Error: ${errorMessage}`)
    try {
      await logErrorEventAction(errorMessage, this.uid, {
        ...metadata,
        sessionId: this.sessionId,
        stack,
        timestamp: new Date().toISOString(),
        url: typeof window !== "undefined" ? window.location.href : "server"
      })
    } catch (logError) {
      console.error("[AppLogger] Failed to log error event:", logError)
    }
  }

  // Log performance metrics
  async logPerformance(
    operation: string,
    duration: number,
    metadata?: Record<string, any>
  ) {
    console.log(`[AppLogger] Performance: ${operation} took ${duration}ms`)
    try {
      await logPerformanceEventAction(operation, duration, this.uid, {
        ...metadata,
        sessionId: this.sessionId,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error("[AppLogger] Failed to log performance event:", error)
    }
  }

  // Utility: Measure and log function execution time
  async measureAsync<T>(
    operation: string,
    fn: () => Promise<T>,
    metadata?: Record<string, any>
  ): Promise<T> {
    const startTime = Date.now()
    console.log(`[AppLogger] Starting operation: ${operation}`)

    try {
      const result = await fn()
      const duration = Date.now() - startTime
      await this.logPerformance(operation, duration, metadata)
      return result
    } catch (error) {
      const duration = Date.now() - startTime
      await this.logError(`Operation failed: ${operation}`, {
        ...metadata,
        duration,
        error: error instanceof Error ? error.message : String(error)
      })
      throw error
    }
  }

  // Utility: Measure and log synchronous function execution time
  measure<T>(
    operation: string,
    fn: () => T,
    metadata?: Record<string, any>
  ): T {
    const startTime = Date.now()
    console.log(`[AppLogger] Starting sync operation: ${operation}`)

    try {
      const result = fn()
      const duration = Date.now() - startTime
      // Fire and forget for sync operations
      this.logPerformance(operation, duration, metadata).catch(error =>
        console.error("[AppLogger] Failed to log sync performance:", error)
      )
      return result
    } catch (error) {
      const duration = Date.now() - startTime
      // Fire and forget for sync operations
      this.logError(`Sync operation failed: ${operation}`, {
        ...metadata,
        duration,
        error: error instanceof Error ? error.message : String(error)
      }).catch(logError =>
        console.error("[AppLogger] Failed to log sync error:", logError)
      )
      throw error
    }
  }
}

// Global logger instance - can be used throughout the app
export const globalLogger = new AppLogger()

// Convenience functions for quick logging
export const logger = {
  // Quick auth logging
  auth: (
    action: "login" | "logout" | "signup" | "password_reset",
    uid: string,
    metadata?: Record<string, any>
  ) => {
    globalLogger.setUser(uid)
    return globalLogger.logAuth(action, metadata)
  },

  // Quick document logging
  document: (
    action: "create" | "read" | "update" | "delete",
    uid: string,
    documentId?: string,
    metadata?: Record<string, any>
  ) => {
    globalLogger.setUser(uid)
    return globalLogger.logDocument(action, documentId, metadata)
  },

  // Quick suggestion logging
  suggestion: (
    action: "request" | "accept" | "dismiss",
    uid: string,
    metadata?: Record<string, any>
  ) => {
    globalLogger.setUser(uid)
    return globalLogger.logSuggestion(action, metadata)
  },

  // Quick error logging
  error: (
    error: string | Error,
    uid?: string,
    metadata?: Record<string, any>
  ) => {
    globalLogger.setUser(uid)
    return globalLogger.logError(error, metadata)
  },

  // Quick performance logging
  performance: (
    operation: string,
    duration: number,
    uid?: string,
    metadata?: Record<string, any>
  ) => {
    globalLogger.setUser(uid)
    return globalLogger.logPerformance(operation, duration, metadata)
  }
}

// Export performance measurement utilities
export const measure = {
  async: <T>(
    operation: string,
    fn: () => Promise<T>,
    uid?: string,
    metadata?: Record<string, any>
  ) => {
    const tempLogger = new AppLogger(uid)
    return tempLogger.measureAsync(operation, fn, metadata)
  },

  sync: <T>(
    operation: string,
    fn: () => T,
    uid?: string,
    metadata?: Record<string, any>
  ) => {
    const tempLogger = new AppLogger(uid)
    return tempLogger.measure(operation, fn, metadata)
  }
}
