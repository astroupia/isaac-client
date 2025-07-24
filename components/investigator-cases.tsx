"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  ArrowUpDown,
  Brain,
  FileText,
  Search,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useInvestigatorCases } from "@/hooks/useInvestigatorCases";
import { AIAnalysisButton } from "@/components/ai-analysis-button";
import { ReportStatus } from "@/app/types/report";

interface CurrentUser {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  currentCaseload: number;
  maxCaseload: number;
  specialization: string[];
  completionRate: number;
}

export function InvestigatorCases() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [userLoading, setUserLoading] = useState(true);

  // Fetch current user from Next.js API handler
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        setUserLoading(true);
        const response = await fetch("/api/auth/me");
        if (response.ok) {
          const userData = await response.json();
          console.log("🔍 Current User Data:", userData);
          setCurrentUser(userData);
        } else {
          console.error("Failed to fetch current user");
        }
      } catch (error) {
        console.error("Error fetching current user:", error);
      } finally {
        setUserLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  const {
    cases,
    isLoading,
    error,
    isProcessingAI,
    analysisProgress,
    startAIAnalysis,
    refreshData,
  } = useInvestigatorCases(currentUser?._id);

  // Debug: Log cases data
  useEffect(() => {
    console.log("🔍 Cases Data:", {
      totalCases: cases.length,
      cases: cases,
      isLoading,
      error,
      userId: currentUser?._id,
    });
  }, [cases, isLoading, error, currentUser?._id]);

  const filteredCases = cases
    .filter(
      (caseItem) =>
        (statusFilter === "all" || caseItem.status === statusFilter) &&
        (priorityFilter === "all" || caseItem.priority === priorityFilter) &&
        (caseItem.incident.incidentDescription
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
          caseItem.report._id.toString().includes(searchTerm))
    )
    .sort((a, b) => {
      const dateA = new Date(a.incident.dateTime).getTime();
      const dateB = new Date(b.incident.dateTime).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

  const getStatusBadge = (status: string) => {
    switch (status) {
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
        return (
          <Badge
            variant="outline"
            className="bg-purple-500/10 text-purple-500 hover:bg-purple-500/20 border-purple-500/20"
          >
            In Review
          </Badge>
        );
      case "completed":
      case "approved":
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

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return (
          <Badge
            variant="outline"
            className="bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 border-orange-500/20"
          >
            High
          </Badge>
        );
      case "medium":
        return (
          <Badge
            variant="outline"
            className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20"
          >
            Medium
          </Badge>
        );
      case "low":
        return (
          <Badge
            variant="outline"
            className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20"
          >
            Low
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Show loading state while fetching user
  if (userLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        <span className="ml-4 text-muted-foreground">
          Loading user information...
        </span>
      </div>
    );
  }

  // Show error if user is not authenticated
  if (!currentUser) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/investigator">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>

        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">My Cases</h1>
          <p className="text-muted-foreground">
            Manage and track your assigned investigation cases.
          </p>
        </div>

        <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <div>
                <h3 className="font-medium text-red-800 dark:text-red-200">
                  Authentication Required
                </h3>
                <p className="text-sm text-red-600 dark:text-red-300">
                  Please log in to view your assigned cases.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/investigator">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>

        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">My Cases</h1>
          <p className="text-muted-foreground">
            Manage and track your assigned investigation cases.
          </p>
        </div>

        <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <div>
                <h3 className="font-medium text-red-800 dark:text-red-200">
                  Error Loading Cases
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
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/investigator">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">My Cases</h1>
        <p className="text-muted-foreground">
          Manage and track your assigned investigation cases.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading
                ? "..."
                : cases.filter((c) => c.status === "in-progress").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently investigating
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading
                ? "..."
                : cases.filter((c) => c.status === "review").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Awaiting chief review
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading
                ? "..."
                : cases.filter((c) => c.priority === "high").length}
            </div>
            <p className="text-xs text-muted-foreground">Urgent cases</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading
                ? "..."
                : cases.filter((c) => c.report.status === ReportStatus.APPROVED)
                    .length}
            </div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Case Management</CardTitle>
          <CardDescription>
            View and manage all your assigned investigation cases.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="active">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="active">Active Cases</TabsTrigger>
              <TabsTrigger value="review">Pending Review</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="space-y-4 mt-4">
              <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search cases..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select
                  value={priorityFilter}
                  onValueChange={setPriorityFilter}
                >
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={() =>
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                  }
                >
                  <ArrowUpDown className="mr-2 h-4 w-4" />
                  {sortOrder === "asc" ? "Oldest First" : "Newest First"}
                </Button>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Case ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Incident Date</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <div className="flex items-center justify-center space-x-2">
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                            <span className="text-sm text-muted-foreground">
                              Loading cases...
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredCases
                        .filter((c) => c.status === "in-progress")
                        .map((caseItem) => (
                          <TableRow key={caseItem.report._id.toString()}>
                            <TableCell className="font-medium">
                              #{caseItem.report._id.toString().slice(-6)}
                            </TableCell>
                            <TableCell>{caseItem.report.title}</TableCell>
                            <TableCell>
                              {getPriorityBadge(caseItem.priority)}
                            </TableCell>
                            <TableCell>
                              {formatDate(caseItem.incident.dateTime)}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <div className="w-16 bg-muted rounded-full h-2">
                                  <div
                                    className={`h-2 rounded-full ${
                                      caseItem.report.status ===
                                      ReportStatus.SUBMITTED
                                        ? "bg-blue-500"
                                        : caseItem.report.status ===
                                          ReportStatus.DRAFT
                                        ? "bg-yellow-500"
                                        : caseItem.report.status ===
                                          ReportStatus.REJECTED
                                        ? "bg-red-500"
                                        : caseItem.report.status ===
                                          ReportStatus.APPROVED
                                        ? "bg-green-500"
                                        : caseItem.report.status ===
                                          ReportStatus.PUBLISHED
                                        ? "bg-green-500"
                                        : "bg-primary"
                                    }`}
                                    style={{
                                      width: `${
                                        caseItem.report.status ===
                                        ReportStatus.SUBMITTED
                                          ? "22.5"
                                          : caseItem.report.status ===
                                            ReportStatus.DRAFT
                                          ? "72.5"
                                          : caseItem.report.status ===
                                            ReportStatus.REJECTED
                                          ? "47.5"
                                          : caseItem.report.status ===
                                            ReportStatus.APPROVED
                                          ? "100"
                                          : caseItem.report.status ===
                                            ReportStatus.PUBLISHED
                                          ? "100"
                                          : caseItem.progress
                                      }%`,
                                    }}
                                  />
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  {caseItem.report.status ===
                                  ReportStatus.SUBMITTED
                                    ? "22.5"
                                    : caseItem.report.status ===
                                      ReportStatus.DRAFT
                                    ? "72.5"
                                    : caseItem.report.status ===
                                      ReportStatus.REJECTED
                                    ? "47.5"
                                    : caseItem.report.status ===
                                      ReportStatus.APPROVED
                                    ? "100"
                                    : caseItem.report.status ===
                                      ReportStatus.PUBLISHED
                                    ? "100"
                                    : caseItem.progress}
                                  %
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Button size="sm" variant="outline" asChild>
                                  <Link
                                    href={`/dashboard/investigator/cases/${caseItem.report._id}`}
                                  >
                                    <FileText className="h-4 w-4" />
                                  </Link>
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="review" className="space-y-4 mt-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Case ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Submitted Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <div className="flex items-center justify-center space-x-2">
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                            <span className="text-sm text-muted-foreground">
                              Loading cases...
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      cases
                        .filter((c) => c.status === "review")
                        .map((caseItem) => (
                          <TableRow key={caseItem.report._id.toString()}>
                            <TableCell className="font-medium">
                              #{caseItem.report._id.toString().slice(-6)}
                            </TableCell>
                            <TableCell>{caseItem.report.title}</TableCell>
                            <TableCell>
                              {getPriorityBadge(caseItem.priority)}
                            </TableCell>
                            <TableCell>
                              {formatDate(caseItem.incident.dateTime)}
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(caseItem.status)}
                            </TableCell>
                            <TableCell>
                              <Button size="sm" variant="outline" asChild>
                                <Link
                                  href={`/dashboard/investigator/cases/${caseItem.report._id}`}
                                >
                                  <FileText className="h-4 w-4" />
                                </Link>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="completed" className="space-y-4 mt-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Case ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Completed Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          <div className="flex items-center justify-center space-x-2">
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                            <span className="text-sm text-muted-foreground">
                              Loading cases...
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      cases
                        .filter(
                          (c) => c.report.status === ReportStatus.APPROVED
                        )
                        .map((caseItem) => (
                          <TableRow key={caseItem.report._id.toString()}>
                            <TableCell className="font-medium">
                              #{caseItem.report._id.toString().slice(-6)}
                            </TableCell>
                            <TableCell>{caseItem.report.title}</TableCell>
                            <TableCell>
                              {getPriorityBadge(caseItem.priority)}
                            </TableCell>
                            <TableCell>
                              {formatDate(caseItem.incident.dateTime)}
                            </TableCell>
                            <TableCell>
                              <Button size="sm" variant="outline" asChild>
                                <Link
                                  href={`/dashboard/investigator/cases/${caseItem.report._id}`}
                                >
                                  <FileText className="h-4 w-4" />
                                </Link>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
