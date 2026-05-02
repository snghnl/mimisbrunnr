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
}

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
      tabs: [],
      activeTabId: null,
      openTab: (tabDef: TabInput, force = false) =>
        set((state) => {
          if (!force) {
            const existing = state.tabs.find((t) => {
              if (tabDef.type === "note" && t.type === "note")
                return t.noteId === tabDef.noteId;
              return t.type === tabDef.type;
            });
            if (existing) return { activeTabId: existing.id };
          }
          const id = crypto.randomUUID();
          const newTab: Tab =
            tabDef.type === "note"
              ? { type: "note", id, noteId: tabDef.noteId, title: tabDef.title }
              : tabDef.type === "dashboard"
                ? { type: "dashboard", id }
                : { type: "graph", id };
          return { tabs: [...state.tabs, newTab], activeTabId: id };
        }),
      closeTab: (id) =>
        set((state) => {
          const filtered = state.tabs.filter((t) => t.id !== id);
          let activeTabId = state.activeTabId;
          if (activeTabId === id) {
            const idx = state.tabs.findIndex((t) => t.id === id);
            const next = filtered[idx] ?? filtered[idx - 1] ?? null;
            activeTabId = next?.id ?? null;
          }
          return { tabs: filtered, activeTabId };
        }),
      setActiveTabId: (id) => set({ activeTabId: id }),
    }),
    {
      name: "ui-store",
      partialize: (state) => ({ tabs: state.tabs, activeTabId: state.activeTabId }),
    },
  ),
);
