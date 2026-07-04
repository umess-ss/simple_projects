---
name: project-atlas
description: Conventions for the Project Atlas repo (Next.js 16 App Router + React 19 + TypeScript + Tailwind portfolio hub that maps mini-projects). Use whenever working in this repo — adding/editing projects, changing the map or catalog UI, styling, or deploying. Also use when the user says "add my new project", "update atlas", or mentions data/projects.ts.
---

# Project Atlas

Static-export Next.js site. One rule drives everything: **all content lives in `data/projects.ts`** — map, catalog, filters, and tags derive from it. Never hardcode project info in components.

## Add a project (most common task)

Append one object to `data/projects.ts`:

```ts
{
  id: "kebab-slug",            // unique
  title: "Name",
  summary: "1-2 sentences.",
  tags: ["Python", "CLI"],     // reuse existing tags when possible — tags create map edges
  status: "shipped",           // "shipped" | "in-progress" | "archived"
  builtOn: "YYYY-MM-DD",
  repoUrl: "https://github.com/...",  // optional
  liveUrl: "...",              // optional
  note: "learned: X",          // optional, shown in amber on card
}
```

No other file changes needed. Prefer existing tags over new ones (new tag = isolated node on map).

## Layout

- `data/projects.ts` — content (edit here 90% of the time)
- `lib/types.ts` — Project interface; `lib/graph.ts` — shared-tag edges
- `components/MapView.tsx` — SVG network map (client); `ProjectCard.tsx`; `FilterBar.tsx`
- `app/page.tsx` — hero + map + catalog; `app/globals.css` — tokens, focus, reduced-motion

## Conventions

- Strict TS; no `any`. Client components only where state/handlers needed (`"use client"`).
- Colors/fonts come from `tailwind.config.ts` tokens (ink/paper/amber/teal, font-display/body/mono). Don't add raw hex in components.
- Status colors: shipped=teal, in-progress=amber, archived=gray. Keep consistent between MapView and ProjectCard.
- Static export (`output: "export"` in next.config.js) — no server actions, no API routes, no next/image optimization.
- Stack: Next 16.x + React 19.x + ESLint 10 flat config. Keep `next` ≥16.2.10; never downgrade. `next lint` is gone — the lint script is `eslint .`.
- Verify with `npm run build` before committing (compiles + type-checks); run `npm run lint` separately — build no longer runs ESLint.
