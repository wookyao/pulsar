import { memo } from "react";
import { Link } from "react-router-dom";
import { PermissionItem } from "#/auth.api";
import { Avatar } from "primereact/avatar";
import { Menubar } from "primereact/menubar";
import { MenuItem } from "primereact/menuitem";
import useUserStore from "@/store/use-user";
import Icon from "@/components/icon";

function AppHeader() {
  const { menus, indexPath } = useUserStore();
  console.log("🚀 ~ TemplateDemo ~ menus:", menus);

  const items = genItems8Menus(menus);
  console.log("🚀 ~ AppHeader ~ items:", items);

  return (
    <Menubar
      model={items}
      start={
        <Link to={indexPath}>
          <h1 className="text-xl md:text-2xl font-bold cursor-pointer">
            PULSAR OA
          </h1>
        </Link>
      }
      end={<HeaderAvatar />}
      className="p-3 bg-white shadow-sm"
      pt={{
        root: {
          className: "flex justify-between gap-4",
        },
        menu: {
          className: "flex-1 ",
        },
      }}
    />
  );
}

const HeaderAvatar = memo(() => {
  return (
    <div className="flex items-center justify-center cursor-pointer">
      <Avatar image="/amyelsner.png" shape="circle" size="large" />
    </div>
  );
});

function genItems8Menus(menus: PermissionItem[]): MenuItem[] {
  const list: MenuItem[] = [];

  menus.forEach((item) => {
    const row: MenuItem = {
      label: item.name,
    };

    if (item.icon) {
      row.icon = <Icon className="mr-2" size={16} name={item.icon} />;
    }

    if (Array.isArray(item.children) && item.children.length > 0) {
      row.items = genItems8Menus(item.children);
    }

    if (!item.children) {
      row.url = item.path;
    }

    list.push(row);
  });

  return list;
}

export default AppHeader;
