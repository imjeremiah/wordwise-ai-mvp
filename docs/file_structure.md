# Firebase Boilerplate File Structure

## Project Organization

```
firebase-boilerplate/
├── .github/                  # GitHub specific files
│   └── funding.yaml         # GitHub sponsors configuration
│
├── .husky/                  # Git hooks for code quality
│   └── pre-commit          # Pre-commit hook
│
├── actions/                 # Server actions (server-side only)
│   ├── db/                 # Database-related actions
│   │   ├── profiles-actions.ts      # Profile CRUD operations
│   │   └── users-actions.ts         # User CRUD operations
│   └── storage/            # Storage-related actions
│       └── storage-actions.ts       # File upload/download operations
│
├── app/                     # Next.js App Router
│   ├── (auth)/             # Auth group route
│   │   ├── login/          # Login page
│   │   └── signup/         # Sign up page
│   ├── (marketing)/        # Marketing pages group
│   │   ├── about/          # About page
│   │   ├── contact/        # Contact page
│   │   └── pricing/        # Pricing page
│   ├── api/                # API routes
│   │   ├── auth/           # Auth endpoints
│   │   │   └── session/    # Session management
│   │   └── stripe/         # Stripe endpoints
│   │       └── webhooks/   # Stripe webhooks
│   ├── dashboard/          # Protected dashboard area
│   │   ├── page.tsx        # Dashboard main page
│   │   └── settings/       # User settings
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   └── globals.css         # Global styles
│
├── components/              # Reusable components
│   ├── landing/            # Landing page components
│   │   ├── hero.tsx        # Hero section
│   │   ├── features.tsx    # Features section
│   │   └── testimonials.tsx # Testimonials
│   ├── magicui/            # Magic UI components
│   ├── sidebar/            # Sidebar navigation
│   │   ├── app-sidebar.tsx # Main sidebar
│   │   └── nav-user.tsx    # User navigation
│   ├── ui/                 # Shadcn UI components
│   │   ├── button.tsx      # Button component
│   │   ├── card.tsx        # Card component
│   │   └── ...            # Other UI components
│   └── utilities/          # Utility components
│       └── posthog/        # Analytics components
│
├── db/                      # Database configuration
│   ├── db.ts               # Firestore setup and collections
│   └── migrations/         # Migration files (if needed)
│
├── docs/                    # Documentation
│   ├── README.md           # Original readme
│   ├── file_structure.md   # This file
│   └── *.md               # Other documentation
│
├── hooks/                   # Custom React hooks
│   └── use-*.ts           # Custom hook files
│
├── lib/                     # Utility libraries
│   ├── firebase-config.ts  # Firebase Admin SDK config
│   ├── firebase-client.ts  # Firebase Client SDK config
│   ├── firebase-auth.ts    # Auth helpers
│   ├── stripe.ts          # Stripe configuration
│   ├── utils.ts           # Utility functions
│   └── hooks/             # Additional hooks
│
├── prompts/                # AI prompts
│   └── frontend.mdc        # Frontend component design system based on hero section patterns
│
├── public/                 # Static assets
│   ├── favicon.ico        # Site favicon
│   └── images/            # Static images
│
├── scripts/                # Build/setup scripts
│   └── setup-firebase.js  # Firebase setup wizard
│
├── types/                  # TypeScript type definitions
│   ├── index.ts           # Type exports
│   ├── firebase-types.ts  # Firebase document types
│   └── actions-types.ts   # Action response types
│
├── .env.example           # Example environment variables
├── .env.local            # Local environment variables (gitignored)
├── .eslintrc.json        # ESLint configuration
├── .firebaserc           # Firebase project configuration
├── .gitignore            # Git ignore file
├── .repo_ignore          # Repository specific ignores
├── components.json       # Shadcn UI configuration
├── firebase.json         # Firebase configuration
├── firestore.indexes.json # Firestore indexes
├── firestore.rules       # Firestore security rules
├── license               # MIT license
├── middleware.ts         # Next.js middleware for auth
├── next.config.mjs       # Next.js configuration
├── package.json          # NPM dependencies
├── postcss.config.mjs    # PostCSS configuration
├── prettier.config.cjs   # Prettier configuration
├── README.md             # Project readme
├── storage.rules         # Firebase Storage rules
├── tailwind.config.ts    # Tailwind CSS configuration
└── tsconfig.json         # TypeScript configuration
```

## Key Directories Explained

### `/actions`
Server-side only functions that handle data mutations. These use the `"use server"` directive and return `ActionState<T>` types.

### `/app`
Next.js App Router structure. Groups like `(auth)` and `(marketing)` organize routes without affecting the URL structure.

### `/components`
Reusable React components organized by feature. The `ui/` folder contains Shadcn components.

### `/lib`
Core utilities and configurations. Firebase setup files and helper functions live here.

### `/types`
All TypeScript interfaces and types. Exported through the main `index.ts` file.

## Important Files

### Authentication
- `lib/firebase-auth.ts` - Session management and auth helpers
- `middleware.ts` - Route protection
- `app/api/auth/session/route.ts` - Session API endpoint

### Database
- `db/db.ts` - Firestore collections configuration
- `actions/db/*` - Database CRUD operations
- `types/firebase-types.ts` - Document type definitions

### Configuration
- `.env.local` - Environment variables (create from .env.example)
- `firebase.json` - Firebase services configuration
- `firestore.rules` - Database security rules
- `storage.rules` - Storage security rules

## Development Workflow

1. **Components**: Create in `/components` (shared) or route `/_components` (route-specific)
2. **Server Actions**: Add to `/actions` with proper naming convention
3. **Types**: Define in `/types` and export in `index.ts`
4. **API Routes**: Create in `/app/api` following Next.js conventions
5. **Protected Routes**: Add to middleware.ts matcher array 