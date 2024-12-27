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
      route("settings/auth/perm", "views/settings/permissions/index.tsx"),
    ]),
  ]),
] satisfies RouteConfig;
