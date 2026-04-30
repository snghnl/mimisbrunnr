import { ViewPlugin, Decoration, EditorView } from "@codemirror/view";

import type { DecorationSet, ViewUpdate } from "@codemirror/view";

import { RangeSetBuilder } from "@codemirror/state";
import type { Extension } from "@codemirror/state";

const WIKILINK_RE = /\[\[([^\]]+)\]\]/g;

function buildDecorations(view: EditorView): DecorationSet {
  const builder = new RangeSetBuilder<Decoration>();

  for (const { from, to } of view.visibleRanges) {
    const text = view.state.doc.sliceString(from, to);
    WIKILINK_RE.lastIndex = 0;
    let match: RegExpExecArray | null = WIKILINK_RE.exec(text);
    while (match !== null) {
      const start = from + match.index;
      const end = start + match[0].length;
      builder.add(
        start,
        end,
        Decoration.mark({
          class: "cm-wikilink",
          attributes: { "data-target": match[1] },
        }),
      );
      match = WIKILINK_RE.exec(text);
    }
  }

  return builder.finish();
}

export function wikilinkExtensions(
  onWikilinkClick?: (target: string) => void,
): Extension[] {
  const plugin = ViewPlugin.fromClass(
    class {
      decorations: DecorationSet;

      constructor(view: EditorView) {
        this.decorations = buildDecorations(view);
      }

      update(update: ViewUpdate) {
        if (update.docChanged || update.viewportChanged) {
          this.decorations = buildDecorations(update.view);
        }
      }
    },
    { decorations: (v) => v.decorations },
  );

  const clickHandler = EditorView.domEventHandlers({
    click(event) {
      const el = (event.target as HTMLElement).closest(
        ".cm-wikilink",
      ) as HTMLElement | null;
      if (!el || !onWikilinkClick) return false;
      const target = el.getAttribute("data-target");
      if (target) {
        onWikilinkClick(target);
        return true;
      }
      return false;
    },
  });

  return [plugin, clickHandler];
}
