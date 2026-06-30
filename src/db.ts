import Dexie, { type Table } from "dexie";
import type { Task } from "./types";

/** App-level UI preferences (focus toggle, done-panel open) persisted alongside tasks. */
export interface MetaRow {
  key: string;
  value: unknown;
}

class QuadrantDB extends Dexie {
  tasks!: Table<Task, number>;
  meta!: Table<MetaRow, string>;

  constructor() {
    super("quadrant_v1");
    this.version(1).stores({
      tasks: "++id, quad, done, doneAt",
      meta: "key",
    });
  }
}

export const db = new QuadrantDB();

/**
 * Seed the database once, matching the prototype's `_seed()`. Guarded by a
 * `seeded` meta flag so clearing all tasks doesn't repopulate them.
 */
export async function ensureSeeded(): Promise<void> {
  await db.transaction("rw", db.tasks, db.meta, async () => {
    const seeded = await db.meta.get("seeded");
    if (seeded) return;

    const t = Date.now();
    const seed: Task[] = [
      { title: "Fix the production outage", due: "2026-06-30", quad: "do", done: false },
      { title: "Send the investor update", due: "2026-06-30", quad: "do", done: false },
      { title: "Draft the Q3 roadmap", due: "2026-07-03", quad: "sch", done: false },
      { title: "Prep for 1:1 with Sam", due: null, quad: "sch", done: false },
      { title: "Format the board deck", due: null, quad: "del", done: false },
      { title: "Reorganize old bookmarks", due: null, quad: "elim", done: false },
      { title: "Reply to Dana", due: null, quad: "do", done: true, doneAt: t - 1000 * 60 * 42 },
      { title: "Book flights for offsite", due: null, quad: "sch", done: true, doneAt: t - 1000 * 60 * 60 * 3 },
    ];

    await db.tasks.bulkAdd(seed);
    await db.meta.put({ key: "seeded", value: true });
  });
}

export async function getMeta<T>(key: string, fallback: T): Promise<T> {
  const row = await db.meta.get(key);
  return row ? (row.value as T) : fallback;
}

export async function setMeta(key: string, value: unknown): Promise<void> {
  await db.meta.put({ key, value });
}
