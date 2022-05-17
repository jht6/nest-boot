export interface Response<T> {
  data: T;
  status_code: number;
  message: string;
}
