#!/usr/bin/env node

/*
 * Vercel Environment Variables Setup Guide
 * Helps configure all necessary environment variables for deployment
 */

console.log('\n🔧 Vercel Environment Variables Setup Guide\n');

console.log('You need to set these environment variables in your Vercel dashboard:');
console.log('📍 Go to: https://vercel.com/dashboard → Your Project → Settings → Environment Variables\n');

console.log('━━━ FIREBASE CONFIGURATION (Public) ━━━');
console.log('NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key');
console.log('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=wordwise-ai-c0390.firebaseapp.com');
console.log('NEXT_PUBLIC_FIREBASE_PROJECT_ID=wordwise-ai-c0390');
console.log('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=wordwise-ai-c0390.appspot.com');
console.log('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id');
console.log('NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id\n');

console.log('━━━ FIREBASE ADMIN (Private) ━━━');
console.log('FIREBASE_SERVICE_ACCOUNT_JSON={"type": "service_account", ...}\n');

console.log('━━━ STRIPE CONFIGURATION ━━━');
console.log('STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key');
console.log('NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY=price_your_monthly_price_id');
console.log('NEXT_PUBLIC_STRIPE_PRICE_ID_YEARLY=price_your_yearly_price_id');
console.log('NEXT_PUBLIC_STRIPE_PAYMENT_LINK_MONTHLY=https://buy.stripe.com/...');
console.log('NEXT_PUBLIC_STRIPE_PAYMENT_LINK_YEARLY=https://buy.stripe.com/...');
console.log('NEXT_PUBLIC_STRIPE_PORTAL_LINK=https://billing.stripe.com/...');
console.log('STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret\n');

console.log('━━━ ANALYTICS ━━━');
console.log('NEXT_PUBLIC_POSTHOG_KEY=phc_your_posthog_key');
console.log('NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com\n');

console.log('━━━ AI SERVICE ━━━');
console.log('OPENAI_API_KEY=sk-your_openai_api_key\n');

console.log('📝 IMPORTANT NOTES:');
console.log('• Variables starting with NEXT_PUBLIC_ are exposed to the browser');
console.log('• Private variables (like STRIPE_SECRET_KEY) are server-side only');
console.log('• For Firebase Service Account, copy the entire JSON as one line');
console.log('• Set the Environment Target to "Production, Preview, Development"\n');

console.log('🔍 TO GET YOUR FIREBASE CONFIG:');
console.log('1. Go to Firebase Console → Project Settings');
console.log('2. Scroll down to "Your apps" section');
console.log('3. Click the "</>" icon to view web app config');
console.log('4. Copy the values from the firebaseConfig object\n');

console.log('🔍 TO GET YOUR FIREBASE SERVICE ACCOUNT:');
console.log('1. Go to Firebase Console → Project Settings → Service Accounts');
console.log('2. Click "Generate new private key"');
console.log('3. Download the JSON file');
console.log('4. Copy the entire JSON content as one line (no formatting)\n');

console.log('🚀 Once env vars are set, deploy with: vercel --prod\n'); 