import { ACCENT } from "../theme";
import type { Task } from "../types";
import { waiting } from "../utils";

interface TaskCardProps {
  task: Task;
  compact: boolean;
  dragging: boolean;
  dropTarget: boolean;
  onToggle: () => void;
  onDelete: () => void;
  onStartEdit: () => void;
  onDragStart: (e: React.DragEvent) => void;
  onDragEnd: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
}

export function TaskCard({
  task,
  compact,
  dragging,
  dropTarget,
  onToggle,
  onDelete,
  onStartEdit,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
}: TaskCardProps) {
  const wait = waiting(task.createdAt);
  const tPad = compact ? "7px 9px" : "9px 11px";
  const tFont = compact ? "13px" : "14px";

  const waitChipStyle: React.CSSProperties = {
    font: "700 9.5px ui-monospace,monospace",
    color: "#8a857c",
    background: "#f1ede4",
    padding: "3px 7px",
    borderRadius: 6,
    whiteSpace: "nowrap",
    letterSpacing: ".02em",
  };

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDrop={onDrop}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: tPad,
        border: "1px solid #e8e2d5",
        borderRadius: 10,
        background: "#fff",
        cursor: "grab",
        transition: "opacity .2s,box-shadow .2s,transform .2s",
        opacity: dragging ? 0.4 : 1,
        boxShadow: dragging
          ? "0 10px 24px rgba(42,40,37,.16)"
          : dropTarget
            ? `inset 0 2px 0 ${ACCENT}`
            : "none",
        transform: dragging ? "scale(1.02)" : "none",
      }}
    >
      <button
        className="q-checkbox"
        onClick={onToggle}
        title="Complete"
        style={{
          width: 18,
          height: 18,
          flex: "none",
          border: "1.6px solid #c2bcae",
          borderRadius: 6,
          background: "#fff",
          cursor: "pointer",
          padding: 0,
          transition: ".15s",
        }}
      />
      <span
        style={{
          flex: 1,
          minWidth: 0,
          font: `500 ${tFont}/1.25 'Hanken Grotesk',sans-serif`,
          color: "#2a2825",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {task.title}
      </span>
      {wait && <span style={waitChipStyle}>{wait}</span>}
      <span style={{ display: "flex", gap: 1, flex: "none" }}>
        <button
          className="q-edit"
          onClick={onStartEdit}
          title="Edit"
          style={{
            font: "600 12px ui-monospace,monospace",
            color: "#cbc5b8",
            background: "transparent",
            border: 0,
            cursor: "pointer",
            padding: "3px 5px",
            borderRadius: 6,
            transition: ".15s",
          }}
        >
          ✎
        </button>
        <button
          className="q-del"
          onClick={onDelete}
          title="Delete"
          style={{
            font: "600 12px ui-monospace,monospace",
            color: "#cbc5b8",
            background: "transparent",
            border: 0,
            cursor: "pointer",
            padding: "3px 5px",
            borderRadius: 6,
            transition: ".15s",
          }}
        >
          ✕
        </button>
      </span>
    </div>
  );
}
