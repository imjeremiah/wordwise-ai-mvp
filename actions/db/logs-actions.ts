"use server"

import { db, collections } from "@/db/db"
import { FirebaseLog } from "@/types/firebase-types"
import { ActionState } from "@/types"
import { FieldValue } from 'firebase-admin/firestore'
import { serializeFirebaseDocument } from "@/lib/utils"

// Create a log entry
export async function createLogAction(
  data: Omit<FirebaseLog, 'id' | 'timestamp' | 'ttl'>
): Promise<ActionState<FirebaseLog>> {
  console.log("[createLogAction] Creating log entry for event:", data.eventType)
  
  try {
    // Validate required fields
    if (!data.eventType) {
      console.error("[createLogAction] Missing eventType")
      return { isSuccess: false, message: "Event type is required" }
    }

    if (!data.payload) {
      console.error("[createLogAction] Missing payload")
      return { isSuccess: false, message: "Payload is required" }
    }

    if (!db) {
      console.error("[createLogAction] Firestore is not initialized")
      return { isSuccess: false, message: "Database connection failed - Please check Firebase configuration" }
    }

    // Set TTL for 30 days from now
    const ttlDate = new Date()
    ttlDate.setDate(ttlDate.getDate() + 30)

    const logData = {
      ...data,
      timestamp: FieldValue.serverTimestamp(),
      ttl: FieldValue.serverTimestamp() // Will be updated to TTL date
    }
    
    console.log("[createLogAction] Creating log entry in Firestore")
    const docRef = await db.collection(collections.logs).add(logData)
    
    // Update with proper TTL
    await docRef.update({ ttl: ttlDate })
    
    const newLog = await docRef.get()
    
    if (!newLog.exists) {
      console.error("[createLogAction] Log creation failed - log not found after creation")
      return { isSuccess: false, message: "Failed to create log entry" }
    }

    const logWithId = { id: docRef.id, ...newLog.data() } as FirebaseLog
    
    // Serialize the log for client transfer
    const serializedLog = serializeFirebaseDocument(logWithId)
    
    console.log("[createLogAction] Log entry created successfully with ID:", docRef.id)
    return {
      isSuccess: true,
      message: "Log entry created successfully",
      data: serializedLog
    }
  } catch (error) {
    console.error("[createLogAction] Error creating log entry:", error)
    return { isSuccess: false, message: "Failed to create log entry - Please try again" }
  }
}

// Get logs for a specific user
export async function getUserLogsAction(
  uid: string | null,
  eventType?: string,
  limit: number = 50
): Promise<ActionState<FirebaseLog[]>> {
  console.log("[getUserLogsAction] Fetching logs for user:", uid, "eventType:", eventType)
  
  try {
    // Validate input
    if (!uid) {
      console.error("[getUserLogsAction] Missing or null uid")
      return { isSuccess: false, message: "User ID is required" }
    }

    if (!db) {
      console.error("[getUserLogsAction] Firestore is not initialized")
      return { isSuccess: false, message: "Database connection failed - Please check Firebase configuration" }
    }

    let query = db
      .collection(collections.logs)
      .where('uid', '==', uid)
      .orderBy('timestamp', 'desc')
      .limit(limit)

    if (eventType) {
      query = query.where('eventType', '==', eventType)
    }

    console.log("[getUserLogsAction] Querying Firestore for logs...")
    const snapshot = await query.get()
    
    console.log("[getUserLogsAction] Query completed, processing", snapshot.docs.length, "logs")
    
    const logs = snapshot.docs.map(doc => {
      const logData = { id: doc.id, ...doc.data() } as FirebaseLog
      console.log("[getUserLogsAction] Processing log:", doc.id)
      
      // Serialize each log for client transfer
      return serializeFirebaseDocument(logData)
    })
    
    console.log("[getUserLogsAction] Found", logs.length, "logs for user")
    
    return {
      isSuccess: true,
      message: "Logs fetched successfully",
      data: logs
    }
  } catch (error) {
    console.error("[getUserLogsAction] Error fetching logs:", error)
    console.error("[getUserLogsAction] Error details:", {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      uid,
      eventType
    })
    return { isSuccess: false, message: "Failed to fetch logs - Please try again" }
  }
}

