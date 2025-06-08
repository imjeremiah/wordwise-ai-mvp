/*
 * This script provides instructions for setting up Firestore
 * Run with: npm run firestore:setup
 */

console.log("\n🔥 Firestore Setup Guide\n");
console.log("=========================\n");

console.log("📋 Collections to be created:");
const collections = {
  profiles: 'profiles',
  users: 'users',
  todos: 'todos',
  chats: 'chats',
  messages: 'messages'
};

Object.entries(collections).forEach(([key, value]) => {
  console.log(`   - ${value} (${key})`);
});

console.log("\n⚠️  Important: Firestore Setup Steps\n");

console.log("1. Enable Firestore in Firebase Console:");
console.log("   - Go to: https://console.firebase.google.com/project/aivideoeduedu/firestore");
console.log("   - Click 'Create database'");
console.log("   - Choose 'Start in production mode'");
console.log("   - Select your preferred location\n");

console.log("2. Set Firestore Security Rules:");
console.log("   - Go to Firestore Database > Rules");
console.log("   - Replace the default rules with:\n");

console.log(`
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read/write their own profiles
    match /profiles/{document} {
      allow read: if request.auth != null && 
        (request.auth.uid == resource.data.userId || 
         request.auth.uid == document);
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.userId;
      allow update: if request.auth != null && 
        request.auth.uid == resource.data.userId;
      allow delete: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
    
    // Allow authenticated users to read/write their own data
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && 
        request.auth.uid == userId;
    }
    
    // Default deny all
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
`);

console.log("\n3. Initialize Collections (Optional):");
console.log("   Collections are created automatically when data is first written");
console.log("   No manual collection creation is needed\n");

console.log("4. Test the Setup:");
console.log("   - Sign in to your app");
console.log("   - Check if profile is created");
console.log("   - Check Firestore Database in console\n");

console.log("✅ Once these steps are complete, your Firestore should be ready!\n");

console.log("🔧 Quick Check:")
console.log("   After setting up Firestore, you can verify it's working by:");
console.log("   1. Signing in to your app");
console.log("   2. Checking the Firestore Database in Firebase Console");
console.log("   3. You should see a 'profiles' collection with your user data\n"); 