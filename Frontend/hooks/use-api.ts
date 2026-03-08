import { useState, useCallback } from 'react';
import { handleApiError } from '@/lib/api';
import { toast } from 'sonner';

interface UseApiOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
  successMessage?: string;
}

export function useApi<T = any>(
  apiFunction: (...args: any[]) => Promise<T>,
  options: UseApiOptions = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    onSuccess,
    onError,
    showSuccessToast = false,
    showErrorToast = true,
    successMessage,
  } = options;

  const execute = useCallback(
    async (...args: any[]) => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await apiFunction(...args);
        setData(result);

        if (showSuccessToast && successMessage) {
          toast.success(successMessage);
        }

        if (onSuccess) {
          onSuccess(result);
        }

        return result;
      } catch (err) {
        const errorMessage = handleApiError(err);
        setError(errorMessage);

        if (showErrorToast) {
          toast.error(errorMessage);
        }

        if (onError) {
          onError(errorMessage);
        }

        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [apiFunction, onSuccess, onError, showSuccessToast, showErrorToast, successMessage]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    data,
    error,
    isLoading,
    execute,
    reset,
  };
}
