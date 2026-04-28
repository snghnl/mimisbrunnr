import { useNavigate, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import { useUIStore } from "@/store/uiStore";
import { useVaultStore } from "@/store/vaultStore";
import { Mark, Kbd } from "@/components/ui/atoms";
import FileTree from "./FileTree";

const TAGS = [
  { name: "ai", count: 24 },
  { name: "pkm", count: 18 },
  { name: "design", count: 12 },
  { name: "project", count: 9 },
  { name: "idea", count: 7 },
  { name: "daily", count: 31 },
];

// Lucide-style inline SVG icons
const IconEdit = ({ size = 13 }: { size?: number }) => (
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
    <path d="M4 21h4l11-11-4-4L4 17Z" />
    <path d="m14 6 4 4" />
  </svg>
);
const IconHome = ({ size = 13 }: { size?: number }) => (
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
    <path d="m3 11 9-7 9 7v9a2 2 0 0 1-2 2h-4v-7H10v7H6a2 2 0 0 1-2-2Z" />
  </svg>
);
const IconGraph = ({ size = 13 }: { size?: number }) => (
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
    <circle cx="6" cy="6" r="2" />
    <circle cx="18" cy="6" r="2" />
    <circle cx="12" cy="18" r="2" />
    <path d="M7.5 7.5 11 16M16.5 7.5 13 16" />
  </svg>
);
const IconSearch = ({ size = 12 }: { size?: number }) => (
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
const IconPlus = ({ size = 11 }: { size?: number }) => (
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
    <path d="M12 5v14M5 12h14" />
  </svg>
);
const IconGear = ({ size = 13 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.4"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.6 1.6 0 0 0 .3 1.7l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.7-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.7.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.7 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.7l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.7.3 1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.7-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.7 1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1Z" />
  </svg>
);

const NAV = [
  { id: "editor", label: "Editor", icon: IconEdit, kbd: "⌘E" },
  { id: "dashboard", label: "Dashboard", icon: IconHome, kbd: "⌘D" },
  { id: "graph", label: "Graph", icon: IconGraph, kbd: "⌘G" },
] as const;

export default function AppSidebar() {
  const navigate = useNavigate();
  const { location } = useRouterState();
  const { setCommandPaletteOpen } = useUIStore();
  const { vaultPath, setVaultPath } = useVaultStore();

  const { data: paths = [] } = useQuery({
    queryKey: ['vault', vaultPath],
    queryFn: () => invoke<string[]>('scan_vault', { vaultPath }),
    enabled: !!vaultPath,
  });

  const vaultName = vaultPath?.split('/').pop() ?? 'no vault';

  const activeView = location.pathname.startsWith("/editor")
    ? "editor"
    : location.pathname === "/graph"
      ? "graph"
      : "dashboard";

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
          const active = activeView === t.id;
          const Icon = t.icon;
          return (
            <button
              type="button"
              key={t.id}
              onClick={() => {
                if (t.id === "editor")
                  navigate({
                    to: "/editor/$noteId",
                    params: { noteId: "i-comp" },
                  });
                else if (t.id === "graph") navigate({ to: "/graph" });
                else navigate({ to: "/" });
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
          <IconSearch size={12} />
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
        <span>Vault</span>
        <span style={{ color: "var(--m-text-3)", cursor: "pointer" }}>
          <IconPlus size={11} />
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
          <IconGear size={13} />
        </span>
      </div>
    </aside>
  );
}
