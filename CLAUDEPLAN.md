# VibeResume - Complete Implementation Plan

## Project Overview

VibeResume is a NextJS app that lets logged-in users upload their resume in PDF format, extract text, use AI to create a single-page portfolio (HTML + Tailwind + inline JS), and host it on a unique slug.

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, TailwindCSS, ShadCN
- **Authentication**: Clerk
- **Database**: Neon (Postgres) with raw SQL
- **AI**: OpenAI/Claude for portfolio generation
- **File Processing**: PDF text extraction library

## Implementation Phases

### Phase 1: Dashboard Infrastructure ✅ (Current Task)

- [x] Create dashboard layout with sidebar
- [x] Add Clerk UserButton, settings dialog, sign out functionality
- [x] Implement PDF upload component with text extraction
- [x] Install PDF processing library (pdf-parse or similar)

### Phase 2: Database Integration

- [x] Continue database abstraction layer (@db/CloudDatabase.ts)
- [x] Implement user management (auto-create user on first login, fallback to auto-creating user if not exists in DB when try to upload PDF)
- [ ] Create website CRUD operations
- [ ] Add proper TypeScript types with Zod schemas

### Phase 3: AI Portfolio Generation

- [ ] Create AI service for portfolio generation
- [ ] Design system prompt for HTML + Tailwind generation
- [ ] Implement POST /api/websites endpoint
- [ ] Add slug generation utility (random + custom)

### Phase 4: Website Management

- [ ] Build websites list view in dashboard
- [ ] Add website preview cards with actions
- [ ] Implement slug renaming functionality
- [ ] Add website deletion with confirmation
- [ ] Add code download feature

### Phase 5: Public Website Rendering

- [ ] Create /sites/[slug] dynamic route
- [ ] Implement safe HTML rendering
- [ ] Add proper SEO meta tags
- [ ] Handle 404 for invalid slugs

### Phase 6: Advanced Features

- [ ] "Ask AI to modify" functionality
- [ ] Website analytics/view tracking
- [ ] Multiple portfolio themes
- [ ] Bulk operations on websites (bulk delete only)

### Phase 7: Polish & Deployment

- [ ] Error handling and loading states
- [ ] Input validation and sanitization
- [ ] Performance optimization
- [ ] Production deployment setup

## API Routes Structure

```
/api/
├── auth/webhook          # Clerk webhook for user creation
├── websites/
│   ├── index.ts         # POST: create website
│   ├── [id]/
│   │   ├── index.ts     # DELETE: delete website
│   │   └── modify.ts    # PATCH: AI modifications
│   └── [slug]/
│       └── rename.ts    # PATCH: rename slug
```

## Database Schema

```sql
-- Users table (auto-populated via Clerk webhook)
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  clerk_id VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Websites table
CREATE TABLE websites (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  slug VARCHAR(255) UNIQUE NOT NULL,
  code TEXT NOT NULL,
  title VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Component Architecture

```
app/
├── dashboard/
│   ├── layout.tsx       # Sidebar layout
│   ├── page.tsx         # Main dashboard
│   └── components/
│       ├── Sidebar.tsx
│       ├── UploadResume.tsx
│       ├── WebsiteCard.tsx
│       └── SettingsDialog.tsx
├── sites/[slug]/
│   └── page.tsx         # Public website rendering
└── api/                 # API routes
```

## Key Dependencies to Install

- `pdf-parse` or `@react-pdf/renderer` for PDF text extraction
- `zod` for schema validation
- no, just use crypto.randomUUID()
- `dompurify` for HTML sanitization (client-side)
- VercelAI sdk for AI integration

## Current Status

✅ Landing page complete
✅ Clerk authentication setup
✅ Database schema defined
🔄 **Currently working on**: Dashboard with PDF upload
⏳ Pending: AI integration and website management
