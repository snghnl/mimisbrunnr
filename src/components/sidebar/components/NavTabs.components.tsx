import { Pencil, LayoutDashboard, Share2 } from "lucide-react";
import { Kbd } from "@/components/ui/atoms";
import { useUIStore } from "@/store/uiStore";

const NAV = [
  { id: "editor", label: "Editor", icon: Pencil, kbd: "⌘E" },
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, kbd: "⌘D" },
  { id: "graph", label: "Graph", icon: Share2, kbd: "⌘G" },
] as const;

export default function NavTabs() {
  const { setCommandPaletteOpen, openTab, tabs, activeTabId } = useUIStore();

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
                // TODO: make new tab open if no active note
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
  );
}
