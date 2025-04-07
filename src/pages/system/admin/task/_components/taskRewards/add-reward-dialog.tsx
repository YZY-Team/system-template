import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from '@tanstack/react-query';
import { getRewardTypeList } from '@/api/reward';
import { addTaskReward } from '@/api/task-reward';
import { useState } from 'react';
import { toast } from 'sonner';

interface AddRewardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskId: number;
  onSuccess: () => void;
}

export const AddRewardDialog: React.FC<AddRewardDialogProps> = ({ 
  open, 
  onOpenChange,
  taskId,
  onSuccess
}) => {
  const [selectedRewardId, setSelectedRewardId] = useState<string>('');
  const [rewardValue, setrewardValue] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: rewardTypes } = useQuery({
    queryKey: ['rewardTypes'],
    queryFn: () => getRewardTypeList(),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRewardId || !rewardValue) {
      toast.error('请选择奖励类型并输入奖励数量');
      return;
    }

    try {
      setIsSubmitting(true);
      await addTaskReward({
        taskId,
        rewardId: Number(selectedRewardId),
        rewardValue: Number(rewardValue)
      });
      
      toast.success('添加奖励成功');
      onSuccess();
      setSelectedRewardId('');
      setrewardValue('');
    } catch (error) {
      console.error('添加奖励失败:', error);
      toast.error('添加奖励失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>添加任务奖励</DialogTitle>
          <DialogDescription>
            为任务添加新的奖励类型和数量
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="rewardType">奖励类型</Label>
            <Select
              value={selectedRewardId}
              onValueChange={setSelectedRewardId}
            >
              <SelectTrigger>
                <SelectValue placeholder="选择奖励类型" />
              </SelectTrigger>
              <SelectContent>
                {rewardTypes?.data.records.map((type) => (
                  <SelectItem key={type.rewardName} value={String(type.rewardId)}>
                    {type.rewardType}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">奖励数量</Label>
            <Input
              id="amount"
              type="number"
              value={rewardValue}
              onChange={(e) => setrewardValue(e.target.value)}
              placeholder="输入奖励数量"
              min="0"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              取消
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? '添加中...' : '添加'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
