Status: done

# Delete note via right-click in sidebar

## What to build

Right-clicking a note in the sidebar FileTree opens a context menu with a "Delete" action. Selecting it shows a confirmation dialog; confirming permanently removes the note file from disk, closes any open tabs that reference that note, and refreshes the vault file list.

This slice establishes the foundational `NoteContextMenu` wrapper component and the Rust `delete_note` command that all subsequent context-menu slices build on.

## Acceptance criteria

- [x] Rust `delete_note` command accepts a file path and deletes the file from disk, returning an error if the file does not exist
- [x] Right-clicking a `NoteItem` in the sidebar opens a context menu
- [x] The context menu contains a "Delete" action styled as destructive
- [x] Activating "Delete" opens a confirmation `AlertDialog` before any destructive action occurs
- [x] Confirming deletion removes the file from disk via the Tauri command
- [x] Any open tabs referencing the deleted note are closed automatically
- [x] If the deleted note was the active note, `activeNoteId` is cleared
- [x] The vault file list refreshes (TanStack Query invalidation) after deletion
- [x] Cancelling the confirmation dialog leaves the note untouched
- [x] Rust `delete_note` command has unit tests covering: successful deletion, missing file error

## Blocked by

None — can start immediately.
