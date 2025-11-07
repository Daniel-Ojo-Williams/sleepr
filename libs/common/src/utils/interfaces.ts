export interface HttpRequestOptions {
  url: string;
  headers?: Record<string, string>;
  timeout?: number;
  query?: Record<string, unknown>;
}

export interface PostRequestOptions<T> extends HttpRequestOptions {
  payload: T;
}

export interface HttpResponse<T> {
  body: T;
  statusCode: number;
  headers?: Record<string, string | string[]>;
}
