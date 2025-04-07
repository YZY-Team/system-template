

import { AudioWaveform, Command, GalleryVerticalEnd } from "lucide-react";
import * as React from "react";

import { GetUserPermissionlist, UserPermission } from "@/api/auth";
import { NavMain } from "@/components/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useQuery } from "@tanstack/react-query";
import { TeamSwitcher } from "./team-switcher";
import { LogoutButton } from "@/components/logout-button";

/**
 * 菜单项类型
 */
type MenuArrayType = {
  path: string;
  name: string;
  component: string;
  meta: {
    title: string;
    icon: string;
    roles: string[] | null;
    permissions: string[] | null;
    hidden: boolean;
    keepAlive: boolean;
  };
  children: MenuArrayType[] | null;
};

type MenuTreeType = {
  path: string;
  name: string;
  title: string;
  icon: string;
  hidden: boolean;
  children?: MenuTreeType[];
};

/**
 * 构建菜单树
 * @param menu 菜单项数组
 * @returns 菜单树
 */
const buildMenuTree = (menu: MenuArrayType[]): MenuTreeType[] => {
  if (!menu || menu.length === 0) return [];

  return menu.map((item) => ({
    path: item.path,
    name: item.name,
    title: item.meta.title,
    icon: item.meta.icon,
    hidden: item.meta.hidden,
    ...(item.children ? { children: buildMenuTree(item.children) } : {}),
  }));
};

// 头像数据，可以不要
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: userPermissionlist }: { data?: { data?: UserPermission } } =
    useQuery({
      queryKey: ["userPermissionlist"],
      queryFn: () => GetUserPermissionlist(),
    });
  const menuTree = buildMenuTree(
    (userPermissionlist?.data ?? []) as MenuArrayType[]
  );
  console.log("userPermissionlist", userPermissionlist, menuTree);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={menuTree} />
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <LogoutButton />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
