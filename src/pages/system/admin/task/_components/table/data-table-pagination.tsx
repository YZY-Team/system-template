import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/lib/request";
import { TaskListParams } from "@/types/task";
import { Dispatch, SetStateAction } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  pagination: Pagination;
  onPaginationChange: (newPageIndex: number, newPageSize: number) => void;
  setParams?: Dispatch<SetStateAction<TaskListParams>>;
}

export function DataTablePagination<TData>({
  table,
  pagination,
  onPaginationChange,
}: DataTablePaginationProps<TData>) {
  const { current, pages, size } = pagination;
  
  return (
    <div className="flex items-center justify-between px-2 py-4">
      <div className="flex-1 text-sm text-muted-foreground">
        已选择 {table.getFilteredSelectedRowModel().rows.length} 条，
        共 {table.getFilteredRowModel().rows.length} 条记录
      </div>
      <div className="flex items-center gap-6 lg:gap-8">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">每页显示</p>
          <Select
            value={String(size)}
            onValueChange={(value) => {
              const newSize = Number(value);
              table.setPageSize(newSize);
              onPaginationChange(Number(current) - 1, newSize);
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={size} />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={String(pageSize)}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex min-w-[100px] items-center justify-center text-sm font-medium">
          第 {current} 页，共 {pages} 页
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="hidden h-8 w-8 lg:flex"
            onClick={() => {
              table.setPageIndex(0);
              onPaginationChange(0, Number(size));
            }}
            disabled={Number(current) === 1}
          >
            <span className="sr-only">跳转到第一页</span>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => {
              const newPage = Number(current) - 2;
              table.previousPage();
              onPaginationChange(newPage, Number(size));
            }}
            disabled={Number(current) === 1}
          >
            <span className="sr-only">上一页</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => {
              const newPage = Number(current);
              table.nextPage();
              onPaginationChange(newPage, Number(size));
            }}
            disabled={Number(current) === Number(pages)}
          >
            <span className="sr-only">下一页</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="hidden h-8 w-8 lg:flex"
            onClick={() => {
              const lastPage = Number(pages) - 1;
              table.setPageIndex(lastPage);
              onPaginationChange(lastPage, Number(size));
            }}
            disabled={Number(current) === Number(pages)}
          >
            <span className="sr-only">跳转到最后一页</span>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
