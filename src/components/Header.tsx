import { ACCENT } from "../theme";
import { todayLabel } from "../utils";

interface HeaderProps {
  focus: boolean;
  focusHint: string;
  doneCount: number;
  onToggleFocus: () => void;
  onToggleDone: () => void;
}

export function Header({
  focus,
  focusHint,
  doneCount,
  onToggleFocus,
  onToggleDone,
}: HeaderProps) {
  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        gap: 18,
        padding: "18px 30px 16px",
        flex: "none",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span style={{ font: "500 italic 27px/1 'Newsreader',serif", color: "#2a2825" }}>
          Quadrant
        </span>
        <span
          style={{
            font: "600 10px/1 ui-monospace,monospace",
            color: "#a8a296",
            letterSpacing: ".06em",
            marginTop: 6,
            textTransform: "uppercase",
          }}
        >
          {todayLabel()}
        </span>
      </div>

      <div style={{ flex: 1 }} />

      <button
        onClick={onToggleFocus}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 11,
          background: "#fbfaf7",
          border: "1px solid #ddd7ca",
          borderRadius: 13,
          padding: "8px 8px 8px 15px",
          cursor: "pointer",
        }}
      >
        <span
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            lineHeight: 1,
          }}
        >
          <span
            style={{
              font: "700 11.5px 'Hanken Grotesk'",
              color: "#2a2825",
              letterSpacing: ".01em",
            }}
          >
            Focus mode
          </span>
          <span
            style={{
              font: "600 9px ui-monospace,monospace",
              color: "#a8a296",
              marginTop: 4,
            }}
          >
            {focusHint}
          </span>
        </span>
        <span
          style={{
            width: 40,
            height: 22,
            borderRadius: 11,
            background: focus ? ACCENT : "#d8d2c6",
            position: "relative",
            display: "inline-block",
            transition: ".25s",
            flex: "none",
          }}
        >
          <span
            style={{
              position: "absolute",
              top: 2,
              left: focus ? 20 : 2,
              width: 18,
              height: 18,
              borderRadius: "50%",
              background: "#fff",
              transition: ".25s cubic-bezier(.4,0,.2,1)",
              boxShadow: "0 1px 3px rgba(0,0,0,.25)",
            }}
          />
        </span>
      </button>

      <button
        onClick={onToggleDone}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 9,
          background: "#2a2825",
          border: 0,
          borderRadius: 13,
          padding: "12px 17px",
          cursor: "pointer",
        }}
      >
        <span style={{ font: "700 12px 'Hanken Grotesk'", color: "#fff" }}>Done</span>
        <span
          style={{
            font: "700 10px ui-monospace,monospace",
            color: "#2a2825",
            background: "#fff",
            borderRadius: 9,
            padding: "1px 7px",
          }}
        >
          {doneCount}
        </span>
      </button>
    </header>
  );
}
