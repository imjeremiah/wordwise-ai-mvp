#!/usr/bin/env node

/**
 * Firebase Setup Script
 * This script helps you set up Firebase services for your project
 */

console.log('🔥 Firebase Setup Script\n');

console.log('Please follow these steps to complete your Firebase setup:\n');

console.log('1. Firebase Console Setup:');
console.log('   - Go to https://console.firebase.google.com');
console.log('   - Create a new project or select an existing one');
console.log('   - Note your project ID\n');

console.log('2. Enable Authentication:');
console.log('   - Go to Authentication > Sign-in method');
console.log('   - Enable Email/Password provider');
console.log('   - Enable Google provider');
console.log('   - Add your domain to Authorized domains\n');

console.log('3. Create Firestore Database:');
console.log('   - Go to Firestore Database');
console.log('   - Click "Create database"');
console.log('   - Choose production mode');
console.log('   - Select your preferred region\n');

console.log('4. Enable Storage:');
console.log('   - Go to Storage');
console.log('   - Click "Get started"');
console.log('   - Choose production mode');
console.log('   - Select your preferred region\n');

console.log('5. Get Firebase Config:');
console.log('   - Go to Project Settings');
console.log('   - Scroll to "Your apps" section');
console.log('   - Click "Add app" and select Web');
console.log('   - Register your app');
console.log('   - Copy the configuration values\n');

console.log('6. Get Service Account Key:');
console.log('   - Go to Project Settings > Service accounts');
console.log('   - Click "Generate new private key"');
console.log('   - Save the JSON file in your project root');
console.log('   - Update FIREBASE_SERVICE_ACCOUNT_PATH in .env.local\n');

console.log('7. Update .env.local with your Firebase config:');
console.log('   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key');
console.log('   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain');
console.log('   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id');
console.log('   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket');
console.log('   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id');
console.log('   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id');
console.log('   FIREBASE_SERVICE_ACCOUNT_PATH=./your-service-account-key.json\n');

console.log('8. Firestore Security Rules (optional):');
console.log('   Copy and paste these rules in Firestore > Rules:\n');
console.log(`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read/write their own profiles
    match /profiles/{document} {
      allow read: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
      allow update: if request.auth != null && request.auth.uid == resource.data.userId;
      allow delete: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    // Add more rules for other collections as needed
  }
}`);

console.log('\n9. Storage Security Rules (optional):');
console.log('   Copy and paste these rules in Storage > Rules:\n');
console.log(`rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow users to read/write their own files
    match /users/{userId}/{allPaths=**} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Public read for profile images
    match /profile-images/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}`);

console.log('\n✅ Once you\'ve completed these steps, your Firebase setup is complete!');
console.log('🚀 Run "npm run dev" to start your application\n'); 