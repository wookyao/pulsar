export type PermissionType = "MENU" | "BUTTON";
export type UserStatus = 0 | 1 | 2;

export type PermissionItem = {
  id: number;
  name: string;
  code: string;
  type: PermissionType;
  parentId: number;
  path: string;
  description?: string;
  icon?: string;
  component?: string;
  redirect?: string;
  disabled?: number;
  sort?: number;
  children?: PermissionItem[];
};

export type RoleItem = {
  id: number;
  name: string;
  permissions?: PermissionItem[];
};

export type UserItem = {
  id: number;
  account: string;
  status: UserStatus;
  roles?: RoleItem[];
};

export type UserLoginReq = {
  account: string;
  password: string;
};

export type UserLoginRes = {
  id: number;
  account: string;
  status: UserStatus;
  roles: RoleItem[];
  token: string;
  perms: PermissionItem[];
};
