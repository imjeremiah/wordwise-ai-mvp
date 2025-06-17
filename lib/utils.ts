/*
<ai_context>
Contains the utility functions for the app.
</ai_context>
*/

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Firebase timestamp conversion utilities
export function convertFirebaseTimestamp(timestamp: any): string {
  console.log("[Utils] Converting Firebase timestamp:", timestamp)

  // Handle Firebase Timestamp objects with _seconds and _nanoseconds
  if (timestamp && typeof timestamp === "object" && "_seconds" in timestamp) {
    console.log("[Utils] Converting Firebase Timestamp object to ISO string")
    const date = new Date(
      timestamp._seconds * 1000 + timestamp._nanoseconds / 1000000
    )
    return date.toISOString()
  }

  // Handle Firebase admin Timestamp objects with seconds and nanoseconds
  if (timestamp && typeof timestamp === "object" && "seconds" in timestamp) {
    console.log(
      "[Utils] Converting Firebase admin Timestamp object to ISO string"
    )
    const date = new Date(
      timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000
    )
    return date.toISOString()
  }

  // Handle Date objects
  if (timestamp instanceof Date) {
    console.log("[Utils] Converting Date object to ISO string")
    return timestamp.toISOString()
  }

  // Handle already serialized strings
  if (typeof timestamp === "string") {
    console.log("[Utils] Timestamp is already a string")
    return timestamp
  }

  // Fallback to current time if timestamp is invalid
  console.warn("[Utils] Invalid timestamp, using current time:", timestamp)
  return new Date().toISOString()
}

// Convert a Firebase document for client serialization
export function serializeFirebaseDocument(doc: any): any {
  console.log("[Utils] Serializing Firebase document for client transfer")

  if (!doc) {
    console.warn("[Utils] Document is null or undefined")
    return null
  }

  const serialized = { ...doc }

  // Convert timestamp fields
  if (serialized.createdAt) {
    serialized.createdAt = convertFirebaseTimestamp(serialized.createdAt)
  }

  if (serialized.updatedAt) {
    serialized.updatedAt = convertFirebaseTimestamp(serialized.updatedAt)
  }

  // Convert any other timestamp fields that might exist
  if (serialized.lastLoginAt) {
    serialized.lastLoginAt = convertFirebaseTimestamp(serialized.lastLoginAt)
  }

  if (serialized.timestamp) {
    serialized.timestamp = convertFirebaseTimestamp(serialized.timestamp)
  }

  if (serialized.ttl) {
    serialized.ttl = convertFirebaseTimestamp(serialized.ttl)
  }

  console.log("[Utils] Document serialized successfully")
  return serialized
}
