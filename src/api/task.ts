import { ApiResponse, Pagination, request } from "@/lib/request";
import {
  CreateTaskData,
  Task,
  TaskApiResponse,
  TaskListParams,
  TaskResponse,
  TaskType,
} from "@/types/task";

/**
 * 获取任务列表
 * @param params 任务列表参数
 * @returns 返回任务列表
 */
export const GetTaskList = async (
  params: TaskListParams
): Promise<TaskApiResponse> => {
  const response = request<TaskResponse>("/api/admin/tasks/page", {
    method: "POST",
    data: params,
  });
  return response;
};

/**
 * 创建任务
 * @param data - 创建任务数据
 * @returns 返回创建任务数据
 */
export const CreateTask = async (
  data: CreateTaskData
): Promise<ApiResponse<CreateTaskData>> => {
  return request("/api/admin/tasks", {
    method: "POST",
    data,
  });
};

/**
 * 激活任务
 * @param taskId - 任务ID
 * @returns 返回激活任务数据
 */
export const ActiveTask = async (
  taskId: string
): Promise<ApiResponse<Task>> => {
  return request(`/api/admin/tasks/${taskId}/active`, {
    method: "PUT",
  });
};

/**
 * 更新任务
 * @param taskId - 任务ID
 * @param data - 更新任务数据
 * @returns 返回更新任务数据
 */
export const UpdateTask = async ({
  taskId,
  data,
}: {
  taskId: number;
  data: CreateTaskData;
}): Promise<ApiResponse<CreateTaskData>> => {
  console.log('Updating task with data:', data);
  
  return request(`/api/admin/tasks/${taskId}`, {
    method: "PUT",
    data,
  });
};

/**
 * 获取任务类型
 * @returns 返回任务类型
 */
export const GetTaskType = async (): Promise<
  ApiResponse<{
    records: TaskType[];
    pagination: Pagination;
  }>
> => {
  return request(`/api/admin/tasks/type/page`, {
    method: "POST",
  });
};



/** 
 * 获取任务详情
 * @param taskId - 任务ID
 * @returns 返回任务详情
 * */
export const GetTaskInfo = async (
  taskId: number
): Promise<ApiResponse<Task>> => {
  return request(`/api/admin/tasks/${taskId}`, {
    method: "GET",
  });
};
