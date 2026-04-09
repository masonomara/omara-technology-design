# Shooting Game — Bug Research Report

**File under investigation:** `src/app/(frontend)/page.tsx`  
**Date:** 2026-04-09

---

## Overview

The homepage shooting game is a self-contained React component (~738 lines). Players shoot 9 animated enemy cans, are scored on accuracy and reaction time, then submit their nickname to a Supabase `scores` table and see a leaderboard. The entire game (state, logic, DB calls, UI) lives in a single `page.tsx` file with no API routes — all Supabase operations happen client-side using `NEXT_PUBLIC_*` credentials.

**Actual `scores` table schema:**
```sql
create table public.scores (
  id bigserial not null,
  nickname text not null,
  score integer not null,
  user_id text null,
  created_at timestamp with time zone null default now(),
  constraint scores_pkey primary key (id)
) TABLESPACE pg_default;

create index IF not exists idx_scores_score_desc on public.scores using btree (score desc) TABLESPACE pg_default;
```

Key facts: `id` is the primary key (auto-increment bigserial). `user_id` is nullable text with **no unique constraint**.

---

## Bug 1 — CRITICAL: Duplicate Primary Key on Score Submission

**Location:** `page.tsx:163` (`submitScore` function)  
**Symptom:** `Error submitting score: duplicate key value violates unique constraint "scores_pkey"`

### Root Cause

Because `id` is a `bigserial` (auto-increment sequence), this error cannot come from `user_id` collisions — there is no unique constraint on that column. A duplicate `scores_pkey` violation with an auto-increment column has one reliable cause: **the Postgres sequence is out of sync with the actual max `id` in the table**.

This happens when rows are manually inserted with explicit IDs (e.g. via migration, seed script, or Supabase dashboard), when the table is truncated without resetting the sequence, or when data is restored. The sequence still thinks the next safe ID is, say, `5`, but rows with `id` 5, 6, 7 already exist — so the next `insert` tries to use an ID that is already taken.

A contributing code-level issue is that the submit button has **no loading/disabled state** during the async operation:

```typescript
// page.tsx:620–628 — button stays enabled during the entire async call
<button
  className={styles.primaryButton}
  onClick={submitScore}
  disabled={!nickname.trim()}  // only disabled when empty, not during submission
>
```

A double-click fires two concurrent `insert` calls. While `bigserial` sequences are concurrency-safe, a sequence already near a collision point means even one insert can fail — and with no in-flight guard, retries compound the issue.

### Fix

**Database level (required):** Reset the sequence to be safely above the current max ID:
```sql
SELECT setval('scores_id_seq', (SELECT MAX(id) FROM scores) + 1);
```

**Code level:** Add an `isSubmitting` state to disable the button during the async call so double-clicks are impossible:
```typescript
const [isSubmitting, setIsSubmitting] = useState(false);

async function submitScore() {
  if (isSubmitting) return;
  setIsSubmitting(true);
  try {
    // ... existing insert logic ...
  } finally {
    setIsSubmitting(false);
  }
}

// In JSX:
<button disabled={!nickname.trim() || isSubmitting} onClick={submitScore}>
```

---

## Bug 2 — Leaderboard Shows Current Score Twice After Submission

**Location:** `page.tsx:129–141` (`fetchLeaderboard` function)

### Root Cause

`fetchLeaderboard` fetches all rows from the DB and then **manually pushes the current user's score** into the result before storing it in state:

```typescript
const fetchLeaderboard = useCallback(async () => {
  const { data, error } = await supabase
    .from("scores")
    .select("*")
    .order("score", { ascending: false });
  if (!error) {
    if (score > 0) {
      data.push({ nickname, score }); // <-- always pushes a local copy
      data.sort((a, b) => b.score - a.score);
    }
    setLeaderboard(data);
  }
}, [score, nickname]);
```

After submission succeeds, any subsequent fetch returns the committed DB row **plus** the manually-pushed local entry — showing the user's score twice. This also means the user sees their score on the leaderboard before submission (confusing if submission later fails).

### Fix

Stop manually pushing the local entry. Show the current user as a placeholder row derived from local state when `!submitted`, and re-fetch once after a successful submission to reflect the live DB state.

---

## Bug 3 — Excessive / Unnecessary Supabase Fetches During Gameplay

**Location:** `page.tsx:129–145`

### Root Cause

`fetchLeaderboard` is wrapped in `useCallback` with `[score, nickname]` as dependencies. `score` updates after **every single enemy is shot** (9 times per game), and `nickname` updates on **every keystroke** in the nickname input. The `useEffect` at line 143–145 re-runs `fetchLeaderboard` on every dependency change:

