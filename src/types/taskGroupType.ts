

export interface CreateTaskGroupParams {
  groupName: string;
  groupDescription: string;
}

export interface UpdateTaskGroupParams extends CreateTaskGroupParams {
  id: number;
}

export interface TaskGroup {
  createTime: string;
  description: string;
  groupId: number;
  groupName: string;
  updateTime: string;
}
