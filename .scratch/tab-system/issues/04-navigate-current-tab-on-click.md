# Navigate current tab on note click; open new tab only on Cmd+click

Status: needs-triage

## What to build

Change the default note-opening behavior so that a plain click navigates the currently active tab to the selected note, rather than finding-or-creating a separate tab. Cmd/Ctrl+click should still always open a new tab.

This applies to all three entry points:
- **FileTree** (`src/components/sidebar/FileTree.tsx`) — note item click
- **Sidebar nav buttons** (`src/components/sidebar/Sidebar.tsx`) — Dashboard and Graph buttons
- **Command palette** (`src/components/layout/AppShell.tsx`) — note selection

The core change lives in `openTab()` in `src/store/uiStore.ts`: when `force` is `false`, replace the active tab's content in-place instead of searching for an existing tab or appending a new one. When `force` is `true` (Cmd/Ctrl held), keep the existing "always create new tab" behavior.

## Acceptance criteria

- [ ] Clicking a note in the FileTree replaces the current active tab's content with that note
- [ ] Cmd+click (or Ctrl+click) on a note in the FileTree opens it in a new tab
- [ ] Selecting a note from the command palette replaces the current active tab
- [ ] Clicking Dashboard or Graph in the sidebar replaces the current active tab
- [ ] Cmd+click on Dashboard or Graph opens them in a new tab
- [ ] If no tab is open yet, clicking a note creates a new tab (graceful fallback)
- [ ] Existing tab-switching behavior (clicking a tab header) is unaffected

## Blocked by

None — can start immediately
