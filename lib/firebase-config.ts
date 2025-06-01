import { initializeApp, getApps, cert } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"
import { getStorage } from "firebase-admin/storage"

// Initialize Firebase Admin SDK for server-side operations
console.log("[Firebase Config] Initializing Firebase Admin SDK...")

let adminAuth: ReturnType<typeof getAuth> | null = null
let adminDb: ReturnType<typeof getFirestore> | null = null
let adminStorage: ReturnType<typeof getStorage> | null = null

if (!getApps().length) {
  console.log("[Firebase Config] No existing apps found, creating new app...")

  try {
    // Check if we have the service account file
    const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH

    if (!serviceAccountPath || serviceAccountPath === "") {
      console.warn(
        "[Firebase Config] No FIREBASE_SERVICE_ACCOUNT_PATH provided, skipping Firebase Admin initialization"
      )
      console.warn(
        "[Firebase Config] Firebase Admin features will not be available"
      )
    } else {
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

      // Initialize admin services only if Firebase is properly configured
      adminAuth = getAuth()
      adminDb = getFirestore()
      adminStorage = getStorage()

      console.log("[Firebase Config] Admin services exported successfully")
    }
  } catch (error) {
    console.error("[Firebase Config] Error initializing Firebase Admin:", error)
    console.warn(
      "[Firebase Config] Continuing without Firebase Admin functionality"
    )
  }
} else {
  console.log("[Firebase Config] Firebase Admin already initialized")
  // Initialize services from existing app
  adminAuth = getAuth()
  adminDb = getFirestore()
  adminStorage = getStorage()
}

// Export admin services (may be null if not configured)
export { adminAuth, adminDb, adminStorage }
