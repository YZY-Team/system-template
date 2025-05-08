import { TaskType, taskTypeApi } from "@/api/taskType";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface TaskTypeDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTaskId: number | null;
}

export function TaskTypeDrawer({
  open,
  onOpenChange,
  selectedTaskId,
}: TaskTypeDrawerProps) {
  const [selectedType, setSelectedType] = useState<string>("");
  const queryClient = useQueryClient();

  // 获取任务类型列表
  const { data: taskTypesResponse } = useQuery({
    queryKey: ["taskTypes"],
    queryFn: taskTypeApi.getTaskTypes,
  });

  const taskTypes = taskTypesResponse?.records || [];

  // 获取当前任务的类型
  const { data: currentTaskType } = useQuery({
    queryKey: ["taskType", selectedTaskId],
    queryFn: async () => {
      if (!selectedTaskId) return null;
      // TODO: 替换为实际的API调用
      return { typeId: "1" };
    },
    enabled: !!selectedTaskId,
  });

  useEffect(() => {
    if (currentTaskType) {
      setSelectedType(currentTaskType.typeId);
    }
  }, [currentTaskType]);

  const handleSave = async () => {
    try {
      if (!selectedTaskId || !selectedType) return;

      // TODO: 替换为实际的API调用
      await taskTypeApi.updateTaskType({ taskId: selectedTaskId, taskTypeId: Number(selectedType) });
      
      toast.success("任务类型更新成功");
      queryClient.invalidateQueries({ queryKey: ["task"] });
      queryClient.invalidateQueries({ queryKey: ["taskType", selectedTaskId] });
      onOpenChange(false);
    } catch (error) {
      console.error("更新任务类型失败:", error);
      toast.error("更新失败，请重试");
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[70vw] max-w-[1000px] sm:w-[70vw]">
        <SheetHeader>
          <SheetTitle>配置任务类型</SheetTitle>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <RadioGroup
            value={selectedType}
            onValueChange={setSelectedType}
            className="gap-4"
          >
            {taskTypes?.map((type: TaskType) => (
              <div key={type.typeId} className="flex items-center space-x-2">
                <RadioGroupItem value={type.typeId.toString()} id={`type-${type.typeId}`} />
                <Label htmlFor={`type-${type.typeId}`}>{type.typeName}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-6">
          <SheetClose asChild>
            <Button variant="outline">取消</Button>
          </SheetClose>
          <Button onClick={handleSave}>保存</Button>
        </div>
      </SheetContent>
    </Sheet>
  );
} 