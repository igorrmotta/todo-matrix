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
  addTask: (title: string, quad: QuadKey) => void;
  editTask: (id: number, title: string) => void;
  deleteTask: (id: number) => void;
  toggleDone: (id: number) => void;
  reorderTask: (id: number, quad: QuadKey, beforeId: number | null) => void;
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
  reorderTask,
}: MatrixProps) {
  const [dragId, setDragId] = useState<number | null>(null);
  const [dragOverQuad, setDragOverQuad] = useState<QuadKey | null>(null);
  const [dragOverId, setDragOverId] = useState<number | null>(null);

  const resetDrag = () => {
    setDragId(null);
    setDragOverQuad(null);
    setDragOverId(null);
  };

  const onTaskDragStart = (id: number, e: React.DragEvent) => {
    try {
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", String(id));
    } catch {
      /* noop */
    }
    setDragId(id);
  };
  const onTaskDragEnd = resetDrag;

  // Hovering empty quadrant space = append target (no specific task highlighted).
  const onDragOver = (q: QuadKey, e: React.DragEvent) => {
    e.preventDefault();
    if (dragOverQuad !== q) setDragOverQuad(q);
    if (dragOverId !== null) setDragOverId(null);
  };
  const onDrop = (q: QuadKey, e: React.DragEvent) => {
    e.preventDefault();
    if (dragId != null) reorderTask(dragId, q, null);
    resetDrag();
  };

  // Hovering a task = insert-before target. stopPropagation so the quadrant
  // container handlers don't also fire (which would clear the indicator / append).
  const onTaskDragOver = (id: number, q: QuadKey, e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (dragOverId !== id) setDragOverId(id);
    if (dragOverQuad !== q) setDragOverQuad(q);
  };
  const onTaskDrop = (id: number, q: QuadKey, e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (dragId != null && dragId !== id) reorderTask(dragId, q, id);
    resetDrag();
  };

  return (
    <div
      style={{
        flex: 1,
        minHeight: 0,
        display: "grid",
        gridTemplateColumns: "20px minmax(0, 1fr) minmax(0, 1fr)",
        gridTemplateRows: "16px minmax(0, 1fr) minmax(0, 1fr)",
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
        const incomplete = inQuad
          .filter((t) => !t.done)
          .sort((a, b) => (a.order ?? a.id ?? 0) - (b.order ?? b.id ?? 0));
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
            onAddSubmit={(title) => addTask(title, m.key)}
            onAddCancel={onCancelAdd}
            onStartEdit={onStartEdit}
            onEditSubmit={(id, title) => {
              editTask(id, title);
              onCancelEdit();
            }}
            onEditCancel={onCancelEdit}
            onToggleDone={toggleDone}
            onDelete={deleteTask}
            onTaskDragStart={onTaskDragStart}
            onTaskDragEnd={onTaskDragEnd}
            onTaskDragOver={(id, e) => onTaskDragOver(id, m.key, e)}
            onTaskDrop={(id, e) => onTaskDrop(id, m.key, e)}
            dragOverId={dragOverId}
            onDragOver={(e) => onDragOver(m.key, e)}
            onDrop={(e) => onDrop(m.key, e)}
          />
        );
      })}
    </div>
  );
}
