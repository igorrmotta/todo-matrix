import { useState } from "react";
import { COMPACT, QUAD_META } from "../theme";
import type { QuadKey, Task } from "../types";
import { QuadrantCard } from "./QuadrantCard";

interface MatrixProps {
  tasks: Task[];
  focus: boolean;
  activeQuad: QuadKey | null;
  /** Compose/edit state is lifted to App so the empty-state button can open it. */
  composeQuad: QuadKey | null;
  editId: number | null;
  onOpenAdd: (q: QuadKey) => void;
  onCancelAdd: () => void;
  onStartEdit: (id: number) => void;
  onCancelEdit: () => void;
  addTask: (title: string, due: string | null, quad: QuadKey) => void;
  editTask: (id: number, title: string, due: string | null) => void;
  deleteTask: (id: number) => void;
  toggleDone: (id: number) => void;
  moveTask: (id: number, quad: QuadKey) => void;
}

const axisLabelStyle: React.CSSProperties = {
  font: "700 9px ui-monospace,monospace",
  color: "#a8a296",
  letterSpacing: ".14em",
  textTransform: "uppercase",
  alignSelf: "center",
};

const vAxisLabelStyle: React.CSSProperties = {
  ...axisLabelStyle,
  writingMode: "vertical-rl",
  transform: "rotate(180deg)",
  justifySelf: "center",
};

export function Matrix({
  tasks,
  focus,
  activeQuad,
  composeQuad,
  editId,
  onOpenAdd,
  onCancelAdd,
  onStartEdit,
  onCancelEdit,
  addTask,
  editTask,
  deleteTask,
  toggleDone,
  moveTask,
}: MatrixProps) {
  const [dragId, setDragId] = useState<number | null>(null);
  const [dragOverQuad, setDragOverQuad] = useState<QuadKey | null>(null);

  const onTaskDragStart = (id: number, e: React.DragEvent) => {
    try {
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", String(id));
    } catch {
      /* noop */
    }
    setDragId(id);
  };
  const onTaskDragEnd = () => {
    setDragId(null);
    setDragOverQuad(null);
  };
  const onDragOver = (q: QuadKey, e: React.DragEvent) => {
    e.preventDefault();
    if (dragOverQuad !== q) setDragOverQuad(q);
  };
  const onDrop = (q: QuadKey, e: React.DragEvent) => {
    e.preventDefault();
    if (dragId != null) moveTask(dragId, q);
    setDragId(null);
    setDragOverQuad(null);
  };

  return (
    <div
      style={{
        flex: 1,
        minHeight: 0,
        display: "grid",
        gridTemplateColumns: "20px 1fr 1fr",
        gridTemplateRows: "16px 1fr 1fr",
        gap: 14,
      }}
    >
      <div style={{ gridColumn: 1, gridRow: 1 }} />
      <div style={{ ...axisLabelStyle, gridColumn: 2, gridRow: 1 }}>Urgent</div>
      <div style={{ ...axisLabelStyle, gridColumn: 3, gridRow: 1 }}>Not urgent</div>
      <div style={{ ...vAxisLabelStyle, gridColumn: 1, gridRow: 2 }}>Important</div>
      <div style={{ ...vAxisLabelStyle, gridColumn: 1, gridRow: 3 }}>Not important</div>

      {QUAD_META.map((m) => {
        const inQuad = tasks.filter((t) => t.quad === m.key);
        const incomplete = inQuad.filter((t) => !t.done);
        const dimmed = focus && activeQuad != null && activeQuad !== m.key;
        const isActive = focus && activeQuad === m.key;
        return (
          <QuadrantCard
            key={m.key}
            meta={m}
            tasks={incomplete}
            total={inQuad.length}
            compact={COMPACT}
            dimmed={dimmed}
            isActive={isActive}
            dragOver={dragOverQuad === m.key}
            composing={composeQuad === m.key && editId == null}
            editId={editId}
            draggingId={dragId}
            onOpenAdd={() => onOpenAdd(m.key)}
            onAddSubmit={(title, due) => addTask(title, due, m.key)}
            onAddCancel={onCancelAdd}
            onStartEdit={onStartEdit}
            onEditSubmit={(id, title, due) => {
              editTask(id, title, due);
              onCancelEdit();
            }}
            onEditCancel={onCancelEdit}
            onToggleDone={toggleDone}
            onDelete={deleteTask}
            onTaskDragStart={onTaskDragStart}
            onTaskDragEnd={onTaskDragEnd}
            onDragOver={(e) => onDragOver(m.key, e)}
            onDrop={(e) => onDrop(m.key, e)}
          />
        );
      })}
    </div>
  );
}
