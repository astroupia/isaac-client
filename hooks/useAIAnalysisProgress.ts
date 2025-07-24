import { useState, useEffect, useCallback, useRef } from "react";
import {
  analyzeReportEvidence,
  getAnalysisProgress,
} from "@/lib/api/aiProcessing";

interface AnalysisProgress {
  reportId: string;
  status: "pending" | "processing" | "completed" | "failed";
  progress: number;
  processedEvidence: number;
  totalEvidence: number;
  currentEvidence?: string;
  estimatedTimeRemaining?: number;
}

interface AnalysisResult {
  reportId: string;
  totalEvidence: number;
  processedEvidence: number;
  analysisResults: any[];
  overallConfidence: number;
  summary: {
    keyFindings: string[];
    recommendations: string[];
    priority: string;
  };
}

interface UseAIAnalysisProgressReturn {
  startAnalysis: (reportId: string, customPrompt?: string) => Promise<void>;
  progress: AnalysisProgress | null;
  result: AnalysisResult | null;
  isAnalyzing: boolean;
  error: string | null;
  stopPolling: () => void;
}

export const useAIAnalysisProgress = (): UseAIAnalysisProgressReturn => {
  const [progress, setProgress] = useState<AnalysisProgress | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentReportIdRef = useRef<string | null>(null);

  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    currentReportIdRef.current = null;
  }, []);

  const pollProgress = useCallback(
    async (reportId: string) => {
      try {
        const progressData = await getAnalysisProgress(reportId);
        setProgress(progressData);

        if (progressData.status === "completed") {
          stopPolling();
          setIsAnalyzing(false);
          // Fetch final results
          const finalResult = await analyzeReportEvidence(reportId);
          setResult(finalResult);
        } else if (progressData.status === "failed") {
          stopPolling();
          setIsAnalyzing(false);
          setError("AI analysis failed. Please try again.");
        }
      } catch (err) {
        console.error("Error polling analysis progress:", err);
        // Don't stop polling on network errors, just log them
      }
    },
    [stopPolling]
  );

  const startAnalysis = useCallback(
    async (reportId: string, customPrompt?: string) => {
      try {
        setIsAnalyzing(true);
        setError(null);
        setProgress(null);
        setResult(null);
        currentReportIdRef.current = reportId;

        // Start the analysis
        await analyzeReportEvidence(reportId, customPrompt);

        // Start polling for progress
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
        }

        // Poll every 2 seconds
        pollingIntervalRef.current = setInterval(() => {
          if (currentReportIdRef.current === reportId) {
            pollProgress(reportId);
          }
        }, 2000);

        // Initial progress check
        await pollProgress(reportId);
      } catch (err) {
        console.error("Error starting AI analysis:", err);
        setIsAnalyzing(false);
        setError(
          err instanceof Error ? err.message : "Failed to start AI analysis"
        );
        stopPolling();
      }
    },
    [pollProgress, stopPolling]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, [stopPolling]);

  return {
    startAnalysis,
    progress,
    result,
    isAnalyzing,
    error,
    stopPolling,
  };
};
