import { request } from "@/lib/request";
import { AxiosProgressEvent } from "axios";
import { EpisodeResponse } from "@/types/short-episode";

export const getShortEpisodeBySerieId = async (params: {
  seriesId: string | number;
  pageNum: number;
  pageSize: number;
}) => {
  const requestParams = {
    ...params,
    seriesId: String(params.seriesId)
  };

  const response = await request<EpisodeResponse>("/api/admin/episode/page", {
    method: "POST",
    data: requestParams,
  });

  return response;
};

export const updateShortEpisodeFree = async (params: {
  episodeId: string;
  seriesId: string;
  isFree: boolean;
}) => {
  return request(`/api/admin/episode/${params.episodeId}/free`, {
    method: "PUT",
    data: params,
  });
};

export const createShortEpisode = async (data: {
  seriesId: string;
  title: string;
  episodeNumber: number;
}) => {
  return request("/api/admin/episode", {
    method: "POST",
    data,
  });
};

interface UploadVideoResponse {
  code: number;
  message: string;
  data: {
    url: string;
  };
}

export const uploadVideo = async (
  formData: FormData,
  onProgress?: (progressEvent: AxiosProgressEvent) => void
) => {
  return request<UploadVideoResponse>("/api/system/file/aws-upload", {
    method: "POST",
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    timeout: 300000, // 5分钟超时
    onUploadProgress: onProgress,
  });
};

// 添加返回值接口定义
interface GetVideoUrlRes {
  code: number;
  message: string;
  data: string;
}

/**
 * 获取视频预览URL
 * @param episodeId - 剧集ID
 * @returns Promise<GetVideoUrlRes>
 */
export const getVideoUrl = (episodeId: string) => {
  return request<GetVideoUrlRes>(
    `/api/system/file/video-url/get?episodeId=${episodeId}`,
    {
      method: "GET",
    }
  );
};

interface DeleteEpisodeRes {
  code: number;
  message: string;
  data: null;
}

/** 
 * 删除剧集
 * @param {string} episodeId - 剧集ID
 * @returns {Promise<DeleteEpisodeRes>} 删除结果
 */
export const deleteEpisode = async (episodeId: string): Promise<DeleteEpisodeRes> => {
  console.log('Calling deleteEpisode with:', episodeId);
  try {
    const response = await request<DeleteEpisodeRes>(`/api/admin/episode/${episodeId}`, {
      method: "DELETE",
    });
    console.log('Delete response:', response);
    return {
      code: response.code,
      message: response.message,
      data: null
    };
  } catch (error) {
    console.error('Delete API error:', error);
    throw error;
  }
};
