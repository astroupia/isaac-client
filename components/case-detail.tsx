"use client";

import { useEffect, useState } from "react";
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
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Brain,
  Download,
  MessageSquare,
  Send,
  Loader2,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { reportService } from "@/lib/api/reports";
import { evidenceService } from "@/lib/api/evidence";
import {
  getReportResults,
  analyzeReport,
  generateCasualtyReport,
} from "@/lib/api/aiProcessing";
import { IReport, ReportStatus } from "@/app/types/report";
import { IEvidence } from "@/types/evidence";
import { IAiAnalysisResult } from "@/types/ai_processing";
import { AiAnalysisDisplay } from "./ai-analysis-display";

interface CaseDetailProps {
  id: string;
}

export function CaseDetail({ id }: CaseDetailProps) {
  const { toast } = useToast();
  const [notes, setNotes] = useState("");
  const [report, setReport] = useState<IReport | null>(null);
  const [evidence, setEvidence] = useState<IEvidence[]>([]);
  const [aiResults, setAiResults] = useState<IAiAnalysisResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const reportData = await reportService.getReport(id);
        setReport(reportData);
        // Fetch evidence for the incident
        let evidenceData: IEvidence[] = [];
        if (reportData.incidentId) {
          // Handle both string and object incidentId
          const incidentId =
            typeof reportData.incidentId === "object" &&
            reportData.incidentId._id
              ? reportData.incidentId._id.toString()
              : reportData.incidentId.toString();

          console.log("🔍 Fetching evidence for incidentId:", incidentId);
          evidenceData = await evidenceService.getIncidentEvidence(incidentId);
        }
        setEvidence(evidenceData);
        // Fetch AI analysis results for the report
        try {
          const aiData = await getReportResults(id);
          console.log("🔍 AI Results fetched:", aiData);

          // Extract data from the API response structure
          let results: IAiAnalysisResult[] = [];
          if (aiData && typeof aiData === "object") {
            if (
              "success" in aiData &&
              "data" in aiData &&
              Array.isArray((aiData as any).data)
            ) {
              // API returned { success: true, data: [...], message: "..." }
              results = (aiData as any).data;
            } else if (Array.isArray(aiData)) {
              // API returned array directly
              results = aiData;
            }
          }

          // Sort by updatedAt to show the latest results first
          results.sort((a: IAiAnalysisResult, b: IAiAnalysisResult) => {
            const dateA = new Date(a.updatedAt || a.createdAt || 0);
            const dateB = new Date(b.updatedAt || b.createdAt || 0);
            return dateB.getTime() - dateA.getTime(); // Latest first
          });

          // Only keep the latest analysis result
          const latestResult = results.length > 0 ? [results[0]] : [];
          console.log("🔍 Latest AI result:", latestResult);
          setAiResults(latestResult);
        } catch (error) {
          console.error("❌ Failed to fetch AI results:", error);
          setAiResults([]);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load case details");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  const handleSubmitForReview = () => {
    toast({
      title: "Case submitted for review",
      description:
        "Your investigation has been submitted to the Chief Analyst for review.",
    });
  };

  const handleAddNote = () => {
    if (notes.trim()) {
      toast({
        title: "Note added",
        description: "Your investigation note has been added to the case.",
      });
      setNotes("");
    }
  };

  const handleStartAnalysis = async () => {
    if (!report) return;

    setIsAnalyzing(true);
    try {
      console.log("🔍 Starting AI analysis for report:", report._id);

      const analysisResult = await analyzeReport(report._id.toString());
      console.log("✅ AI analysis completed:", analysisResult);

      // Refresh AI results using reportId
      const updatedAiResults = await getReportResults(report._id.toString());
      console.log("🔍 Updated AI results:", updatedAiResults);

      // Extract data from the API response structure
      let results: IAiAnalysisResult[] = [];
      if (updatedAiResults && typeof updatedAiResults === "object") {
        if (
          "success" in updatedAiResults &&
          "data" in updatedAiResults &&
          Array.isArray((updatedAiResults as any).data)
        ) {
          // API returned { success: true, data: [...], message: "..." }
          results = (updatedAiResults as any).data;
        } else if (Array.isArray(updatedAiResults)) {
          // API returned array directly
          results = updatedAiResults;
        }
      }

      // Sort by updatedAt to show the latest results first
      results.sort((a: IAiAnalysisResult, b: IAiAnalysisResult) => {
        const dateA = new Date(a.updatedAt || a.createdAt || 0);
        const dateB = new Date(b.updatedAt || b.createdAt || 0);
        return dateB.getTime() - dateA.getTime(); // Latest first
      });

      // Only keep the latest analysis result
      const latestResult = results.length > 0 ? [results[0]] : [];
      console.log("🔍 Latest updated AI result:", latestResult);
      setAiResults(latestResult);

      toast({
        title: "AI Analysis Completed",
        description: "The report has been enhanced with AI analysis.",
      });
    } catch (error: any) {
      console.error("❌ AI analysis failed:", error);
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to start AI analysis",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateCasualtyReport = async () => {
    if (!report) return;

    setIsGeneratingReport(true);
    try {
      console.log("🔍 Generating casualty report for report:", report._id);

      const casualtyReport = await generateCasualtyReport(
        report._id.toString()
      );
      console.log("✅ Casualty report generated:", casualtyReport);

      toast({
        title: "Casualty Report Generated",
        description: "The casualty report has been created successfully.",
      });
    } catch (error: any) {
      console.error("❌ Casualty report generation failed:", error);
      toast({
        title: "Report Generation Failed",
        description: error.message || "Failed to generate casualty report",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
      case "in-progress":
        return (
          <Badge
            variant="outline"
            className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20"
          >
            In Progress
          </Badge>
        );
      case "review":
      case "submitted":
        return (
          <Badge
            variant="outline"
            className="bg-purple-500/10 text-purple-500 hover:bg-purple-500/20 border-purple-500/20"
          >
            In Review
          </Badge>
        );
      case "approved":
      case "completed":
        return (
          <Badge
            variant="outline"
            className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20"
          >
            Completed
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        <span className="ml-4 text-muted-foreground">
          Loading case details...
        </span>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <p className="text-red-600 font-medium">{error || "Case not found."}</p>
        <Button variant="outline" asChild className="mt-4">
          <Link href="/dashboard/investigator/cases">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Cases
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/investigator/cases">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Cases
          </Link>
        </Button>
      </div>

      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Case #{report._id?.toString().slice(-9)}
            </h1>
            {getStatusBadge(report.status)}
            {/* Add priority badge if available */}
          </div>
          <div className="flex items-center space-x-2">
            {/* <Button
              variant="outline"
              onClick={handleStartAnalysis}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Brain className="mr-2 h-4 w-4" />
              )}
              {isAnalyzing ? "Analyzing..." : "Start AI Analysis"}
            </Button> */}
            {aiResults.length === 0 && (
              <Button
                variant="outline"
                onClick={handleGenerateCasualtyReport}
                disabled={isGeneratingReport}
              >
                {isGeneratingReport ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <FileText className="mr-2 h-4 w-4" />
                )}
                {isGeneratingReport
                  ? "Generating..."
                  : "Generate Casualty Report"}
              </Button>
            )}
            <Button variant="outline" asChild>
              <Link href={`/dashboard/investigator/ai-reports/${report._id}`}>
                <Brain className="mr-2 h-4 w-4" />
                View AI Analysis
              </Link>
            </Button>
            {/* <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export Case
            </Button> */}
          </div>
        </div>
        <p className="text-muted-foreground">{report.title}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {report.status === ReportStatus.APPROVED
                ? 100
                : report.status === ReportStatus.SUBMITTED
                ? 22.5
                : report.status === ReportStatus.DRAFT
                ? 72.5
                : report.status === ReportStatus.REJECTED
                ? 47.5
                : report.status === ReportStatus.PUBLISHED
                ? 100
                : 50}
              %
            </div>
            <div className="w-full bg-muted rounded-full h-2 mt-2">
              <div
                className={`h-2 rounded-full ${
                  report.status === ReportStatus.APPROVED
                    ? "bg-green-500"
                    : report.status === ReportStatus.SUBMITTED
                    ? "bg-blue-500"
                    : report.status === ReportStatus.DRAFT
                    ? "bg-yellow-500"
                    : report.status === ReportStatus.REJECTED
                    ? "bg-red-500"
                    : report.status === ReportStatus.PUBLISHED
                    ? "bg-green-500"
                    : "bg-primary"
                }`}
                style={{
                  width: `${
                    report.status === ReportStatus.APPROVED
                      ? 100
                      : report.status === ReportStatus.SUBMITTED
                      ? 22.5
                      : report.status === ReportStatus.DRAFT
                      ? 72.5
                      : report.status === ReportStatus.REJECTED
                      ? 47.5
                      : report.status === ReportStatus.PUBLISHED
                      ? 100
                      : 50
                  }%`,
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Evidence</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{evidence.length}</div>
            <p className="text-xs text-muted-foreground">Items collected</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{aiResults.length}</div>
            <p className="text-xs text-muted-foreground">
              AI evidence analyses
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Case Investigation</CardTitle>
            <CardDescription>
              Detailed investigation information and evidence
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="evidence">Evidence</TabsTrigger>
                <TabsTrigger value="ai">AI Analysis</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4 mt-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Case Details</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Title:</span>{" "}
                        {report.title}
                      </div>
                      <div>
                        <span className="font-medium">Status:</span>{" "}
                        {report.status}
                      </div>
                      <div>
                        <span className="font-medium">Created At:</span>{" "}
                        {new Date(report.createdAt).toLocaleString()}
                      </div>
                      <div>
                        <span className="font-medium">Updated At:</span>{" "}
                        {new Date(report.updatedAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Description</h3>
                    <p className="text-sm text-muted-foreground">
                      {report.content?.description ||
                        "No description available."}
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="evidence" className="space-y-4 mt-4">
                <div className="space-y-4">
                  {evidence.length === 0 && (
                    <p className="text-muted-foreground">
                      No evidence found for this case.
                    </p>
                  )}
                  {evidence.map((item, index) => (
                    <div
                      key={item._id.toString()}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <h4 className="font-medium">{item.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {item.type}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          item.aiProcessed
                            ? "bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20"
                            : "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 border-orange-500/20"
                        }
                      >
                        {item.aiProcessed ? "Processed" : "Pending"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="ai" className="space-y-4 mt-4">
                <div className="space-y-4">
                  {(!aiResults || aiResults.length === 0) && (
                    <div className="text-center py-8">
                      <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground text-lg">
                        No AI analysis results found for this report.
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Start an AI analysis to get detailed insights about this
                        case.
                      </p>
                    </div>
                  )}
                  {Array.isArray(aiResults) &&
                    aiResults.map((result, index) => (
                      <AiAnalysisDisplay
                        key={result.evidenceId?.toString() || index}
                        result={result}
                      />
                    ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* <Card>
          <CardHeader>
            <CardTitle>Investigation Notes</CardTitle>
            <CardDescription>Add notes and observations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Textarea
                placeholder="Add investigation notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
              />
              <Button
                onClick={handleAddNote}
                disabled={!notes.trim()}
                className="w-full"
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Add Note
              </Button>
            </div>

            <div className="pt-4 border-t">
              <Button onClick={handleSubmitForReview} className="w-full">
                <Send className="mr-2 h-4 w-4" />
                Submit for Review
              </Button>
            </div>
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
}
