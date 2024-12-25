export type ApiResponse<T> = {
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: {
    page?: number;
    totalPages?: number;
    totalItems?: number;
  };
}; 