import type { IPermission, IUserLoginResponse } from "@/types/auth";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";


export interface UserInfoStore extends IUserLoginResponse {
  treePerms: IPermission[],
  permCodes: string[]
}

export interface UserState {
  userInfo: UserInfoStore;
  token: string;
}

export interface UserActions {
  setUserInfo: (userInfo: UserInfoStore) => void;
  setToken: (token: string) => void;
  logout: () => void
}

const initialUserInfo: UserInfoStore = {
  id: 0,
  account: "",
  status: 0,
  roles: [],
  token: "",
  perms: [],
  treePerms: [],
  permCodes: []
}

const useUserStore = create<UserState & UserActions>()(
  persist(
    (set) => ({
      userInfo: initialUserInfo,
      token: "",

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
