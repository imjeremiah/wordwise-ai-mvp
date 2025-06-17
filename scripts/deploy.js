#!/usr/bin/env node

/*
 * WordWise AI Deployment Script
 * Analyzes the project and provides deployment guidance
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('\n🚀 WordWise AI Deployment Analysis\n');

// Check if Firebase CLI is installed
function checkFirebaseCLI() {
  try {
    execSync('firebase --version', { stdio: 'pipe' });
    return true;
  } catch (error) {
    return false;
  }
}

// Check if Vercel CLI is installed
function checkVercelCLI() {
  try {
    execSync('vercel --version', { stdio: 'pipe' });
    return true;
  } catch (error) {
    return false;
  }
}

// Analyze project for server-side features
function analyzeProject() {
  console.log('📊 Analyzing project features...\n');
  
  const features = {
    serverActions: false,
    middleware: false,
    apiRoutes: false,
    dynamicRoutes: false,
    serverComponents: false
  };
  
  // Check for server actions
  try {
    const actionsDir = path.join(process.cwd(), 'actions');
    if (fs.existsSync(actionsDir)) {
      features.serverActions = true;
      console.log('✅ Server Actions detected');
    }
  } catch (error) {
    // Silent fail
  }
  
  // Check for middleware
  try {
    const middlewareFile = path.join(process.cwd(), 'middleware.ts');
    if (fs.existsSync(middlewareFile)) {
      features.middleware = true;
      console.log('✅ Middleware detected');
    }
  } catch (error) {
    // Silent fail
  }
  
  // Check for API routes
  try {
    const apiDir = path.join(process.cwd(), 'app', 'api');
    if (fs.existsSync(apiDir)) {
      features.apiRoutes = true;
      console.log('✅ API Routes detected');
    }
  } catch (error) {
    // Silent fail
  }
  
  // Check for dynamic routes
  try {
    const appDir = path.join(process.cwd(), 'app');
    if (fs.existsSync(appDir)) {
      const checkForDynamicRoutes = (dir) => {
        const items = fs.readdirSync(dir, { withFileTypes: true });
        for (const item of items) {
          if (item.isDirectory()) {
            if (item.name.includes('[') || item.name.includes('(')) {
              return true;
            }
            if (checkForDynamicRoutes(path.join(dir, item.name))) {
              return true;
            }
          }
        }
        return false;
      };
      
      if (checkForDynamicRoutes(appDir)) {
        features.dynamicRoutes = true;
        console.log('✅ Dynamic Routes detected');
      }
    }
  } catch (error) {
    // Silent fail
  }
  
  // Check for server components
  try {
    const checkForServerComponents = (dir) => {
      const items = fs.readdirSync(dir, { withFileTypes: true });
      for (const item of items) {
        if (item.isFile() && (item.name.endsWith('.tsx') || item.name.endsWith('.ts'))) {
          const filePath = path.join(dir, item.name);
          const content = fs.readFileSync(filePath, 'utf8');
          if (content.includes('"use server"')) {
            return true;
          }
        }
        if (item.isDirectory() && !item.name.startsWith('.') && item.name !== 'node_modules') {
          if (checkForServerComponents(path.join(dir, item.name))) {
            return true;
          }
        }
      }
      return false;
    };
    
    if (checkForServerComponents(process.cwd())) {
      features.serverComponents = true;
      console.log('✅ Server Components detected');
    }
  } catch (error) {
    // Silent fail
  }
  
  return features;
}

// Main deployment analysis
function main() {
  const features = analyzeProject();
  const hasServerFeatures = Object.values(features).some(Boolean);
  
  console.log('\n📋 Deployment Options Analysis:\n');
  
  if (hasServerFeatures) {
    console.log('⚠️  Your app uses server-side features that require SSR support:\n');
    
    if (features.serverActions) console.log('   • Server Actions');
    if (features.middleware) console.log('   • Middleware');
    if (features.apiRoutes) console.log('   • API Routes');
    if (features.dynamicRoutes) console.log('   • Dynamic Routes');
    if (features.serverComponents) console.log('   • Server Components');
    
    console.log('\n🎯 RECOMMENDED DEPLOYMENT OPTIONS:\n');
    
    console.log('1. 🥇 VERCEL (Recommended - Native Next.js support)');
    console.log('   ✅ Full Next.js App Router support');
    console.log('   ✅ Server Actions work out of the box');
    console.log('   ✅ Middleware support');
    console.log('   ✅ Easy deployment');
    console.log('   ✅ Free tier available');
    console.log('   ❌ Requires new account (but free to create)');
    
    console.log('\n2. 🥈 FIREBASE HOSTING + FUNCTIONS (Complex setup)');
    console.log('   ✅ You already have Firebase account');
    console.log('   ❌ Requires custom Next.js function setup');
    console.log('   ❌ Complex configuration needed');
    console.log('   ❌ Some features may not work perfectly');
    console.log('   ❌ More expensive for computing resources');
    
    console.log('\n💡 RECOMMENDATION:');
    console.log('Although you have Firebase Hosting, Vercel is the better choice for this');
    console.log('Next.js app due to its native support for all the features you\'re using.\n');
    
    console.log('🚀 TO DEPLOY TO VERCEL:');
    console.log('1. Create free account at vercel.com');
    console.log('2. Install Vercel CLI: npm i -g vercel');
    console.log('3. Run: vercel');
    console.log('4. Follow the prompts');
    console.log('5. Set environment variables in Vercel dashboard\n');
    
    if (checkFirebaseCLI()) {
      console.log('🔧 TO ATTEMPT FIREBASE DEPLOYMENT (Advanced):');
      console.log('1. Run: npm run deploy:firebase-setup');
      console.log('2. Configure environment variables');
      console.log('3. Run: npm run deploy\n');
    } else {
      console.log('🔧 TO ATTEMPT FIREBASE DEPLOYMENT:');
      console.log('1. Install Firebase CLI: npm i -g firebase-tools');
      console.log('2. Login: firebase login');
      console.log('3. Run: npm run deploy:firebase-setup\n');
    }
    
  } else {
    console.log('✅ Your app can be deployed as a static site to Firebase Hosting\n');
    console.log('🚀 TO DEPLOY TO FIREBASE:');
    console.log('1. Run: npm run build:export');
    console.log('2. Run: firebase deploy --only hosting');
  }
  
  console.log('💬 Need help? Check the deployment documentation or ask for assistance.\n');
}

// Check environment
const firebaseCLI = checkFirebaseCLI();
const vercelCLI = checkVercelCLI();

console.log('🔍 CLI Tools Status:');
console.log(`   Firebase CLI: ${firebaseCLI ? '✅ Installed' : '❌ Not installed'}`);
console.log(`   Vercel CLI: ${vercelCLI ? '✅ Installed' : '❌ Not installed'}\n`);

main(); 