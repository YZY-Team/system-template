/**
 * 短剧基础信息
 */
export interface ShortSeries {
  seriesId: string;
  title: string;
  description: string;
  coverImageUrl: string;
  isActive: boolean;
  genre: string;
  language: string;
  releaseDate: string;
  createTime: string;
  updateTime: string;
}

/**
 * 创建短剧请求
 */
export interface CreateShortSerie {
  title: string;
  description: string;
  genre: string;
  language: string;
  coverImageUrl: string;
  isActive: boolean;
  isFree: boolean;
  releaseDate: string;
  price: number;
  ageRestriction: number;
  tags: string;
  releaseStatus: string;
  subtitleLanguages: string;
  director: string;
  mainCast: string;
  region: string;
  duration: number;
  country: string;
  accessLevel: string;
}

/**
 * 短剧详情
 */
export interface ShortSerieInfo extends ShortSeries {
  id: string;
  price: number;
  ageRestriction: number;
  tags: string;
  releaseStatus: string;
  subtitleLanguages: string;
  director: string;
  mainCast: string;
  region: string;
  duration: number;
  country: string;
  accessLevel: string;
  isFree?: boolean;
}

/**
 * 更新短剧请求
 */
export interface UpdateShortSerieProps {
  seriesId: string;
  data: CreateShortSerie;
}

/**
 * 短剧列表响应
 */
export interface ShortSeriesListResponse {
  records: ShortSeries[];
  total: number;
  current: number;
  hasMore: boolean;
}

/**
 * 获取短剧列表参数
 */
export interface GetShortSeriesParams {
  pageNum: number;
  pageSize: number;
  keyword?: string;
}
