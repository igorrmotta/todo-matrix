import type { Task } from "../types";
import { ago } from "../utils";

interface DonePanelProps {
  open: boolean;
  /** Completed tasks, already sorted newest-first. */
  doneTasks: Task[];
  onClear: () => void;
  onUndo: (id: number) => void;
}

export function DonePanel({ open, doneTasks, onClear, onUndo }: DonePanelProps) {
  const count = doneTasks.length;
  return (
    <aside
      style={{
        flex: "none",
        overflow: "hidden",
        transition:
          "width .42s cubic-bezier(.4,0,.2,1),opacity .35s ease,margin-left .42s cubic-bezier(.4,0,.2,1)",
        width: open ? 316 : 0,
        opacity: open ? 1 : 0,
        marginLeft: open ? 18 : 0,
      }}
    >
      <div
        style={{
          width: 316,
          height: "100%",
          background: "#f6f3ec",
          border: "1px solid #e2dccd",
          borderRadius: 22,
          padding: 18,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", marginBottom: 14 }}>
          <span style={{ font: "500 italic 18px 'Newsreader',serif", color: "#2a2825" }}>
            Done
          </span>
          <span
            style={{
              font: "700 10px ui-monospace,monospace",
              color: "#a8a296",
              marginLeft: 8,
            }}
          >
            {count}
          </span>
          <button
            className="q-clear"
            onClick={onClear}
            style={{
              marginLeft: "auto",
              font: "600 10px 'Hanken Grotesk'",
              color: "#a8a296",
              background: "transparent",
              border: 0,
              cursor: "pointer",
            }}
          >
            Clear all
          </button>
        </div>

        {count === 0 && (
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              font: "500 12px/1.55 'Hanken Grotesk'",
              color: "#b3ada1",
              padding: 20,
            }}
          >
            Completed tasks land here — checked off from any quadrant, all in one
            shared list.
          </div>
        )}

        <div
          style={{
            flex: 1,
            minHeight: 0,
            overflow: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          {doneTasks.map((d) => (
            <div
              key={d.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "9px 11px",
                border: "1px solid #e8e2d5",
                borderRadius: 10,
                background: "#fff",
              }}
            >
              <span
                style={{
                  width: 18,
                  height: 18,
                  flex: "none",
                  borderRadius: 6,
                  background: "#2a2825",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  font: "700 10px system-ui",
                }}
              >
                ✓
              </span>
              <span
                style={{
                  flex: 1,
                  minWidth: 0,
                  font: "500 13px/1.25 'Hanken Grotesk'",
                  color: "#a8a296",
                  textDecoration: "line-through",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {d.title}
              </span>
              <span
                style={{
                  font: "600 9px ui-monospace,monospace",
                  color: "#c2bcae",
                  whiteSpace: "nowrap",
                }}
              >
                {ago(d.doneAt)}
              </span>
              <button
                className="q-undo"
                onClick={() => onUndo(d.id!)}
                title="Restore"
                style={{
                  font: "600 13px ui-monospace,monospace",
                  color: "#cbc5b8",
                  background: "transparent",
                  border: 0,
                  cursor: "pointer",
                  padding: "2px 4px",
                }}
              >
                ↺
              </button>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
