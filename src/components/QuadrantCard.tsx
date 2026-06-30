import { ACCENT, ACCENT_SOFT, DIM_LEVEL, type QuadMeta } from "../theme";
import type { Task } from "../types";
import { Composer } from "./Composer";
import { TaskCard } from "./TaskCard";

interface QuadrantCardProps {
  meta: QuadMeta;
  /** Incomplete tasks shown in the quadrant. */
  tasks: Task[];
  /** Total tasks ever in this quadrant (incl. completed) — drives progress. */
  total: number;
  compact: boolean;
  dimmed: boolean;
  isActive: boolean;
  dragOver: boolean;
  composing: boolean;
  editId: number | null;
  draggingId: number | null;
  onOpenAdd: () => void;
  onAddSubmit: (title: string, due: string | null) => void;
  onAddCancel: () => void;
  onStartEdit: (id: number) => void;
  onEditSubmit: (id: number, title: string, due: string | null) => void;
  onEditCancel: () => void;
  onToggleDone: (id: number) => void;
  onDelete: (id: number) => void;
  onTaskDragStart: (id: number, e: React.DragEvent) => void;
  onTaskDragEnd: () => void;
  onTaskDragOver: (id: number, e: React.DragEvent) => void;
  onTaskDrop: (id: number, e: React.DragEvent) => void;
  dragOverId: number | null;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
}

const TRANS =
  "opacity .45s cubic-bezier(.4,0,.2,1),transform .45s cubic-bezier(.4,0,.2,1),box-shadow .4s ease,outline-color .2s";

export function QuadrantCard(props: QuadrantCardProps) {
  const {
    meta: m,
    tasks,
    total,
    compact,
    dimmed,
    isActive,
    dragOver,
    composing,
    editId,
    draggingId,
  } = props;

  const cardPad = compact ? "12px 13px 11px" : "16px 16px 13px";
  const incomplete = tasks.length;
  const done = total - incomplete;
  const pct = total ? Math.round((done / total) * 100) : 0;
  const showProgress = (m.key === "do" || isActive) && total > 0;

  // Dynamic state styling — mirrors the prototype's `dyn` branch order.
  let dyn: React.CSSProperties;
  if (dragOver) {
    dyn = {
      opacity: 1,
      transform: "scale(1.008)",
      boxShadow: "none",
      outline: `2px dashed ${ACCENT}`,
      outlineOffset: 4,
    };
  } else if (dimmed) {
    dyn = { opacity: DIM_LEVEL, transform: "scale(.985)", boxShadow: "none" };
  } else if (isActive) {
    dyn = {
      opacity: 1,
      transform: "none",
      boxShadow: `0 0 0 2px ${ACCENT},0 18px 44px ${ACCENT_SOFT}`,
    };
  } else {
    dyn = { opacity: 1, transform: "none", boxShadow: "0 1px 3px rgba(42,40,37,.05)" };
  }

  return (
    <section
      onDragOver={props.onDragOver}
      onDrop={props.onDrop}
      style={{
        gridColumn: m.col,
        gridRow: m.row,
        border: m.border,
        background: m.bg,
        borderRadius: 16,
        padding: cardPad,
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        transition: TRANS,
        ...dyn,
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
        <span style={{ fontSize: 11, lineHeight: 1, color: m.ic }}>{m.icon}</span>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              font: `700 ${compact ? "13px" : "14px"}/1 'Hanken Grotesk',sans-serif`,
              color: m.lc,
            }}
          >
            {m.label}
          </span>
          <span
            style={{
              font: "600 9px/1 ui-monospace,monospace",
              color: m.sc,
              letterSpacing: ".04em",
              textTransform: "uppercase",
              marginTop: 5,
            }}
          >
            {m.sub}
          </span>
        </div>
        <span
          style={{
            marginLeft: "auto",
            font: "700 10px ui-monospace,monospace",
            background: m.cbg,
            color: m.cc,
            padding: "2px 8px",
            borderRadius: 10,
          }}
        >
          {incomplete}
        </span>
      </div>

      {/* Progress bar */}
      {showProgress && (
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginTop: 11 }}>
          <div
            style={{
              flex: 1,
              height: 5,
              borderRadius: 3,
              background: "#ece7dc",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                borderRadius: 3,
                background: ACCENT,
                width: `${pct}%`,
                transition: "width .45s cubic-bezier(.4,0,.2,1)",
              }}
            />
          </div>
          <span
            style={{
              font: "700 9px ui-monospace,monospace",
              color: "#a8a296",
              whiteSpace: "nowrap",
            }}
          >
            {done} of {total} done
          </span>
        </div>
      )}

      {/* Task list */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 8,
          marginTop: 13,
          paddingRight: 2,
        }}
      >
        {tasks.map((t) =>
          editId === t.id ? (
            <Composer
              key={t.id}
              initialTitle={t.title}
              initialDue={t.due ?? ""}
              submitLabel="Save"
              selectOnFocus
              onSubmit={(title, due) => props.onEditSubmit(t.id!, title, due)}
              onCancel={props.onEditCancel}
            />
          ) : (
            <TaskCard
              key={t.id}
              task={t}
              compact={compact}
              dragging={draggingId === t.id}
              dropTarget={props.dragOverId === t.id}
              onToggle={() => props.onToggleDone(t.id!)}
              onDelete={() => props.onDelete(t.id!)}
              onStartEdit={() => props.onStartEdit(t.id!)}
              onDragStart={(e) => props.onTaskDragStart(t.id!, e)}
              onDragEnd={props.onTaskDragEnd}
              onDragOver={(e) => props.onTaskDragOver(t.id!, e)}
              onDrop={(e) => props.onTaskDrop(t.id!, e)}
            />
          ),
        )}
      </div>

      {/* Inline add composer / add-task row */}
      {composing ? (
        <Composer
          placeholder="What needs doing?"
          submitLabel="Add"
          resetAfterSubmit
          onSubmit={props.onAddSubmit}
          onCancel={props.onAddCancel}
        />
      ) : (
        <button
          className="q-add"
          onClick={props.onOpenAdd}
          style={{
            marginTop: 8,
            font: "700 11px 'Hanken Grotesk',sans-serif",
            color: m.sc,
            border: `1.4px dashed ${m.key === "do" ? "#c9b4ab" : "#ddd7ca"}`,
            borderRadius: 9,
            padding: 8,
            textAlign: "center",
            cursor: "pointer",
            background: "transparent",
            width: "100%",
            transition: ".15s",
          }}
        >
          ＋ Add task
        </button>
      )}
    </section>
  );
}
