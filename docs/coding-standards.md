---
# Coding Standards: Sora Vietnam Gateway

**Last Updated:** October 7, 2025

To ensure a high-quality, maintainable, and scalable codebase, all contributors must adhere to the following standards.

### 1. Core Principles
*   **Language:** The entire project will be written in **TypeScript**. Use TypeScript's features to ensure type safety wherever possible. Avoid using `any` unless absolutely necessary.
*   **Readability over cleverness:** Code is read more often than it is written. Prioritize clear, self-explanatory code over complex, one-line solutions.

### 2. Formatting & Linting
*   **Formatter:** **Prettier** will be used for all code formatting. A Prettier configuration file is included in the project root. All code must be formatted before being committed.
*   **Linter:** **ESLint** will be used to identify and fix code quality issues. The configuration is based on the official Next.js ESLint plugin. All linting errors must be resolved before committing.

### 3. Naming Conventions
*   **Components:** Use `PascalCase` for React component files and function names (e.g., `PromptForm.tsx`).
*   **Variables & Functions:** Use `camelCase` (e.g., `const userProfile`, `function generateVideo()`).
*   **Files (non-component):** Use `kebab-case` for all other files (e.g., `supabase.ts`, `user-actions.ts`).
*   **Types & Interfaces:** Use `PascalCase` and be descriptive (e.g., `interface UserProfile`, `type VideoStatus`).

### 4. Component Architecture
*   **Single Responsibility:** Components should be small and do one thing well. A component that fetches data, manages state, and renders a complex UI should be broken down.
*   **Colocation:** Keep components that are only used on a specific page within that page's directory. For example, a `BillingDetails` component used only on the billing page could live in `src/app/(dashboard)/billing/components/`.
*   **Use Server Components:** Embrace Next.js Server Components by default for fetching data and rendering static content to maximize performance. Use the `"use client"` directive only when you need interactivity, state, or browser-only APIs.

### 5. Environment Variables & Secrets
*   **NEVER** hardcode secret keys (API keys, database connection strings) directly in the code.
*   All secrets must be stored in a `.env.local` file, which is listed in `.gitignore`.
*   Access client-side variables with `process.env.NEXT_PUBLIC_...`
*   Access server-side variables (in Server Components, Server Actions, and Route Handlers) with `process.env...`

### 6. Version Control (Git)
*   **Branching Model:**
    *   `main`: This branch is for production-ready, stable code.
    *   `develop`: This is the primary development branch. All feature branches are created from `develop`.
    *   `feature/[ticket-id]-[short-description]`: All new work must be done on a feature branch (e.g., `feature/SGV-12-billing-page`).
*   **Commit Messages:** Follow the **Conventional Commits** specification. This makes the project history readable and helps automate changelogs.
    *   **Examples:**
        *   `feat: add user login form with email and password`
        *   `fix: resolve issue where credits were not debited correctly`
        *   `docs: update technology stack with final versions`
        *   `style: format code with latest prettier rules`
---
