# Contributing to ASYV PassFlow

Thank you for contributing to **ASYV PassFlow**. Please follow these engineering conventions to keep the codebase clean, maintainable, and production-ready.

---

## Coding Standards

1. **Pure JavaScript & JSX Only**
   - This repository deliberately uses **vanilla JavaScript / JSX** (`.js`, `.jsx`, `.mjs`).
   - Do **not** introduce `.ts` or `.tsx` files, `tsconfig.json`, or TypeScript-only syntax.
   - Use `@/*` path aliases configured in `jsconfig.json` for client/app modules, and relative `.js` imports inside shared server modules that run under Node.js CLI scripts.

2. **Dual-Theme Parity (White Mode & Dark Mode)**
   - Every new UI surface or component must support both **White Mode** (white canvas + `#f97316` / `#ea580c` orange accents) and **Dark Mode** (`#060908` obsidian canvas + `#3ed598` mint-emerald accents via `dark:` utilities).
   - Verify transitions in both themes before opening a pull request.

3. **Database & Server Actions**
   - Keep all PostgreSQL queries inside `src/actions/` or `src/db/`.
   - Never hardcode database credentials or commit `.env` files. Update `.env.example` if new environment variables are introduced.
   - Update `schema.sql` alongside any change to `src/db/schema.js`.

---

## Pre-Submission Checklist

Before committing or pushing your branch, ensure all checks pass cleanly:

```bash
# 1. Verify ESLint passes with zero errors
npm run lint

# 2. Verify production Next.js build succeeds
npm run build

# 3. Run the live PostgreSQL end-to-end regression suite
npm test
```

## Commit Message Convention

Use concise, descriptive commit messages:
- `feat: ...` for new features or UI capabilities
- `fix: ...` for bug fixes or layout corrections
- `docs: ...` for README, architecture, or schema documentation updates
- `refactor: ...` for internal code cleanup without behavior changes
