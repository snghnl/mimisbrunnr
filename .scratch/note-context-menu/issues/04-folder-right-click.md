Status: done

# Folder right-click context menu in sidebar

## What to build

Right-clicking a folder in the sidebar FileTree opens a context menu with folder-scoped actions: New Note Inside, Rename Folder, and Delete Folder. Deleting a folder that contains notes shows a warning and closes any affected tabs.

## Acceptance criteria

- [x] Rust `create_note_in_dir` command accepts a directory path and a note title, creates a new `.md` file in that directory, and returns the new file path
- [x] Rust `rename_dir` command accepts `old_path` and `new_path`, renames the directory, and returns an error if the source does not exist or target already exists
- [x] Rust `delete_dir` command accepts a directory path and deletes it recursively, returning an error if the path does not exist
- [x] Right-clicking a `FolderItem` in the sidebar opens a folder context menu
- [x] "New Note Inside" creates an untitled note in the folder, adds it to the vault, and opens it in a new tab
- [x] "Rename" switches the folder label to an inline editable input; committing renames the folder on disk and refreshes the vault
- [x] "Delete Folder" shows a confirmation dialog warning that all contained notes will be deleted
- [x] Confirming deletion removes the folder and all contents from disk, closes any affected open tabs, and refreshes the vault
- [x] All three Rust commands have unit tests covering success and common error paths

## Blocked by

- `.scratch/note-context-menu/issues/01-delete-note-right-click.md` (NoteContextMenu component and Rust command infrastructure)
