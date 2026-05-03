import { useEffect } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { useUIStore } from "@/store/uiStore";
import { useCreateNote } from "@/hooks/useCreateNote";

export function useGlobalHotkeys(): void {
  const setCommandPaletteOpen = useUIStore((s) => s.setCommandPaletteOpen);
  const openTab = useUIStore((s) => s.openTab);
  const closeTab = useUIStore((s) => s.closeTab);
  const setActiveTabId = useUIStore((s) => s.setActiveTabId);
  const tabs = useUIStore((s) => s.tabs);
  const activeTabId = useUIStore((s) => s.activeTabId);
  const createNote = useCreateNote();

  // New note
  useHotkeys(
    "meta+n, ctrl+n",
    (e) => {
      e.preventDefault();
      const activeTab = tabs.find((t) => t.id === activeTabId);
      createNote({ force: activeTab?.type !== "empty" });
    },
    { enableOnContentEditable: true, enableOnFormTags: true },
    [tabs, activeTabId, createNote],
  );

  // Open command palette
  useHotkeys(
    "meta+k, ctrl+k",
    (e) => {
      e.preventDefault();
      setCommandPaletteOpen(true);
    },
    { enableOnContentEditable: true, enableOnFormTags: true },
  );

  // Close command palette
  useHotkeys("escape", () => {
    setCommandPaletteOpen(false);
  });

  // Open Dashboard tab
  useHotkeys(
    "meta+d, ctrl+d",
    (e) => {
      e.preventDefault();
      openTab({ type: "dashboard" });
    },
    { enableOnContentEditable: true, enableOnFormTags: true },
  );

  // Open Graph tab
  useHotkeys(
    "meta+g, ctrl+g",
    (e) => {
      e.preventDefault();
      openTab({ type: "graph" });
    },
    { enableOnContentEditable: true, enableOnFormTags: true },
  );

  // Close active tab — ctrl+w for Windows/Linux only.
  // On macOS, Cmd+W is intercepted by Tauri at the native level (see lib.rs on_window_event)
  // and routed through the "window:close-requested" listener below.
  useHotkeys(
    "ctrl+w",
    (e) => {
      e.preventDefault();
      if (activeTabId) closeTab(activeTabId);
    },
    { enableOnContentEditable: true, enableOnFormTags: true },
    [activeTabId, closeTab],
  );

  // Handle native window close (macOS Cmd+W, red traffic light, etc.)
  // Rust intercepts CloseRequested, prevents the default, and emits this event.
  // If a tab is open, close it. When the last tab is gone, destroy the window.
  useEffect(() => {
    let cleanup: (() => void) | undefined;

    getCurrentWindow()
      .listen("window:close-requested", () => {
        if (tabs.length > 0 && activeTabId) {
          closeTab(activeTabId);
        } else {
          getCurrentWindow().destroy();
        }
      })
      .then((unlisten) => {
        cleanup = unlisten;
      });

    return () => cleanup?.();
  }, [tabs, activeTabId, closeTab]);

  // Cycle to previous tab (Cmd+Shift+[ / Ctrl+Shift+[)
  // Use event.code names (bracketleft) — react-hotkeys-hook v5 matches against event.code
  useHotkeys(
    "meta+shift+bracketleft, ctrl+shift+bracketleft",
    (e) => {
      e.preventDefault();
      if (tabs.length === 0) return;
      const currentIndex = tabs.findIndex((t) => t.id === activeTabId);
      const prevIndex = (currentIndex - 1 + tabs.length) % tabs.length;
      setActiveTabId(tabs[prevIndex].id);
    },
    { enableOnContentEditable: true, enableOnFormTags: true },
    [tabs, activeTabId, setActiveTabId],
  );

  // Cycle to next tab (Cmd+Shift+] / Ctrl+Shift+])
  useHotkeys(
    "meta+shift+bracketright, ctrl+shift+bracketright",
    (e) => {
      e.preventDefault();
      if (tabs.length === 0) return;
      const currentIndex = tabs.findIndex((t) => t.id === activeTabId);
      const nextIndex = (currentIndex + 1) % tabs.length;
      setActiveTabId(tabs[nextIndex].id);
    },
    { enableOnContentEditable: true, enableOnFormTags: true },
    [tabs, activeTabId, setActiveTabId],
  );
}
