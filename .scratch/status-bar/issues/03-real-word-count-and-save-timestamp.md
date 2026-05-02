# 03 — Real word count and save timestamp in status meta

Status: done
Blocked by: 01-extract-statusbar-component.md

## What to build

Replace the hardcoded `statusMeta` string in `AppShell.tsx` with live values: word count derived from the note content already in TanStack Query cache, and a `lastSavedAt` timestamp tracked in `editorStore` after each successful `write_note` mutation. Move this logic into `StatusBar`.

## Acceptance criteria

- [x] Word count is computed from the active note's content and updates when the note changes
- [x] `lastSavedAt` is set on every successful `write_note` mutation and displayed as a relative time (e.g. `saved 2m ago`)
- [x] When no note is open, the left side of the status bar is empty
- [x] No hardcoded word count, read time, or timestamp strings remain

## Blocked by

- Extract StatusBar component (issue 01)
