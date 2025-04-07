import { ApiResponse, request } from "@/lib/request";
import {
  ShortHomepage,
  ShortHomepageListParams,
  ShortHomepageListResponse,
  UploadResponse,
} from "@/types/short-homepage";

/**
 * 创建短首页
 * @returns 返回创建短首页结果
 */
export const createShortHomepage = async (
  params: Omit<ShortHomepage, "carouselId">
) => {
  const res = await request("/api/admin/homepage", {
    method: "POST",
    data: params,
  });
  return res.data;
};

/**
 * 更新短首页
 * @param params 更新短首页参数
 * @returns 返回更新短首页结果
 */
export const uploadShortHomepage = async ({
  source,
  relatedId,
  file
}: {
  source: string;
  relatedId: string;
  file: File;
}): Promise<ApiResponse<UploadResponse>> => {
  const formData = new FormData();
  formData.append('source', source);
  formData.append('relatedId', relatedId);
  formData.append('file', file);

  return request<UploadResponse>('/api/upload', {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: formData,
  });
};

/**
 * 获取短首页列表
 * @param params - 短首页列表参数
 * @returns 返回短首页列表数据
 */
export const getShortHomepageList = async ({
  pageNum,
  pageSize,
  sortField = "position",
  sortMode = true,
}: ShortHomepageListParams): Promise<
  ApiResponse<ShortHomepageListResponse>
> => {
  const res = request<ShortHomepageListResponse>("/api/admin/homepage/page", {
    method: "POST",
    data: {
      pageNum,
      pageSize,
      sortField,
      sortMode,
    },
  });
  return res;
};

/**
 * 更新短首页
 * @param params - 更新短首页参数
 * @returns 返回更新短首页数据
 */
export const updateShortHomepage = async (params: ShortHomepage) => {
  const res = request(`/api/admin/homepage/${params.carouselId}`, {
    method: "PUT",
    data: params,
  });
  return res;
};

/**
 * 删除轮播图
 * @param carouselId - 轮播图ID
 */
export const deleteShortHomepage = async (carouselId: string): Promise<ApiResponse<void>> => {
  const res = await request<void>(`/api/admin/homepage/${carouselId}`, {
    method: "DELETE",
  });
  return res;
};
