import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@radix-ui/react-navigation-menu";
import { LockKeyhole, LogOut, Settings, User } from "lucide-react";
import { Link, Outlet } from "react-router";

const navList = [
  {
    name: "首页",
    path: "/dashboard",
    key: "dashboard",
  },
  {
    name: "审批发起",
    path: "/approval-start",
    key: "approvalStart",
  },
  {
    name: "审批中心",
    path: "/approval-center",
    key: "approvalCenter",
  },
  {
    name: "业务中心",
    path: "/business",
    key: "business",
  },
];

const AppLayout = () => {
  return (
    <div className="h-screen w-screen bg-neutral-100">
      <div className="flex align-center h-16 px-4 bg-white">
        {/* logo */}
        <Link
          className="text-black text-2xl font-bold  flex items-center tracking-wide"
          to="/dashboard"
        >
          <h1>PULSAR</h1>
        </Link>

        {/* 导航 */}
        <div className="flex-1 flex items-center justify-center cursor-pointer  gap-8 ">
          {navList.map((item) => (
            <Link
              key={item.key}
              to={item.path}
              className={navigationMenuTriggerStyle()}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* 右侧 用户头像和设置导航 */}
        <div className="ml-auto flex justify-end items-center gap-2">
          <Link
            to="/settings"
            className="flex items-center gap-1 text-sm text-slate-600 hover:text-blue-500 transition-colors"
          >
            <Settings size={16} />
            管理后台
          </Link>

          <Popover>
            <PopoverTrigger asChild>
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" alt="Pulsar" />
                <AvatarFallback>OA</AvatarFallback>
              </Avatar>
            </PopoverTrigger>
            <PopoverContent className="w-60">
              <div className="text-md font-bold text-neutral-800 pb-4 flex flex-col px-2 ">
                尼古拉斯 · 管理员
                <p className="text-xs pt-1 font-normal text-neutral-500">
                  wookyao15@gmail.com
                </p>
              </div>
              <div className="text-sm cursor-pointer   flex items-center  justify-between gap-4">
                <div className="p-2 flex flex-col items-center  justify-center hover:bg-neutral-50 rounded-xl  gap-1">
                  <User size={18} />
                  用户
                </div>
                <div className="p-2 flex flex-col items-center  justify-center hover:bg-neutral-50 rounded-xl  gap-1">
                  <LockKeyhole size={18} />
                  修改密码
                </div>

                <div className="text-red-500 p-2 flex flex-col items-center justify-center hover:bg-neutral-50 rounded-xl gap-1">
                  <LogOut size={18} />
                  登出
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <Outlet />
    </div>
  );
};

export default AppLayout;
