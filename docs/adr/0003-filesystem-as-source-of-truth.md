# ADR-0003: File System as Source of Truth

**Status:** Accepted

## Context

Mimisbrunnr needs to store notes. Options include: database-primary (store in SQLite, export to files), file-primary (store as `.md` files, index in SQLite), or hybrid with a canonical source.

## Decision

**`.md` files on disk are the canonical source of truth.** SQLite is a derived cache and search index only.

## Rationale

- Notes are interoperable with any editor (Obsidian, VS Code, etc.) without export
- No data lock-in — the vault is just a folder the user already owns
- Aligns with the local-first principle; files survive database corruption
- Users can back up, version-control, or sync notes with any tool they choose

## Consequences

- Any write to a `.md` file must trigger a SQLite sync (via file watcher)
- SQLite must be treated as rebuildable at any time from the file system
- SQLite must never be the only place a piece of data lives
- Editing files outside the app must not break consistency
