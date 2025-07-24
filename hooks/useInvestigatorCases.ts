import { useState, useEffect, useCallback } from "react";
import { incidentService } from "@/lib/api/incidents";
import { reportService } from "@/lib/api/reports";
import { evidenceService } from "@/lib/api/evidence";
import {
  processEvidence,
  batchProcessEvidence,
  getReportResults,
  analyzeReport,
  getAnalysisProgress,
} from "@/lib/api/aiProcessing";
import { IIncident } from "@/app/types/incident";
import { IReport, ReportStatus } from "@/app/types/report";
import { IEvidence } from "@/types/evidence";
import { IAiAnalysisResult, IProcessEvidenceDto } from "@/types/ai_processing";

interface ReportWithIncident {
  report: IReport;
  incident: IIncident;
  aiAnalysis: IAiAnalysisResult[];
  evidence: IEvidence[];
  progress: number;
  status: "in-progress" | "review" | "completed";
  priority: "high" | "medium" | "low";
  analysisProgress?: {
    status: "pending" | "processing" | "completed" | "failed";
    progress: number;
    processedEvidence: number;
    totalEvidence: number;
    currentEvidence?: string;
  };
}

interface InvestigatorCasesData {
  cases: ReportWithIncident[];
  isLoading: boolean;
  error: string | null;
  isProcessingAI: boolean;
  analysisProgress: Record<string, any>;
}

