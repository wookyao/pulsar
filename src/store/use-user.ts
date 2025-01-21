import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { PermissionItem, UserLoginRes } from "#/auth.api";

export interface UserStore {
  user: UserLoginRes | null;
  token: string;
  menus: PermissionItem[];
  permissions: string[];
  indexPath: string;

  setUser: (user: UserLoginRes) => void;
  clearUser: () => void;
  setToken: (token: string) => void;
  setMenus: (menus: PermissionItem[]) => void;
  setPermissions: (permissions: string[]) => void;
  login: (
    user: UserLoginRes,
    menus: PermissionItem[],
    indexPath: string
  ) => void;
  logout: () => void;
}

const initialState: Pick<
  UserStore,
  "user" | "token" | "menus" | "permissions" | "indexPath"
> = {
  user: null,
  token: "",
  menus: [],
  permissions: [],
  indexPath: "",
};

const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      ...initialState,

      setUser: (user: UserLoginRes) => {
        set({ user });
      },
      clearUser: () => {
        set({ user: null });
      },

      setToken: (token: string) => {
        set({ token });
      },

      setMenus: (menus: PermissionItem[]) => {
        set({ menus });
      },
      setPermissions: (permissions: string[]) => {
        set({ permissions });
      },

      login: (
        user: UserLoginRes,
        menus: PermissionItem[],
        indexPath: string
      ) => {
        const permissions = [...new Set(user.perms.map((item) => item.code))];

        set({
          user,
          token: user.token,
          menus,
          permissions,
          indexPath,
        });
      },

      logout: () => {
        set({
          indexPath: "",
          user: null,
          token: "",
          menus: [],
          permissions: [],
        });
      },
    }),
    {
      name: "pulsar-user-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useUserStore;
