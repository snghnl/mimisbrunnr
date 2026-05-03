# Wire "New note" actions in CommandPalette and NewTabScreen to `useCreateNote`

Status: ready-for-agent

## What to build

Update the two remaining "New note" entry points in `AppShell.tsx` to use `useCreateNote` instead of the old `openTab({ type: "note", noteId: "new", title: "Untitled" })` sentinel. After this change every path that creates a new note goes through the same hook.

Key locations:
- `src/components/layout/AppShell.tsx`, `NewTabScreen` component — replace the "New note" button action
- `src/components/layout/AppShell.tsx`, `CommandPalette` component — replace the "New note" `cmdItems` action

## Acceptance criteria

- [ ] Clicking "New note" in `NewTabScreen` creates a real `Untitled N.md` file and opens it (identical behavior to `cmd+n`)
- [ ] Selecting "New note" in the command palette creates a real `Untitled N.md` file and opens it (identical behavior to `cmd+n`)
- [ ] The `noteId: "new"` sentinel is no longer referenced anywhere in the codebase

## Blocked by

- `01-create-note-hook-and-cmd-n.md`
