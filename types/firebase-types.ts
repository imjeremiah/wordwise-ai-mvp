export interface FirebaseProfile {
  id?: string
  userId: string
  email: string
  displayName?: string
  photoURL?: string
  membership: "free" | "pro"
  stripeCustomerId?: string
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

// Helper type for Firestore timestamps
export type FirestoreTimestamp = {
  seconds: number
  nanoseconds: number
  toDate: () => Date
}
