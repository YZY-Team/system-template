import { taskTypeApi } from "@/api/taskType";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { toast } from "sonner";
import { DataTable } from "../table/data-table";

interface TaskType {
  typeId: number;
  typeName: string;
  description: string;
  periodType: string;
  createTime: string;
  updateTime: string;
}

interface CreateTaskTypeData {
  typeName: string;
  description: string;
  periodType: string;
}

export function TaskTypes() {
  const [params] = useState({
    pageNum: 1,
    pageSize: 10,
  });
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<CreateTaskTypeData>({
    typeName: "",
    description: "",
    periodType: "DAILY", // 默认值
  });
  const queryClient = useQueryClient();

  const { data: taskTypesResponse, isLoading } = useQuery({
    queryKey: ["taskTypes", params],
    queryFn: taskTypeApi.getTaskTypes,
  });

  const handleCreate = async () => {
    try {
        // @ts-expect-error 未知类型
      await taskTypeApi.createTaskType(formData);
      toast.success("创建成功");
      queryClient.invalidateQueries({ queryKey: ["taskTypes"] });
      setOpen(false);
      setFormData({
        typeName: "",
        description: "",
        periodType: "DAILY",
      });
    } catch (error) {
      console.error("创建失败:", error);
      toast.error("创建失败，请重试");
    }
  };

  const columns: ColumnDef<TaskType>[] = [
    {
      accessorKey: "typeId",
      header: "编号",
    },
    {
      accessorKey: "typeName",
      header: "类型名称",
    },
    {
      accessorKey: "description",
      header: "描述",
    },
    {
      accessorKey: "periodType",
      header: "周期类型",
    },
    {
      accessorKey: "createTime",
      header: "创建时间",
    },
    {
      accessorKey: "updateTime",
      header: "更新时间",
    },
    // {
    //   id: "actions",
    //   header: "操作",
    //   cell: ({ row }) => {
    //     const taskType = row.original;
    //     return (
    //       <div className="flex space-x-2">
    //         <Button
    //           variant="ghost"
    //           size="sm"
    //           onClick={() => {
    //             // TODO: 实现编辑功能
    //             console.log("编辑任务类型:", taskType);
    //           }}
    //         >
    //           <Pencil className="h-4 w-4 mr-1" />
    //           编辑
    //         </Button>
    //         <Button
    //           variant="ghost"
    //           size="sm"
    //           onClick={() => {
    //             // TODO: 实现删除功能
    //             console.log("删除任务类型:", taskType);
    //           }}
    //         >
    //           <Trash2 className="h-4 w-4 mr-1" />
    //           删除
    //         </Button>
    //       </div>
    //     );
    //   },
    // },
  ];

  if (isLoading) {
    return <div>加载中...</div>;
  }

  const taskTypes = taskTypesResponse?.records || [];

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">任务类型管理</h2>
          <p className="text-muted-foreground">
            在这里管理所有的任务类型
          </p>
        </div>
        {/* <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          创建类型
        </Button> */}
      </div>

      <div className="rounded-md border">
        <div className="flex gap-4 items-center p-4">
          <div className="flex-1 max-w-sm">
            <Input
              placeholder="搜索类型名称..."
              // TODO: 实现搜索功能
              onChange={(e) => console.log(e.target.value)}
            />
          </div>
        </div>
        <DataTable
          data={taskTypes}
          // @ts-expect-error 未知类型
          columns={columns}
        />
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>创建任务类型</SheetTitle>
            <SheetDescription>
              在这里添加新的任务类型信息
            </SheetDescription>
          </SheetHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="typeName" className="text-right">
                类型名称
              </Label>
              <Input
                id="typeName"
                className="col-span-3"
                value={formData.typeName}
                onChange={(e) => setFormData(prev => ({ ...prev, typeName: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                描述
              </Label>
              <Textarea
                id="description"
                className="col-span-3"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                取消
              </Button>
              <Button onClick={handleCreate}>
                保存
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
} 