/**
 * 短剧标签类型
 */
export interface Tag {
  tagId: string;
  tagName: string;
  tagDescription: string | null;
  description?: string;
  color?: string;
  priority?: number;
  isSystem?: boolean;
  isActive?: boolean;
  isDisplayedOnHome?: boolean;
  displayOrder?: number;
  displaySection?: string;
  createTime?: string;
  updateTime?: string;
}

/**
 * 创建标签请求
 */
export interface CreateTagRequest {
  tagName: string;
  description?: string;
  color?: string;
  priority?: number;
  isSystem?: boolean;
  isActive?: boolean;
  isDisplayedOnHome?: boolean;
  displayOrder?: number;
  displaySection?: string;
}

/**
 * 更新标签请求
 */
export interface UpdateTagRequest extends CreateTagRequest {
  tagId: string;
}

/**
 * 添加标签到系列请求
 */
export interface AddTagToSeriesRequest {
  seriesId: string;
  tagId: string;
}

/**
 * 移除系列标签请求
 */
export interface RemoveTagFromSeriesRequest {
  seriesId: string;
  tagId: string;
}

/**
 * 添加新的接口定义
 */
export interface SeriesTagMapping {
  seriesId: string;
  title: string;
  tagId: string;
  tagName: string;
  tagDescription: string;
  color: string;
  priority: number;
  isSystem: boolean;
  isActive: boolean;
}

export interface GetTagsForSeriesRes {
  data: SeriesTagMapping[];
}
