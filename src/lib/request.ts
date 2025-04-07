import axios, { AxiosRequestConfig } from "axios";

export interface Pagination {
  current: string;
  size: string;
  total: string;
  pages: string;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

const http = axios.create({
  baseURL: "/",
  timeout: 300000, // 5分钟超时
  maxContentLength: Infinity,
  maxBodyLength: Infinity,
});

export const request = async <Data>(url: string, options: AxiosRequestConfig = {}): Promise<ApiResponse<Data>> => {
  try {
    const response = await http({
      url,
      method: options.method || 'GET',
      headers: {
        ...options.headers,
      },
      data: options.data,
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      timeout: 300000, // 5分钟
      ...(options.data instanceof FormData ? {
        transformRequest: [(data) => data],
        headers: {
          ...options.headers,
          'Content-Type': 'multipart/form-data',
        }
      } : {}),
      responseType: 'json',
      validateStatus: () => true,
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`Upload Progress: ${percentCompleted}%`);
          console.log('Uploaded:', progressEvent.loaded, 'Total:', progressEvent.total);
        }
      },
    });

    if (response.status >= 400) {
      console.error('Server response:', {
        status: response.status,
        statusText: response.statusText,
        data: response.data,
        headers: response.headers,
      });
      throw new Error(`Server error: ${response.data?.message || response.statusText}`);
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error('Request failed:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        headers: error.response.headers,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers,
        }
      });

      const errorMessage = error.response.data?.message 
        || error.response.data?.error 
        || error.response.data 
        || error.message;
      
      throw new Error(`Upload failed: ${errorMessage}`);
    }
    throw error;
  }
};
