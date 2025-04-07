import { taskGroupApi, useTaskGroupList } from "@/api/taskGroup";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

interface TaskGroupDrawerProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  selectedTaskId: number | null;
}

export function TaskGroupDrawer({
  open,
  onOpenChange,
  selectedTaskId,
}: TaskGroupDrawerProps) {
  const { data: groupsData } = useTaskGroupList();
  const [selectedGroupId, setSelectedGroupId] = useState<string>("");
  const [newGroupName, setNewGroupName] = useState<string>("");
  const queryClient = useQueryClient();
  const handleSave = async () => {
    if (selectedTaskId) {
      // 分配分组逻辑
      if (!selectedGroupId) {
        toast.error("请选择分组");
        return;
      }

      try {
        await taskGroupApi.updateTaskGroup({
          taskId: selectedTaskId,
          groupId: Number(selectedGroupId),
        });
        toast.success("分配分组成功");
        onOpenChange?.(false);
      } catch (error) {
        console.error("分配分组失败:", error);
        toast.error("分配分组失败");
      }
    } else {
      // 创建分组逻辑
      if (!newGroupName) {
        toast.error("请输入分组名称");
        return;
      }

      try {
        await taskGroupApi.createTaskGroup({
          groupName: newGroupName,
          groupDescription: "",
        });
        toast.success("创建分组成功");
        onOpenChange?.(false);
        queryClient.invalidateQueries({ queryKey: ["taskGroup"] });
      } catch (error) {
        console.error("创建分组失败:", error);
        toast.error("创建分组失败");
      }
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{selectedTaskId ? "分配分组" : "创建分组"}</SheetTitle>
          <SheetDescription>
            {selectedTaskId ? "请选择要分配的任务分组" : "请输入新分组名称"}
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          {selectedTaskId ? (
            // 分配分组的表单
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="group" className="text-right">
                选择分组
              </Label>
              <Select value={selectedGroupId} onValueChange={setSelectedGroupId}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="请选择分组" />
                </SelectTrigger>
                <SelectContent>
                  {groupsData?.data?.records?.map((group) => (
                    <SelectItem key={group.groupId} value={String(group.groupId)}>
                      {group.groupName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            // 创建分组的表单
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="groupName" className="text-right">
                分组名称
              </Label>
              <input
                id="groupName"
                className="col-span-3 flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="请输入分组名称"
              />
            </div>
          )}
        </div>
        <div className="flex justify-end gap-4 mt-4">
          <SheetClose asChild>
            <Button variant="outline">取消</Button>
          </SheetClose>
          <Button type="submit" onClick={handleSave}>
            {selectedTaskId ? "保存" : "创建"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
