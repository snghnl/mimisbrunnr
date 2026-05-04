Status: done

# Wikilink extension — alias parsing, resolved/unresolved decoration, code block exclusion

## Parent

`.scratch/wikilink-navigation/issues/01-wikilink-prd.md`

## What to build

Upgrade the existing CodeMirror wikilink extension to support `[[target|alias]]` syntax, visually distinguish resolved from unresolved links, render aliases as the visible label, and skip decoration inside code blocks and inline code spans.

The extension must accept the vault note list reactively via a CodeMirror `Compartment` so it can be reconfigured when the vault changes without rebuilding the editor instance. The CSS in `App.css` is updated to replace the existing `.cm-wikilink` rule with two distinct classes.

## Acceptance criteria

- [ ] `[[Note Title]]` is decorated in the editor as a resolved or unresolved wikilink depending on whether the note exists in the vault
- [ ] `[[Note Title|alias]]` is decorated with the alias text as the visible label; the raw `[[...]]` syntax is hidden
- [ ] Resolved wikilinks receive the `cm-wikilink-resolved` class (accent color, solid underline)
- [ ] Unresolved wikilinks receive the `cm-wikilink-unresolved` class (muted/dimmed color, dashed underline)
- [ ] Wikilinks inside fenced code blocks are not decorated
- [ ] Wikilinks inside inline code spans are not decorated
- [ ] When the vault note list changes (a note is added or deleted), the decoration state of all wikilinks in the editor updates without a full editor rebuild
- [ ] Plain click on a wikilink does nothing (no navigation triggered)

## Blocked by

- `.scratch/wikilink-navigation/issues/02-wikilink-resolver.md`
