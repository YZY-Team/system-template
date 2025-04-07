import { MenuTree } from "@/types/menu";
import { useDrag, useDrop } from "react-dnd";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { EditMenuDialog } from "./edit-menu-dialog";
import { DeleteMenuDialog } from "./delete-menu-dialog";
import { useRef } from "react";
import { useState } from "react";

interface MenuDragItemProps {
  menu: MenuTree;
  menuList: MenuTree[] | undefined;
  onDrop: (
    dragId: number,
    hoverId: number | null,
    asChild: boolean,
    isBefore: boolean
  ) => void;
  level?: number;
}

interface DragItem {
  id: number;
  level: number;
}

export const MenuDragItem = ({
  menu,
  menuList,
  onDrop,
  level = 0,
}: MenuDragItemProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const childRef = useRef<HTMLDivElement>(null);
  const [hoverClientY, setHoverClientY] = useState<number>(0);

  const [{ isDragging }, drag] = useDrag({
    type: "MENU_ITEM",
    item: { id: menu.menuId, level },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: "MENU_ITEM",
    hover: (item: DragItem, monitor) => {
      console.log(item);
      
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const clientOffset = monitor.getClientOffset();

      if (hoverBoundingRect && clientOffset) {
        const clientY = clientOffset.y - hoverBoundingRect.top;
        setHoverClientY(clientY);
      }
    },
    drop: (item: DragItem, monitor) => {
      if (monitor.didDrop()) return;

      if (item.id !== menu.menuId) {
        const height = ref.current?.getBoundingClientRect().height || 0;
        const topThreshold = height * 0.25;
        const bottomThreshold = height * 0.75;

        if (hoverClientY > topThreshold && hoverClientY < bottomThreshold) {
          // 在中间区域，作为子项
          onDrop(item.id, menu.menuId, true, false);
        } else {
          // 在上下区域，作为兄弟项
          const isBefore = hoverClientY <= topThreshold;
          onDrop(item.id, menu.menuId, false, isBefore);
        }
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
    }),
  });

  const [{ isOverChild }, dropChild] = useDrop({
    accept: "MENU_ITEM",
    drop: (item: DragItem, monitor) => {
      if (monitor.didDrop()) return;

      if (item.id !== menu.menuId) {
        // 子项总是放在最后
        onDrop(item.id, menu.menuId, true, false);
      }
    },
    collect: (monitor) => ({
      isOverChild: monitor.isOver({ shallow: true }),
    }),
  });

  drag(drop(ref));
  dropChild(childRef);

  return (
    <>
      <div
        ref={ref}
        className={cn(
          "px-4 py-2 rounded-md transition-colors relative",
          isDragging && "opacity-50",
          isOver && "bg-muted/80",
          !isDragging && "hover:bg-muted/50"
        )}
        style={{ marginLeft: `${level * 1.5}rem` }}
      >
        {isOver && (
          <>
            {/* 上边界指示器 */}
            {hoverClientY <=
              (ref.current?.getBoundingClientRect().height || 0) * 0.25 && (
              <div
                className={cn(
                  "absolute left-0 right-0 h-1.5 bg-red-500",
                  "before:absolute before:w-4 before:h-4 before:rounded-full before:bg-red-500 before:-left-2 before:-top-[6px]",
                  "shadow-[0_0_8px_rgba(239,68,68,0.7)]"
                )}
                style={{ top: 0 }}
              />
            )}
            {/* 中间指示器 */}
            {hoverClientY >
              (ref.current?.getBoundingClientRect().height || 0) * 0.25 &&
              hoverClientY <
                (ref.current?.getBoundingClientRect().height || 0) * 0.75 && (
                <div className="absolute inset-0 border-2 border-red-500 rounded-md shadow-[0_0_8px_rgba(239,68,68,0.7)]" />
              )}
            {/* 下边界指示器 */}
            {hoverClientY >=
              (ref.current?.getBoundingClientRect().height || 0) * 0.75 && (
              <div
                className={cn(
                  "absolute left-0 right-0 h-1.5 bg-red-500",
                  "before:absolute before:w-4 before:h-4 before:rounded-full before:bg-red-500 before:-left-2 before:-top-[6px]",
                  "shadow-[0_0_8px_rgba(239,68,68,0.7)]"
                )}
                style={{ bottom: "-1.5px" }}
              />
            )}
          </>
        )}
        <div className="grid grid-cols-5 items-center">
          <span className="flex items-center gap-2">
            <ChevronRight
              className={cn(
                "h-4 w-4 shrink-0",
                !menu.children?.length && "invisible"
              )}
            />
            {menu.menuName}
            {menu.children?.length ? (
              <span className="text-xs text-muted-foreground">(含子菜单)</span>
            ) : null}
          </span>
          <span>{menu.pathUrl}</span>
          <span>{menu.icon || "-"}</span>
          <span>{menu.isExternal ? "是" : "否"}</span>
          <div className="text-right space-x-2">
            <EditMenuDialog menu={menu} menuList={menuList} />
            <DeleteMenuDialog menu={menu} />
          </div>
        </div>
      </div>

      {/* 子菜单拖放区域 */}
      <div
        ref={childRef}
        className={cn(
          "h-4 rounded-md transition-colors",
          isOverChild && "bg-red-500/60 shadow-[0_0_8px_rgba(239,68,68,0.5)]"
        )}
        style={{ marginLeft: `${(level + 1) * 1.5}rem` }}
      />

      {/* 移除独立的子菜单拖放区域，因为现在通过中间区域来判断 */}
      {menu.children?.map((child) => (
        <MenuDragItem
          key={child.menuId}
          menu={child}
          menuList={menuList}
          onDrop={onDrop}
          level={level + 1}
        />
      ))}
    </>
  );
};
