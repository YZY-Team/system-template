import { request } from "@/lib/request";
import { Permission } from "@/types/permission";

export const getPermissionList = async ({
  pageNum,
  pageSize,
  sortField,
  sortMode,
}: {
  pageNum: number;
  pageSize: number;
  sortField: string;
  sortMode: boolean;
}) => {
  const res = await request<{
    records: Permission[];
    total: number;
  }>("/api/system/permission/page", {
    method: "POST",
    data: {
      pageNum,
      pageSize,
      sortField,
      sortMode,
    },
  });
  return res.data;
};
const getAllPermissionList = async () => {
  const res = await request<Permission[]>("/api/system/permission/list", {
    method: "GET",
  });
  return res.data;
};

const roleAssignPermission = async (roleId: string, permissionIds: string[]) => {
  return request("/api/system/permission/assign-to-role", {
    method: "POST",
    data: {
      roleId,
      permissionIds,
    },
  });
};



export const permissionApi = {
  getAllPermissionList,
  getPermissionList,
  roleAssignPermission,
};
