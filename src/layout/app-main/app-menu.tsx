import { memo } from "react";
import { PermissionItem } from "#/auth.api";
import useUserStore from "@/store/use-user";
import Icon from "@/components/icon";
import "./style/app-menu.less";
import { Ripple } from "primereact/ripple";

const AppMenu = () => {
  const { menus } = useUserStore();

  return (
    <div className="app-menu">
      <RenderMenu menus={menus} level={0} activePath="" />
    </div>
  );
};

type RenderMenuProps = {
  menus: PermissionItem[];
  level?: number;
  activePath?: string;
};

function RenderMenu({ menus, level = 0, activePath = "" }: RenderMenuProps) {
  if (!menus.length) return null;

  const baseSize = level ? 20 : 0;

  return (
    <ul>
      {menus.map((menu) => {
        const hasChildren =
          Array.isArray(menu.children) && menu.children.length > 0;

        return (
          <li
            key={menu.code}
            className="rounded-3xl bg-neutral-100 dark:bg-neutral-600 overflow-hidden"
          >
            <div
              className="flex items-center gap-2 py-3 px-4 rounded-3xl hover:bg-neutral-200 dark:hover:bg-neutral-500 animation-hover cursor-pointer transition-all duration-300 p-ripple"
              style={{
                paddingLeft: `calc(
                ${1 + Math.max(level - 1, 0) * 1}rem + ${baseSize}px + ${
                  level ? 0.5 : 0
                }rem)`,
              }}
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
                menus={menu.children}
                level={level + 1}
                activePath={activePath}
              />
            )}
          </li>
        );
      })}
    </ul>
  );
}

export default memo(AppMenu);
