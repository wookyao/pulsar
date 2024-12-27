import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router";
import { cn } from "@/lib/utils";
import useUserStore from "@/store/user";
import type { IPermission } from "@/types/auth";
import Icon from "@/components/icon";
import type { icons } from "lucide-react";

const SettingLayout = () => {
  const userStore = useUserStore();

  const pathname = useLocation().pathname;
  const [perm, setPerm] = useState<IPermission | undefined>(undefined);

  useEffect(() => {
    const pathPerm = userStore.pathPerm(pathname);
    setPerm(pathPerm);
  }, [pathname]);

  return (
    <div className="flex  h-full ">
      <div className="w-52 bg-white">
        <div className="px-3 py-9">
          {renderNavList(perm?.children || [], pathname, 0)}
        </div>
      </div>

      <div className="flex-1 ">
        <Outlet />
      </div>
    </div>
  );
};

function navLinkStyle() {
  return `
    text-base tracking-wide  py-2 rounded-none hover:bg-neutral-100 
    hover:text-blue-600 hover:rounded-lg transition-all duration-300 cursor-pointer 
    data-[active=active]:bg-blue-500 data-[active=active]:text-white data-[active=active]:rounded-lg
  `;
}

function renderNavList(
  treePerm: IPermission[],
  pathname: string,
  level: number = 0
) {
  return (
    <>
      {treePerm.map((item) => {
        if (item.type === "MENU") {
          const hasChildren = !!item?.children?.length;

          return (
            <div
              className={`flex flex-col ${level === 0 ? "mb-6" : ""}`}
              key={item.code}
            >
              {hasChildren ? (
                <div
                  className={`text-sm text-neutral-400 
                    ${level === 0 ? "pr-3 pb-3" : "px-5 py-2"}`
                  }
                >
                  {item.name}
                </div>
              ) : (
                <div
                  className={cn(
                    navLinkStyle(),
                    `${level === 0 ? "px-2" : "px-4"} flex items-center gap-2`
                  )}
                  data-active={pathname.startsWith(item.path) ? "active" : ""}
                >
                  <Icon size={14} name={item.icon as string} />
                  <NavLink to={item.path}>{item.name}</NavLink>
                </div>
              )}
              {hasChildren &&
                renderNavList(item.children || [], pathname, level + 1)}
            </div>
          );
        }

        return null;
      })}
    </>
  );
}

export default SettingLayout;
