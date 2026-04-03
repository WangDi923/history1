# AI History Assistant

## 1. Product Definition

### Product Name
AI History Assistant

### Target Users
Middle school and high school history teachers.

### Core Value
Help teachers prepare engaging history lessons by:
- Generating short historical stage-play scripts in one click.
- Simulating dialogue with famous historical figures.
- Storing lesson materials and generated outputs in one place.

## 2. MVP Scope

### 2.1 User System
- Teacher registration and sign-in with Supabase Auth.
- Basic profile page (name, school, teaching grade).
- Session management and protected routes.

### 2.2 Historical Script Generator
- Input:
	- Historical event (example: Hongmen Banquet).
	- Teaching objective (example: explain political tension after Qin collapse).
	- Optional grade level and class duration.
- Output:
	- Character list and role assignment suggestions.
	- Script with scene breakdown, dialogue, and stage directions.
	- Optional discussion questions for classroom reflection.

### 2.3 Historical Figure Chat
- Preset figures for MVP (example: Qin Shi Huang, Confucius, Han Wudi).
- Teachers can chat with a selected figure.
- AI behavior requirements:
	- Keep a consistent speaking style for each figure.
	- Stay aligned with known historical facts.
	- Explicitly mark uncertainty when evidence is limited.

### 2.4 Lesson Plan Library
- Save generated scripts and chat sessions to Supabase.
- Browse, open, and delete historical records.
- Search by event name, figure, or date.

### 2.5 Timeline World Map Explorer
- Provide a draggable timeline slider (year or era based).
- Update the world map dynamically when timeline position changes.
- Show historical overlays such as:
	- Major empires or political boundaries.
	- Key routes (example: Silk Road in selected periods).
	- Important event markers for the selected time.
- Support playback mode (auto-play timeline) for classroom demonstration.

## 3. Technical Stack

### Frontend
- Next.js (App Router)
- Tailwind CSS
- shadcn/ui
- Map rendering: MapLibre GL JS (or Leaflet as fallback)

### Backend
- Next.js Route Handlers for API endpoints

### Database and Auth
- Supabase (PostgreSQL + Auth)

### AI Integration
- OpenAI API (recommended: GPT-4o; fallback: GPT-4.1-mini)

## 4. System Design

### 4.1 High-Level Architecture
1. Teacher accesses the web app (Next.js frontend).
2. Frontend sends authenticated requests to Next.js API routes.
3. API routes call OpenAI for generation/chat.
4. API routes store and retrieve data from Supabase.
5. Frontend renders generated content and history records.

### 4.2 Core Modules
- `auth`: sign-in, sign-up, session validation.
- `script-generator`: prompt building, script generation, output formatting.
- `figure-chat`: character persona setup, chat memory, fact-safety layer.
- `lesson-library`: CRUD for scripts and conversations.
- `timeline-map`: timeline control, map layer switching, event marker rendering.

### 4.3 Suggested Database Schema

#### `profiles`
- `id` (uuid, primary key, references auth.users)
- `full_name` (text)
- `school` (text)
- `grade_levels` (text[])
- `created_at` (timestamp)

#### `scripts`
- `id` (uuid, primary key)
- `user_id` (uuid, references profiles.id)
- `event_name` (text)
- `teaching_objective` (text)
- `grade_level` (text)
- `duration_minutes` (int)
- `content` (text)
- `created_at` (timestamp)

#### `figure_chats`
- `id` (uuid, primary key)
- `user_id` (uuid, references profiles.id)
- `figure_name` (text)
- `title` (text)
- `created_at` (timestamp)

#### `figure_chat_messages`
- `id` (uuid, primary key)
- `chat_id` (uuid, references figure_chats.id)
- `role` (text: user or assistant)
- `content` (text)
- `created_at` (timestamp)

#### `timeline_layers`
- `id` (uuid, primary key)
- `name` (text)
- `start_year` (int)
- `end_year` (int)
- `layer_type` (text: boundary or route or marker)
- `geojson` (jsonb)
- `source_note` (text)
- `created_at` (timestamp)

#### `timeline_events`
- `id` (uuid, primary key)
- `title` (text)
- `event_year` (int)
- `region` (text)
- `description` (text)
- `point` (jsonb, lng/lat)
- `created_at` (timestamp)

