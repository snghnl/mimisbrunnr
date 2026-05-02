# 01 — Extract StatusBar component

Status: done
Blocked by: None — can start immediately

## What to build

Move the inline status bar JSX from `AppShell.tsx` (lines 532–566) into a new component at `src/components/layout/StatusBar.tsx`. Keep all current hardcoded values intact — this is a pure extraction, no behaviour change.

## Acceptance criteria

- [x] `src/components/layout/StatusBar.tsx` exists and renders the same UI as the current inline block
- [x] `AppShell.tsx` renders `<StatusBar />` in place of the inline JSX
- [x] No visual difference before and after

## Blocked by

None — can start immediately