export const useInvestigatorCases = (userId?: string) => {
  const [data, setData] = useState<InvestigatorCasesData>({
    cases: [],
    isLoading: true,
    error: null,
    isProcessingAI: false,
    analysisProgress: {},
  });

  const fetchCasesData = useCallback(async () => {
    if (!userId) {
      console.log("🔍 useInvestigatorCases: No userId provided");
      setData((prev) => ({
        ...prev,
        isLoading: false,
        error: "User ID is required",
      }));
      return;
    }

    try {
      console.log(
        "🔍 useInvestigatorCases: Starting fetch with userId:",
        userId
      );
      setData((prev) => ({ ...prev, isLoading: true, error: null }));

      // Fetch reports assigned to the current user
      const assignedReports = await reportService.getReportsByAssignedUser(
        userId
      );
      console.log("🔍 Assigned Reports:", assignedReports);
      console.log(
        "🔍 Assigned Reports (detailed):",
        JSON.stringify(assignedReports, null, 2)
      );
      console.log("🔍 Number of assigned reports:", assignedReports.length);

      // Log each report's structure
      assignedReports.forEach((report, index) => {
        console.log(`🔍 Report ${index + 1}:`, {
          _id: report._id,
          title: report.title,
          incidentId: report.incidentId,
          incidentIdType: typeof report.incidentId,
          incidentIdKeys:
            report.incidentId && typeof report.incidentId === "object"
              ? Object.keys(report.incidentId)
              : "N/A",
          status: report.status,
          assignedTo: report.assignedTo,
        });
      });

      if (assignedReports.length === 0) {
        console.log("🔍 No assigned reports found");
        setData({
          cases: [],
          isLoading: false,
          error: null,
          isProcessingAI: false,
          analysisProgress: {},
        });
        return;
      }

      // Get unique incident IDs from assigned reports
      const incidentIds = [
        ...new Set(
          assignedReports
            .map((r) => {
              // Log the incidentId to debug
              console.log(
                "🔍 Raw incidentId:",
                r.incidentId,
                "Type:",
                typeof r.incidentId
              );

              // If incidentId is an object with _id, use that
              if (
                r.incidentId &&
                typeof r.incidentId === "object" &&
                "_id" in r.incidentId
              ) {
                const idString = r.incidentId._id?.toString();
                console.log("🔍 Extracted incidentId from object:", idString);
                return idString;
              }
              // If it's a string, use it directly
              if (typeof r.incidentId === "string") {
                console.log("🔍 Using incidentId as string:", r.incidentId);
                return r.incidentId;
              }
              console.log("🔍 No valid incidentId found");
              return null;
            })
            .filter(Boolean)
        ),
      ];
      console.log("🔍 Incident IDs needed:", incidentIds);

      // Fetch only the incidents we need
      console.log("🔍 Fetching specific incidents");
      const neededIncidents = await Promise.all(
        incidentIds.map((id) => incidentService.getIncident(id!))
      );
      console.log("🔍 Needed Incidents:", neededIncidents);

      // Get evidence for only the needed incidents
      console.log("🔍 Fetching evidence for specific incidents");
      const allEvidence = await Promise.all(
        neededIncidents.map((incident) =>
          evidenceService.getIncidentEvidence(incident._id.toString())
        )
      );
      const flattenedEvidence = allEvidence.flat();
      console.log("🔍 Evidence for needed incidents:", flattenedEvidence);

      // Create cases with their associated incidents and evidence
      console.log("🔍 Creating cases with incidents");
      const casesWithIncidents = await Promise.all(
        assignedReports.map(async (report) => {
          console.log("🔍 Processing report:", report._id);
          console.log("🔍 Report incidentId:", report.incidentId);
          console.log(
            "🔍 Available incident IDs:",
            neededIncidents.map((i) => i._id)
          );

          // Find associated incident
          const reportIncidentId =
            typeof report.incidentId === "object" && report.incidentId?._id
              ? report.incidentId._id.toString()
              : report.incidentId?.toString();

          console.log("🔍 Extracted reportIncidentId:", reportIncidentId);
          console.log(
            "🔍 Available incident IDs (strings):",
            neededIncidents.map((i) => i._id?.toString())
          );

          const incident = neededIncidents.find(
            (i) => i._id?.toString() === reportIncidentId
          );

          if (!incident) {
            console.warn(`No incident found for report ${report._id}`);
            console.warn(`Report incidentId: ${report.incidentId}`);
            console.warn(
              `Available incidents:`,
              neededIncidents.map((i) => ({
                id: i._id,
                location: i.incidentLocation,
              }))
            );
            return null;
          }

          console.log("🔍 Found incident for report:", incident._id);

          // Get evidence for this incident
          const evidence = flattenedEvidence.filter((e) =>
            incident.evidenceIds?.some(
              (evidenceId) => evidenceId.toString() === e._id?.toString()
            )
          );

          // Get AI analysis for this report
          let aiAnalysis: IAiAnalysisResult[] = [];
          try {
            aiAnalysis = await getReportResults(report._id.toString());
          } catch (error) {
            console.warn(
              `Failed to fetch AI analysis for report ${report._id}:`,
              error
            );
          }

          // Calculate progress based on report status and AI analysis
          let progress = 0;
          let status: "in-progress" | "review" | "completed" = "in-progress";

          switch (report.status) {
            case ReportStatus.DRAFT:
              progress = 25;
              status = "in-progress";
              break;
            case ReportStatus.SUBMITTED:
              progress = 75;
              status = "review";
              break;
            case ReportStatus.APPROVED:
              progress = 100;
              status = "completed";
              break;
            default:
              progress = 50;
              status = "in-progress";
          }

          // Determine priority based on incident severity
          let priority: "high" | "medium" | "low" = "medium";
          switch (incident.incidentSeverity) {
            case "critical":
            case "major":
              priority = "high";
              break;
            case "moderate":
              priority = "medium";
              break;
            case "minor":
              priority = "low";
              break;
          }

          const caseItem = {
            report,
            incident,
            evidence: evidence || [],
            aiAnalysis: aiAnalysis || [],
            progress,
            status,
            priority,
          };
          console.log("🔍 Created case item:", caseItem);
          return caseItem;
        })
      );

      // Filter out null cases (where incident wasn't found)
      const validCases = casesWithIncidents.filter(
        (caseItem): caseItem is ReportWithIncident => caseItem !== null
      );

      console.log("🔍 Final valid cases:", validCases);

      setData({
        cases: validCases,
        isLoading: false,
        error: null,
        isProcessingAI: false,
        analysisProgress: {},
      });
    } catch (error) {
      console.error("🔍 Error fetching cases data:", error);
      setData((prev) => ({
        ...prev,
        isLoading: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch cases data",
      }));
    }
  }, [userId]);

  const startAIAnalysis = useCallback(
    async (reportId: string, customPrompt?: string): Promise<void> => {
      try {
        setData((prev) => ({
          ...prev,
          isProcessingAI: true,
          analysisProgress: {
            ...prev.analysisProgress,
            [reportId]: {
              status: "pending",
              progress: 0,
              processedEvidence: 0,
              totalEvidence: 0,
            },
          },
        }));

        // Start comprehensive report analysis
        const analysisResult = await analyzeReport(reportId, customPrompt);

        // Update progress to completed
        setData((prev) => ({
          ...prev,
          isProcessingAI: false,
          analysisProgress: {
            ...prev.analysisProgress,
            [reportId]: {
              status: "completed",
              progress: 100,
              processedEvidence: analysisResult.analysisResults.length,
              totalEvidence: analysisResult.analysisResults.length,
            },
          },
        }));

        // Refresh data to get updated AI analysis results
        await fetchCasesData();
      } catch (error) {
        console.error("Error starting AI analysis:", error);
        setData((prev) => ({
          ...prev,
          isProcessingAI: false,
          analysisProgress: {
            ...prev.analysisProgress,
            [reportId]: {
              status: "failed",
              progress: 0,
              processedEvidence: 0,
              totalEvidence: 0,
            },
          },
          error:
            error instanceof Error
              ? error.message
              : "Failed to start AI analysis",
        }));
        throw error;
      }
    },
    [fetchCasesData]
  );

  const fetchAnalysisProgress = useCallback(async (reportId: string) => {
    try {
      const progressData = await getAnalysisProgress(reportId);
      setData((prev) => ({
        ...prev,
        analysisProgress: {
          ...prev.analysisProgress,
          [reportId]: progressData,
        },
      }));
      return progressData;
    } catch (error) {
      console.error("Error fetching analysis progress:", error);
      return null;
    }
  }, []);

  const refreshData = useCallback(() => {
    fetchCasesData();
  }, [fetchCasesData]);

  useEffect(() => {
    fetchCasesData();
  }, [fetchCasesData]);

  return {
    ...data,
    startAIAnalysis,
    getAnalysisProgress: fetchAnalysisProgress,
    refreshData,
  };
};
