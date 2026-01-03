# Supabase Setup Guide

This guide covers recreating the Supabase project for the O’Mara Technology & Design website scoreboard and email subscription features.

## 1. Create Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **New Project**
3. Choose your organization
4. Enter project details:
   - **Name**: `omaratechnologydesign` (or any name)
   - **Database Password**: Generate a strong password and save it
   - **Region**: Choose closest to your users
5. Click **Create new project** and wait for setup (~2 minutes)

## 2. Get API Credentials

Once the project is ready:

1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (e.g., `https://abcdefghijk.supabase.co`)
   - **anon public** key (under Project API keys)

3. Update `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

## 3. Create Database Tables

Go to **SQL Editor** in Supabase dashboard and run:

```sql
-- ============================================
-- SCORES TABLE
-- Stores game leaderboard entries
-- ============================================
CREATE TABLE scores (
  id BIGSERIAL PRIMARY KEY,
  nickname TEXT NOT NULL,
  score INTEGER NOT NULL,
  user_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster leaderboard queries
CREATE INDEX idx_scores_score_desc ON scores(score DESC);

-- ============================================
-- SUBSCRIPTIONS TABLE
-- Stores email list signups
-- ============================================
CREATE TABLE subscriptions (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT,
  email TEXT NOT NULL,
  company_newsletter BOOLEAN DEFAULT false,
  personal_blog BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for email lookups
CREATE INDEX idx_subscriptions_email ON subscriptions(email);
```

## 4. Set Up Row Level Security (RLS)

RLS controls who can read/write data. Run this in SQL Editor:

```sql
-- ============================================
-- ENABLE RLS ON BOTH TABLES
-- ============================================
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- ============================================
-- SCORES POLICIES
-- ============================================

-- Anyone can view the leaderboard
CREATE POLICY "Public read access for scores"
ON scores FOR SELECT
TO anon, authenticated
USING (true);

-- Anyone can submit a score
CREATE POLICY "Public insert access for scores"
ON scores FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- ============================================
-- SUBSCRIPTIONS POLICIES
-- ============================================

-- Only authenticated users or service role can view subscriptions
-- (keeps emails private)
CREATE POLICY "Private subscriptions"
ON subscriptions FOR SELECT
TO authenticated
USING (true);

-- Anyone can subscribe (insert their email)
CREATE POLICY "Public insert access for subscriptions"
ON subscriptions FOR INSERT
TO anon, authenticated
WITH CHECK (true);
```

## 5. Optional: Rate Limiting

To prevent spam/abuse, you can add rate limiting. Go to **Database** → **Functions** and create:

```sql
-- Function to check if user submitted recently (within 1 minute)
CREATE OR REPLACE FUNCTION check_score_rate_limit(p_user_id TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN NOT EXISTS (
    SELECT 1 FROM scores
    WHERE user_id = p_user_id
    AND created_at > NOW() - INTERVAL '1 minute'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

Then update the insert policy:

```sql
-- Drop old policy first
DROP POLICY IF EXISTS "Public insert access for scores" ON scores;

-- New policy with rate limiting
CREATE POLICY "Rate limited score inserts"
ON scores FOR INSERT
TO anon, authenticated
WITH CHECK (check_score_rate_limit(user_id));
```

## 6. Verify Setup

Test your setup by running these queries in SQL Editor:

```sql
-- Test insert
INSERT INTO scores (nickname, score, user_id)
VALUES ('TEST_USER', 100, 'test-uuid-123');

-- Test select
SELECT * FROM scores ORDER BY score DESC;

-- Clean up test data
DELETE FROM scores WHERE nickname = 'TEST_USER';
```

## 7. Data Management

### View Leaderboard

```sql
SELECT nickname, score, created_at
FROM scores
ORDER BY score DESC
LIMIT 100;
```

### View Subscriptions

```sql
SELECT email, company_newsletter, personal_blog, created_at
FROM subscriptions
ORDER BY created_at DESC;
```

### Export Emails for Newsletter

```sql
-- Company newsletter subscribers
SELECT email FROM subscriptions WHERE company_newsletter = true;

-- Personal blog subscribers
SELECT email FROM subscriptions WHERE personal_blog = true;
```

### Clear Test/Spam Data

```sql
-- Remove low scores (likely test entries)
DELETE FROM scores WHERE score < 10;

-- Remove duplicate emails (keep first)
DELETE FROM subscriptions a
USING subscriptions b
WHERE a.id > b.id AND a.email = b.email;
```

## Table Schema Reference

### scores

| Column     | Type        | Description                              |
| ---------- | ----------- | ---------------------------------------- |
| id         | BIGSERIAL   | Auto-incrementing primary key            |
| nickname   | TEXT        | Player display name (required)           |
| score      | INTEGER     | Final game score (required)              |
| user_id    | TEXT        | UUID stored in localStorage for tracking |
| created_at | TIMESTAMPTZ | Timestamp of submission                  |

### subscriptions

| Column             | Type        | Description                   |
| ------------------ | ----------- | ----------------------------- |
| id                 | BIGSERIAL   | Auto-incrementing primary key |
| user_id            | TEXT        | UUID stored in localStorage   |
| email              | TEXT        | Subscriber email (required)   |
| company_newsletter | BOOLEAN     | Opted into company updates    |
| personal_blog      | BOOLEAN     | Opted into personal blog      |
| created_at         | TIMESTAMPTZ | Timestamp of subscription     |

## Troubleshooting

### "permission denied for table scores"

RLS policies not set correctly. Re-run Section 4.

### Scores not appearing

Check browser console for errors. Verify API credentials in `.env.local`.

### CORS errors

Supabase handles CORS automatically. If issues persist, check that you're using the correct project URL.

### Rate limiting too aggressive

Adjust the interval in the `check_score_rate_limit` function (e.g., change `1 minute` to `30 seconds`).
