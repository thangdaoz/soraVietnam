# Tailwind CSS Usage Guide - Sora Vietnam Gateway

**Last Updated:** October 7, 2025

This guide shows how to use the Tailwind CSS configuration based on our UI Design Kit.

## Overview

Our Tailwind configuration implements the complete design system with:

- ✅ Custom color palette (Indigo, Emerald, Slate, Red, Amber)
- ✅ Typography system (Poppins for headings, Inter for body)
- ✅ Pre-built component classes
- ✅ Lucide React icons library

## Color Classes

### Primary (Indigo - Main Brand Color)

Use for primary buttons, active links, and focused states.

```tsx
// Background
<div className="bg-primary-600">Primary Action</div>
<button className="bg-primary-600 hover:bg-primary-700">Click Me</button>

// Text
<p className="text-primary-600">Important text</p>

// Border
<div className="border border-primary-600">Outlined</div>
```

**Available shades:** `primary-50` through `primary-950` (main is `primary-600`)

### Secondary (Emerald - Accent Color)

Use for success states, confirmations, and secondary CTAs.

```tsx
<button className="bg-secondary-500 text-white">Confirm</button>
<span className="text-secondary-500">✓ Success</span>
```

**Available shades:** `secondary-50` through `secondary-950` (main is `secondary-500`)

### Neutral (Slate)

Use for text, backgrounds, and borders.

```tsx
// Text hierarchy
<h1 className="text-neutral-900">Dark heading</h1>
<p className="text-neutral-600">Medium body text</p>
<span className="text-neutral-500">Light helper text</span>

// Backgrounds
<div className="bg-neutral-50">Subtle background</div>
<div className="bg-white">White container</div>

// Borders
<input className="border border-neutral-200" />
```

**Key shades:**

- `neutral-900`: Dark text for headings
- `neutral-600`: Medium text for body
- `neutral-500`: Light text for helpers
- `neutral-200`: Borders
- `neutral-50`: Subtle backgrounds

### Feedback Colors

```tsx
// Error (Red)
<p className="text-error">Error message</p>
<input className="border-error" />

// Warning (Amber)
<div className="bg-warning text-white">Warning!</div>

// Success (Emerald)
<span className="text-success">Success!</span>
```

## Typography

### Font Families

```tsx
// Headings (Poppins)
<h1 className="font-heading">Main Heading</h1>

// Body text (Inter) - default
<p className="font-sans">Body text</p>
```

### Heading Styles

Use semantic HTML with automatic styling from our base layer:

```tsx
<h1>This is automatically 36px, Poppins, Semi-Bold</h1>
<h2>This is automatically 24px, Poppins, Semi-Bold</h2>
<h3>This is automatically 20px, Poppins, Medium</h3>
```

Or use Tailwind classes for custom sizes:

```tsx
<p className="text-[2.25rem] font-heading font-semibold">Custom H1 style</p>
<p className="text-[1.5rem] font-heading font-semibold">Custom H2 style</p>
<p className="text-[1.25rem] font-heading font-medium">Custom H3 style</p>
```

### Text Sizes

```tsx
<p className="text-body">16px body text (default)</p>
<small className="text-small">14px small text</small>
```

## Pre-built Components

### Buttons

#### Primary Button

```tsx
<button className="btn-primary">
  Primary Action
</button>

<button className="btn-primary" disabled>
  Disabled
</button>
```

#### Secondary Button

```tsx
<button className="btn-secondary">Secondary Action</button>
```

#### Custom Button with Tailwind

```tsx
// Primary
<button className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-[0.375rem] font-medium transition-colors">
  Custom Primary
</button>

// Secondary
<button className="bg-white text-primary-600 border border-primary-600 hover:bg-primary-50 px-5 py-2.5 rounded-[0.375rem] font-medium transition-colors">
  Custom Secondary
</button>

// Text/Tertiary
<button className="text-primary-600 hover:underline font-medium">
  Text Button
</button>
```

### Input Fields

#### Using Pre-built Class

```tsx
<input
  type="text"
  className="input-field"
  placeholder="Enter text..."
/>

<input
  type="text"
  className="input-field error"
  placeholder="This has an error"
/>
```

#### Custom with Tailwind

```tsx
<input
  type="text"
  className="focus:border-primary-600 w-full rounded-[0.375rem] border border-neutral-200 bg-white px-3.5 py-2.5 transition-colors outline-none placeholder:text-neutral-500"
  placeholder="Custom input"
/>
```

### Cards & Containers

#### Using Pre-built Classes

