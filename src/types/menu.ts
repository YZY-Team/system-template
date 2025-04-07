export type Menu = {
  menuId: number;
  parentId: number;
  menuName: string;
  pathUrl: string;
  icon?: string;
  isExternal?: boolean;
  children?: Menu[];
};

export type MenuTree = Menu & {
  children?: MenuTree[];
};

export type AddMenuParams = {
  menuName: string;
  parentId: number;
  pathUrl: string;
};

export type UpdateMenuParams = {
  menuId: number;
  parentId: number;
  menuName: string;
  pathUrl: string;
  children?: Menu[] | null;
  icon?: string | null;
  isExternal?: boolean | null;
};
