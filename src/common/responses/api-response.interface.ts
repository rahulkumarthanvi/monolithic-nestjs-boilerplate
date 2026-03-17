export interface ApiSuccessResponse<T = unknown, M = unknown> {
  success: true;
  message: string;
  data: T;
  meta?: M;
}

export interface ApiErrorResponse<E = unknown> {
  success: false;
  message: string;
  error?: E;
}

