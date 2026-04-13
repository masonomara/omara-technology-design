# Game Bug Fix — Execution Plan

**Source:** `research-game.md`  
**File to edit:** `src/app/(frontend)/page.tsx`  
**Approach:** Remove and simplify first, then patch what remains.

---

## Who Does What

| Step | Who    | What                                              |
| ---- | ------ | ------------------------------------------------- |
| 1    | You    | Run one SQL query in Supabase to fix the sequence |
| 2–7  | Claude | All code changes in `page.tsx`                    |

---

## Step 1 — You: Reset the Supabase Sequence (Bug 1)

In your Supabase dashboard → SQL Editor, run:

```sql
SELECT setval('scores_id_seq', (SELECT MAX(id) FROM scores) + 1);
```

This fixes the root cause of the `scores_pkey` duplicate key error. The sequence counter fell behind the actual data, so new inserts were trying to reuse IDs that already exist. This one query realigns them.

---

## Step 2 — Claude: Remove the Newsletter / Subscribe Screen

**Removes ~100 lines and 6 state variables.** Do this first because it simplifies `restartGame()` before we touch it in Step 6.

**Delete these state variables:**

```typescript
// DELETE all of these:
const [showSubscribeScreen, setShowSubscribeScreen] = useState(false);
const [subscriptionSubmitted, setSubscriptionSubmitted] = useState(false);
const [email, setEmail] = useState("");
const [subscribeToCompany, setSubscribeToCompany] = useState(true);
const [subscribeToBlog, setSubscribeToBlog] = useState(true);
const [hasShownSubscribe, setHasShownSubscribe] = useState(false);
```

**Delete the `handleSubscribe` function** (lines 67–91) entirely.

**In `restartGame()`**, delete the early-return guard (the whole `if (!hasShownSubscribe)` block) so it always restarts:

```typescript
// DELETE this entire block:
if (!hasShownSubscribe) {
  setShowSubscribeScreen(true);
  setHasShownSubscribe(true);
  return;
}
```

**Delete the subscribe screen JSX block** (the `{showSubscribeScreen && (...)}` block, lines 641–732) entirely.

**Fix the game-over screen condition** — remove `!showSubscribeScreen` from the guard:

```typescript
// BEFORE:
{gameStart && !showSubscribeScreen && (

// AFTER:
{gameStart && (
```

---

## Step 3 — Claude: Simplify `fetchLeaderboard` (Bugs 2, 3, 8)

Replace the current `useCallback` with a plain `async function`. Remove the local score push entirely — the leaderboard always reflects live DB state. Add a `useEffect` that only fires when `gameEnd` becomes `true`.

```typescript
// REPLACE the fetchLeaderboard useCallback and its useEffect with:

async function fetchLeaderboard() {
  const { data, error } = await supabase
    .from("scores")
    .select("*")
    .order("score", { ascending: false });
  if (!error) setLeaderboard(data);
}

useEffect(() => {
  if (gameEnd) fetchLeaderboard();
}, [gameEnd]);
```

That's it. No deps array juggling, no manual push, no re-fetches during gameplay or on keystrokes.

> **UX note:** The leaderboard fetched at game end won't include the current score yet (not submitted). That's fine — the score is already prominently displayed above the leaderboard. After submit, Step 4 re-fetches and the user's entry appears in its proper rank position.

---

## Step 4 — Claude: Fix `submitScore` (Bugs 1, 8, 9)

Three targeted changes: add a loading guard, re-fetch leaderboard after success, and fix the bad-word bypass.

```typescript
const [isSubmitting, setIsSubmitting] = useState(false);

async function submitScore() {
  if (!nickname.trim()) {
    setWarning("Please enter a nickname before submitting.");
    return;
  }

  // FIX Bug 9: check bad word independently of existing warning state
  if (containsBadWord(nickname)) {
    if (!warning) {
      setWarning(
        "Your nickname contains a bad word. Please consider a different name.",
      );
      return;
    }
    // If warning was already shown, user clicked "Submit Anyway" — allow it through
  }

  setWarning("");
  setIsSubmitting(true); // FIX Bug 1 (code side): prevent double-submission

  try {
    const { error } = await supabase
      .from("scores")
      .insert([{ nickname, score, user_id: userId }]);

    if (error) {
      console.error("Supabase error:", error);
      alert("Error submitting score: " + error.message);
    } else {
      setSubmitted(true);
      await fetchLeaderboard(); // FIX Bug 8: refresh leaderboard after submit
    }
  } catch (err) {
    console.error("Network error:", err);
    alert(
      "Failed to connect to the server. Please check your connection and try again.",
    );
  } finally {
    setIsSubmitting(false);
  }
}
```

