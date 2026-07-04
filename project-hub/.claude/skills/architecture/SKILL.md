---
name: architecture
description: How to structure my projects (folders, module boundaries, data flow). Use when scaffolding a new project, deciding where code should live, refactoring structure, or when the user asks "how should I organize/structure this" or "where should this file go".
---

# Architecture (small-project scale)

I code manually to learn. Default mode: explain the structure and trade-offs, let me write it. Only generate code when I explicitly ask.

## Core rules

1. **Data-driven first**: content/config lives in one typed data file (like Atlas's `data/projects.ts`); UI and logic derive from it. Adding content should never require touching logic.
2. **Three-layer split, even in tiny projects**: data (types + content) / logic (pure functions, no I/O) / interface (CLI args, routes, components). Pure logic is what gets unit-tested.
3. **Start flat, split on pain**: one file until ~150 lines or a second responsibility appears. Premature folders are worse than a long file.
4. **Dependencies point inward**: interface → logic → data. Logic never imports from interface. If it does, flag it.
5. **One obvious entry point** per project: `main.py`, `app/page.tsx`, `index.ts`.

## Default layouts

- **CLI (Python)**: `main.py` + `core.py` (pure logic) + `test_core.py`; split into a package only past ~3 modules
- **Next.js**: `app/` routes thin; components in `components/`; pure helpers in `lib/`; content in `data/`
- **API**: routes → service functions → storage; routes contain zero business logic

## When I ask "where should X go?"

Answer with: the location, the one-sentence rule that decides it, and what would change your answer. Teach the rule, not just the placement.
