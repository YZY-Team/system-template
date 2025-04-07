

import { menuApi } from "@/api/menu";
import { MenuTree } from "@/types/menu";
import { useQuery } from "@tanstack/react-query";
import { MenuDragItem } from "./_components/menu-drag-item";
import { AddMenuDialog } from "./_components/add-menu-dialog";
import { useDrop } from "react-dnd";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const SystemMenuComponents = () => {
  const queryClient = useQueryClient();
  const { data: menuList } = useQuery<MenuTree[]>({
    queryKey: ["menuList"],
    queryFn: menuApi.getMenuList,
  });

  const orderMutation = useMutation({
    mutationFn: menuApi.orderMenu,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menuList"] });
      queryClient.invalidateQueries({ queryKey: ["userPermissionlist"] });
    },
  });

  const handleDrop = async (dragId: number, hoverId: number | null, asChild: boolean = false, isBefore: boolean = true) => {
    // 如果是拖到顶级
    if (hoverId === null) {
      await orderMutation.mutateAsync({
        menuId: dragId,
        targetMenuId: isBefore ? menuList?.[0]?.menuId || null : null,
        parentId: 0,
      });
      return;
    }

    // 找到目标菜单的父级ID
    const findParentId = (menuId: number, menus: MenuTree[] = []): number => {
      for (const menu of menus) {
        if (menu.menuId === menuId) return 0;
        if (menu.children?.length) {
          for (const child of menu.children) {
            if (child.menuId === menuId) return menu.menuId;
          }
          const found = findParentId(menuId, menu.children);
          if (found !== -1) return found;
        }
      }
      return -1;
    };

    // 如果是作为子项
    if (asChild) {
      await orderMutation.mutateAsync({
        menuId: dragId,
        targetMenuId: null,
        parentId: hoverId,
      });
      return;
    }

    // 作为兄弟项
    const parentId = findParentId(hoverId, menuList);
    await orderMutation.mutateAsync({
      menuId: dragId,
      targetMenuId: isBefore ? hoverId : null,
      parentId: parentId,
    });
  };

  const topLevelRef = useRef<HTMLDivElement>(null);
  const [hoverClientY, setHoverClientY] = useState<number>(0);
  const [hoverMiddleY, setHoverMiddleY] = useState<number>(0);

  const [{ isOverTop }, topLevelDropRef] = useDrop({
    accept: "MENU_ITEM",
    hover: (item: { id: number; level: number }, monitor) => {
      console.log(item);
      
      const hoverBoundingRect = topLevelRef.current?.getBoundingClientRect();
      const clientOffset = monitor.getClientOffset();

      if (hoverBoundingRect && clientOffset) {
        const middleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
        const clientY = clientOffset.y - hoverBoundingRect.top;
        
        setHoverMiddleY(middleY);
        setHoverClientY(clientY);
      }
    },
    drop: (item: { id: number; level: number }, monitor) => {
      if (monitor.didDrop()) return;
      const isBefore = hoverClientY <= hoverMiddleY;
      handleDrop(item.id, null, false, isBefore);
    },
    collect: (monitor) => ({
      isOverTop: monitor.isOver(),
    }),
  });

  // 将 ref 连接起来
  topLevelDropRef(topLevelRef);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">菜单管理</h2>
        <AddMenuDialog menuList={menuList} />        
      </div>

      <div className="grid grid-cols-5 px-4 py-2 bg-muted/50 rounded-md mb-2">
        <span>菜单名称</span>
        <span>路径</span>
        <span>图标</span>
        <span>外链</span>
        <span className="text-right">操作</span>
      </div>

      <div className="space-y-2">
        <div
          className={cn(
            "h-2 rounded-md transition-colors",
            "data-[is-over=true]:bg-muted/80"
          )}
          ref={topLevelRef}
          data-is-over={isOverTop}
        />
        {menuList?.map((menu) => (
          <MenuDragItem
            key={menu.menuId}
            menu={menu}
            menuList={menuList}
            onDrop={handleDrop}
          />
        ))}
      </div>
    </div>
  );
};

