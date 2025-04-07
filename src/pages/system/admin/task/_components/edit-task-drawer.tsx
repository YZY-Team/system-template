import { Dispatch, SetStateAction } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Task } from "@/types/task";

interface EditTaskDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTask: Task | null;
  setSelectedTask: Dispatch<SetStateAction<Task | null>>;
  loading: boolean;
  toggleTaskActive: (taskId: string, currentStatus: boolean) => void;
  onSave: () => Promise<void>;
}

export function EditTaskDrawer({
  open,
  onOpenChange,
  selectedTask,
  setSelectedTask,
  loading,
  toggleTaskActive,
  onSave,
}: EditTaskDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-[70vw] max-w-[1000px] sm:w-[70vw]"
      >
        <SheetHeader>
          <SheetTitle>编辑任务</SheetTitle>
          <SheetDescription>修改任务信息</SheetDescription>
        </SheetHeader>
        {loading ? (
          <div className="flex items-center justify-center py-8">加载中...</div>
        ) : (
          <>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="taskId">任务 ID</Label>
                <div className="text-sm text-gray-500">
                  {selectedTask?.taskId}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="taskName">任务名称</Label>
                <Input
                  id="taskName"
                  value={selectedTask?.taskName}
                  onChange={(e) =>
                    setSelectedTask((prev) =>
                      prev ? { ...prev, taskName: e.target.value } : null
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="taskContent">任务内容</Label>
                <Textarea
                  id="taskContent"
                  value={selectedTask?.taskContent}
                  onChange={(e) =>
                    setSelectedTask((prev) =>
                      prev ? { ...prev, taskContent: e.target.value } : null
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="module">模块</Label>
                <Input
                  id="module"
                  value={selectedTask?.module}
                  onChange={(e) =>
                    setSelectedTask((prev) =>
                      prev ? { ...prev, module: e.target.value } : null
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="displayOrder">显示顺序</Label>
                <Input
                  id="displayOrder"
                  value={selectedTask?.displayOrder}
                  onChange={(e) =>
                    setSelectedTask((prev) =>
                      prev
                        ? { ...prev, displayOrder: Number(e.target.value) }
                        : null
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="startTime">开始时间</Label>
                <Input
                  id="startTime"
                  value={selectedTask?.startTime}
                  onChange={(e) =>
                    setSelectedTask((prev) =>
                      prev ? { ...prev, startTime: e.target.value } : null
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">结束时间</Label>
                <Input
                  id="endTime"
                  value={selectedTask?.endTime}
                  onChange={(e) =>
                    setSelectedTask((prev) =>
                      prev ? { ...prev, endTime: e.target.value } : null
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>状态</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={selectedTask?.isActive}
                    onCheckedChange={() =>
                      selectedTask &&
                      toggleTaskActive(
                        selectedTask.taskId.toString(),
                        selectedTask.isActive
                      )
                    }
                  />
                  <span
                    className={
                      selectedTask?.isActive
                        ? "text-blue-600 font-medium"
                        : "text-red-600"
                    }
                  >
                    {selectedTask?.isActive ? "已激活" : "未激活"}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="isExternal">是否外部任务</Label>
                <Switch
                  checked={selectedTask?.isExternal}
                  onCheckedChange={() =>
                    setSelectedTask((prev) =>
                      prev ? { ...prev, isExternal: !prev.isExternal } : null
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxCompletionTimes">最大完成次数</Label>
                <Input
                  id="maxCompletionTimes"
                  value={selectedTask?.maxCompletionTimes}
                  onChange={(e) =>
                    setSelectedTask((prev) =>
                      prev
                        ? {
                            ...prev,
                            maxCompletionTimes: Number(e.target.value),
                          }
                        : null
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="taskUrl">任务 URL</Label>
                <Input
                  id="taskUrl"
                  value={selectedTask?.taskUrl}
                  onChange={(e) =>
                    setSelectedTask((prev) =>
                      prev ? { ...prev, taskUrl: e.target.value } : null
                    )
                  }
                />
              </div>
            </div>
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-6">
              <SheetClose asChild>
                <Button variant="outline">取消</Button>
              </SheetClose>
              <Button onClick={onSave}>保存更改</Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
