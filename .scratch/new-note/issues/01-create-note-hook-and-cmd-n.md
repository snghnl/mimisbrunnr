# `useCreateNote` hook + wire to `cmd+n`

Status: ready-for-agent

## What to build

Create a `useCreateNote` hook that immediately creates a real `.md` file in the vault before opening a tab. Wire it to the `cmd+n` / `ctrl+n` hotkey.

The naming convention: the first untitled note is `Untitled.md`. If that already exists at vault root, the next is `Untitled 2.md`, then `Untitled 3.md`, and so on (no number on the first, ascending integer from 2 onward).

End-to-end flow:
1. User presses `cmd+n`
2. Hook reads the vault file list from the TanStack Query cache (`queryClient.getQueryData(["vault", vaultPath])`)
3. Computes the next unique name at vault root (root-level files only; subdirectory collisions are ignored)
4. Calls `invoke("write_note", { path: fullPath, content: "" })` to create an empty file
5. Calls `queryClient.invalidateQueries({ queryKey: ["vault", vaultPath] })` to refresh the sidebar file list
6. Calls `openTab({ type: "note", noteId, title })` with the real relative path
7. `Editor` receives the real path, queries `read_note`, gets `""`, and CodeMirror mounts with an empty document

Key locations:
- New file: `src/hooks/useCreateNote.ts`
- `src/hooks/useGlobalHotkeys.ts` — replace `openTab({ type: "note", noteId: "new", title: "Untitled" })` with `createNote()`

## Acceptance criteria

- [ ] Pressing `cmd+n` creates `Untitled.md` at vault root when no untitled note exists
- [ ] Pressing `cmd+n` again creates `Untitled 2.md`, then `Untitled 3.md`, etc.
- [ ] The new note tab opens immediately and CodeMirror renders an empty editor (no "Could not load note." error, no black screen)
- [ ] The sidebar file list refreshes to include the new note
- [ ] The `noteId: "new"` sentinel is no longer used by the hotkey handler

## Blocked by

None — can start immediately.
