import { createFileRoute } from "@tanstack/react-router";
import Editor from "@/components/editor/Editor";

export const Route = createFileRoute("/editor/$noteId")({
  component: EditorPage,
});

function EditorPage() {
  const { noteId } = Route.useParams();
  return <Editor noteId={decodeURIComponent(noteId)} />;
}
