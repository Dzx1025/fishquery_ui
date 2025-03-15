# FishQuery UI

FishQuery UI is a modern web application that provides an AI assistant interface for asking questions and receiving intelligent answers.

## Overview

FishQuery UI leverages cutting-edge technologies to deliver a responsive and intuitive user experience. The application includes features such as:

- Interactive chat interface with an AI assistant
- Citation support for verified information sources
- Dark/light theme support
- Responsive sidebar navigation
- Authentication system

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **Component Library**: Custom UI components built with Radix UI primitives
- **GraphQL**: Apollo Client for data fetching
- **Authentication**: Custom auth implementation

## Key Components

- **Chat Interface**: Interactive chat with AI responses and citation handling
- **Citation Dialog**: Modal for displaying reference information and extracted content
- **Theme Provider**: System for managing light/dark mode preferences
- **Sidebar**: Collapsible navigation with responsive design for mobile and desktop

## Getting Started

### Prerequisites

- Node.js (version compatible with Next.js 15)
- pnpm package manager

### Installation

```bash
# Install dependencies
pnpm install
```

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

| Env | Example |
| -------- | ------- |
| DJANGO_API_URL  | <http://localhost:8000> |
| NEXT_PUBLIC_GRAPHQL_WS_URL | <ws://localhost:8080/v1/graphql> |
| NEXT_PUBLIC_GRAPHQL_HTTP_URL | <http://localhost:8080/v1/graphql> |

### Development

```bash
# Run development server with Turbopack
pnpm dev
```

### Build for Production

```bash
# Create production build
pnpm build

# Start production server
pnpm start
```

### Linting

```bash
# Run ESLint
pnpm lint
```

## Project Structure

- `/src/app`: Next.js App Router pages and layouts
- `/src/components`: React components
  - `/ui`: Reusable UI components
  - `/chat`: Chat-specific components
  - `/sidebar`: Sidebar components
- `/src/lib`: Utility functions and shared code
- `/src/contexts`: React context providers

## Styling

The project uses Tailwind CSS with custom theming support. Color schemes are defined in `globals.css` with both light and dark mode variations.

## License

Copyright © 2024 FishQuery. All rights reserved.
