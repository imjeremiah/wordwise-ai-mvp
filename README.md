# Firebase Boilerplate

A modern, production-ready Next.js boilerplate with Firebase integration, authentication, payments, and more.

## Features

- **Authentication**: Firebase Auth with email/password and Google OAuth
- **Database**: Cloud Firestore with type-safe collections
- **Storage**: Firebase Storage for file uploads
- **Payments**: Stripe integration with webhooks
- **Styling**: Tailwind CSS + Shadcn UI components
- **Type Safety**: Full TypeScript support
- **Developer Experience**: Hot reload, ESLint, Prettier

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Firebase account and project
- Stripe account
- PostHog account (optional)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ReeceHarding/firebase-boilerplate.git
   cd firebase-boilerplate
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```

4. Configure Firebase:
   ```bash
   npm run firebase:setup
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

## Firebase Setup

### Quick Setup

1. Run the Firebase setup script:
   ```bash
   npm run firebase:setup
   ```

2. Follow the instructions to:
   - Create a Firebase project
   - Enable Authentication providers
   - Set up Firestore database
   - Configure Storage buckets
   - Download service account key

### Manual Setup

1. **Authentication**:
   - Enable Email/Password provider
   - Enable Google provider
   - Add authorized domains

2. **Firestore**:
   - Create database in production mode
   - Deploy security rules: `firebase deploy --only firestore:rules`

3. **Storage**:
   - Enable Cloud Storage
   - Deploy security rules: `firebase deploy --only storage:rules`

## Project Structure

```
├── actions/          # Server actions
│   ├── db/          # Database actions
│   └── storage/     # Storage actions
├── app/             # Next.js app router
├── components/      # React components
├── lib/             # Utility functions
├── types/           # TypeScript types
└── public/          # Static assets
```

## Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ReeceHarding/firebase-boilerplate)

1. Click the deploy button above
2. Add your environment variables
3. Deploy!

### Manual Deployment

1. Push to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run firebase:setup` - Firebase setup wizard
- `firebase deploy` - Deploy Firebase rules

## Environment Variables

```bash
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
FIREBASE_SERVICE_ACCOUNT_PATH=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PORTAL_LINK=
NEXT_PUBLIC_STRIPE_PAYMENT_LINK_YEARLY=
NEXT_PUBLIC_STRIPE_PAYMENT_LINK_MONTHLY=

# PostHog (optional)
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](license) file for details.

## Links

- [Documentation](docs/)
- [Firebase Console](https://console.firebase.google.com)
- [Demo](https://firebase-boilerplate.vercel.app)

---

Built with ❤️ using Next.js and Firebase 