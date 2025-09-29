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
- [x] Create website CRUD operations
- [x] Add proper TypeScript types with Zod schemas

### Phase 3: AI Portfolio Generation

- [x] Create AI service for portfolio generation
- [x] Design system prompt for HTML + Tailwind generation
- [x] Implement POST /api/websites endpoint
- [x] Add slug generation utility (random + custom)

### Phase 4: Website Management

- [x] Build websites list view in dashboard
- [x] Add website preview cards with actions
- [x] Implement slug renaming functionality
- [x] Add website deletion with confirmation
- [ ] Add code download feature

### Phase 5: Public Website Rendering

- [x] Create /sites/[slug] dynamic route
- [ ] Implement safe HTML rendering
- [ ] Add proper SEO meta tags
- [x] Handle 404 for invalid slugs

### Phase 6: Advanced Features

- [x] "Ask AI to modify" functionality
- [ ] Website analytics/view tracking
- [ ] Multiple portfolio themes
- [ ] Bulk operations on websites (bulk delete only)

### Phase 7: Polish & Deployment

- [ ] Error handling and loading states
- [ ] Input validation and sanitization
- [ ] Prevent prompt poisoning or injection
- [ ] Performance optimization
- [x] Production deployment setup

### Phase 8: payments

- [ ] Add clerk payments (developer will do this)
- [ ] Add feature flags and logic for clerk payments, implement AI usage database methods in CloudDatabase.

### Phase 9: Advanced AI features

- [ ] Model picker, between gemini, gpt-5, etc.

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

CREATE TABLE IF NOT EXISTS ai_usage (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  clerk_id VARCHAR(255) UNIQUE NOT NULL REFERENCES users(clerk_id) ON DELETE CASCADE,
  usage INT DEFAULT(0),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

### AI usage database methods:

New AI Usage Methods

**Table Creation**:

- createAIUsageTable() - Creates the ai_usage table with your
  schema

**Basic CRUD Operations**:

- getAIUsageByClerkId(clerkId) - Get usage by Clerk ID
- getAIUsageByUserId(userId) - Get usage by user ID
- createAIUsage({user_id, clerk_id}) - Create new usage record
- getOrCreateAIUsage({user_id, clerk_id}) - Get existing or create
  new

**Usage Management**:

- incrementAIUsage(clerkId, amount) - Increment usage by amount
  (default 1)
- setAIUsage(clerkId, usage) - Set usage to specific value
- resetAIUsage(clerkId) - Reset usage to 0

**Helper Methods**:

- getUserWithAIUsage(clerkId) - Get user and their AI usage in one
  call
- trackAIUsageForUser(clerkId, amount) - Convenient method to
  track usage (ensures record exists first)

**Usage Examples**:

```ts
// Track AI usage when user generates a portfolio
await CloudDatabase.trackAIUsageForUser(clerkId, 1);

// Get user's current usage
const { user, aiUsage } = await;
CloudDatabase.getUserWithAIUsage(clerkId);
console.log(`User ${user.email} has used ${aiUsage.usage} AI 
operations`);

// Reset usage (e.g., monthly reset)
await CloudDatabase.resetAIUsage(clerkId);
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

## Current Status

✅ Landing page complete
✅ Clerk authentication setup
✅ Database schema defined
✅ MVP built
