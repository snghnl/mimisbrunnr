Status: done

# Extra note context menu actions: Duplicate, Copy Path, Reveal in Finder

## What to build

Extend the `NoteContextMenu` with three additional utility actions available in both the FileTree and tab bar: Duplicate Note, Copy File Path, and Reveal in Finder. These are non-destructive and require no confirmation.

## Acceptance criteria

- [x] Rust `duplicate_note` command accepts a source path, creates a copy with a unique name (e.g. `Note copy.md`, `Note copy 2.md`), and returns the new file path
- [x] Rust `reveal_in_finder` command accepts a file path and opens the parent directory in macOS Finder (or the OS file manager on other platforms)
- [x] "Duplicate Note" appears in the note context menu; activating it creates the copy, refreshes the vault, and opens the new note in a tab
- [x] "Copy File Path" writes the absolute file path to the system clipboard; no confirmation or feedback toast required
- [x] "Reveal in Finder" opens the file's parent directory in the OS file manager
- [x] A visual separator groups destructive actions (Rename, Delete) apart from utility actions (Duplicate, Copy Path, Reveal in Finder)

## Blocked by

- `.scratch/note-context-menu/issues/01-delete-note-right-click.md` (NoteContextMenu component)
