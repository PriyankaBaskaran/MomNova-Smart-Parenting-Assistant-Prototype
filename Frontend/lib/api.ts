import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL } from './constants';
import { getToken, clearStorage } from './storage';
import type { ApiResponse, ApiError } from './types';
import { toast } from 'sonner';

// Create Axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    let errorMessage = 'An error occurred';
    
    if (error.response) {
      const { status, data } = error.response;

      // Handle 401 - Unauthorized
      if (status === 401) {
        clearStorage();
        toast.error('Session expired. Please login again.');
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }

      // Handle 403 - Forbidden
      if (status === 403) {
        errorMessage = 'You do not have permission to perform this action';
      }
      // Handle 404 - Not Found
      else if (status === 404) {
        errorMessage = data?.message || 'Resource not found';
      }
      // Handle 400 - Bad Request
      else if (status === 400) {
        errorMessage = data?.message || 'Invalid request';
      }
      // Handle 500 - Server Error
      else if (status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      }
      // Other errors
      else {
        errorMessage = data?.message || 'An error occurred';
      }

      // Show error toast
      toast.error(errorMessage);

      // Handle other errors
      const apiError: ApiError = {
        message: errorMessage,
        code: data?.code,
        status,
      };

      return Promise.reject(apiError);
    }

    // Network error
    errorMessage = 'Network error. Please check your connection.';
    toast.error(errorMessage);
    
    const networkError: ApiError = {
      message: errorMessage,
      code: 'NETWORK_ERROR',
    };

    return Promise.reject(networkError);
  }
);

export default api;

// Helper function for handling API responses
export const handleApiResponse = <T>(response: { data: T }): T => {
  // The API returns data directly, not wrapped in { data: { data: ... } }
  return response.data;
};

// Helper function for handling API errors
export const handleApiError = (error: unknown): string => {
  if (typeof error === 'object' && error !== null && 'message' in error) {
    return (error as ApiError).message;
  }
  return 'An unexpected error occurred';
};
