import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { history, defaultKeymap, historyKeymap } from "@codemirror/commands";
import { EditorView, keymap } from "@codemirror/view";
import type { Extension } from "@codemirror/state";

export const markdownExtensions: Extension[] = [
  markdown({ base: markdownLanguage }),
  history(),
  EditorView.lineWrapping,
  keymap.of([...defaultKeymap, ...historyKeymap]),
];
