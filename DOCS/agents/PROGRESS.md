# Project Progress

This file tracks progress against the plan in DOCS/agents/PLAN.md. Completed items are checked and struck through; pending items are unchecked.

## 1) Landing Page

- [x] ~~Create a polished landing page at `/` explaining the project~~
- [x] ~~Add shadcn-style UI primitives (Button, Card, Badge)~~
- [x] ~~Add branding logo and update favicon to viberesume logo~~
- [x] ~~Add subtle animations and soft, neumorphic shadows~~

## 2) Authentication (Clerk)

- [x] ~~Wrap the app with `ClerkProvider` in `app/layout.tsx`~~
- [x] ~~Add `middleware.ts` to protect private routes (e.g., `/dashboard`, `/api/*`) while keeping `/`, `/sign-in`, `/sign-up` public~~
- [x] Add `app/sign-in/[[...sign-in]]/page.tsx` and `app/sign-up/[[...sign-up]]/page.tsx` using Clerk components
- [x] Redirect signed-in users away from `/sign-in` and `/sign-up` to `/dashboard` (middleware `afterAuth` or server redirect in pages)
- [x] Create a stubbed `app/dashboard/page.tsx` that requires auth and shows a placeholder

## 3) Database (Neon)

- [x] Implement `@db/CloudDatabase.ts` abstraction (`addUser`, `addWebsite`, `getWebsiteBySlug`, etc.)
- [x] Provision tables `users` and `websites` per the provided schema

## 4) AI Integration

- [ ] Define the system prompt and resume → HTML + TailwindCSS generation flow
- [ ] Implement `POST /api/websites` to call AI and insert `websites` record with a random slug

## 5) Dashboard

- [ ] Build `/dashboard` to list user sites with links to `/sites/[slug]`
- [ ] Add actions: Rename slug (PATCH), Delete site (DELETE), Download code, “Ask AI to change”

## 6) Public Website Rendering

- [ ] Add `app/sites/[slug]/page.tsx` to fetch `websites.code` and render it safely

## 7) Misc

- [ ] Keep this PROGRESS.md updated as features land

---

Summary of work completed this session:

- Landing page implemented with Tailwind and shadcn-style components (Button, Card, Badge).
- Added inline SVG logo and updated favicon.
- Added animations and soft, neumorphic shadow styling.
- Integrated Clerk provider and added middleware to protect private routes.
