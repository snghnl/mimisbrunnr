const TAGS = [
  { name: "ai", count: 24 },
  { name: "pkm", count: 18 },
  { name: "design", count: 12 },
  { name: "project", count: 9 },
  { name: "idea", count: 7 },
  { name: "daily", count: 31 },
];

export default function Tags() {
  return (
    <>
      <div
        style={{
          padding: "14px 9px 4px",
          fontSize: 10.5,
          fontFamily: "var(--m-mono)",
          color: "var(--m-text-4)",
          letterSpacing: 0.6,
          textTransform: "uppercase",
        }}
      >
        Tags
      </div>
      <div
        style={{
          padding: "0 12px 12px",
          display: "flex",
          flexWrap: "wrap",
          gap: 4,
        }}
      >
        {TAGS.map((t) => (
          <span
            key={t.name}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 3,
              padding: "3px 7px",
              fontSize: 11,
              fontFamily: "var(--m-mono)",
              color: "var(--m-text-2)",
              background: "var(--m-bg-2)",
              border: "1px solid var(--m-line-soft)",
              borderRadius: 3,
              cursor: "pointer",
            }}
          >
            <span style={{ color: "var(--m-text-4)" }}>#</span>
            {t.name}
            <span style={{ color: "var(--m-text-4)", marginLeft: 2 }}>
              {t.count}
            </span>
          </span>
        ))}
      </div>
    </>
  );
}
