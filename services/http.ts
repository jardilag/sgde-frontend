import axios, { AxiosError } from 'axios';
import type { ApiErrorResponse } from '@/types/common';

export const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SGDE_API_URL ?? '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export class ApiError extends Error {
  status?: number;
  errors?: Record<string, string>;

  constructor(message: string, options?: { status?: number; errors?: Record<string, string> }) {
    super(message);
    this.name = 'ApiError';
    this.status = options?.status;
    this.errors = options?.errors;
  }
}

function extractMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    return axiosError.response?.data?.message ?? axiosError.message ?? 'Ocurrió un error inesperado.';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Ocurrió un error inesperado.';
}

http.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      throw new ApiError(extractMessage(error), {
        status: axiosError.response?.status,
        errors: axiosError.response?.data?.errors,
      });
    }

    throw new ApiError(extractMessage(error));
  },
);

http.interceptors.request.use((config) => {
  if (typeof FormData !== 'undefined' && config.data instanceof FormData && config.headers) {
    delete (config.headers as Record<string, string | undefined>)['Content-Type'];
    delete (config.headers as Record<string, string | undefined>)['content-type'];
  }

  return config;
});