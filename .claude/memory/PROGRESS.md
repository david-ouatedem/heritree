# Heritree — Progress Tracker

## Key Decisions
- **Stack**: Full-stack Next.js 16 (App Router) + PostgreSQL + Prisma 7 + NextAuth v5 + Tailwind v4 + shadcn/ui
- **No separate backend**: Server actions + API routes instead of NestJS (ship faster)
- **Auth**: NextAuth v5 with Credentials (email/password) + Google OAuth placeholder
- **Relationships**: Adjacency list pattern in PostgreSQL (Person ↔ Relationship ↔ Person)
- **Tree viz**: React Flow (@xyflow/react) with custom PersonNode and auto-layout
- **Package manager**: pnpm
- **Deployment**: Vercel (with Vercel Postgres / Neon for prod DB)
- **Local DB**: Docker PostgreSQL on port 5434 (5432 was taken)
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
- **Vercel**: needs `postinstall` script to run `prisma generate` so client is available at build time

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
- [x] Created landing page with Heritree branding
- [x] Initialized shadcn/ui with button, input, card, dialog, label components
- [x] Created `.env.example` template
- [x] Created seed script with test user + sample 3-generation family tree
- [x] Fixed `.gitignore`, verified `pnpm build` succeeds

### 2026-03-09 — Database & Auth Verification
- [x] Docker Compose for PostgreSQL (port 5434)
- [x] `prisma db push` — schema synced to local DB
- [x] `prisma db seed` — test user (test@heritree.dev / Password1) + sample tree
- [x] Verified full auth flow: signup → login (CSRF + session cookie) → authenticated dashboard → unauthenticated redirect

### 2026-03-09 — Tree CRUD
- [x] Server actions: `createTree`, `updateTree`, `deleteTree`, `getUserTrees`
- [x] Server actions: `createPerson`, `updatePerson`, `deletePerson`
- [x] Server actions: `addRelationship`, `removeRelationship`, `getTreeWithPersons`
- [x] Zod validators for tree, person, and relationship inputs
- [x] Dashboard with tree listing grid + CreateTreeDialog
- [x] Tree detail page with person management
- [x] AddPersonDialog (name, gender, dates, birthplace, bio)
- [x] AddRelationshipDialog (parent-child, spouse, sibling + nature)
- [x] PersonCard with relationship display and delete confirmation
- [x] Ownership verification on all mutations
- [x] Logout button on dashboard

### 2026-03-09 — Tree Visualization
- [x] React Flow (@xyflow/react) interactive tree view
- [x] Custom PersonNode with gender-colored borders (blue/pink/gray), date display
- [x] Automatic hierarchical layout from relationship data (BFS generation assignment)
- [x] Edge styles: spouse (pink straight), parent-child (smooth), sibling (dashed blue)
- [x] Non-biological relationships shown with animated edges
- [x] MiniMap + Controls for navigation
- [x] Tree/Cards toggle to switch between visual tree and card grid views
- [x] Clickable nodes navigate to person profile

### 2026-03-09 — Person Profile
- [x] Person detail page at `/person/[personId]` with full profile display
- [x] Edit form for all person fields inline
- [x] Relationship sidebar grouped by type (parents, spouses, siblings, children)
- [x] Links between related persons for easy navigation
- [x] Back navigation to tree view

### 2026-03-09 — Onboarding
- [x] 2-step onboarding flow: name tree → add yourself
- [x] API routes: `POST /api/trees`, `POST /api/persons`
- [x] Signup redirects to `/onboarding` instead of `/dashboard`
- [x] Skip option to go straight to tree view
- [x] Progress indicator (step 1/2)

## Project Structure
```
heritree/
├── prisma/
│   ├── schema.prisma              # Data model (7 models, 4 enums)
│   └── seed.ts                    # DB seeder (test user + sample family)
├── prisma.config.ts               # Prisma 7 config (datasource, seed)
├── docker-compose.yml             # Local PostgreSQL on port 5434
├── src/
│   ├── app/
│   │   ├── (auth)/                # Public auth pages
│   │   │   ├── login/page.tsx
│   │   │   └── signup/page.tsx
│   │   ├── (app)/                 # Authenticated app pages
│   │   │   ├── dashboard/page.tsx # Tree listing
│   │   │   ├── tree/[treeId]/     # Tree view + management
│   │   │   ├── person/[personId]/ # Person profile + edit
│   │   │   └── onboarding/        # Post-signup flow
│   │   ├── api/
│   │   │   ├── auth/              # NextAuth + signup
│   │   │   ├── trees/route.ts     # Tree CRUD API
│   │   │   └── persons/route.ts   # Person CRUD API
│   │   ├── layout.tsx
│   │   └── page.tsx               # Landing page
│   ├── components/
│   │   ├── ui/                    # shadcn/ui (button, input, card, dialog, label)
│   │   └── tree/                  # Tree components
│   │       ├── FamilyTreeView.tsx  # React Flow canvas
│   │       ├── PersonNode.tsx      # Custom tree node
│   │       ├── TreeViewToggle.tsx  # Tree/Cards switch
│   │       ├── PersonCard.tsx      # Card view item
│   │       ├── EditPersonForm.tsx  # Inline edit form
│   │       ├── CreateTreeDialog.tsx
│   │       ├── AddPersonDialog.tsx
│   │       └── AddRelationshipDialog.tsx
│   ├── generated/prisma/          # Prisma client (gitignored)
│   ├── lib/
│   │   ├── auth.ts                # NextAuth config
│   │   ├── prisma.ts              # Prisma singleton
│   │   ├── tree-layout.ts         # React Flow layout algorithm
│   │   ├── utils.ts               # cn() helper
│   │   ├── actions/               # Server actions
│   │   │   ├── tree.ts
│   │   │   ├── person.ts
│   │   │   └── get-person.ts
│   │   └── validators/            # Zod schemas
│   │       ├── auth.ts
│   │       └── tree.ts
│   └── middleware.ts              # Route protection
├── CLAUDE.md
├── HERITREE_PROJECT.md
└── .env.example

Routes: / /login /signup /dashboard /onboarding /tree/[treeId] /person/[personId]
API: /api/auth/* /api/trees /api/persons
```

## Next Up
- [ ] Vercel deployment config (postinstall script for prisma generate)
- [ ] Delete tree functionality (UI)
- [ ] Search/filter persons within a tree
- [ ] Tree settings page (rename, privacy, delete)
- [ ] Photo upload for persons (S3-compatible storage)
- [ ] Collaboration (invite via email, view/edit access)
- [ ] Import/Export GEDCOM format
- [ ] Timeline view of family events
