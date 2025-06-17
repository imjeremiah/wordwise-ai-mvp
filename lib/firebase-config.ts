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
    // Check if we have the service account JSON in environment variables
    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON

    if (serviceAccountJson) {
      console.log(
        "[Firebase Config] Found FIREBASE_SERVICE_ACCOUNT_JSON, parsing..."
      )

      // Parse the JSON string to object
      const serviceAccount = JSON.parse(serviceAccountJson)

      // Log the project ID for verification (without exposing sensitive data)
      console.log(
        "[Firebase Config] Service account project ID:",
        serviceAccount.project_id
      )

      // Initialize Firebase Admin with service account
      const app = initializeApp({
        credential: cert(serviceAccount),
        projectId: serviceAccount.project_id,
        storageBucket: `${serviceAccount.project_id}.appspot.com`
      })

      adminAuth = getAuth(app)
      adminDb = getFirestore(app)
      adminStorage = getStorage(app)

      console.log(
        "[Firebase Config] Firebase Admin SDK initialized successfully"
      )
      console.log(`[Firebase Config] Project ID: ${serviceAccount.project_id}`)
      console.log(
        `[Firebase Config] Storage Bucket: ${serviceAccount.project_id}.appspot.com`
      )
    } else {
      console.warn(
        "[Firebase Config] No FIREBASE_SERVICE_ACCOUNT_JSON provided, skipping Firebase Admin initialization"
      )
      console.warn(
        "[Firebase Config] Admin SDK features (server actions, auth) will not work without service account"
      )
    }
  } catch (error) {
    console.error(
      "[Firebase Config] Error initializing Firebase Admin SDK:",
      error
    )
    console.error(
      "[Firebase Config] Make sure FIREBASE_SERVICE_ACCOUNT_JSON is valid JSON"
    )
  }
} else {
  console.log(
    "[Firebase Config] Firebase app already exists, getting existing instances..."
  )
  const existingApp = getApps()[0]

  try {
    adminAuth = getAuth(existingApp)
    adminDb = getFirestore(existingApp)
    adminStorage = getStorage(existingApp)
    console.log("[Firebase Config] Retrieved existing Firebase Admin instances")
  } catch (error) {
    console.error(
      "[Firebase Config] Error getting existing Firebase instances:",
      error
    )
  }
}

// Export the instances (may be null if Firebase is not configured)
export { adminAuth, adminDb, adminStorage }
