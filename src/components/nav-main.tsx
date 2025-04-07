

import { ChevronRight } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

import { Link, useLocation } from "react-router-dom";


type NavItem = {
  name: string;
  path: string;
  title: string;
  icon: string;
  hidden: boolean;
  children?: NavItem[];
};

export function NavMain({ items }: { items: NavItem[] }) {
  const location = useLocation();
  const pathname = location.pathname;

  const isActive = (item: NavItem) => {
    return (
      pathname === item.path ||
      item.children?.some((child) => pathname === child.path)
    );
  };

  const isTopLevel = (item: NavItem) => {
    return !item.children?.length;
  };

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          if (item.hidden) return null;

          return isTopLevel(item) ? (
            <Link to={`/system${item.path}`} key={item.path}>
              <SidebarMenuButton tooltip={item.title} isActive={isActive(item)}>
                <span>{item.title}</span>
              </SidebarMenuButton>
            </Link>
          ) : (
            <Collapsible key={item.path} asChild className="group/collapsible">
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={isActive(item)}
                  >
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent className="CollapsibleContent">
                  <SidebarMenuSub>
                    {item.children?.map(
                      (subItem) =>
                        !subItem.hidden && (
                          <SidebarMenuSubItem key={subItem.path}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={isActive(subItem)}
                            >
                              <Link to={`/system${subItem.path}`}>
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        )
                    )}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
