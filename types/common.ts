export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string>;
}

export interface ApiListResponse<T> {
  items: T[];
  meta: PaginationMeta;
}

export interface SelectOption {
  label: string;
  value: string;
}