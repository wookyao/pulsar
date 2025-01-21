import { UserLoginReq } from "#/auth.api";
import { fetchClient } from "@/help/fetch-client";

export const UserLogin = <T>(data: UserLoginReq) => {
  return fetchClient.post<T>("/v1/login", data);
};
