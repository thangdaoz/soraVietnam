# 🎨 Tailwind CSS Design System - Quick Reference

## View the Design System

Run the development server and visit the showcase page:

```bash
npm run dev
```

Then open: **http://localhost:3000/design-system**

## Quick Usage

### Colors

```tsx
// Primary (Indigo)
<button className="bg-primary-600 text-white">Click Me</button>

// Secondary (Emerald)
<span className="text-secondary-500">Success</span>

// Neutral (Slate)
<p className="text-neutral-600">Body text</p>

// Feedback
<span className="text-error">Error message</span>
<span className="text-warning">Warning</span>
<span className="text-success">Success</span>
```

### Buttons

```tsx
<button className="btn-primary">Primary</button>
<button className="btn-secondary">Secondary</button>
<button className="text-primary-600 hover:underline">Text Button</button>
```

### Form Inputs

```tsx
<input className="input-field" placeholder="Enter text..." />
<input className="input-field error" placeholder="Has error" />
```

### Cards

```tsx
<div className="card">Content with shadow</div>
<div className="card-bordered">Content with border</div>
```

### Icons

```tsx
import { Video, Check, AlertCircle } from 'lucide-react';

<Video className="w-5 h-5 text-primary-600" />
<Check className="w-4 h-4 text-success" />
```

### Typography

```tsx
<h1>Auto-styled with Poppins Semi-Bold</h1>
<h2>Poppins Semi-Bold 24px</h2>
<h3>Poppins Medium 20px</h3>
<p>Body text in Inter Regular 16px</p>
<p className="text-small">Small text 14px</p>
```

## Files Modified

- ✅ `src/app/globals.css` - Complete theme configuration
- ✅ `src/app/layout.tsx` - Font loading (Inter + Poppins)
- ✅ `package.json` - Added lucide-react

## Documentation

- **Complete Guide:** `docs/tailwind-usage-guide.md`
- **Configuration Summary:** `docs/tailwind-configuration-summary.md`
- **Original Design Kit:** `docs/ui-design-kit.md`
- **Example Components:** `src/components/examples/ButtonExamples.tsx`

## Color Reference

| Color           | Usage             | Class                         |
| --------------- | ----------------- | ----------------------------- |
| Indigo #4F46E5  | Primary brand     | `primary-600`                 |
| Emerald #10B981 | Secondary/Success | `secondary-500`               |
| Red #EF4444     | Error             | `error`                       |
| Amber #F59E0B   | Warning           | `warning`                     |
| Slate           | Text/Backgrounds  | `neutral-50` to `neutral-950` |

## Font Reference

| Element | Font    | Size | Weight |
| ------- | ------- | ---- | ------ |
| H1      | Poppins | 36px | 600    |
| H2      | Poppins | 24px | 600    |
| H3      | Poppins | 20px | 500    |
| Body    | Inter   | 16px | 400    |
| Small   | Inter   | 14px | 400    |

---

**Ready to build!** 🚀
