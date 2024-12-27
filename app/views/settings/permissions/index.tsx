import { PlusIcon } from "lucide-react";
import type { Route } from "../+types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import http from "@/helps/http";
import { arrayToTree } from "@/helps/flat2Tree";
import type { IPermission } from "@/types/auth";





export async function clientLoader() {
  const permList = await permListApi()

  const treePerms = arrayToTree(permList.sort((a, b) => a.sort! - b.sort!))

  return treePerms
}


const permListApi = async () => {
  const res = await http.get<IPermission[]>("/v1/permission/list").catch((err) => {
    console.log(err)
    return []
  })
  return res
}


const Permissions = ({ loaderData }: Route.ComponentProps) => {
  const treePerms = loaderData as any as IPermission[]
  return <div className="h-full flex flex-col gap-4 py-6 px-8">
    <div className="flex justify-between items-center">
      <div className="text-xl font-bold tracking-wide">权限配置</div>
      <Button>
        <PlusIcon className="w-4 h-4" />
        新增权限
      </Button>
    </div>


    {treePerms.map((item) => {
      return <Card className="shadow-none border-none">
        <CardHeader>
          <CardTitle>{item.name}</CardTitle>
          <CardDescription>{item.description || '-'}</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card Content</p>
        </CardContent>
      </Card>
    })}


  </div>;
};

export default Permissions;
