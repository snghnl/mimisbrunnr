# 03 — Dashboard and Graph as tabs

Status: needs-triage
Type: AFK
Blocked by: 01-tab-data-model-and-tab-bar

## What to build

Wire the Dashboard and Graph sidebar buttons to the tab system. Single-click focuses the existing tab or opens a new one. Cmd+click always opens a second identical tab (Dashboard and Graph allow duplicates). Both views render inside the tab-driven content area.

## Acceptance criteria

- [ ] Sidebar "Dashboard" button single-click calls `openTab({ type: 'dashboard' })` — focuses existing tab if open
- [ ] Sidebar "Graph" button single-click calls `openTab({ type: 'graph' })` — focuses existing tab if open
- [ ] Cmd+click on either button always opens a new tab (duplicates allowed)
- [ ] Dashboard and Graph tab titles are "Dashboard" and "Graph" respectively
- [ ] Both views render correctly inside the tab content renderer (no layout regressions)
- [ ] TypeScript strict mode — no `any`

## Blocked by

- `01-tab-data-model-and-tab-bar`
