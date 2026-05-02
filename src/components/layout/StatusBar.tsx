import { Dot } from "@/components/ui/atoms";
import { useEditorStore } from "@/store/editorStore";

interface StatusBarProps {
  statusMeta: string;
}

export default function StatusBar({ statusMeta }: StatusBarProps) {
  const cursor = useEditorStore((s) => s.cursor);
  return (
    <div
      style={{
        height: 24,
        padding: "0 14px",
        borderTop: "1px solid var(--m-line-soft)",
        display: "flex",
        alignItems: "center",
        gap: 14,
        fontFamily: "var(--m-mono)",
        fontSize: 10.5,
        color: "var(--m-text-4)",
        background: "var(--m-bg)",
        flexShrink: 0,
      }}
    >
      <span>{statusMeta}</span>
      <span
        style={{
          marginLeft: "auto",
          display: "inline-flex",
          gap: 14,
          alignItems: "center",
        }}
      >
        <span>md</span>
        <span>UTF-8</span>
        <span>{cursor ? `Ln ${cursor.line}, Col ${cursor.col}` : "Ln –, Col –"}</span>
        <span
          style={{ display: "inline-flex", alignItems: "center", gap: 5 }}
        >
          <Dot color="var(--m-ai)" pulse /> indexed
        </span>
      </span>
    </div>
  );
}
