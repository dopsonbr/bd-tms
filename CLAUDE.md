# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FreightOS (bd-tms) — a mobile-first (390px / iPhone 14) trucking management prototype for regional carrier and brokerage operations. AI agents handle dispatch, planning, and voice communication. No backend required; runs entirely client-side with demo data. See `requirements.md` and `design.md` for full product specs.

## Commands

| Command | Purpose |
|---------|---------|
| `bun install` | Install dependencies (uses Bun, not npm) |
| `bun run dev` | Dev server on port 4317 (`--strictPort`) |
| `bun run build` | Production build |
| `bun run preview` | Preview server on port 4318 (`--strictPort`) |
| `bun run test` | Run all Vitest tests |
| `npx vitest run src/path/to/file.test.ts` | Run a single test file |
| `bun run lint` | ESLint check |
| `bun run format` | Prettier check |
| `bun run check` | Prettier write + ESLint fix |

## Architecture

**Stack:** TanStack React Start + React 19 + Vite 7 + TypeScript (strict) + Tailwind CSS 4 + Nitro server runtime.

**Routing:** File-based routing via TanStack Router. Routes live in `src/routes/`. The route tree is auto-generated in `src/routeTree.gen.ts` — do not edit it manually. Router config is in `src/router.tsx`.

**UI Components:** shadcn/ui (base-nova style) built on Base UI React (headless primitives) + Tailwind + CVA for variant management. Components are in `src/components/ui/`. Add new shadcn components via `npx shadcn@latest add <component>`.

**Path Aliases:** `@/*` maps to `./src/*` (configured in tsconfig.json, resolved by vite-tsconfig-paths).

## Key Patterns

- **Component structure:** Base UI primitive → wrapped with CVA variants → styled with Tailwind. Components use `data-slot` attributes for semantic markup and CSS targeting.
- **Class composition:** Always use `cn()` from `@/lib/utils` (clsx + tailwind-merge) for merging class names.
- **Props pattern:** Components extend `React.ComponentProps<"element">` and spread `{...props}` to forward HTML attributes.
- **Subcomponent pattern:** Complex components export related parts (e.g., `Card`, `CardHeader`, `CardTitle`, `CardContent`, `CardFooter`).

## Code Style

- No semicolons, single quotes, trailing commas (Prettier config)
- `"use client"` directive at top of client components
- ESLint uses `@tanstack/eslint-config`
- TypeScript strict mode with `noUnusedLocals` and `noUnusedParameters`

## Responsive Design

Mobile-first at 390px. Use Tailwind responsive prefixes (`md:`, `lg:`) and `@md` container queries for tablet/desktop breakpoints. Theme uses OKLch color space with CSS custom properties defined in `src/styles.css`.

## Skill Usage

- Use `browser-agent` skill to validate completed UI work in a browser before considering tasks done.
- Use `vercel-react-best-practices` skill when writing, reviewing, or refactoring React components.
