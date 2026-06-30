# Quadrant

An Eisenhower Matrix task manager — a calm, paper-toned 2×2 grid that sorts
tasks by urgency and importance. Built from the **Quadrant** design in the
Claude Design handoff bundle (`../project/Quadrant.dc.html`).

## Features

- **Weighted 2×2 matrix** — Do First (darkest/boldest) → Schedule → Delegate →
  Eliminate (dashed, faded), with axis labels on the edges.
- **Add inside each quadrant** — the `＋ Add task` row opens an inline composer
  (title + optional due date; Enter to add, Esc to cancel).
- **Drag between quadrants** — cards lift while dragging; the target quadrant
  outlines as you hover.
- **Tasks** — title, due-date chip (Today/Overdue go accent), a checkbox to
  complete, and hover edit/delete.
- **Focus mode** — the header toggle fades the other quadrants and walks
  Do First → Schedule → Delegate → Eliminate, auto-advancing as each clears
  (empty ones skipped), then hands the full matrix back with an "All clear" note.
  Editing stays live throughout.
- **Progress bar** on the Do First header (and the active focused quadrant).
- **Shared Done panel** — checked tasks leave their quadrant for one list,
  newest first, with restore / clear-all. No origin tags.
- **Empty state** that guides a first-time user.
- **Persistence** — tasks and UI prefs live in **IndexedDB** via Dexie, so the
  board survives reloads.

## Stack

- **Vite + React 18 + TypeScript**
- **Dexie** (`dexie`, `dexie-react-hooks`) for IndexedDB persistence
- No CSS framework — the design is recreated with inline styles matching the
  prototype; the accent color drives hover states via a `--accent` CSS variable.

## Develop

```bash
pnpm install
pnpm dev        # start the dev server
pnpm build      # typecheck (tsc) + production build
pnpm preview    # serve the production build
```

## Configuration

Design tokens from the original Claude Design "editor" controls live in
[`src/theme.ts`](src/theme.ts):

- `ACCENT` — accent color (`#bd5f3a`, with `#3f6ec8` / `#5f7a4f` / `#7d5fb0` as
  the prototype's alternates)
- `DIM_LEVEL` — focus-mode dim opacity for inactive quadrants (`0.16`)
- `COMPACT` — denser card layout (`false`)

## Resetting data

The first run seeds sample tasks (guarded by a `seeded` flag). To start clean,
clear the `quadrant_v1` IndexedDB database in your browser's dev tools.
