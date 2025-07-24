import { useState, useEffect, useCallback } from "react";
import { reportService } from "@/lib/api/reports";
import { evidenceService } from "@/lib/api/evidence";
import { getReportResults } from "@/lib/api/aiProcessing";
import { userService } from "@/lib/api/users";
import { getIncident } from "@/lib/api/incident";
import { IReport } from "@/app/types/report";
import { IEvidence } from "@/types/evidence";
import { IAiAnalysisResult } from "@/types/ai_processing";

interface ChiefReportDetailData {
  report: IReport | null;
  evidence: IEvidence[];
  aiResults: IAiAnalysisResult[];
  investigator: any | null;
  incident: any | null;
  aiConfidence: number | null;
  isLoading: boolean;
  error: string | null;
}

export const useChiefReportDetail = (reportId: string) => {
  const [data, setData] = useState<ChiefReportDetailData>({
    report: null,
    evidence: [],
    aiResults: [],
    investigator: null,
    incident: null,
    aiConfidence: null,
    isLoading: true,
    error: null,
  });

  const fetchReportData = useCallback(async () => {
    try {
      setData((prev) => ({ ...prev, isLoading: true, error: null }));

      // Fetch report details
      const report = await reportService.getReport(reportId);
      console.log("✅ Report fetched:", report);

      // Fetch evidence for this report
      let evidence: IEvidence[] = [];
      try {
        // Try to fetch evidence by report ID first
        evidence = await evidenceService.getReportEvidence(reportId);
        console.log("✅ Evidence fetched by report ID:", evidence);
      } catch (reportEvidenceError) {
        console.warn(
          "⚠️ Failed to fetch evidence by report ID, trying incident ID:",
          reportEvidenceError
        );

        // Fallback to incident ID if report evidence fails
        if (report.incidentId) {
          try {
            evidence = await evidenceService.getIncidentEvidence(
              report.incidentId.toString()
            );
            console.log("✅ Evidence fetched by incident ID:", evidence);
          } catch (incidentEvidenceError) {
            console.warn(
              "⚠️ Failed to fetch evidence by incident ID:",
              incidentEvidenceError
            );
          }
        }
      }

      // Fetch AI analysis results
      let aiResults: IAiAnalysisResult[] = [];
      try {
        aiResults = await getReportResults(reportId);
        console.log("✅ AI results fetched:", aiResults);
      } catch (aiError) {
        console.warn("⚠️ Failed to fetch AI results:", aiError);
      }

      // Fetch investigator details if assignedTo exists
      let investigator = null;
      if (report.assignedTo) {
        try {
          // Handle Mongoose ObjectId properly
          let userId: string;

          if (!report.assignedTo) {
            throw new Error("No assignedTo field found");
          }

          console.log("🔍 Original assignedTo:", report.assignedTo);
          console.log("🔍 AssignedTo type:", typeof report.assignedTo);
          console.log(
            "🔍 AssignedTo constructor:",
            report.assignedTo?.constructor?.name
          );

          // Handle different ObjectId formats
          if (typeof report.assignedTo === "string") {
            userId = report.assignedTo;
          } else if (
            report.assignedTo &&
            typeof report.assignedTo === "object"
          ) {
            // For Mongoose ObjectId objects, we need to access the hex string properly
            const assignedToObj = report.assignedTo as any;

            // Try different ways to get the hex string
            if (
              assignedToObj.toString &&
              assignedToObj.toString() !== "[object Object]"
            ) {
              userId = assignedToObj.toString();
            } else if (assignedToObj._bsontype === "ObjectID") {
              // MongoDB ObjectId
              userId = assignedToObj.toString();
            } else if (assignedToObj.$oid) {
              // Extended JSON format
              userId = assignedToObj.$oid;
            } else if (assignedToObj.id) {
              // Some ObjectId implementations use .id
              userId = assignedToObj.id;
            } else {
              // Last resort - try to get the hex string from the object
              console.warn(
                "⚠️ Could not extract ObjectId string, trying JSON.stringify:",
                assignedToObj
              );
              const jsonStr = JSON.stringify(assignedToObj);
              console.log("🔍 JSON string:", jsonStr);

              // Try to extract hex string from JSON
              const hexMatch = jsonStr.match(/"([0-9a-fA-F]{24})"/);
              if (hexMatch) {
                userId = hexMatch[1];
              } else {
                throw new Error(`Could not extract ObjectId from: ${jsonStr}`);
              }
            }
          } else {
            userId = String(report.assignedTo);
          }

          console.log("🔍 Extracted userId:", userId);

          // Validate that we have a proper ObjectId hex string (24 characters)
          if (
            !userId ||
            userId.length !== 24 ||
            !/^[0-9a-fA-F]{24}$/.test(userId)
          ) {
            console.error("❌ Invalid ObjectId format:", userId);
            console.error("❌ Original assignedTo:", report.assignedTo);
            throw new Error(`Invalid ObjectId format: ${userId}`);
          }

          console.log("🔍 Fetching investigator with ID:", userId);
          console.log(
            "🔍 Original assignedTo object:",
            JSON.stringify(report.assignedTo, null, 2)
          );
          console.log("🔍 AssignedTo type:", typeof report.assignedTo);
          console.log(
            "🔍 AssignedTo constructor:",
            report.assignedTo?.constructor?.name
          );

          investigator = await userService.getUserById(userId);
          console.log("✅ Investigator fetched:", investigator);
        } catch (investigatorError) {
          console.error("❌ Failed to fetch investigator:", investigatorError);
          console.log("🔍 Report assignedTo value:", report.assignedTo);
          console.log("🔍 Report assignedTo type:", typeof report.assignedTo);
          console.log(
            "🔍 Report assignedTo structure:",
            JSON.stringify(report.assignedTo, null, 2)
          );
        }
      } else {
        console.log("ℹ️ No assignedTo field found in report");
      }

      // Fetch incident details if incidentId exists
      let incident = null;
      if (report.incidentId) {
        try {
          incident = await getIncident(report.incidentId.toString());
          console.log("✅ Incident fetched:", incident);
        } catch (incidentError) {
          console.warn("⚠️ Failed to fetch incident:", incidentError);
        }
      }

      // Calculate AI confidence from analysis results
      let aiConfidence = null;
      if (aiResults && aiResults.length > 0) {
        const totalConfidence = aiResults.reduce(
          (sum, result) => sum + (result.confidenceScore || 0),
          0
        );
        aiConfidence = totalConfidence / aiResults.length;
        console.log("✅ AI confidence calculated:", aiConfidence);
      }

      setData({
        report,
        evidence,
        aiResults,
        investigator,
        incident,
        aiConfidence,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      console.error("❌ Failed to fetch report data:", error);
      setData((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message || "Failed to load report data",
      }));
    }
  }, [reportId]);

  const updateReportStatus = useCallback(
    async (status: string) => {
      if (!data.report) return;

      try {
        const updatedReport = await reportService.updateReport(reportId, {
          status: status as any,
        });

        setData((prev) => ({
          ...prev,
          report: updatedReport,
        }));

        return updatedReport;
      } catch (error: any) {
        console.error("❌ Failed to update report status:", error);
        throw error;
      }
    },
    [reportId, data.report]
  );

  useEffect(() => {
    if (reportId) {
      fetchReportData();
    }
  }, [fetchReportData]);

  return {
    ...data,
    refreshData: fetchReportData,
    updateReportStatus,
  };
};
