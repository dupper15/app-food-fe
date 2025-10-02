import { useState, useCallback } from "react";

interface UseLoadingOptions {
  initialLoading?: boolean;
}

export const useLoading = (options: UseLoadingOptions = {}) => {
  const { initialLoading = false } = options;
  const [loading, setLoading] = useState(initialLoading);

  const startLoading = useCallback(() => {
    setLoading(true);
  }, []);

  const stopLoading = useCallback(() => {
    setLoading(false);
  }, []);

  const withLoading = useCallback(
    async (asyncFunction: () => Promise<any>) => {
      startLoading();
      try {
        const result = await asyncFunction();
        return result;
      } finally {
        stopLoading();
      }
    },
    [startLoading, stopLoading]
  );

  return {
    loading,
    startLoading,
    stopLoading,
    withLoading,
    setLoading,
  };
};