Update the submit button to use the new state:

```typescript
// BEFORE:
<button
  className={styles.primaryButton}
  onClick={submitScore}
  disabled={!nickname.trim()}
>

// AFTER:
<button
  className={styles.primaryButton}
  onClick={submitScore}
  disabled={!nickname.trim() || isSubmitting}
>
```

---

## Step 5 — Claude: Fix Enemy Overlap Detection (Bugs 4, 5)

Two fixes in one place inside `positionEnemy`. Convert rects to frame-relative coordinates, then use `||` instead of `&&`.

```typescript
// REPLACE the overlap detection block with:

const frameRect = gameFrame.getBoundingClientRect();

const toFrameCoords = (rect: DOMRect) => ({
  left: rect.left - frameRect.left,
  right: rect.right - frameRect.left,
  top: rect.top - frameRect.top,
  bottom: rect.bottom - frameRect.top,
});

const hand = toFrameCoords(handWrapper.getBoundingClientRect());
const score = toFrameCoords(scoreWrapper.getBoundingClientRect());

let enemyX, enemyY, overlap;
do {
  enemyX = Math.random() * (frameWidth - 67);
  enemyY = Math.random() * (frameHeight - 120);

  const overlapHand =
    enemyX < hand.right &&
    enemyX + 67 > hand.left &&
    enemyY < hand.bottom &&
    enemyY + 120 > hand.top;

  const overlapScore =
    enemyX < score.right &&
    enemyX + 67 > score.left &&
    enemyY < score.bottom &&
    enemyY + 120 > score.top;

  overlap = overlapHand || overlapScore; // FIX Bug 4: OR not AND
} while (overlap);
```

---

## Step 6 — Claude: Fix `restartGame` Stats Reset (Bug 6)

After removing the newsletter block in Step 2, `restartGame` is already cleaner. Add the three missing resets:

```typescript
function restartGame() {
  setCurrentEnemy(0);
  setScore(0);
  setSubmitted(false);
  setNickname("");
  setLeaderboard([]);
  setWarning("");
  setBangs([]);
  setHandImage("/thumbsUp.svg");
  setGameAction(true);
  setGameStart(true);
  setGameStartTime(performance.now());
  setGameEnd(false);
  // FIX Bug 6: reset per-game stats
  setShotsTaken(0);
  setSuccessfulHits(0);
  setGameEndTime(0);
  setEnemyStates(Array(9).fill(false));
  setEnemyStates((prev) => prev.map((_, index) => index === 0));

  const allEnemies: NodeListOf<HTMLElement> = document.querySelectorAll(
    `.${styles.enemy}`,
  );
  allEnemies.forEach((enemy: HTMLElement) => {
    enemy.style.transition = "";
    enemy.style.transform = "";
    enemy.style.opacity = "";
    enemy.style.pointerEvents = "";
    enemy.style.left = "";
    enemy.style.top = "";
    enemy.style.display = "none";
    enemy.classList.remove(styles.enemyHit, styles.hidden, styles.active);
    enemy.classList.add(styles.upcomingEnemy);
  });
}
```

---

## Step 7 — Claude: Fix Leaderboard User Highlighting (Bug 7)

```typescript
// BEFORE:
const isUser = entry.score === score;

// AFTER:
const isUser = entry.user_id === userId;
```

This ensures only the current user's row is highlighted, even if another player has the same score.

---

## Execution Order Summary

```
You  → Step 1: Run SQL in Supabase
Claude → Step 2: Remove newsletter (simplifies ~100 lines)
Claude → Step 3: Simplify fetchLeaderboard (plain function, no push)
Claude → Step 4: Fix submitScore (loading state, re-fetch, bad word)
Claude → Step 5: Fix overlap detection (frame coords + OR logic)
Claude → Step 6: Fix restartGame (add 3 missing resets)
Claude → Step 7: Fix isUser check (user_id not score value)
```

