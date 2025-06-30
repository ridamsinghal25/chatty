import { useState, useCallback } from "react";
import axios, { AxiosRequestConfig } from "axios";
import { toast } from "react-hot-toast";

export function useAxiosFetcher<T = any>(showErrorMessage: boolean = true) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const fn = useCallback(async (url: string, config?: AxiosRequestConfig) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios(url, config);
      setData(response.data.data);

      return response.data;
    } catch (err: any) {
      const message =
        err.response?.data?.message || err.message || "Something went wrong";

      setError(err);

      if (!showErrorMessage) return;
      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    data,
    loading,
    error,
    fn,
    setData,
  };
}
