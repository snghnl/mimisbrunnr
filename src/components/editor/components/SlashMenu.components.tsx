import { Kbd } from "@/components/ui/atoms";

const SLASH_ITEMS = [
  { cmd: "/summarize", desc: "Summarize selection" },
  { cmd: "/expand", desc: "Expand idea into a paragraph" },
  { cmd: "/connect", desc: "Suggest related notes" },
  { cmd: "/draft", desc: "Generate draft from outline" },
  { cmd: "/cite", desc: "Find citations in vault" },
];

export default function SlashMenu() {
  return (
    <div
      className="m-slide-in"
      style={{
        position: "absolute",
        bottom: 80,
        left: 56,
        width: 320,
        background: "var(--m-bg-3)",
        border: "1px solid var(--m-line)",
        borderRadius: 7,
        boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
        overflow: "hidden",
        zIndex: 10,
      }}
    >
      <div
        style={{
          padding: "8px 12px",
          fontSize: 10.5,
          fontFamily: "var(--m-mono)",
          color: "var(--m-text-4)",
          letterSpacing: 0.5,
          textTransform: "uppercase",
          borderBottom: "1px solid var(--m-line-soft)",
        }}
      >
        AI commands
      </div>
      {SLASH_ITEMS.map((it, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 12px",
            fontSize: 12,
            background: i === 0 ? "var(--m-bg-4)" : "transparent",
            color: "var(--m-text-2)",
            cursor: "pointer",
          }}
        >
          <span
            style={{
              fontFamily: "var(--m-mono)",
              color: "var(--m-accent)",
              fontSize: 11.5,
            }}
          >
            {it.cmd}
          </span>
          <span style={{ flex: 1, color: "var(--m-text-3)" }}>{it.desc}</span>
          {i === 0 && <Kbd>↵</Kbd>}
        </div>
      ))}
    </div>
  );
}
