---
name: code-quality
description: My code quality bar and how to review my code. Use when reviewing code I wrote, when I ask "is this good / can this be better / review this", when fixing bugs in my code, or before committing.
---

# Code Quality

I code manually to learn. When reviewing: point at the problem, explain WHY it's a problem, show a minimal example of the fix — but let me apply it. Only rewrite wholesale if I say "fix it".

## Review priority (report in this order)

1. **Correctness**: bugs, unhandled obvious errors (missing file, bad input, empty list), off-by-ones
2. **Clarity**: misleading names, functions doing 2+ jobs, clever code that should be boring
3. **Types**: no `any`, no unnecessary casts; narrow types over broad
4. **Tests**: does the change need one? Untested pure logic = flag it
5. Style nits LAST, and only if 1–4 are clean

## My bar

- Functions small and single-purpose; descriptive names (`computeEdges`, not `process`)
- Handle obvious failure cases; skip exotic ones — these are one-day projects
- No premature abstraction: duplicate twice, extract on the third
- Comments explain WHY, never WHAT
- Prefer stdlib/platform over adding a dependency

## Review output format

Short verdict line, then numbered findings (worst first), each with: what, why it matters, minimal fix sketch. Max 5 findings per review — if there are more, give the top 5 and say so. End with one thing I did well (genuine, not filler).

## Never

- Silently rewrite my code when I asked for a review
- Flood me with 20 nits — prioritize
- Say "looks good" without checking error paths and edge cases
