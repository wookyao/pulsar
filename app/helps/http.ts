import axios from "axios";
import type {
  AxiosInstance,
  AxiosProgressEvent,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

// 创建请求实例
const instance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 请求拦截器
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 从 localStorage 获取 token
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    // 如果是文件下载，直接返回响应
    if (response.config.responseType === "blob") {
      return response.data;
    }

    const { data } = response;

    // 这里可以根据你的后端接口规范调整
    if (data.code === 200) {
      return data.data;
    }

    // 处理其他状态码
    const error = new Error(data.message || "Request failed") as Error & {
      code?: number;
    };
    error.code = data.code;
    return Promise.reject(error);
  },
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 未授权，清除 token 并跳转到登录页
          localStorage.removeItem("token");
          window.location.href = "/login";
          break;
        case 403:
          // 权限不足
          console.error("Permission denied");
          break;
        case 404:
          console.error("API not found");
          break;
        case 500:
          console.error("Server error");
          break;
        default:
          console.error(`Error: ${error.message}`);
      }
    }
    return Promise.reject(error);
  }
);

interface UploadOptions {
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void;
  headers?: Record<string, string>;
}

interface DownloadOptions {
  filename?: string;
  onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void;
}

// 封装 HTTP 方法
export const http = {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return instance.get(url, config);
  },

  post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return instance.post(url, data, config);
  },

  put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return instance.put(url, data, config);
  },

  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return instance.delete(url, config);
  },

  patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return instance.patch(url, data, config);
  },

  // 文件上传
  upload<T = any>(
    url: string,
    file: File | FormData,
    options: UploadOptions = {}
  ): Promise<T> {
    const formData = file instanceof FormData ? file : new FormData();

    if (file instanceof File) {
      formData.append("file", file);
    }

    return instance.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        ...options.headers,
      },
      onUploadProgress: options.onUploadProgress,
    });
  },

  // 多文件上传
  uploadMultiple<T = any>(
    url: string,
    files: File[],
    options: UploadOptions = {}
  ): Promise<T> {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`file${index}`, file);
    });

    return instance.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        ...options.headers,
      },
      onUploadProgress: options.onUploadProgress,
    });
  },

  // 文件下载
  async download(url: string, options: DownloadOptions = {}): Promise<void> {
    const response = await instance.get(url, {
      responseType: "blob",
      onDownloadProgress: options.onDownloadProgress,
    });

    const blob = new Blob([response.data], { type: response.data.type });
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download =
      options.filename ||
      this.getFilenameFromResponse(response) ||
      "downloaded-file";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  },

  // 从响应头中获取文件名
  getFilenameFromResponse(response: AxiosResponse): string {
    const contentDisposition = response.headers["content-disposition"];
    if (contentDisposition) {
      const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
      const matches = filenameRegex.exec(contentDisposition);
      if (matches != null && matches[1]) {
        return matches[1].replace(/['"]/g, "");
      }
    }
    return "";
  },
};

export default http;
