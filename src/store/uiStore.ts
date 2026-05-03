import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Tab, TabInput } from "@/types/tab";

export type SidebarTab = "files" | "search" | "tags";

interface UIStore {
  activeTab: SidebarTab;
  setActiveTab: (tab: SidebarTab) => void;
  aiPanelOpen: boolean;
  setAiPanelOpen: (open: boolean) => void;
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  expandedDirs: Set<string>;
  focusedDir: string | null;
  expandDir: (path: string) => void;
  focusDir: (path: string) => void;
  clearFocusedDir: () => void;
  // Content tabs
  tabs: Tab[];
  activeTabId: string | null;
  openTab: (tab: TabInput, force?: boolean) => void;
  closeTab: (id: string) => void;
  setActiveTabId: (id: string) => void;
  updateNoteTab: (oldNoteId: string, newNoteId: string, newTitle: string) => void;
}

function newEmptyTab(): Tab {
  return { type: "empty", id: crypto.randomUUID() };
}

const initialEmptyTab = newEmptyTab();

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      activeTab: "files",
      setActiveTab: (tab) => set({ activeTab: tab }),
      aiPanelOpen: true,
      setAiPanelOpen: (open) => set({ aiPanelOpen: open }),
      commandPaletteOpen: false,
      setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
      expandedDirs: new Set(),
      focusedDir: null,
      expandDir: (path) =>
        set((state) => ({
          expandedDirs: new Set([...state.expandedDirs, path]),
        })),
      focusDir: (path) => set({ focusedDir: path }),
      clearFocusedDir: () => set({ focusedDir: null }),
      tabs: [initialEmptyTab],
      activeTabId: initialEmptyTab.id,
      openTab: (tabDef: TabInput, force = false) =>
        set((state) => {
          if (force || state.tabs.length === 0 || state.activeTabId === null) {
            const id = crypto.randomUUID();
            const newTab: Tab =
              tabDef.type === "note"
                ? { type: "note", id, noteId: tabDef.noteId, title: tabDef.title }
                : tabDef.type === "dashboard"
                  ? { type: "dashboard", id }
                  : tabDef.type === "empty"
                    ? { type: "empty", id }
                    : { type: "graph", id };
            return { tabs: [...state.tabs, newTab], activeTabId: id };
          }
          const updatedTabs = state.tabs.map((t) => {
            if (t.id !== state.activeTabId) return t;
            if (tabDef.type === "note")
              return { type: "note" as const, id: t.id, noteId: tabDef.noteId, title: tabDef.title };
            if (tabDef.type === "dashboard")
              return { type: "dashboard" as const, id: t.id };
            if (tabDef.type === "empty")
              return { type: "empty" as const, id: t.id };
            return { type: "graph" as const, id: t.id };
          });
          return { tabs: updatedTabs };
        }),
      closeTab: (id) =>
        set((state) => {
          const filtered = state.tabs.filter((t) => t.id !== id);
          if (filtered.length === 0) {
            const empty = newEmptyTab();
            return { tabs: [empty], activeTabId: empty.id };
          }
          let activeTabId = state.activeTabId;
          if (activeTabId === id) {
            const idx = state.tabs.findIndex((t) => t.id === id);
            const next = filtered[idx] ?? filtered[idx - 1] ?? null;
            activeTabId = next?.id ?? null;
          }
          return { tabs: filtered, activeTabId };
        }),
      setActiveTabId: (id) => set({ activeTabId: id }),
      updateNoteTab: (oldNoteId, newNoteId, newTitle) =>
        set((state) => ({
          tabs: state.tabs.map((t) =>
            t.type === "note" && t.noteId === oldNoteId
              ? { ...t, noteId: newNoteId, title: newTitle }
              : t
          ),
        })),
    }),
    {
      name: "ui-store",
      partialize: (state) => ({
        tabs: state.tabs,
        activeTabId: state.activeTabId,
      }),
      merge: (persistedState, currentState) => {
        const ps = persistedState as { tabs?: Tab[]; activeTabId?: string | null };
        if (!ps.tabs?.length) return currentState;
        return { ...currentState, ...ps };
      },
    },
  ),
);
