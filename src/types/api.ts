export interface ApiResponse<T = any> {
  code: number;
  data: T;
  message: string;
}

export interface PaginationResponse<T> {
  records: T[];
  pagination: {
    current: string;
    size: string;
    total: string;
    pages: string;
  };
}

// 添加 Minio 上传响应类型
export interface MinioUploadFileRes {
  url: string;
  path: string;
} 