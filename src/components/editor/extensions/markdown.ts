import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { history, defaultKeymap, historyKeymap } from "@codemirror/commands";
import { EditorView, keymap } from "@codemirror/view";
import { Prec, type Extension } from "@codemirror/state";

export const markdownExtensions: Extension[] = [
  markdown({ base: markdownLanguage }),
  history(),
  EditorView.lineWrapping,
  // Prevent CodeMirror from consuming Cmd+G so it bubbles to useGlobalHotkeys.
  // Defensive: guards against a future searchKeymap addition swallowing the event.
  Prec.highest(keymap.of([{ key: "Mod-g", run: () => false }])),
  keymap.of([...defaultKeymap, ...historyKeymap]),
];
