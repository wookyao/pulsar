import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("login", "auth/login.tsx"),
  layout("layout/app-layout.tsx", [route("dashboard", "dashboard/index.tsx")]),
] satisfies RouteConfig;
