import { create } from 'zustand';

export type SidebarTab = 'files' | 'search' | 'tags';

interface UIStore {
  activeTab: SidebarTab;
  setActiveTab: (tab: SidebarTab) => void;
  aiPanelOpen: boolean;
  setAiPanelOpen: (open: boolean) => void;
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  activeTab: 'files',
  setActiveTab: (tab) => set({ activeTab: tab }),
  aiPanelOpen: true,
  setAiPanelOpen: (open) => set({ aiPanelOpen: open }),
  commandPaletteOpen: false,
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
}));
