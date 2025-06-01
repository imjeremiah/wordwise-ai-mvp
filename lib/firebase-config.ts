import { initializeApp, getApps, cert } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"
import { getStorage } from "firebase-admin/storage"

// Initialize Firebase Admin SDK for server-side operations
console.log("[Firebase Config] Initializing Firebase Admin SDK...")

if (!getApps().length) {
  console.log("[Firebase Config] No existing apps found, creating new app...")

  try {
    // Check if we have the service account file
    const serviceAccountPath =
      process.env.FIREBASE_SERVICE_ACCOUNT_PATH ||
      "./ai-video-430de-firebase-adminsdk-fbsvc-858ede978e.json"
    console.log(
      "[Firebase Config] Loading service account from:",
      serviceAccountPath
    )

    const serviceAccount = require(serviceAccountPath)
    console.log("[Firebase Config] Service account loaded successfully")

    initializeApp({
      credential: cert(serviceAccount),
      storageBucket:
        process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
        "ai-video-430de.firebasestorage.app"
    })

    console.log("[Firebase Config] Firebase Admin initialized successfully")
  } catch (error) {
    console.error("[Firebase Config] Error initializing Firebase Admin:", error)
    throw error
  }
} else {
  console.log("[Firebase Config] Firebase Admin already initialized")
}

// Export admin services
export const adminAuth = getAuth()
export const adminDb = getFirestore()
export const adminStorage = getStorage()

console.log("[Firebase Config] Admin services exported successfully")
