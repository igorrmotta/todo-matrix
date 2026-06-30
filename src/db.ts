import Dexie, { type Table } from "dexie";
import type { Task } from "./types";
import { registerSchema } from "./migrations";

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
    registerSchema(this);
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
