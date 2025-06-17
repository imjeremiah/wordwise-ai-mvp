export interface FirebaseProfile {
  id?: string
  userId: string
  email: string
  displayName?: string
  photoURL?: string
  membership: "free" | "pro"
  stripeCustomerId?: string
  stripeSubscriptionId?: string
  createdAt: Date | string
  updatedAt: Date | string
}

export interface FirebaseUser {
  id?: string
  uid: string
  email: string
  displayName?: string
  photoURL?: string
  emailVerified: boolean
  phoneNumber?: string
  createdAt: Date | string
  lastLoginAt: Date | string
}

export interface FirebaseTodo {
  id?: string
  userId: string
  content: string
  completed: boolean
  createdAt: Date | string
  updatedAt: Date | string
}

export interface FirebaseChat {
  id?: string
  userId: string
  name: string
  createdAt: Date | string
  updatedAt: Date | string
}

export interface FirebaseMessage {
  id?: string
  chatId: string
  content: string
  role: "assistant" | "user"
  createdAt: Date | string
  updatedAt: Date | string
}

// WordWise AI Document type for user writing documents
export interface FirebaseDocument {
  id?: string
  ownerUID: string // Firebase user UID
  title: string
  content: string
  wordCount: number
  readabilityScore?: number // Flesch-Kincaid grade level
  lastSuggestionCount?: number
  createdAt: Date | string // Support both Date (server) and string (client)
  updatedAt: Date | string // Support both Date (server) and string (client)
}

// Application logging for monitoring and analytics
export interface FirebaseLog {
  id?: string
  eventType: "auth" | "document" | "suggestion" | "error" | "performance"
  uid?: string // Optional - some events may not have a user context
  sessionId?: string
  timestamp: Date | string
  payload: {
    action?: string
    details?: any
    error?: string
    performance?: {
      duration: number
      operation: string
    }
    metadata?: Record<string, any>
  }
  ttl?: Date | string // For automatic cleanup after 30 days
}

// Helper type for Firestore timestamps
export type FirestoreTimestamp = {
  seconds: number
  nanoseconds: number
  toDate: () => Date
}

// Type for serialized Firebase documents (for client-side use)
export interface SerializedFirebaseDocument
  extends Omit<FirebaseDocument, "createdAt" | "updatedAt"> {
  createdAt: string
  updatedAt: string
}

// Type for serialized Firebase logs (for client-side use)
export interface SerializedFirebaseLog
  extends Omit<FirebaseLog, "timestamp" | "ttl"> {
  timestamp: string
  ttl?: string
}
