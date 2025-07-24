import { useState, useEffect } from "react";
import { getReportAIAnalysis } from "@/lib/api/aiProcessing";
import { reportService } from "@/lib/api/reports";
import { IAiAnalysisResult } from "@/types/ai_processing";
import { IReport } from "@/app/types/report";

interface InvestigatorAIReport {
  reportId: string;
  report: IReport;
  aiResults: IAiAnalysisResult[];
  confidence: number;
  analysisType: string;
  createdAt: string;
  updatedAt: string;
}

export const useInvestigatorAIReports = (investigatorId: string) => {
  const [aiReports, setAiReports] = useState<InvestigatorAIReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvestigatorAIReports = async () => {
      if (!investigatorId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        console.log(
          "🔍 [Investigator AI Reports] Fetching reports for investigator:",
          investigatorId
        );

        // First, get all reports assigned to this investigator
        const assignedReports = await reportService.getReportsByAssignedUser(
          investigatorId
        );

        console.log(
          "🔍 [Investigator AI Reports] Found assigned reports:",
          assignedReports.length
        );

        // For each assigned report, fetch AI analysis results
        const aiReportsData: InvestigatorAIReport[] = [];

        for (const report of assignedReports) {
          try {
            const aiResults = await getReportAIAnalysis(report._id.toString());

            if (aiResults && aiResults.length > 0) {
              const latestResult = aiResults[0];
              aiReportsData.push({
                reportId: report._id.toString(),
                report: report,
                aiResults: aiResults,
                confidence: latestResult.confidenceScore || 0,
                analysisType: latestResult.analysisType || "unknown",
                createdAt: latestResult.createdAt
                  ? typeof latestResult.createdAt === "string"
                    ? latestResult.createdAt
                    : latestResult.createdAt.toISOString()
                  : new Date().toISOString(),
                updatedAt: latestResult.updatedAt
                  ? typeof latestResult.updatedAt === "string"
                    ? latestResult.updatedAt
                    : latestResult.updatedAt.toISOString()
                  : new Date().toISOString(),
              });
            }
          } catch (error) {
            console.warn(
              `Failed to fetch AI results for report ${report._id}:`,
              error
            );
            // Continue with other reports even if one fails
          }
        }

        // Sort by updatedAt (latest first)
        aiReportsData.sort((a, b) => {
          const dateA = new Date(a.updatedAt).getTime();
          const dateB = new Date(b.updatedAt).getTime();
          return dateB - dateA;
        });

        console.log(
          "🔍 [Investigator AI Reports] Final AI reports data:",
          aiReportsData
        );
        setAiReports(aiReportsData);
      } catch (err: any) {
        console.error(
          "❌ [Investigator AI Reports] Error fetching AI reports:",
          err
        );
        setError(err.message || "Failed to fetch AI analysis reports");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvestigatorAIReports();
  }, [investigatorId]);

  const refreshData = () => {
    setError(null);
    setIsLoading(true);
    // This will trigger the useEffect to run again
  };

  return {
    aiReports,
    isLoading,
    error,
    refreshData,
  };
};
