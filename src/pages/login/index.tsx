import { z } from "zod";
import { ChangeEvent, memo, useRef, useState } from "react";
import { useImmer } from "use-immer";
import { useNavigate } from "react-router-dom";
import { Moon, Palette, Sun } from "lucide-react";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { PermissionItem, UserLoginRes } from "#/auth.api";
import FieldError from "@/components/field-error.tsx";
import ThemeConfig from "@/components/theme-config";
import useUserStore from "@/store/use-user";
import { UserLogin } from "@/api/user.api";
import { arrayToTree } from "_/help/array-to-tree";
import { useToggleTheme } from "_/hooks/use-theme";

type LoginState = {
  identity: string;
  password: string;
};

const LoginScreen = () => {
  const toast = useRef<Toast>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useImmer<LoginState>({
    identity: "",
    password: "",
  });
  const [errors, setErrors] = useImmer<LoginState>({
    identity: "",
    password: "",
  });

  const { login, indexPath } = useUserStore();
  const navigate = useNavigate();

  const clearErrors = () => {
    setErrors((draft) => {
      draft.identity = "";
      draft.password = "";
    });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    clearErrors();

    setLoading(true);

    try {
      schema.parse(formData);

      clearErrors();
      const res = await doLogin(formData);

      if (!res) return;
      console.log("🚀 ~ onSubmit ~ res:", res);

      const [indexPathUrl, treePerms] = getRedirectUrl(res?.data ?? {});
      console.log("🚀 ~ onSubmit ~ treePerms:", treePerms);
      if (!indexPathUrl) {
        toast.current?.show({
          severity: "warn",
          summary: "警告",
          detail: "当前账号无任何权限，请联系管理员",
        });
        return;
      }

      login(res.data, treePerms, indexPathUrl);

      toast.current?.show({
        severity: "success",
        summary: "登陆成功",
        detail: `${formData.identity} 您好,欢迎回来!`,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors((draft) => {
          error.errors.forEach((item) => {
            draft[item.path[0] as keyof LoginState] = item.message || "";
          });
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const successFn = () => {
    if (indexPath) {
      navigate(indexPath, {
        replace: true,
      });
    }
  };

  return (
    <div className="h-screen  flex items-center flex-col pt-20 md:pt-72">
      <ThemeBar />
      <h1 className="text-7xl md:text-9xl font-bold leading-tight tracking-wide">
        PULSAR
      </h1>
      <h4 className="text-xl md:text-4xl tracking-normal py-2 md:py-4">
        OFFICE AUTOMATION SYSTEM
      </h4>

      <form onSubmit={onSubmit}>
        <div className="w-72 md:w-96 mt-20 md:mt-48 flex flex-col gap-6">
          <FieldError error={errors.identity}>
            <IconField className="w-full" iconPosition="left">
              <InputIcon className="pi pi-user"></InputIcon>
              <InputText
                className="w-full"
                placeholder="手机号"
                invalid={!!errors.identity}
                value={formData.identity}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setFormData((draft) => {
                    draft.identity = e.target.value;
                  })
                }
                onFocus={() => {
                  setErrors((draft) => {
                    draft.identity = "";
                  });
                }}
              />
            </IconField>
          </FieldError>

          <FieldError error={errors.password}>
            <IconField className="w-full" iconPosition="left">
              <InputIcon className="pi pi-lock"></InputIcon>
              <InputText
                className="w-full"
                type="password"
                placeholder="密码"
                invalid={!!errors.password}
                value={formData.password}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setFormData((draft) => {
                    draft.password = e.target.value;
                  })
                }
                onFocus={() => {
                  setErrors((draft) => {
                    draft.password = "";
                  });
                }}
              />
            </IconField>
          </FieldError>

          <Button
            className="mt-4"
            disabled={!formData.identity || !formData.password || loading}
            loading={loading}
            label={loading ? "登录中..." : "登 录"}
            severity="secondary"
            type="submit"
          />
        </div>
      </form>

      <Toast ref={toast} onHide={successFn} />
    </div>
  );
};

const ThemeBar = memo(() => {
  const { mode, toggleMode } = useToggleTheme();
  const [visible, setVisible] = useState(false);

  return (
    <div className="fixed top-8 right-8 px-2 py-1 rounded-full bg-neutral-50 dark:bg-neutral-800 flex items-center justify-center gap-4">
      <div className="icon-card" onClick={toggleMode}>
        {mode === "light" ? (
          <Moon size={20} data-scale />
        ) : (
          <Sun size={20} data-scale />
        )}
      </div>

      <div className="icon-card" onClick={() => setVisible(true)}>
        <Palette size={20} data-scale />
      </div>

      <ThemeConfig visible={visible} setVisible={setVisible} />
    </div>
  );
});

// zod 表单验证
const schema = z.object({
  identity: z
    .string()
    .email("请输入正确的邮箱地址")
    .or(z.string().regex(/^1[3-9]\d{9}$/, "请输入正确的手机号码")),
  password: z.string().min(6, "密码长度至少为6位"),
});

const doLogin = async (data: LoginState) => {
  const res = await UserLogin<UserLoginRes>({
    account: data.identity,
    password: data.password,
  });

  return res;
};

function getRedirectUrl(userInfo: UserLoginRes): [string, PermissionItem[]] {
  const treePerms = arrayToTree(
    userInfo.perms.sort((a, b) => a.sort! - b.sort!)
  );

  if (treePerms.length === 0) {
    return ["", []];
  }

  const item = treePerms[0] as PermissionItem;

  function getUrl(item: PermissionItem) {
    if (item.children?.length) {
      return getUrl(item.children[0]);
    }

    return item.path;
  }

  const url = getUrl(item);

  return [url, treePerms];
}

export default LoginScreen;
