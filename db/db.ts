/*
<ai_context>
Initializes the Firebase Firestore database connection for the app.
</ai_context>
*/

import { adminDb } from "@/lib/firebase-config"

console.log("[DB] Firebase Firestore initialized")

// Export the Firestore instance
export const db = adminDb

// Collection references
export const collections = {
  profiles: "profiles",
  users: "users",
  todos: "todos",
  chats: "chats",
  messages: "messages"
}

console.log("[DB] Available collections:", Object.keys(collections))
