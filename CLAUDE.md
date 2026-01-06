# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FishQuery UI is a Next.js frontend for an AI-powered Western Australia recreational fishing regulations assistant. It connects to a GraphQL backend for chat functionality and user authentication.

## Commands

```bash
pnpm dev      # Start development server (localhost:3000)
pnpm build    # Production build
pnpm lint     # Run ESLint
```

## Architecture

- **Framework**: Next.js 16 with App Router
- **State Management**: Apollo Client 4 for GraphQL (queries, mutations, subscriptions)
- **Styling**: Tailwind CSS 4 with CSS variables for theming
- **Auth**: Custom JWT-based auth via `useAuth` hook, tokens stored in localStorage

## Key Files

- `src/lib/graphql.ts` - All GraphQL operations (queries, mutations, subscriptions)
- `src/hooks/useAuth.tsx` - Authentication context and hooks
- `src/components/apollo-provider.tsx` - Apollo Client setup with WebSocket subscriptions
- `src/app/chat/` - Chat interface pages

## Code Conventions

- Use `"use client"` directive for client components
- Path alias `@/` maps to `src/`
- Components use Tailwind with `cn()` utility from `src/lib/utils.ts` for class merging
- GraphQL operations follow naming: `GET_*`, `SUBSCRIBE_TO_*`, `*_MUTATION`

## Environment Variables

Required in `.env.local`:

- GraphQL endpoint URL
- WebSocket endpoint for subscriptions
