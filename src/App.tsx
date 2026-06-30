import { useState } from "react";
import { Header } from "./components/Header";
import { Matrix } from "./components/Matrix";
import { DonePanel } from "./components/DonePanel";
import { EmptyState } from "./components/EmptyState";
import { ConfirmDialog } from "./components/ConfirmDialog";
import { ACCENT, quadByKey } from "./theme";
import type { QuadKey } from "./types";
import { useQuadrant } from "./useQuadrant";

export default function App() {
  const q = useQuadrant();
  const [composeQuad, setComposeQuad] = useState<QuadKey | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  const tasks = q.tasks ?? [];
  const doneTasks = tasks
    .filter((t) => t.done)
    .sort((a, b) => (b.doneAt || 0) - (a.doneAt || 0));
  const anyIncomplete = tasks.some((t) => !t.done);

  const focusHint = q.focus
    ? q.activeQuad
      ? "Now: " + quadByKey(q.activeQuad).label
      : "All clear"
    : "Off";

  const showEmpty = q.loaded && tasks.length === 0 && composeQuad == null;
  const showMatrix = q.loaded && (tasks.length > 0 || composeQuad != null);
  const allClear = q.focus && !anyIncomplete && tasks.length > 0;

  const openAdd = (quad: QuadKey) => {
    setComposeQuad(quad);
    setEditId(null);
  };
  const startEdit = (id: number) => {
    setEditId(id);
    setComposeQuad(null);
  };

  return (
    <div
      style={{
        height: "100vh",
        background: "#e8e4da",
        fontFamily: "'Hanken Grotesk',system-ui,sans-serif",
        color: "#2a2825",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Header
        focus={q.focus}
        focusHint={focusHint}
        doneCount={doneTasks.length}
        onToggleFocus={q.toggleFocus}
        onToggleDone={q.toggleDonePanel}
      />

      <div style={{ flex: 1, minHeight: 0, display: "flex", padding: "0 30px 26px" }}>
        <main
          style={{
            flex: 1,
            minWidth: 0,
            background: "#f6f3ec",
            border: "1px solid #e2dccd",
            borderRadius: 22,
            padding: 22,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {allClear && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: "#fff",
                border: "1px solid #e2dccd",
                borderRadius: 13,
                padding: "11px 16px",
                marginBottom: 16,
              }}
            >
              <span style={{ font: "600 italic 17px 'Newsreader',serif", color: ACCENT }}>
                All clear.
              </span>
              <span style={{ font: "500 12px 'Hanken Grotesk'", color: "#8a857c" }}>
                Every quadrant is empty — focus mode handed the full matrix back.
              </span>
            </div>
          )}

          {showEmpty && <EmptyState onAddFirst={() => openAdd("do")} />}

          {showMatrix && (
            <Matrix
              tasks={tasks}
              focus={q.focus}
              activeQuad={q.activeQuad}
              composeQuad={composeQuad}
              editId={editId}
              onOpenAdd={openAdd}
              onCancelAdd={() => setComposeQuad(null)}
              onStartEdit={startEdit}
              onCancelEdit={() => setEditId(null)}
              addTask={q.addTask}
              editTask={q.editTask}
              deleteTask={setPendingDeleteId}
              toggleDone={q.toggleDone}
              reorderTask={q.reorderTask}
            />
          )}
        </main>

        <DonePanel
          open={q.doneOpen}
          doneTasks={doneTasks}
          onClear={q.clearDone}
          onUndo={q.toggleDone}
        />
      </div>

      {pendingDeleteId != null && (
        <ConfirmDialog
          message="Delete this task?"
          onConfirm={() => {
            void q.deleteTask(pendingDeleteId);
            setPendingDeleteId(null);
          }}
          onCancel={() => setPendingDeleteId(null)}
        />
      )}
    </div>
  );
}
