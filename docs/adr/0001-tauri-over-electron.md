# ADR-0001: Tauri over Electron

**Status:** Accepted

## Context

Mimisbrunnr is a local desktop application. Both Tauri and Electron are cross-platform desktop frameworks that can host a React frontend.

## Decision

Use **Tauri v2** as the desktop framework.

## Rationale

- Smaller bundle size — Tauri ships without bundling a full Chromium instance
- Lower memory footprint — the Rust backend consumes significantly less RAM than Node.js
- Stronger security model — Tauri's capability system restricts what the frontend can access by default

## Consequences

- Rust is required for any native functionality; contributors need a Rust toolchain
- Rust code is scoped exclusively to native concerns: file I/O, file watching, system tray
- All other logic lives in the TypeScript/React layer
