import { Link2, Sparkles } from "lucide-react";

interface FloatingToolbarProps {
  slashOpen: boolean;
  wikiOpen: boolean;
  onSlashToggle: () => void;
  onWikiToggle: () => void;
}

function floatBtn(active: boolean): React.CSSProperties {
  return {
    padding: "5px 11px",
    fontSize: 11.5,
    background: active ? "var(--m-bg-4)" : "transparent",
    border: "none",
    borderRadius: 5,
    color: active ? "var(--m-text)" : "var(--m-text-2)",
    cursor: "pointer",
    fontFamily: "var(--m-sans)",
  };
}

export default function FloatingToolbar({
  slashOpen,
  wikiOpen,
  onSlashToggle,
  onWikiToggle,
}: FloatingToolbarProps) {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 16,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        gap: 4,
        padding: 4,
        background: "var(--m-bg-3)",
        border: "1px solid var(--m-line-soft)",
        borderRadius: 8,
        boxShadow: "0 6px 24px rgba(0,0,0,0.4)",
      }}
    >
      <button onClick={onSlashToggle} style={floatBtn(slashOpen)}>
        <span style={{ fontFamily: "var(--m-mono)" }}>/</span> commands
      </button>
      <button style={floatBtn(false)}>
        <span
          style={{ display: "inline-flex", alignItems: "center", gap: 5 }}
        >
          <Sparkles size={11} /> ask
        </span>
      </button>
      <button onClick={onWikiToggle} style={floatBtn(wikiOpen)}>
        <span
          style={{ display: "inline-flex", alignItems: "center", gap: 5 }}
        >
          <Link2 size={11} /> link
        </span>
      </button>
    </div>
  );
}
