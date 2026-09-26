const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: Record<string, any>;
}

export class ApiError extends Error {
  code: string;
  details?: any;

  constructor(message: string, code = 'API_ERROR', details?: any) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.details = details;
  }
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(options.headers || {}),
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok || data.success === false) {
      throw new ApiError(
        data?.error?.message || `Request failed with status ${response.status}`,
        data?.error?.code || 'HTTP_ERROR',
        data?.error?.details
      );
    }

    return data;
  } catch (error: any) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error.message || 'Network request failed or backend server unreachable.',
      'NETWORK_ERROR'
    );
  }
}
