import { useState } from "react";
import PulsarInput from "@/components/input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { validate } from "@xmry/utils";
import { toast } from "react-hot-toast";

let toastId: string | null = null;

function Login() {
  const [identity, setIdentity] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = () => {
    const result = validateLoginParams(identity, password);
    if (!result.ok) {
      if (toastId) {
        toast.dismiss(toastId);
      }
      toastId = toast(result.message, {
        style: {
          borderRadius: "30px",
          background: "#333",
          color: "#fff",
        },
      });
      return;
    }
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

export default Login;
