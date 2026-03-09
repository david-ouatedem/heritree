# 🌳 Genealogy Tree Web App — Product Plan

---

## Core Concept

A web app that lets users build, visualize, and explore their family history through an interactive tree interface, with tools to enrich profiles and collaborate with relatives.

---

## Feature Areas & User Stories

---

### 1. Authentication & Onboarding

- As a new user, I can sign up with email or a social account so I can start my family tree quickly.
- As a returning user, I can log in and resume exactly where I left off.
- As a user, I'm guided through a short onboarding flow that helps me add my first few family members.

---

### 2. Tree Builder (Core)

- As a user, I can add myself as the root person and build outward by adding parents, siblings, children, and spouses.
- As a user, I can add a person with a minimal form (name + birth year) so I'm not blocked by missing data.
- As a user, I can define relationship types: biological, adopted, step, foster.
- As a user, I can merge two duplicate person entries into one.
- As a user, I can delete a person and choose whether to remove or reassign their relationships.

---

### 3. Person Profiles

- As a user, I can view a rich profile card for each person including: full name, dates (birth, death, marriage), places, nationality, occupation, and biography notes.
- As a user, I can upload a photo for any person.
- As a user, I can attach multiple photos, documents (e.g. birth certificates), and notes to a profile.
- As a user, I can mark a person as living/deceased to control privacy of displayed information.

---

### 4. Interactive Tree Visualization

- As a user, I can see my family tree rendered as an interactive visual graph I can pan and zoom.
- As a user, I can switch between views: ancestors view (going upward), descendants view (going downward), and full tree view.
- As a user, I can click any node to open that person's profile in a side panel without leaving the tree.
- As a user, I can highlight a bloodline or branch to trace a specific lineage visually.
- As a user, I can search for a person by name and have the tree navigate/zoom to them.

---

### 5. Timeline & Stories

- As a user, I can view a chronological timeline of key life events across all family members.
- As a user, I can write and attach a "story" (free-form narrative) to a person or to a family unit.
- As a user, I can tag events with historical context (e.g. "during WWII") for richer storytelling.

---

### 6. Collaboration

- As a user, I can invite family members via email to view or co-edit the tree.
- As a collaborator, I can suggest edits (changes, additions) that the tree owner can review and approve.
- As a user, I can see a change history/audit log showing who added or modified what.
- As a user, I can leave comments on a person's profile to discuss or flag information.

---

### 7. Import / Export

- As a user, I can import a GEDCOM file (the genealogy standard format) to bootstrap my tree from existing data.
- As a user, I can export my tree as a GEDCOM file for use in other genealogy tools.
- As a user, I can export a visual snapshot of my tree as a PDF or image to print or share.

---

### 8. Privacy & Settings

- As a user, I can set my tree to private (only me), shared (invite-only), or public.
- As a user, living persons' details are automatically hidden or blurred for public viewers.
- As a user, I can manage which collaborators have view vs. edit access.

---

### 9. DNA & Research Hints *(Future / V2)*

- As a user, I can link a DNA test result (e.g. from AncestryDNA) to discover potential relatives.
- As a user, I receive smart hints suggesting possible connections based on shared surnames, dates, and locations.
- As a user, I can link external historical records (census, immigration) to a person's profile.

---

## Suggested Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Next.js |
| Tree Visualization | D3.js or React Flow |
| Backend | NestJS (REST or GraphQL) |
| Database | PostgreSQL (adjacency list for relationships) |
| File Storage | S3-compatible storage (photos, documents) |

---

## Next Steps

- [ ] Finalize feature scope for V1 (MVP)
- [ ] Design data model for persons and relationships
- [ ] Break user stories into sprint-ready tasks
- [ ] Set up monorepo with Next.js frontend and NestJS backend
- [ ] Prototype tree visualization with sample data