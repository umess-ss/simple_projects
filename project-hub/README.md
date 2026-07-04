# Project Atlas

A single frontend that maps every one of your mini-projects into one place —
a visual network showing how they're connected by shared tech, plus a
searchable, filterable catalog underneath.

Built with **Next.js 14 (App Router) + TypeScript + Tailwind CSS**, statically
exported so it can be hosted anywhere (Vercel, GitHub Pages, Netlify).

## Why it's built this way

- **Data-driven**: every project is one object in `data/projects.ts`. Nothing
  else needs to change to add a new one — the map, filters, and catalog are
  all derived from that list.
- **The map is literal**: two projects are connected if they share a tag
  (e.g. both use "TypeScript"). Hover a node to see its connections light up;
  click it to jump straight to that project's card.
- **Numbered catalog entries**: this isn't decorative — it's a real index of
  how many projects you've logged, in the spirit of a lab notebook.

## Getting started

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Adding a new project

Open `data/projects.ts` and add an object:

```ts
{
  id: "my-new-project",
  title: "My New Project",
  summary: "One or two sentences about what it does.",
  tags: ["Python", "CLI"],
  status: "shipped", // or "in-progress" | "archived"
  builtOn: "2026-07-10",
  repoUrl: "https://github.com/you/my-new-project",
  note: "learned: X", // optional
}
```

That's it — it'll appear in the map, the catalog, and the tag filters
automatically.

## Building for production

```bash
npm run build
```

This produces a static export in `/out` (see `next.config.js` —
`output: "export"`), which you can deploy to GitHub Pages, Netlify, Vercel,
or any static host.

## Project structure

```
project-hub/
├── app/
│   ├── layout.tsx       # fonts + global shell
│   ├── page.tsx         # hero, map, catalog, filters
│   └── globals.css      # design tokens, focus states, reduced-motion
├── components/
│   ├── MapView.tsx      # the network map (client component)
│   ├── ProjectCard.tsx  # one catalog entry
│   └── FilterBar.tsx    # search + tag chips
├── data/
│   └── projects.ts      # <-- edit this to add projects
└── lib/
    ├── types.ts         # Project type definition
    └── graph.ts         # shared-tag edge computation
```

## Ideas for extending this (good next steps in Claude Code)

- Pull project data from the GitHub API instead of a static file, so new
  repos show up automatically
- Add a detail page per project (`app/projects/[id]/page.tsx`) with a longer
  writeup, screenshots, or a changelog
- Add a force-directed layout to the map (e.g. `d3-force`) instead of the
  current radial layout, so it holds up better as the list grows
- Add dark/light theme toggle
- Auto-generate the `note` field from commit messages or a `CHANGELOG.md`
