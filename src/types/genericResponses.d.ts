export interface genericResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}
