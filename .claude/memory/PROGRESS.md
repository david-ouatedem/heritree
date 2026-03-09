# Heritree — Progress Tracker

## Key Decisions
- **Stack**: Full-stack Next.js 16 (App Router) + PostgreSQL + Prisma 7 + NextAuth v5 + Tailwind v4 + shadcn/ui
- **No separate backend**: Server actions + API routes instead of NestJS (ship faster)
- **Auth**: NextAuth v5 with Credentials (email/password) + Google OAuth placeholder
- **Relationships**: Adjacency list pattern in PostgreSQL (Person ↔ Relationship ↔ Person)
- **Tree viz**: React Flow (to be added when building tree feature)
- **Package manager**: pnpm
- **No co-authored-by on commits** (per CLAUDE.md)

## Technical Notes (gotchas)
- **Prisma 7** requires `prisma.config.ts` at root for datasource URL (no more `url` in schema.prisma)
- **Prisma 7** generator uses `"prisma-client"` (not `"prisma-client-js"`) and requires an `output` field
- **Prisma 7** client needs `@prisma/adapter-pg` adapter passed to constructor
- **Prisma 7** generated client entry point is `client.ts`, import as `@/generated/prisma/client`
- **Prisma 7** no longer auto-runs `generate` after `db push` — run `prisma generate` explicitly
- **Middleware (Edge Runtime)**: Cannot import Prisma in middleware — uses cookie-based auth check instead
- **Next.js 16**: `middleware.ts` is deprecated in favor of "proxy" — still works but shows warning
- **`useSearchParams`** must be wrapped in `<Suspense>` boundary for static generation
- **`pnpm.onlyBuiltDependencies`** in package.json: allowlists `@prisma/client`, `prisma`, `@prisma/engines`

## Completed Tasks

### 2026-03-09 — Project Scaffolding (v0 Foundation)
- [x] Created `CLAUDE.md` with project conventions, commands, git rules
- [x] Created `.claude/memory/PROGRESS.md` (this file)
- [x] Scaffolded Next.js 16 project (App Router, TypeScript, Tailwind v4, ESLint, src directory)
- [x] Installed core deps: Prisma 7, @prisma/adapter-pg, NextAuth v5 (beta.30), bcryptjs, zod, lucide-react
- [x] Created `prisma.config.ts` for Prisma 7 datasource configuration
- [x] Created Prisma schema with models: User, Account, Session, VerificationToken, Tree, Person, Relationship
- [x] Defined enums: TreePrivacy, Gender, RelationshipType, RelationshipNature
- [x] Generated Prisma client to `src/generated/prisma/`
- [x] Created Prisma singleton (`src/lib/prisma.ts`) with PrismaPg adapter
- [x] Configured NextAuth v5 (`src/lib/auth.ts`) — JWT strategy, Credentials + Google providers
- [x] Created auth API routes: `[...nextauth]/route.ts` and `signup/route.ts`
- [x] Created Zod validators for login/signup (`src/lib/validators/auth.ts`)
- [x] Created middleware for route protection (cookie-based, Edge-compatible)
- [x] Created app route groups: `(auth)` for login/signup, `(app)` for authenticated pages
- [x] Built login page with form, error handling, callback URL support
- [x] Built signup page with form, validation, auto-login after registration
- [x] Built dashboard placeholder page with empty state
- [x] Created landing page with Heritree branding
- [x] Initialized shadcn/ui with button, input, card, dialog, label components
- [x] Created `.env.example` template
- [x] Created seed script with test user + sample 3-generation family tree (5 persons, 6 relationships)
- [x] Fixed `.gitignore` (allow `.env.example`, ignore `src/generated/`)
- [x] Verified `pnpm build` succeeds — all routes compile
- [x] Initial git commit

## Project Structure
```
heritree/
├── prisma/
│   ├── schema.prisma          # Data model
│   └── seed.ts                # DB seeder
├── prisma.config.ts           # Prisma 7 config (datasource URL)
├── src/
│   ├── app/
│   │   ├── (auth)/            # Public auth pages
│   │   │   ├── login/page.tsx
│   │   │   └── signup/page.tsx
│   │   ├── (app)/             # Authenticated app pages
│   │   │   └── dashboard/page.tsx
│   │   ├── api/auth/          # Auth API routes
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Landing page
│   ├── components/
│   │   ├── ui/                # shadcn/ui components
│   │   └── tree/              # (future) tree visualization components
│   ├── generated/prisma/      # Prisma generated client (gitignored)
│   ├── hooks/                 # Custom React hooks
│   ├── lib/
│   │   ├── auth.ts            # NextAuth config
│   │   ├── prisma.ts          # Prisma singleton
│   │   ├── utils.ts           # shadcn/ui cn() helper
│   │   └── validators/        # Zod schemas
│   ├── middleware.ts          # Route protection
│   └── types/                 # Shared TypeScript types
├── CLAUDE.md
├── HERITREE_PROJECT.md        # Product spec
└── .env.example
```

## Next Up (not started)
- [ ] Set up PostgreSQL (Docker Compose) and run `prisma db push`
- [ ] Test auth flow end-to-end (signup → login → dashboard)
- [ ] Build tree CRUD (create tree, add persons, define relationships)
- [ ] Tree visualization with React Flow
- [ ] Person profile detail page
- [ ] Onboarding flow after first signup
