/**
 * 导入所需的API函数
 */
import {
  addReward,
  deleteReward,
  getRewardList,
  getRewardTypeList,
  updateReward,
} from "@/api/reward";
/**
 * 导入UI组件
 */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Reward } from "@/types/reward";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CircleX, Save } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * 奖励组件
 * @param defaultValue - 默认奖励类型
 * @param defaultrewardValue - 默认奖励数量
 * @param taskRewardId - 任务奖励ID
 * @param taskId - 任务ID
 * @param rewardName - 奖励名称
 */
const RewardComponent = ({
  defaultValue,
  defaultrewardValue,
  taskRewardId,
  taskId,
  rewardName,
}: {
  defaultValue: string;
  defaultrewardValue: number;
  taskRewardId: number;
  taskId: number;
  rewardName: string;
}) => {
  // 状态管理
  const [rewardValue, setrewardValue] = useState(defaultrewardValue);
  const [rewardType, setRewardType] = useState(defaultValue);
  const [rewardId, setRewardId] = useState(taskRewardId);
  const queryClient = useQueryClient();

  // 获取奖励类型列表
  const { data: rewardTypeListData } = useQuery({
    queryKey: ["rewardTypeList"],
    queryFn: () => getRewardTypeList(),
  });
  const rewardTypeList = rewardTypeListData?.data.records || [];

  // 更新奖励的mutation
  const { mutate: updateRewardMutate } = useMutation({
    mutationFn: updateReward,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rewardList", taskId] });
      toast("更新奖励成功");
    },
    onError: () => {
      toast("更新奖励失败");
    },
  });

  // 添加奖励的mutation
  const { mutate: addRewardMutate } = useMutation({
    mutationFn: addReward,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rewardList", taskId] });
      toast("添加奖励成功");
    },
    onError: () => {
      toast("添加奖励失败");
    },
  });

  // 删除奖励的mutation
  const { mutate: deleteRewardMutate } = useMutation({
    mutationFn: deleteReward,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rewardList", taskId] });
      toast("删除奖励成功");
    },
    onError: () => {
      toast("删除奖励失败");
    },
  });

  /**
   * 保存奖励
   * 如果是新建则调用添加接口，否则调用更新接口
   */
  const saveReward = () => {
    if (rewardName === "create") {
      addRewardMutate({ taskId, rewardValue, rewardId });
    } else {
      updateRewardMutate({ taskRewardId, rewardValue });
    }
  };

  return (
    <div className="flex gap-2 items-center">
      <Select
        defaultValue={defaultValue}
        onValueChange={(value) => {
          setRewardType(value);
          setRewardId(
            rewardTypeList.find((item) => item.rewardType === value)?.tokenId ||
              0
          );
        }}
      >
        <SelectTrigger className="w-[180px] focus:outline-none">
          <SelectValue className="" placeholder="选择奖励类型" />
        </SelectTrigger>
        <SelectContent className="focus:outline-none">
          {rewardTypeList.map(({ rewardType }) => (
            <SelectItem key={rewardId} value={rewardType}>
              {rewardType}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        className="w-[100px]"
        type="number"
        value={rewardValue}
        onChange={(e) => setrewardValue(Number(e.target.value))}
        placeholder="输入奖励值"
      />
      {/* 非新建状态显示删除按钮 */}
      {rewardName !== "create" && (
        <CircleX size={30} onClick={() => deleteRewardMutate(taskRewardId)} />
      )}
      {/* 数值变化时显示保存按钮 */}
      {(defaultrewardValue !== rewardValue || defaultValue !== rewardType) && (
        <Save onClick={saveReward} color="red" size={30} />
      )}
    </div>
  );
};

/**
 * 奖励列表组件
 * @param taskId - 任务ID
 */
export const Rewards = ({ taskId }: { taskId: number }) => {
  // 获取奖励列表数据
  const { data: rewardListData } = useQuery({
    queryKey: ["rewardList", taskId],
    queryFn: () => getRewardList(taskId),
  });

  // 本地状态管理
  const [rewardList, setRewardList] = useState<Reward[]>([]);
  useEffect(() => {
    if (rewardListData?.data) {
      setRewardList(rewardListData.data);
    }
  }, [rewardListData]);

  /**
   * 添加新的奖励
   */
  const addReward = () => {
    setRewardList([
      ...rewardList,
      {
        taskRewardId: 0,
        rewardValue: 0,
        rewardType: "",
        rewardName: "create",
      },
    ]);
  };

  return (
    <Popover>
      <PopoverTrigger>
        <Button variant="outline">奖励设置</Button>
      </PopoverTrigger>
      <PopoverContent className="flex min-h-7 flex-col gap-2 w-[400px]">
        {rewardList.map((item) => (
          <RewardComponent
            key={item.taskRewardId}
            taskRewardId={item.taskRewardId}
            defaultrewardValue={item.rewardValue}
            defaultValue={item.rewardType}
            taskId={taskId}
            rewardName={item.rewardName}
          />
        ))}
        <div className="flex justify-center">
          <Button onClick={addReward} variant="outline" className="w-16">
            添加
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
