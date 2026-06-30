import type Dexie from "dexie";
import type { Transaction } from "dexie";

/** Tasks-table index schema. Unchanged across the v2 migration (only non-indexed fields move). */
export const TASKS_STORES = "++id, quad, done, doneAt";

/** A loosely-typed task record, as stored — migrations run against raw rows. */
export type TaskRecord = Record<string, unknown>;

/**
 * v1 -> v2: drop the user-entered `due` deadline and add an automatic
 * `createdAt` (epoch ms) that drives the "waiting" age pill. Pure and
 * clock-injected (no `Date.now()` inside) so it can be unit-tested directly.
 */
export function migrateTaskToV2(task: TaskRecord, now: number): TaskRecord {
  const next: TaskRecord = { ...task };
  delete next.due;
  if (next.createdAt == null) {
    next.createdAt = task.doneAt ?? now;
  }
  return next;
}

/** One versioned step: the Dexie version it upgrades to, its index schema, and the per-row transform. */
export interface Migration {
  version: number;
  stores: string;
  migrateTask: (task: TaskRecord, now: number) => TaskRecord;
}

export const MIGRATIONS: Migration[] = [
  { version: 2, stores: TASKS_STORES, migrateTask: migrateTaskToV2 },
];

/** Apply a migration's per-row transform across every task in the upgrade transaction. */
export async function applyMigration(tx: Transaction, m: Migration): Promise<void> {
  const now = Date.now();
  await tx
    .table("tasks")
    .toCollection()
    .modify((task: TaskRecord) => {
      const next = m.migrateTask(task, now);
      // Replace in place: drop keys the transform removed (e.g. `due`), then assign the rest.
      for (const key of Object.keys(task)) {
        if (!(key in next)) delete task[key];
      }
      Object.assign(task, next);
    });
}

/** Register the base schema and every migration onto a Dexie instance. */
export function registerSchema(dexie: Dexie): void {
  dexie.version(1).stores({ tasks: TASKS_STORES, meta: "key" });
  for (const m of MIGRATIONS) {
    dexie
      .version(m.version)
      .stores({ tasks: m.stores, meta: "key" })
      .upgrade((tx) => applyMigration(tx, m));
  }
}
