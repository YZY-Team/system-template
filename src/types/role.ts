import { Menu } from "./menu";
import { Permission } from "./permission";

export type Role = {
  roleId: number;
  roleCode: string;
  roleName: string;
  description: string;
  permissions: Permission[];
  menus: Menu[];
};
