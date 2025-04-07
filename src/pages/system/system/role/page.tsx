

// 导入必要的表格相关组件和类型
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";
import * as React from "react";

// 导入API和UI组件
import { getRuleList } from "@/api/role";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Role } from "@/types/role";
import { useQuery } from "@tanstack/react-query";
import { AssignPermissionsDialog } from "./_components/assign-permissions-dialog";
import { AssignMenusDialog } from "./_components/assign-menus-dialog";

// 表格列定义
const columns: ColumnDef<Role>[] = [
  // 选择列
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  // 权限ID列
  {
    accessorKey: "roleId",
    header: () => {
      return <div className="text-center">角色ID </div>;
    },
    cell: ({ row }) => (
      <div className="capitalize text-center">{row.getValue("roleId")}</div>
    ),
  },
  // 权限名称列
  {
    accessorKey: "roleCode",
    header: () => {
      return <div className="text-center">角色编码 </div>;
    },
    cell: ({ row }) => (
      <div className="lowercase text-center">{row.getValue("roleCode")}</div>
    ),
  },
  // 描述列
  {
    accessorKey: "roleName",
    header: () => <div className="text-center">角色名称</div>,
    cell: ({ row }) => {
      return (
        <div className="text-center font-medium">
          {row.getValue("roleName")}
        </div>
      );
    },
  },
  // 描述列
  {
    accessorKey: "description",
    header: () => <div className="text-center">描述</div>,
    cell: ({ row }) => {
      return (
        <div className="text-center font-medium">
          {row.getValue("description")}
        </div>
      );
    },
  },
  
  // 操作列
  {
    id: "actions",
    header: () => <div className="text-center">操作</div>,
    cell: ({ row }) => {
      const role = row.original;
      return (
        <div className="text-center space-x-2">
          <AssignPermissionsDialog role={role} />
          <AssignMenusDialog role={role} />
        </div>
      );
    },
  },
];

// 数据表格演示组件
function DataTableDemo() {
  // 表格状态管理
  const [sorting] = React.useState<SortingState>([]); // 排序状态
  const [columnFilters] = React.useState<ColumnFiltersState>([]); // 列筛选状态
  const [columnVisibility] = React.useState<VisibilityState>({}); // 列可见性状态
  const [rowSelection] = React.useState({}); // 行选择状态

  // 获取权限列表数据
  const { data: roleListData } = useQuery({
    queryKey: ["roleList"],
    queryFn: () => getRuleList(),
  });

  // 初始化表格实例
  const table = useReactTable({
    data: roleListData?.data.records || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      {/* 表格工具栏 */}
      <div className="flex items-center py-4">
        {/* 权限名称过滤器 */}
        <Input
          placeholder="Filter roleName..."
          value={table.getColumn("roleName")?.getFilterValue() as string}
          onChange={(event) =>
            table.getColumn("roleName")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        {/* 列显示控制下拉菜单 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* 表格主体 */}
      <div className="rounded-md border">
        <Table>
          {/* 表头 */}
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          {/* 表格内容 */}
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* 表格底部工具栏 */}
      <div className="flex items-center justify-end space-x-2 py-4">
        {/* 选择行数统计 */}
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        {/* 分页控制 */}
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

// 角色页面
export default function UserPage() {
  return <DataTableDemo />;
}
