import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";
import { useVaultStore } from "@/store/vaultStore";
import { buildTree, VaultNode, FolderNode, NoteNode } from "@/lib/vault/tree";

const IconChevRight = () => (
  <svg
    width={11}
    height={11}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m9 6 6 6-6 6" />
  </svg>
);
const IconChevDown = () => (
  <svg
    width={11}
    height={11}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);
const IconFolder = () => (
  <svg
    width={13}
    height={13}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
  </svg>
);
const IconFile = () => (
  <svg
    width={11}
    height={11}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.4"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9Z" />
    <path d="M14 3v6h6" />
  </svg>
);

function FolderItem({ node, depth }: { node: FolderNode; depth: number }) {
  const [open, setOpen] = useState(depth === 0);

  return (
    <div>
      <div
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
        }}
      >
        <span style={{ color: "var(--m-text-4)", display: "inline-flex" }}>
          {open ? <IconChevDown /> : <IconChevRight />}
        </span>
        <span style={{ color: "var(--m-text-3)" }}>
          <IconFolder />
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
  const { activeNoteId, setActiveNote } = useVaultStore();
  const active = activeNoteId === node.path;

  return (
    <div
      onClick={() => setActiveNote(node.path)}
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
        <IconFile />
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
    <div
      className="m-scroll"
      style={{ flex: 1, overflowY: "auto", padding: "0 6px" }}
    >
      {tree.map((node, i) => (
        <VaultNodeItem key={i} node={node} depth={0} />
      ))}
    </div>
  );
}
