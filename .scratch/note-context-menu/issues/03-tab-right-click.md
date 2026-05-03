Status: done

# Right-click context menu on tabs

## What to build

Right-clicking a note tab in the `TabBar` opens a context menu with tab management actions: Rename, Delete, Close, Close Others, and Close All Tabs to the Right. The note-mutating actions (Rename, Delete) reuse the same `NoteContextMenu` component from the FileTree. The tab-management actions operate on `uiStore` tab state.

## Acceptance criteria

- [x] Right-clicking a note tab opens a context menu
- [x] "Rename" and "Delete" actions function identically to the FileTree context menu
- [x] "Close" closes the current tab (equivalent to the existing close button)
- [x] "Close Others" closes all tabs except the one right-clicked
- [x] "Close All to the Right" closes all tabs ordered after the right-clicked tab
- [x] Right-clicking a non-note tab (dashboard, graph) shows only the tab-management actions, not Rename/Delete
- [x] Context menu does not appear on the empty/placeholder tab

## Blocked by

- `.scratch/note-context-menu/issues/01-delete-note-right-click.md` (NoteContextMenu component)
