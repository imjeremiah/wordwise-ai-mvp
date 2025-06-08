const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

console.log('[Final Test] Starting comprehensive Firestore test...\n');

// Load service account
const serviceAccountPath = path.resolve(__dirname, '../aivideoeduedu-firebase-adminsdk.json');
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

console.log('Service Account Details:');
console.log('- Project ID:', serviceAccount.project_id);
console.log('- Client Email:', serviceAccount.client_email);
console.log('- Private Key ID:', serviceAccount.private_key_id.substring(0, 8) + '...');

// Initialize Firebase Admin with explicit configuration
console.log('\n[Final Test] Initializing Firebase Admin...');

// Clear any existing apps
if (admin.apps.length > 0) {
  console.log('[Final Test] Clearing existing Firebase apps...');
  admin.apps.forEach(app => app.delete());
}

// Initialize with all possible configurations
try {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: serviceAccount.project_id,
      clientEmail: serviceAccount.client_email,
      privateKey: serviceAccount.private_key
    }),
    projectId: serviceAccount.project_id,
    databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
  });
  console.log('[Final Test] Firebase Admin initialized successfully');
} catch (initError) {
  console.error('[Final Test] Failed to initialize Firebase Admin:', initError.message);
  process.exit(1);
}

const db = admin.firestore();

// Configure Firestore settings
console.log('[Final Test] Configuring Firestore settings...');
db.settings({
  projectId: serviceAccount.project_id,
  timestampsInSnapshots: true,
  ignoreUndefinedProperties: true
});

// Wait a bit longer for initialization
console.log('[Final Test] Waiting 5 seconds for full initialization...\n');

setTimeout(async () => {
  console.log('[Final Test] Starting tests...\n');
  
  // Test 1: List collections
  try {
    console.log('Test 1: Listing collections...');
    const collections = await db.listCollections();
    console.log(`✅ Successfully connected! Found ${collections.length} collections:`);
    collections.forEach(col => console.log(`   - ${col.id}`));
  } catch (error) {
    console.error('❌ Failed to list collections:', error.message);
    console.error('   Error code:', error.code);
  }
  
  // Test 2: Read from test collection
  try {
    console.log('\nTest 2: Reading from test collection...');
    const snapshot = await db.collection('test').get();
    console.log(`✅ Successfully read test collection! Found ${snapshot.size} documents`);
    snapshot.forEach(doc => {
      console.log(`   - Document ${doc.id}:`, JSON.stringify(doc.data()));
    });
  } catch (error) {
    console.error('❌ Failed to read test collection:', error.message);
  }
  
  // Test 3: Write a test document
  try {
    console.log('\nTest 3: Writing a test document...');
    const testData = {
      message: 'Firestore connectivity test',
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      nodeVersion: process.version,
      testTime: new Date().toISOString()
    };
    
    const docRef = await db.collection('test').add(testData);
    console.log('✅ Successfully wrote document with ID:', docRef.id);
    
    // Clean up
    await docRef.delete();
    console.log('✅ Cleanup successful!');
  } catch (error) {
    console.error('❌ Failed to write document:', error.message);
    console.error('   Error code:', error.code);
    
    if (error.code === 5) {
      console.error('\n🔍 Debugging NOT_FOUND error:');
      console.error('1. The database exists (confirmed via gcloud)');
      console.error('2. The service account has correct permissions');
      console.error('3. The project ID is correct');
      console.error('\nPossible causes:');
      console.error('- Firestore might need more time to fully initialize');
      console.error('- There might be a regional configuration issue');
      console.error('- The Firestore API might need to be re-enabled');
      
      console.error('\n🔧 Try these solutions:');
      console.error('1. Go to: https://console.cloud.google.com/apis/library/firestore.googleapis.com?project=aivideoeduedu');
      console.error('2. Make sure the API is enabled (disable and re-enable if necessary)');
      console.error('3. Wait 5-10 minutes for changes to propagate');
      console.error('4. Try creating another document in the Firebase Console');
    }
  }
  
  // Test 4: Try a different approach with explicit database reference
  try {
    console.log('\nTest 4: Using explicit database reference...');
    const docRef = db.doc('test/connectivity-check');
    await docRef.set({
      test: true,
      timestamp: new Date()
    });
    console.log('✅ Successfully wrote using doc reference!');
    await docRef.delete();
    console.log('✅ Cleanup successful!');
    
    console.log('\n🎉 SUCCESS! Firestore is working! You can now run: npm run dev');
  } catch (error) {
    console.error('❌ Failed with explicit reference:', error.message);
  }
  
  process.exit(0);
}, 5000); 