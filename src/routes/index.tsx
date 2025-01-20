import { createBrowserRouter, RouteObject } from "react-router-dom";
import LazyImport from "@/components/lazy-import";
import { lazy } from "react";
import AppLayout from "@/layout/app";

const commonRoutes: RouteObject[] = [
  {
    path: "/",
    element: <AppLayout />,

    children: [
      {
        path: "dashboard",
        element: (
          <LazyImport lazy={lazy(() => import("@/pages/dashboard/index"))} />
        ),
      },
    ],
  },
  {
    path: "/login",
    element: <LazyImport lazy={lazy(() => import("@/pages/login/index"))} />,
  },
];

const router = createBrowserRouter(commonRoutes, {
  basename: import.meta.env.VITE_ROUTER_BASE,
});

export default router;
