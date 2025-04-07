import { request } from "@/lib/request";
import { Reward, RewardType, RewardTypeListResponse } from "@/types/reward";

/**
 * 获取奖励列表
 * @returns
 */
export const getRewardList = (taskId: number) => {
  return request<Reward[]>(`/api/admin/tasks/rewards/${taskId}`, {
    method: "GET",
    data: {
      pageNum: 1,
      pageSize: 10,
      sortField: "createTime",
      sortMode: true,
    },
  });
};

/**
 * 获取奖励类型列表
 * @returns
 */
export const getRewardTypeList = () => {
  return request<RewardTypeListResponse>("/api/admin/rewards/page", {
    method: "POST",
    data: {
      pageNum: 1,
      pageSize: 10,
    },
  });
};


/**
 * 创建奖励类型
 * @returns
 */

export const createRewardType = ({ rewardType }: { rewardType: RewardType }) => {
  return request<Reward>(`/api/admin/rewards`, {
    method: "POST",
    data: rewardType
  });
};

/**
 * 更新奖励
 * @returns
 */
export const updateReward = ({
  taskRewardId,
  rewardValue,
}: {
  taskRewardId: number;
  rewardValue: number;
}) => {
  return request<Reward>(`/api/admin/tasks/rewards/${taskRewardId}`, {
    method: "PUT",
    data: {
      rewardValue,
    },
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
};

export const addReward = ({
  taskId,
  rewardValue,
  rewardId,
}: {
  taskId: number;
  rewardValue: number;
  rewardId: number;
}) => {
  return request<Reward>(`/api/admin/tasks/rewards/${taskId}`, {
    method: "POST",
    data: { taskId, rewardValue, rewardId },
  });
};

export const deleteReward = (taskRewardId: number) => {
  return request(
    `
/api/admin/tasks/rewards/${taskRewardId}`,
    {
      method: "DELETE",
    }
  );
};
