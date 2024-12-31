import { useCallback, useEffect, useState, memo } from "react";
import { PlusIcon, ChevronRight } from "lucide-react";
import { useImmer } from "use-immer";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Route } from "../+types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import Icon from "@/components/icon";
import Input from "@/components/input";
import IconSelect from "@/components/icon/select";
import http from "@/helps/http";
import { arrayToTree } from "@/helps/flat2Tree";
import type { IPermission } from "@/types/auth";

type PermType = Omit<IPermission, "disabled" | "children"> & {
  disabled: boolean;
  children?: PermType[];
};

// 客户端加载
export async function clientLoader() {
  const permList = await permListApi();

  const list = permList.map((item) => ({
    ...item,
    disabled: item.disabled === 1,
  })) as PermType[];

  const treePerms = arrayToTree(list.sort((a, b) => a.sort! - b.sort!));

  return treePerms;
}

// 正则 字符串只能包含字母 数字 汉字  且不能以数字和空格开头
const nameRegex = /^[a-zA-Z\u4e00-\u9fa5][a-zA-Z0-9\u4e00-\u9fa5]*$/;
// 正则 code 只能包含字母 数字 _ - : 且不能以数字和空格开头
const codeRegex = /^[a-zA-Z][a-zA-Z0-9_:-]*$/;

// 获取权限列表
const permListApi = async () => {
  const res = await http
    .get<IPermission[]>("/v1/permission/list")
    .catch((err) => {
      console.log(err);
      return [];
    });
  return res;
};

// 初始化 权限 info
const InitPermInfo: PermType = {
  id: -1,
  name: "",
  code: "",
  // 类型 必填 MENU/BUTTON
  type: "MENU",
  parentId: 0,
  path: "",
  description: "",
  icon: "",
  component: "",
  redirect: "",
  // 是否禁用 0-启用 1-禁用
  disabled: false,
  sort: 0,
};

// 权限管理 页面
// 权限列表
const Permissions = ({ loaderData }: Route.ComponentProps) => {
  const [visible, setVisible] = useState(false);
  const [permInfo, setPermInfo] = useImmer<PermType>(InitPermInfo);

  const treePerms = loaderData as any as PermType[];

  // 新增权限
  const handlerNew = useCallback(() => {
    onNewPerm({ parentId: -1 });
  }, []);

  const onNewPerm = ({ parentId }: { parentId: number }) => {
    setPermInfo(InitPermInfo);

    if (parentId > 0) {
      setPermInfo((draft) => {
        draft.parentId = parentId;
      });
    } else {
      setPermInfo(InitPermInfo);
    }

    setVisible(true);
  };

  const onDeletePerm = ({ id }: { id: number }) => {
    console.log(id);
  };

  const onUpdatePerm = (perm: PermType) => {
    setPermInfo(perm);
    setVisible(true);
  };

  return (
    <div className="h-full flex flex-col gap-4 py-6 px-8">
      <div className="flex justify-between items-center">
        <div className="text-xl font-bold tracking-wide">权限配置</div>
        <Button onClick={handlerNew}>
          <PlusIcon className="w-4 h-4" />
          新增权限
        </Button>
      </div>

      <div className="grid grid-cols-1  2xl:grid-cols-3 gap-4">
        {treePerms.map((item) => {
          return (
            <Card className="shadow-none border-none" key={item.id}>
              <CardHeader>
                <CardTitle>{item.name}</CardTitle>
                <CardDescription>{item.description || "-"}</CardDescription>
              </CardHeader>
              <CardContent>
                <RenderPerms
                  treePerms={item.children || []}
                  level={0}
                  onNewPerm={onNewPerm}
                  onDeletePerm={onDeletePerm}
                  onUpdatePerm={onUpdatePerm}
                />
              </CardContent>
            </Card>
          );
        })}
      </div>

      <EditPermMemo
        visible={visible}
        setVisible={setVisible}
        permInfo={permInfo}
      />
    </div>
  );
};

// 新增编辑权限 Sheet
interface EditPermProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  permInfo: PermType;
}

// 表单验证 schema
const formSchema = z.object({
  name: z
    .string()
    .regex(nameRegex, {
      message: "权限名称不能包含特殊字符",
    })
    .min(2, { message: "权限名称不能为空" })
    .max(50, {
      message: "权限名称最多50个字符",
    }),
  description: z.string().max(200, { message: "权限描述最多200个字符" }),
  code: z
    .string()
    .regex(codeRegex, { message: "权限编码格式不正确" })
    .min(2, { message: "权限编码不能为空" })
    .max(50, { message: "权限编码最多50个字符" }),
  type: z.enum(["MENU", "BUTTON"], {
    message: "权限类型必填",
  }),
  path: z.string().max(200, { message: "权限路径最多200个字符" }),
  icon: z.string().max(50, { message: "权限图标最多50个字符" }),
  disabled: z.boolean(),
  sort: z.number().min(0, { message: "排序必须大于等于0" }),
});

