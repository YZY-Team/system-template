import { ApiResponse, Pagination } from "@/lib/request";

/**
 * 任务
 */
export type Task = {
  taskId: number;
  taskName: string;
  taskContent: string;
  maxCompletionTimes: number;
  taskUrl: string;
  isExternal: boolean;
  isActive: boolean;
  module: string;
  displayOrder: number;
  startTime: string;
  endTime: string;
  createTime: string;
  updateTime: string;
  types: string;
  groups:[]
  rewards:[]
};

/**
 * 任务列表参数
 */
export type TaskListParams = {
  pageNum: number;
  pageSize: number;
  sortField?: string;
  sortMode?: boolean;
  taskName?: string;
  isActive?: boolean;
};

/**
 * 任务列表响应
 */
export type TaskResponse = {
  records: Task[];
  pagination: Pagination;
};

/**
 * 任务API响应
 */
export type TaskApiResponse = ApiResponse<TaskResponse>;

// 创建任务时不需要传入id、createTime、updateTime
export type CreateTaskData = Omit<Task, "createTime" | "updateTime" | "taskId">;

/**
 * 任务类型的类型
 */
export type TaskType = {
  typeId: number;
  typeName: string;
  description: string | null;
  periodType: string;
  createTime: string;
  updateTime: string;
};

export type UpdateTaskData = CreateTaskData;
