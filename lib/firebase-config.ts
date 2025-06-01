import { initializeApp, getApps, cert } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"
import { getStorage } from "firebase-admin/storage"
import * as fs from "fs"
import * as path from "path"

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

    if (!serviceAccountPath) {
      console.log(
        "[Firebase Config] No FIREBASE_SERVICE_ACCOUNT_PATH provided, skipping Firebase Admin initialization"
      )
      console.log(
        "[Firebase Config] Firebase Admin features will not be available"
      )
    } else {
      console.log(
        "[Firebase Config] Loading service account from:",
        serviceAccountPath
      )

      try {
        // Use absolute path for the service account file
        const absolutePath = path.resolve(process.cwd(), serviceAccountPath)
        console.log("[Firebase Config] Absolute path:", absolutePath)

        const serviceAccountContent = fs.readFileSync(absolutePath, "utf8")
        const serviceAccount = JSON.parse(serviceAccountContent)
        console.log("[Firebase Config] Service account loaded successfully")

        initializeApp({
          credential: cert(serviceAccount)
        })

        console.log("[Firebase Config] Firebase Admin initialized successfully")

        // Initialize services after successful app initialization
        adminAuth = getAuth()
        adminDb = getFirestore()
        adminStorage = getStorage()

        console.log("[Firebase Config] All Firebase Admin services initialized")
      } catch (fileError) {
        console.error(
          "[Firebase Config] Error loading service account file:",
          fileError
        )
        console.log(
          "[Firebase Config] Continuing without Firebase Admin functionality"
        )
      }
    }
  } catch (error) {
    console.error("[Firebase Config] Error initializing Firebase Admin:", error)
    console.log(
      "[Firebase Config] Continuing without Firebase Admin functionality"
    )
  }
} else {
  console.log("[Firebase Config] Using existing Firebase app")
  // Get existing services
  try {
    adminAuth = getAuth()
    adminDb = getFirestore()
    adminStorage = getStorage()
  } catch (error) {
    console.error("[Firebase Config] Error getting Firebase services:", error)
  }
}

// Export the Firebase Admin services (may be null if initialization failed)
export { adminAuth, adminDb, adminStorage }
