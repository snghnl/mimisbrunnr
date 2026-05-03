import { useEffect, useRef, useState } from "react";
import { useGlobalHotkeys } from "@/hooks/useGlobalHotkeys";
import { open } from "@tauri-apps/plugin-dialog";
import { invoke } from "@tauri-apps/api/core";
import { useQuery } from "@tanstack/react-query";
import { useUIStore } from "@/store/uiStore";
import { useVaultStore } from "@/store/vaultStore";
import { Mark, AIStatusPill, Dot, Kbd } from "@/components/ui/atoms";
import AppSidebar from "@/components/sidebar/Sidebar";
import AgentPanel from "@/components/agent/AgentPanel";
import { TabBar, StatusBar } from "@/components/layout/components";
import Editor from "@/components/editor/Editor";
import { useCreateNote } from "@/hooks/useCreateNote";
import Dashboard from "@/components/dashboard/Dashboard";
import GraphView from "@/components/graph/GraphView";
import { Search, PanelRight } from "lucide-react";

interface CmdItem {
  kind: "cmd" | "note" | "tag";
  label: string;
  hint?: string;
  kbd?: string;
  action?: () => void;
}

function CommandPalette({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { vaultPath } = useVaultStore();
  const { openTab } = useUIStore();
  const createNote = useCreateNote();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const { data: notePaths = [] } = useQuery({
    queryKey: ["vault", vaultPath],
    queryFn: () => invoke<string[]>("scan_vault", { vaultPath }),
    enabled: !!vaultPath,
  });

  const noteItems: CmdItem[] = notePaths.map((path) => ({
    kind: "note" as const,
    label: path.split("/").pop()?.replace(/\.md$/, "") ?? path,
    hint: path.includes("/")
      ? `${path.split("/").slice(0, -1).join("/")}/`
      : undefined,
    action: () => {
      const title = path.split("/").pop()?.replace(/\.md$/, "") ?? path;
      openTab({ type: "note", noteId: path, title });
      onClose();
    },
  }));

  const cmdItems: CmdItem[] = [
    {
      kind: "cmd",
      label: "New note",
      hint: "Create blank note",
      action: () => {
        createNote();
        onClose();
      },
    },
    {
      kind: "cmd",
      label: "Open Dashboard",
      hint: "Today's digest",
      kbd: "⌘D",
      action: () => {
        openTab({ type: "dashboard" });
        onClose();
      },
    },
    {
      kind: "cmd",
      label: "Open Graph",
      hint: "Knowledge map",
      kbd: "⌘G",
      action: () => {
        openTab({ type: "graph" });
        onClose();
      },
    },
    { kind: "cmd", label: "Absorb URL…", hint: "Paste & summarize" },
  ];

  const all: CmdItem[] = [...cmdItems, ...noteItems];

  const filtered = q
    ? all.filter((x) => x.label.toLowerCase().includes(q.toLowerCase()))
    : all;

  const groups = [
    { kind: "cmd" as const, label: "Actions" },
    { kind: "note" as const, label: "Notes" },
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
      filtered[sel]?.action?.();
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
            <Search size={14} />
          </span>
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setSel(0);
            }}
            onKeyDown={onKey}
            placeholder="Search notes, run commands…"
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
              No matches.
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

function NewTabScreen() {
  const { setCommandPaletteOpen, openTab } = useUIStore();
  const createNote = useCreateNote();

  const actions = [
    {
      label: "New note",
      kbd: "⌘N",
      action: () => createNote(),
    },
    {
      label: "Open note",
      kbd: "⌘K",
      action: () => setCommandPaletteOpen(true),
    },
    {
      label: "Dashboard",
      kbd: "⌘D",
      action: () => openTab({ type: "dashboard" }),
    },
    {
      label: "Graph",
      kbd: "⌘G",
      action: () => openTab({ type: "graph" }),
    },
  ];

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {actions.map(({ label, kbd, action }) => (
          <button
            key={label}
            type="button"
            onClick={action}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
              fontSize: 13.5,
              color: "var(--m-accent)",
              fontFamily: "var(--m-sans)",
              textAlign: "left",
              letterSpacing: 0.1,
            }}
          >
            {label}{" "}
            <span
              style={{
                fontFamily: "var(--m-mono)",
                fontSize: 12.5,
                opacity: 0.6,
              }}
            >
              ({kbd})
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function VaultWelcome() {
  const { setVaultPath } = useVaultStore();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const selected = await open({ directory: true, multiple: false });
      if (typeof selected === "string") setVaultPath(selected);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
        }}
      >
        <Mark size={28} color="var(--m-accent)" />
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: 16,
              fontFamily: "var(--m-serif)",
              color: "var(--m-text)",
              marginBottom: 8,
            }}
          >
            Select a vault folder
          </div>
          <div
            style={{
              fontSize: 12.5,
              color: "var(--m-text-3)",
              lineHeight: 1.6,
            }}
          >
            Choose a local folder containing your{" "}
            <span style={{ fontFamily: "var(--m-mono)" }}>.md</span> notes.
          </div>
        </div>
        <button
          type="button"
          onClick={handleClick}
          disabled={loading}
          style={{
            padding: "9px 22px",
            background: "var(--m-accent)",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            fontSize: 13,
            fontFamily: "var(--m-sans)",
            cursor: loading ? "default" : "pointer",
            opacity: loading ? 0.6 : 1,
            transition: "opacity 120ms",
          }}
        >
          {loading ? "Opening…" : "Open Folder"}
        </button>
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
    tabs,
    activeTabId,
  } = useUIStore();
  const { vaultPath, setActiveNote } = useVaultStore();

  useGlobalHotkeys();

  useEffect(() => {
    const activeTab = tabs.find((t) => t.id === activeTabId);
    if (activeTab?.type === "note") {
      setActiveNote(activeTab.noteId);
    } else if (!activeTab) {
      setActiveNote(null);
    }
  }, [activeTabId, tabs, setActiveNote]);

  const mainContent = !vaultPath ? (
    <VaultWelcome />
  ) : (
    <>
      {tabs.map((tab) => (
        <div
          key={tab.id}
          style={{
            display: tab.id === activeTabId ? "flex" : "none",
            flex: 1,
            overflow: "hidden",
          }}
        >
          {tab.type === "note" && <Editor noteId={tab.noteId} />}
          {tab.type === "dashboard" && <Dashboard />}
          {tab.type === "graph" && <GraphView />}
          {tab.type === "empty" && <NewTabScreen />}
        </div>
      ))}
    </>
  );

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        background: "var(--m-bg)",
        color: "var(--m-text)",
        display: "flex",
        overflow: "hidden",
        fontFamily: "var(--m-sans)",
        position: "relative",
      }}
    >
      {/* Title bar */}
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
          mimisbrunnr · {vaultPath?.split("/").pop() ?? "no vault"}
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <AIStatusPill state="thinking" text="2 agents working" />
        </div>
      </div>

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
        {vaultPath && <TabBar />}
        <div style={{ flex: 1, overflow: "hidden", display: "flex" }}>
          {mainContent}
        </div>

        {/* Status bar */}
        <StatusBar />
      </main>

      {aiPanelOpen && <AgentPanel onClose={() => setAiPanelOpen(false)} />}

      {!aiPanelOpen && (
        <button
          type="button"
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
          <PanelRight size={14} />
        </button>
      )}

      {commandPaletteOpen && (
        <CommandPalette onClose={() => setCommandPaletteOpen(false)} />
      )}
    </div>
  );
}
