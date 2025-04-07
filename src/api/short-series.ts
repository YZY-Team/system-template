import { ApiResponse, request } from "@/lib/request";
import {
  CreateShortSerie,
  ShortSerieInfo,
} from "@/types/short-series";
import { Tag } from "@/types/tag";

interface GetShortSeriesParams {
  pageNum: number;
  pageSize: number;
  title?: string;
  isFree?: boolean;
  isActive?: boolean;
  sortField?: string;
  sortMode?: boolean;
}

interface SeriesResponse {
  records: {
    seriesId: string;
    title: string;
    description: string;
    coverImageUrl: string;
    isActive: boolean;
    genre: string;
    releaseDate: string;
    language: string;
    // ... 其他字段
  }[];
  total: number;
  current: number;
  hasMore: boolean;
}

/**
 * 获取短剧列表
 * @returns {SeriesResponse} 短剧列表
 */
export const getShortSeries = async (params: GetShortSeriesParams): Promise<ApiResponse<SeriesResponse>> => {
  const res = await request<SeriesResponse>("/api/admin/series/page", {
    method: "POST",
    data: {
      pageNum: params.pageNum,
      pageSize: params.pageSize,
      title: params.title || undefined,
      isFree: typeof params.isFree === 'boolean' ? params.isFree : undefined,
      isActive: typeof params.isActive === 'boolean' ? params.isActive : undefined,
      sortField: params.sortField || "createTime",
      sortMode: params.sortMode ?? false,
    },
  });

  return res;
};

/**
 * 获取短剧详情
 * @param seriesId - 短剧ID
 * @returns {ShortSerieInfo} 短剧详情
 */
export const getShortSerieInfo = async (
  seriesId: string
): Promise<ApiResponse<ShortSerieInfo>> => {
  const res = request<ShortSerieInfo>(`/api/admin/series/${seriesId}`);
  return res;
};

export const createShortSerie = async (
  data: CreateShortSerie
): Promise<ApiResponse<ShortSerieInfo>> => {
  return request("/api/admin/series", {
    method: "POST",
    data,
  });
};

export const updateShortSerie = async ({
  seriesId,
  data,
}: {
  seriesId: string;
  data: CreateShortSerie;
}): Promise<ApiResponse<ShortSerieInfo>> => {
  return request(`/api/admin/series/${seriesId}`, {
    method: "PUT",
    data,
  });
};

/**
 * 获取标签列表
 * @returns {Tag[]} 标签列表
 */
export const getTags = async (): Promise<ApiResponse<Tag[]>> => {
  const res = request<Tag[]>(`/api/admin/tags/list`);
  return res;
};

export const addShortSerieTags = async ({
  seriesId,
  tagId,
}: {
  seriesId: string;
  tagId: string;
}): Promise<ApiResponse<string[]>> => {
  const res = request<string[]>(`/api/admin/short-tags/add`, {
    method: "POST",
    data: {
      seriesId,
      tagId,
    },
  });
  return res;
};

export const getShortSerieTags = async (
  seriesId: string
): Promise<ApiResponse<Tag[]>> => {
  const res = request<Tag[]>(`/api/admin/short-tags/series/${seriesId}/tags`);
  return res;
};

export const deleteShortSerieTags = async ({
  seriesId,
  tagId,
}: {
  seriesId: string;
  tagId: string;
}): Promise<ApiResponse<string[]>> => {
  const res = request<string[]>(`/api/admin/short-tags/remove`, {
    method: "DELETE",
    data: {
      seriesId,
      tagId,
    },
  });
  return res;
};

interface SeriesData {
  coverImage: string;
  // 添加其他需要的字段
}

export const updateSeries = async (seriesId: string, data: SeriesData): Promise<ApiResponse<SeriesResponse>> => {
  return request<SeriesResponse>(`/api/admin/series/${seriesId}`, {
    method: "PUT",
    data
  });
};
