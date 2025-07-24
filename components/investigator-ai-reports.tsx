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
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  Brain,
  Search,
  Filter,
  Eye,
  Download,
  Calendar,
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Loader2,
  User,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useInvestigatorAIReports } from "@/hooks/useInvestigatorAIReports";
import { IAiAnalysisResult } from "@/types/ai_processing";
import { PDFGenerator } from "@/lib/pdf-generator";
import { toast } from "@/hooks/use-toast";

// Helper functions for processing AI analysis data
const getAnalysisStatus = (result: IAiAnalysisResult): string => {
  if (result.status === "completed") return "completed";
  if (result.status === "processing") return "processing";
  if (result.status === "failed") return "failed";
  return "pending";
};

const getAnalysisPriority = (result: IAiAnalysisResult): string => {
  const confidence = result.confidenceScore || 0;
  if (confidence >= 90) return "high";
  if (confidence >= 70) return "medium";
  return "low";
};

const getAnalysisTitle = (result: IAiAnalysisResult): string => {
  const analysisType =
    result.analysisType?.replace("_", " ").toUpperCase() || "UNKNOWN";
  const confidence = ((result.confidenceScore || 0) * 100).toFixed(1);
  return `${analysisType} Analysis (${confidence}% confidence)`;
};

const getProcessingTime = (result: IAiAnalysisResult): string => {
  if (result.processingTime) {
    return `${(result.processingTime / 1000).toFixed(1)}s`;
  }
  return "Unknown";
};

// Helper function to extract report ID safely
const getReportId = (result: IAiAnalysisResult, reportData?: any): string => {
  if (reportData?.reportId) {
    return reportData.reportId;
  }
  return (
    result.reportId?.toString() || result.evidenceId?.toString() || "Unknown"
  );
};

