import { ViewPlugin, Decoration, EditorView, WidgetType } from "@codemirror/view";
import type { DecorationSet, ViewUpdate } from "@codemirror/view";
import { RangeSetBuilder, StateEffect, StateField } from "@codemirror/state";
import type { Extension } from "@codemirror/state";
import { syntaxTree } from "@codemirror/language";

const WIKILINK_RE = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;

const CODE_NODES = new Set([
  "FencedCode",
  "CodeBlock",
  "InlineCode",
  "Code",
]);

export const setWikilinkNotes = StateEffect.define<string[]>();

const notePathsField = StateField.define<string[]>({
  create: () => [],
  update: (paths, tr) => {
    for (const effect of tr.effects) {
      if (effect.is(setWikilinkNotes)) return effect.value;
    }
    return paths;
  },
});

function stemOf(path: string): string {
  const filename = path.split("/").pop() ?? path;
  return filename.endsWith(".md") ? filename.slice(0, -3) : filename;
}

function isResolved(target: string, notePaths: string[]): boolean {
  const t = target.toLowerCase();
  return notePaths.some((p) => stemOf(p).toLowerCase() === t);
}

function isInCode(view: EditorView, pos: number): boolean {
  let node = syntaxTree(view.state).resolveInner(pos, 1);
  for (;;) {
    if (CODE_NODES.has(node.type.name)) return true;
    if (!node.parent) break;
    node = node.parent;
  }
  return false;
}

class WikilinkWidget extends WidgetType {
  constructor(
    readonly label: string,
    readonly target: string,
    readonly resolved: boolean,
  ) {
    super();
  }

  toDOM(): HTMLElement {
    const span = document.createElement("span");
    span.className = this.resolved
      ? "cm-wikilink-resolved"
      : "cm-wikilink-unresolved";
    span.textContent = this.label;
    span.setAttribute("data-target", this.target);
    return span;
  }

  eq(other: WikilinkWidget): boolean {
    return (
      other.label === this.label &&
      other.target === this.target &&
      other.resolved === this.resolved
    );
  }
}

function buildDecorations(view: EditorView): DecorationSet {
  const notePaths = view.state.field(notePathsField);
  const builder = new RangeSetBuilder<Decoration>();

  for (const { from, to } of view.visibleRanges) {
    const text = view.state.doc.sliceString(from, to);
    WIKILINK_RE.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = WIKILINK_RE.exec(text)) !== null) {
      const start = from + match.index;
      const end = start + match[0].length;

      if (isInCode(view, start)) continue;

      const target = match[1];
      const alias = match[2] as string | undefined;
      const resolved = isResolved(target, notePaths);
      const cls = resolved ? "cm-wikilink-resolved" : "cm-wikilink-unresolved";

      if (alias) {
        builder.add(
          start,
          end,
          Decoration.replace({
            widget: new WikilinkWidget(alias, target, resolved),
          }),
        );
      } else {
        builder.add(
          start,
          end,
          Decoration.mark({
            class: cls,
            attributes: { "data-target": target },
          }),
        );
      }
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
        if (
          update.docChanged ||
          update.viewportChanged ||
          update.startState.field(notePathsField) !==
            update.state.field(notePathsField)
        ) {
          this.decorations = buildDecorations(update.view);
        }
      }
    },
    { decorations: (v) => v.decorations },
  );

  const clickHandler = EditorView.domEventHandlers({
    click(event) {
      if (!event.metaKey) return false;
      const el = (event.target as HTMLElement).closest(
        ".cm-wikilink-resolved, .cm-wikilink-unresolved",
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

  return [notePathsField, plugin, clickHandler];
}
