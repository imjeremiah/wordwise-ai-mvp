"use client"

import { initializeApp } from "firebase/app"
import { getAuth, connectAuthEmulator } from "firebase/auth"
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore"
import { getStorage, connectStorageEmulator } from "firebase/storage"
import { getAnalytics, isSupported } from "firebase/analytics"

// Firebase configuration - these should be set in your environment variables
const firebaseConfig = {
  apiKey:
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
    "AIzaSyCZHwGH9Vn9NrnCqVvYoXyYPQkLxV_8pF4",
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ||
    "ai-video-430de.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "ai-video-430de",
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    "ai-video-430de.firebasestorage.app",
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "946078259047",
  appId:
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID ||
    "1:946078259047:web:a9b8c7d6e5f4g3h2i1j0k9"
}

console.log("[Firebase Client] Initializing Firebase with config:", {
  ...firebaseConfig,
  apiKey: "***" // Hide API key in logs
})

// Initialize Firebase
const app = initializeApp(firebaseConfig)
console.log("[Firebase Client] Firebase app initialized")

// Initialize services
export const auth = getAuth(app)
console.log("[Firebase Client] Auth service initialized")

export const db = getFirestore(app)
console.log("[Firebase Client] Firestore service initialized")

export const storage = getStorage(app)
console.log("[Firebase Client] Storage service initialized")

// Initialize Analytics (only in browser)
if (typeof window !== "undefined") {
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

// Connect to emulators if in development
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
  } catch (error) {
    console.error("[Firebase Client] Error connecting to emulators:", error)
  }
}

export default app
