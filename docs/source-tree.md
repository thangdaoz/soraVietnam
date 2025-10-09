---
# Source Tree: Sora Vietnam Gateway

**Last Updated:** October 7, 2025

This document captures the current folder and file layout so the growing codebase stays predictable. Update this list whenever you add or reorganize major features.

.
|-- .vscode/                    # Workspace preferences and recommended extensions
|   |-- extensions.json
|   `-- settings.json
|-- docs/                       # Project documentation (architecture, reviews, guides)
|   |-- api-endpoints.md
|   |-- component-library.md
|   |-- database-schema.md
|   |-- security-hardening-review.md
|   `-- ...                     # Additional design, pricing, and progress reports
|-- scripts/                    # Developer scripts and helper notes
|   `-- apply-migrations.md     # How to run Supabase migrations locally
|-- src/                        # Next.js 15 application source
|   |-- app/                    # App Router segments, layouts, and global styles
|   |   |-- layout.tsx          # Root layout (language, theming, metadata)
|   |   |-- globals.css         # Tailwind CSS base layer and globals
|   |   |-- page.tsx            # Marketing landing page
|   |   |-- auth/               # Authentication flow pages and routes
|   |   |   |-- callback/route.ts   # OAuth callback exchange
|   |   |   |-- error/page.tsx      # Error screen for auth failures
|   |   |   |-- success/page.tsx    # Post-auth success screen
|   |   |   `-- verify-email/page.tsx # Email verification instructions
|   |   |-- checkout/page.tsx    # Payment and credit purchase flow
|   |   |-- components-showcase/page.tsx # Interactive component gallery
|   |   |-- dashboard/page.tsx   # Authenticated dashboard entry
|   |   |-- design-system/page.tsx # Design tokens and style references
|   |   |-- forgot-password/page.tsx
|   |   |-- gallery/page.tsx
|   |   |-- login/page.tsx
|   |   |-- profile/page.tsx
|   |   |-- reset-password/page.tsx
|   |   |-- sign-up/page.tsx
|   |   `-- test-supabase/page.tsx   # Connectivity and session diagnostics
|   `-- (future routes)              # Add new segments here as features ship
|-- src/components/             # Shared React components
|   |-- AuthButtons.tsx          # Auth-aware navigation cluster
|   |-- examples/                # Demo wrappers for the design system
|   |   `-- ButtonExamples.tsx
|   `-- ui/                      # Reusable UI primitives (exported via index.ts)
|       |-- Alert.tsx
|       |-- Badge.tsx
|       |-- Button.tsx
|       |-- Card.tsx
|       |-- Checkbox.tsx
|       |-- Container.tsx
|       |-- Input.tsx
|       |-- Loading.tsx
|       |-- Select.tsx
|       |-- Textarea.tsx
|       `-- index.ts
|-- src/lib/                    # Shared utilities, server actions, and Supabase helpers
|   |-- actions/
|   |   `-- auth.ts             # Authentication server actions with Zod validation
|   `-- supabase/
|       |-- client.ts           # Browser client factory
|       |-- database.types.ts   # Generated database typings
|       |-- helpers.ts          # Common Supabase helper functions
|       `-- server.ts           # Server-side client factory
|-- src/middleware.ts           # Route protection and session handling
|-- supabase/                   # Supabase CLI artifacts
|   `-- migrations/             # SQL migrations (schema, RLS, security, hardening)
|       |-- 20251007_initial_schema.sql
|       |-- 20251007_rls_policies.sql
|       |-- 20251007_security_functions.sql
|       |-- 20251007_enhanced_security.sql
|       `-- 20251007_security_hardening.sql
|-- .env.example                # Documented environment variables (safe to commit)
|-- .env.local                  # Local secrets (never commit)
|-- .gitignore                  # Git ignore rules
|-- .prettierignore
|-- .prettierrc                 # Prettier formatting rules
|-- eslint.config.mjs           # ESLint configuration
|-- next.config.ts              # Next.js configuration
|-- package.json                # Dependencies and npm scripts
|-- postcss.config.mjs          # Tailwind/PostCSS configuration
|-- QUICKSTART.md               # Fast onboarding steps
|-- SETUP.md                    # Full installation guide
|-- TODO.md                     # Master task tracker
|-- tsconfig.json               # TypeScript compiler options
`-- WEEK1-2-COMPLETE.md         # Milestone completion log

## Notes
- `node_modules/` and build artifacts such as `.next/` are omitted intentionally.
- Keep Supabase migrations in chronological order and reference them in `scripts/apply-migrations.md`.
- Document new feature areas in `docs/` and add notable routes or components here when they are production ready.
---
