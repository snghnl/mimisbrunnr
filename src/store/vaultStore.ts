import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface VaultStore {
  vaultPath: string | null;
  activeNoteId: string | null;
  setVaultPath: (path: string) => void;
  setActiveNote: (id: string | null) => void;
}

export const useVaultStore = create<VaultStore>()(
  persist(
    (set) => ({
      vaultPath: null,
      activeNoteId: null,
      setVaultPath: (path) => set({ vaultPath: path }),
      setActiveNote: (id) => set({ activeNoteId: id }),
    }),
    {
      name: 'vault-store',
      partialize: (state) => ({ vaultPath: state.vaultPath }),
    },
  ),
);