Steps 2–7 are all in `page.tsx` and have no interdependencies except that Step 3 defines `fetchLeaderboard` as a plain function before Step 4 calls it. We'll apply them top-to-bottom in the file.

---

## Todo List

### Phase 1 — You: Database

- [x] Open Supabase dashboard → SQL Editor
- [x] Run `SELECT setval('scores_id_seq', (SELECT MAX(id) FROM scores) + 1);`
- [x] Confirm query runs without error
- [x] Tell Claude you're done so we can proceed to the code

---

### Phase 2 — Claude: Remove Newsletter (Step 2)

**State variables** (top of component, ~lines 59–64)

- [x] Delete `showSubscribeScreen` state
- [x] Delete `subscriptionSubmitted` state
- [x] Delete `email` state
- [x] Delete `subscribeToCompany` state
- [x] Delete `subscribeToBlog` state
- [x] Delete `hasShownSubscribe` state

**`handleSubscribe` function** (~lines 67–91)

- [x] Delete the entire `handleSubscribe` async function

**`restartGame` function** (~lines 326–329)

- [x] Delete the `if (!hasShownSubscribe)` early-return block

**JSX**

- [x] Delete the subscribe screen JSX block (`{showSubscribeScreen && (...)}`, ~lines 641–732)
- [x] Change `{gameStart && !showSubscribeScreen && (` to `{gameStart && (` on the game-over screen guard (~line 509)

---

### Phase 3 — Claude: Simplify `fetchLeaderboard` (Step 3)

- [x] Delete the `fetchLeaderboard` `useCallback` declaration (~lines 129–141)
- [x] Delete the `useEffect` that calls `fetchLeaderboard` (~lines 143–145)
- [x] Add a plain `async function fetchLeaderboard()` with no local score push
- [x] Add a `useEffect` that calls `fetchLeaderboard()` only when `gameEnd` becomes `true`

---

### Phase 4 — Claude: Fix `submitScore` (Step 4)

- [x] Add `isSubmitting` state variable at the top of the component
- [x] Rewrite the bad-word check to be independent of `warning` state
- [x] Add `setIsSubmitting(true)` before the try block
- [x] Add `await fetchLeaderboard()` after `setSubmitted(true)` in the success branch
- [x] Add `setIsSubmitting(false)` in a `finally` block
- [x] Update the submit button's `disabled` prop to include `|| isSubmitting`

---

### Phase 5 — Claude: Fix Overlap Detection (Step 5)

- [x] After getting `frameWidth`/`frameHeight` from `gameFrame`, add `const frameRect = gameFrame.getBoundingClientRect()`
- [x] Add the `toFrameCoords` helper inline
- [x] Replace the raw `handRect`/`scoreRect` references with frame-relative equivalents using `toFrameCoords`
- [x] Split the single `overlap` condition into `overlapHand` and `overlapScore`
- [x] Change the final `overlap` assignment to use `||` instead of `&&`

---

### Phase 6 — Claude: Fix `restartGame` Stats Reset (Step 6)

- [x] Add `setShotsTaken(0)` to `restartGame`
- [x] Add `setSuccessfulHits(0)` to `restartGame`
- [x] Add `setGameEndTime(0)` to `restartGame`

---

### Phase 7 — Claude: Fix Leaderboard User Highlighting (Step 7)

- [x] Change `const isUser = entry.score === score` to `const isUser = entry.user_id === userId`

---

### Phase 8 — You: Verify

- [ ] Run the dev server (`npm run dev`)
- [ ] Play a full game, submit a score — confirm no duplicate key error
- [ ] Play again, submit a second score — confirm it succeeds
- [ ] Verify leaderboard shows your score exactly once after submitting
- [ ] Verify accuracy and time stats are correct after restarting
- [ ] Verify enemies never spawn on top of the hand or score counter
- [ ] Verify only your row is highlighted in the leaderboard
- [ ] Verify "Play Again" goes straight to a new game (no subscribe screen)