```typescript
useEffect(() => {
  fetchLeaderboard();
}, [fetchLeaderboard]); // re-runs on every score tick and keypress
```

This fires up to 9+ Supabase reads during active gameplay and additional reads while the user types their nickname — all of which are wasted network requests returning data that immediately gets overwritten by the next call.

### Fix

Remove `score` and `nickname` from the dependency array. Only fetch the leaderboard once at game end (when `gameEnd` becomes `true`) and once after a successful submission.

---

## Bug 4 — Enemy Overlap Detection Uses AND Instead of OR

**Location:** `page.tsx:244–252` (inside `positionEnemy`)

### Root Cause

The collision check is supposed to prevent enemies from spawning on top of the hand or score UI elements. But the two conditions are joined with `&&` (AND) instead of `||` (OR):

```typescript
overlap =
  enemyX < handRect.right &&
  enemyX + 67 > handRect.left &&
  enemyY < handRect.bottom &&
  enemyY + 120 > handRect.top && // <-- AND, not OR between the two element checks
  enemyX < scoreRect.right &&
  enemyX + 67 > scoreRect.left &&
  enemyY < scoreRect.bottom &&
  enemyY + 120 > scoreRect.top;
```

`overlap` is only `true` when the enemy overlaps **both** the hand and the score wrapper simultaneously. Since these two UI elements are in different parts of the screen, that almost never happens. In practice the loop exits immediately even when the enemy is sitting directly on top of the hand or the score counter.

### Fix

```typescript
const overlapHand =
  enemyX < handRect.right &&
  enemyX + 67 > handRect.left &&
  enemyY < handRect.bottom &&
  enemyY + 120 > handRect.top;

const overlapScore =
  enemyX < scoreRect.right &&
  enemyX + 67 > scoreRect.left &&
  enemyY < scoreRect.bottom &&
  enemyY + 120 > scoreRect.top;

overlap = overlapHand || overlapScore;
```

---

## Bug 5 — Coordinate System Mismatch in Overlap Detection

**Location:** `page.tsx:238–252`

### Root Cause

Enemy positions (`enemyX`, `enemyY`) are calculated relative to the **gameFrame element** using its `clientWidth`/`clientHeight`. But `handRect` and `scoreRect` are obtained via `getBoundingClientRect()`, which returns **viewport-relative** coordinates. These two coordinate systems are only equivalent if the gameFrame's top-left corner is exactly at the viewport origin (0, 0).

```typescript
// enemyX/Y are gameFrame-relative:
enemyX = Math.random() * (frameWidth - 67); // relative to gameFrame
enemyY = Math.random() * (frameHeight - 120);

// But handRect/scoreRect are viewport-relative:
const handRect = handWrapper.getBoundingClientRect(); // viewport coords
const scoreRect = scoreWrapper.getBoundingClientRect();
```

If there is any scrolling or the frame is not flush against the top of the viewport, the overlap check produces incorrect results.

### Fix

Convert the hand and score rects into gameFrame-relative coordinates by subtracting the gameFrame's own `getBoundingClientRect()` offset:

```typescript
const frameRect = gameFrame.getBoundingClientRect();
const handRectRelative = {
  left:   handRect.left   - frameRect.left,
  right:  handRect.right  - frameRect.left,
  top:    handRect.top    - frameRect.top,
  bottom: handRect.bottom - frameRect.top,
};
// Same for scoreRect, then use handRectRelative in the overlap check
```

---

## Bug 6 — Game Stats Not Reset on Restart

**Location:** `page.tsx:325–360` (`restartGame` function)

### Root Cause

`restartGame()` resets most game state but **omits `shotsTaken` and `successfulHits`**:

```typescript
function restartGame() {
  // ...
  setCurrentEnemy(0);
  setScore(0);
  setSubmitted(false);
  // setShotsTaken(0);      <-- MISSING
  // setSuccessfulHits(0);  <-- MISSING
  // setGameEndTime(0);     <-- MISSING
  // ...
}
```

After restarting, the accuracy stat `(successfulHits / shotsTaken) * 100` will be the **cumulative** accuracy across all games played in the session, not just the most recent one. Similarly `gameEndTime` is left at the previous game's end time.

### Fix

Add the missing resets to `restartGame()`:

```typescript
setShotsTaken(0);
setSuccessfulHits(0);
setGameEndTime(0);
```

---

