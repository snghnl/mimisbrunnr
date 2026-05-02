# 01 — Tab data model and TabBar component

Status: ready-for-human
Type: AFK
Blocked by: None — can start immediately

## What to build

Define the `Tab` union type and add tab state to `uiStore`. Replace TanStack Router's `<Outlet />` in `AppShell` with a tab-driven content renderer that mounts all open tabs and shows only the active one via CSS (`display: none` for inactive tabs, so CodeMirror instances stay alive and avoid re-initialization cost). Build a `TabBar` component that renders above the content area.

All tab state is persisted via Zustand's `persist` middleware so open tabs survive app restart.

## Acceptance criteria

- [ ] `Tab` union type defined in `types/` with variants: `{ type: 'note', id: string, noteId: string, title: string }`, `{ type: 'dashboard', id: string }`, `{ type: 'graph', id: string }`
- [ ] `uiStore` extended with: `tabs: Tab[]`, `activeTabId: string | null`, `openTab(tab)`, `closeTab(id)`, `setActiveTab(id)` — persisted to localStorage
- [ ] `AppShell` renders all open tabs as mounted DOM nodes; only the active tab is visible (`display: none` on inactive)
- [ ] `TabBar` component renders tab titles, allows clicking to switch tabs, and shows a close (×) button per tab
- [ ] With no tabs open, the main area shows an empty state (no crash)
- [ ] `openTab` is idempotent: calling it with an already-open tab focuses it rather than duplicating it (single-click behavior)
- [ ] TypeScript strict mode — no `any`

## Blocked by

None — can start immediately
