#!/usr/bin/env node

/**
 * Stripe Setup Test Script
 * Run with: npx tsx scripts/test-stripe-setup.ts
 */

import { config } from 'dotenv'
import { resolve } from 'path'
import Stripe from 'stripe'

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') })

console.log('🧪 Testing Stripe Setup...\n')

// Check environment variables
const requiredEnvVars = [
  'STRIPE_SECRET_KEY',
  'NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY',
  'NEXT_PUBLIC_STRIPE_PRICE_ID_YEARLY'
]

const envVarStatus: Record<string, boolean> = {}

for (const envVar of requiredEnvVars) {
  const value = process.env[envVar]
  const isSet = !!value
  envVarStatus[envVar] = isSet
  
  console.log(`${isSet ? '✅' : '❌'} ${envVar}: ${isSet ? 'Set' : 'Missing'}`)
  
  if (isSet && envVar === 'STRIPE_SECRET_KEY') {
    const isTestKey = value.startsWith('sk_test_')
    console.log(`   ${isTestKey ? '✅' : '⚠️ '} Key type: ${isTestKey ? 'Test mode' : 'Live mode (be careful!)'}`)
  }
}

console.log('\n')

// If secret key is missing, exit
if (!process.env.STRIPE_SECRET_KEY) {
  console.error('❌ STRIPE_SECRET_KEY is required. Please set it in .env.local')
  process.exit(1)
}

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20'
})

async function testStripeConnection() {
  try {
    // Test API connection
    console.log('🔌 Testing Stripe API connection...')
    const account = await stripe.accounts.retrieve()
    console.log(`✅ Connected to Stripe account: ${account.email || 'No email set'}`)
    console.log(`   Business name: ${account.business_profile?.name || 'Not set'}`)
    console.log(`   Country: ${account.country}`)
    console.log('\n')
  } catch (error) {
    console.error('❌ Failed to connect to Stripe:', (error as Error).message)
    process.exit(1)
  }
}

async function testPrices() {
  console.log('💰 Checking configured prices...\n')
  
  const priceIds = [
    { 
      envVar: 'NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY', 
      id: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY,
      label: 'Monthly'
    },
    { 
      envVar: 'NEXT_PUBLIC_STRIPE_PRICE_ID_YEARLY', 
      id: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_YEARLY,
      label: 'Yearly'
    }
  ]
  
  for (const { envVar, id, label } of priceIds) {
    if (!id) {
      console.log(`❌ ${label} price: Not configured (${envVar} missing)`)
      continue
    }
    
    try {
      const price = await stripe.prices.retrieve(id, {
        expand: ['product']
      })
      
      const product = price.product as Stripe.Product
      console.log(`✅ ${label} price: ${product.name}`)
      console.log(`   Price ID: ${price.id}`)
      console.log(`   Amount: ${(price.unit_amount || 0) / 100} ${price.currency.toUpperCase()}`)
      console.log(`   Interval: ${price.recurring?.interval || 'one-time'}`)
      console.log(`   Active: ${price.active ? 'Yes' : 'No'}`)
      console.log('')
    } catch (error) {
      console.log(`❌ ${label} price: Invalid price ID`)
      console.log(`   Error: ${(error as Error).message}`)
      console.log('')
    }
  }
}

async function testWebhookEndpoint() {
  console.log('🪝 Checking webhook configuration...\n')
  
  try {
    const webhookEndpoints = await stripe.webhookEndpoints.list({ limit: 10 })
    
    if (webhookEndpoints.data.length === 0) {
      console.log('⚠️  No webhook endpoints configured')
      console.log('   For local testing, use: stripe listen --forward-to localhost:3005/api/stripe/webhooks')
    } else {
      console.log(`✅ Found ${webhookEndpoints.data.length} webhook endpoint(s):`)
      webhookEndpoints.data.forEach((endpoint, index) => {
        console.log(`\n   ${index + 1}. ${endpoint.url}`)
        console.log(`      Status: ${endpoint.status}`)
        console.log(`      Events: ${endpoint.enabled_events.length > 0 ? endpoint.enabled_events.join(', ') : 'All events'}`)
      })
    }
  } catch (error) {
    console.log('⚠️  Could not fetch webhook endpoints')
  }
}

async function testRecentActivity() {
  console.log('\n\n📊 Recent activity (last 5 events)...\n')
  
  try {
    const events = await stripe.events.list({ limit: 5 })
    
    if (events.data.length === 0) {
      console.log('📭 No recent events')
    } else {
      events.data.forEach((event, index) => {
        const date = new Date(event.created * 1000)
        console.log(`${index + 1}. ${event.type}`)
        console.log(`   Time: ${date.toLocaleString()}`)
        console.log(`   ID: ${event.id}`)
        console.log('')
      })
    }
  } catch (error) {
    console.log('⚠️  Could not fetch recent events')
  }
}

// Run all tests
async function runTests() {
  await testStripeConnection()
  await testPrices()
  await testWebhookEndpoint()
  await testRecentActivity()
  
  console.log('\n✨ Stripe setup test complete!\n')
  
  // Show next steps
  console.log('📝 Next steps:')
  console.log('1. If any prices are missing, create them in your Stripe dashboard')
  console.log('2. For local webhook testing, run: stripe listen --forward-to localhost:3005/api/stripe/webhooks')
  console.log('3. Update STRIPE_WEBHOOK_SECRET with the signing secret from the stripe listen command')
  console.log('4. Visit /dashboard/billing to test the billing dashboard')
  console.log('\nFor full testing guide, see: docs/STRIPE_TESTING_GUIDE.md')
}

runTests().catch(console.error) 