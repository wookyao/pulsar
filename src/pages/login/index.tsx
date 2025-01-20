import { z } from "zod";
import { ChangeEvent, useState } from "react";
import { useImmer } from "use-immer";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import FieldError from "@/components/field-error";

type LoginState = {
  identity: string;
  password: string;
};

const schema = z.object({
  identity: z.string().email("请输入正确的邮箱地址"),
  password: z.string().min(6, "密码长度至少为6位"),
});

const LoginScreen = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useImmer<LoginState>({
    identity: "",
    password: "",
  });
  const [errors, setErrors] = useImmer<LoginState>({
    identity: "",
    password: "",
  });

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

  return (
    <div className="h-screen flex items-center flex-col pt-20 md:pt-72">
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
                placeholder="邮箱"
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
            size="small"
            type="submit"
          />
        </div>
      </form>
    </div>
  );
};

export default LoginScreen;
