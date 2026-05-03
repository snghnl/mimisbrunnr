import { useState, useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

function FolderItem({ node, depth }: { node: FolderNode; depth: number }) {
  const [open, setOpen] = useState(depth === 0);
  const [renaming, setRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const renameInputRef = useRef<HTMLInputElement>(null);

  const isExpandRequested = useUIStore((s) => s.expandedDirs.has(node.path));
  const isFocused = useUIStore((s) => s.focusedDir === node.path);
  const { openTab, tabs, closeTab, renameDirTabs } = useUIStore();
  const { vaultPath, activeNoteId, setActiveNote } = useVaultStore();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isExpandRequested) setOpen(true);
  }, [isExpandRequested]);

  useEffect(() => {
    if (isFocused) {
      setOpen(true);
      headerRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [isFocused]);

  useEffect(() => {
    if (renaming) renameInputRef.current?.select();
  }, [renaming]);

  const handleNewNote = async () => {
    if (!vaultPath) return;
    const dirFullPath = `${vaultPath}/${node.path}`;
    const newFullPath = await invoke<string>("create_note_in_dir", {
      dirPath: dirFullPath,
      title: "Untitled",
    });
    const relPath = newFullPath.slice(vaultPath.length + 1);
    const title = relPath.split("/").pop()!.replace(/\.md$/, "");
    setOpen(true);
    openTab({ type: "note", noteId: relPath, title }, true);
    setActiveNote(relPath);
    queryClient.invalidateQueries({ queryKey: ["vault", vaultPath] });
  };

  const startRename = () => {
    setRenameValue(node.name);
    setRenaming(true);
  };

  const commitRename = async () => {
    const name = renameValue.trim();
    if (!name || name === node.name) {
      setRenaming(false);
      return;
    }
    if (!vaultPath) { setRenaming(false); return; }
    const dir = node.path.includes("/")
      ? node.path.slice(0, node.path.lastIndexOf("/"))
      : null;
    const newRelPath = dir ? `${dir}/${name}` : name;
    const oldFullPath = `${vaultPath}/${node.path}`;
    const newFullPath = `${vaultPath}/${newRelPath}`;
    await invoke("rename_dir", { oldPath: oldFullPath, newPath: newFullPath });
    renameDirTabs(node.path, newRelPath);
    if (activeNoteId?.startsWith(node.path + "/")) {
      setActiveNote(newRelPath + activeNoteId.slice(node.path.length));
    }
    queryClient.invalidateQueries({ queryKey: ["vault", vaultPath] });
    setRenaming(false);
  };

  const handleRenameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      commitRename();
    } else if (e.key === "Escape") {
      setRenaming(false);
    }
  };

  const handleDelete = async () => {
    if (!vaultPath) return;
    const fullPath = `${vaultPath}/${node.path}`;
    await invoke("delete_dir", { path: fullPath });
    tabs
      .filter((t) => t.type === "note" && t.noteId.startsWith(node.path + "/"))
      .forEach((t) => closeTab(t.id));
    if (activeNoteId?.startsWith(node.path + "/")) setActiveNote(null);
    queryClient.invalidateQueries({ queryKey: ["vault", vaultPath] });
    setDeleteOpen(false);
  };

  const headerStyle: React.CSSProperties = {
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
  };

  const header = (
    <div
      ref={headerRef}
      onClick={renaming ? undefined : () => setOpen((o) => !o)}
      style={headerStyle}
    >
      <span style={{ color: "var(--m-text-4)", display: "inline-flex" }}>
        {open ? <ChevronDownIcon size={11} /> : <ChevronRightIcon size={11} />}
      </span>
      <span style={{ color: "var(--m-text-3)" }}>
        <FolderIcon size={11} />
      </span>
      {renaming ? (
        <input
          ref={renameInputRef}
          value={renameValue}
          onChange={(e) => setRenameValue(e.target.value)}
          onKeyDown={handleRenameKeyDown}
          onBlur={commitRename}
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "1px solid var(--m-accent)",
            outlineOffset: 1,
            borderRadius: 2,
            color: "var(--m-text)",
            fontSize: 12,
            fontFamily: "inherit",
            padding: "0 2px",
            minWidth: 0,
          }}
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <span style={{ flex: 1 }}>{node.name}</span>
      )}
    </div>
  );

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger asChild>{header}</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onSelect={handleNewNote}>New Note Inside</ContextMenuItem>
          <ContextMenuItem onSelect={startRename}>Rename</ContextMenuItem>
          <ContextMenuItem variant="destructive" onSelect={() => setDeleteOpen(true)}>
            Delete Folder
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete folder?</AlertDialogTitle>
            <AlertDialogDescription>
              &ldquo;{node.name}&rdquo; and all notes inside will be permanently deleted from disk.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {open &&
        node.children.map((child, i) => (
          <VaultNodeItem key={i} node={child} depth={depth + 1} />
        ))}
    </>
  );
}

