import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";
import { useVaultStore } from "@/store/vaultStore";
import { useUIStore } from "@/store/uiStore";

export function useCreateNote() {
  const { vaultPath } = useVaultStore();
  const openTab = useUIStore((s) => s.openTab);
  const queryClient = useQueryClient();

  return useCallback(async ({ force = false }: { force?: boolean } = {}) => {
    if (!vaultPath) return;

    const existingPaths =
      queryClient.getQueryData<string[]>(["vault", vaultPath]) ?? [];
    const rootFiles = existingPaths.filter((p) => !p.includes("/"));

    let noteId = "Untitled.md";
    let n = 2;
    while (rootFiles.includes(noteId)) {
      noteId = `Untitled ${n}.md`;
      n++;
    }

    const title = noteId.replace(/\.md$/, "");
    await invoke("write_note", { path: `${vaultPath}/${noteId}`, content: "" });
    queryClient.invalidateQueries({ queryKey: ["vault", vaultPath] });
    openTab({ type: "note", noteId, title }, force);
  }, [vaultPath, openTab, queryClient]);
}
