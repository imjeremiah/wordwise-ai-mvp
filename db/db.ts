/*
<ai_context>
Initializes the Firebase Firestore database connection for the app.
</ai_context>
*/

import { adminDb } from "@/lib/firebase-config"

// Log initialization status
if (adminDb) {
  console.log("[DB] Firebase Firestore initialized")
} else {
  console.warn("[DB] Firebase Firestore not available - adminDb is null")
  console.warn(
    "[DB] Database operations will not work without proper Firebase configuration"
  )
}

// Export the Firestore instance (may be null if Firebase is not configured)
export const db = adminDb

// Collection references for WordWise AI
export const collections = {
  // User management collections
  profiles: "profiles",
  users: "users",

  // WordWise AI core collections
  documents: "documents", // User writing documents
  logs: "logs", // Application logging and monitoring

  // Legacy collections (keeping for compatibility)
  todos: "todos",
  chats: "chats",
  messages: "messages"
}

console.log("[DB] Available collections:", Object.keys(collections))
