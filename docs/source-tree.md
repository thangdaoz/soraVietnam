---
# Source Tree: Sora Vietnam Gateway

**Last Updated:** October 7, 2025

This document defines the standard folder and file structure for the project. Adhering to this structure ensures consistency and predictability across the codebase.

.
├── /public/                  # Static assets (images, fonts, favicons)
├── /src/                     # Main application source code
│   ├── /app/                 # Next.js App Router directory
│   │   ├── /api/             # Route handlers (for webhooks like Casso)
│   │   ├── /(auth)/          # Route group for auth pages (login, signup)
│   │   │   ├── /login/
│   │   │   └── /signup/
│   │   ├── /(dashboard)/     # Route group for protected user pages
│   │   │   ├── /dashboard/   # Main creation page
│   │   │   ├── /billing/     # Billing and account management
│   │   │   └── layout.tsx    # Layout specific to the dashboard
│   │   ├── favicon.ico
│   │   ├── globals.css       # Global styles
│   │   └── layout.tsx        # Root application layout
│   │   └── page.tsx          # Homepage component
│   │
│   ├── /components/          # Shared, reusable React components
│   │   ├── /ui/              # Generic UI elements (Button, Input, Card, Modal)
│   │   └── /specific/        # Components for specific features (VideoGallery, PromptForm)
│   │
│   ├── /lib/                 # Helper functions, utilities, and SDK clients
│   │   ├── supabase.ts       # Supabase client initialization (client & server)
│   │   ├── utils.ts          # General utility functions
│   │   └── actions.ts        # Next.js Server Actions for forms/mutations
│   │
│   └── /types/               # TypeScript type definitions (e.g., UserProfile, Video)
│       └── index.ts
│
├── /supabase/                # Supabase local development configuration
│   ├── /functions/           # Supabase Edge Functions (e.g., generate-video)
│   └── /migrations/          # Database schema changes (managed by Supabase CLI)
│
├── .env.local                # Local environment variables (API keys - NEVER commit to Git)
├── .eslintrc.json            # ESLint configuration
├── next.config.mjs           # Next.js configuration
├── package.json              # Project dependencies and scripts
├── prettier.config.js        # Prettier configuration
└── tsconfig.json             # TypeScript configuration
---
