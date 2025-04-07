

import { ActiveTask, GetTaskInfo, GetTaskList, UpdateTask } from "@/api/task";
import { taskTypeApi } from "@/api/taskType";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pagination } from "@/lib/request";
import { ApiResponse } from "@/types/api";
import { Task } from "@/types/task";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { EditTaskDrawer } from "../user/_components/edit-task-drawer";
import { RewardDrawer } from "../user/_components/reward-drawer";
import { DataTable } from "../user/_components/table/data-table";
import { TaskGroups } from "../user/_components/taskGroups";
import { TaskGroupDrawer } from "../user/_components/taskGroups/TaskGroupDrawer";
import { TaskRewards } from "../user/_components/taskRewards";
import { TaskTypes } from "../user/_components/taskTypes";

/**
 * 任务页面组件
 * @returns {JSX.Element} 任务页面的 JSX
 */
export default function TaskPage() {
  const [open, setOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const [params, setParams] = useState({
    pageNum: 1,
    pageSize: 10,
    sortField: "isActive",
    sortMode: false,
  });

  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [showRewardDrawer, setShowRewardDrawer] = useState(false);

  const {
    data: tasksResponse,
    isLoading,
    error,
  } = useQuery<ApiResponse<{ records: Task[]; pagination: Pagination }>>({
    queryKey: ["task", params],
    queryFn: async () => {
      return await GetTaskList(params);
    },
  });

  const { mutateAsync: updateTaskMutation } = useMutation({
    mutationFn: async (task: Task) => {
      return await UpdateTask({
        taskId: task.taskId,
        data: {
          ...task,
          startTime: task.startTime.replace(" ", "T"),
          endTime: task.endTime.replace(" ", "T"),
        },
      });
    },
    onSuccess: () => {
      toast.success("任务更新成功");
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["task", params] });
    },
    onError: (error) => {
      console.error("任务更新失败:", error);
      toast.error("更新失败，请重试");
    },
  });
  const { data: taskTypesResponse } = useQuery({
    queryKey: ["taskTypes"],
    queryFn: taskTypeApi.getTaskTypes,
  });
  const taskTypes = taskTypesResponse?.records || [];
  // 获取任务详情
  const fetchTaskDetail = async (taskId: number, task: Task) => {
    try {
      setLoading(true);
      const res = await GetTaskInfo(taskId);
      if (res.code === 200) {
        setSelectedTask((prev) => {
          return {
            ...prev,
            ...res.data,
          };
        });
      } else {
        throw new Error(res.message || "获取任务详情失败");
      }
    } catch (error) {
      console.error("获取任务详情失败:", error);
      toast.error("获取任务详情失败，请重试");
      setSelectedTask(task);
    } finally {
      setLoading(false);
    }
  };

  // 切换任务状态
  const toggleTaskActive = async (taskId: string, currentState: boolean) => {
    try {
      const res = await ActiveTask(taskId);
      if (res.code === 200) {
        // 更新表格数据中的状态
        queryClient.setQueryData(
          ["task", params],
          (
            oldData: ApiResponse<{ records: Task[]; pagination: Pagination }>
          ) => {
            return {
              ...oldData,
              data: {
                ...oldData.data,
                records: oldData.data.records.map((task: Task) =>
                  task.taskId === Number(taskId)
                    ? { ...task, isActive: !currentState }
                    : task
                ),
              },
            };
          }
        );
        toast.success(currentState ? "任务已关闭" : "任务已激活");
      } else {
        throw new Error(res.message || "操作失败");
      }
    } catch (error) {
      console.error("切换任务状态失败:", error);
      toast.error("操作失败，请重试");
    }
  };
  const [showGroupDrawer, setShowGroupDrawer] = useState(false);
  const handleConfigureType = async (taskId: number, newTypeId: string) => {
    try {
      await taskTypeApi.updateTaskType({
        taskId,
        taskTypeId: Number(newTypeId)
      });
      
      toast.success("任务类型更新成功");
      // 修改查询键以匹配实际使用的键
      queryClient.invalidateQueries({ queryKey: ["task"] });
    } catch (error) {
      console.error("更新任务类型失败:", error);
      toast.error("更新失败，请重试");
    }
  };
  // 配置任务分组
  const columns: ColumnDef<Task>[] = [
    {
      accessorKey: "taskId",
      header: "编号",
    },
    {
      accessorKey: "taskName",
      header: "任务名称",
    },
    {
      accessorKey: "taskContent",
      header: "任务内容",
    },
    {
      accessorKey: "isActive",
      header: "状态",
      cell: ({ row }) => {
        const isActive: boolean = row.getValue("isActive");
        const taskId = row.original.taskId.toString();

        return (
          <div className="flex items-center space-x-2">
            <Switch
              checked={isActive}
              onCheckedChange={() => toggleTaskActive(taskId, isActive)}
            />
            <span
              className={
                isActive ? "text-blue-600 font-medium" : "text-red-600"
              }
            >
              {isActive ? "已激活" : "未激活"}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "module",
      header: "模块",
    },
    {
      accessorKey: "createTime",
      header: "创建时间",
    },
    {
      id: "rewards",
      header: "奖励配置",
      cell: ({ row }) => {
        const task = row.original;
        return (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedTaskId(task.taskId);
              setShowRewardDrawer(true);
            }}
          >
            配置奖励
          </Button>
        );
      },
    },
    {
      id: "taskGroup",
      header: "任务分组",
      cell: ({ row }) => {
        const task = row.original;
        return (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedTaskId(task.taskId);
              setShowGroupDrawer(true);
            }}
          >
            配置分组
          </Button>
        );
      },
    },
    {
      id: "taskType",
      header: "任务类型",
      cell: ({ row }) => {
        const task = row.original;
        console.log(task.types);
        return (
          <Select
            value={task.types}
            onValueChange={(value) => handleConfigureType(task.taskId, value)}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="选择类型">{task.types}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {taskTypes.map((type) => (
                <SelectItem key={type.typeId} value={type.typeId.toString()}>
                  {type.typeName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      },
    },
    {
      id: "actions",
      header: "操作",
      cell: ({ row }) => {
        const task = row.original;
        return (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              fetchTaskDetail(task.taskId, task);
              setOpen(true);
              setSelectedTask(task);
            }}
          >
            <Pencil className="h-4 w-4 mr-1" />
            编辑
          </Button>
        );
      },
    },
  ];

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-center h-full">加载中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-center h-full text-red-500">
          加载失败: {(error as Error).message}
        </div>
      </div>
    );
  }

  const tasks = tasksResponse?.data?.records || [];
  const pagination = tasksResponse?.data?.pagination || {
    current: "1",
    size: "10",
    total: "0",
    pages: "0",
  };

  const handlePaginationChange = (
    newPageIndex: number,
    newPageSize: number
  ) => {
    setParams((prev) => ({
      ...prev,
      pageNum: newPageIndex + 1,
      pageSize: newPageSize,
    }));
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <Tabs defaultValue="task-list">
        <div className="flex items-center justify-between space-y-2">
          <TabsList>
            <TabsTrigger value="task-list">任务列表</TabsTrigger>
            <TabsTrigger value="task-rewards">任务奖励</TabsTrigger>
            <TabsTrigger value="task-type">任务类型</TabsTrigger>
            <TabsTrigger value="task-group">任务分组</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="task-list" className="space-y-4">
          <div className="flex items-center justify-between space-y-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">任务列表</h2>
              <p className="text-muted-foreground">在这里管理所有的任务</p>
            </div>
          </div>
          <DataTable
            data={tasks}
            columns={columns}
            pagination={pagination}
            onPaginationChange={handlePaginationChange}
          />
        </TabsContent>
        <TabsContent value="task-rewards" className="space-y-4">
          <div className="grid grid-cols-1 gap-8">
            <TaskRewards />
          </div>
        </TabsContent>
        <TabsContent value="task-type" className="space-y-4">
          <div className="grid grid-cols-1 gap-8">
            <TaskTypes />
          </div>
        </TabsContent>
        <TabsContent value="task-group" className="space-y-4">
          <div className="grid grid-cols-1 gap-8">
            <TaskGroups />
          </div>
        </TabsContent>
      </Tabs>
      <EditTaskDrawer
        open={open}
        onOpenChange={setOpen}
        selectedTask={selectedTask}
        setSelectedTask={setSelectedTask}
        loading={loading}
        toggleTaskActive={toggleTaskActive}
        onSave={async () => {
          if (selectedTask) {
            console.log({ selectedTask });
            await updateTaskMutation(selectedTask);
          }
        }}
      />
      <RewardDrawer
        open={showRewardDrawer}
        onOpenChange={setShowRewardDrawer}
        selectedTaskId={selectedTaskId}
      />
      <TaskGroupDrawer
        open={showGroupDrawer}
        onOpenChange={setShowGroupDrawer}
        selectedTaskId={selectedTaskId}
      />
    </div>
  );
}
