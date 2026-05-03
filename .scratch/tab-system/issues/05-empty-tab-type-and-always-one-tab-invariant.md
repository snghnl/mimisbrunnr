# Empty tab type: add `id` and enforce always-one-tab invariant

Status: needs-triage

## What to build

Give `{ type: "empty" }` an `id: string` field so it participates in the same tab management logic as every other tab type. Then enforce the invariant that a vault always has at least one open tab: seed an empty tab on startup when `tabs` is empty, and replace the last tab with a fresh empty tab instead of reaching zero tabs.

Key locations:
- `src/types/tab.ts` — add `id: string` to the `empty` variant
- `src/store/uiStore.ts` — seed one empty tab on init; in `closeTab()`, when removing the last tab, push a new `{ type: "empty", id: crypto.randomUUID() }` instead of leaving the array empty
- `src/components/layout/components/TabBar.components.tsx` — remove the `tabs.length > 0` guard so the tab bar always renders when a vault is open

## Acceptance criteria

- [ ] `Tab` type's `empty` variant has an `id: string` field
- [ ] On app startup with no persisted tabs, one `{ type: "empty" }` tab is present with a valid UUID
- [ ] Closing the last remaining tab results in a new empty "New Tab" replacing it, not an empty `tabs` array
- [ ] The TabBar is visible whenever a vault is selected, regardless of tab count
- [ ] TypeScript strict mode passes — no `any`, no cast workarounds

## Blocked by

None — can start immediately
