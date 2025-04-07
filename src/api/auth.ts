import { ApiResponse, request } from "@/lib/request";
import { Menu } from "@/types/menu";

/**
 * 登录参数
 */
export type LoginParams = {
  username: string;
  password: string;
  otp: string;
};

/**
 * 用户权限
 */
export type UserPermission = {
  role: string;
  menu: Menu[];
};
/**
 * 登录
 * @param username 用户名
 * @param password 密码
 * @param otp 验证码
 * @returns 返回登录信息
 */

export const Login = async ({ username, password, otp }: LoginParams) => {
  return request("/api/login/admin", {
    method: "POST",
    data: {
      username,
      password,
      otp,
    },
  });
};

/**
 * 获取用户权限列表
 * @returns 返回用户权限列表
 */
export const GetUserPermissionlist = async (): Promise<
  ApiResponse<UserPermission[]>
> => {
  return request<UserPermission[]>("/api/system/router/user", {
    method: "GET",
  });
};
