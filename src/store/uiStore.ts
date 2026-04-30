import { create } from "zustand";

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
}

export const useUIStore = create<UIStore>((set) => ({
  activeTab: "files",
  setActiveTab: (tab) => set({ activeTab: tab }),
  aiPanelOpen: true,
  setAiPanelOpen: (open) => set({ aiPanelOpen: open }),
  commandPaletteOpen: false,
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
  expandedDirs: new Set(),
  focusedDir: null,
  expandDir: (path) =>
    set((state) => ({ expandedDirs: new Set([...state.expandedDirs, path]) })),
  focusDir: (path) => set({ focusedDir: path }),
  clearFocusedDir: () => set({ focusedDir: null }),
}));
