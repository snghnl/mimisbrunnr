import { useRef, useEffect } from "react";
import { EditorView } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { mimisbrunnrTheme } from "./extensions/theme";
import { markdownExtensions } from "./extensions/markdown";
import { wikilinkExtensions } from "./extensions/wikilink";

interface Props {
  value: string;
  onChange?: (value: string) => void;
  onWikilinkClick?: (target: string) => void;
}

export default function CodeMirrorEditor({
  value,
  onChange,
  onWikilinkClick,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const onChangeRef = useRef(onChange);
  const onWikilinkClickRef = useRef(onWikilinkClick);

  useEffect(() => {
    onChangeRef.current = onChange;
  });
  useEffect(() => {
    onWikilinkClickRef.current = onWikilinkClick;
  });

  useEffect(() => {
    if (!containerRef.current) return;

    const view = new EditorView({
      state: EditorState.create({
        doc: value,
        extensions: [
          mimisbrunnrTheme,
          ...markdownExtensions,
          ...wikilinkExtensions((t) => onWikilinkClickRef.current?.(t)),
          EditorView.updateListener.of((update) => {
            if (update.docChanged) {
              onChangeRef.current?.(update.state.doc.toString());
            }
          }),
        ],
      }),
      parent: containerRef.current,
    });

    viewRef.current = view;
    return () => {
      view.destroy();
      viewRef.current = null;
    };
    // intentionally empty — editor initializes once with initial value
    // eslint-disable-next-line react-hooks/exhaustive-deps
  });

  return <div ref={containerRef} style={{ width: "100%" }} />;
}
