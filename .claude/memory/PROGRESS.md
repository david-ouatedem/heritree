# Heritree — Progress Tracker

## Key Decisions
- **Stack**: Full-stack Next.js 15 (App Router) + PostgreSQL + Prisma + NextAuth v5 + Tailwind v4 + shadcn/ui
- **No separate backend**: Server actions + API routes instead of NestJS (ship faster)
- **Auth**: NextAuth v5 with Credentials (email/password) + Google OAuth
- **Relationships**: Adjacency list pattern in PostgreSQL (Person ↔ Relationship ↔ Person)
- **Tree viz**: React Flow (to be added when building tree feature)
- **Package manager**: pnpm
- **No co-authored-by on commits** (per CLAUDE.md)

## Completed Tasks

### 2026-03-09 — Project Setup
- [x] Created `CLAUDE.md` with project conventions, commands, git rules
- [x] Created `.claude/memory/PROGRESS.md` (this file)
