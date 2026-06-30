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

export async function getMeta<T>(key: string, fallback: T): Promise<T> {
  const row = await db.meta.get(key);
  return row ? (row.value as T) : fallback;
}

export async function setMeta(key: string, value: unknown): Promise<void> {
  await db.meta.put({ key, value });
}
