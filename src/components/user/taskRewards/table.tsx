import { forwardRef, useImperativeHandle, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RewardType } from "@/types/reward";
import { createRewardType } from "@/api/reward";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface RewardTableProps {
  data: RewardType[];
}

export const RewardTable = forwardRef<
  { handleCreate: () => void },
  RewardTableProps
>(({ data }, ref) => {
  const [open, setOpen] = useState(false);
  const [selectedReward, setSelectedReward] = useState<RewardType | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const queryClient = useQueryClient();

  useImperativeHandle(ref, () => ({
    handleCreate: () => {
      setSelectedReward(null);
      setIsCreating(true);
      setOpen(true);
    },
  }));

  const handleEdit = (reward: RewardType) => {
    setSelectedReward(reward);
    setIsCreating(false);
    setOpen(true);
  };

  const handleSave = async (formData: RewardType) => {
    try {
      if (isCreating) {
        await createRewardType({ rewardType: formData });
        toast.success("奖励类型创建成功");
        queryClient.invalidateQueries({ queryKey: ["rewardTypes"] });
      } else {
        // TODO: Implement edit functionality
        toast.success("更新成功");
        queryClient.invalidateQueries({ queryKey: ["rewardTypes"] });
      }
      setOpen(false);
    } catch (error) {
      toast.error(
        isCreating
          ? error instanceof Error
            ? error.message
            : "创建失败"
          : "更新失败"
      );
    }
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>奖励类型</TableHead>
              <TableHead>奖励名称</TableHead>
              <TableHead>描述</TableHead>
              <TableHead>Token ID</TableHead>
              <TableHead>奖励来源</TableHead>
              <TableHead>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((reward) => (
              <TableRow key={reward.tokenId}>
                <TableCell>{reward.rewardType}</TableCell>
                <TableCell>{reward.rewardName}</TableCell>
                <TableCell>{reward.description}</TableCell>
                <TableCell>{reward.tokenId}</TableCell>
                <TableCell>{reward.rewardSource}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => handleEdit(reward)}
                    >
                      编辑
                    </Button>
                    <Button
                      variant="ghost"
                      className="text-red-600 hover:text-red-800"
                      onClick={() => {
                        /* 删除操作 */
                      }}
                    >
                      删除
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{isCreating ? "添加奖励类型" : "编辑奖励"}</SheetTitle>
            <SheetDescription>
              {isCreating ? "创建新的奖励类型" : "修改奖励信息"}
              。完成后点击保存。
            </SheetDescription>
          </SheetHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const rewardData = {
                rewardType: formData.get("rewardType") as string,
                rewardName: formData.get("rewardName") as string,
                description: formData.get("description") as string,
                tokenId: formData.get("tokenId") as string,
                rewardSource: formData.get("rewardSource") as string,
              };
              handleSave(rewardData as unknown as RewardType);
            }}
            className="space-y-4"
          >
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="rewardType" className="text-right">
                  奖励类型
                </Label>
                <Input
                  id="rewardType"
                  name="rewardType"
                  defaultValue={selectedReward?.rewardType}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="rewardName" className="text-right">
                  奖励名称
                </Label>
                <Input
                  id="rewardName"
                  name="rewardName"
                  defaultValue={selectedReward?.rewardName}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  描述
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={selectedReward?.description}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="tokenId" className="text-right">
                  Token ID
                </Label>
                <Input
                  id="tokenId"
                  name="tokenId"
                  defaultValue={selectedReward?.tokenId}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="rewardSource" className="text-right">
                  奖励来源
                </Label>
                <Input
                  id="rewardSource"
                  name="rewardSource"
                  defaultValue={selectedReward?.rewardSource}
                  className="col-span-3"
                  required
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                取消
              </Button>
              <Button type="submit">保存</Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </>
  );
});

RewardTable.displayName = "RewardTable";
