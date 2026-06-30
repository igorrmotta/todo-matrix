import "fake-indexeddb/auto";
import Dexie from "dexie";
import { describe, it, expect } from "vitest";
import { TASKS_STORES, registerSchema } from "./migrations";

const DB_NAME = "migration-test-db";

describe("DB v1 -> v2 upgrade", () => {
  it("drops `due` and backfills `createdAt` on existing tasks", async () => {
    // 1. Open at v1 only, seed legacy-shaped rows (with `due`, no `createdAt`).
    const v1 = new Dexie(DB_NAME);
    v1.version(1).stores({ tasks: TASKS_STORES, meta: "key" });
    await v1.open();
    await v1.table("tasks").bulkAdd([
      { id: 1, title: "incomplete", due: "2026-01-01", quad: "do", done: false },
      { id: 2, title: "completed", due: "2026-01-01", quad: "sch", done: true, doneAt: 123 },
    ]);
    v1.close();

    // 2. Reopen with the full schema (v1 + migrations) — triggers the v2 upgrade.
    const migrated = new Dexie(DB_NAME);
    registerSchema(migrated);
    await migrated.open();
    const rows = await migrated.table("tasks").orderBy("id").toArray();
    migrated.close();

    expect(rows.every((r) => !("due" in r))).toBe(true);
    expect(typeof rows[0].createdAt).toBe("number");
    expect(rows[1].createdAt).toBe(123); // completed task backfills from doneAt
  });
});
