import { useEffect, useRef, useState } from "react";
import { ACCENT, ACCENT_SOFT } from "../theme";

interface ComposerProps {
  initialTitle?: string;
  initialDue?: string;
  placeholder?: string;
  submitLabel: string;
  selectOnFocus?: boolean;
  /**
   * Add mode: after a successful submit, clear the fields and stay open for
   * rapid entry; an empty submit cancels. (Matches the prototype's saveAdd.)
   */
  resetAfterSubmit?: boolean;
  onSubmit: (title: string, due: string | null) => void;
  onCancel: () => void;
}

const composerStyle: React.CSSProperties = {
  marginTop: 8,
  border: `1.6px solid ${ACCENT}`,
  borderRadius: 11,
  padding: 10,
  background: "#fff",
  boxShadow: `0 8px 22px ${ACCENT_SOFT}`,
};

export function Composer({
  initialTitle = "",
  initialDue = "",
  placeholder,
  submitLabel,
  selectOnFocus = false,
  resetAfterSubmit = false,
  onSubmit,
  onCancel,
}: ComposerProps) {
  const [title, setTitle] = useState(initialTitle);
  const [due, setDue] = useState(initialDue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.focus();
    if (selectOnFocus) {
      try {
        el.select();
      } catch {
        /* noop */
      }
    }
  }, [selectOnFocus]);

  const submit = () => {
    if (resetAfterSubmit) {
      if (!title.trim()) {
        onCancel();
        return;
      }
      onSubmit(title, due || null);
      setTitle("");
      setDue("");
      inputRef.current?.focus();
    } else {
      onSubmit(title, due || null);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submit();
    } else if (e.key === "Escape") {
      e.preventDefault();
      onCancel();
    }
  };

  return (
    <div style={composerStyle}>
      <input
        ref={inputRef}
        value={title}
        placeholder={placeholder}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={onKeyDown}
        style={{
          width: "100%",
          border: 0,
          outline: 0,
          font: "500 14px 'Hanken Grotesk',sans-serif",
          color: "#2a2825",
          background: "transparent",
          padding: "2px 0 8px",
          borderBottom: "1px solid #efe9dc",
        }}
      />
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 9 }}>
        <input
          type="date"
          value={due}
          onChange={(e) => setDue(e.target.value)}
          style={{
            font: "600 11px ui-monospace,monospace",
            color: "#8a857c",
            border: "1px solid #e3ddd0",
            borderRadius: 7,
            padding: "4px 7px",
            background: "#fff",
          }}
        />
        <button
          onClick={onCancel}
          style={{
            marginLeft: "auto",
            font: "600 11px 'Hanken Grotesk'",
            color: "#9a948a",
            background: "transparent",
            border: 0,
            cursor: "pointer",
            padding: "6px 8px",
          }}
        >
          Cancel
        </button>
        <button
          onClick={submit}
          style={{
            font: "700 11px 'Hanken Grotesk'",
            color: "#fff",
            background: "#2a2825",
            border: 0,
            borderRadius: 8,
            padding: "6px 15px",
            cursor: "pointer",
          }}
        >
          {submitLabel}
        </button>
      </div>
    </div>
  );
}
