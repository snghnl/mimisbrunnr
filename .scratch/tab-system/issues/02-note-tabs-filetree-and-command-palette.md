# 02 — Note tabs wired to FileTree and Command Palette

Status: needs-triage
Type: AFK
Blocked by: 01-tab-data-model-and-tab-bar

## What to build

Wire note-opening actions to the tab system. Single-clicking a note focuses its existing tab or opens a new one. Cmd+clicking always opens a new tab (even if the note is already open). When no tabs are open, the main area shows an empty state with an "Open a note" prompt. Closing the last tab returns to the empty state.

## Acceptance criteria

- [ ] `NoteItem` single-click in `FileTree` calls `openTab({ type: 'note', noteId })` — focuses existing tab if already open
- [ ] `NoteItem` Cmd+click always opens a new tab regardless of whether the note is already open
- [ ] Command palette note selection follows the same single-click behavior (focus existing or open new)
- [ ] Tab title shows the note filename (last path segment, no extension)
- [ ] When all tabs are closed, the content area renders an empty state with an "Open a note" prompt (no crash, no blank screen)
- [ ] Closing a note tab removes it from the tab bar; if it was active, the adjacent tab becomes active
- [ ] `vaultStore.activeNoteId` stays in sync with the active note tab
- [ ] TypeScript strict mode — no `any`

## Blocked by

- `01-tab-data-model-and-tab-bar`
