"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Brain,
  FileText,
  User,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { CaseList } from "@/components/case-list";
import { useInvestigatorDashboard } from "@/hooks/useInvestigatorDashboard";
import { useInvestigatorAIReports } from "@/hooks/useInvestigatorAIReports";
import { AIInsightsSection } from "@/components/ai-insights-card";

export function InvestigatorDashboard() {
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

  const {
    stats,
    assignedReports,
    pendingReviews,
    isLoading,
    error,
    refreshData,
  } = useInvestigatorDashboard(currentUser?._id);

  // Debug logging
  useEffect(() => {
    if (currentUser?._id) {
      console.log(
        "🔍 [Investigator Dashboard] Current user ID:",
        currentUser._id
      );
      console.log(
        "🔍 [Investigator Dashboard] Assigned reports count:",
        assignedReports.length
      );
      console.log(
        "🔍 [Investigator Dashboard] Pending reviews count:",
        pendingReviews.length
      );
      console.log("🔍 [Investigator Dashboard] Stats:", stats);
    }
  }, [currentUser?._id, assignedReports.length, pendingReviews.length, stats]);

  // Fetch AI reports for the current investigator
  const {
    aiReports: investigatorAIReports,
    isLoading: aiReportsLoading,
    error: aiReportsError,
  } = useInvestigatorAIReports(currentUser?._id);

  // Convert to the expected format for AIInsightsSection
  const aiReports = investigatorAIReports.flatMap(
    (reportData) => reportData.aiResults
  );

  if (error) {
    return (
      <div className="space-y-6 w-full">
        <div className="flex flex-col space-y-2 w-full">
          <h1 className="text-3xl font-bold tracking-tight">
            Investigator Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome back! Here&apos;s an overview of your assigned cases and
            AI-generated reports.
          </p>
        </div>

        <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <div>
                <h3 className="font-medium text-red-800 dark:text-red-200">
                  Error Loading Dashboard
                </h3>
                <p className="text-sm text-red-600 dark:text-red-300">
                  {error}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={refreshData}
              className="mt-4"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col space-y-2 w-full">
        <h1 className="text-3xl font-bold tracking-tight">
          Investigator Dashboard
        </h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s an overview of your assigned cases and
          AI-generated reports.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 w-full">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Assigned Cases
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : stats.assignedCasesCount}
            </div>
            <p className="text-xs text-muted-foreground">
              Active investigations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Review
            </CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : stats.pendingReviewsCount}
            </div>
            <p className="text-xs text-muted-foreground">
              Awaiting chief review
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Analysis</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : stats.aiReportsCount}
            </div>
            <p className="text-xs text-muted-foreground">AI reports ready</p>
          </CardContent>
        </Card>

        <Card className="bg-green-500/10 border-green-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-600 dark:text-green-400">
              Completed This Month
            </CardTitle>
            <FileText className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {isLoading ? "..." : stats.completedThisMonth}
            </div>
            <p className="text-xs text-green-600/80 dark:text-green-400/80">
              Reports completed
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Assigned Cases</CardTitle>
            <CardDescription>
              Your current case load and priorities ({assignedReports.length}{" "}
              assigned)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CaseList
              incidents={[]}
              reports={assignedReports}
              isLoading={isLoading}
              maxItems={5}
            />
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/dashboard/investigator/cases">
                View All Cases
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <AIInsightsSection aiReports={aiReports} isLoading={isLoading} />
      </div>
    </div>
  );
}
