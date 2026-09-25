import { activityApi } from "@/services/activityApi";
import { Activity, ActivityFilterParams, PaginationMeta } from "@/types/activity";
import { useCallback, useEffect, useState } from "react";

export const useActivities = (initialParams: ActivityFilterParams = {}) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [params, setParams] = useState<ActivityFilterParams>({
    page: 1,
    limit: 10,
    sort_by: "created_at",
    sort_order: "desc",
    ...initialParams,
  });

  const [pagination, setPagination] = useState<PaginationMeta>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });

 const fetchActivities = useCallback(async () => {
  setLoading(true);
  setError(null);

  try {
    const response = await activityApi.getAll(params);

    if (response && response.data) {
      const { items, page, limit, total_items, total_page } = response.data;

      setActivities(items ?? []);

      setPagination({
        currentPage: page,
        totalPages: total_page,
        totalItems: total_items,
        itemsPerPage: limit,
      });
    }
  } catch (err: any) {
    const message =
      err.response?.data?.message || err.message || "Gagal memuat data aktivitas";
    setError(message);
  } finally {
    setLoading(false);
  }
}, [params]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const updateFilters = (newParams: Partial<ActivityFilterParams>) => {
    setParams((prev) => ({
      ...prev,
      ...newParams,
      page: newParams.page !== undefined ? newParams.page : 1,
    }));
  };

  const changePage = (page: number) => {
    setParams((prev) => ({ ...prev, page }));
  };

  return {
    activities,
    loading,
    error,
    params,
    pagination,
    updateFilters,
    changePage,
    refetch: fetchActivities,
  };
};