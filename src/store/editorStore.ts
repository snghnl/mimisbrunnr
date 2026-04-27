import { create } from 'zustand';

interface EditorStore {
  isFocused: boolean;
  setFocused: (focused: boolean) => void;
}

export const useEditorStore = create<EditorStore>((set) => ({
  isFocused: false,
  setFocused: (focused) => set({ isFocused: focused }),
}));
