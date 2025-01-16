import type { RouteConfig } from "#/router";
import type { RouteObject } from "react-router";
import LayImport from "@/components/lazy-import/index.tsx";


// 递归构建路由
const BuildRoutes = (routes: RouteConfig[]): RouteObject[] => {
  return routes.map((item) => {
    const { element, middlewares, children, ...rest } = item;

     // 确保 element 存在
     if (!element) {
      throw new Error("Element is required for route configuration.");
    }

    let routeObject: RouteObject = {
      ...rest,
      element:LayImport({ lazy: element })
    };

    // 递归处理子路由
    if (Array.isArray(children) && children.length > 0) {
      routeObject.children = BuildRoutes(children);
    }


    // 处理中间件
    if (Array.isArray(middlewares) && middlewares.length > 0) {

      // 中间件的执行顺序是从前往后，所以我们需要从后往前遍历
      // eg：[A, B, C] => A(B(C()))
      
      for (let i = middlewares.length - 1; i >= 0; i--) {
        const middleware = middlewares[i];
        routeObject = {
          element: LayImport({ lazy: middleware }),
          children: [routeObject],
        };
      }
    }

    // 返回参数
    return routeObject;
  });
};

export default BuildRoutes;
