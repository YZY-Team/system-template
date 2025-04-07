

// 导入必要的表格相关组件和类型
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";
import * as React from "react";

// 导入API和UI组件
import { getPermissionList } from "@/api/permission";
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
import { Permission } from "@/types/permission";
import { useQuery } from "@tanstack/react-query";

// 表格列定义
const columns: ColumnDef<Permission>[] = [
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
    accessorKey: "permissionId",
    header: () => {
      return <div className="text-center">权限ID </div>;
    },
    cell: ({ row }) => (
      <div className="capitalize text-center">
        {row.getValue("permissionId")}
      </div>
    ),
  },
  // 权限名称列
  {
    accessorKey: "permissionName",
    header: () => {
      return <div className="text-center">权限名称 </div>;
    },
    cell: ({ row }) => (
      <div className="lowercase text-center">
        {row.getValue("permissionName")}
      </div>
    ),
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
];

// 数据表格演示组件
function DataTableDemo() {
  // 表格状态管理
  const [sorting] = React.useState<SortingState>([]); // 排序状态
  const [columnFilters] = React.useState<ColumnFiltersState>([]); // 列筛选状态
  const [columnVisibility] = React.useState<VisibilityState>({}); // 列可见性状态
  const [rowSelection] = React.useState({}); // 行选择状态

  // 添加分页状态
  const [pageIndex, setPageIndex] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  
  // 获取权限列表数据
  const { data: permissionListData } = useQuery({
    queryKey: ["permissionList", pageIndex, pageSize],
    queryFn: () =>
      getPermissionList({
        pageNum: pageIndex,
        pageSize: pageSize,
        sortField: "permissionId",
        sortMode: true,
      }),
  });

  // 初始化表格实例
  const table = useReactTable({
    data: permissionListData?.records || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    pageCount: Math.ceil((permissionListData?.total || 0) / pageSize),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: {
        pageIndex: pageIndex - 1, // TanStack Table 使用从0开始的索引
        pageSize,
      },
    },
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        const newState = updater({
          pageIndex: pageIndex - 1,
          pageSize,
        });
        setPageIndex(newState.pageIndex + 1);
        setPageSize(newState.pageSize);
      }
    },
    manualPagination: true, // 告诉表格我们将手动处理分页
  });

  return (
    <div className="w-full">
      {/* 表格工具栏 */}
      <div className="flex items-center py-4">
        {/* 权限名称过滤器 */}
        <Input
          placeholder="Filter permissionName..."
          value={
            (table.getColumn("permissionName")?.getFilterValue() as string) ??
            ""
          }
          onChange={(event) =>
            table
              .getColumn("permissionName")
              ?.setFilterValue(event.target.value)
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
      {/* 修改分页控制部分 */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          共 {permissionListData?.total || 0} 条记录
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPageIndex(prev => Math.max(1, prev - 1))}
            disabled={pageIndex === 1}
          >
            上一页
          </Button>
          <span className="mx-2">
            第 {pageIndex} 页，共 {Math.ceil((permissionListData?.total || 0) / pageSize)} 页
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPageIndex(prev => prev + 1)}
            disabled={pageIndex >= Math.ceil((permissionListData?.total || 0) / pageSize)}
          >
            下一页
          </Button>
        </div>
      </div>
    </div>
  );
}

// 角色页面组件
export default function RolePage() {
  return <DataTableDemo />;
}
