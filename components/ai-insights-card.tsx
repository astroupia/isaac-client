import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { IAiAnalysisResult } from "@/types/ai_processing";
import Link from "next/link";

interface AIInsightsCardProps {
  analysis: IAiAnalysisResult;
  incidentId?: string;
}

const getConfidenceColor = (confidence: number) => {
  if (confidence >= 0.8)
    return "bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20";
  if (confidence >= 0.6)
    return "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 border-orange-500/20";
  return "bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20";
};

const getConfidenceLabel = (confidence: number) => {
  if (confidence >= 0.8) return "High Confidence";
  if (confidence >= 0.6) return "Medium Confidence";
  return "Low Confidence";
};

const getAnalysisSummary = (analysis: IAiAnalysisResult): string => {
  const { detectedObjects, sceneAnalysis, analysisType } = analysis;

  if (detectedObjects?.vehicles?.length) {
    return `AI detected ${detectedObjects.vehicles.length} vehicle(s) in the scene`;
  }

  if (detectedObjects?.persons?.length) {
    return `AI detected ${detectedObjects.persons.length} person(s) in the scene`;
  }

  if (sceneAnalysis?.weatherConditions?.length) {
    return `AI analyzed weather conditions: ${sceneAnalysis.weatherConditions.join(
      ", "
    )}`;
  }

  switch (analysisType) {
    case "image_analysis":
      return "AI performed image analysis";
    case "video_analysis":
      return "AI performed video analysis";
    case "audio_analysis":
      return "AI performed audio analysis";
    case "document_analysis":
      return "AI performed document analysis";
    default:
      return "AI analysis completed";
  }
};

export const AIInsightsCard: React.FC<AIInsightsCardProps> = ({
  analysis,
  incidentId,
}) => {
  const confidenceScore = analysis.confidenceScore || 0;
  const confidencePercentage = Math.round(confidenceScore * 100);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">
          {incidentId
            ? `Incident #${incidentId}`
            : `Analysis #${analysis.evidenceId}`}
        </h4>
        <Badge className={getConfidenceColor(confidenceScore)}>
          {getConfidenceLabel(confidenceScore)}
        </Badge>
      </div>

      <Progress value={confidencePercentage} className="h-2" />

      <p className="text-xs text-muted-foreground">
        {getAnalysisSummary(analysis)}
      </p>

      {analysis.recommendations?.investigationPriority && (
        <p className="text-xs text-muted-foreground">
          Priority: {analysis.recommendations.investigationPriority}
        </p>
      )}

      <Button variant="outline" size="sm" className="w-full mt-2" asChild>
        <Link
          href={`/dashboard/investigator/ai-reports/${analysis.evidenceId}`}
        >
          View Analysis
        </Link>
      </Button>
    </div>
  );
};

interface AIInsightsSectionProps {
  aiReports: IAiAnalysisResult[];
  isLoading?: boolean;
}

export const AIInsightsSection: React.FC<AIInsightsSectionProps> = ({
  aiReports,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <Card className="md:col-span-3">
        <CardHeader>
          <CardTitle>AI Insights</CardTitle>
          <CardDescription>Recent AI-generated analysis</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="h-4 bg-muted animate-pulse rounded" />
            <div className="h-2 bg-muted animate-pulse rounded" />
            <div className="h-3 bg-muted animate-pulse rounded w-3/4" />
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-muted animate-pulse rounded" />
            <div className="h-2 bg-muted animate-pulse rounded" />
            <div className="h-3 bg-muted animate-pulse rounded w-2/3" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (aiReports.length === 0) {
    return (
      <Card className="md:col-span-3">
        <CardHeader>
          <CardTitle>AI Insights</CardTitle>
          <CardDescription>Recent AI-generated analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            No AI analysis results available yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="md:col-span-3">
      <CardHeader>
        <CardTitle>AI Insights</CardTitle>
        <CardDescription>Recent AI-generated analysis</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {aiReports.slice(0, 3).map((analysis, index) => (
          <AIInsightsCard
            key={`${analysis.evidenceId}-${index}`}
            analysis={analysis}
            incidentId={analysis.incidentId?.toString()}
          />
        ))}
      </CardContent>
    </Card>
  );
};
