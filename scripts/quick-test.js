const admin = require('firebase-admin');
const serviceAccount = require('../aivideoeduedu-firebase-adminsdk.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function quickTest() {
  try {
    console.log('Testing Firestore...');
    const docRef = await db.collection('test').add({
      message: 'Firestore is working!',
      timestamp: new Date()
    });
    console.log('✅ SUCCESS! Document written with ID:', docRef.id);
    
    // Clean up
    await docRef.delete();
    console.log('✅ Cleanup successful!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  process.exit(0);
}

quickTest(); 