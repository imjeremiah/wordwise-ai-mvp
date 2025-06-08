# Stripe Testing Guide

This guide will help you test all the Stripe functionality in your Firebase boilerplate.

## Prerequisites

1. **Stripe Account**: Create a free account at [stripe.com](https://stripe.com)
2. **Test Mode**: Make sure you're in **Test Mode** (toggle in Stripe Dashboard)
3. **Firebase Setup**: Ensure Firebase is properly configured

## Step 1: Configure Stripe Test Environment

### 1.1 Get Your Test API Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
2. Copy your **Test Secret Key** (starts with `sk_test_`)
3. Copy your **Test Publishable Key** (starts with `pk_test_`)

### 1.2 Create Test Products and Prices

1. Go to [Products](https://dashboard.stripe.com/test/products)
2. Create two products:

**Monthly Subscription:**
- Name: "Monthly Plan"
- Price: $10.00/month
- Price ID: Copy this (looks like `price_1234...`)

**Yearly Subscription:**
- Name: "Yearly Plan"  
- Price: $100.00/year
- Price ID: Copy this (looks like `price_5678...`)

### 1.3 Set Up Webhook (for local testing)

Install Stripe CLI:
```bash
# macOS
brew install stripe/stripe-cli/stripe

# Or download from: https://stripe.com/docs/stripe-cli
```

### 1.4 Update Environment Variables

Update your `.env.local`:
```env
# Stripe Test Keys
STRIPE_SECRET_KEY=sk_test_your_test_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Price IDs from your test products
NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY=price_your_monthly_price_id
NEXT_PUBLIC_STRIPE_PRICE_ID_YEARLY=price_your_yearly_price_id

# Optional - for backward compatibility
NEXT_PUBLIC_STRIPE_PORTAL_LINK=https://billing.stripe.com/p/login/test_YOUR_PORTAL_ID
```

## Step 2: Test Card Numbers

Use these test card numbers for different scenarios:

### Successful Payments
- **Default**: `4242 4242 4242 4242`
- **Requires Authentication**: `4000 0027 6000 3184`

### Failed Payments
- **Declined**: `4000 0000 0000 0002`
- **Insufficient Funds**: `4000 0000 0000 9995`

**Note**: Use any future date for expiry, any 3 digits for CVC, and any 5 digits for ZIP.

## Step 3: Testing Each Feature

### 3.1 Test Webhook Locally

1. Start your app:
```bash
npm run dev
```

2. In another terminal, forward webhooks:
```bash
stripe listen --forward-to localhost:3005/api/stripe/webhooks
```

3. Copy the webhook signing secret that appears and update `STRIPE_WEBHOOK_SECRET` in `.env.local`

### 3.2 Test Customer Creation

1. Sign up for a new account on your app
2. Go to the pricing page
3. Click on a subscription plan
4. You should be redirected to Stripe Checkout

### 3.3 Test Subscription Purchase

1. On the Stripe Checkout page:
   - Enter test card: `4242 4242 4242 4242`
   - Any future expiry date
   - Any 3-digit CVC
   - Fill in email and name

2. Complete the purchase

3. You should be redirected back to your app

4. Check:
   - User profile has `stripeCustomerId`
   - Subscription is active in `/dashboard/billing`

### 3.4 Test Billing Dashboard

Navigate to `/dashboard/billing` and verify:

- ✅ Current subscription displays correctly
- ✅ "Manage Billing" opens Stripe Customer Portal
- ✅ Cancel/Resume subscription buttons work
- ✅ Upcoming invoice shows (if applicable)
- ✅ Invoice history displays
- ✅ Download invoice PDF works

### 3.5 Test Subscription Management

1. **Cancel Subscription**:
   - Click "Cancel Subscription"
   - Verify it shows "Canceling" status
   - Check end date is displayed

2. **Resume Subscription**:
   - Click "Resume Subscription"
   - Verify status returns to "Active"

3. **Change Plan** (via Customer Portal):
   - Click "Manage Billing"
   - Update subscription in Stripe Portal
   - Return to app and verify changes

### 3.6 Test Webhook Events

Monitor the Stripe CLI output for webhook events:

```bash
# You should see events like:
2024-01-15 12:00:00  --> checkout.session.completed [evt_xxx]
2024-01-15 12:00:01  --> customer.subscription.created [evt_xxx]
2024-01-15 12:00:02  --> invoice.payment_succeeded [evt_xxx]
```

## Step 4: Common Testing Scenarios

### Scenario 1: New User Full Flow
1. Sign up → Go to Pricing → Subscribe → Verify Dashboard

### Scenario 2: Subscription Lifecycle
1. Subscribe → Cancel → Resume → Change Plan

### Scenario 3: Failed Payment Recovery
1. Use card `4000 0000 0000 0341` (fails after attaching)
2. Update payment method in Customer Portal
3. Verify subscription reactivates

## Step 5: Verify in Stripe Dashboard

Check these sections in your [Stripe Test Dashboard](https://dashboard.stripe.com/test/):

1. **Customers**: New customers created
2. **Subscriptions**: Active subscriptions
3. **Payments**: Successful payments
4. **Events**: Webhook deliveries
5. **Logs**: API request logs

## Debugging Tips

### Check Logs
```bash
# Your app logs
npm run dev

# Stripe webhook logs
stripe listen --forward-to localhost:3005/api/stripe/webhooks

# Stripe CLI logs
stripe logs tail
```

### Common Issues

1. **"No Stripe customer found"**
   - Ensure user has completed at least one checkout
   - Check if `stripeCustomerId` is saved in profile

2. **Webhook signature verification failed**
   - Make sure `STRIPE_WEBHOOK_SECRET` matches the one from `stripe listen`
   - Restart your dev server after updating `.env.local`

3. **Products not showing correct names**
   - Add metadata to your Stripe products:
     - Key: `membership`
     - Value: `pro` or appropriate tier

## Test Checklist

- [ ] Environment variables configured
- [ ] Test products created in Stripe
- [ ] Webhook forwarding working
- [ ] Can create new subscription
- [ ] Billing dashboard loads correctly
- [ ] Can cancel subscription
- [ ] Can resume subscription  
- [ ] Can download invoices
- [ ] Customer portal accessible
- [ ] Webhook events processed

## Production Deployment

Before going live:

1. Switch to live API keys
2. Create production webhook endpoint
3. Update webhook signing secret
4. Create real products/prices
5. Test with real card (small amount)
6. Enable additional payment methods if needed 