## 5. API Design (MVP)

### Auth
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/logout`

### Script Generation
- `POST /api/scripts/generate`
	- Request: `eventName`, `teachingObjective`, `gradeLevel`, `durationMinutes`
	- Response: generated script text + metadata

### Figure Chat
- `POST /api/chats/:chatId/messages`
	- Request: `figureName`, `message`
	- Response: assistant reply

### Timeline Map
- `GET /api/timeline/layers?year=YYYY`
	- Response: geo layers active for the requested year
- `GET /api/timeline/events?year=YYYY`
	- Response: historical events for the requested year window
- `GET /api/timeline/range`
	- Response: supported min and max year

### Library
- `GET /api/scripts`
- `GET /api/chats`
- `GET /api/chats/:chatId/messages`
- `DELETE /api/scripts/:id`
- `DELETE /api/chats/:id`

## 6. Prompt and Safety Design

### Prompt Template Strategy
- System prompt includes:
	- Historical accuracy requirement.
	- Clear format constraints for output.
	- Classroom-safe and age-appropriate language.

### Safety Rules
- Do not fabricate specific citations unless source is provided.
- If uncertain, answer with confidence labels such as:
	- High confidence
	- Medium confidence
	- Uncertain
- Add a short "teacher verification note" for important claims.

## 7. Development Plan (Step by Step)

### Step 1: Initialize Project
1. Create Next.js app with TypeScript and Tailwind.
2. Install shadcn/ui and base components.
3. Configure ESLint and environment files.

### Step 2: Configure Supabase
1. Create Supabase project.
2. Enable email/password auth.
3. Create tables from schema.
4. Add Row Level Security policies.

Step 2 implementation files in this repo:
- Setup guide: [docs/supabase-step2.md](docs/supabase-step2.md)
- Schema SQL: [sql/001_init_schema.sql](sql/001_init_schema.sql)
- RLS policies SQL: [sql/002_rls_policies.sql](sql/002_rls_policies.sql)
- Optional timeline demo seed: [sql/003_seed_timeline_demo.sql](sql/003_seed_timeline_demo.sql)

Required SQL execution order:
1. `001_init_schema.sql`
2. `002_rls_policies.sql`
3. `003_seed_timeline_demo.sql` (optional)

### Step 3: Build Authentication Flow
1. Build sign-up and login pages.
2. Add middleware for route protection.
3. Create profile bootstrap after first login.

### Step 4: Implement Script Generator
1. Build form for event and objective input.
2. Create `POST /api/scripts/generate` route.
3. Call OpenAI and persist generated script.
4. Render script with clean section formatting.

### Step 5: Implement Figure Chat
1. Build figure selection UI.
2. Create chat session and message APIs.
3. Add persona prompt per historical figure.
4. Save all messages and allow chat history replay.

### Step 6: Build Lesson Library
1. Add script history list and detail page.
2. Add chat history list and detail page.
3. Add delete/search actions.

### Step 7: Build Timeline World Map Explorer
1. Build timeline slider UI (drag + auto-play).
2. Integrate map library and base map tiles.
3. Fetch layers/events by selected year.
4. Render boundaries, routes, and markers with legend.
5. Add loading and fallback states for missing years.

### Step 8: QA and Deployment
1. Test auth, generation, persistence, and permissions.
2. Add error boundaries and empty states.
3. Deploy to Vercel.
4. Configure production environment variables.

## 8. Environment Variables

Create `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4o
```

## 9. Acceptance Criteria (MVP)

- Teachers can sign up, sign in, and sign out.
- Teacher can generate a complete historical script from event + objective.
- Teacher can chat with at least 3 preset historical figures.
- Generated scripts and chat sessions are saved and visible in history.
- Teacher can drag the timeline and see the world map update by period.
- Timeline map supports at least one political boundary layer and one event marker layer.
- Data access is isolated by user via Supabase RLS.
- Basic error handling exists for API/network failures.

## 10. Future Iterations

- Add source-grounded generation using uploaded textbook excerpts.
- Add multi-language output (Chinese/English) for bilingual classes.
- Add quiz generation from scripts.
- Add collaboration mode for teacher teams.
- Add analytics dashboard (usage, most-used events, student engagement signals).
- Add region comparison mode (two years side-by-side map comparison).