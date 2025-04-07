

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "@/registry/new-york/ui/button";
import { Input } from "@/registry/new-york/ui/input";
import { DataTableViewOptions } from "./data-table-view-options";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { CirclePlus } from "lucide-react";
import { CreateAndEditTaskDialog } from "../create-task";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";

/**
 * DataTableToolbar组件的props接口
 * @template TData - 数据类型
 */
interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

/**
 * DataTableToolbar组件
 * @template TData - 数据类型
 * @param {DataTableToolbarProps<TData>} props - 组件的props
 * @returns {JSX.Element} DataTableToolbar组件
 */
export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  // 检查是否有应用的过滤器
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {/* 任务名称过滤输入框 */}
        <Input
          placeholder="搜索任务..."
          value={
            (table.getColumn("taskName")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("taskName")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {/* 活动状态过滤器 */}
        {table.getColumn("isActive") && (
          <DataTableFacetedFilter
            column={table.getColumn("isActive")}
            title="状态"
            options={[
              {
                label: "已激活",
                value: "true",
              },
              {
                label: "未激活",
                value: "false",
              },
            ]}
          />
        )}
        {/* 重置过滤器按钮 */}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            重置
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      {/* 创建任务对话框 */}
      <Dialog>
        <DialogTrigger asChild>
          <Button className="mr-5">
            <CirclePlus />
            添加任务
          </Button>
        </DialogTrigger>
        <DialogContent>
          <CreateAndEditTaskDialog isEdit={false} />
        </DialogContent>
      </Dialog>
      {/* 表格视图选项 */}
      <DataTableViewOptions table={table} />
    </div>
  );
}
