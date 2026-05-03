export type Tab =
  | { type: "empty"; id: string }
  | { type: "note"; id: string; noteId: string; title: string }
  | { type: "dashboard"; id: string }
  | { type: "graph"; id: string };

export type TabInput =
  | { type: "note"; noteId: string; title: string }
  | { type: "dashboard" }
  | { type: "graph" }
  | { type: "empty" };
