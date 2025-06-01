# Firebase Next.js SaaS Template

A modern, production-ready SaaS template built with Next.js and Firebase.

## Features

- 🔐 Authentication with Firebase Auth (Email/Password + Google)
- 💾 Database with Firebase Firestore
- 📁 File Storage with Firebase Storage
- 💳 Payments with Stripe
- 📊 Analytics with PostHog
- 🎨 UI Components with Shadcn
- 🌙 Dark Mode Support
- 📱 Fully Responsive

## Tech Stack

- Frontend: [Next.js](https://nextjs.org/), [Tailwind CSS](https://tailwindcss.com/), [Shadcn UI](https://ui.shadcn.com/), [Framer Motion](https://www.framer.com/motion/)
- Backend: [Firebase](https://firebase.google.com/) (Auth, Firestore, Storage)
- Payments: [Stripe](https://stripe.com/)
- Analytics: [PostHog](https://posthog.com/)
- Deployment: [Vercel](https://vercel.com/)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A [Firebase](https://firebase.google.com/) account and project
- A [Stripe](https://stripe.com/) account
- A [PostHog](https://posthog.com/) account (optional)

### Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env.local` and fill in your environment variables:

```bash
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
FIREBASE_SERVICE_ACCOUNT_PATH=./path-to-service-account.json

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# PostHog (optional)
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key
NEXT_PUBLIC_POSTHOG_HOST=your_posthog_host
```

4. Set up Firebase:
   - Enable Authentication (Email/Password and Google)
   - Create a Firestore database
   - Set up Firebase Storage
   - Download your service account key and place it in the project root

5. Run the development server: `npm run dev`

## Firebase Setup

### Authentication

1. Go to Firebase Console > Authentication
2. Enable Email/Password and Google sign-in providers
3. Add your domain to authorized domains

### Firestore

1. Create a Firestore database in production mode
2. The app will automatically create collections as needed

### Storage

1. Enable Firebase Storage
2. Set up security rules for your buckets

## Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add all environment variables in Vercel dashboard
4. Deploy!

## License

MIT
