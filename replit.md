# Natalie - 自律小幫手

## Overview

Natalie is a self-discipline and habit-building app designed for children, featuring a cute, gamified experience with stickers, timers, and task management. The app draws inspiration from Duolingo, Forest App, and Headspace to create an encouraging environment where discipline feels like play through visual rewards and gentle guidance.

## User Preferences

- Preferred communication style: Simple, everyday language
- **Language**: Traditional Chinese (Hong Kong) - zh-Hant-HK
- **Target Platform**: Android (PWA installable app)

## Recent Changes (January 2026)

- Full Traditional Chinese (HK) localization across all UI text, navigation, pages, validation messages, and sample data
- PWA (Progressive Web App) implementation for Android installation
- Service worker with offline caching support
- Custom app icons for Android home screen
- **Offline Mode with Sync**: Full offline support with local data caching and automatic sync when online

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight alternative to React Router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **UI Components**: shadcn/ui component library with Radix UI primitives
- **Animations**: Framer Motion for smooth, playful interactions
- **Build Tool**: Vite with custom plugins for Replit integration

The frontend follows a mobile-first design with bottom navigation (5 tabs: 主頁, 日程, 計時, 貼紙, 檔案). The visual design uses soft, rounded corners and a pink feminine theme with light/dark mode support via CSS variables.

### PWA Configuration
- **Manifest**: `/manifest.json` with app metadata in Traditional Chinese
- **Service Worker**: `/sw.js` with cache-first strategy for static assets and API caching
- **Icons**: `/icons/icon-192.png` and `/icons/icon-512.png` for Android installation
- **Offline Support**: Full offline mode with localStorage caching and sync queue

### Offline Mode Architecture
- **Local Storage**: Tasks and progress cached in localStorage (`natalie_tasks`, `natalie_progress`)
- **Sync Queue**: Pending operations stored in `natalie_sync_queue` for later sync
- **ID Mapping**: Local-to-server ID mapping (`natalie_id_map`) ensures data integrity after sync
- **Offline Indicator**: UI component shows current network status and pending sync count
- **Auto Sync**: Automatically syncs pending operations when connection is restored
- **Key Files**:
  - `client/src/lib/offline-storage.ts`: localStorage utilities
  - `client/src/lib/sync-manager.ts`: Sync queue processing
  - `client/src/hooks/use-online-status.ts`: Network status detection
  - `client/src/components/offline-indicator.tsx`: Status UI

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Style**: REST API with JSON responses
- **Storage**: In-memory storage with interface abstraction (`IStorage`) for easy database migration
- **Schema Validation**: Zod for runtime type checking and validation
- **Build**: ESBuild for production bundling

The server uses a clean separation between routes, storage, and static file serving. The storage layer implements an interface pattern allowing seamless transition from in-memory to PostgreSQL.

### Data Models
- **Tasks**: Schedulable items with optional duration, recurrence, and associated sticker rewards
- **UserProgress**: Points, streaks, completed tasks, unlocked stickers, timer sessions
- **TimerSession**: Focus timer with duration tracking
- **Stickers**: Collectible rewards organized by category (magical-girls, cute-animals, nature, achievements)

### Design System
- **Typography**: Nunito font family for friendly, child-appropriate text
- **Colors**: HSL-based color system with semantic tokens (primary, secondary, accent, destructive)
- **Spacing**: Tailwind's default spacing scale with custom radius values
- **Components**: Custom button variants with elevation effects for tactile feedback

## External Dependencies

### Database
- **Drizzle ORM**: Schema definition and database operations
- **PostgreSQL**: Configured via `DATABASE_URL` environment variable
- **drizzle-kit**: Database migration tooling (`db:push` command)

### Third-Party Services
- **Google Fonts**: Nunito font loaded via CDN
- **No external APIs currently integrated**

### Key NPM Packages
- `@tanstack/react-query`: Server state management
- `@radix-ui/*`: Accessible UI primitives
- `framer-motion`: Animation library
- `date-fns`: Date manipulation utilities
- `zod`: Schema validation
- `wouter`: Lightweight routing
- `class-variance-authority`: Component variant management