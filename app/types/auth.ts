export type IPermissionType = "MENU" | "BUTTON";
export type IUserStatus = 0 | 1 | 2;

export type IPermission = {
  id: number;
  name: string;
  code: string;
  type: IPermissionType;
  parentId: number;
  path: string;
  description?: string;
  icon?: string;
  component?: string;
  redirect?: string;
  disabled?: number;
  sort?: number;
  children?: IPermission[];
}

export type IRole = {
  id: number
  name: string
  permissions?: IPermission[]
}

export type IUser = {
  id: number
  account: string
  status: IUserStatus
  roles?: IRole[]
}

export type IUserLoginResponse = {
  id: number
  account: string
  status: IUserStatus
  roles: IRole[]
  token: string
  perms: IPermission[]
}

