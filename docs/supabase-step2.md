# Supabase Setup Guide (Step 2)

This guide completes Step 2 from README.

## 1. Create Supabase Project
1. Open Supabase dashboard and create a new project.
2. Copy project URL and API keys from Project Settings > API.

## 2. Enable Email/Password Auth
1. Go to Authentication > Providers.
2. Ensure Email provider is enabled.
3. Keep "Confirm email" on or off based on your testing preference.

## 3. Configure Environment Variables
Create `.env.local` from `.env.example`:

```bash
cp .env.example .env.local
```

Fill values:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`
- `OPENAI_MODEL`

## 4. Run SQL in Order
Open SQL Editor and execute files in this exact order:
1. `sql/001_init_schema.sql`
2. `sql/002_rls_policies.sql`
3. `sql/003_seed_timeline_demo.sql` (optional, for timeline map demo)

## 5. Verify Tables
After execution, confirm these tables exist:
- `profiles`
- `scripts`
- `figure_chats`
- `figure_chat_messages`
- `timeline_layers`
- `timeline_events`

## 6. Quick RLS Verification
1. Sign up with user A.
2. Insert a script row as user A.
3. Sign in as user B and verify user A data is not visible.
4. Verify both users can read timeline layers/events.

## 7. Local Validation
Run:

```bash
npm run dev
```

If environment variables are set correctly, Supabase client initialization should succeed.
