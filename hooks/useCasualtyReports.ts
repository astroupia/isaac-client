import { useState, useEffect, useCallback } from "react";
import { getCasualtyReports } from "@/lib/api/aiProcessing";
import { IGeneratedCasualtyReport } from "@/types/ai_processing";

interface UseCasualtyReportsParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  incidentId?: string;
  dateFrom?: string;
  dateTo?: string;
}

interface UseCasualtyReportsReturn {
  reports: IGeneratedCasualtyReport[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  setFilters: (filters: Partial<UseCasualtyReportsParams>) => void;
}

export const useCasualtyReports = (
  initialParams: UseCasualtyReportsParams = {}
): UseCasualtyReportsReturn => {
  const [reports, setReports] = useState<IGeneratedCasualtyReport[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(initialParams.page || 1);
  const [limit, setLimit] = useState(initialParams.limit || 10);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] =
    useState<UseCasualtyReportsParams>(initialParams);

  const fetchReports = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log("🔍 Fetching casualty reports with params:", {
        page,
        limit,
        ...filters,
      });

      const response = await getCasualtyReports({
        page,
        limit,
        ...filters,
      });

      console.log("✅ Casualty reports fetched:", response);

      setReports(response.reports);
      setTotal(response.pagination.totalCount);
      setPage(response.pagination.currentPage);
      setLimit(response.pagination.limit);
      setTotalPages(response.pagination.totalPages);
    } catch (err: any) {
      console.error("❌ Failed to fetch casualty reports:", err);
      setError(err.message || "Failed to fetch casualty reports");
      setReports([]);
      setTotal(0);
      setTotalPages(0);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, filters]);

  const refetch = useCallback(async () => {
    await fetchReports();
  }, [fetchReports]);

  const updateFilters = useCallback(
    (newFilters: Partial<UseCasualtyReportsParams>) => {
      setFilters((prev) => ({ ...prev, ...newFilters }));
      setPage(1); // Reset to first page when filters change
    },
    []
  );

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return {
    reports,
    total,
    page,
    limit,
    totalPages,
    isLoading,
    error,
    refetch,
    setFilters: updateFilters,
  };
};
