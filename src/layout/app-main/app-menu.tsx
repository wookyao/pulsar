import { memo, useEffect, useState } from "react";
import { Ripple } from "primereact/ripple";
import { PermissionItem } from "#/auth.api";
import useUserStore from "@/store/use-user";
import Icon from "@/components/icon";
import useActivePath from "@/internal/hooks/use-active-path";
import "./style/app-menu.less";
import cn from "@/internal/help/cn";

const AppMenu = () => {
  const { menus } = useUserStore();
  const { activeKeys, findCodes8Path } = useActivePath();
  const [openKeys, setOpenKeys] = useState<string[]>(() => activeKeys);

  useEffect(() => {
    setOpenKeys(activeKeys);
  }, [activeKeys]);

  const onChangeMenu = (menu: PermissionItem) => {
    const codes = findCodes8Path(menu.path);
    setOpenKeys(codes);
  };

  return (
    <div className="app-menu">
      <RenderMenu
        menus={menus}
        level={0}
        activeKeys={activeKeys}
        openKeys={openKeys}
        onChangeMenu={onChangeMenu}
      />
      AC：{activeKeys.join(", ")}
      <br />
      OC：{openKeys.join(", ")}
    </div>
  );
};

type RenderMenuProps = {
  menus: PermissionItem[];
  level?: number;
  activeKeys?: string[];
  openKeys?: string[];
  onChangeMenu?: (menu: PermissionItem) => void;
  hide?: boolean;
};

function RenderMenu({
  menus,
  level = 0,
  activeKeys = [],
  openKeys = [],
  onChangeMenu,
  hide = false,
}: RenderMenuProps) {
  if (!menus.length) return null;

  const baseSize = level ? 20 : 0;

  const onItemClick = (menu: PermissionItem) => {
    if (onChangeMenu) {
      onChangeMenu(menu);
    }
  };

  return (
    <ul
      className="transition-all duration-300 overflow-hidden"
      style={
        hide ? { maxHeight: 0, visibility: "hidden" } : { maxHeight: 1000 }
      }
    >
      {menus.map((menu) => {
        const hasChildren =
          Array.isArray(menu.children) && menu.children.length > 0;

        return (
          <li
            key={menu.code}
            className="rounded-3xl aria-expanded:bg-neutral-100 aria-expanded:dark:bg-neutral-600 overflow-hidden "
            aria-expanded={openKeys.includes(menu.code)}
          >
            <div
              className={cn(
                "flex items-center gap-2 py-3 px-4 rounded-3xl cursor-pointer font-normal",
                "hover:bg-neutral-200 dark:hover:bg-neutral-500 animation-hover transition-all duration-300 p-ripple",
                "aria-checked:text-blue-500 aria-checked:font-bold aria-checked:dark:text-blue-500",
                "active:bg-neutral-200  active:dark:bg-neutral-700"
              )}
              style={{
                paddingLeft: `calc(
                ${1 + Math.max(level - 1, 0) * 1}rem + ${baseSize}px + ${
                  level ? 0.5 : 0
                }rem)`,
              }}
              aria-checked={activeKeys.includes(menu.code)}
              aria-expanded={openKeys.at(-1) === menu.code}
              onClick={() => onItemClick(menu)}
            >
              {menu.icon && !menu.parentId && (
                <Icon name={menu.icon} size={20} />
              )}
              {hasChildren ? (
                <>
                  <div className="flex-1">{menu.name}</div>
                  <i
                    className="pi pi-sort-down-fill"
                    style={{ fontSize: 12 }}
                  ></i>
                </>
              ) : (
                <a href={menu.path}>{menu.name}</a>
              )}
              <Ripple />
            </div>

            {menu.children && hasChildren && (
              <RenderMenu
                hide={!openKeys.includes(menu.code)}
                menus={menu.children}
                level={level + 1}
                activeKeys={activeKeys}
                openKeys={openKeys}
                onChangeMenu={onItemClick}
              />
            )}
          </li>
        );
      })}
    </ul>
  );
}

export default memo(AppMenu);
