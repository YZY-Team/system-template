import { ApiResponse, request } from "@/lib/request";
import { MinioUploadFileRes } from "@/types/api";

export enum FileSourceEnum {
  SERIES_COVER = 'SERIES_COVER',
  SERIES_EPISODE = 'SERIES_EPISODE',
  SERIES_CAROUSEL = 'SERIES_CAROUSEL',
  IMAGE_URL = 'IMAGE_URL',
  TASK_LOGO = 'TASK_LOGO'
}

/**
 * Minio 文件上传
 * @param source - 来源类型 (SERIES_EPISODE,SERIES_COVER,SERIES_CAROUSEL,IMAGE_URL,TASK_LOGO)
 * @param relatedId - 关联ID
 * @param file - 文件对象
 */
export const minioUploadFile = async ({
  source,
  relatedId,
  file,
}: {
  source: FileSourceEnum;
  relatedId: string;
  file: File;
}): Promise<ApiResponse<MinioUploadFileRes>> => {
  const formData = new FormData();
  formData.append('file', file);

  const queryParams = new URLSearchParams({
    source: source,
    relatedId: relatedId,
  });

  return request<MinioUploadFileRes>(`/api/system/file/minio-upload?${queryParams.toString()}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: formData,
  });
};
