import { Pagination } from "@/lib/request";

/**
 * 奖励类型
 */
export type Reward = {
  taskRewardId: number;
  rewardType: string;
  rewardName: string;
  rewardValue: number;
};

export type RewardType = {
  rewardId?: number,
  rewardType: string,
  rewardName: string,
  description: string,
  tokenId: number,
  rewardSource: string
  createTime: string;
  updateTime: string;
}

export type RewardListResponse = {
  records: Reward[];
  pagination: Pagination;
};

export type RewardTypeListResponse = {
  records: RewardType[];
  pagination: Pagination;
};
