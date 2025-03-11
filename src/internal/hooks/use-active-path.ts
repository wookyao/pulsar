import { PermissionItem } from "#/auth.api";
import useUserStore from "@/store/use-user";
import { useCallback, useEffect, useState } from "react";
import { useLocation, matchPath } from "react-router-dom";

const useActivePath = () => {
  const { user } = useUserStore();
  const location = useLocation();
  const [activeKeys, setActiveKeys] = useState<string[]>([]);

  const findCodes8Path = useCallback(
    (path: string) => {
      const recordId = user?.perms.find((item) =>
        matchPath(item.path, path)
      )?.id;

      if (recordId) {
        const codes = findParentRouteCodes(user?.perms ?? [], recordId);
        return codes;
      }

      return [];
    },
    [user?.perms]
  );

  useEffect(() => {
    const activeRoute = user?.perms.find((item) =>
      matchPath(item.path, location.pathname)
    );

    if (activeRoute?.id) {
      const codes = findParentRouteCodes(user?.perms ?? [], activeRoute?.id);

      setActiveKeys(codes);
    } else {
      setActiveKeys([]);
    }
  }, [location.pathname, user?.perms]);

  return {
    activeKeys,
    findCodes8Path,
  };
};

// 根据 给定的 记录id 获取 当前路由的 父级路由 祖父路由 祖宗路由
function findParentRouteCodes(
  permissions: PermissionItem[],
  recordId: number
): string[] {
  const list: string[] = [];

  const findRow =
    permissions.find((it) => it.id === recordId) ?? ({} as PermissionItem);

  if (findRow.id) {
    list.push(findRow.code);
    if (findRow.parentId) {
      list.unshift(...findParentRouteCodes(permissions, findRow.parentId));
    }
  }

  return list;
}

export default useActivePath;
