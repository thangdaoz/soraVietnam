# 📋 ESLint & Prettier - Quick Reference

## 🔧 Commands

```bash
npm run lint          # Check linting errors
npm run lint:fix      # Fix linting errors
npm run format        # Format all files
npm run format:check  # Check formatting (CI)
npm run type-check    # TypeScript check
npm run check         # Run ALL checks
```

## ⚡ VS Code Shortcuts

- **Save File:** `Ctrl+S` (auto-formats)
- **Format Document:** `Shift+Alt+F`
- **Fix ESLint Issues:** Save file or `Ctrl+Shift+P` → "ESLint: Fix all"

## ✅ What's Configured

- ✅ Prettier: Code formatting
- ✅ ESLint: Code quality rules
- ✅ Import auto-sorting
- ✅ Tailwind class sorting
- ✅ Format on save
- ✅ TypeScript support

## 🎨 Code Style

- Single quotes (`'`)
- Semicolons (`;`)
- 2 spaces indentation
- 100 char line width
- Trailing commas in objects/arrays

## 📦 Required Extension

**Install:** `esbenp.prettier-vscode` in VS Code

## 🚨 Common Warnings

```typescript
// ❌ Unused variable
const user = getUser();

// ✅ Prefix with underscore
const _user = getUser();

// ❌ Console.log
console.log('debug');

// ✅ Use warn/error
console.error('Error!');
```

## 📁 Key Files

- `.prettierrc` - Format rules
- `eslint.config.mjs` - Lint rules
- `.vscode/settings.json` - Editor config

## 📚 Full Docs

See: `docs/eslint-prettier-guide.md`

---

**Auto-format enabled!** Just save files (Ctrl+S) ✨
