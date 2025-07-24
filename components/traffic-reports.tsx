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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  ArrowUpDown,
  Download,
  Edit,
  Eye,
  Search,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Calendar,
  User,
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
import { reportService } from "@/lib/api/reports";
import { ReportStatus, ReportPriority } from "@/types/report";


export function TrafficReports() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    async function fetchUserAndReports() {
      setLoading(true);
      setError(null);
      try {
        // Fetch current user
        const userResponse = await fetch("/api/auth/me");
        const userData = await userResponse.json();
        setCurrentUser(userData);

        // Fetch all reports
        const allReports = await reportService.getAllReports();

        // Filter reports to show only the current user's reports
        const userReports = allReports.filter((report: any) => {
          const reportCreatedBy =
            report.createdBy?._id || report.createdBy?.id || report.createdBy;
          const userId = userData._id || userData.id;
          return reportCreatedBy === userId;
        });

        // Map reports with proper data structure
        const mappedReports = userReports.map((report: any) => ({
          ...report,
          id: report._id || report.id,
          status: report.status || "Draft",
          priority: report.priority || "Medium Priority",
          formattedDate: formatDate(report.createdAt || report.date),
          type: report.type || "Incident",
        }));

        setReports(mappedReports);
      } catch (err: any) {
        console.error("Error fetching reports:", err);
        setError("Failed to load reports");
      } finally {
        setLoading(false);
      }
    }
    fetchUserAndReports();
  }, []);

  const formatDate = (date: string | Date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredReports = reports
    .filter(
      (report) =>
        (statusFilter === "all" ||
          report.status.toLowerCase() === statusFilter.toLowerCase()) &&
        (report.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.id?.toString().includes(searchTerm) ||
          report.type?.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      const dateA = new Date(a.createdAt || a.date).getTime();
      const dateB = new Date(b.createdAt || b.date).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "draft":
        return (
          <Badge
            variant="outline"
            className="bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600"
          >
            <Clock className="w-3 h-3 mr-1" />
            Draft
          </Badge>
        );
      case "submitted":
        return (
          <Badge
            variant="outline"
            className="bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-700"
          >
            <FileText className="w-3 h-3 mr-1" />
            Submitted
          </Badge>
        );
      case "approved":
        return (
          <Badge
            variant="outline"
            className="bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-700"
          >
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge
            variant="outline"
            className="bg-red-100 text-red-700 border-red-300 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700"
          >
            <AlertCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      case "needs review":
        return (
          <Badge
            variant="outline"
            className="bg-orange-100 text-orange-700 border-orange-300 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-700"
          >
            <AlertCircle className="w-3 h-3 mr-1" />
            Needs Review
          </Badge>
        );
      default:
        return (
          <Badge
            variant="outline"
            className="bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600"
          >
            {status || "Unknown"}
          </Badge>
        );
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case "high priority":
        return (
          <Badge
            variant="outline"
            className="bg-red-100 text-red-700 border-red-300 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700"
          >
            High
          </Badge>
        );
      case "medium priority":
        return (
          <Badge
            variant="outline"
            className="bg-orange-100 text-orange-700 border-orange-300 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-700"
          >
            Medium
          </Badge>
        );
      case "low priority":
        return (
          <Badge
            variant="outline"
            className="bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-700"
          >
            Low
          </Badge>
        );
      default:
        return (
          <Badge
            variant="outline"
            className="bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600"
          >
            Medium
          </Badge>
        );
    }
  };

  const stats = {
    total: reports.length,
    draft: reports.filter((r) => r.status?.toLowerCase() === "draft").length,
    submitted: reports.filter((r) => r.status?.toLowerCase() === "submitted")
      .length,
    completed: reports.filter((r) =>
      ["approved", "completed"].includes(r.status?.toLowerCase())
    ).length,
  };

  // Download JSON handler
  const handleDownload = (report: any) => {
    const json = JSON.stringify(report, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const filename = `report-${report.id || report._id || "incident"}.json`;
    // @ts-ignore: msSaveOrOpenBlob is for IE
    if (
      typeof window !== "undefined" &&
      (window.navigator as any).msSaveOrOpenBlob
    ) {
      // @ts-ignore
      (window.navigator as any).msSaveOrOpenBlob(blob, filename);
    } else {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 0);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/traffic">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Reports</h1>
            <p className="text-muted-foreground">
              Manage and track your incident reports and their completion
              status.
            </p>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.draft}</div>
            <p className="text-xs text-muted-foreground">In progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Submitted</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.submitted}</div>
            <p className="text-xs text-muted-foreground">Pending review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
            <p className="text-xs text-muted-foreground">Approved</p>
          </CardContent>
        </Card>
      </div>

      {/* Reports Table */}
      {loading ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-slate-500 dark:text-slate-400">
                Loading your reports...
              </p>
            </div>
          </CardContent>
        </Card>
      ) : error ? (
        <Card className="border-red-200 dark:border-red-800 bg-red-100 dark:bg-red-800/30">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-600 dark:text-red-400 mx-auto mb-4" />
            <p className="text-red-700 dark:text-red-300 font-semibold text-xl">
              Failed to Load Reports
            </p>
            <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm">
              {error}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Report Management</span>
            </CardTitle>
            <CardDescription>
              View and manage all your incident reports. Showing{" "}
              {filteredReports.length} of {reports.length} reports.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col space-y-4 mb-6">
              <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search by title, ID, or type..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="submitted">Submitted</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="needs review">Needs Review</SelectItem>
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
            </div>

            {/* Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 dark:bg-slate-800/50">
                    <TableHead className="font-semibold text-slate-900 dark:text-slate-100">
                      Title
                    </TableHead>
                    <TableHead className="font-semibold text-slate-900 dark:text-slate-100">
                      Type
                    </TableHead>
                    <TableHead className="font-semibold text-slate-900 dark:text-slate-100">
                      Created
                    </TableHead>
                    <TableHead className="font-semibold text-slate-900 dark:text-slate-100">
                      Status
                    </TableHead>
                    <TableHead className="font-semibold text-slate-900 dark:text-slate-100">
                      Priority
                    </TableHead>
                    <TableHead className="font-semibold text-right text-slate-900 dark:text-slate-100">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReports.length > 0 ? (
                    filteredReports.map((report) => (
                      <TableRow
                        key={report.id}
                        className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-200"
                      >
                        <TableCell>
                          <div className="max-w-[200px]">
                            <p className="font-medium truncate text-slate-900 dark:text-slate-100">
                              {report.title}
                            </p>
                            {report.content?.incidentDetails
                              ?.incidentLocation && (
                              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                {
                                  report.content.incidentDetails
                                    .incidentLocation
                                }
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className="text-xs bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                          >
                            {report.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-3 w-3 text-slate-500 dark:text-slate-400" />
                            <span className="text-sm text-slate-700 dark:text-slate-300">
                              {report.formattedDate}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(report.status)}</TableCell>
                        <TableCell>
                          {getPriorityBadge(report.priority)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button size="sm" variant="outline" asChild>
                              <Link
                                href={`/dashboard/traffic/reports/${report.id}`}
                              >
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                            {report.status?.toLowerCase() !== "approved" && (
                              <Button size="sm" variant="outline" asChild>
                                <Link
                                  href={`/dashboard/traffic/reports/${report.id}?mode=edit`}
                                >
                                  <Edit className="h-4 w-4" />
                                </Link>
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDownload(report)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        <div className="flex flex-col items-center space-y-2">
                          <FileText className="h-8 w-8 text-slate-500 dark:text-slate-400" />
                          <p className="text-slate-500 dark:text-slate-400">
                            No reports found.
                          </p>
                          <Button asChild size="sm">
                            <Link href="/dashboard/traffic/new-incident">
                              Create your first report
                            </Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
