import { request } from "@/lib/request";
import { TaskGroup } from "@/types/taskGroupType";
import { useQuery } from "@tanstack/react-query";

export interface TaskGroupResponse {
  records: TaskGroup[];
  total: number;
  size: number;
  current: number;
}

export interface CreateTaskGroupParams {
  groupName: string;
  groupDescription: string;
}

export interface UpdateTaskGroupParams {
  taskId: number;
  groupId: number;
}

/**
 * 获取任务分组列表
 */
export const getTaskGroupList = () => {
  return request<TaskGroupResponse>("/api/admin/tasks/group/page", {
    method: "POST",
    data: {
      pageNum: 1,
      pageSize: 10,
    },
  });
};

/**
 * 创建任务分组
 */
export const createTaskGroup = (data: CreateTaskGroupParams) => {
  return request<TaskGroup>("/api/admin/tasks/group", {
    method: "POST",
    data,
  });
};

/**
 * 更新任务分组
 */
export const updateTaskGroup = (data: UpdateTaskGroupParams) => {
  return request<TaskGroup>(`/api/admin/tasks/${data.taskId}/group`, {
    method: "POST",
    data: {
      groupId: data.groupId,
    },
  });
};

/**
 * 删除任务分组
 */
export const deleteTaskGroup = (id: number) => {
  return request<void>(`/api/admin/tasks/group/${id}/delete`, {
    method: "DELETE",
  });
};

export const useTaskGroupList = () => {
  return useQuery({
    queryKey: ["taskGroups"],
    queryFn: () => getTaskGroupList(),
  });
};

export const taskGroupApi = {
  getTaskGroupList,
  createTaskGroup,
  updateTaskGroup,
  deleteTaskGroup,
};
