import { request } from "@/lib/request";

export type TaskType = {
  typeId: number;
  typeName: string;
  description: string;
  periodType: string;
};
const getTaskTypes = async () => {
  const response = await request<{ records: TaskType[] }>(
    "/api/admin/tasks/type/page",
    {
      method: "POST",
      data: {
        pageNum: 1,
        pageSize: 10,
      },
    }
  );
  return response.data;
};
const createTaskType = async ({
  typeId,
  typeName,
  description,
  periodType,
}: TaskType) => {
  const response = await request("/api/admin/tasks/type", {
    method: "POST",
    data: {
      typeId,
      typeName,
      description,
      periodType,
    },
  });
  return response.data;
};

const updateTaskType = async ({
  taskId,
  taskTypeId,
}: {
  taskId: number;
  taskTypeId: number;
}) => {
  const response = await request(`/api/admin/tasks/${taskId}/types`, {
    method: "POST",
    data: {
      taskTypeId,
    },
  });
  return response.data;
};

export const taskTypeApi = {
  getTaskTypes,
  createTaskType,
  updateTaskType,
};
