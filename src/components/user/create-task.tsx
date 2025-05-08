import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { CreateTask, GetTaskInfo, UpdateTask } from "@/api/task";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { CreateTaskData, Task } from "@/types/task";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export const CreateAndEditTaskDialog = ({
  isEdit,
  task,
}: {
  isEdit: boolean;
  task?: Task;
}) => {
  const queryClient = useQueryClient();
  const form = useForm<CreateTaskData>({
    mode: "onChange",
    defaultValues: {
      maxCompletionTimes: 0,
      taskUrl: "",
      isExternal: false,
      displayOrder: 0,
      startTime: "",
      endTime: "",
      ...task,
    },
  });

  const { mutate: createTask } = useMutation({
    mutationFn: CreateTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task"] });
      toast("创建任务成功");
      form.reset();
    },
    onError: (error) => {
      toast(error.message);
    },
  });
  const { mutate: updateTask } = useMutation({
    mutationFn: UpdateTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task"] });
      queryClient.invalidateQueries({ queryKey: ["taskInfo", task!.taskId] });
      toast("更新任务成功");
      form.reset();
    },
    onError: () => {
      toast("更新任务失败");
    },
  });
  const { data: taskInfo } = useQuery({
    queryKey: ["taskInfo", task?.taskId],
    queryFn: () => GetTaskInfo(task!.taskId),
    enabled: isEdit,
  });

  useEffect(() => {
    if (taskInfo?.data) {
      form.reset(taskInfo.data);
    }
  }, [taskInfo, form]);
  const onSubmit = (data: CreateTaskData) => {
    if (isEdit) {
      const { endTime, startTime, ...rest } = data;
      updateTask({
        taskId: task!.taskId,
        data: {
          ...rest,
          endTime: endTime.replace(" ", "T"),
          startTime: startTime.replace(" ", "T"),
        },
      });
    } else {
      createTask(data);
    }
  };
  return (
    <>
      <DialogHeader>
        <DialogTitle>{isEdit ? "编辑任务" : "添加任务"}</DialogTitle>
        <DialogDescription>
          {isEdit ? "修改任务信息" : "创建新的任务"}
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            {/* 任务基本信息 */}
            <div className="space-y-4">
              <FormField
                name="taskName"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>任务名称</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                name="taskContent"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>任务内容</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                name="module"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>模块</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="选择模块" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Invite">邀请</SelectItem>
                        <SelectItem value="Watch">观看</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                name="taskUrl"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>任务链接</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* 任务配置 */}
            <div className="space-y-4">
              <FormField
                name="maxCompletionTimes"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>最大完成次数</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                name="displayOrder"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>显示顺序</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                name="startTime"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>开始时间</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                name="endTime"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>结束时间</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* 开关选项 */}
          <div className="flex space-x-6">
            <FormField
              name="isExternal"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between space-x-2">
                  <FormLabel>是否外部任务</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="isActive"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between space-x-2">
                  <FormLabel>是否激活</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          {/* 按钮 */}
          <DialogFooter>
            <Button type="submit" className="w-24">
              {isEdit ? "保存" : "创建"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
};
