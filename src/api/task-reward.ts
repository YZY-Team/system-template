/* 配置任务奖励 */
import { ApiResponse } from "@/types/api";
import { request } from "@/lib/request";
import { Reward } from "@/types/reward";

/** 获取指定任务的奖励 */
export const getTaskReward = (taskId: number) => {
    return request<Reward[]>(`/api/admin/tasks/rewards/${taskId}`, {
        method: "GET",
    });
};


export const addTaskReward = ({ taskId, rewardId, rewardValue }: {
    taskId: number;
    rewardId: number;
    rewardValue: number;
}) => {
    return request<ApiResponse<any>>(`/api/admin/tasks/rewards/${taskId}`, {
        method: "POST",
        data: {
            rewardId,
            rewardValue
        },
    });
};

export const updateTaskReward = (data: {
    taskRewardId: number;
    rewardValue: number;
}) => {
    return request<ApiResponse<any>>(`/api/admin/tasks/rewards/${data.taskRewardId}`, {
        method: "PUT",
        data:{
            rewardValue: data.rewardValue
        },
    });
};

export const deleteTaskReward = (taskRewardId: number) => {
    return request<ApiResponse<any>>(`/api/admin/tasks/rewards/${taskRewardId}`, {
        method: "DELETE",
    });
};