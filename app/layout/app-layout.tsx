import { LockKeyhole, LogOut, User } from "lucide-react";
import { Link, Outlet, useLocation, useNavigate } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,

} from "@/components/ui/popover";
import http from "@/helps/http";
import useToast from "@/store/toast";
import useUserStore from "@/store/user";
import type { IPermission } from "@/types/auth";



const logoutApi = async () => {
  const res = await http.post('/v1/user/logout').catch((e) => {
    console.log(e)
    return e
  })
  return res
}


const AppLayout = () => {

  const userStore = useUserStore()
  const toast = useToast()
  const navigate = useNavigate()
  const { userInfo } = userStore

  const navList = getNavList(userInfo.treePerms)

  const logout = async () => {
    const res = await logoutApi()
    userStore.logout()
    toast.success('登出成功')
    navigate('/login')
  }

  // 获取当前路径
  const pathname = useLocation().pathname

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
              data-active={pathname.startsWith(item.path) ? 'active' : ''}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* 右侧 用户头像和设置导航 */}
        <div className="ml-auto flex justify-end items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" alt="Pulsar" />
                <AvatarFallback>OA</AvatarFallback>
              </Avatar>
            </PopoverTrigger>
            <PopoverContent className="w-60">
              <div className="text-md font-bold text-neutral-800 pb-4 flex flex-col px-2 ">
                {userInfo.account}

                <div className="flex items-center gap-2 pt-2">
                  {userInfo.roles.map((item) => (

                    <>
                      <span className="text-xs font-normal text-neutral-500">{item.name}</span>
                    </>
                  ))}
                </div>

              </div>
              <div className="text-sm cursor-pointer flex items-center  justify-between gap-4 border-t border-neutral-200 pt-2">
                <div className="p-2 flex flex-col items-center  justify-center hover:bg-neutral-50 rounded-xl  gap-1">
                  <User size={18} />
                  用户
                </div>
                <div className="p-2 flex flex-col items-center  justify-center hover:bg-neutral-50 rounded-xl  gap-1">
                  <LockKeyhole size={18} />
                  修改密码
                </div>

                <div className="text-red-500 p-2 flex flex-col items-center justify-center hover:bg-neutral-50 rounded-xl gap-1" onClick={logout}>
                  <LogOut size={18} />
                  登出
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <Outlet />
    </div >
  );
};

function getNavList(treePerms: IPermission[]) {
  const navList = []

  for (const item of treePerms) {
    if (item.type === 'MENU') {
      navList.push({
        name: item.name,
        path: item.path,
        key: item.code,
        sort: item.sort
      })
    }
  }

  return navList.sort((a, b) => a.sort! - b.sort!)
}

export default AppLayout;
