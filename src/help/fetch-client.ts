export type Middleware = {
  request?: (config: RequestInit) => RequestInit;
  response?: (response: Response) => Promise<Response>;
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
  async request(url: string, options: RequestInit, timeout: number) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const config = this.applyRequestMiddlewares({
      ...options,
      signal: controller.signal,
    });

    try {
      const response = await fetch(this.baseUrl + url, config);
      clearTimeout(timeoutId);
      // 处理中间件
      const processedResponse = await this.applyResponseMiddlewares(response);
      return processedResponse;
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error("Request timed out");
      }
      throw error;
    }
  }

  // get 请求
  get(
    url: string,
    params: Record<string, any> = {},
    options: RequestInit = {}
  ) {
    // 处理参数
    url = this.formatParams(url, params);
    return this.request(
      url,
      { ...options, method: "GET" },
      this.defaultTimeout
    );
  }

  // post 请求
  post(url: string, data: Record<string, any>, options: RequestInit = {}) {
    return this.request(
      url,
      { ...options, method: "POST", body: JSON.stringify(data) },
      this.defaultTimeout
    );
  }

  // put 请求
  put(url: string, data: Record<string, any>, options: RequestInit = {}) {
    return this.request(
      url,
      { ...options, method: "PUT", body: JSON.stringify(data) },
      this.defaultTimeout
    );
  }

  // delete 请求
  delete(url: string, options: RequestInit = {}) {
    return this.request(
      url,
      { ...options, method: "DELETE" },
      this.defaultTimeout
    );
  }

  // 处理文件上传
  upload(url: string, file: File, options: RequestInit = {}) {
    const formData = new FormData();
    formData.append("file", file);
    return this.request(
      url,
      { ...options, method: "POST", body: formData },
      this.defaultTimeout
    );
  }

  // 处理文件下载
  async download(url: string, options: RequestInit = {}) {
    const response = await this.request(
      url,
      { ...options, method: "GET" },
      this.defaultTimeout
    );
    return await response.blob();
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
  private async applyResponseMiddlewares(
    response: Response
  ): Promise<Response> {
    let result = response;

    for (const middleware of this.middlewares) {
      if (middleware.response) {
        result = await middleware.response(result);
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
  response: async (response) => {
    if (response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return response;
  },
};

export const fetchClient = new FetchClient({
  baseUrl: process.env.VITE_API_BASE_URL,
  middlewares: [AuthMiddleware],
});

export default FetchClient;
