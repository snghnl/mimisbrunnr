import { createFileRoute } from "@tanstack/react-router";
import Editor from "@/components/editor/Editor";

export const Route = createFileRoute("/editor/$noteId")({
  component: Editor,
});
