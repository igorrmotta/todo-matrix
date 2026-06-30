import { describe, it, expect } from "vitest";
import { migrateTaskToV2 } from "./migrations";

const NOW = 1_700_000_000_000;

describe("migrateTaskToV2", () => {
  it("drops the due field", () => {
    const out = migrateTaskToV2(
      { id: 1, title: "x", due: "2026-01-01", quad: "do", done: false },
      NOW,
    );
    expect("due" in out).toBe(false);
  });

  it("adds createdAt = now when missing on an incomplete task", () => {
    const out = migrateTaskToV2(
      { id: 1, title: "x", due: null, quad: "do", done: false },
      NOW,
    );
    expect(out.createdAt).toBe(NOW);
  });

  it("backfills createdAt from doneAt for a completed task", () => {
    const out = migrateTaskToV2(
      { id: 1, title: "x", quad: "do", done: true, doneAt: 123 },
      NOW,
    );
    expect(out.createdAt).toBe(123);
  });

  it("preserves an existing createdAt", () => {
    const out = migrateTaskToV2(
      { id: 1, title: "x", quad: "do", done: false, createdAt: 999 },
      NOW,
    );
    expect(out.createdAt).toBe(999);
  });

  it("leaves other fields intact", () => {
    const out = migrateTaskToV2(
      { id: 1, title: "x", quad: "sch", done: false, order: 5 },
      NOW,
    );
    expect(out).toMatchObject({ id: 1, title: "x", quad: "sch", done: false, order: 5 });
  });
});
