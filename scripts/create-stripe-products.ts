#!/usr/bin/env node

/**
 * Script to create Stripe products and prices
 * Run with: npx tsx scripts/create-stripe-products.ts
 */

import { config } from 'dotenv'
import { resolve } from 'path'
import Stripe from 'stripe'

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') })

console.log('🚀 Creating Stripe Products and Prices...\n')

if (!process.env.STRIPE_SECRET_KEY) {
  console.error('❌ STRIPE_SECRET_KEY is required. Please set it in .env.local')
  process.exit(1)
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20'
})

async function createProducts() {
  try {
    // Create Monthly Product
    console.log('📦 Creating Monthly Subscription Product...')
    const monthlyProduct = await stripe.products.create({
      name: 'Monthly Subscription',
      description: 'Access to all premium features, billed monthly',
      metadata: {
        membership: 'pro'
      }
    })
    console.log('✅ Monthly product created:', monthlyProduct.id)

    // Create Monthly Price
    const monthlyPrice = await stripe.prices.create({
      product: monthlyProduct.id,
      unit_amount: 1000, // $10.00 in cents
      currency: 'usd',
      recurring: {
        interval: 'month'
      },
      metadata: {
        plan: 'monthly'
      }
    })
    console.log('✅ Monthly price created:', monthlyPrice.id)
    console.log('   Amount: $10.00/month\n')

    // Create Yearly Product
    console.log('📦 Creating Yearly Subscription Product...')
    const yearlyProduct = await stripe.products.create({
      name: 'Yearly Subscription',
      description: 'Access to all premium features, billed yearly (save 17%!)',
      metadata: {
        membership: 'pro'
      }
    })
    console.log('✅ Yearly product created:', yearlyProduct.id)

    // Create Yearly Price
    const yearlyPrice = await stripe.prices.create({
      product: yearlyProduct.id,
      unit_amount: 10000, // $100.00 in cents
      currency: 'usd',
      recurring: {
        interval: 'year'
      },
      metadata: {
        plan: 'yearly'
      }
    })
    console.log('✅ Yearly price created:', yearlyPrice.id)
    console.log('   Amount: $100.00/year\n')

    // Create Customer Portal Configuration
    console.log('⚙️  Setting up Customer Portal...')
    try {
      const portalConfigs = await stripe.billingPortal.configurations.list({ limit: 1 })
      
      if (portalConfigs.data.length === 0) {
        // Create a new portal configuration
        const portalConfig = await stripe.billingPortal.configurations.create({
          business_profile: {
            headline: 'Manage your subscription',
          },
          features: {
            invoice_history: { enabled: true },
            payment_method_update: { enabled: true },
            subscription_cancel: { enabled: true },
            subscription_update: {
              enabled: true,
              default_allowed_updates: ['price', 'quantity'],
              proration_behavior: 'create_prorations',
              products: [
                {
                  product: monthlyProduct.id,
                  prices: [monthlyPrice.id, yearlyPrice.id]
                },
                {
                  product: yearlyProduct.id,
                  prices: [yearlyPrice.id, monthlyPrice.id]
                }
              ]
            }
          }
        })
        console.log('✅ Customer Portal configured\n')
      } else {
        console.log('✅ Customer Portal already configured\n')
      }
    } catch (error) {
      console.log('⚠️  Could not configure Customer Portal (this is optional)\n')
    }

    // Display the environment variables to add
    console.log('🎉 Success! Add these to your .env.local file:\n')
    console.log('# Stripe Price IDs')
    console.log(`NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY=${monthlyPrice.id}`)
    console.log(`NEXT_PUBLIC_STRIPE_PRICE_ID_YEARLY=${yearlyPrice.id}`)
    console.log('\n# You already have this:')
    console.log(`STRIPE_SECRET_KEY=${process.env.STRIPE_SECRET_KEY}`)
    console.log('\n# You\'ll get this from running: stripe listen --forward-to localhost:3005/api/stripe/webhooks')
    console.log('STRIPE_WEBHOOK_SECRET=whsec_[YOUR_WEBHOOK_SECRET]')
    
    console.log('\n📋 Next steps:')
    console.log('1. Copy the price IDs above to your .env.local file')
    console.log('2. Run: stripe listen --forward-to localhost:3005/api/stripe/webhooks')
    console.log('3. Copy the webhook signing secret to STRIPE_WEBHOOK_SECRET in .env.local')
    console.log('4. Restart your dev server to load the new environment variables')
    console.log('5. Test at http://localhost:3005/pricing')

  } catch (error) {
    console.error('❌ Error creating products:', (error as Error).message)
    process.exit(1)
  }
}

createProducts() 