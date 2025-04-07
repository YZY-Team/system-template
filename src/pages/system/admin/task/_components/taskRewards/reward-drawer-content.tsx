import {
  deleteTaskReward,
  getTaskReward,
  updateTaskReward,
} from "@/api/task-reward";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import React from "react";

import { Reward } from "@/types/reward";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { AddRewardDialog } from "./add-reward-dialog";

interface RewardDrawerContentProps {
  taskId: number;
}

export function RewardDrawerContent({ taskId }: RewardDrawerContentProps) {
  const [showAddDialog, setShowAddDialog] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState<number | null>(null);
  const [editingId, setEditingId] = React.useState<number | null>(null);
  const [editForm, setEditForm] = React.useState<{
    rewardValue: string;
  }>({ rewardValue: "" });

  const {
    data: rewards,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["taskReward", taskId],
    queryFn: () => getTaskReward(taskId),
    enabled: !!taskId,
  });

  const handleDelete = async (taskRewardId: number) => {
    try {
      setIsDeleting(taskRewardId);
      await deleteTaskReward(taskRewardId);
      toast.success("删除奖励成功");
      refetch();
    } catch (error) {
      console.error("删除奖励失败:", error);
      toast.error("删除奖励失败，请重试");
    } finally {
      setIsDeleting(null);
    }
  };

  const startEdit = (reward: Reward) => {
    setEditingId(reward.taskRewardId);

    setEditForm({
      rewardValue: String(reward.rewardValue),
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ rewardValue: "" });
  };

  const handleSave = async (taskRewardId: number) => {
    try {
      await updateTaskReward({
        taskRewardId,
        rewardValue: Number(editForm.rewardValue),
      });
      toast.success("更新奖励成功");
      refetch();
      cancelEdit();
    } catch (error) {
      console.error("更新奖励失败:", error);
      toast.error("更新奖励失败，请重试");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">加载中...</div>
    );
  }

  return (
    <div className="space-y-6 pt-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">当前任务奖励</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAddDialog(true)}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          添加奖励
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">奖励类型</TableHead>
            <TableHead className="w-[120px]">奖励数量</TableHead>
            <TableHead className="w-[120px]">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rewards?.data.map((reward) => (
            <TableRow key={reward.taskRewardId}>
              <TableCell className="w-[200px]">{reward.rewardType}</TableCell>
              <TableCell className="w-[120px]">
                <Input
                  type="number"
                  value={
                    editingId === reward.taskRewardId
                      ? editForm.rewardValue
                      : reward.rewardValue
                  }
                  onChange={(e) => {
                    if (editingId !== reward.taskRewardId) {
                      startEdit(reward);
                    }
                    setEditForm((prev) => ({
                      ...prev,
                      rewardValue: e.target.value,
                    }));
                  }}
                  onBlur={() => {
                    if (editingId === reward.taskRewardId) {
                      handleSave(reward.taskRewardId);
                    }
                  }}
                  className="w-[80px]"
                />
              </TableCell>
              <TableCell className="w-[120px]">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleDelete(reward.taskRewardId)}
                  disabled={isDeleting === reward.taskRewardId}
                >
                  {isDeleting === reward.taskRewardId ? "删除中..." : "删除"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {rewards?.data?.length === 0 && (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-4">
                暂无奖励配置
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <AddRewardDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        taskId={taskId}
        onSuccess={() => {
          refetch();
          setShowAddDialog(false);
        }}
      />
    </div>
  );
}
