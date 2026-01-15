# Natalie - Self-Discipline App

## Overview

Natalie is a self-discipline and habit-building app designed for children, featuring a cute, gamified experience with stickers, timers, and task management. The app draws inspiration from Duolingo, Forest App, and Headspace to create an encouraging environment where discipline feels like play through visual rewards and gentle guidance.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight alternative to React Router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **UI Components**: shadcn/ui component library with Radix UI primitives
- **Animations**: Framer Motion for smooth, playful interactions
- **Build Tool**: Vite with custom plugins for Replit integration

The frontend follows a mobile-first design with bottom navigation (5 tabs: Home, Schedule, Timer, Stickers, Profile). The visual design uses soft, rounded corners and a pink feminine theme with light/dark mode support via CSS variables.

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