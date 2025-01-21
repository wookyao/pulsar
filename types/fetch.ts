export type FetchResponse<T> = {
  data: T;
  code: number;
  message: string;
};