## Bug 7 — User Identification in Leaderboard Uses Score Value, Not User ID

**Location:** `page.tsx:564`

### Root Cause

The leaderboard highlights the "current user's" row by comparing score values:

```typescript
const isUser = entry.score === score;
```

If any other player has ever submitted the same score, **all matching rows are highlighted**, not just the current user's entry. As the leaderboard grows this produces false highlights more frequently.

The locally-pushed synthetic entry (Bug 2) has no `user_id`, which is why `user_id` matching was avoided in the first place — but that is itself a symptom of Bug 2.

### Fix

Once Bug 2 is resolved (stop pushing a synthetic local entry), identify the current user's row by `user_id`:

```typescript
const isUser = entry.user_id === userId;
```

---

## Bug 8 — No Leaderboard Refresh After Successful Score Submission

**Location:** `page.tsx:174` (`submitScore` success branch)

### Root Cause

After a successful insert, `setSubmitted(true)` is called but `fetchLeaderboard()` is not. The leaderboard displayed after submission is the stale version fetched before submission (which includes the synthetic local entry from Bug 2). The user never sees their actual rank on the live leaderboard.

### Fix

Call `fetchLeaderboard()` immediately after a successful submission:

```typescript
} else {
  setSubmitted(true);
  await fetchLeaderboard(); // refresh to show live leaderboard
}
```

---

## Bug 9 — Bad-Word Check Can Be Bypassed by an Existing Warning

**Location:** `page.tsx:153`

### Root Cause

The bad-word gate only fires if `warning` is currently empty:

```typescript
if (containsBadWord(nickname) && !warning) {
  setWarning("Your nickname contains a bad word...");
  return;
}
```

If a *different* warning is already showing, the bad-word check is silently skipped and the profane nickname is submitted immediately. This is unlikely in normal flow because `setWarning("")` is called on every keystroke (line 606), but a well-timed double-click could bypass the filter.

### Fix

Use a dedicated `badWordWarned` boolean instead of reusing the general `warning` flag, so the bypass only applies specifically to the bad-word warning.

---

## Change Request — Remove Newsletter / Subscribe Screen

**Location:** `page.tsx:59–91`, `page.tsx:326–329`, `page.tsx:640–731`

The email subscription screen should be removed entirely from the game flow. Currently, clicking "Play Again" for the first time intercepts the restart and shows a newsletter signup (`showSubscribeScreen`, `subscriptionSubmitted`, `email`, `subscribeToCompany`, `subscribeToBlog`, `hasShownSubscribe`). The desired behavior is for "Play Again" to immediately restart the game every time.

### Scope of Removal

- Delete state: `showSubscribeScreen`, `subscriptionSubmitted`, `email`, `subscribeToCompany`, `subscribeToBlog`, `hasShownSubscribe`
- Delete function: `handleSubscribe`
- Delete the subscribe screen JSX block (`page.tsx:640–731`)
- Simplify `restartGame()`: remove the `hasShownSubscribe` guard at lines 326–329 so it always restarts immediately
- Remove the Supabase `subscriptions` table insert
- Remove the conditional `{gameStart && !showSubscribeScreen && ...}` wrapper around the game-over screen (line 509) — it should just be `{gameStart && ...}`

---

## Summary Table

| # | Severity | Location | Description |
|---|----------|----------|-------------|
| 1 | Critical | `page.tsx:163` + DB | Postgres sequence out of sync causes `scores_pkey` violation; no submit loading state allows double-clicks |
| 2 | High | `page.tsx:136` | Local score always pushed into leaderboard → duplicate row after submission |
| 3 | High | `page.tsx:129–145` | Leaderboard re-fetched on every score tick and every keypress |
| 4 | High | `page.tsx:244–252` | Overlap uses `&&` instead of `\|\|` — enemies spawn on top of UI elements |
| 5 | Medium | `page.tsx:238–252` | Viewport vs. gameFrame coordinate mismatch in overlap detection |
| 6 | Medium | `page.tsx:325` | `shotsTaken`, `successfulHits`, `gameEndTime` not reset on restart |
| 7 | Medium | `page.tsx:564` | `isUser` matched by score value, not `user_id` — multi-highlight false positives |
| 8 | Medium | `page.tsx:174` | Leaderboard not re-fetched after successful score submission |
| 9 | Low | `page.tsx:153` | Bad-word check bypassed whenever any existing warning is present |
| — | Change | `page.tsx:59–731` | Remove newsletter/subscribe screen and all related state; "Play Again" should always restart immediately |
