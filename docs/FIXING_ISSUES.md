# Fixing Current Issues

## Issue 1: Firebase Auth Error

**Problem**: Firebase Admin SDK is not initialized, causing auth errors.

**Solution**:
1. Stop your dev server (Ctrl+C in the terminal running `npm run dev`)
2. Start it again: `npm run dev`
3. The server will now load the Firebase service account file properly

## Issue 2: Stripe CLI Authentication Expired

**Problem**: Your Stripe CLI authentication has expired.

**Solution**:
1. Open a new terminal
2. Run: `stripe login`
3. Visit the URL shown: https://dashboard.stripe.com/stripecli/confirm_auth?t=...
4. Click "Allow access" in your browser
5. Return to terminal and press Enter

After fixing both issues:
1. Run: `stripe listen --forward-to localhost:3005/api/stripe/webhooks`
2. Copy the webhook secret (starts with `whsec_`)
3. Add it to your `.env.local` file:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_your_secret_here
   ```

## Quick Test

After fixing both issues, test that everything works:
1. Visit http://localhost:3005/pricing
2. Click "Get Started" on any plan
3. Use test card: 4242 4242 4242 4242 