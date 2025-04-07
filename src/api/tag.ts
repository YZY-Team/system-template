import { ApiResponse, request } from "@/lib/request";
import { Tag, CreateTagRequest, UpdateTagRequest } from "@/types/tag";
import { SeriesTagMapping } from "@/types/tag";

/**
 * 获取标签列表
 */
export const getTags = async (): Promise<ApiResponse<Tag[]>> => {
  return request<Tag[]>("/api/admin/tags/list");
};

/**
 * 获取标签详情
 */
export const getTagDetail = async (tagId: number): Promise<ApiResponse<Tag>> => {
  return request<Tag>(`/api/admin/tags/${tagId}`);
};

/**
 * 创建标签
 */
export const createTag = async (data: CreateTagRequest): Promise<ApiResponse<void>> => {
  return request("/api/admin/tags", {
    method: "POST",
    data,
  });
};

/**
 * 更新标签
 */
export const updateTag = async (tagId: string, data: UpdateTagRequest): Promise<ApiResponse<void>> => {
  return request(`/api/admin/tags/${tagId}`, {
    method: "PUT",
    data,
  });
};

/**
 * 删除标签
 */
export const deleteTag = async (tagId: string): Promise<ApiResponse<void>> => {
  return request(`/api/admin/tags/${tagId}`, {
    method: "DELETE",
  });
};

/**
 * 获取短剧的标签列表
 */
export const getTagsForSeries = async (): Promise<ApiResponse<SeriesTagMapping[]>> => {
  return request<SeriesTagMapping[]>('/api/admin/short-tags');
};

/**
 * 为短剧添加标签
 */
export const addTagToSeries = async (data: { seriesId: string; tagId: string }): Promise<ApiResponse<void>> => {
  return request("/api/admin/short-tags/add", {
    method: "POST",
    data,
  });
};

/**
 * 移除短剧标签
 */
export const removeTagFromSeries = async (data: { seriesId: string; tagId: string }): Promise<ApiResponse<void>> => {
  return request("/api/admin/short-tags/remove", {
    method: "DELETE",
    data,
  });
}; 