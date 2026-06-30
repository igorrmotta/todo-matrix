import { useCallback, useEffect, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db, getMeta, setMeta } from "./db";
import { QUAD_ORDER } from "./theme";
import type { QuadKey, Task } from "./types";

export interface QuadrantApi {
  tasks: Task[] | undefined;
  loaded: boolean;
  focus: boolean;
  doneOpen: boolean;
  toggleFocus: () => void;
  toggleDonePanel: () => void;
  /** First non-empty quadrant in priority order while focused, else null. */
  activeQuad: QuadKey | null;
  addTask: (title: string, quad: QuadKey) => Promise<void>;
  editTask: (id: number, title: string) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  toggleDone: (id: number) => Promise<void>;
  reorderTask: (id: number, quad: QuadKey, beforeId: number | null) => Promise<void>;
  clearDone: () => Promise<void>;
}

export function useQuadrant(): QuadrantApi {
  const tasks = useLiveQuery(() => db.tasks.toArray(), []);
  const [focus, setFocus] = useState(false);
  const [doneOpen, setDoneOpen] = useState(true);
  const [ready, setReady] = useState(false);

  // Load persisted UI prefs.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [f, d] = await Promise.all([
        getMeta("focus", false),
        getMeta("doneOpen", true),
      ]);
      if (cancelled) return;
      setFocus(f);
      setDoneOpen(d);
      setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const toggleFocus = useCallback(() => {
    setFocus((prev) => {
      const next = !prev;
      void setMeta("focus", next);
      return next;
    });
  }, []);

  const toggleDonePanel = useCallback(() => {
    setDoneOpen((prev) => {
      const next = !prev;
      void setMeta("doneOpen", next);
      return next;
    });
  }, []);

  const addTask = useCallback(async (title: string, quad: QuadKey) => {
    const trimmed = title.trim();
    if (!trimmed) return;
    const now = Date.now();
    await db.tasks.add({
      title: trimmed,
      quad,
      done: false,
      order: now,
      createdAt: now,
    });
  }, []);

  const editTask = useCallback(async (id: number, title: string) => {
    const trimmed = title.trim();
    if (!trimmed) return;
    await db.tasks.update(id, { title: trimmed });
  }, []);

  const deleteTask = useCallback(async (id: number) => {
    await db.tasks.delete(id);
  }, []);

  const toggleDone = useCallback(async (id: number) => {
    const t = await db.tasks.get(id);
    if (!t) return;
    const done = !t.done;
    await db.tasks.update(id, { done, doneAt: done ? Date.now() : t.doneAt });
  }, []);

  // Move/reorder a task: insert it before `beforeId` within `quad`, or append
  // when `beforeId` is null. Rewrites sequential order across that quadrant's
  // incomplete tasks so position survives reloads.
  const reorderTask = useCallback(
    async (id: number, quad: QuadKey, beforeId: number | null) => {
      await db.transaction("rw", db.tasks, async () => {
        const all = await db.tasks.toArray();
        const dragged = all.find((t) => t.id === id);
        if (!dragged) return;
        const list = all
          .filter((t) => t.quad === quad && !t.done && t.id !== id)
          .sort((a, b) => (a.order ?? a.id ?? 0) - (b.order ?? b.id ?? 0));
        const at = beforeId == null ? -1 : list.findIndex((t) => t.id === beforeId);
        list.splice(at < 0 ? list.length : at, 0, dragged);
        await Promise.all(
          list.map((t, i) => db.tasks.update(t.id!, { quad, order: i })),
        );
      });
    },
    [],
  );

  const clearDone = useCallback(async () => {
    const all = await db.tasks.toArray();
    const doneIds = all.filter((t) => t.done).map((t) => t.id!);
    if (doneIds.length) await db.tasks.bulkDelete(doneIds);
  }, []);

  // First non-empty quadrant in priority order, only meaningful while focused.
  const activeQuad: QuadKey | null = (() => {
    if (!focus || !tasks) return null;
    for (const q of QUAD_ORDER) {
      if (tasks.some((t) => t.quad === q && !t.done)) return q;
    }
    return null;
  })();

  return {
    tasks,
    loaded: ready && tasks !== undefined,
    focus,
    doneOpen,
    toggleFocus,
    toggleDonePanel,
    activeQuad,
    addTask,
    editTask,
    deleteTask,
    toggleDone,
    reorderTask,
    clearDone,
  };
}
