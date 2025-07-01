"use client";

import { useState } from "react";
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
import { AssignmentBoard } from "@/components/assignment-board";
import { AIInsightsSummary } from "@/components/ai-insights-summary";
import { UnassignedCaseDialog } from "@/components/unassigned-case-dialog";

export function ChiefDashboard() {
  const [unassignedCaseDialog, setUnassignedCaseDialog] = useState({
    open: false,
    caseId: "",
    caseTitle: "",
  });

  const handleOpenUnassignedCase = (caseId: string, caseTitle: string) => {
    setUnassignedCaseDialog({
      open: true,
      caseId,
      caseTitle,
    });
  };

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
            <div className="text-2xl font-bold">7</div>
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
            <div className="text-2xl font-bold">5</div>
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
            <div className="text-2xl font-bold">3</div>
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
              24
            </div>
            <p className="text-xs text-green-600/80 dark:text-green-400/80">
              +8 from last month
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
              <TabsTrigger value="pending">Pending Review (3)</TabsTrigger>
              <TabsTrigger value="approved">Recently Approved (5)</TabsTrigger>
              <TabsTrigger value="returned">
                Returned for Revision (2)
              </TabsTrigger>
            </TabsList>
            <TabsContent value="pending" className="mt-4 space-y-4">
              {[
                {
                  id: "2023-043",
                  title: "Multi-vehicle Accident - Bridge",
                  investigator: "John Smith",
                  date: "2 days ago",
                  aiConfidence: "high",
                },
                {
                  id: "2023-040",
                  title: "Pedestrian Incident - Market St",
                  investigator: "Sarah Johnson",
                  date: "5 days ago",
                  aiConfidence: "medium",
                },
                {
                  id: "2023-038",
                  title: "Vehicle Collision - Highway 280",
                  investigator: "Michael Brown",
                  date: "1 week ago",
                  aiConfidence: "high",
                },
              ].map((report) => (
                <div
                  key={report.id}
                  className="flex flex-col space-y-2 p-3 border rounded-lg"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">
                      #{report.id} - {report.title}
                    </h4>
                    <Badge
                      variant="outline"
                      className={`
                        ${
                          report.aiConfidence === "high"
                            ? "bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20"
                            : "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 border-orange-500/20"
                        }
                      `}
                    >
                      {report.aiConfidence === "high"
                        ? "High AI Confidence"
                        : "Medium AI Confidence"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Investigator: {report.investigator} • Submitted:{" "}
                    {report.date}
                  </p>
                  <div className="flex items-center space-x-2 pt-1">
                    <Button size="sm" className="flex-1" asChild>
                      <Link href={`/dashboard/chief/reports/${report.id}`}>
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
                      <Link href={`/dashboard/chief/ai-insights/${report.id}`}>
                        <Brain className="mr-2 h-4 w-4" />
                        View AI Analysis
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </TabsContent>
            <TabsContent value="approved" className="mt-4">
              <div className="text-sm text-muted-foreground">
                Recently approved reports will appear here.
              </div>
            </TabsContent>
            <TabsContent value="returned" className="mt-4">
              <div className="text-sm text-muted-foreground">
                Reports returned for revision will appear here.
              </div>
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
            {[
              {
                id: "2023-052",
                title: "Multi-vehicle Accident - Bridge",
                date: "Today, 08:45 AM",
                priority: "high",
              },
              {
                id: "2023-051",
                title: "Pedestrian Incident - Market St",
                date: "Yesterday, 15:30 PM",
                priority: "medium",
              },
              {
                id: "2023-050",
                title: "Vehicle Collision - Highway 280",
                date: "2 days ago, 11:20 AM",
                priority: "low",
              },
            ].map((caseItem) => (
              <div
                key={caseItem.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div>
                  <h4 className="text-sm font-medium">
                    #{caseItem.id} - {caseItem.title}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Reported: {caseItem.date}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge
                    variant="outline"
                    className={`
                      ${
                        caseItem.priority === "high"
                          ? "bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20"
                          : caseItem.priority === "medium"
                          ? "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 border-orange-500/20"
                          : "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20"
                      }
                    `}
                  >
                    {caseItem.priority === "high"
                      ? "High Priority"
                      : caseItem.priority === "medium"
                      ? "Medium Priority"
                      : "Low Priority"}
                  </Badge>
                  <Button
                    size="sm"
                    onClick={() =>
                      handleOpenUnassignedCase(caseItem.id, caseItem.title)
                    }
                  >
                    Assign
                  </Button>
                </div>
              </div>
            ))}
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
