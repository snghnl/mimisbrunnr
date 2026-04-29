import { createFileRoute } from "@tanstack/react-router";
import GraphView from "@/components/graph/GraphView";

export const Route = createFileRoute("/graph")({
  component: GraphView,
});
