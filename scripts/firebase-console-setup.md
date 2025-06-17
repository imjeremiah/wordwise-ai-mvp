# 🔥 Firebase Console Setup Guide for WordWise AI

This guide walks you through setting up Firebase services for your WordWise AI project.

## 📋 Prerequisites

- Google account
- Firebase project (or will create one)
- Administrative access to Firebase project

## 🚀 Step-by-Step Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **"Create a project"** or **"Add project"**
3. Enter project name: `wordwise-ai-[your-name]` (e.g., `wordwise-ai-dev`)
4. **Enable Google Analytics** (recommended for user insights)
5. Select your Google Analytics account or create new one
6. Click **"Create project"**
7. Wait for project creation (1-2 minutes)

### 2. Enable Authentication

1. In your Firebase project dashboard, click **"Authentication"**
2. Click **"Get started"**
3. Go to **"Sign-in method"** tab
4. Enable **Email/Password**:
   - Click on "Email/Password"
   - Toggle **"Enable"**
   - Click **"Save"**
5. Enable **Google**:
   - Click on "Google"
   - Toggle **"Enable"**
   - Enter your project support email
   - Click **"Save"**

### 3. Create Firestore Database

1. Click **"Firestore Database"** in the sidebar
2. Click **"Create database"**
3. Choose **"Start in production mode"** (we'll use custom rules)
4. Select location closest to your users (e.g., `us-central1`)
5. Click **"Done"**
6. Wait for database creation

### 4. Configure Firestore Security Rules

1. In Firestore, go to **"Rules"** tab
2. Replace the default rules with these WordWise AI rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own profiles
    match /profiles/{document} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    
    // Users can only access their own user records
    match /users/{document} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.uid;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.uid;
    }
    
    // Users can only access their own documents
    match /documents/{document} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.ownerUID;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.ownerUID;
    }
    
    // Logs are write-only for authenticated users, no read access
    match /logs/{document} {
      allow create: if request.auth != null;
      allow read, update, delete: if false; // Admin only via server
    }
    
    // Deny all other access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

3. Click **"Publish"**

### 5. Get Firebase Configuration

1. Click the **gear icon** (⚙️) next to "Project Overview"
2. Select **"Project settings"**
3. Scroll down to **"Your apps"** section
4. Click **"</>"** (Web app) icon
5. Enter app nickname: `WordWise AI Web`
6. **Check "Also set up Firebase Hosting"**
7. Click **"Register app"**
8. **Copy the Firebase configuration object** - you'll need this for `.env.local`

Example configuration:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "wordwise-ai-dev.firebaseapp.com",
  projectId: "wordwise-ai-dev",
  storageBucket: "wordwise-ai-dev.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

### 6. Create Service Account

1. In Project Settings, go to **"Service accounts"** tab
2. Click **"Generate new private key"**
3. Click **"Generate key"** in the popup
4. **Save the JSON file securely** - you'll need this for `FIREBASE_SERVICE_ACCOUNT_JSON`
5. **DO NOT commit this file to git!**

### 7. Enable Firebase Hosting

1. Click **"Hosting"** in the sidebar
2. Click **"Get started"**
3. Follow the setup instructions (or skip if already done in step 5)
4. Your site will be available at `https://your-project-id.web.app`

### 8. Configure Storage (Optional)

1. Click **"Storage"** in the sidebar
2. Click **"Get started"**
3. Choose **"Start in production mode"**
4. Select same location as Firestore
5. Use these security rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Users can only access their own files
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Public read for profile images
    match /profile-images/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // User documents
    match /documents/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 🔑 Environment Setup

After completing the Firebase setup:

1. Run the setup script:
```bash
npm run setup:env
```

2. Or manually create `.env.local`:
```bash
# Copy your Firebase config here
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456

# Paste your service account JSON (all on one line)
FIREBASE_SERVICE_ACCOUNT_JSON='{"type":"service_account",...}'
```

## 🧪 Testing Your Setup

1. **Test Firebase connection:**
```bash
npm run test:firebase
```

2. **Test authentication flows:**
```bash
npm run test:auth
```

3. **Start development server:**
```bash
npm run dev
```

4. **Test in browser:**
   - Go to `http://localhost:3005`
   - Try signup/login functionality
   - Check Firebase console for users

## 🚀 GitHub Actions Setup (CI/CD)

Add these secrets to your GitHub repository:

1. Go to your GitHub repo
2. Click **Settings** > **Secrets and variables** > **Actions**
3. Add these secrets:

- `FIREBASE_PROJECT_ID`: Your Firebase project ID
- `FIREBASE_SERVICE_ACCOUNT`: Your service account JSON (entire content)

## 🔒 Security Checklist

- [ ] Firestore security rules are configured
- [ ] Storage security rules are configured (if using)
- [ ] Service account JSON is secured (not in git)
- [ ] Authentication methods are enabled
- [ ] Environment variables are set correctly
- [ ] GitHub secrets are configured for CI/CD

## 🐛 Troubleshooting

### "Firebase project not found"
- Verify project ID in `.env.local`
- Check that you have access to the project

### "Permission denied"
- Verify Firestore rules are published
- Check that user is authenticated
- Ensure user owns the resource they're accessing

### "Service account error"
- Verify `FIREBASE_SERVICE_ACCOUNT_JSON` is valid JSON
- Check that service account has proper permissions
- Ensure no extra spaces or line breaks in the JSON

### "Authentication not working"
- Verify Email/Password and Google are enabled
- Check domain authorization in Firebase console
- Ensure API keys are correct in `.env.local`

## 📖 Next Steps

After setup is complete:

1. **Test all authentication flows**
2. **Create your first document in the app**
3. **Set up Stripe for payments** (optional)
4. **Configure PostHog for analytics** (optional)
5. **Deploy to production**

## 📚 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Firebase Hosting](https://firebase.google.com/docs/hosting)

---

✨ **Your WordWise AI Firebase setup is complete!** ✨ 