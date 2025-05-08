import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Role } from "@/types/role";
import { Menu, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { MenuTree } from "@/types/menu";
import { useQuery } from "@tanstack/react-query";
import { menuApi } from "@/api/menu";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

// 添加递归菜单组件
function MenuTreeItem({
  menu,
  selectedMenus,
  onMenuChange,
  level = 0,
  readOnly = false,
}: {
  menu: MenuTree;
  selectedMenus: number[];
  onMenuChange: (menuId: number) => void;
  level?: number;
  readOnly?: boolean;
}) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="space-y-1">
      <div className={cn("flex items-center space-x-2", level > 0 && "ml-6")}>
        {menu.children?.length ? (
          <ChevronRight
            className={cn(
              "h-4 w-4 shrink-0 transition-transform duration-200 cursor-pointer",
              expanded && "rotate-90"
            )}
            onClick={() => setExpanded(!expanded)}
          />
        ) : (
          <div className="w-4" />
        )}
        <Checkbox
          id={`menu-${menu.menuId}`}
          checked={selectedMenus.includes(menu.menuId)}
          onCheckedChange={() => onMenuChange(menu.menuId)}
          disabled={readOnly}
        />
        <label
          htmlFor={`menu-${menu.menuId}`}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {menu.menuName}
          <p className="text-xs text-muted-foreground">{menu.pathUrl}</p>
        </label>
      </div>
      {expanded && menu.children && menu.children.length > 0 && (
        <div className="pt-1">
          {menu.children.map((child) => (
            <MenuTreeItem
              key={child.menuId}
              menu={child}
              selectedMenus={selectedMenus}
              onMenuChange={onMenuChange}
              level={level + 1}
              readOnly={readOnly}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface AssignMenusDialogProps {
  role: Role;
}

// 添加转换函数
function buildMenuTree(menus: MenuTree[]): MenuTree[] {
  const menuMap = new Map<number, MenuTree>();
  const rootMenus: MenuTree[] = [];

  // 先创建所有菜单的副本
  menus.forEach((menu) => {
    menuMap.set(menu.menuId, { ...menu });
  });

  // 根据 parentId 构建树形结构
  menus.forEach((menu) => {
    const currentMenu = menuMap.get(menu.menuId)!;
    if (menu.parentId === 0) {
      rootMenus.push(currentMenu);
    } else {
      const parentMenu = menuMap.get(menu.parentId);
      if (parentMenu) {
        if (!parentMenu.children) {
          parentMenu.children = [];
        }
        parentMenu.children.push(currentMenu);
      }
    }
  });

  return rootMenus;
}

export function AssignMenusDialog({ role }: AssignMenusDialogProps) {
  const [open, setOpen] = useState(false);
  const [readOnly, setReadOnly] = useState(true);
  
  // 获取所有菜单列表
  const { data: menuList } = useQuery({
    queryKey: ["menuList"],
    queryFn: menuApi.getMenuList,
  });

  const [selectedMenus, setSelectedMenus] = useState<number[]>(
    role.menus.map((m) => m.menuId)
  );

  // 构建树形结构
  const menuTree = menuList ? buildMenuTree(menuList) : [];

  const handleMenuChange = (menuId: number) => {
    setSelectedMenus((current) =>
      current.includes(menuId)
        ? current.filter((id) => id !== menuId)
        : [...current, menuId]
    );
  };

  // 添加保存处理函数
  const handleSave = async () => {
    try {
      await menuApi.roleAssignMenu(role.roleId.toString(), selectedMenus.map(String));
      setOpen(false);
    } catch (error) {
      console.error("Failed to assign menus:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 px-2">
          <Menu className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>分配菜单 - {role.roleName}</DialogTitle>
          <div className="flex items-center space-x-2 pt-2">
            <Switch
              id="edit-mode"
              checked={!readOnly}
              onCheckedChange={(checked) => setReadOnly(!checked)}
            />
            <Label htmlFor="edit-mode">
              {readOnly ? "查看模式" : "编辑模式"}
            </Label>
          </div>
        </DialogHeader>
        <div className="py-4 space-y-2">
          {menuTree.map((menu) => (
            <MenuTreeItem
              key={menu.menuId}
              menu={menu}
              selectedMenus={selectedMenus}
              onMenuChange={handleMenuChange}
              readOnly={readOnly}
            />
          ))}
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            取消
          </Button>
          <Button 
            onClick={handleSave}
            disabled={readOnly}
          >
            保存
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}