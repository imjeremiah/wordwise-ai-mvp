# WordWise AI

**Grammar & Style Assistant Powered by AI**

Transform your writing with intelligent grammar and style suggestions. WordWise AI is a professional writing assistant that learns your style and helps you write with confidence.

## ✨ Features

- **Real-time Grammar Checking** - Catch grammar mistakes as you type
- **Style & Tone Suggestions** - Improve clarity and readability
- **Privacy-Focused AI** - Your content stays secure and private
- **Context-Aware Suggestions** - AI that understands what you're writing
- **Professional Writing Tools** - Built for writers, content creators, and professionals

## 🚀 Quick Start

Get WordWise AI running locally with just two commands:

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit [http://localhost:3005](http://localhost:3005) to see WordWise AI in action.

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Firebase (Firestore, Auth, Functions)
- **AI**: OpenAI GPT-4 for grammar and style suggestions  
- **Deployment**: Vercel, Firebase Hosting
- **Analytics**: PostHog (optional)
- **Payments**: Stripe (optional)

## 📦 Development Setup

### Prerequisites

- Node.js 18.x or 20.x
- npm or yarn
- Firebase CLI (installed globally)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd wordwise-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Fill in your Firebase and OpenAI credentials
   ```

4. **Start Firebase emulators**
   ```bash
   npm run emulators
   ```

5. **Start development server** (in a new terminal)
   ```bash
   npm run dev
   ```

## 🔧 Available Scripts

- `npm run dev` - Start development server with logging
- `npm run build` - Build for production
- `npm run build:export` - Build and export static site
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format:write` - Format code with Prettier
- `npm run type-check` - Run TypeScript type checking
- `npm run emulators` - Start Firebase emulators
- `npm run emulators:ui` - Start emulators with UI

## 🏗️ Project Structure

```
wordwise-ai/
├── app/                    # Next.js app router
│   ├── (auth)/            # Authentication routes
│   ├── (marketing)/       # Marketing pages
│   ├── api/               # API routes
│   └── dashboard/         # Protected dashboard
├── components/            # Shared React components
│   ├── ui/               # shadcn/ui components
│   ├── landing/          # Marketing page components
│   └── utilities/        # Utility components
├── lib/                  # Library code and utilities
├── actions/              # Server actions
├── types/                # TypeScript type definitions
├── public/               # Static assets
└── docs/                 # Documentation
```

## 🔐 Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
# ... other Firebase vars

# OpenAI API
OPENAI_API_KEY=

# Optional: Stripe, PostHog
STRIPE_SECRET_KEY=
NEXT_PUBLIC_POSTHOG_KEY=
```

## 🧪 Testing

```bash
# Run type checking
npm run type-check

# Run linting
npm run lint

# Run formatting check
npm run format:check
```

## 🚀 Deployment

### Static Export
```bash
npm run build:export
```

### Firebase Hosting
```bash
firebase deploy --only hosting
```

## 📝 Development Phases

This project follows a structured development approach:

- **Phase 1**: Foundation & Boilerplate ✅
- **Phase 2**: Data Layer & Firebase Integration
- **Phase 3**: Interface Layer & Components  
- **Phase 4**: Core AI Functionality

See `/docs/checklist.md` for detailed progress tracking.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/), [Firebase](https://firebase.google.com/), and [OpenAI](https://openai.com/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide React](https://lucide.dev/) 