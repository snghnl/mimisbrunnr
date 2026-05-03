Status: done

# Inline rename note via right-click

## What to build

Right-clicking a note in the sidebar FileTree exposes a "Rename" action. Activating it switches the `NoteItem` title into an editable input field in place. Committing the new name renames the file on disk, updates the active note ID, and reflects the new title in any open tabs.

## Acceptance criteria

- [x] Rust `rename_note` command accepts `old_path` and `new_path`, renames the file on disk, and returns an error if the source does not exist or the target already exists
- [x] Right-click context menu on a `NoteItem` includes a "Rename" action
- [x] Activating "Rename" replaces the note title in the sidebar with an inline text input pre-filled with the current name
- [x] Pressing Enter or blurring the input commits the rename
- [x] Pressing Escape cancels the rename without changes
- [x] After rename, the vault file list refreshes (TanStack Query invalidation)
- [x] Any open tab referencing the note updates its displayed title
- [x] `activeNoteId` is updated to the new path if the renamed note was active
- [x] Rust `rename_note` command has unit tests covering: successful rename, missing source error, target-already-exists error

## Blocked by

- `.scratch/note-context-menu/issues/01-delete-note-right-click.md` (NoteContextMenu component and Rust command infrastructure)
