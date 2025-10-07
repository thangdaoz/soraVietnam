# ESLint and Prettier Configuration Guide

**Last Updated:** October 7, 2025

## ✅ What's Configured

### ESLint

- ✅ Next.js recommended rules
- ✅ TypeScript support
- ✅ React best practices
- ✅ Custom rules for unused variables, console warnings
- ✅ Integrated with Prettier (no conflicts)

### Prettier

- ✅ Code formatting with consistent style
- ✅ Auto-import sorting
- ✅ Tailwind CSS class sorting
- ✅ Single quotes, semicolons, 100 char width

## 📦 Installed Packages

```json
{
  "devDependencies": {
    "prettier": "Formats code consistently",
    "eslint-config-prettier": "Disables ESLint rules that conflict with Prettier",
    "eslint-plugin-prettier": "Runs Prettier as an ESLint rule",
    "@trivago/prettier-plugin-sort-imports": "Auto-sorts imports",
    "prettier-plugin-tailwindcss": "Sorts Tailwind classes"
  }
}
```

## 🚀 Quick Start

### 1. Install VS Code Extension (Required)

You need to install the **Prettier** extension for VS Code:

1. Open VS Code Extensions (Ctrl+Shift+X)
2. Search for "Prettier - Code formatter"
3. Click Install on `esbenp.prettier-vscode`

Or click on the notification to install recommended extensions.

### 2. Available Commands

```bash
# Check for linting errors
npm run lint

# Fix linting errors automatically
npm run lint:fix

# Format all files with Prettier
npm run format

# Check if files are formatted (CI/CD)
npm run format:check

# Run type checking
npm run type-check

# Run all checks (type, lint, format)
npm run check
```

### 3. Auto-Format on Save

Once Prettier extension is installed, files will automatically format when you save (Ctrl+S).

## 📁 Configuration Files

### `.prettierrc` - Prettier Configuration

```json
{
  "semi": true,              // Use semicolons
  "trailingComma": "es5",    // Trailing commas where valid in ES5
  "singleQuote": true,       // Use single quotes
  "printWidth": 100,         // Line width
  "tabWidth": 2,             // 2 spaces for indentation
  "importOrder": [...],      // Import sorting order
  "plugins": [
    "@trivago/prettier-plugin-sort-imports",  // Sorts imports
    "prettier-plugin-tailwindcss"             // Sorts Tailwind classes
  ]
}
```

### `eslint.config.mjs` - ESLint Configuration

```javascript
{
  rules: {
    // TypeScript
    "@typescript-eslint/no-unused-vars": "warn",
    "@typescript-eslint/no-explicit-any": "warn",

    // React
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",

    // General
    "no-console": ["warn", { allow: ["warn", "error"] }],
  }
}
```

### `.vscode/settings.json` - VS Code Settings

- Format on save enabled
- Prettier as default formatter
- ESLint auto-fix on save
- Tailwind CSS IntelliSense configured

## 🎯 Features

### 1. Import Sorting

Imports are automatically sorted in this order:

1. React imports
2. Next.js imports
3. Third-party packages
4. `@/components/*`
5. `@/lib/*`
6. `@/*`
7. Relative imports (`./`, `../`)

**Before:**

```typescript
import { useState } from 'react';

import Link from 'next/link';

import { Video } from 'lucide-react';

import { Button } from '@/components/Button';

import './styles.css';
```

**After:**

```typescript
import { useState } from 'react';

import Link from 'next/link';

import { Video } from 'lucide-react';

import { Button } from '@/components/Button';

import './styles.css';
```

### 2. Tailwind Class Sorting

Tailwind classes are automatically sorted according to the official recommended order.

**Before:**

```tsx
<div className="text-white p-4 bg-primary-600 rounded-lg flex items-center">
```

**After:**

```tsx
<div className="flex items-center rounded-lg bg-primary-600 p-4 text-white">
```

### 3. Code Style Consistency

Prettier enforces consistent:

- Single quotes for strings
- Semicolons at statement ends
- 2-space indentation
- 100 character line width
- Trailing commas in ES5-compatible locations

## 🔧 Manual Formatting

### Format Specific File

```bash
npx prettier --write src/app/page.tsx
```

### Format All TypeScript/TSX Files

```bash
npx prettier --write "src/**/*.{ts,tsx}"
```

### Check Without Modifying

```bash
npx prettier --check "src/**/*.{ts,tsx}"
```

## 🚨 Common ESLint Warnings

### Unused Variables

```typescript
// ❌ Warning
const user = getUser();

// ✅ OK - Prefix with underscore
const _user = getUser();
```

### Console Logs

```typescript
// ⚠️  Warning
console.log('debug info');

// ✅ OK - Use warn or error
console.error('Error occurred');
console.warn('Warning message');
```

### React Hooks

```typescript
// ❌ Error - Hooks must be at top level
if (condition) {
  const [state, setState] = useState();
}

// ✅ OK
const [state, setState] = useState();
if (condition) {
  // use state
}
```

## 🎨 Integration with Git

### Pre-commit Hook (Optional)

Install Husky for automatic formatting before commit:

```bash
npm install -D husky lint-staged
npx husky init
```

Add to `package.json`:

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,css,md}": ["prettier --write"]
  }
}
```

## 📝 Best Practices

1. **Let Prettier handle formatting** - Don't fight with it manually
2. **Use ESLint for code quality** - Logic errors, best practices
3. **Format before committing** - Run `npm run format`
4. **Fix linting errors** - Run `npm run lint:fix`
5. **Check types regularly** - Run `npm run type-check`

## 🐛 Troubleshooting

### Prettier Not Working?

1. Check if Prettier extension is installed
2. Check if `.prettierrc` exists
3. Reload VS Code window
4. Check file is not in `.prettierignore`

### ESLint Not Working?

1. Check ESLint extension is enabled
2. Run `npm run lint` in terminal to see errors
3. Check `eslint.config.mjs` syntax
4. Restart ESLint server (Command Palette: "ESLint: Restart ESLint Server")

### Conflicts Between ESLint and Prettier?

- Both tools are configured to work together
- `eslint-config-prettier` disables conflicting rules
- If you see conflicts, check that `prettier` is in the ESLint extends array

## 🔄 Updating Configuration

### Adjust Prettier Style

Edit `.prettierrc`:

```json
{
  "singleQuote": false, // Use double quotes
  "printWidth": 120, // Increase line width
  "semi": false // Remove semicolons
}
```

### Add ESLint Rules

Edit `eslint.config.mjs`:

```javascript
{
  rules: {
    "no-console": "off",  // Allow console.log
    "prefer-const": "error",  // Enforce const
  }
}
```

## 📚 Resources

- [Prettier Documentation](https://prettier.io/docs/en/)
- [ESLint Documentation](https://eslint.org/docs/latest/)
- [Next.js ESLint Config](https://nextjs.org/docs/app/building-your-application/configuring/eslint)
- [Tailwind CSS Class Sorting](https://tailwindcss.com/blog/automatic-class-sorting-with-prettier)

---

**Ready to code with consistent style!** ✨
