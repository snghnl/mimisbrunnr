Status: done

# Wikilink Resolver — pure utility + unit tests

## Parent

`.scratch/wikilink-navigation/issues/01-wikilink-prd.md`

## What to build

Create a standalone `resolveWikilink(target: string, notes: Note[]): Note | null` utility. Given a wikilink target string and the current vault note list, it returns the matching Note or null. Resolution order: exact title match → case-insensitive title match → case-insensitive filename stem match. No side effects, no async, no framework dependencies.

Write unit tests covering all cases enumerated in the acceptance criteria below.

## Acceptance criteria

- [ ] `resolveWikilink("My Note", notes)` returns the note where `title === "My Note"` (exact match)
- [ ] `resolveWikilink("my note", notes)` returns the note where title is `"My Note"` (case-insensitive title match)
- [ ] `resolveWikilink("my-note", notes)` returns the note whose filename stem is `my-note.md` when no title match exists (filename stem fallback)
- [ ] `resolveWikilink("ghost", notes)` returns `null` when no note matches by title or filename
- [ ] `resolveWikilink("", [])` returns `null` for empty vault
- [ ] The function accepts a raw target string — the caller strips alias syntax before passing; passing `"Note Title"` (not `"Note Title|alias"`) is the contract
- [ ] Tests do not assert which internal branch was taken — only the returned value

## Blocked by

None — can start immediately
