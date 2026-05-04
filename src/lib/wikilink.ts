import type { Note } from "@/types/note";

function stem(path: string): string {
  const filename = path.split("/")[path.split("/").length - 1] ?? path;
  return filename.endsWith(".md") ? filename.slice(0, -3) : filename;
}

export function resolveWikilink(target: string, notes: Note[]): Note | null {
  return (
    notes.find((n) => n.title === target) ??
    notes.find((n) => n.title.toLowerCase() === target.toLowerCase()) ??
    notes.find((n) => stem(n.path).toLowerCase() === target.toLowerCase()) ??
    null
  );
}
