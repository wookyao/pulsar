import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Route } from "../+types/root";
import PulsarInput from "@/components/input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { validate } from "@xmry/utils";
import http from "@/helps/http";
import type { IPermission, IUserLoginResponse } from "@/types/auth";
import useUserStore, { type UserInfoStore } from "@/store/user";
import { arrayToTree } from "@/helps/flat2Tree";
import useToast from "@/store/toast";



const loginApi = async (identity: string, password: string) => {
  const res: IUserLoginResponse = await http.post<IUserLoginResponse>('/v1/login', { account: identity, password }).catch((e) => {
    console.log(e)
    return e
  });
  return res;
};


function Login() {
  const navigate = useNavigate()
  const toast = useToast()

  const userStore = useUserStore();

  const [identity, setIdentity] = useState("");
  const [password, setPassword] = useState("");

  // 登录操作
  const onSubmit = async () => {
    const result = validateLoginParams(identity, password);

    if (!result.ok) {
      toast.info(result.message as string, {
        style: {
          borderRadius: "30px",
          background: "#333",
          color: "#fff",
        },
      });
      return;
    }

    const userInfo = await loginApi(identity, password);
    console.log(userInfo)


    const [url, treePerms] = getRedirectUrl(userInfo);

    if (!url) {
      toast.error("当前账号无任何权限，请联系管理员")
      return
    }

    const userInfoStore: UserInfoStore = {
      ...userInfo,
      treePerms,
      permCodes: [...new Set(userInfo.perms.map(item => item.code))]
    }

    userStore.setUserInfo(userInfoStore);
    userStore.setToken(userInfo?.token ?? '');

    toast.success('登录成功')

    navigate(url, { replace: true })
  };

  return (
    <div className="h-screen  flex items-center flex-col pt-20 md:pt-72">
      <h1 className="text-7xl md:text-9xl font-bold leading-tight tracking-wide">
        PULSAR
      </h1>
      <h4 className="text-xl md:text-4xl tracking-normal py-2 md:py-4">
        OFFICE AUTOMATION SYSTEM
      </h4>

      <div className="destructive group border-destructive bg-destructive text-destructive-foreground"></div>

      <div className="w-72 md:w-96 mt-20 md:mt-48 flex flex-col gap-6">
        <PulsarInput
          value={identity}
          onChange={(e) => {
            setIdentity(e.target.value);
          }}
          allowClear={true}
          placeholder="E-Mail / Phone Number"
        />
        <Input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
        />
        <Button
          disabled={!identity || !password}
          className="mt-4"
          onClick={onSubmit}
        >
          登录
        </Button>
      </div>
    </div>
  );
}

function validateLoginParams(identity: string, password: string) {
  if (!validate(identity, "Email") && !validate(identity, "CN_Phone")) {
    return {
      ok: false,
      message: "请输入正确的邮箱或手机号",
    };
  }

  if (password.length < 6) {
    return {
      ok: false,
      message: "密码长度至少为6位",
    };
  }

  return {
    ok: true,
  };
}

function getRedirectUrl(userInfo: IUserLoginResponse): [string, IPermission[]] {
  const treePerms = arrayToTree(userInfo.perms.sort((a, b) => a.sort! - b.sort!));

  if (treePerms.length === 0) {
    return ["", []]
  }

  const item = treePerms[0] as IPermission

  function getUrl(item: IPermission) {

    if (item.children?.length) {
      return getUrl(item.children[0])
    }

    return item.path

  }

  const url = getUrl(item)


  return [url, treePerms]
}

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Login - Pulsar OA" },
    { name: "description", content: "欢迎使用Pulsar OA管理系统" },
  ];
}

export default Login;
