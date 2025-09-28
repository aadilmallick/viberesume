# Project plan

This file describes the high-level roadmap for building the Resume → Portfolio generator hackathon project using **Next.js**, **Clerk**, **Neon (Postgres)**, and **AI**.

---

**project statement**

This is vibe-resume: a nextJS app that lets logged in users upload their resume in PDF format, after which we'll extract the text from the pdf, hand it off to the AI to create a single-page, nicely designed portfolio (which is just an HTML + Tailwind + inline JS string stored in DB) hosted on our server under a randomly-initialized slug, like viberesume.com/jhfadj-3434-sfs, and then users can then change that slug to a unique, more semantic slug like 'natalie-portfolio'.

**working with the tech stack**

1. Use TailwindCSS and have nice design throughout
2. Keep any progress you made in a PROGRESS.md, list objectives there as todos and then strike them out as you go.
3. Use zod for type safety, especially in API routes, keep common types and interfaces
4. Use ShadCN

**user stories**

Here are the user stories:

- **create sites**: users can upload resumes on the dashboard, which gets fed to LLM call which produces valid HTML + Tailwind string, and then that gets stored in DB as a `website` record, storing a random slug and the code string connecting to specific user who generated the site via foreign key.
- **CRUD on sites**: users can see a list of sites they generated on the dashboard, click on those sites to get redirected to their site slug and view a specific site, delete sites, and update their slugs, download the code string of the site, and ask AI to make changes on the site, which prompts the LLM with the current code string and the user's desired changes and implements that, updating the code string.

## 1. Landing Page

- Create a simple **landing page** (`/`) explaining the project and showing a **"Sign in with Google or GitHub"** button (Clerk).
- Public routes:
  - `/` (landing)
  - `/sign-in`
  - `/sign-up`
- Private routes will require Clerk authentication middleware.

---

## 2. Authentication (Clerk)

I want you to completely set up clerk for me as per nextjs setup for clerk guidelines.

- Add Clerk middleware in `middleware.ts` to protect:
  - `/dashboard`
  - `/create`
  - `/api/websites/*`

## 3. Database Setup (Neon)

I already set up the database, but it looks like this:

- Use **raw SQL via `@neondatabase/serverless`**.
- Tables:

```sql
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  clerk_id VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS websites (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  slug VARCHAR(255) UNIQUE NOT NULL,
  code TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

- Use the `CloudDatabase` abstraction in @db/CloudDatabase.ts for easy queries (`addUser`, `addWebsite`, `getWebsiteBySlug`, etc.).

---

## 4. Dashboard

- Route: `/dashboard`
- Features:

  - List all sites owned by the logged-in user.
  - Show link to each site (`/slug`).
  - user can log out
  - Buttons:

    - **Rename slug** (PATCH `/api/websites/[slug]`).
    - **Delete site** (DELETE `/api/websites/[id]`).

- Use Clerk session to look up `user_id`.

---

## 5. AI Integration

- System prompt to AI will explain the DB schema so it understands what to generate/store:

**Prompt context:**

```
You are an assistant that generates HTML code for personal websites based on resumes.
You must only return pure HTML + TailwindCSS + inline JS (if needed).
The HTML string will be stored in the "websites.code" column of a Postgres table with schema:
  - id (SERIAL)
  - user_id (INT)
  - slug (TEXT)
  - code (TEXT)
```

- Flow:

  1. User uploads resume (PDF/DOCX or plain text).
  2. Extract text from resume.
  3. Send text + system prompt to AI.
  4. Receive HTML string.
  5. Insert into `websites` table with random slug.

---

## 6. Create Flow

- Route: `/create`
- Features:

  - File upload (PDF/DOCX) or text input.
  - Button: **"Generate My Portfolio"**.
  - Call `POST /api/websites` → AI → DB insert.
  - Redirect user to `/dashboard`.

---

## 7. Public Website Rendering

- Dynamic route: `/sites/[slug]`
- Behavior:

  - Look up `websites.code` by slug.
  - Sanitize HTML before serving (optional).
  - Render using `dangerouslySetInnerHTML`.

---

## 8. API Routes (Next.js Handlers)

- `POST /api/websites` → Create site (AI + DB insert).
- `PATCH /api/websites/[slug]` → Update slug.
- `DELETE /api/websites/[id]` → Delete site.
- (All require auth, except fetching public slug content.)

---

---
