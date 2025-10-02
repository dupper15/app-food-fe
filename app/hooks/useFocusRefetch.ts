import { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";

interface UseFocusRefetchOptions<T> {
  queryFn: () => Promise<T>;
  enabled?: boolean;
}

export const useFocusRefetch = <T>({
  queryFn,
  enabled = true,
}: UseFocusRefetchOptions<T>) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    setLoading(true);
    setError(null);
    try {
      const result = await queryFn();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [queryFn, enabled]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  const refetch = useCallback(() => {
    return fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch,
  };
};
