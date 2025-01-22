import { FetchResponse } from "#/fetch";
import useMessage from "@/store/use-message";

export type Middleware = {
  request?: (config: RequestInit) => RequestInit;
  response?: (
    response: Response,
    res: Blob | FetchResponse<any>
  ) => Promise<Response>;
};

class FetchClient {
  private middlewares: Middleware[] = [];

  private defaultTimeout = 5000;
  private baseUrl?: string;

  constructor(opts: { baseUrl?: string; middlewares?: Middleware[] }) {
    if (opts.middlewares && Array.isArray(opts.middlewares)) {
      this.middlewares = opts.middlewares;
    }
    if (opts.baseUrl) {
      this.baseUrl = opts.baseUrl;
    }
  }

  // 添加中间件
  use(middleware: Middleware) {
    this.middlewares.push(middleware);
  }

  // 清空中间件
  clear() {
    this.middlewares = [];
  }

  //发送请求
  async request<T = any>(url: string, options: RequestInit, timeout: number) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const config = this.applyRequestMiddlewares({
      ...options,
      signal: controller.signal,
    });

    try {
      const response = await fetch(this.baseUrl + url, config);
      clearTimeout(timeoutId);

      const res = await this.processResponse<T>(response);

      // 处理中间件
      await this.applyResponseMiddlewares(response, res);
      return res;
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error("Request timed out");
      }
      throw error;
    }
  }

  // get 请求
  get<T>(
    url: string,
    params: Record<string, any> = {},
    options: RequestInit = {}
  ) {
    // 处理参数
    url = this.formatParams(url, params);
    return this.request<T>(
      url,
      { ...options, method: "GET" },
      this.defaultTimeout
    ) as Promise<FetchResponse<T>>;
  }

  // post 请求
  post<T>(url: string, data: Record<string, any>, options: RequestInit = {}) {
    return this.request<T>(
      url,
      { ...options, method: "POST", body: JSON.stringify(data) },
      this.defaultTimeout
    ) as Promise<FetchResponse<T>>;
  }

  // put 请求
  put<T>(url: string, data: Record<string, any>, options: RequestInit = {}) {
    return this.request<T>(
      url,
      { ...options, method: "PUT", body: JSON.stringify(data) },
      this.defaultTimeout
    ) as Promise<FetchResponse<T>>;
  }

  // delete 请求
  delete<T>(url: string, options: RequestInit = {}) {
    return this.request<T>(
      url,
      { ...options, method: "DELETE" },
      this.defaultTimeout
    ) as Promise<FetchResponse<T>>;
  }

  // 处理文件上传
  upload<T>(url: string, file: File, options: RequestInit = {}) {
    const formData = new FormData();
    formData.append("file", file);
    return this.request<T>(
      url,
      { ...options, method: "POST", body: formData },
      this.defaultTimeout
    ) as Promise<FetchResponse<T>>;
  }

  // 处理文件下载
  async download(url: string, options: RequestInit = {}) {
    return this.request(
      url,
      { ...options, method: "GET" },
      this.defaultTimeout
    ) as Promise<Blob>;
  }

  // 处理中间件 （before）
  private applyRequestMiddlewares(config: RequestInit): RequestInit {
    return this.middlewares.reduce((acc, middleware) => {
      if (middleware.request) {
        return middleware.request(acc);
      }
      return acc;
    }, config);
  }

  // 处理中间件 （after）
  private async applyResponseMiddlewares<T>(
    response: Response,
    res: Blob | FetchResponse<T>
  ): Promise<Response> {
    let result = response;

    for (const middleware of this.middlewares) {
      if (middleware.response) {
        result = await middleware.response(result, res);
      }
    }

    return result;
  }

  // 处理 get 参数
  private formatParams(url: string, params: Record<string, any>) {
    if (Object.keys(params).length > 0) {
      const searchParams = new URLSearchParams();
      Object.keys(params).forEach((key) => {
        searchParams.append(key, params[key]);
      });
      url += `?${searchParams.toString()}`;
    }
    return url;
  }

  private processResponse = async <T = any>(
    response: Response
  ): Promise<FetchResponse<T> | Blob> => {
    let contentType = response.headers.get("Content-Type") || "";

    contentType = String(contentType).toLowerCase();

    if (
      contentType.includes("application/octet-stream") ||
      contentType.includes("image/")
    ) {
      return response.blob();
    }

    return response.json();
  };
}

// 中间件
const AuthMiddleware: Middleware = {
  request: (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    return config;
  },
  response: async (response, res) => {
    if (response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    if (!(res instanceof Blob)) {
      const code = res.code;
      if (code) {
        useMessage.getState().showError(res?.message || "请求失败");

        if (code === 2000) {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
      }
    }

    return response;
  },
};

export const fetchClient = new FetchClient({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  middlewares: [AuthMiddleware],
});

export default FetchClient;
