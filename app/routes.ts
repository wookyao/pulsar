import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("login", "auth/login.tsx"),
  layout("layout/app-layout.tsx", [
    route("dashboard", "views/dashboard/index.tsx"),
    layout("layout/setting-layout.tsx", [
      route("settings/basic/dict", "views/settings/index.tsx"),
    ]),
  ]),
] satisfies RouteConfig;
