# Render empty tab content as NewTabScreen (editor as default view)

Status: needs-triage

## What to build

When the active tab is `{ type: "empty" }`, render the existing `NewTabScreen` component inside the tab content area. This replaces the current pattern where `NewTabScreen` is shown as a standalone fallback outside the tab system.

Opening a note, dashboard, or graph from `NewTabScreen` should replace the empty tab in-place (i.e. call `openTab()` with `force: false`), consistent with the navigate-current-tab behavior from issue 04.

Key locations:
- `src/components/layout/AppShell.tsx` — add a render case for `tab.type === "empty"` that mounts `<NewTabScreen />`; remove the standalone `NewTabScreen` fallback that bypasses the tab system
- `NewTabScreen` action buttons — ensure they call `openTab()` with `force: false` so the empty tab is replaced rather than stacked

## Acceptance criteria

- [ ] When a "New Tab" (empty) tab is active, `NewTabScreen` renders inside the normal editor content area
- [ ] Selecting a note from `NewTabScreen` replaces the empty tab with a note tab
- [ ] Opening Dashboard or Graph from `NewTabScreen` replaces the empty tab with the respective tab type
- [ ] No standalone `NewTabScreen` fallback exists outside the tab/tabId system
- [ ] Hotkeys `Cmd+N`, `Cmd+D`, `Cmd+G` still work correctly (they open new tabs, not replacing the empty tab, since they use `force: true` or create a net-new tab)

## Blocked by

- `05-empty-tab-type-and-always-one-tab-invariant.md`