function NoteItem({ node, depth }: { node: NoteNode; depth: number }) {
  const { activeNoteId, vaultPath, setActiveNote } = useVaultStore();
  const { clearFocusedDir, openTab, tabs, closeTab, updateNoteTab } = useUIStore();
  const queryClient = useQueryClient();
  const active = activeNoteId === node.path;
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (renaming) {
      inputRef.current?.select();
    }
  }, [renaming]);

  const handleClick = (e: React.MouseEvent) => {
    const force = e.metaKey || e.ctrlKey;
    const title = node.name.replace(/\.md$/, "");
    clearFocusedDir();
    openTab({ type: "note", noteId: node.path, title }, force);
  };

  const handleDelete = async () => {
    const fullPath = `${vaultPath}/${node.path}`;
    await invoke("delete_note", { path: fullPath });
    tabs
      .filter((t) => t.type === "note" && t.noteId === node.path)
      .forEach((t) => closeTab(t.id));
    if (activeNoteId === node.path) setActiveNote(null);
    queryClient.invalidateQueries({ queryKey: ["vault", vaultPath] });
    setConfirmOpen(false);
  };

  const startRename = () => {
    setRenameValue(node.name.replace(/\.md$/, ""));
    setRenaming(true);
  };

  const commitRename = async () => {
    const stem = renameValue.trim();
    if (!stem || stem + ".md" === node.name) {
      setRenaming(false);
      return;
    }
    const newName = stem + ".md";
    const dir = node.path.includes("/")
      ? node.path.slice(0, node.path.lastIndexOf("/"))
      : null;
    const newRelPath = dir ? `${dir}/${newName}` : newName;
    const oldFullPath = `${vaultPath}/${node.path}`;
    const newFullPath = `${vaultPath}/${newRelPath}`;
    await invoke("rename_note", { oldPath: oldFullPath, newPath: newFullPath });
    updateNoteTab(node.path, newRelPath, stem);
    if (activeNoteId === node.path) setActiveNote(newRelPath);
    queryClient.invalidateQueries({ queryKey: ["vault", vaultPath] });
    setRenaming(false);
  };

  const handleRenameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      commitRename();
    } else if (e.key === "Escape") {
      setRenaming(false);
    }
  };

  const handleDuplicate = async () => {
    if (!vaultPath) return;
    const fullPath = `${vaultPath}/${node.path}`;
    const newFullPath = await invoke<string>("duplicate_note", { path: fullPath });
    const relPath = newFullPath.slice(vaultPath.length + 1);
    const title = relPath.split("/").pop()!.replace(/\.md$/, "");
    openTab({ type: "note", noteId: relPath, title }, true);
    queryClient.invalidateQueries({ queryKey: ["vault", vaultPath] });
  };

  const handleCopyPath = () => {
    if (!vaultPath) return;
    navigator.clipboard.writeText(`${vaultPath}/${node.path}`);
  };

  const handleRevealInFinder = () => {
    if (!vaultPath) return;
    invoke("reveal_in_finder", { path: `${vaultPath}/${node.path}` });
  };

  const rowStyle: React.CSSProperties = {
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
  };

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div
            onClick={renaming ? undefined : handleClick}
            style={rowStyle}
          >
            <span
              style={{
                color: active ? "var(--m-accent)" : "var(--m-text-4)",
                display: "inline-flex",
                flexShrink: 0,
              }}
            >
              <FileIcon size={11} />
            </span>
            {renaming ? (
              <input
                ref={inputRef}
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                onKeyDown={handleRenameKeyDown}
                onBlur={commitRename}
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  outline: "1px solid var(--m-accent)",
                  outlineOffset: 1,
                  borderRadius: 2,
                  color: "var(--m-text)",
                  fontSize: 12,
                  fontFamily: "inherit",
                  padding: "0 2px",
                  minWidth: 0,
                }}
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
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
            )}
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onSelect={startRename}>Rename</ContextMenuItem>
          <ContextMenuItem variant="destructive" onSelect={() => setConfirmOpen(true)}>
            Delete
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem onSelect={handleDuplicate}>Duplicate Note</ContextMenuItem>
          <ContextMenuItem onSelect={handleCopyPath}>Copy File Path</ContextMenuItem>
          <ContextMenuItem onSelect={handleRevealInFinder}>Reveal in Finder</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete note?</AlertDialogTitle>
            <AlertDialogDescription>
              &ldquo;{node.name}&rdquo; will be permanently deleted from disk.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
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
