Status: needs-triage

# PRD: Wikilink `[[...]]` Parsing and Cmd+Click Navigation

## Problem Statement

Notes in Mimisbrunnr are connected through `[[wikilink]]` syntax — the backbone of a PKMS. Currently the editor renders wikilinks as plain text with basic styling, and clicking them does nothing. Users have no way to follow connections between notes from inside the editor, which breaks the core knowledge-graph experience and forces them to navigate through the sidebar manually.

## Solution

When a user writes `[[Note Title]]` or `[[Note Title|alias]]` in the editor, the link is styled to show whether the target note exists in the vault (resolved) or not (unresolved). Cmd+clicking a resolved link opens that note in a tab. Cmd+clicking an unresolved link creates a new note with that title and immediately opens it — enabling the Obsidian-style "write first, fill in later" workflow.

## User Stories

1. As a note author, I want `[[Note Title]]` to be visually highlighted in the editor, so that I can see at a glance which links are present in my note.
2. As a note author, I want resolved wikilinks (where the target note exists) to appear in the accent color, so that I know I can follow them.
3. As a note author, I want unresolved wikilinks (where the target note does not exist) to appear in a distinct muted style, so that I can identify gaps in my knowledge graph.
4. As a note author, I want to cmd+click a resolved wikilink to open the target note in a tab, so that I can navigate between connected notes without leaving the editor.
5. As a note author, I want cmd+clicking a resolved wikilink to reuse an already-open tab for that note rather than opening a duplicate, so that my workspace does not get cluttered.
6. As a note author, I want to cmd+click an unresolved wikilink to create a new note with that title and open it immediately, so that I can expand my knowledge graph without breaking my writing flow.
7. As a note author, I want `[[Note Title|display alias]]` syntax to be supported, so that I can control the visible label of a link independently from the target note title.
8. As a note author, I want the alias text (not the target) to be shown as the visible label of the link in the editor, so that prose reads naturally.
9. As a note author, I want wikilink resolution to be case-insensitive, so that `[[my note]]` resolves to `My Note.md` without exact-case matching.
10. As a note author, I want wikilinks to be resolved by note title first, and by filename stem as a fallback, so that I can use either the YAML title or the filename to identify a note.
11. As a note author, I want the editor to update the resolved/unresolved state of all wikilinks when I add or delete notes in the vault, so that stale styling does not mislead me.
12. As a note author, I want clicking a wikilink with a plain click (no modifier) to do nothing, so that selecting text around a link does not accidentally trigger navigation.
13. As a note author, I want the cursor to change to a pointer when I hover over a wikilink while holding cmd, so that I have a clear affordance that it is clickable.
14. As a note author, I want newly created notes from unresolved wikilinks to be created in the vault root by default, so that the creation flow requires no extra input.
15. As a note author, I want newly created notes to be pre-populated with an H1 heading matching the wikilink target, so that the title is immediately set when I land in the new note.
16. As a note author, I want wikilinks inside code blocks and inline code spans to not be decorated or clickable, so that technical content is not misinterpreted as links.

## Implementation Decisions

### Modules

**1. Wikilink Syntax Extension** (modify existing)
- Extend the regex from `[[target]]` to also capture `[[target|alias]]`
- Accept the live vault note list as a parameter to classify each link as resolved or unresolved at decoration time
- Apply `cm-wikilink-resolved` or `cm-wikilink-unresolved` CSS classes accordingly
- Render the alias text as the visible label when present (via a replacement decoration, not the raw bracket syntax)
- Handle `metaKey` (cmd) in the click event handler — plain click does nothing, cmd+click fires the navigation callback
- Skip decoration inside CodeMirror `codeblock` and `inlineCode` token ranges

**2. Wikilink Resolver** (new, pure function — deep module)
- Interface: `resolveWikilink(target: string, notes: Note[]): Note | null`
- Resolution order: exact title match → case-insensitive title match → case-insensitive filename stem match
- No side effects, no async, no framework dependencies — a plain TypeScript utility

**3. Navigation Handler** (modify `Editor.tsx`)
- Replace the existing TODO stub with: resolve target → if resolved, `openTab({ type: "note", noteId, title })`; if unresolved, invoke `write_note` to create the file, then `openTab`
- New note creation uses the target string as the H1 heading and filename (slugified if needed)
- After creation, the vault query is invalidated so the new note appears in the file tree

**4. CSS Visual States**
- `cm-wikilink-resolved`: accent color, solid underline, pointer cursor on cmd-hover
- `cm-wikilink-unresolved`: muted/dimmed color, dashed underline, pointer cursor on cmd-hover
- Existing `.cm-wikilink` rule in `App.css` is split into the two new classes

### Architectural Notes
- The wikilink extension must receive the note list reactively — pass it via a CodeMirror `Compartment` so the extension can be reconfigured without rebuilding the editor instance when the vault changes
- Wikilink resolution is a read operation on already-loaded TanStack Query data; it does not trigger its own query
- New note creation follows the same Tauri `write_note` invoke pattern used by the editor's autosave
- The resolver is kept as a standalone utility (not a hook) so it can be imported in both the extension and any future indexing pipeline

## Testing Decisions

**What makes a good test here:** test the external contract of the module, not its internals. For the resolver, that means: given a target string and a note list, assert the correct note is returned (or null). Do not test which branch was taken internally.

**Modules to test:**
- **Wikilink Resolver** — unit tests covering: exact match, case-insensitive title match, filename stem fallback, no match returns null, alias syntax does not affect resolution (target is always the lookup key), empty vault returns null

**Prior art:** look for existing utility tests in the codebase for pattern reference.

**Not tested at unit level:**
- The CodeMirror extension (requires a DOM/editor environment — integration territory)
- The navigation handler in Editor.tsx (interaction-level, better covered by manual QA or e2e)

## Out of Scope

- Wikilink autocomplete / typeahead while typing `[[` (tracked separately in CONTEXT.md)
- Backlink panel showing which notes link to the current note
- Graph view updates triggered by wikilink changes
- Subdirectory-aware link resolution (e.g. `[[folder/note]]`)
- Transclusion (`![[note]]` embed syntax)
- Hover preview popover of the linked note's content
- Renaming a note and auto-updating all wikilinks that reference it

## Further Notes

- The `WikiLink` interface in `types/note.ts` already includes `alias?: string` and `resolved: boolean`, so the type layer needs no schema changes — only the parsing and decoration logic needs to populate these fields correctly.
- Cmd+click is the chosen interaction (not single click) to preserve normal text selection behavior inside the editor.
- The resolved/unresolved distinction depends on the vault's indexed note list being available to the editor — ensure the query is passed down to the extension on each re-render when the vault changes.
