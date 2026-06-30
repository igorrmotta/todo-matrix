# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm install
pnpm dev        # Vite dev server
pnpm build      # tsc --noEmit (typecheck) then vite build
pnpm lint       # tsc --noEmit (TypeScript strict) — there is no ESLint
pnpm test       # vitest run (unit tests, e.g. DB migrations)
pnpm test:watch # vitest in watch mode
pnpm preview    # serve the production build
```

`pnpm lint` (TypeScript strict) plus `pnpm test` (Vitest) are the verification gates. Tests live next to source as `*.test.ts` and cover pure logic and Dexie migrations (the latter via `fake-indexeddb`); there is no React component test runner.

## Architecture

A single-page Eisenhower Matrix task manager (Vite + React 18 + TypeScript), ported verbatim from a Claude Design prototype (`Quadrant.dc.html`). State lives entirely in the browser via IndexedDB — there is no backend.

**Data flow is one-directional through Dexie:**
- [`src/db.ts`](src/db.ts) defines the `quadrant_v1` IndexedDB database (Dexie). Two tables: `tasks` and a `meta` key/value table for UI prefs (`focus`, `doneOpen`). Schema versions and data migrations are declared in [`src/migrations.ts`](src/migrations.ts) via `registerSchema()`; each `Migration` pairs a Dexie version with a **pure** per-row `migrateTask` transform (clock-injected, so it's unit-testable without IndexedDB). Bump the model by adding a `Migration` entry, not by editing version 1.
- [`src/useQuadrant.ts`](src/useQuadrant.ts) is the single state hook. It reads tasks live via `useLiveQuery` and exposes all mutations (`addTask`, `editTask`, `reorderTask`, `toggleDone`, etc.) as the `QuadrantApi`. **All writes go to Dexie directly; the live query re-renders.** There is no separate in-memory store to keep in sync.
- [`src/App.tsx`](src/App.tsx) owns only transient UI state (which quadrant's composer is open, which task is being edited) and wires the hook into the components.

**The four quadrants** are keyed `do | sch | del | elim` (`QuadKey` in [`src/types.ts`](src/types.ts)). Their priority order, grid placement, labels, and full color palette are defined once in [`src/theme.ts`](src/theme.ts) (`QUAD_META`, `QUAD_ORDER`). Use `quadByKey()` to look up a quadrant's metadata; don't hardcode quadrant properties elsewhere.

**Focus mode**: `activeQuad` (computed in `useQuadrant`) is the first non-empty quadrant in `QUAD_ORDER` with incomplete tasks. The matrix dims inactive quadrants and auto-advances as each clears. It is only meaningful while `focus` is true.

**Component tree**: `App → Header / Matrix / DonePanel` (+ a `ConfirmDialog` modal for delete). `Matrix` lays out the 2×2 grid + axis labels and owns drag-and-drop state (HTML5 drag events; dropping calls `reorderTask`, which both moves a task between quadrants and reorders within one via the `order` field). Each `QuadrantCard` renders incomplete tasks (sorted by `order`) plus the inline `Composer`, and each `TaskCard` shows a "waiting" age pill from `createdAt`. Completed tasks are filtered out of the quadrants and pooled into the shared `DonePanel` (newest-first by `doneAt`).

## Conventions specific to this codebase

- **Styling is all inline `style={{}}` objects** — there is no CSS framework and no CSS modules. The design is recreated to match the prototype pixel-for-pixel; colors come from `theme.ts` or literal hex values matching the original. Match this; don't introduce a styling library.
- **`theme.ts` holds the design tokens** that were the prototype's tweakable "editor" controls (`ACCENT`, `DIM_LEVEL`, `COMPACT`). Change appearance there.
- Pure date helpers live in [`src/utils.ts`](src/utils.ts): `ago` (relative "time ago" for the Done list, ported from the prototype's `_ago`) and `waiting` (compact age pill `Today`/`3d`/`2w` from `createdAt`). Preserve their behavior when editing.
- **The board starts empty** — there is no seed data. The `EmptyState` component handles the zero-task case. To reset during development, delete the `quadrant_v1` IndexedDB database in browser dev tools.
