"use server"

import { db, collections } from "@/db/db"
import { FirebaseLog } from "@/types/firebase-types"
import { ActionState } from "@/types"
import { FieldValue } from 'firebase-admin/firestore'

// Create a log entry
export async function createLogAction(
  data: Omit<FirebaseLog, 'id' | 'timestamp' | 'ttl'>
): Promise<ActionState<FirebaseLog>> {
  console.log("[createLogAction] Creating log entry:", data.eventType, data.payload?.action)
  
  try {
    if (!db) {
      console.error("[createLogAction] Firestore is not initialized")
      return { isSuccess: false, message: "Database connection failed" }
    }

    // Set TTL to 30 days from now for automatic cleanup
    const now = new Date()
    const ttl = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000)) // 30 days

    const logData = {
      ...data,
      timestamp: FieldValue.serverTimestamp(),
      ttl: ttl
    }
    
    const docRef = await db.collection(collections.logs).add(logData)
    const newLog = await docRef.get()
    const logWithId = { id: docRef.id, ...newLog.data() } as FirebaseLog
    
    console.log("[createLogAction] Log entry created successfully with ID:", docRef.id)
    return {
      isSuccess: true,
      message: "Log entry created successfully",
      data: logWithId
    }
  } catch (error) {
    console.error("[createLogAction] Error creating log entry:", error)
    return { isSuccess: false, message: "Failed to create log entry" }
  }
}

// Get logs for a user (for debugging/analytics)
export async function getUserLogsAction(
  uid: string,
  eventType?: FirebaseLog['eventType'],
  limit: number = 50
): Promise<ActionState<FirebaseLog[]>> {
  console.log("[getUserLogsAction] Fetching logs for user:", uid, "type:", eventType)
  
  try {
    if (!db) {
      console.error("[getUserLogsAction] Firestore is not initialized")
      return { isSuccess: false, message: "Database connection failed" }
    }

    let query = db
      .collection(collections.logs)
      .where('uid', '==', uid)
      .orderBy('timestamp', 'desc')
      .limit(limit)

    if (eventType) {
      query = query.where('eventType', '==', eventType)
    }

    const snapshot = await query.get()
    
    const logs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as FirebaseLog[]
    
    console.log("[getUserLogsAction] Found", logs.length, "logs for user")
    
    return {
      isSuccess: true,
      message: "Logs fetched successfully",
      data: logs
    }
  } catch (error) {
    console.error("[getUserLogsAction] Error fetching logs:", error)
    return { isSuccess: false, message: "Failed to fetch logs" }
  }
}

// Get recent logs (for admin monitoring)
export async function getRecentLogsAction(
  eventType?: FirebaseLog['eventType'],
  limit: number = 100
): Promise<ActionState<FirebaseLog[]>> {
  console.log("[getRecentLogsAction] Fetching recent logs, type:", eventType)
  
  try {
    if (!db) {
      console.error("[getRecentLogsAction] Firestore is not initialized")
      return { isSuccess: false, message: "Database connection failed" }
    }

    let query = db
      .collection(collections.logs)
      .orderBy('timestamp', 'desc')
      .limit(limit)

    if (eventType) {
      query = query.where('eventType', '==', eventType)
    }

    const snapshot = await query.get()
    
    const logs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as FirebaseLog[]
    
    console.log("[getRecentLogsAction] Found", logs.length, "recent logs")
    
    return {
      isSuccess: true,
      message: "Logs fetched successfully",
      data: logs
    }
  } catch (error) {
    console.error("[getRecentLogsAction] Error fetching recent logs:", error)
    return { isSuccess: false, message: "Failed to fetch logs" }
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