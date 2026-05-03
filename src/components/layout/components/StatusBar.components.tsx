import { useState, useEffect } from "react";
import { Dot } from "@/components/ui/atoms";
import { useEditorStore } from "@/store/editorStore";

function timeAgo(date: Date): string {
  const secs = Math.floor((Date.now() - date.getTime()) / 1000);
  if (secs < 10) return "just now";
  if (secs < 60) return `${secs}s ago`;
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  return `${Math.floor(mins / 60)}h ago`;
}

export default function StatusBar() {
  const cursor = useEditorStore((s) => s.cursor);
  const wordCount = useEditorStore((s) => s.wordCount);
  const lastSavedAt = useEditorStore((s) => s.lastSavedAt);

  const [, tick] = useState(0);
  useEffect(() => {
    if (!lastSavedAt) return;
    const id = setInterval(() => tick((n) => n + 1), 30_000);
    return () => clearInterval(id);
  }, [lastSavedAt]);

  const statusMeta = wordCount !== null
    ? `${wordCount.toLocaleString()} words · ~${Math.max(1, Math.ceil(wordCount / 200))} min read${lastSavedAt ? ` · saved ${timeAgo(lastSavedAt)}` : ""}`
    : "";

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