```tsx
// Card with shadow
<div className="card">
  <h3>Card Title</h3>
  <p>Card content</p>
</div>

// Card with border
<div className="card-bordered">
  <h3>Bordered Card</h3>
  <p>Card content</p>
</div>
```

#### Custom with Tailwind

```tsx
<div className="rounded-[0.5rem] bg-white p-6 shadow-sm">
  <h3 className="font-heading mb-2 font-semibold text-neutral-900">Custom Card</h3>
  <p className="text-neutral-600">This is a custom card using Tailwind utilities.</p>
</div>
```

## Icons (Lucide React)

Import and use Lucide icons throughout your app:

```tsx
import { AlertCircle, Check, Image, Settings, User, Video } from 'lucide-react';

export default function MyComponent() {
  return (
    <div>
      {/* Icon in button */}
      <button className="btn-primary flex items-center gap-2">
        <Video className="h-5 w-5" />
        Create Video
      </button>

      {/* Icon with text */}
      <p className="text-success flex items-center gap-2">
        <Check className="h-4 w-4" />
        Upload successful
      </p>

      {/* Error icon */}
      <p className="text-error flex items-center gap-2">
        <AlertCircle className="h-4 w-4" />
        Error message
      </p>

      {/* Colored icon */}
      <Settings className="text-primary-600 h-6 w-6" />
    </div>
  );
}
```

### Common Icon Sizes

- `w-4 h-4` (16px) - Small icons for inline text
- `w-5 h-5` (20px) - Standard icons in buttons
- `w-6 h-6` (24px) - Larger standalone icons

## Common Patterns

### Form Field with Label and Error

```tsx
<div className="space-y-2">
  <label className="block font-medium text-neutral-900">Email Address</label>
  <input type="email" className="input-field w-full" placeholder="name@example.com" />
  <p className="text-small text-error">Please enter a valid email</p>
</div>
```

### Feature Card

```tsx
<div className="card">
  <div className="mb-4 flex items-center gap-3">
    <Video className="text-primary-600 h-8 w-8" />
    <h3 className="font-heading font-semibold text-neutral-900">Text to Video</h3>
  </div>
  <p className="text-neutral-600">Transform your text descriptions into stunning videos.</p>
</div>
```

### Hero Section

```tsx
<section className="bg-white">
  <div className="container mx-auto px-4 py-16">
    <h1 className="mb-4 text-center">Tạo Video AI Chuyên Nghiệp</h1>
    <p className="mx-auto mb-8 max-w-2xl text-center text-[1.125rem] text-neutral-600">
      Chuyển đổi văn bản và hình ảnh thành video chất lượng cao
    </p>
    <div className="flex justify-center gap-4">
      <button className="btn-primary">Bắt Đầu Ngay</button>
      <button className="btn-secondary">Xem Demo</button>
    </div>
  </div>
</section>
```

### Navigation Bar

```tsx
<nav className="border-b border-neutral-200 bg-white">
  <div className="container mx-auto flex items-center justify-between px-4 py-4">
    <div className="font-heading text-primary-600 text-[1.25rem] font-semibold">Sora Vietnam</div>
    <div className="flex items-center gap-6">
      <a href="#" className="hover:text-primary-600 text-neutral-600 transition-colors">
        Features
      </a>
      <a href="#" className="hover:text-primary-600 text-neutral-600 transition-colors">
        Pricing
      </a>
      <button className="btn-primary">Sign In</button>
    </div>
  </div>
</nav>
```

## CSS Variables

You can also use CSS variables directly:

```tsx
<div style={{ backgroundColor: 'var(--color-primary-600)' }}>Using CSS variable</div>
```

## Responsive Design

Use Tailwind's responsive prefixes with our design tokens:

```tsx
<div className="text-body bg-neutral-50 p-4 md:p-6 md:text-[1.125rem] lg:bg-white lg:p-8">
  Responsive content
</div>
```

## Best Practices

1. **Use semantic color names:** Use `primary`, `secondary`, `neutral` instead of specific color names
2. **Prefer pre-built components:** Use `.btn-primary`, `.card`, etc. for consistency
3. **Keep components DRY:** Extract repeated patterns into reusable components
4. **Use CSS variables for dynamic values:** Great for themes and user preferences
5. **Icons should enhance, not replace text:** Always provide text labels for accessibility

## Dark Mode (Future Enhancement)

The design system can be extended for dark mode:

```css
@media (prefers-color-scheme: dark) {
  /* Dark mode overrides */
}
```

## Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Lucide Icons Browser](https://lucide.dev/icons)
- [Next.js Font Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/fonts)
