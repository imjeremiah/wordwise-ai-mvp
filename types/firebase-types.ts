export interface FirebaseProfile {
  id?: string
  userId: string
  email: string
  displayName?: string
  photoURL?: string
  membership: "free" | "pro"
  stripeCustomerId?: string
  stripeSubscriptionId?: string
  createdAt: Date
  updatedAt: Date
}

export interface FirebaseUser {
  id?: string
  uid: string
  email: string
  displayName?: string
  photoURL?: string
  emailVerified: boolean
  phoneNumber?: string
  createdAt: Date
  lastLoginAt: Date
}

export interface FirebaseTodo {
  id?: string
  userId: string
  content: string
  completed: boolean
  createdAt: Date
  updatedAt: Date
}

export interface FirebaseChat {
  id?: string
  userId: string
  name: string
  createdAt: Date
  updatedAt: Date
}

export interface FirebaseMessage {
  id?: string
  chatId: string
  content: string
  role: "assistant" | "user"
  createdAt: Date
  updatedAt: Date
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
  createdAt: Date
  updatedAt: Date
}

// Application logging for monitoring and analytics
export interface FirebaseLog {
  id?: string
  eventType: "auth" | "document" | "suggestion" | "error" | "performance"
  uid?: string // Optional - some events may not have a user context
  sessionId?: string
  timestamp: Date
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
  ttl?: Date // For automatic cleanup after 30 days
}

// Helper type for Firestore timestamps
export type FirestoreTimestamp = {
  seconds: number
  nanoseconds: number
  toDate: () => Date
}
