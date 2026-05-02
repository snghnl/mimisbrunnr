import { create } from 'zustand';

interface Cursor {
  line: number;
  col: number;
}

interface EditorStore {
  isFocused: boolean;
  setFocused: (focused: boolean) => void;
  cursor: Cursor | null;
  setCursor: (cursor: Cursor | null) => void;
}

export const useEditorStore = create<EditorStore>((set) => ({
  isFocused: false,
  setFocused: (focused) => set({ isFocused: focused }),
  cursor: null,
  setCursor: (cursor) => set({ cursor }),
}));
