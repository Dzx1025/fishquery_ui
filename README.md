# FishQuery UI

AI-powered assistant for Western Australia recreational fishing regulations.

[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/Dzx1025/fishquery_ui)

## Tech Stack

- [Next.js 16](https://nextjs.org/) - React framework with App Router
- [React 19](https://react.dev/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS 4](https://tailwindcss.com/) - Styling
- [Apollo Client 4](https://www.apollographql.com/docs/react/) - GraphQL client with subscriptions
- [next-themes](https://github.com/pacocoursey/next-themes) - Dark/light mode
- [Lucide React](https://lucide.dev/) - Icons

## Getting Started

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.local.example .env.local

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

```
src/
├── app/           # Next.js App Router pages
├── components/    # React components
├── hooks/         # Custom hooks (auth)
├── lib/           # Utilities & GraphQL queries
└── types/         # TypeScript types
```

## Features

- 💬 Real-time chat with AI assistant
- 🔐 User authentication
- 🌙 Dark/light theme toggle
- 📡 GraphQL subscriptions for live updates

## License

© 2026 FishQuery Assistant
