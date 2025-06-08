# Firebase Service Account Setup Guide

## Getting Your Service Account Key

1. **Go to Firebase Console**:
   - Visit https://console.firebase.google.com
   - Select your project: `slack-clone-72205`

2. **Navigate to Service Accounts**:
   - Click the gear icon (⚙️) next to "Project Overview"
   - Select "Project settings"
   - Go to the "Service accounts" tab

3. **Generate New Private Key**:
   - Click "Generate new private key"
   - Click "Generate key" in the confirmation dialog
   - A JSON file will download to your computer

4. **Secure the File**:
   - Create a `secrets` directory in your project root
   - Move the downloaded JSON file to the `secrets` directory
   - Rename it to something simple like `firebase-service-account.json`

5. **Update Your Configuration**:
   - Update the path in your `.env.local` file:
   ```
   FIREBASE_SERVICE_ACCOUNT_PATH=./secrets/firebase-service-account.json
   ```

6. **Update .gitignore**:
   - Make sure the secrets directory is ignored:
   ```
   secrets/
   ```

## Security Best Practices

- **NEVER** commit service account files to Git
- Store them in a `secrets/` directory that's gitignored
- In production, use environment variables or secret management services
- Rotate keys periodically
- Use least-privilege service accounts when possible 