"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Brain, FileText, User } from "lucide-react";
import Link from "next/link";
import { UnassignedCaseDialog } from "@/components/unassigned-case-dialog";
import { incidentService } from "@/lib/api/incidents";
import { reportService } from "@/lib/api/reports";
import { userService } from "@/lib/api/users";
import { IIncident } from "@/app/types/incident";
import { IReport } from "@/app/types/report";
import { IUser } from "@/types/user";

export function ChiefDashboard() {
  const [unassignedCaseDialog, setUnassignedCaseDialog] = useState({
    open: false,
    caseId: "",
    caseTitle: "",
  });

  // Dashboard data states
  const [incidents, setIncidents] = useState<IIncident[]>([]);
  const [reports, setReports] = useState<IReport[]>([]);
  const [investigators, setInvestigators] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [incidentsData, reportsData, investigatorsData] =
          await Promise.all([
            incidentService.getAllIncidents(),
            reportService.getAllReports(),
            userService.getUsersByRole("investigator") as Promise<IUser[]>,
          ]);
        setIncidents(incidentsData);
        setReports(reportsData);
        setInvestigators(investigatorsData);
      } catch (e) {
        // Optionally handle error
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Helper filters
  const unassignedIncidents = incidents.filter(
    (i: any) => !i.assignedTo || i.assignedTo.length === 0
  );
  const activeInvestigators = investigators.filter((u: any) => u.isActive);
  const now = new Date();
  const completedThisMonth = reports.filter((r: any) => {
    if (!r.approvedAt) return false;
    const approvedDate = new Date(r.approvedAt);
    return (
      approvedDate.getMonth() === now.getMonth() &&
      approvedDate.getFullYear() === now.getFullYear()
    );
  });
  const pendingReviewReports = reports.filter(
    (r: any) => r.status === "pending_review"
  );
  const approvedReports = reports.filter((r: any) => r.status === "approved");
  const returnedReports = reports.filter((r: any) => r.status === "returned");

  const handleOpenUnassignedCase = (caseId: string, caseTitle: string) => {
    setUnassignedCaseDialog({
      open: true,
      caseId,
      caseTitle,
    });
  };

  if (loading) {
    return <div className="p-8 text-center">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col space-y-2 w-full">
        <h1 className="text-3xl font-bold tracking-tight">
          Chief Analyst Dashboard
        </h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s an overview of your team&apos;s performance
          and pending assignments.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 w-full">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Incidents</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {unassignedIncidents.length}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting assignment</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Investigators
            </CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {activeInvestigators.length}
            </div>
            <p className="text-xs text-muted-foreground">Currently on duty</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Reports Pending Review
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pendingReviewReports.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Awaiting your approval
            </p>
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
              {completedThisMonth.length}
            </div>
            <p className="text-xs text-green-600/80 dark:text-green-400/80">
              Completed reports this month
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reports Pending Review</CardTitle>
          <CardDescription>
            Final reports awaiting your approval
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="pending">
                Pending Review ({pendingReviewReports.length})
              </TabsTrigger>
              <TabsTrigger value="approved">
                Recently Approved ({approvedReports.length})
              </TabsTrigger>
              <TabsTrigger value="returned">
                Returned for Revision ({returnedReports.length})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="pending" className="mt-4 space-y-4">
              {pendingReviewReports.length === 0 ? (
                <div className="text-sm text-muted-foreground">
                  No reports pending review.
                </div>
              ) : (
                pendingReviewReports.map((report: any) => (
                  <div
                    key={report._id}
                    className="flex flex-col space-y-2 p-3 border rounded-lg"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">
                        #{report._id} - {report.title}
                      </h4>
                      <Badge
                        variant="outline"
                        className={
                          report.aiOverallConfidence >= 80
                            ? "bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20"
                            : "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 border-orange-500/20"
                        }
                      >
                        {report.aiOverallConfidence >= 80
                          ? "High AI Confidence"
                          : "Medium AI Confidence"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Investigator: {report.assignedToName || "-"} • Submitted:{" "}
                      {report.submittedAt
                        ? new Date(report.submittedAt).toLocaleDateString()
                        : "-"}
                    </p>
                    <div className="flex items-center space-x-2 pt-1">
                      <Button size="sm" className="flex-1" asChild>
                        <Link href={`/dashboard/chief/reports/${report._id}`}>
                          <FileText className="mr-2 h-4 w-4" />
                          Review Report
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        asChild
                      >
                        <Link
                          href={`/dashboard/chief/ai-insights/${report._id}`}
                        >
                          <Brain className="mr-2 h-4 w-4" />
                          View AI Analysis
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </TabsContent>
            <TabsContent value="approved" className="mt-4 space-y-4">
              {approvedReports.length === 0 ? (
                <div className="text-sm text-muted-foreground">
                  No recently approved reports.
                </div>
              ) : (
                approvedReports.map((report: any) => (
                  <div
                    key={report._id}
                    className="flex flex-col space-y-2 p-3 border rounded-lg"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">
                        #{report._id} - {report.title}
                      </h4>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Investigator: {report.assignedToName || "-"} • Approved:{" "}
                      {report.approvedAt
                        ? new Date(report.approvedAt).toLocaleDateString()
                        : "-"}
                    </p>
                  </div>
                ))
              )}
            </TabsContent>
            <TabsContent value="returned" className="mt-4 space-y-4">
              {returnedReports.length === 0 ? (
                <div className="text-sm text-muted-foreground">
                  No reports returned for revision.
                </div>
              ) : (
                returnedReports.map((report: any) => (
                  <div
                    key={report._id}
                    className="flex flex-col space-y-2 p-3 border rounded-lg"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">
                        #{report._id} - {report.title}
                      </h4>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Investigator: {report.assignedToName || "-"} • Returned:{" "}
                      {report.updatedAt
                        ? new Date(report.updatedAt).toLocaleDateString()
                        : "-"}
                    </p>
                  </div>
                ))
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Unassigned Cases</CardTitle>
          <CardDescription>
            Cases that need to be assigned to investigators
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {unassignedIncidents.length === 0 ? (
              <div className="text-sm text-muted-foreground">
                No unassigned cases.
              </div>
            ) : (
              unassignedIncidents.map((caseItem: any) => (
                <div
                  key={caseItem._id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <h4 className="text-sm font-medium">
                      #{caseItem._id} -{" "}
                      {caseItem.incidentDescription || caseItem.incidentType}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Reported:{" "}
                      {caseItem.dateTime
                        ? new Date(caseItem.dateTime).toLocaleString()
                        : "-"}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant="outline"
                      className={
                        caseItem.incidentSeverity === "CRITICAL"
                          ? "bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20"
                          : caseItem.incidentSeverity === "MAJOR"
                          ? "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 border-orange-500/20"
                          : "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20"
                      }
                    >
                      {caseItem.incidentSeverity}
                    </Badge>
                    {/* <Button size="sm" onClick={() => handleOpenUnassignedCase(caseItem._id, caseItem.incidentDescription || caseItem.incidentType)}>
                      Assign
                    </Button> */}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <UnassignedCaseDialog
        open={unassignedCaseDialog.open}
        onOpenChange={(open) =>
          setUnassignedCaseDialog((prev) => ({ ...prev, open }))
        }
        caseId={unassignedCaseDialog.caseId}
        caseTitle={unassignedCaseDialog.caseTitle}
      />
    </div>
  );
}
