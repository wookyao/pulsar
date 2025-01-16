import type { ComponentType, LazyExoticComponent } from "react";
import type {RouteObject} from 'react-router'

// 懒加载 component
export type LazyComponent = LazyExoticComponent<ComponentType>;


// 路由配置
export type RouteConfig = Omit<RouteObject, "element" | "children" | "Component" | "lazy"> & {
  element?: LazyComponent;
  children?: RouteConfig[];
  middlewares?: LazyComponent[];
}