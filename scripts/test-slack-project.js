const admin = require('firebase-admin');
const serviceAccount = require('../slack-clone-72205-firebase-adminsdk-bt95h-3c1568117e.json');

console.log('[Slack Test] Testing with slack-clone-72205 project...');
console.log('[Slack Test] Project ID:', serviceAccount.project_id);

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'slack-clone-72205'
});

const db = admin.firestore();

async function testSlackProject() {
  try {
    console.log('\n[Slack Test] Testing Firestore connection...');
    
    // Test write
    const docRef = await db.collection('test').add({
      message: 'Testing slack-clone project',
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });
    
    console.log('[Slack Test] ✅ Write successful! Doc ID:', docRef.id);
    
    // Test read
    const doc = await docRef.get();
    console.log('[Slack Test] ✅ Read successful! Data:', doc.data());
    
    // Clean up
    await docRef.delete();
    console.log('[Slack Test] ✅ Cleanup successful!');
    
    console.log('\n🎉 SUCCESS! The slack-clone project is working correctly!');
    console.log('Firestore is properly configured in Native mode.');
    console.log('\nYou can now run: npm run dev');
    
  } catch (error) {
    console.error('[Slack Test] ❌ Error:', error.message);
    console.error('[Slack Test] Code:', error.code);
    
    if (error.code === 9) {
      console.error('\n[Slack Test] Firestore is not enabled for this project.');
      console.error('[Slack Test] Go to: https://console.firebase.google.com/project/slack-clone-72205/firestore');
      console.error('[Slack Test] Click "Create Database" and choose "Production mode"');
    }
  }
  
  process.exit(0);
}

testSlackProject(); 