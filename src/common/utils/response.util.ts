import {
  ApiErrorResponse,
  ApiSuccessResponse,
} from '../responses/api-response.interface';

export function buildSuccessResponse<T = unknown, M = unknown>(
  message: string,
  data: T,
  meta?: M,
): ApiSuccessResponse<T, M> {
  return {
    success: true,
    message,
    data,
    meta,
  };
}

export function buildErrorResponse<E = unknown>(
  message: string,
  error?: E,
): ApiErrorResponse<E> {
  return {
    success: false,
    message,
    error,
  };
}

