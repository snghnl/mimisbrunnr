import {
  createHashHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import AppShell from "@/components/layout/AppShell";
import Dashboard from "@/components/dashboard/Dashboard";
import Editor from "@/components/editor/Editor";
import GraphView from "@/components/graph/GraphView";

const rootRoute = createRootRoute({ component: AppShell });

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Dashboard,
});

export const editorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/editor/$noteId",
  component: Editor,
});

const graphRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/graph",
  component: GraphView,
});

const routeTree = rootRoute.addChildren([indexRoute, editorRoute, graphRoute]);

const hashHistory = createHashHistory();

export const router = createRouter({ routeTree, history: hashHistory });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
