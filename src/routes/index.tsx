import { createBrowserRouter, RouteObject } from "react-router-dom";
import LazyImport from "@/components/lazy-import.tsx";
import { lazy } from "react";
// import AppLayout from "@/layout/app";
import AppMain from "@/layout/app-main/index";

const commonRoutes: RouteObject[] = [
  {
    path: "/",
    element: <AppMain />,

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
