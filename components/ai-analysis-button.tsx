import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Brain, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface AIAnalysisButtonProps {
  reportId: string;
  onAnalysisStart: (reportId: string, customPrompt?: string) => Promise<void>;
  onAnalysisComplete?: (result: any) => void;
  disabled?: boolean;
  size?: "sm" | "default";
  variant?: "outline" | "default" | "secondary";
  showProgress?: boolean;
  currentProgress?: {
    status: "pending" | "processing" | "completed" | "failed";
    progress: number;
    processedEvidence: number;
    totalEvidence: number;
    currentEvidence?: string;
  } | null;
}

export const AIAnalysisButton: React.FC<AIAnalysisButtonProps> = ({
  reportId,
  onAnalysisStart,
  onAnalysisComplete,
  disabled = false,
  size = "sm",
  variant = "outline",
  showProgress = false,
  currentProgress = null,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleStartAnalysis = async () => {
    if (!reportId) {
      console.warn("AIAnalysisButton: reportId is empty!");
      toast({
        title: "Invalid Report",
        description: "Cannot start AI analysis: reportId is missing.",
        variant: "destructive",
      });
      return;
    }
    try {
      console.log(
        "AIAnalysisButton: Starting analysis for reportId:",
        reportId
      );
      setIsProcessing(true);
      await onAnalysisStart(reportId);
      toast({
        title: "AI Analysis Started",
        description:
          "Analyzing all evidence for this report. This may take a few minutes.",
      });
    } catch (error) {
      console.error("Failed to start AI analysis:", error);
      toast({
        title: "Analysis Failed",
        description:
          error instanceof Error
            ? error.message
            : "Failed to start AI analysis",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  const getStatusIcon = () => {
    if (currentProgress?.status === "completed") {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    if (currentProgress?.status === "failed") {
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
    if (isProcessing || currentProgress?.status === "processing") {
      return <Loader2 className="h-4 w-4 animate-spin" />;
    }
    return <Brain className="h-4 w-4" />;
  };

  const getStatusText = () => {
    if (currentProgress?.status === "completed") {
      return "Analysis Complete";
    }
    if (currentProgress?.status === "failed") {
      return "Analysis Failed";
    }
    if (isProcessing || currentProgress?.status === "processing") {
      return "Analyzing...";
    }
    return "Start AI Analysis";
  };

  const getStatusColor = () => {
    if (currentProgress?.status === "completed") {
      return "bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20";
    }
    if (currentProgress?.status === "failed") {
      return "bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20";
    }
    return "";
  };

  const isDisabled =
    disabled ||
    isProcessing ||
    currentProgress?.status === "processing" ||
    !reportId;

  return (
    <div className="flex flex-col space-y-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size={size}
              variant={variant}
              onClick={handleStartAnalysis}
              disabled={isDisabled}
              className={`transition-all duration-200 hover:scale-105 ${getStatusColor()}`}
            >
              {getStatusIcon()}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{getStatusText()}</p>
            {currentProgress && (
              <p className="text-xs mt-1">
                {currentProgress.processedEvidence}/
                {currentProgress.totalEvidence} evidence processed
              </p>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {showProgress && currentProgress && (
        <div className="space-y-2 min-w-[200px]">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              {currentProgress.status === "processing"
                ? "Processing..."
                : currentProgress.status === "completed"
                ? "Complete"
                : currentProgress.status === "failed"
                ? "Failed"
                : "Pending"}
            </span>
            <span className="text-muted-foreground">
              {currentProgress.processedEvidence}/
              {currentProgress.totalEvidence}
            </span>
          </div>

          <Progress value={currentProgress.progress} className="h-2" />

          {currentProgress.currentEvidence &&
            currentProgress.status === "processing" && (
              <p className="text-xs text-muted-foreground truncate">
                Processing: {currentProgress.currentEvidence}
              </p>
            )}

          {currentProgress.status === "completed" && (
            <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20 text-xs">
              Analysis Complete
            </Badge>
          )}

          {currentProgress.status === "failed" && (
            <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20 text-xs">
              Analysis Failed
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};
