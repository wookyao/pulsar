import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { IPermission, IUserLoginResponse } from "@/types/auth";

export interface UserInfoStore extends IUserLoginResponse {
  treePerms: IPermission[];
  permCodes: string[];
}

export interface UserState {
  userInfo: UserInfoStore;
  token: string;
  pathPerm: (pathname: string) => IPermission | undefined;
}

export interface UserActions {
  setUserInfo: (userInfo: UserInfoStore) => void;
  setToken: (token: string) => void;
  logout: () => void;
}

const initialUserInfo: UserInfoStore = {
  id: 0,
  account: "",
  status: 0,
  roles: [],
  token: "",
  perms: [],
  treePerms: [],
  permCodes: [],
};

const useUserStore = create<UserState & UserActions>()(
  persist(
    (set, get) => ({
      userInfo: initialUserInfo,
      token: "",
      pathname: "",
      pathPerm: (pathname: string) => {
        const pathnameArr = pathname.split("/");
        pathname = `/${pathnameArr[1]}`;

        const state = get();
        return state.userInfo.treePerms.find((perm) => perm.path === pathname);
      },

      setUserInfo: (userInfo: UserInfoStore) =>
        set((state) => ({
          ...state,
          userInfo,
        })),
      setToken: (token: string) =>
        set((state) => ({
          ...state,
          token,
        })),
      logout: () =>
        set((state) => ({
          ...state,
          userInfo: initialUserInfo,
          token: "",
        })),
    }),
    {
      name: "pulsar-user",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useUserStore;
