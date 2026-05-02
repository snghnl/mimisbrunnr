# 02 — Wire real cursor position (Ln / Col) from CodeMirror

Status: done
Blocked by: 01-extract-statusbar-component.md

## What to build

Extend `editorStore` with a `cursor: { line: number; col: number }` field. Add a CodeMirror `updateListener` in `Editor.tsx` that dispatches cursor changes to the store. `StatusBar` reads from `editorStore` and renders live `Ln N, Col N` instead of the hardcoded value.

## Acceptance criteria

- [x] `editorStore` exposes `cursor: { line: number; col: number }` and `setCursor()`
- [x] Moving the caret in the editor updates the store
- [x] StatusBar displays the live line/col, updating on every cursor move
- [x] When no note is open, StatusBar shows a neutral fallback (e.g. `Ln –, Col –`)

## Blocked by

- Extract StatusBar component (issue 01)
