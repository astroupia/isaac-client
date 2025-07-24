"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  MessageSquare,
  PrinterIcon as Print,
  Share2,
  Clock,
  User,
  Brain,
  FileText,
  AlertTriangle,
  Eye,
  Calendar,
  ExternalLink,
  Image,
  Video,
  File,
  Mic,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useChiefReportDetail } from "@/hooks/useChiefReportDetail";
import { useToast } from "@/hooks/use-toast";
import { AiAnalysisDisplay } from "./ai-analysis-display";
import { ReportStatus } from "@/app/types/report";

interface ChiefReportDetailProps {
  reportId: string;
}

export function ChiefReportDetail({ reportId }: ChiefReportDetailProps) {
  const { toast } = useToast();
  const [reviewNotes, setReviewNotes] = useState("");
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  const {
    report,
    evidence,
    aiResults,
    investigator,
    incident,
    aiConfidence,
    isLoading,
    error,
    updateReportStatus,
    refreshData,
  } = useChiefReportDetail(reportId);

  const handleApprove = async () => {
    if (!report) return;

    if (report.status === ReportStatus.APPROVED) {
      toast({
        title: "Already Approved",
        description: "This report has already been approved.",
        variant: "default",
      });
      return;
    }

    setIsApproving(true);
    try {
      await updateReportStatus(ReportStatus.APPROVED);
      toast({
        title: "Report Approved",
        description: "The report has been successfully approved.",
        variant: "default",
      });
    } catch (error: any) {
      toast({
        title: "Approval Failed",
        description: error.message || "Failed to approve the report.",
        variant: "destructive",
      });
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    if (!report) return;

    setIsRejecting(true);
    try {
      await updateReportStatus(ReportStatus.REJECTED);
      toast({
        title: "Report Returned for Revision",
        description: "The report has been returned for revision.",
        variant: "default",
      });
    } catch (error: any) {
      toast({
        title: "Rejection Failed",
        description: error.message || "Failed to reject the report.",
        variant: "destructive",
      });
    } finally {
      setIsRejecting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case ReportStatus.SUBMITTED:
        return (
          <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20">
            <Clock className="h-3 w-3 mr-1" />
            Pending Review
          </Badge>
        );
      case ReportStatus.APPROVED:
        return (
          <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        );
      case ReportStatus.REJECTED:
        return (
          <Badge className="bg-red-500/10 text-red-500 border-red-500/20">
            <XCircle className="h-3 w-3 mr-1" />
            Returned for Revision
          </Badge>
        );
      case ReportStatus.DRAFT:
        return (
          <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">
            <FileText className="h-3 w-3 mr-1" />
            Draft
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return (
          <Badge className="bg-red-500/10 text-red-500 border-red-500/20">
            High Priority
          </Badge>
        );
      case "medium":
        return (
          <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20">
            Medium Priority
          </Badge>
        );
      case "low":
        return (
          <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
            Low Priority
          </Badge>
        );
      default:
        return <Badge variant="outline">{priority || "Unknown"}</Badge>;
    }
  };

  const getEvidenceIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case "image":
      case "photo":
        return <Image className="h-4 w-4" />;
      case "video":
        return <Video className="h-4 w-4" />;
      case "audio":
        return <Mic className="h-4 w-4" />;
      default:
        return <File className="h-4 w-4" />;
    }
  };

  const handleViewEvidence = (fileUrl: string) => {
    if (fileUrl) {
      window.open(fileUrl, "_blank");
    }
  };

  // Extract key findings and recommendations from AI results
  const extractKeyFindings = () => {
    if (!aiResults || aiResults.length === 0) return [];

    const findings: string[] = [];
    aiResults.forEach((result) => {
      // Extract from analysis result text
      if (result.analysisResult?.analysis) {
        const analysisText = result.analysisResult.analysis;
        const formattedText = formatAnalysisText(analysisText);

        // Look for key findings in the analysis text
        const lines = formattedText.split("\n");
        lines.forEach((line: string) => {
          const trimmedLine = line.trim();
          if (
            trimmedLine.startsWith("•") ||
            trimmedLine.startsWith("-") ||
            trimmedLine.includes("finding") ||
            trimmedLine.includes("detected") ||
            trimmedLine.includes("identified") ||
            trimmedLine.match(/^\d+\.\s/)
          ) {
            // Format the finding text
            const formattedLine = formatAnalysisText(trimmedLine);
            if (formattedLine && !findings.includes(formattedLine)) {
              findings.push(formattedLine);
            }
          }
        });
      }

      // Extract from recommendations
      if (result.recommendations?.investigationPriority) {
        const priority = formatAnalysisText(
          `Investigation Priority: ${result.recommendations.investigationPriority}`
        );
        if (!findings.includes(priority)) {
          findings.push(priority);
        }
      }
      if (result.recommendations?.additionalEvidenceNeeded) {
        result.recommendations.additionalEvidenceNeeded.forEach(
          (evidence: string) => {
            const formatted = formatAnalysisText(evidence);
            if (formatted && !findings.includes(formatted)) {
              findings.push(formatted);
            }
          }
        );
      }
    });
    return findings.slice(0, 5); // Limit to 5 findings
  };

  // Helper function to format text (same as ai-analysis-display.tsx)
  const formatAnalysisText = (text: string): string => {
    if (!text) return "";

    return (
      text
        // Remove asterisks from headers
        .replace(/\*\*(.*?)\*\*/g, "$1")
        // Convert bullet points to proper format
        .replace(/^\s*•\s*/gm, "• ")
        .replace(/^\s*\*\s*/gm, "• ")
        // Clean up extra whitespace
        .replace(/\n\s*\n/g, "\n\n")
        .trim()
    );
  };

  const extractRecommendations = () => {
    if (!aiResults || aiResults.length === 0) return [];

    const recommendations: string[] = [];
    aiResults.forEach((result) => {
      // Extract from analysis result text
      if (result.analysisResult?.analysis) {
        const analysisText = result.analysisResult.analysis;
        const formattedText = formatAnalysisText(analysisText);

        // Look for recommendations in the analysis text
        const lines = formattedText.split("\n");
        lines.forEach((line: string) => {
          const trimmedLine = line.trim();
          if (
            trimmedLine.includes("recommend") ||
            trimmedLine.includes("suggest") ||
            trimmedLine.includes("should") ||
            trimmedLine.includes("advise") ||
            trimmedLine.startsWith("• ") ||
            trimmedLine.match(/^\d+\.\s/)
          ) {
            // Format the recommendation text
            const formattedLine = formatAnalysisText(trimmedLine);
            if (formattedLine && !recommendations.includes(formattedLine)) {
              recommendations.push(formattedLine);
            }
          }
        });
      }

      // Extract from recommendations object
      if (result.recommendations?.safetyRecommendations) {
        result.recommendations.safetyRecommendations.forEach((rec: string) => {
          const formatted = formatAnalysisText(rec);
          if (formatted && !recommendations.includes(formatted)) {
            recommendations.push(formatted);
          }
        });
      }
      if (result.recommendations?.expertConsultation) {
        result.recommendations.expertConsultation.forEach((rec: string) => {
          const formatted = formatAnalysisText(rec);
          if (formatted && !recommendations.includes(formatted)) {
            recommendations.push(formatted);
          }
        });
      }
      if (result.recommendations?.legalImplications) {
        result.recommendations.legalImplications.forEach((rec: string) => {
          const formatted = formatAnalysisText(rec);
          if (formatted && !recommendations.includes(formatted)) {
            recommendations.push(formatted);
          }
        });
      }
    });
    return recommendations.slice(0, 5); // Limit to 5 recommendations
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        <span className="ml-4 text-muted-foreground">
          Loading report details...
        </span>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-red-600 font-medium mb-4">
          {error || "Report not found."}
        </p>
        <Button variant="outline" asChild>
          <Link href="/dashboard/chief/reports">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Reports
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/chief">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Report Review</h1>
            <p className="text-muted-foreground">
              #{report._id.toString().slice(-6)} - {report.title}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {getStatusBadge(report.status)}
          {/* Print and Share buttons removed as requested */}
        </div>
      </div>

      {/* Report Header Info */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Investigator</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">
              {investigator
                ? `${investigator.firstName} ${investigator.lastName}`
                : report.assignedTo
                ? `Investigator ${report.assignedTo.toString().slice(-6)}`
                : "Unassigned"}
            </div>
            <p className="text-xs text-muted-foreground">
              {investigator
                ? "Lead investigator"
                : report.assignedTo
                ? "ID only (fetch failed)"
                : "No assignment"}
            </p>
            {/* Debug info - remove in production */}
            {process.env.NODE_ENV === "development" && (
              <div className="text-xs text-gray-400 mt-1">
                {investigator
                  ? "User data loaded"
                  : report.assignedTo
                  ? `ID: ${report.assignedTo}`
                  : "No ID"}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Confidence</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-green-500">
              {aiConfidence
                ? `${(aiConfidence * 100).toFixed(1)}%`
                : report.aiContribution
                ? `${(report.aiContribution * 100).toFixed(1)}%`
                : "N/A"}
            </div>
            <Progress
              value={
                aiConfidence
                  ? aiConfidence * 100
                  : report.aiContribution
                  ? report.aiContribution * 100
                  : 0
              }
              className="h-2 mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Incident Date</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">
              {incident?.dateTime
                ? new Date(incident.dateTime).toLocaleDateString()
                : report.createdAt
                ? new Date(report.createdAt).toLocaleDateString()
                : "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">Date of occurrence</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Priority</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {getPriorityBadge(report.content?.priority || "medium")}
            <p className="text-xs text-muted-foreground mt-1">
              {report.content?.priority === "high"
                ? "Requires immediate attention"
                : report.content?.priority === "medium"
                ? "Standard priority"
                : "Low priority case"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="report" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="report">Report Details</TabsTrigger>
          <TabsTrigger value="evidence">Evidence</TabsTrigger>
          <TabsTrigger value="ai-analysis">AI Analysis</TabsTrigger>
          <TabsTrigger value="review">Review & Approval</TabsTrigger>
        </TabsList>

        <TabsContent value="report" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Incident Summary</CardTitle>
              <CardDescription>
                Overview of the incident and initial findings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Report Type</h4>
                  <p className="text-sm text-muted-foreground">{report.type}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Status</h4>
                  <p className="text-sm text-muted-foreground">
                    {report.status}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Key Findings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {extractKeyFindings().map(
                    (finding: string, index: number) => {
                      // Check if this is a bullet point
                      if (finding.startsWith("• ")) {
                        return (
                          <div
                            key={index}
                            className="flex items-start space-x-3"
                          >
                            <span className="text-primary mt-1">•</span>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                              {finding.substring(2)}
                            </p>
                          </div>
                        );
                      }
                      // Check if this is a numbered list item
                      if (/^\d+\.\s/.test(finding)) {
                        return (
                          <div
                            key={index}
                            className="flex items-start space-x-3"
                          >
                            <span className="text-primary mt-1 font-medium">
                              {finding.match(/^\d+/)?.[0]}.
                            </span>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                              {finding.replace(/^\d+\.\s/, "")}
                            </p>
                          </div>
                        );
                      }
                      // Regular finding
                      return (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {finding}
                          </p>
                        </div>
                      );
                    }
                  )}
                  {extractKeyFindings().length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      No key findings available from AI analysis.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {extractRecommendations().map(
                    (recommendation: string, index: number) => {
                      // Check if this is a bullet point
                      if (recommendation.startsWith("• ")) {
                        return (
                          <div
                            key={index}
                            className="flex items-start space-x-3"
                          >
                            <span className="text-green-500 mt-1">•</span>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                              {recommendation.substring(2)}
                            </p>
                          </div>
                        );
                      }
                      // Check if this is a numbered list item
                      if (/^\d+\.\s/.test(recommendation)) {
                        return (
                          <div
                            key={index}
                            className="flex items-start space-x-3"
                          >
                            <span className="text-green-500 mt-1 font-medium">
                              {recommendation.match(/^\d+/)?.[0]}.
                            </span>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                              {recommendation.replace(/^\d+\.\s/, "")}
                            </p>
                          </div>
                        );
                      }
                      // Regular recommendation
                      return (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {recommendation}
                          </p>
                        </div>
                      );
                    }
                  )}
                  {extractRecommendations().length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      No recommendations available from AI analysis.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="evidence" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Evidence Summary</CardTitle>
              <CardDescription>
                All evidence collected and analyzed for this incident
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Debug info - remove in production */}
              {process.env.NODE_ENV === "development" && (
                <div className="text-xs text-gray-400 mb-4 p-2 bg-gray-100 rounded">
                  Debug: Evidence count: {evidence.length} | Report ID:{" "}
                  {reportId}
                </div>
              )}
              <div className="grid gap-4 md:grid-cols-2">
                {evidence.length > 0 ? (
                  evidence.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        {getEvidenceIcon(item.type)}
                        <div>
                          <p className="font-medium">
                            {item.description || `Evidence ${index + 1}`}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {item.type} •{" "}
                            {item.fileSize
                              ? `${item.fileSize} KB`
                              : "Unknown size"}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          item.fileUrl && handleViewEvidence(item.fileUrl)
                        }
                        disabled={!item.fileUrl}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-8 text-muted-foreground">
                    No evidence available for this report.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-analysis" className="space-y-6">
          {aiResults && aiResults.length > 0 ? (
            aiResults.map((result, index) => (
              <AiAnalysisDisplay key={index} result={result} />
            ))
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="h-5 w-5 mr-2" />
                  AI Analysis Results
                </CardTitle>
                <CardDescription>
                  No AI analysis results available for this report
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No AI analysis has been performed on this report yet.</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="review" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="h-5 w-5 mr-2" />
                Review & Approval
              </CardTitle>
              <CardDescription>Make a decision on this report</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Decision Actions</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <Button
                    size="lg"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={handleApprove}
                    disabled={isApproving || isRejecting}
                  >
                    {isApproving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Approving...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        {report.status === ReportStatus.APPROVED
                          ? "Already Approved"
                          : "Approve Report"}
                      </>
                    )}
                  </Button>

                  <Button
                    size="lg"
                    variant="destructive"
                    onClick={handleReject}
                    disabled={isApproving || isRejecting}
                  >
                    {isRejecting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 mr-2" />
                        Return for Revision
                      </>
                    )}
                  </Button>
                </div>

                <div className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg">
                  <p className="font-medium mb-2">Review Guidelines:</p>
                  <ul className="space-y-1 text-xs">
                    <li>
                      • Verify all evidence has been properly documented and
                      analyzed
                    </li>
                    <li>
                      • Ensure AI analysis confidence levels meet department
                      standards (≥85%)
                    </li>
                    <li>
                      • Check that recommendations align with department
                      policies
                    </li>
                    <li>
                      • Confirm all witness statements have been collected
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
