import { useState, useEffect, useRef } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";
import { useVaultStore } from "@/store/vaultStore";
import { useEditorStore } from "@/store/editorStore";
import { useUIStore } from "@/store/uiStore";
import BreadCrumb from "./components/BreadCrumb.components";
import WikiPopover from "./components/WikiPopover.components";
import SlashMenu from "./components/SlashMenu.components";
import FloatingToolbar from "./components/FloatingToolbar.components";
import CodeMirrorEditor from "./CodeMirrorEditor";

const SERIF = "var(--m-serif)";
const AUTOSAVE_DELAY_MS = 3000;

interface Props {
  noteId: string;
}

export default function Editor({ noteId }: Props) {
  const { vaultPath, setActiveNote } = useVaultStore();
  const updateNoteTab = useUIStore((s) => s.updateNoteTab);
  const openTab = useUIStore((s) => s.openTab);
  const tabs = useUIStore((s) => s.tabs);
  const setActiveTabId = useUIStore((s) => s.setActiveTabId);
  const queryClient = useQueryClient();
  const setCursor = useEditorStore((s) => s.setCursor);
  const setWordCount = useEditorStore((s) => s.setWordCount);
  const setLastSavedAt = useEditorStore((s) => s.setLastSavedAt);

  useEffect(
    () => () => {
      setCursor(null);
      setWordCount(null);
      setLastSavedAt(null);
    },
    [setCursor, setWordCount, setLastSavedAt],
  );
  const [slashOpen, setSlash] = useState(false);
  const [wikiOpen, setWiki] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [draftTitle, setDraftTitle] = useState("");
  const titleInputRef = useRef<HTMLInputElement>(null);

  const contentRef = useRef("");
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fullPath = vaultPath ? `${vaultPath}/${noteId}` : null;

  const { data, isError } = useQuery({
    queryKey: ["note", fullPath],
    queryFn: () => invoke<string>("read_note", { path: fullPath! }),
    enabled: !!fullPath,
  });

  const { data: notePaths = [] } = useQuery({
    queryKey: ["vault", vaultPath],
    queryFn: () => invoke<string[]>("scan_vault", { vaultPath: vaultPath! }),
    enabled: !!vaultPath,
  });

  const { mutate: saveNote } = useMutation({
    mutationFn: (contentToSave: string) =>
      invoke<void>("write_note", { path: fullPath!, content: contentToSave }),
    onSuccess: (_, contentToSave) => {
      queryClient.setQueryData(["note", fullPath], contentToSave);
      setLastSavedAt(new Date());
    },
  });

  // Keep ref in sync when the query delivers fresh data
  useEffect(() => {
    if (data !== undefined) {
      contentRef.current = data;
      setWordCount(data.trim() ? data.trim().split(/\s+/).length : 0);
    }
  }, [data, setWordCount]);

  // Flush pending auto-save before switching notes to prevent data loss
  useEffect(() => {
    return () => {
      if (saveTimerRef.current !== null) {
        clearTimeout(saveTimerRef.current);
        saveTimerRef.current = null;
        saveNote(contentRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noteId]);

  // Cmd+S / Ctrl+S — immediate save (stays in Editor; save callback is local)
  useHotkeys(
    "meta+s, ctrl+s",
    (e) => {
      e.preventDefault();
      if (saveTimerRef.current !== null) {
        clearTimeout(saveTimerRef.current);
        saveTimerRef.current = null;
      }
      saveNote(contentRef.current);
    },
    { enableOnContentEditable: true, enableOnFormTags: true },
    [saveNote],
  );

  const handleChange = (val: string) => {
    contentRef.current = val;
    setWordCount(val.trim() ? val.trim().split(/\s+/).length : 0);
    if (saveTimerRef.current !== null) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      saveTimerRef.current = null;
      saveNote(val);
    }, AUTOSAVE_DELAY_MS);
  };

  const title = noteId.split("/").pop()?.replace(/\.md$/, "") ?? noteId;

  const commitRename = async () => {
    const trimmed = draftTitle.trim();
    setIsEditingTitle(false);
    if (!trimmed || trimmed === title || !vaultPath) return;
    const dir = noteId.includes("/")
      ? noteId.slice(0, noteId.lastIndexOf("/"))
      : null;
    const newNoteId = dir ? `${dir}/${trimmed}.md` : `${trimmed}.md`;
    await invoke("rename_note", {
      oldPath: `${vaultPath}/${noteId}`,
      newPath: `${vaultPath}/${newNoteId}`,
    });
    queryClient.removeQueries({ queryKey: ["note", `${vaultPath}/${noteId}`] });
    queryClient.invalidateQueries({ queryKey: ["vault", vaultPath] });
    updateNoteTab(noteId, newNoteId, trimmed);
    setActiveNote(newNoteId);
  };

  if (isError) {
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontSize: 13,
            color: "var(--m-text-3)",
            fontFamily: "var(--m-mono)",
          }}
        >
          Could not load note.
        </span>
      </div>
    );
  }

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div
        className="m-scroll"
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "52px 0 100px",
          position: "relative",
        }}
      >
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 56px" }}>
          <BreadCrumb path={noteId} className="mono-label" />

          {isEditingTitle ? (
            <input
              ref={titleInputRef}
              value={draftTitle}
              onChange={(e) => setDraftTitle(e.target.value)}
              onBlur={commitRename}
              onKeyDown={(e) => {
                if (e.key === "Enter") e.currentTarget.blur();
                if (e.key === "Escape") setIsEditingTitle(false);
              }}
              style={{
                fontFamily: SERIF,
                fontWeight: 500,
                fontSize: 38,
                lineHeight: 1.12,
                letterSpacing: -0.5,
                color: "var(--m-text)",
                margin: "0 0 32px",
                background: "transparent",
                border: "none",
                outline: "none",
                width: "100%",
                padding: 0,
                display: "block",
              }}
            />
          ) : (
            <h1
              style={{
                fontFamily: SERIF,
                fontWeight: 500,
                fontSize: 38,
                lineHeight: 1.12,
                letterSpacing: -0.5,
                color: "var(--m-text)",
                margin: "0 0 32px",
                cursor: "text",
              }}
              onClick={() => {
                setDraftTitle(title);
                setIsEditingTitle(true);
                setTimeout(() => titleInputRef.current?.select(), 0);
              }}
            >
              {title}
            </h1>
          )}

          <CodeMirrorEditor
            key={noteId}
            value={data ?? ""}
            onChange={handleChange}
            notePaths={notePaths}
            onWikilinkClick={async (target) => {
              const stemMatch = (p: string) =>
                (p.split("/").pop()?.replace(/\.md$/, "") ?? "").toLowerCase() ===
                target.toLowerCase();

              const matchedPath = notePaths.find(stemMatch);

              if (matchedPath) {
                const existing = tabs.find(
                  (t) => t.type === "note" && t.noteId === matchedPath,
                );
                if (existing) {
                  setActiveTabId(existing.id);
                } else {
                  const title =
                    matchedPath.split("/").pop()?.replace(/\.md$/, "") ?? target;
                  openTab({ type: "note", noteId: matchedPath, title }, true);
                }
                return;
              }

              // Unresolved — create the note then open it
              if (!vaultPath) return;
              const noteId = `${target}.md`;

              // Re-read cache to guard against a race where the file was
              // just created by another action before we got here
              const freshPaths =
                queryClient.getQueryData<string[]>(["vault", vaultPath]) ?? [];
              const raceMatch = freshPaths.find(stemMatch);
              if (raceMatch) {
                const title = raceMatch.split("/").pop()?.replace(/\.md$/, "") ?? target;
                openTab({ type: "note", noteId: raceMatch, title }, true);
                return;
              }

              await invoke("write_note", {
                path: `${vaultPath}/${noteId}`,
                content: `# ${target}`,
              });
              queryClient.invalidateQueries({ queryKey: ["vault", vaultPath] });
              openTab({ type: "note", noteId, title: target }, true);
            }}
          />
        </div>
      </div>

      <FloatingToolbar
        slashOpen={slashOpen}
        wikiOpen={wikiOpen}
        onSlashToggle={() => setSlash((s) => !s)}
        onWikiToggle={() => setWiki((w) => !w)}
      />

      {slashOpen && <SlashMenu />}

      {wikiOpen && (
        <div
          style={{
            position: "absolute",
            bottom: 64,
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <WikiPopover />
        </div>
      )}
    </div>
  );
}