// Get recent logs (for admin/monitoring)
export async function getRecentLogsAction(
  eventType?: string,
  limit: number = 100
): Promise<ActionState<FirebaseLog[]>> {
  console.log("[getRecentLogsAction] Fetching recent logs, eventType:", eventType)
  
  try {
    if (!db) {
      console.error("[getRecentLogsAction] Firestore is not initialized")
      return { isSuccess: false, message: "Database connection failed - Please check Firebase configuration" }
    }

    let query = db
      .collection(collections.logs)
      .orderBy('timestamp', 'desc')
      .limit(limit)

    if (eventType) {
      query = query.where('eventType', '==', eventType)
    }

    console.log("[getRecentLogsAction] Querying Firestore for recent logs...")
    const snapshot = await query.get()
    
    console.log("[getRecentLogsAction] Query completed, processing", snapshot.docs.length, "logs")
    
    const logs = snapshot.docs.map(doc => {
      const logData = { id: doc.id, ...doc.data() } as FirebaseLog
      console.log("[getRecentLogsAction] Processing log:", doc.id)
      
      // Serialize each log for client transfer
      return serializeFirebaseDocument(logData)
    })
    
    console.log("[getRecentLogsAction] Found", logs.length, "recent logs")
    
    return {
      isSuccess: true,
      message: "Recent logs fetched successfully",
      data: logs
    }
  } catch (error) {
    console.error("[getRecentLogsAction] Error fetching recent logs:", error)
    return { isSuccess: false, message: "Failed to fetch recent logs - Please try again" }
  }
}

// Delete old logs (cleanup utility)
export async function cleanupOldLogsAction(): Promise<ActionState<number>> {
  console.log("[cleanupOldLogsAction] Starting cleanup of old log entries")
  
  try {
    if (!db) {
      console.error("[cleanupOldLogsAction] Firestore is not initialized")
      return { isSuccess: false, message: "Database connection failed - Please check Firebase configuration" }
    }

    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - 30) // 30 days ago

    console.log("[cleanupOldLogsAction] Querying logs older than:", cutoffDate.toISOString())
    const snapshot = await db
      .collection(collections.logs)
      .where('timestamp', '<', cutoffDate)
      .limit(500) // Process in batches
      .get()
    
    const deletePromises = snapshot.docs.map(doc => doc.ref.delete())
    await Promise.all(deletePromises)
    
    const deletedCount = snapshot.docs.length
    
    console.log("[cleanupOldLogsAction] Deleted", deletedCount, "old log entries")
    
    return {
      isSuccess: true,
      message: `Cleaned up ${deletedCount} old log entries`,
      data: deletedCount
    }
  } catch (error) {
    console.error("[cleanupOldLogsAction] Error cleaning up old logs:", error)
    return { isSuccess: false, message: "Failed to cleanup old logs - Please try again" }
  }
}

// Utility function: Log authentication events
export async function logAuthEventAction(
  uid: string,
  action: 'login' | 'logout' | 'signup' | 'password_reset',
  sessionId?: string,
  metadata?: Record<string, any>
): Promise<ActionState<FirebaseLog>> {
  console.log("[logAuthEventAction] Logging auth event:", action, "for user:", uid)
  
  return createLogAction({
    eventType: 'auth',
    uid,
    sessionId,
    payload: {
      action,
      metadata
    }
  })
}

// Utility function: Log document events
export async function logDocumentEventAction(
  uid: string,
  action: 'create' | 'read' | 'update' | 'delete',
  documentId?: string,
  metadata?: Record<string, any>
): Promise<ActionState<FirebaseLog>> {
  console.log("[logDocumentEventAction] Logging document event:", action, "for user:", uid)
  
  return createLogAction({
    eventType: 'document',
    uid,
    payload: {
      action,
      details: { documentId },
      metadata
    }
  })
}

// Utility function: Log suggestion events
export async function logSuggestionEventAction(
  uid: string,
  action: 'request' | 'accept' | 'dismiss',
  metadata?: Record<string, any>
): Promise<ActionState<FirebaseLog>> {
  console.log("[logSuggestionEventAction] Logging suggestion event:", action, "for user:", uid)
  
  return createLogAction({
    eventType: 'suggestion',
    uid,
    payload: {
      action,
      metadata
    }
  })
}

// Utility function: Log errors
export async function logErrorEventAction(
  error: string,
  uid?: string,
  metadata?: Record<string, any>
): Promise<ActionState<FirebaseLog>> {
  console.log("[logErrorEventAction] Logging error:", error)
  
  return createLogAction({
    eventType: 'error',
    uid,
    payload: {
      error,
      metadata
    }
  })
}

// Utility function: Log performance metrics
export async function logPerformanceEventAction(
  operation: string,
  duration: number,
  uid?: string,
  metadata?: Record<string, any>
): Promise<ActionState<FirebaseLog>> {
  console.log("[logPerformanceEventAction] Logging performance:", operation, duration + "ms")
  
  return createLogAction({
    eventType: 'performance',
    uid,
    payload: {
      performance: {
        operation,
        duration
      },
      metadata
    }
  })
} 