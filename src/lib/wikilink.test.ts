import { describe, it, expect } from "vitest";
import { resolveWikilink } from "./wikilink";
import type { Note } from "@/types/note";

function makeNote(overrides: Partial<Note> & Pick<Note, "title" | "path">): Note {
  return {
    id: overrides.path,
    content: "",
    frontmatter: {},
    tags: [],
    links: [],
    backlinks: [],
    createdAt: new Date(0),
    updatedAt: new Date(0),
    ...overrides,
  };
}

const alpha = makeNote({ title: "My Note", path: "my-note.md" });
const beta = makeNote({ title: "Other Note", path: "other-note.md" });
const nested = makeNote({ title: "Nested", path: "folder/nested.md" });

describe("resolveWikilink", () => {
  it("returns null for an empty vault", () => {
    expect(resolveWikilink("My Note", [])).toBeNull();
  });

  it("returns null when no note matches", () => {
    expect(resolveWikilink("ghost", [alpha, beta])).toBeNull();
  });

  it("matches by exact title", () => {
    expect(resolveWikilink("My Note", [alpha, beta])).toBe(alpha);
  });

  it("matches by case-insensitive title when exact match absent", () => {
    expect(resolveWikilink("my note", [alpha, beta])).toBe(alpha);
  });

  it("prefers exact title match over case-insensitive match", () => {
    const lower = makeNote({ title: "my note", path: "lower.md" });
    const exact = makeNote({ title: "My Note", path: "exact.md" });
    expect(resolveWikilink("My Note", [lower, exact])).toBe(exact);
  });

  it("falls back to case-insensitive filename stem when no title matches", () => {
    const noTitleMatch = makeNote({ title: "Unrelated", path: "my-note.md" });
    expect(resolveWikilink("my-note", [noTitleMatch])).toBe(noTitleMatch);
  });

  it("filename stem match is case-insensitive", () => {
    const noTitleMatch = makeNote({ title: "Unrelated", path: "my-note.md" });
    expect(resolveWikilink("MY-NOTE", [noTitleMatch])).toBe(noTitleMatch);
  });

  it("extracts stem from nested path correctly", () => {
    expect(resolveWikilink("nested", [nested])).toBe(nested);
  });

  it("title match takes priority over filename stem match", () => {
    const byTitle = makeNote({ title: "my-note", path: "unrelated.md" });
    const byStem = makeNote({ title: "Other", path: "my-note.md" });
    expect(resolveWikilink("my-note", [byStem, byTitle])).toBe(byTitle);
  });

  it("caller passes the target without alias syntax", () => {
    // The contract: alias is stripped before calling; "My Note" (not "My Note|alias") is passed
    expect(resolveWikilink("My Note", [alpha])).toBe(alpha);
  });
});
