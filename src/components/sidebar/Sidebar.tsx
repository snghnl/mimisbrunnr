import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import { useUIStore } from "@/store/uiStore";
import { useVaultStore } from "@/store/vaultStore";
import { Mark, Kbd } from "@/components/ui/atoms";
import FileTree from "./FileTree";
import { Search, Pencil, House, Share2, Plus, Settings } from "lucide-react";
const TAGS = [
  { name: "ai", count: 24 },
  { name: "pkm", count: 18 },
  { name: "design", count: 12 },
  { name: "project", count: 9 },
  { name: "idea", count: 7 },
  { name: "daily", count: 31 },
];

const NAV = [
  { id: "editor", label: "Editor", icon: Pencil, kbd: "⌘E" },
  { id: "dashboard", label: "Dashboard", icon: House, kbd: "⌘D" },
  { id: "graph", label: "Graph", icon: Share2, kbd: "⌘G" },
] as const;

export default function AppSidebar() {
  const { setCommandPaletteOpen, openTab, tabs, activeTabId } = useUIStore();
  const { vaultPath, setVaultPath } = useVaultStore();

  const { data: paths = [] } = useQuery({
    queryKey: ["vault", vaultPath],
    queryFn: () => invoke<string[]>("scan_vault", { vaultPath }),
    enabled: !!vaultPath,
  });

  const vaultName = vaultPath?.split("/").pop() ?? "no vault";

  const activeTab = tabs.find((t) => t.id === activeTabId);
  const activeView =
    activeTab?.type === "note"
      ? "editor"
      : activeTab?.type === "graph"
        ? "graph"
        : activeTab?.type === "dashboard"
          ? "dashboard"
          : null;

  return (
    <aside
      style={{
        marginTop: 36,
        width: 240,
        height: "calc(100vh - 36px)",
        background: "var(--m-bg)",
        borderRight: "1px solid var(--m-line-soft)",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
      }}
    >
      {/* Nav tabs */}
      <div
        style={{
          padding: "12px 12px 8px",
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        {NAV.map((t) => {
          const active = activeView !== null && activeView === t.id;
          const Icon = t.icon;
          return (
            <button
              type="button"
              key={t.id}
              onClick={(e) => {
                if (t.id === "editor") {
                  setCommandPaletteOpen(true);
                } else if (t.id === "graph") {
                  openTab({ type: "graph" }, e.metaKey || e.ctrlKey);
                } else {
                  openTab({ type: "dashboard" }, e.metaKey || e.ctrlKey);
                }
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 9,
                padding: "6px 9px",
                borderRadius: 5,
                background: active ? "var(--m-bg-3)" : "transparent",
                border: "none",
                color: active ? "var(--m-text)" : "var(--m-text-2)",
                fontSize: 12.5,
                cursor: "pointer",
                textAlign: "left",
                transition: "background 120ms, color 120ms",
              }}
            >
              <span
                style={{
                  color: active ? "var(--m-accent)" : "var(--m-text-3)",
                }}
              >
                <Icon size={13} />
              </span>
              <span style={{ flex: 1 }}>{t.label}</span>
              <Kbd>{t.kbd}</Kbd>
            </button>
          );
        })}
      </div>

      {/* Search vault */}
      <div style={{ padding: "0 12px 8px" }}>
        <div
          onClick={() => setCommandPaletteOpen(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            padding: "6px 9px",
            background: "var(--m-bg-2)",
            border: "1px solid var(--m-line-soft)",
            borderRadius: 5,
            color: "var(--m-text-3)",
            fontSize: 12,
            cursor: "pointer",
          }}
        >
          <Search size={12} />
          <span style={{ flex: 1 }}>Search vault</span>
          <Kbd>⌘K</Kbd>
        </div>
      </div>

      {/* Vault file tree */}
      <div
        style={{
          padding: "8px 9px 4px",
          fontSize: 10.5,
          fontFamily: "var(--m-mono)",
          color: "var(--m-text-4)",
          letterSpacing: 0.6,
          textTransform: "uppercase",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span>{vaultName}</span>
        <span style={{ color: "var(--m-text-3)", cursor: "pointer" }}>
          <Plus size={11} />
        </span>
      </div>
      <FileTree />

      {/* Tags */}
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

      {/* Footer */}
      <div
        style={{
          marginTop: "auto",
          padding: "10px 12px",
          borderTop: "1px solid var(--m-line-soft)",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <span
          style={{
            width: 24,
            height: 24,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            background: "var(--m-bg-3)",
            borderRadius: "50%",
          }}
        >
          <Mark size={14} color="var(--m-text)" />
        </span>
        <div style={{ flex: 1, fontSize: 11.5, lineHeight: 1.2 }}>
          <div style={{ color: "var(--m-text-2)" }}>{vaultName}</div>
          <div
            style={{
              color: "var(--m-text-4)",
              fontFamily: "var(--m-mono)",
              fontSize: 10,
            }}
          >
            {paths.length} files
          </div>
        </div>
        <span
          onClick={async () => {
            const selected = await open({ directory: true, multiple: false });
            if (typeof selected === "string") setVaultPath(selected);
          }}
          style={{ color: "var(--m-text-3)", cursor: "pointer" }}
        >
          <Settings size={13} />
        </span>
      </div>
    </aside>
  );
}
