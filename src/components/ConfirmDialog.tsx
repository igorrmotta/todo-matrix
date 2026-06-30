import { useEffect } from "react";

interface ConfirmDialogProps {
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  message,
  confirmLabel = "Delete",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onCancel();
      } else if (e.key === "Enter") {
        e.preventDefault();
        onConfirm();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onConfirm, onCancel]);

  return (
    <div
      onClick={onCancel}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(42,40,37,.32)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#f6f3ec",
          border: "1px solid #e2dccd",
          borderRadius: 16,
          padding: "20px 22px 16px",
          width: 320,
          maxWidth: "calc(100vw - 40px)",
          boxShadow: "0 24px 60px rgba(42,40,37,.24)",
        }}
      >
        <p
          style={{
            margin: 0,
            font: "500 15px/1.4 'Hanken Grotesk',sans-serif",
            color: "#2a2825",
          }}
        >
          {message}
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginTop: 18,
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={onCancel}
            style={{
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
            onClick={onConfirm}
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
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
