import { EditorView } from "@codemirror/view";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags } from "@lezer/highlight";
import type { Extension } from "@codemirror/state";

const editorTheme = EditorView.theme({
  "&": {
    background: "transparent",
    color: "var(--m-text)",
  },
  ".cm-scroller": {
    fontFamily: "var(--m-serif)",
    fontSize: "17px",
    lineHeight: "1.7",
    overflow: "visible",
  },
  ".cm-content": {
    caretColor: "var(--m-accent)",
    padding: "0",
  },
  ".cm-cursor, .cm-dropCursor": {
    borderLeftColor: "var(--m-accent)",
    borderLeftWidth: "2px",
  },
  ".cm-selectionBackground, &.cm-focused .cm-selectionBackground": {
    background:
      "color-mix(in oklch, var(--m-accent) 25%, transparent) !important",
  },
  ".cm-line": {
    padding: "0",
  },
  "&.cm-focused": {
    outline: "none",
  },
  ".cm-gutters": {
    display: "none",
  },
});

const highlightStyle = HighlightStyle.define([
  {
    tag: tags.heading1,
    fontWeight: "500",
    fontSize: "2.2em",
    lineHeight: "1.12",
    letterSpacing: "-0.5px",
    color: "var(--m-text)",
  },
  {
    tag: tags.heading2,
    fontWeight: "500",
    fontSize: "1.3em",
    letterSpacing: "-0.25px",
    color: "var(--m-text)",
  },
  {
    tag: tags.heading3,
    fontWeight: "500",
    fontSize: "1.1em",
    color: "var(--m-text)",
  },
  { tag: tags.strong, fontWeight: "600", color: "var(--m-text)" },
  { tag: tags.emphasis, fontStyle: "italic", color: "var(--m-text-2)" },
  { tag: tags.link, color: "var(--m-accent)" },
  { tag: tags.url, color: "var(--m-accent)" },
  {
    tag: tags.monospace,
    fontFamily: "var(--m-mono)",
    fontSize: "0.88em",
    color: "var(--m-text-2)",
  },
  {
    tag: tags.processingInstruction,
    color: "var(--m-text-4)",
    fontFamily: "var(--m-mono)",
    fontSize: "0.88em",
  },
  {
    tag: tags.meta,
    color: "var(--m-text-4)",
    fontFamily: "var(--m-mono)",
    fontSize: "0.88em",
  },
  { tag: tags.comment, color: "var(--m-text-4)" },
]);

export const mimisbrunnrTheme: Extension = [
  editorTheme,
  syntaxHighlighting(highlightStyle),
];
