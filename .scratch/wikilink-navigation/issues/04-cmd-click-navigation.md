Status: needs-triage

# Cmd+click navigation for resolved wikilinks

## Parent

`.scratch/wikilink-navigation/issues/01-wikilink-prd.md`

## What to build

Wire the existing TODO stub in `Editor.tsx` to handle cmd+click on resolved wikilinks. On cmd+click, resolve the target string using the Wikilink Resolver, then call `openTab({ type: "note", noteId, title })`. The tab system already deduplicates — if that note is already open the existing tab is activated rather than a new one created. Plain click (no modifier) remains a no-op.

Add a CSS affordance so that when the user holds cmd, wikilink-decorated text shows a pointer cursor.

## Acceptance criteria

- [ ] Cmd+clicking a resolved wikilink opens that note in a tab
- [ ] If the target note is already open in a tab, that tab is activated instead of creating a duplicate
- [ ] Plain click on a wikilink does not trigger navigation
- [ ] The cursor changes to a pointer when hovering over a wikilink while holding cmd
- [ ] Clicking a resolved wikilink on a non-Mac platform (where `metaKey` is unavailable) does not break the editor

## Blocked by

- `.scratch/wikilink-navigation/issues/02-wikilink-resolver.md`
- `.scratch/wikilink-navigation/issues/03-wikilink-extension-decoration.md`
