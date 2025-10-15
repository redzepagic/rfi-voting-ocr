# Bosnian Voting Tablet Application

## Overview

This is a tablet-optimized electronic voting scanner application designed for Bosnia and Herzegovina's voting system. The application provides a kiosk-mode interface for voters to scan their paper ballots, with full support for the Bosnian language (Latin script). It features a multi-screen flow guiding users through the voting process, from welcome to ballot scanning to result confirmation, with comprehensive error handling for invalid or damaged ballots.

The system is built as a full-stack web application optimized for 1024x768 tablet resolution, featuring government-sector design standards with high accessibility, clear visual hierarchy, and institutional trust elements using BiH national colors (blue #003893 and yellow #FECB00).

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server
- Framer Motion for smooth screen transitions and animations
- TanStack Query (React Query) for server state management and API communication
- React Hook Form with Zod validation for form handling

**UI Component System:**
- shadcn/ui component library (New York style variant) for consistent design
- Radix UI primitives for accessible, unstyled components
- Tailwind CSS with custom design tokens for styling
- Custom theme using BiH national colors as primary palette
- Tablet-optimized layout with 1024x768 fixed viewport
- Kiosk mode design (full-screen, disabled text selection, no context menu)

**Screen Flow Architecture:**
The application implements a finite state machine pattern with distinct screens:
1. Welcome Screen - Location identification and start prompt
2. Instruction Screen - Visual voting instructions
3. Scanner Screen - Ready-to-scan state with animations
4. Scanning Progress - Multi-step progress indicator
5. Success Screen - Confirmation with auto-redirect countdown
6. Error Screen - Recoverable errors (multiple selections, damaged, unreadable)
7. Invalid Screen - Non-recoverable invalid ballot state

**State Management:**
- Component-level state using React hooks (useState, useRef, useCallback)
- Server state synchronized via TanStack Query with polling disabled
- Admin panel uses dialog state management
- Inactivity timer and tap detection for admin access (5-tap gesture)
- Session timeout handling with automatic reset to welcome screen

### Backend Architecture

**Server Framework:**
- Express.js with TypeScript for type-safe API development
- ESM module system (type: "module" in package.json)
- Custom middleware for request logging and error handling
- Development/production environment separation

**API Structure:**
RESTful endpoints organized by domain:
- `/api/stats` - GET voting statistics
- `/api/stats/update` - POST increment counters
- `/api/stats/reset` - POST reset all statistics
- `/api/location` - GET/POST voting location configuration
- `/api/admin/auth` - POST PIN authentication for admin access
- `/api/scan` - POST simulate ballot scanning (with force-result option for testing)

**Request/Response Flow:**
- JSON request/response format
- Zod schema validation on all inputs
- Structured error responses with HTTP status codes
- Request timing and logging middleware for API performance monitoring

### Data Storage Solutions

**Database Technology:**
- PostgreSQL via Neon serverless driver (@neondatabase/serverless)
- Drizzle ORM for type-safe database queries and schema management
- Schema-first approach with TypeScript inference

**Schema Design:**
Two main tables defined in `shared/schema.ts`:

1. `voting_stats` - Aggregate statistics (not per-ballot for privacy):
   - totalScans, successful, failed, invalid counts
   - Error type breakdowns: retries, multipleSelections, damaged, unreadable
   - Auto-updating timestamp

2. `voting_location` - Device configuration:
   - municipality (e.g., "Centar")
   - locationNumber (e.g., "1234")
   - Last update timestamp

**Storage Strategy:**
- In-memory fallback storage (MemStorage class) for development/testing
- No individual ballot data stored (privacy by design)
- Only aggregate statistics and location metadata persisted
- Scan results are ephemeral - generated, displayed, then discarded

**Database Migrations:**
- Drizzle Kit for schema migration management
- Migration files stored in `/migrations` directory
- Schema source of truth in `shared/schema.ts`
- Push-based deployment via `db:push` script

### Authentication and Authorization

**Admin Access Control:**
- PIN-based authentication for administrative functions
- No persistent sessions - single-use authentication per action
- Admin panel accessible via hidden gesture (5 rapid taps on screen)
- Admin capabilities:
  - View real-time statistics
  - Force success/error results for testing
  - Reset all statistics
  - Update location configuration

**Security Considerations:**
- Kiosk mode prevents typical browser interactions
- No user authentication required (public voting terminal)
- Admin PIN stored and validated server-side
- Stateless authentication (no cookies or sessions for admin)

### External Dependencies

**Core Libraries:**
- React 18 + React DOM for UI rendering
- Express.js for HTTP server
- TypeScript for static type checking across stack
- Vite for frontend build and HMR development

**Database & ORM:**
- @neondatabase/serverless - Serverless PostgreSQL driver
- drizzle-orm - Type-safe ORM with PostgreSQL dialect
- drizzle-zod - Zod schema generation from Drizzle schemas
- drizzle-kit - Migration and schema management CLI

**UI Component Libraries:**
- @radix-ui/react-* (20+ component primitives)
- framer-motion - Animation library
- lucide-react - Icon library
- embla-carousel-react - Carousel functionality
- cmdk - Command palette component

**Form & Validation:**
- react-hook-form - Form state management
- @hookform/resolvers - Validation resolver integrations
- zod - Schema validation library

**State Management:**
- @tanstack/react-query - Server state management and caching

**Styling:**
- tailwindcss - Utility-first CSS framework
- autoprefixer - CSS vendor prefixing
- class-variance-authority - Variant-based component styling
- tailwind-merge + clsx - Class name utilities

**Development Tools:**
- tsx - TypeScript execution for Node.js
- esbuild - JavaScript bundler for production builds
- @replit/vite-plugin-* - Replit-specific development plugins
- nanoid - Unique ID generation

**Additional Utilities:**
- date-fns - Date manipulation and formatting
- vaul - Drawer component library
- react-day-picker - Calendar/date picker
- recharts - Charting library (for potential statistics visualization)
- input-otp - OTP input component

**Session Management:**
- connect-pg-simple - PostgreSQL session store for Express (if sessions are enabled)