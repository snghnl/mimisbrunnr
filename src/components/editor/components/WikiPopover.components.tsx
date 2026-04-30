import { Dot, Kbd } from "@/components/ui/atoms";

const SERIF = "var(--m-serif)";

const WIKI_MATCHES = [
  { name: "Bret Victor — thinking tools", folder: "Reading" },
  { name: "Brett — quick contact note", folder: "Daily" },
  { name: "Brain dump — April", folder: "Daily" },
];

export default function WikiPopover() {
  return (
    <div
      className="m-slide-in"
      onClick={(e) => e.stopPropagation()}
      style={{
        position: "absolute",
        top: "100%",
        left: 0,
        marginTop: 6,
        width: 320,
        background: "var(--m-bg-3)",
        border: "1px solid var(--m-line)",
        borderRadius: 6,
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
          display: "flex",
          alignItems: "center",
        }}
      >
        <span>Link to note · matches "brett"</span>
        <span style={{ marginLeft: "auto" }}>
          <Kbd>↑↓</Kbd> <Kbd>↵</Kbd>
        </span>
      </div>
      {WIKI_MATCHES.map((m, i) => (
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
            borderBottom:
              i < WIKI_MATCHES.length - 1
                ? "1px solid var(--m-line-soft)"
                : "none",
          }}
        >
          <span style={{ color: "var(--m-text-4)" }}>
            <svg
              width={11}
              height={11}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9Z" />
              <path d="M14 3v6h6" />
            </svg>
          </span>
          <span style={{ flex: 1, fontFamily: SERIF, fontSize: 13 }}>
            {m.name}
          </span>
          <span
            style={{
              fontFamily: "var(--m-mono)",
              fontSize: 10,
              color: "var(--m-text-4)",
            }}
          >
            {m.folder}
          </span>
        </div>
      ))}
      <div
        style={{
          padding: "8px 12px",
          fontSize: 11.5,
          color: "var(--m-ai)",
          display: "flex",
          alignItems: "center",
          gap: 8,
          borderTop: "1px solid var(--m-line-soft)",
          cursor: "pointer",
        }}
      >
        <Dot color="var(--m-ai)" size={5} pulse />
        <span
          style={{
            fontFamily: "var(--m-mono)",
            fontSize: 10,
            textTransform: "uppercase",
            letterSpacing: 0.5,
          }}
        >
          AI
        </span>
        <span>Create new "Brett — thinking tools" linked to 4 notes</span>
      </div>
    </div>
  );
}
