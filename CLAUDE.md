# CLAUDE.md — O'Mara Technology

## Animations

All variants are in `src/app/lib/motion.ts`. The library is intentionally small — 5 variants. Don't add new ones without a clearly distinct use case.

- `whileInView` viewports use `amount: 0.15` everywhere — don't set it to `0`.
- Game animations in `src/app/styles/index.module.css` are tuned separately — don't change them as part of site animation work.

## Homepage Game

If scores stop inserting with `duplicate key value violates unique constraint "scores_pkey"`, the Supabase sequence is out of sync. Fix it:

```sql
SELECT setval('scores_id_seq', (SELECT MAX(id) FROM scores) + 1);
```

This happens after any manual seed, restore, or truncate of the `scores` table.
