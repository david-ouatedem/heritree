# Heritree — Claude Code Instructions

## Project Overview
Genealogy tree web app — build, visualize, and explore family history through an interactive tree interface.

## Stack
- **Framework**: Next.js 15 (App Router, full-stack)
- **Auth**: NextAuth.js v5 (Auth.js)
- **Database**: PostgreSQL + Prisma ORM
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Language**: TypeScript
- **Package manager**: pnpm

## Key Commands
```bash
pnpm dev              # start dev server
pnpm build            # production build
pnpm lint             # run ESLint
pnpm prisma validate  # validate Prisma schema
pnpm prisma generate  # generate Prisma client
pnpm prisma db push   # push schema to database
pnpm prisma db seed   # seed the database
```

## Conventions
- Use App Router (not Pages Router)
- Server Components by default; add "use client" only when needed
- Use server actions for mutations, API routes only when necessary
- Prisma singleton in `src/lib/prisma.ts`
- Validation with Zod schemas in `src/lib/validators/`
- All env vars documented in `.env.example`

## Git Rules
- **NEVER add co-authored-by lines to commits**
- Commit messages: imperative mood, concise (e.g., "add person model", "fix tree rendering")
- Do not push unless explicitly asked

## Progress Tracking
- All completed tasks and key decisions are documented in `.claude/memory/PROGRESS.md`
- Always read this file at the start of a session to restore context
- Update it after completing each significant task
