import { Pagination } from "@/lib/request";

export interface ShortEpisode {
  episodeId: string;
  title: string;
  description: string;
  episodeNumber: number;
  hasVideo: boolean;
  videoUrl?: string;
  duration?: string;
  playCount: number;
  releaseStatus: string;
  createTime: string;
  updateTime: string;
  isFree: boolean;
}

export interface EpisodeResponse {
  records: ShortEpisode[];
  total: number;
  size: number;
  current: number;
  pages: number;
  pagination: {
    total: number;
    pages: number;
    current: number;
    size: number;
  };
}

// 剧集列表
export type ShortEpisodeListResponse = {
  records: ShortEpisode[];
  pagination: Pagination;
};

// 创建剧集的参数
export interface CreateShortEpisode {
  seriesId: bigint; // 系列ID
  title?: string; // 标题
  episodeNumber?: number; // 集数
  description?: string; // 描述
  videoUrl?: string; // 视频URL
  durationMinutes?: number; // 视频时长(分钟)
  price?: number; // 价格
  priceType?: string; // 价格类型
  ossPlatform?: string; // 对象存储平台
  videoResolution?: string; // 视频分辨率
  videoFormat?: string; // 视频格式
  subtitleLanguage?: string; // 字幕语言
  videoSize?: number; // 视频大小
  videoQuality?: string; // 视频质量
  language?: string; // 语言
  releaseStatus?: string; // 发布状态
  accessLevel?: string; // 访问级别
}

export type UpdateShortEpisode = CreateShortEpisode & {
  isFree?: boolean; // 是否免费
  playCount?: number; // 播放次数
};

// 更新剧集的表单
export interface UpdateShortEpisodeForm {
  seriesId?: string; // 系列ID
  title?: string; // 标题
  episodeNumber?: number; // 集数
  description?: string; // 描述
  videoUrl?: string; // 视频URL
  durationMinutes?: number; // 视频时长(分钟)
  price?: number; // 价格
  priceType?: string; // 价格类型
  ossPlatform?: string; // 对象存储平台
  videoResolution?: string; // 视频分辨率
  videoFormat?: string; // 视频格式
  subtitleLanguage?: string; // 字幕语言
  videoSize?: number; // 视频大小
  videoQuality?: string; // 视频质量
  language?: string; // 语言
  releaseStatus?: string; // 发布状态
  accessLevel?: string; // 访问级别
  isFree?: boolean; // 是否免费
}

// 如果需要，也可以添加创建短剧集时的接口
export interface CreateShortEpisodeRequest {
  seriesId: bigint;
  title: string;
  episodeNo: number;
  description: string;
  duration: number;
  price: number;
  storePlatform: string;
  videoFormat: string;
  videoSize: number;
  videoQuality: string;
  language: string;
  subtitle: string;
  status: string;
  accessLevel: string;
}

export interface CreateEpisodeRequest {
  seriesId: string;  // 对应 Java 的 Long
  title: string;
  episodeNumber: number;
}
