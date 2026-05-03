import { useState, useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";
import { X, FileText, LayoutDashboard, Share2 } from "lucide-react";
import { useUIStore } from "@/store/uiStore";
import { useVaultStore } from "@/store/vaultStore";
import type { Tab } from "@/types/tab";
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

function tabLabel(tab: Tab): string {
  if (tab.type === "empty") return "New Tab";
  if (tab.type === "note") return tab.title;
  if (tab.type === "dashboard") return "Dashboard";
  return "Graph";
}

function TabIcon({ tab }: { tab: Tab }) {
  if (tab.type === "empty") return null;
  if (tab.type === "note") return <FileText size={11} />;
  if (tab.type === "dashboard") return <LayoutDashboard size={11} />;
  return <Share2 size={11} />;
}

function TabElement({ tab, active }: { tab: Tab; active: boolean }) {
  const { setActiveTabId, closeTab, closeOthers, closeToTheRight, tabs, updateNoteTab, openTab } =
    useUIStore();
  const { vaultPath, activeNoteId, setActiveNote } = useVaultStore();
  const queryClient = useQueryClient();

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [renameOpen, setRenameOpen] = useState(false);
  const [renameValue, setRenameValue] = useState("");
  const renameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (renameOpen) renameInputRef.current?.select();
  }, [renameOpen]);

  const handleDelete = async () => {
    if (tab.type !== "note") return;
    const fullPath = `${vaultPath}/${tab.noteId}`;
    await invoke("delete_note", { path: fullPath });
    tabs
      .filter((t) => t.type === "note" && t.noteId === tab.noteId)
      .forEach((t) => closeTab(t.id));
    if (activeNoteId === tab.noteId) setActiveNote(null);
    queryClient.invalidateQueries({ queryKey: ["vault", vaultPath] });
  };

  const handleRename = async () => {
    if (tab.type !== "note") return;
    const stem = renameValue.trim();
    if (!stem || stem === tab.title) return;
    const newName = stem + ".md";
    const dir = tab.noteId.includes("/")
      ? tab.noteId.slice(0, tab.noteId.lastIndexOf("/"))
      : null;
    const newRelPath = dir ? `${dir}/${newName}` : newName;
    const oldFullPath = `${vaultPath}/${tab.noteId}`;
    const newFullPath = `${vaultPath}/${newRelPath}`;
    await invoke("rename_note", { oldPath: oldFullPath, newPath: newFullPath });
    updateNoteTab(tab.noteId, newRelPath, stem);
    if (activeNoteId === tab.noteId) setActiveNote(newRelPath);
    queryClient.invalidateQueries({ queryKey: ["vault", vaultPath] });
  };

  const handleRenameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleRename();
      setRenameOpen(false);
    } else if (e.key === "Escape") {
      setRenameOpen(false);
    }
  };

  const handleDuplicate = async () => {
    if (tab.type !== "note" || !vaultPath) return;
    const fullPath = `${vaultPath}/${tab.noteId}`;
    const newFullPath = await invoke<string>("duplicate_note", { path: fullPath });
    const relPath = newFullPath.slice(vaultPath.length + 1);
    const title = relPath.split("/").pop()!.replace(/\.md$/, "");
    openTab({ type: "note", noteId: relPath, title }, true);
    queryClient.invalidateQueries({ queryKey: ["vault", vaultPath] });
  };

  const handleCopyPath = () => {
    if (tab.type !== "note" || !vaultPath) return;
    navigator.clipboard.writeText(`${vaultPath}/${tab.noteId}`);
  };

  const handleRevealInFinder = () => {
    if (tab.type !== "note" || !vaultPath) return;
    invoke("reveal_in_finder", { path: `${vaultPath}/${tab.noteId}` });
  };

  const tabBody = (
    <div
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

  if (tab.type === "empty") return tabBody;

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger asChild>{tabBody}</ContextMenuTrigger>
        <ContextMenuContent>
          {tab.type === "note" && (
            <>
              <ContextMenuItem
                onSelect={() => {
                  setRenameValue(tab.title);
                  setRenameOpen(true);
                }}
              >
                Rename
              </ContextMenuItem>
              <ContextMenuItem
                variant="destructive"
                onSelect={() => setDeleteOpen(true)}
              >
                Delete
              </ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem onSelect={handleDuplicate}>Duplicate Note</ContextMenuItem>
              <ContextMenuItem onSelect={handleCopyPath}>Copy File Path</ContextMenuItem>
              <ContextMenuItem onSelect={handleRevealInFinder}>Reveal in Finder</ContextMenuItem>
              <ContextMenuSeparator />
            </>
          )}
          <ContextMenuItem onSelect={() => closeTab(tab.id)}>Close</ContextMenuItem>
          <ContextMenuItem onSelect={() => closeOthers(tab.id)}>
            Close Others
          </ContextMenuItem>
          <ContextMenuItem onSelect={() => closeToTheRight(tab.id)}>
            Close to the Right
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      {tab.type === "note" && (
        <>
          <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete note?</AlertDialogTitle>
                <AlertDialogDescription>
                  &ldquo;{tab.title}&rdquo; will be permanently deleted from disk.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog open={renameOpen} onOpenChange={setRenameOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Rename note</AlertDialogTitle>
              </AlertDialogHeader>
              <input
                ref={renameInputRef}
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                onKeyDown={handleRenameKeyDown}
                style={{
                  width: "100%",
                  background: "var(--m-bg-2)",
                  border: "1px solid var(--m-line-soft)",
                  borderRadius: 4,
                  color: "var(--m-text)",
                  fontSize: 13,
                  fontFamily: "inherit",
                  padding: "6px 8px",
                  outline: "none",
                }}
              />
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleRename}>Rename</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </>
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
