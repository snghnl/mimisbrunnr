import { useEffect, useRef, useState } from "react";
import { Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useUIStore } from "@/store/uiStore";
import { Mark, AIStatusPill, Dot, Kbd } from "@/components/ui/atoms";
import AppSidebar from "@/components/sidebar/Sidebar";
import AgentPanel from "@/components/agent/AgentPanel";

// Inline panel toggle icon
const IconPanel = ({ size = 14 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <path d="M14 4v16" />
  </svg>
);

const IconSearch = ({ size = 14 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);

// Simplified command palette
interface CmdItem {
  kind: "cmd" | "note" | "tag";
  label: string;
  hint?: string;
  kbd?: string;
  ai?: boolean;
  action?: () => void;
}

function CommandPalette({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const all: CmdItem[] = [
    {
      kind: "cmd",
      label: "New note",
      hint: "Create blank note",
      action: () => {
        navigate({ to: "/editor/$noteId", params: { noteId: "i-comp" } });
        onClose();
      },
    },
    {
      kind: "cmd",
      label: "Open Dashboard",
      hint: "Today's digest",
      kbd: "⌘D",
      action: () => {
        navigate({ to: "/" });
        onClose();
      },
    },
    {
      kind: "cmd",
      label: "Open Editor",
      hint: "Last note",
      kbd: "⌘E",
      action: () => {
        navigate({ to: "/editor/$noteId", params: { noteId: "i-comp" } });
        onClose();
      },
    },
    {
      kind: "cmd",
      label: "Open Graph",
      hint: "Knowledge map",
      kbd: "⌘G",
      action: () => {
        navigate({ to: "/graph" });
        onClose();
      },
    },
    { kind: "cmd", label: "Toggle agent panel", hint: "", ai: true },
    { kind: "cmd", label: "Absorb URL…", hint: "Paste & summarize", ai: true },
    {
      kind: "note",
      label: "On compression of thought",
      hint: "ideas/ · 2m ago",
    },
    { kind: "note", label: "Bret Victor — thinking tools", hint: "Reading/" },
    { kind: "note", label: "Absorption pipeline spec", hint: "Projects/" },
    { kind: "tag", label: "#pkm", hint: "18 notes" },
    { kind: "tag", label: "#ai", hint: "24 notes" },
  ];

  const filtered = q
    ? all.filter((x) => x.label.toLowerCase().includes(q.toLowerCase()))
    : all;

  const groups = [
    { kind: "cmd" as const, label: "Actions" },
    { kind: "note" as const, label: "Notes" },
    { kind: "tag" as const, label: "Tags" },
  ];

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSel((s) => Math.min(s + 1, filtered.length - 1));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setSel((s) => Math.max(s - 1, 0));
    }
    if (e.key === "Enter") {
      e.preventDefault();
      const item = filtered[sel];
      item?.action?.();
      onClose();
    }
  };

  let runningIdx = -1;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        background: "color-mix(in oklch, oklch(0.05 0 0) 55%, transparent)",
        backdropFilter: "blur(4px)",
        display: "flex",
        justifyContent: "center",
        paddingTop: 120,
      }}
    >
      <div
        className="m-slide-in"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 580,
          maxHeight: 480,
          background: "var(--m-bg-3)",
          border: "1px solid var(--m-line)",
          borderRadius: 8,
          boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Search input */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "12px 16px",
            borderBottom: "1px solid var(--m-line-soft)",
          }}
        >
          <span style={{ color: "var(--m-text-3)" }}>
            <IconSearch size={14} />
          </span>
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setSel(0);
            }}
            onKeyDown={onKey}
            placeholder="Search notes, run commands, ask the agent…"
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              fontSize: 14,
              color: "var(--m-text)",
              fontFamily: "var(--m-sans)",
            }}
          />
          <Kbd>esc</Kbd>
        </div>

        {/* Results */}
        <div className="m-scroll" style={{ overflowY: "auto", flex: 1 }}>
          {groups.map((g) => {
            const items = filtered.filter((f) => f.kind === g.kind);
            if (items.length === 0) return null;
            return (
              <div key={g.kind}>
                <div
                  style={{
                    padding: "8px 16px 4px",
                    fontSize: 10,
                    fontFamily: "var(--m-mono)",
                    color: "var(--m-text-4)",
                    letterSpacing: 0.6,
                    textTransform: "uppercase",
                  }}
                >
                  {g.label}
                </div>
                {items.map((item) => {
                  runningIdx += 1;
                  const idx = runningIdx;
                  const active = idx === sel;
                  return (
                    <div
                      key={idx}
                      onMouseEnter={() => setSel(idx)}
                      onClick={() => {
                        item.action?.();
                        onClose();
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 11,
                        padding: "8px 16px",
                        fontSize: 13,
                        background: active ? "var(--m-bg-4)" : "transparent",
                        color: active ? "var(--m-text)" : "var(--m-text-2)",
                        cursor: "pointer",
                        borderLeft: active
                          ? "2px solid var(--m-accent)"
                          : "2px solid transparent",
                      }}
                    >
                      <span
                        style={{
                          flex: 1,
                          fontFamily:
                            g.kind === "note"
                              ? "var(--m-serif)"
                              : "var(--m-sans)",
                          fontSize: g.kind === "note" ? 13.5 : 13,
                        }}
                      >
                        {item.label}
                      </span>
                      {item.hint && (
                        <span
                          style={{
                            fontSize: 11,
                            color: "var(--m-text-4)",
                            fontFamily: "var(--m-mono)",
                          }}
                        >
                          {item.hint}
                        </span>
                      )}
                      {item.kbd && <Kbd>{item.kbd}</Kbd>}
                    </div>
                  );
                })}
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div
              style={{
                padding: 28,
                textAlign: "center",
                color: "var(--m-text-4)",
                fontSize: 12.5,
              }}
            >
              No matches.{" "}
              <span style={{ color: "var(--m-ai)", cursor: "pointer" }}>
                Ask the agent →
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "8px 16px",
            borderTop: "1px solid var(--m-line-soft)",
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 10.5,
            color: "var(--m-text-4)",
            fontFamily: "var(--m-mono)",
          }}
        >
          <span
            style={{ display: "inline-flex", alignItems: "center", gap: 5 }}
          >
            <Kbd>↑↓</Kbd> navigate
          </span>
          <span
            style={{ display: "inline-flex", alignItems: "center", gap: 5 }}
          >
            <Kbd>↵</Kbd> open
          </span>
          <span
            style={{
              marginLeft: "auto",
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            <Dot color="var(--m-ai)" pulse size={4} /> indexed locally
          </span>
        </div>
      </div>
    </div>
  );
}

export default function AppShell() {
  const {
    aiPanelOpen,
    setAiPanelOpen,
    commandPaletteOpen,
    setCommandPaletteOpen,
  } = useUIStore();
  const { location } = useRouterState();

  // Cmd+K listener
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
      if (e.key === "Escape") {
        setCommandPaletteOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setCommandPaletteOpen]);

  const isEditorView = location.pathname.startsWith("/editor");
  const statusMeta = isEditorView
    ? "1,247 words · ~6 min read · saved 2m ago"
    : "";

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "var(--m-bg)",
        color: "var(--m-text)",
        display: "flex",
        overflow: "hidden",
        fontFamily: "var(--m-sans)",
        position: "relative",
      }}
    >
      {/* Title bar — draggable, traffic lights overlay here (native, ~80px from left) */}
      <div
        data-tauri-drag-region
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 36,
          background: "var(--m-bg)",
          borderBottom: "1px solid var(--m-line-soft)",
          display: "flex",
          alignItems: "center",
          paddingLeft: 80,
          paddingRight: 12,
          zIndex: 5,
          gap: 12,
        }}
      >
        {/* Center — app name */}
        <div
          data-tauri-drag-region
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 8,
            fontSize: 11.5,
            color: "var(--m-text-3)",
          }}
        >
          <Mark size={13} />
          mimisbrunnr · vault
        </div>

        {/* Right — AI status */}
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <AIStatusPill state="thinking" text="2 agents working" />
        </div>
      </div>

      {/* Sidebar */}
      <AppSidebar />

      {/* Main content */}
      <main
        style={{
          marginTop: 36,
          flex: 1,
          height: "calc(100vh - 36px)",
          display: "flex",
          flexDirection: "column",
          background: "var(--m-bg)",
          position: "relative",
          overflow: "hidden",
          minWidth: 0,
        }}
      >
        <div style={{ flex: 1, overflow: "hidden", display: "flex" }}>
          <Outlet />
        </div>

        {/* Status bar */}
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
            <span>Ln 24, Col 41</span>
            <span
              style={{ display: "inline-flex", alignItems: "center", gap: 5 }}
            >
              <Dot color="var(--m-ai)" pulse />
              indexed
            </span>
          </span>
        </div>
      </main>

      {/* AI panel */}
      {aiPanelOpen && <AgentPanel onClose={() => setAiPanelOpen(false)} />}

      {/* AI panel toggle button (when closed) */}
      {!aiPanelOpen && (
        <button
          onClick={() => setAiPanelOpen(true)}
          style={{
            position: "absolute",
            right: 12,
            top: 48,
            zIndex: 4,
            width: 28,
            height: 28,
            borderRadius: 6,
            background: "var(--m-bg-3)",
            border: "1px solid var(--m-line-soft)",
            color: "var(--m-text-2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <IconPanel size={14} />
        </button>
      )}

      {/* Command palette */}
      {commandPaletteOpen && (
        <CommandPalette onClose={() => setCommandPaletteOpen(false)} />
      )}
    </div>
  );
}
