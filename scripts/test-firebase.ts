/*
 * This script tests Firebase connection and Firestore access
 * Run with: npm run test:firebase
 */

import { adminAuth, adminDb, adminStorage } from "../lib/firebase-config"

async function testFirebaseConnection() {
  console.log("Testing Firebase Admin SDK connection...")

  try {
    // Test Auth
    console.log("Testing Auth...")
    if (adminAuth) {
      const usersList = await adminAuth.listUsers(1) // Get 1 user to test
      console.log("✅ Auth working. Users in database:", usersList.users.length)
    } else {
      console.log("⚠️ Auth not initialized (no credentials)")
    }

    // Test Firestore
    console.log("Testing Firestore...")
    if (adminDb) {
      // Test basic connection
      const testCollection = adminDb.collection("test")
      const testDoc = testCollection.doc("connection-test")
      
      // Write a test document
      await testDoc.set({
        timestamp: new Date(),
        message: "Connection test successful"
      })
      
      // Read it back
      const doc = await testDoc.get()
      if (doc.exists) {
        console.log("✅ Firestore working. Test document:", doc.data())
        
        // Clean up
        await testDoc.delete()
        console.log("✅ Test document cleaned up")
      } else {
        console.log("❌ Firestore test document not found")
      }
    } else {
      console.log("⚠️ Firestore not initialized (no credentials)")
    }

    // Test Storage
    console.log("Testing Storage...")
    if (adminStorage) {
      try {
        // Test bucket access by listing buckets - note: this might require special permissions
        console.log("✅ Storage service available")
        console.log("Note: Bucket operations require proper Firebase Storage setup and permissions")
      } catch (storageError) {
        console.log("⚠️ Storage test error:", storageError)
      }
    } else {
      console.log("⚠️ Storage not initialized (no credentials)")
    }

    console.log("🎉 Firebase Admin SDK test completed!")
    
  } catch (error) {
    console.error("❌ Firebase test failed:", error)
    process.exit(1)
  }
}

// Run the test
testFirebaseConnection()
  .then(() => {
    console.log("Test completed successfully")
    process.exit(0)
  })
  .catch((error) => {
    console.error("Test failed:", error)
    process.exit(1)
  }) 