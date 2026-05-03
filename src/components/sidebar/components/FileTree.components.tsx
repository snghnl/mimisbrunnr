import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";
import { useVaultStore } from "@/store/vaultStore";
import { useUIStore } from "@/store/uiStore";
import { buildTree } from "@/lib/vault/tree";
import type { VaultNode, FolderNode, NoteNode } from "@/lib/vault/tree";
import {
  ChevronRightIcon,
  ChevronDownIcon,
  FolderIcon,
  FileIcon,
  Plus,
} from "lucide-react";

function FolderItem({ node, depth }: { node: FolderNode; depth: number }) {
  const [open, setOpen] = useState(depth === 0);
  const headerRef = useRef<HTMLDivElement>(null);
  const isExpandRequested = useUIStore((s) => s.expandedDirs.has(node.path));
  const isFocused = useUIStore((s) => s.focusedDir === node.path);

  useEffect(() => {
    if (isExpandRequested) setOpen(true);
  }, [isExpandRequested]);

  useEffect(() => {
    if (isFocused) {
      setOpen(true);
      headerRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [isFocused]);

  return (
    <div>
      <div
        ref={headerRef}
        onClick={() => setOpen((o) => !o)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: `4px 9px 4px ${9 + depth * 12}px`,
          color: "var(--m-text-2)",
          fontSize: 12,
          cursor: "pointer",
          borderRadius: 4,
          background: isFocused
            ? "color-mix(in oklch, var(--m-accent) 12%, transparent)"
            : "transparent",
          outline: isFocused
            ? "1px solid color-mix(in oklch, var(--m-accent) 50%, transparent)"
            : "none",
          outlineOffset: -1,
        }}
      >
        <span style={{ color: "var(--m-text-4)", display: "inline-flex" }}>
          {open ? (
            <ChevronDownIcon size={11} />
          ) : (
            <ChevronRightIcon size={11} />
          )}
        </span>
        <span style={{ color: "var(--m-text-3)" }}>
          <FolderIcon size={11} />
        </span>
        <span style={{ flex: 1 }}>{node.name}</span>
      </div>
      {open &&
        node.children.map((child, i) => (
          <VaultNodeItem key={i} node={child} depth={depth + 1} />
        ))}
    </div>
  );
}

function NoteItem({ node, depth }: { node: NoteNode; depth: number }) {
  const { activeNoteId } = useVaultStore();
  const { clearFocusedDir, openTab } = useUIStore();
  const active = activeNoteId === node.path;

  const handleClick = (e: React.MouseEvent) => {
    const force = e.metaKey || e.ctrlKey;
    const title = node.name.replace(/\.md$/, "");
    clearFocusedDir();
    openTab({ type: "note", noteId: node.path, title }, force);
  };

  return (
    <div
      onClick={handleClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: `3px 9px 3px ${9 + depth * 12 + 14}px`,
        color: active ? "var(--m-text)" : "var(--m-text-2)",
        background: active
          ? "color-mix(in oklch, var(--m-accent) 12%, transparent)"
          : "transparent",
        borderLeft: active
          ? "2px solid var(--m-accent)"
          : "2px solid transparent",
        fontSize: 12,
        cursor: "pointer",
      }}
    >
      <span
        style={{
          color: active ? "var(--m-accent)" : "var(--m-text-4)",
          display: "inline-flex",
        }}
      >
        <FileIcon size={11} />
      </span>
      <span
        style={{
          flex: 1,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {node.name}
      </span>
    </div>
  );
}

function VaultNodeItem({ node, depth }: { node: VaultNode; depth: number }) {
  if (node.kind === "folder") return <FolderItem node={node} depth={depth} />;
  return <NoteItem node={node} depth={depth} />;
}

export default function FileTree() {
  const { vaultPath } = useVaultStore();
  const vaultName = vaultPath?.split("/").pop() ?? "no vault";

  const { data: paths = [], isLoading } = useQuery({
    queryKey: ["vault", vaultPath],
    queryFn: () => invoke<string[]>("scan_vault", { vaultPath }),
    enabled: !!vaultPath,
  });

  if (!vaultPath || isLoading) {
    return (
      <div style={{ flex: 1, padding: "8px 12px" }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            style={{
              height: 22,
              marginBottom: 4,
              borderRadius: 3,
              background: "var(--m-bg-2)",
              width: `${60 + (i % 3) * 15}%`,
              opacity: 0.5,
            }}
          />
        ))}
      </div>
    );
  }
  const tree = buildTree(paths);

  return (
    <>
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
      <div
        className="m-scroll"
        style={{ flex: 1, overflowY: "auto", padding: "0 6px" }}
      >
        {tree.map((node) => (
          <VaultNodeItem key={node.path} node={node} depth={0} />
        ))}
      </div>
    </>
  );
}