export function InvestigatorAIReports() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Fetch current user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch("/api/auth/me");
        if (response.ok) {
          const userData = await response.json();
          setCurrentUser(userData);
        }
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    fetchCurrentUser();
  }, []);

  // Fetch AI analysis reports for the current investigator
  const { aiReports, isLoading, error, refreshData } = useInvestigatorAIReports(
    currentUser?._id
  );

  // Debug: Log AI reports data
  useEffect(() => {
    console.log("🔍 AI Reports Data:", {
      aiReports,
      isLoading,
      error,
      userId: currentUser?._id,
    });
  }, [aiReports, isLoading, error, currentUser?._id]);

  // Filter reports based on search and filters
  const filteredReports = aiReports.filter((reportData) => {
    const aiResult = reportData.aiResults[0]; // Get the latest result
    if (!aiResult) return false;

    const reportTitle = getAnalysisTitle(aiResult);
    const reportStatus = getAnalysisStatus(aiResult);
    const reportPriority = getAnalysisPriority(aiResult);
    const reportId = getReportId(aiResult, reportData);

    const matchesSearch =
      reportTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reportId.includes(searchTerm);
    const matchesStatus =
      statusFilter === "all" || reportStatus === statusFilter;
    const matchesPriority =
      priorityFilter === "all" || reportPriority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        );
      case "processing":
        return (
          <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">
            <Clock className="h-3 w-3 mr-1" />
            Processing
          </Badge>
        );
      case "failed":
        return (
          <Badge className="bg-red-500/10 text-red-500 border-red-500/20">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Failed
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-500/10 text-gray-500 border-gray-500/20">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return (
          <Badge className="bg-red-500/10 text-red-500 border-red-500/20">
            High
          </Badge>
        );
      case "medium":
        return (
          <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20">
            Medium
          </Badge>
        );
      case "low":
        return (
          <Badge className="bg-gray-500/10 text-gray-500 border-gray-500/20">
            Low
          </Badge>
        );
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return "text-green-500";
    if (confidence >= 70) return "text-orange-500";
    return "text-red-500";
  };

  const handleDownloadReport = async (reportData: any) => {
    try {
      const aiResult = reportData.aiResults[0];
      if (!aiResult) {
        toast({
          title: "No Analysis Data",
          description: "No AI analysis results found for this report.",
          variant: "destructive",
        });
        return;
      }

      // Prepare PDF data
      const pdfData = {
        reportId: reportData.reportId,
        title: `AI Analysis Report #${reportData.reportId}`,
        generatedAt: new Date(),
        aiResults: [aiResult],
        processingSummary: {
          totalEvidence: 1,
          successfullyProcessed: 1,
          overallConfidence: aiResult.confidenceScore || 0,
        },
      };

      // Show loading toast
      toast({
        title: "Generating PDF Report",
        description: "Please wait while we prepare your report...",
      });

      // Generate and download PDF
      await PDFGenerator.downloadPDF(pdfData);

      // Success toast
      toast({
        title: "AI Analysis Report Downloaded",
        description:
          "Your AI analysis report has been downloaded successfully.",
      });
    } catch (error: any) {
      console.error("Error downloading report:", error);
      toast({
        title: "Download Failed",
        description:
          error.message || "Failed to download the report. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col space-y-2 w-full">
        <h1 className="text-3xl font-bold tracking-tight">
          AI Analysis Reports
        </h1>
        <p className="text-muted-foreground">
          Review and manage AI-generated analysis reports for your assigned
          cases
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{aiReports.length}</div>
            <p className="text-xs text-muted-foreground">
              {isLoading ? "Loading..." : `${aiReports.length} loaded`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              High Confidence
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {
                aiReports.filter((reportData) => {
                  const aiResult = reportData.aiResults[0];
                  return aiResult && (aiResult.confidenceScore || 0) >= 0.9;
                }).length
              }
            </div>
            <p className="text-xs text-muted-foreground">≥90% confidence</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processing</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">
              {
                aiReports.filter((reportData) => {
                  const aiResult = reportData.aiResults[0];
                  return (
                    aiResult && getAnalysisStatus(aiResult) === "processing"
                  );
                }).length
              }
            </div>
            <p className="text-xs text-muted-foreground">Currently analyzing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Processing
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4s</div>
            <p className="text-xs text-muted-foreground">Per analysis</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search reports by ID or title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <Card>
          <CardContent className="p-12 text-center">
            <Loader2 className="h-8 w-8 mx-auto mb-4 animate-spin text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Loading AI Reports</h3>
            <p className="text-muted-foreground">
              Fetching AI analysis reports for your assigned cases...
            </p>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <Card>
          <CardContent className="p-12 text-center">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-red-500" />
            <h3 className="text-lg font-semibold mb-2">
              Error Loading Reports
            </h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={refreshData}>Try Again</Button>
          </CardContent>
        </Card>
      )}

      {/* Reports List */}
      {!isLoading && !error && (
        <Tabs defaultValue="grid" className="w-full">
          <TabsList>
            <TabsTrigger value="grid">Grid View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>

          <TabsContent value="grid" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredReports.map((reportData) => {
                const aiResult = reportData.aiResults[0];
                if (!aiResult) return null;

                const reportId = getReportId(aiResult, reportData);
                const reportTitle = getAnalysisTitle(aiResult);
                const reportStatus = getAnalysisStatus(aiResult);
                const reportPriority = getAnalysisPriority(aiResult);
                const confidence = (aiResult.confidenceScore || 0) * 100;
                const analysisType = aiResult.analysisType || "unknown";
                const generatedDate = new Date(reportData.updatedAt);
                const processingTime = getProcessingTime(aiResult);

                return (
                  <Card
                    key={reportId}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-lg">#{reportId}</CardTitle>
                          <CardDescription className="font-medium">
                            {reportTitle}
                          </CardDescription>
                        </div>
                        {getPriorityBadge(reportPriority)}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        {getStatusBadge(reportStatus)}
                        <div
                          className={`text-sm font-medium ${getConfidenceColor(
                            confidence
                          )}`}
                        >
                          {confidence.toFixed(1)}% confidence
                        </div>
                      </div>

                      <Progress value={confidence} className="h-2" />

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Analysis Type</p>
                          <p className="font-medium">{analysisType}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Status</p>
                          <p className="font-medium">{reportStatus}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {generatedDate.toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {processingTime}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1" asChild>
                          <Link
                            href={`/dashboard/investigator/ai-reports/${reportId}`}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Link>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownloadReport(reportData)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="list" className="space-y-4">
            <div className="space-y-4">
              {filteredReports.map((reportData) => {
                const aiResult = reportData.aiResults[0];
                if (!aiResult) return null;

                const reportId = getReportId(aiResult, reportData);
                const reportTitle = getAnalysisTitle(aiResult);
                const reportStatus = getAnalysisStatus(aiResult);
                const reportPriority = getAnalysisPriority(aiResult);
                const confidence = (aiResult.confidenceScore || 0) * 100;
                const analysisType = aiResult.analysisType || "unknown";
                const generatedDate = new Date(reportData.updatedAt);
                const processingTime = getProcessingTime(aiResult);

                return (
                  <Card
                    key={reportId}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <h3 className="font-semibold">#{reportId}</h3>
                              {getPriorityBadge(reportPriority)}
                              {getStatusBadge(reportStatus)}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {reportTitle}
                            </p>
                            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                              <span className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                {generatedDate.toLocaleDateString()} at{" "}
                                {generatedDate.toLocaleTimeString()}
                              </span>
                              <span>{analysisType} analysis</span>
                              <span>Processed in {processingTime}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div
                              className={`text-sm font-medium ${getConfidenceColor(
                                confidence
                              )}`}
                            >
                              {confidence.toFixed(1)}% confidence
                            </div>
                            <Progress
                              value={confidence}
                              className="h-1 w-20 mt-1"
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" asChild>
                              <Link
                                href={`/dashboard/investigator/ai-reports/${reportId}`}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Report
                              </Link>
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDownloadReport(reportData)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      )}

      {filteredReports.length === 0 && !isLoading && !error && (
        <Card>
          <CardContent className="p-12 text-center">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No reports found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or filters to find the reports
              you&apos;re looking for.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
