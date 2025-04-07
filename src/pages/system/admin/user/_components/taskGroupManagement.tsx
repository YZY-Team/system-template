

import { useState } from "react";
import { Button } from "@/components/ui/button";


import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";


interface TaskGroup {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  taskCount: number;
  createTime: string;
}

export function TaskGroupManagement() {
  const [open, setOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<TaskGroup | null>(null);

  // const columns: ColumnDef<TaskGroup>[] = [
  //   {
  //     accessorKey: "id",
  //     header: "编号",
  //   },
  //   {
  //     accessorKey: "name",
  //     header: "分组名称",
  //   },
  //   {
  //     accessorKey: "description",
  //     header: "描述",
  //   },
  //   {
  //     accessorKey: "isActive",
  //     header: "状态",
  //     cell: ({ row }) => {
  //       const isActive:boolean = row.getValue("isActive");
  //       return (
  //         <div className="flex items-center space-x-2">
  //           <Switch
  //             checked={isActive}
  //             onCheckedChange={() => {
  //               // TODO: 实现分组状态切换
  //               toast.success(isActive ? "分组已禁用" : "分组已启用");
  //             }}
  //           />
  //           <span className={isActive ? "text-blue-600 font-medium" : "text-red-600"}>
  //             {isActive ? "已启用" : "已禁用"}
  //           </span>
  //         </div>
  //       );
  //     },
  //   },
  //   {
  //     accessorKey: "taskCount",
  //     header: "任务数量",
  //   },
  //   {
  //     accessorKey: "createTime",
  //     header: "创建时间",
  //   },
  //   {
  //     id: "actions",
  //     header: "操作",
  //     cell: ({ row }) => {
  //       const group = row.original;
  //       return (
  //         <Button
  //           variant="ghost"
  //           size="sm"
  //           onClick={() => {
  //             setSelectedGroup(group);
  //             setOpen(true);
  //           }}
  //         >
  //           编辑
  //         </Button>
  //       );
  //     },
  //   },
  // ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">任务分组</h3>
          <p className="text-sm text-muted-foreground">
            管理任务分组，对任务进行分类管理
          </p>
        </div>
        <Button>
          创建分组
        </Button>
      </div>

      <div className="rounded-md border">
        {/* <DataTable initialColumns={columns} /> */}
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>编辑分组</SheetTitle>
            <SheetDescription>修改分组信息</SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">分组名称</Label>
              <Input
                id="name"
                value={selectedGroup?.name}
                onChange={(e) =>
                  setSelectedGroup(prev =>
                    prev ? { ...prev, name: e.target.value } : null
                  )
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">描述</Label>
              <Input
                id="description"
                value={selectedGroup?.description}
                onChange={(e) =>
                  setSelectedGroup(prev =>
                    prev ? { ...prev, description: e.target.value } : null
                  )
                }
              />
            </div>
            <div className="space-y-2">
              <Label>状态</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={selectedGroup?.isActive}
                  onCheckedChange={(checked) =>
                    setSelectedGroup(prev =>
                      prev ? { ...prev, isActive: checked } : null
                    )
                  }
                />
                <span className={selectedGroup?.isActive ? "text-blue-600 font-medium" : "text-red-600"}>
                  {selectedGroup?.isActive ? "已启用" : "已禁用"}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <Label>任务数量</Label>
              <div className="text-sm text-gray-500">
                {selectedGroup?.taskCount} 个任务
              </div>
            </div>
            <div className="space-y-2">
              <Label>创建时间</Label>
              <div className="text-sm text-gray-500">
                {selectedGroup?.createTime}
              </div>
            </div>
          </div>
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-6">
            <SheetClose asChild>
              <Button variant="outline">取消</Button>
            </SheetClose>
            <Button onClick={() => {
              // TODO: 实现保存逻辑
              setOpen(false);
              toast.success("保存成功");
            }}>
              保存更改
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
