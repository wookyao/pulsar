import { UserLoginReq } from "#/user.api";
import { fetchClient } from "@/help/fetch-client";

export const UserLogin = (data: UserLoginReq) => {
  return fetchClient.post("/v1/login", data);
};
