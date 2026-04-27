import { create } from 'zustand';

interface VaultStore {
  vaultPath: string | null;
  activeNoteId: string | null;
  setVaultPath: (path: string) => void;
  setActiveNote: (id: string | null) => void;
}

export const useVaultStore = create<VaultStore>((set) => ({
  vaultPath: null,
  activeNoteId: null,
  setVaultPath: (path) => set({ vaultPath: path }),
  setActiveNote: (id) => set({ activeNoteId: id }),
}));
