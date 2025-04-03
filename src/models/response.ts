export type TResponse<T> = {
  status: number;
  error?: string;
  data?: T;
};
