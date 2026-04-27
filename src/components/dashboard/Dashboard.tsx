import { useNavigate } from "@tanstack/react-router";
import { Mark } from "@/components/ui/atoms";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        flex: 1,
        overflowY: "auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 20,
        padding: 48,
      }}
    >
      <Mark size={40} />
      <div style={{ textAlign: "center" }}>
        <h1
          style={{
            fontFamily: "var(--m-serif)",
            fontWeight: 400,
            fontSize: 28,
            color: "var(--m-text)",
            margin: "0 0 8px",
            letterSpacing: -0.3,
          }}
        >
          Welcome to Mimisbrunnr
        </h1>
        <p
          style={{
            color: "var(--m-text-3)",
            fontSize: 13.5,
            margin: 0,
            maxWidth: 400,
          }}
        >
          Your AI-native knowledge base. Select a note from the sidebar or open
          the editor to get started.
        </p>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <button
          onClick={() =>
            navigate({ to: "/editor/$noteId", params: { noteId: "i-comp" } })
          }
          style={{
            padding: "8px 16px",
            fontSize: 12.5,
            background: "var(--m-accent)",
            color: "oklch(0.18 0.01 80)",
            border: "none",
            borderRadius: 5,
            cursor: "pointer",
            fontFamily: "var(--m-sans)",
            fontWeight: 500,
          }}
        >
          Open Editor
        </button>
        <button
          onClick={() => navigate({ to: "/graph" })}
          style={{
            padding: "8px 16px",
            fontSize: 12.5,
            background: "transparent",
            color: "var(--m-text-2)",
            border: "1px solid var(--m-line)",
            borderRadius: 5,
            cursor: "pointer",
            fontFamily: "var(--m-sans)",
          }}
        >
          View Graph
        </button>
      </div>
    </div>
  );
}
