import { request } from "@/lib/request";
import { AddMenuParams, MenuTree, UpdateMenuParams } from "@/types/menu";

// /system/menu/list
const getMenuList = async () => {
  return request<MenuTree[]>("/api/system/menu/tree", {
    method: "GET",
  }).then((res) => res.data);
};

const addMenu = async (menu: AddMenuParams) => {
  return request("/api/system/menu/add", {
    method: "POST",
    data: menu,
  });
};

const updateMenu = async (menu: UpdateMenuParams) => {
  return request("/api/system/menu/update", {
    method: "PUT",
    data: menu,
  });
};

const deleteMenu = async (menuId: string) => {
  return request(`/api/system/menu/${menuId}`, {
    method: "DELETE",
  });
};

const roleAssignMenu = async (roleId: string, menuIds: string[]) => {
  return request(`/api/system/role/assign-menus`, {
    method: "POST",
    data: {
      roleId,
      menuIds,
    },
  });
};
// 拖拽排序菜单 /system/menu/order
const orderMenu = async (params: { menuId: number; targetMenuId: number | null; parentId: number }) => {
  return request('/api/system/menu/order', {
    method: 'PUT',
    data: params
  });
};

export const menuApi = {
  roleAssignMenu,
  getMenuList,
  addMenu,
  updateMenu,
  deleteMenu,
  orderMenu, // 记得导出这个函数
};
