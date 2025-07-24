import { useState, useEffect, useCallback } from "react";
import { incidentService } from "@/lib/api/incidents";
import { reportService } from "@/lib/api/reports";
import {
  getReportResults,
  getStats,
  getUserConversations,
} from "@/lib/api/aiProcessing";
import { IIncident } from "@/app/types/incident";
import { IReport, ReportStatus } from "@/app/types/report";
import { IAiAnalysisResult, IAiProcessingStats } from "@/types/ai_processing";

interface InvestigatorDashboardData {
  assignedReports: IReport[];
  pendingReviews: IReport[];
  aiReports: IAiAnalysisResult[];
  completedThisMonth: number;
  aiStats: IAiProcessingStats | null;
  isLoading: boolean;
  error: string | null;
}

interface DashboardStats {
  assignedCasesCount: number;
  pendingReviewsCount: number;
  aiReportsCount: number;
  completedThisMonth: number;
}

export const useInvestigatorDashboard = (userId?: string) => {
  const [data, setData] = useState<InvestigatorDashboardData>({
    assignedReports: [],
    pendingReviews: [],
    aiReports: [],
    completedThisMonth: 0,
    aiStats: null,
    isLoading: true,
    error: null,
  });

  const [stats, setStats] = useState<DashboardStats>({
    assignedCasesCount: 0,
    pendingReviewsCount: 0,
    aiReportsCount: 0,
    completedThisMonth: 0,
  });

  const fetchDashboardData = useCallback(async () => {
    try {
      setData((prev) => ({ ...prev, isLoading: true, error: null }));

      if (!userId) {
        console.log("⚠️ [Investigator Dashboard] No userId provided");
        setData({
          assignedReports: [],
          pendingReviews: [],
          aiReports: [],
          completedThisMonth: 0,
          aiStats: null,
          isLoading: false,
          error: null,
        });
        setStats({
          assignedCasesCount: 0,
          pendingReviewsCount: 0,
          aiReportsCount: 0,
          completedThisMonth: 0,
        });
        return;
      }

      console.log(
        "🔍 [Investigator Dashboard] Fetching data for userId:",
        userId
      );

      // Fetch only reports assigned to this specific investigator
      const assignedReports = await reportService.getReportsByAssignedUser(
        userId
      );
      console.log(
        "✅ [Investigator Dashboard] Assigned reports:",
        assignedReports.length
      );

      // Filter reports by status and assignment
      const pendingReviews = assignedReports.filter(
        (report) => report.status === ReportStatus.SUBMITTED
      );

      // Get AI analysis results for assigned reports only
      const aiReportsPromises = assignedReports
        .filter((report) => report.aiContribution && report.aiContribution > 0)
        .map(async (report) => {
          try {
            const results = await getReportResults(report._id.toString());
            console.log(
              `✅ [Investigator Dashboard] AI results for report ${report._id}:`,
              results.length
            );
            return results;
          } catch (error) {
            console.warn(
              `⚠️ [Investigator Dashboard] Failed to get AI results for report ${report._id}:`,
              error
            );
            return [];
          }
        });

      const aiReportsResults = await Promise.all(aiReportsPromises);
      const aiReports = aiReportsResults.flat();
      console.log(
        "✅ [Investigator Dashboard] Total AI reports:",
        aiReports.length
      );

      // Calculate completed reports this month
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const completedThisMonth = assignedReports.filter((report) => {
        const reportDate = new Date(report.updatedAt);
        return (
          report.status === ReportStatus.APPROVED &&
          reportDate.getMonth() === currentMonth &&
          reportDate.getFullYear() === currentYear
        );
      }).length;

      // Fetch AI processing stats
      const aiStats = await getStats().catch(() => null);

      setData({
        assignedReports,
        pendingReviews,
        aiReports,
        completedThisMonth,
        aiStats,
        isLoading: false,
        error: null,
      });

      // Update stats
      setStats({
        assignedCasesCount: assignedReports.length,
        pendingReviewsCount: pendingReviews.length,
        aiReportsCount: aiReports.length,
        completedThisMonth,
      });

      console.log(
        "✅ [Investigator Dashboard] Dashboard data updated successfully"
      );
    } catch (error) {
      console.error(
        "❌ [Investigator Dashboard] Error fetching dashboard data:",
        error
      );
      setData((prev) => ({
        ...prev,
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch dashboard data",
      }));
    }
  }, [userId]);

  const refreshData = useCallback(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    ...data,
    stats,
    refreshData,
  };
};
