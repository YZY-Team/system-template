

import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { MixerHorizontalIcon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

/**
 * DataTableViewOptions组件的props接口
 * @template TData - 数据类型
 */
interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
}

/**
 * DataTableViewOptions组件
 * @template TData - 数据类型
 * @param {DataTableViewOptionsProps<TData>} props - 组件的props
 * @returns {JSX.Element} DataTableViewOptions组件
 */
export function DataTableViewOptions<TData>({
  table,
}: DataTableViewOptionsProps<TData>) {
  return (
    <DropdownMenu>
      {/* 下拉菜单触发器 */}
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto hidden h-8 lg:flex"
        >
          <MixerHorizontalIcon className="mr-2 h-4 w-4" />
          视图
        </Button>
      </DropdownMenuTrigger>
      {/* 下拉菜单内容 */}
      <DropdownMenuContent align="end" className="w-[150px]">
        <DropdownMenuLabel>切换列显示</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {/* 遍历所有可隐藏的列并创建复选框项 */}
        {table
          .getAllColumns()
          .filter((column) => {
            return (
              typeof column.accessorFn !== "undefined" && column.getCanHide()
            );
          })
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
