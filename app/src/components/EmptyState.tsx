interface EmptyStateProps {
  onAddFirst: () => void;
}

const cell = (border: string): React.CSSProperties => ({
  border,
  borderRadius: 8,
});

export function EmptyState({ onAddFirst }: EmptyStateProps) {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        gap: 15,
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridTemplateRows: "1fr 1fr",
          gap: 6,
          width: 90,
          height: 90,
          opacity: 0.55,
        }}
      >
        <div style={cell("2px solid #2a2825")} />
        <div style={cell("1.5px solid #b8b2a6")} />
        <div style={cell("1.5px solid #d6d0c2")} />
        <div style={cell("1.5px dashed #ddd7ca")} />
      </div>
      <div
        style={{
          font: "500 italic 27px/1.2 'Newsreader',serif",
          color: "#2a2825",
          maxWidth: 380,
        }}
      >
        Sort what matters from what merely shouts.
      </div>
      <div
        style={{
          font: "500 13px/1.55 'Hanken Grotesk'",
          color: "#8a857c",
          maxWidth: 340,
        }}
      >
        Add a task and place it by how urgent and how important it really is. We’ll
        start you in Do First.
      </div>
      <button
        onClick={onAddFirst}
        style={{
          font: "700 13px 'Hanken Grotesk'",
          color: "#fff",
          background: "#2a2825",
          border: 0,
          borderRadius: 12,
          padding: "12px 22px",
          cursor: "pointer",
        }}
      >
        ＋ Add your first task
      </button>
    </div>
  );
}
