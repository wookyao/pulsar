import type { IUser } from "@/types/auth";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface UserState {
  id: number;
  account: string;
  token: string;
}

export interface UserActions {
  setUserInfo: (userInfo: IUser) => void;
  setToken: (token: string) => void;
  logout: () => void
}

const useUserStore = create<UserState & UserActions>()(
  persist(
    (set) => ({
      id: 0,
      account: "",
      token: "",
      setUserInfo: (userInfo: IUser) =>
        set((state) => ({
          ...state,
          id: userInfo.id,
          account: userInfo.account,
        })),
      setToken: (token: string) =>
        set((state) => ({
          ...state,
          token,
        })),
      logout: () =>
        set((state) => ({
          ...state,
          id: 0,
          account: "",
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
