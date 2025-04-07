import { Pagination } from "@/lib/request";

/**
 * 短首页类型
 */
export interface ShortHomepage {
  carouselId: string;
  seriesId: string;
  position: number;
  isActive: boolean;
  description: string;
  title: string;
  imageUrl: string;
  displayStartTime: string;
  displayEndTime: string;
}

/**
 * 上传短首页参数
 */
export type UploadShortHomepage = {
  source: string;
  relatedId: string;
  file: File;
};

/**
 * 上传短首页响应
 */
export type UploadShortHomepageResponse = {
  fileId: string;
  url: string;
};

/**
 * 短首页列表参数
 */
export type ShortHomepageListParams = {
  pageNum: number;
  pageSize: number;
  sortField?: string;
  sortMode?: boolean;
};

/**
 * 短首页列表响应
 */
export type ShortHomepageListResponse = {
  records: ShortHomepage[];
  pagination: Pagination;
};

/**
 * 上传响应类型
 */
export interface UploadResponse {
  url: string;
  path: string;
}
