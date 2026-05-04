Status: needs-triage

# Cmd+click create-and-open for unresolved wikilinks

## Parent

`.scratch/wikilink-navigation/issues/01-wikilink-prd.md`

## What to build

Extend the cmd+click handler (from issue 04) to handle unresolved wikilinks. When the resolver returns null, invoke `write_note` to create a new `.md` file in the vault root with the wikilink target as the filename, pre-populated with an H1 heading matching the target. Then open the new note in a tab and invalidate the vault query so the file tree reflects the new file.

## Acceptance criteria

- [ ] Cmd+clicking an unresolved wikilink creates a new note in the vault root
- [ ] The new note's filename is derived from the wikilink target (e.g. `[[My Idea]]` → `My Idea.md`)
- [ ] The new note's content is pre-populated with `# My Idea` as the opening H1
- [ ] The new note opens immediately in a tab after creation
- [ ] The file tree updates to show the new note without requiring a manual refresh
- [ ] If a note with that filename already exists (race condition), no duplicate is created and the existing note is opened instead

## Blocked by

- `.scratch/wikilink-navigation/issues/04-cmd-click-navigation.md`
