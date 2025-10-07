# Setup Guide - Sora Vietnam Gateway

## ✅ Project Setup Complete!

Your Sora Vietnam Gateway project has been successfully initialized with all the latest technologies as specified in your technology stack documentation.

## 🎉 What's Been Configured

### Core Framework & Libraries

- ✅ **Next.js 15.1.8** - Latest stable with App Router
- ✅ **React 19** - Automatically managed by Next.js 15
- ✅ **TypeScript 5.7.3** - Full type safety
- ✅ **Tailwind CSS 4.1.0** - Latest with Oxide engine and CSS-first configuration

### Backend & Authentication

- ✅ **Supabase Client 2.58.0+** - Latest SDK
- ✅ **Supabase SSR 0.5.2** - Server-side rendering support
- ✅ Middleware for authentication and session management
- ✅ Browser and server client configurations

### Development Tools

- ✅ **ESLint** - Next.js 15 compatible configuration
- ✅ **PostCSS** - Configured with Tailwind CSS 4 plugin
- ✅ **Turbopack** - Enabled for faster development builds

## 📁 Project Structure

```
soraVietnam/
├── docs/                           # Your existing documentation
│   ├── project-charter.md
│   ├── technology-stack.md
│   └── ...
├── src/
│   ├── app/
│   │   ├── layout.tsx             # Root layout with Vietnamese locale
│   │   ├── page.tsx               # Landing page
│   │   └── globals.css            # Tailwind CSS 4 with @theme config
│   ├── lib/
│   │   └── supabase/
│   │       ├── client.ts          # Browser Supabase client
│   │       └── server.ts          # Server Supabase client
│   └── middleware.ts              # Auth middleware
├── .env.example                   # Environment template
├── .gitignore                     # Git ignore configuration
├── next.config.ts                 # Next.js configuration
├── postcss.config.mjs             # PostCSS with Tailwind 4
├── tsconfig.json                  # TypeScript configuration
├── eslint.config.mjs              # ESLint configuration
├── package.json                   # Dependencies and scripts
└── README.md                      # Main documentation

```

## 🚀 Next Steps

### 1. Configure Environment Variables

Create your `.env.local` file:

```bash
cp .env.example .env.local
```

Then update with your actual credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

Get your Supabase credentials from:

