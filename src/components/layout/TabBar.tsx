import { X, FileText, LayoutDashboard, Share2 } from "lucide-react";
import { useUIStore } from "@/store/uiStore";
import type { Tab } from "@/types/tab";

function tabLabel(tab: Tab): string {
  if (tab.type === "note") return tab.title;
  if (tab.type === "dashboard") return "Dashboard";
  return "Graph";
}

function TabIcon({ tab }: { tab: Tab }) {
  if (tab.type === "note") return <FileText size={11} />;
  if (tab.type === "dashboard") return <LayoutDashboard size={11} />;
  return <Share2 size={11} />;
}

function TabElement({ tab, active }: { tab: Tab; active: boolean }) {
  const { setActiveTabId, closeTab } = useUIStore();

  return (
    <div
      key={tab.id}
      onClick={() => setActiveTabId(tab.id)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "0 8px 0 10px",
        height: 30,
        maxWidth: 180,
        minWidth: 80,
        borderRadius: "4px 4px 0 0",
        background: active ? "var(--m-bg-3)" : "transparent",
        border: `1px solid ${active ? "var(--m-line-soft)" : "transparent"}`,
        borderBottom: `1px solid ${active ? "var(--m-bg-3)" : "transparent"}`,
        color: active ? "var(--m-text)" : "var(--m-text-3)",
        cursor: "pointer",
        userSelect: "none",
        fontSize: 12,
        fontFamily: "var(--m-sans)",
        flexShrink: 0,
        marginBottom: -1,
        transition: "color 100ms",
      }}
    >
      <span
        style={{
          color: active ? "var(--m-text-3)" : "var(--m-text-4)",
          flexShrink: 0,
          display: "flex",
        }}
      >
        <TabIcon tab={tab} />
      </span>
      <span
        style={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          flex: 1,
        }}
      >
        {tabLabel(tab)}
      </span>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          closeTab(tab.id);
        }}
        style={{
          width: 14,
          height: 14,
          border: "none",
          background: "transparent",
          color: "var(--m-text-4)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 3,
          padding: 0,
          flexShrink: 0,
        }}
      >
        <X size={10} />
      </button>
    </div>
  );
}

export default function TabBar() {
  const { tabs, activeTabId } = useUIStore();

  return (
    <div
      style={{
        height: 34,
        display: "flex",
        alignItems: "flex-end",
        borderBottom: "1px solid var(--m-line-soft)",
        background: "var(--m-bg)",
        paddingLeft: 4,
        flexShrink: 0,
        overflowX: "auto",
      }}
    >
      {tabs.map((tab) => (
        <TabElement key={tab.id} tab={tab} active={tab.id === activeTabId} />
      ))}
    </div>
  );
}
