"use client"

import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth, connectAuthEmulator } from "firebase/auth"
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore"
import { getStorage, connectStorageEmulator } from "firebase/storage"
import { getAnalytics, isSupported } from "firebase/analytics"
import { getFunctions, connectFunctionsEmulator } from "firebase/functions"

// Firebase configuration - these should be set in your environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "dummy-api-key",
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ||
    "dummy-project.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "dummy-project",
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    "dummy-project.appspot.com",
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId:
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:123456789:web:dummy-app-id"
}

// Check if we have real Firebase credentials
const hasRealCredentials = !!(
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
  process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
)

console.log("[Firebase Client] Initializing Firebase with config:", {
  ...firebaseConfig,
  apiKey: "***", // Hide API key in logs
  hasRealCredentials
})

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig)
console.log("[Firebase Client] Firebase app initialized")

// Initialize services
const auth = getAuth(app)
console.log("[Firebase Client] Auth service initialized")

const db = getFirestore(app)
console.log("[Firebase Client] Firestore service initialized")

const storage = getStorage(app)
console.log("[Firebase Client] Storage service initialized")

const functions = getFunctions(app, "us-central1")
console.log("[Firebase Client] Functions service initialized")

// Initialize Analytics (only in browser and with real credentials)
if (typeof window !== "undefined" && hasRealCredentials) {
  isSupported().then(supported => {
    if (supported) {
      const analytics = getAnalytics(app)
      console.log("[Firebase Client] Analytics initialized")
    } else {
      console.log(
        "[Firebase Client] Analytics not supported in this environment"
      )
    }
  })
}

// Connect to emulators if in development and using emulators
if (
  process.env.NODE_ENV === "development" &&
  process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === "true"
) {
  console.log("[Firebase Client] Connecting to Firebase emulators...")

  try {
    connectAuthEmulator(auth, "http://localhost:9099")
    console.log("[Firebase Client] Connected to Auth emulator")

    connectFirestoreEmulator(db, "localhost", 8080)
    console.log("[Firebase Client] Connected to Firestore emulator")

    connectStorageEmulator(storage, "localhost", 9199)
    console.log("[Firebase Client] Connected to Storage emulator")

    connectFunctionsEmulator(functions, "localhost", 5001)
    console.log("[Firebase Client] Connected to Functions emulator")
  } catch (error) {
    console.error("[Firebase Client] Error connecting to emulators:", error)
  }
}

// Export flag for checking if credentials are available
export { hasRealCredentials }

export { app, auth, db, storage, functions }