1. Go to [supabase.com](https://supabase.com)
2. Create a new project (or use existing)
3. Go to Settings → API
4. Copy the Project URL and anon/public key

### 2. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app!

The dev server uses **Turbopack** for blazing-fast hot reload.

### 3. Set Up Supabase Database Schema

Create tables for:

- **users** - User profiles and authentication
- **videos** - Generated video metadata
- **credits** - User credit system
- **transactions** - Payment history

Example SQL for users table:

```sql
-- Enable Row Level Security
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  credits integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.profiles enable row level security;

-- Policy for users to read their own profile
create policy "Users can view their own profile"
  on profiles for select
  using ( auth.uid() = id );

-- Policy for users to update their own profile
create policy "Users can update their own profile"
  on profiles for update
  using ( auth.uid() = id );
```

### 4. Key Features of Your Setup

#### Tailwind CSS 4 Configuration

Your `globals.css` uses the new CSS-first approach:

- `@import "tailwindcss"` - New v4 syntax
- `@theme { }` - Define custom colors and tokens in CSS
- Custom primary color palette for branding
- Dark mode support out of the box

#### Supabase Integration

- **Browser Client** (`src/lib/supabase/client.ts`) - For client components
- **Server Client** (`src/lib/supabase/server.ts`) - For server components/actions
- **Middleware** - Automatic session refresh and auth guards

#### Vietnamese Localization

- HTML lang set to "vi"
- Vietnamese content in landing page
- Ready for i18n expansion

## 📝 Available Scripts

```bash
# Development
npm run dev              # Start dev server with Turbopack
npm run build            # Build for production
npm run start            # Start production server

# Code Quality
npm run lint             # Run ESLint
npm run type-check       # Check TypeScript types
```

## 🔧 Customization Guide

### Adding New Routes

Create a new folder in `src/app/`:

```typescript
// src/app/dashboard/page.tsx
export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
    </div>
  )
}
```

### Creating Server Actions

```typescript
// src/app/actions.ts
'use server';

import { createClient } from '@/lib/supabase/server';

// src/app/actions.ts

// src/app/actions.ts

// src/app/actions.ts

// src/app/actions.ts

export async function getUserProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();

  return data;
}
```

### Using Supabase in Client Components

```typescript
'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export function UserProfile() {
  const [user, setUser] = useState(null)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })
  }, [])

  return <div>{user?.email}</div>
}
```

## 🎨 Tailwind CSS 4 Usage

### Using Theme Variables

```tsx
<div className="bg-primary-500 hover:bg-primary-600">
  <p className="text-primary-950">Content</p>
</div>
```

### Custom Utilities

Add to `globals.css`:

```css
@layer utilities {
  .text-shadow {
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  }
}
```

## 🔒 Security Best Practices

1. **Never commit `.env.local`** - Already in .gitignore
2. **Use Row Level Security (RLS)** in Supabase for all tables
3. **Validate user input** on both client and server
4. **Use server actions** for sensitive operations
5. **Enable Supabase auth policies** for data protection

## 🐛 Troubleshooting

### Type Errors After Setup

Run:

```bash
npm run type-check
```

TypeScript errors shown are normal until dependencies are installed. They should resolve after `npm install` completes.

### Supabase Connection Issues

1. Check your `.env.local` file exists and has correct values
2. Verify your Supabase project is active
3. Check the API URL format: `https://xxxxx.supabase.co`

### Tailwind Styles Not Working

1. Ensure PostCSS is configured: `postcss.config.mjs` exists
2. Restart dev server: `Ctrl+C` then `npm run dev`
3. Clear `.next` folder: `rm -rf .next` or `rmdir /s .next`

## 📚 Resources

- [Next.js 15 Documentation](https://nextjs.org/docs)
- [Tailwind CSS 4 Documentation](https://tailwindcss.com)
- [Supabase Documentation](https://supabase.com/docs)
- [Project Charter](./docs/project-charter.md)
- [Technology Stack](./docs/technology-stack.md)

## 🎯 Development Roadmap

Based on your project charter, here's the suggested development order:

1. **Phase 1: Authentication** (Week 1-2)
   - [ ] User registration/login UI
   - [ ] Email verification
   - [ ] Password reset
   - [ ] User profile management

2. **Phase 2: Credit System** (Week 3-4)
   - [ ] Credit balance display
   - [ ] Credit purchase flow
   - [ ] Transaction history
   - [ ] Casso payment integration

3. **Phase 3: Video Generation** (Week 5-8)
   - [ ] Text-to-video interface
   - [ ] Image-to-video interface
   - [ ] Video generation API integration
   - [ ] Progress tracking
   - [ ] Video preview and download

4. **Phase 4: Video Gallery** (Week 9-10)
   - [ ] My videos page
   - [ ] Video management (delete, share)
   - [ ] Video storage optimization

5. **Phase 5: Polish & Launch** (Week 11-12)
   - [ ] Performance optimization
   - [ ] SEO optimization
   - [ ] Analytics integration
   - [ ] User testing and feedback

## ✨ What Makes This Setup Special

1. **Cutting Edge** - Uses the absolute latest stable versions of all technologies
2. **Type Safe** - Full TypeScript coverage
3. **Fast** - Turbopack for dev, optimized production builds
4. **Modern CSS** - Tailwind 4's CSS-first approach
5. **Secure** - Supabase RLS and SSR authentication
6. **Vietnamese First** - Built with Vietnamese market in mind
7. **Scalable** - Ready for production deployment

## 🎊 You're All Set!

Your project is now ready for development. The setup follows all the latest best practices and uses the newest stable versions as specified in your technology stack document.

Start coding with:

```bash
npm run dev
```

Happy coding! 🚀🇻🇳