function EditPerm({ visible, setVisible, permInfo }: EditPermProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...permInfo,
    },
  });

  useEffect(() => {
    form.reset(permInfo);
  }, [permInfo]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log(data);
  };

  return (
    <Sheet open={visible} onOpenChange={setVisible}>
      <SheetContent side={"left"}>
        <SheetHeader>
          <SheetTitle>{permInfo.id > 0 ? "编辑" : "新增"}权限</SheetTitle>
          <SheetDescription>
            <span className="text-xs text-neutral-500">
              务必确保更改有意且有效。请仔细审查，确认无误后点击 “保存”按钮。
            </span>
          </SheetDescription>
        </SheetHeader>

        <div className="pt-12">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>名称</FormLabel>
                    <FormControl>
                      <Input placeholder="请输入" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="flex flex-col ">
                    <FormLabel>描述</FormLabel>
                    <FormControl>
                      <Textarea placeholder="请输入" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>编码</FormLabel>
                    <FormControl>
                      <Input placeholder="请输入" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>类型</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="请选择" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="MENU">菜单</SelectItem>
                        <SelectItem value="BUTTON">按钮</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.getValues().type === "MENU" && (
                <>
                  <FormField
                    control={form.control}
                    name="path"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>路径</FormLabel>
                        <FormControl>
                          <Input placeholder="请输入" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sort"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>排序</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="请输入权限排序"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="icon"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>图标</FormLabel>
                          <FormDescription>
                            选择图标，用于前端展示
                          </FormDescription>
                        </div>
                        <FormControl>
                          <div>
                            <IconSelect
                              value={field.value}
                              onChange={field.onChange}
                            />
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </>
              )}

              <FormField
                control={form.control}
                name="disabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>状态</FormLabel>
                      <FormDescription>
                        开启后权限将被禁用，无法访问
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <SheetFooter>
                <Button variant="secondary">取消</Button>
                <Button type="submit">保存</Button>
              </SheetFooter>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
const EditPermMemo = memo(EditPerm);

// 递归渲染权限
interface RenderPermsProps {
  treePerms: PermType[];
  level?: number;
  onNewPerm: ({ parentId }: { parentId: number }) => void;
  onDeletePerm: ({ id }: { id: number }) => void;
  onUpdatePerm: (perm: PermType) => void;
}

function RenderPerms({
  treePerms,
  level = 0,
  onNewPerm,
  onDeletePerm,
  onUpdatePerm,
}: RenderPermsProps) {
  if (treePerms.length === 0) {
    return null;
  }

  const gutter = 12 * level;

  return (
    <div style={{ marginLeft: gutter }}>
      {treePerms.map((item) => {
        const hasChildren = !!item?.children?.length;

        const isTopLevel = level === 0 || hasChildren;

        return (
          <div key={item.id}>
            <div className="flex items-center justify-between mb-2">
              {isTopLevel && (
                <Icon size={16} name="GripVertical" className="mr-2" />
              )}
              <div
                className={`flex-1 flex align-center ${
                  isTopLevel ? "bg-neutral-100 cursor-pointer" : ""
                } p-2 group`}
              >
                <div>{item.name}</div>
                <div className="ml-auto flex items-center text-neutral-500 opacity-0 group-hover:opacity-100 transition-all">
                  <Icon
                    size={16}
                    name="PencilLine"
                    className="cursor-pointer hover:text-blue-600"
                    onClick={() => onUpdatePerm(item)}
                  />
                  {item.type === "MENU" && (
                    <Icon
                      size={16}
                      name="Plus"
                      className="cursor-pointer ml-2 hover:text-blue-600"
                      onClick={() => onNewPerm({ parentId: item.id })}
                    />
                  )}
                  <Icon
                    size={16}
                    name="Trash2"
                    color="red"
                    className={`cursor-pointer ml-2 ${
                      hasChildren ? "hidden" : ""
                    }`}
                    onClick={() => onDeletePerm({ id: item.id })}
                  />
                </div>
              </div>
            </div>
            {hasChildren && (
              <div className="ml-4">
                <RenderPerms
                  treePerms={item.children!}
                  level={level + 1}
                  onNewPerm={onNewPerm}
                  onDeletePerm={onDeletePerm}
                  onUpdatePerm={onUpdatePerm}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default Permissions;
