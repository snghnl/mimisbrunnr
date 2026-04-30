// Shared Mimisbrunnr design system atoms

export function Mark({ size = 18, color }: { size?: number; color?: string }) {
  const c = color ?? "var(--m-accent)";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={c}
      strokeWidth="1.4"
      strokeLinecap="round"
    >
      <title>Mimisbrunnr Logo</title>
      <circle cx="12" cy="12" r="9" opacity="0.35" />
      <circle cx="12" cy="12" r="6" opacity="0.65" />
      <circle cx="12" cy="12" r="2.5" />
      <circle cx="12" cy="12" r="0.8" fill={c} />
    </svg>
  );
}

export function Dot({
  color = "var(--m-text-3)",
  size = 6,
  pulse = false,
}: {
  color?: string;
  size?: number;
  pulse?: boolean;
}) {
  return (
    <span
      className={pulse ? "m-pulse" : undefined}
      style={{
        display: "inline-block",
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
        flexShrink: 0,
      }}
    />
  );
}

export function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: 18,
        height: 18,
        padding: "0 5px",
        fontFamily: "var(--m-mono)",
        fontSize: 10.5,
        color: "var(--m-text-3)",
        background: "var(--m-bg-3)",
        border: "1px solid var(--m-line-soft)",
        borderRadius: 3,
      }}
    >
      {children}
    </span>
  );
}

export function MTag({
  name,
  accent = false,
  ai = false,
}: {
  name: string;
  accent?: boolean;
  ai?: boolean;
}) {
  const borderColor = accent
    ? "color-mix(in oklch, var(--m-accent) 35%, transparent)"
    : ai
      ? "color-mix(in oklch, var(--m-ai) 35%, transparent)"
      : "var(--m-line-soft)";
  const textColor = accent
    ? "var(--m-accent)"
    : ai
      ? "var(--m-ai)"
      : "var(--m-text-3)";
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 3,
        padding: "2px 7px",
        fontFamily: "var(--m-mono)",
        fontSize: 10.5,
        letterSpacing: 0.2,
        color: textColor,
        background: "transparent",
        border: `1px solid ${borderColor}`,
        borderRadius: 3,
      }}
    >
      <span style={{ opacity: 0.65, marginLeft: -2 }}>#</span>
      {name}
    </span>
  );
}

export function AIStatusPill({
  state = "idle",
  text,
}: {
  state?: "idle" | "thinking" | "found" | "await";
  text?: string;
}) {
  const configs = {
    idle: { color: "var(--m-text-4)", label: text ?? "idle", pulse: false },
    thinking: {
      color: "var(--m-ai)",
      label: text ?? "2 agents working",
      pulse: true,
    },
    found: { color: "var(--m-ai)", label: text ?? "found", pulse: false },
    await: {
      color: "var(--m-accent)",
      label: text ?? "awaiting input",
      pulse: false,
    },
  };
  const cfg = configs[state];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "4px 9px",
        fontSize: 11,
        color: "var(--m-text-2)",
        background: "transparent",
        border: "1px solid var(--m-line-soft)",
        borderRadius: 999,
      }}
    >
      <Dot color={cfg.color} pulse={cfg.pulse} />
      {cfg.label}
    </span>
  );
}
