"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  ArrowLeft, 
  ArrowUpDown, 
  Brain, 
  Download, 
  FileText, 
  Search, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Calendar,
  User,
  MapPin,
  TrendingUp,
  Eye,
  Edit
} from "lucide-react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { reportService } from "@/lib/api/reports"
import { ReportStatus, ReportPriority } from "@/types/report"

interface ReportCenterProps {
  role: string
}

export function ReportCenter({ role }: ReportCenterProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [reports, setReports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    reportService.getAllReports()
      .then((data) => {
        // Map reports with proper data structure
        const mappedReports = data.map((report: any) => ({
          ...report,
          id: report._id || report.id,
          status: report.status || 'Draft',
          priority: report.priority || 'Medium Priority',
          completionPercentage: calculateCompletionPercentage(report),
          formattedDate: formatDate(report.createdAt || report.date),
          type: report.type || 'Incident',
          creatorName: getCreatorName(report),
          location: getLocation(report)
        }))
        setReports(mappedReports)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching reports:", err)
        setError("Failed to load reports.")
        setLoading(false)
      })
  }, [])

  const calculateCompletionPercentage = (report: any) => {
    if (report.status === 'Completed' || report.status === 'Approved') return 100
    if (report.status === 'Submitted') return 80
    if (report.status === 'In Progress') return 60
    if (report.status === 'Draft') return 30
    return 0
  }

  const formatDate = (date: string | Date) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getCreatorName = (report: any) => {
    if (report.createdBy?.firstName && report.createdBy?.lastName) {
      return `${report.createdBy.firstName} ${report.createdBy.lastName}`
    }
    if (report.createdBy?.email) {
      return report.createdBy.email
    }
    return 'Unknown'
  }

  const getLocation = (report: any) => {
    return report.content?.incidentDetails?.incidentLocation || 'N/A'
  }

  const filteredReports = reports
    .filter(
      (report) =>
        (statusFilter === "all" || report.status.toLowerCase() === statusFilter.toLowerCase()) &&
        (report.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.id?.toString().includes(searchTerm) ||
          report.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.creatorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.location?.toLowerCase().includes(searchTerm.toLowerCase())),
    )
    .sort((a, b) => {
      const dateA = new Date(a.createdAt || a.date).getTime()
      const dateB = new Date(b.createdAt || b.date).getTime()
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA
    })

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "draft":
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-300">
            <Clock className="w-3 h-3 mr-1" />
            Draft
          </Badge>
        )
      case "submitted":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">
            <FileText className="w-3 h-3 mr-1" />
            Submitted
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-700 border-red-300">
            <AlertCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        )
      case "needs review":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-300">
            <AlertCircle className="w-3 h-3 mr-1" />
            Needs Review
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-300">
            {status || 'Unknown'}
          </Badge>
        )
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case "high priority":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-700 border-red-300">
            High
          </Badge>
        )
      case "medium priority":
        return (
          <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-300">
            Medium
          </Badge>
        )
      case "low priority":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
            Low
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-300">
            Medium
          </Badge>
        )
    }
  }

  const getConfidenceBadge = (confidence: string | number) => {
    if (typeof confidence === 'string') {
      const conf = confidence.toLowerCase()
      if (conf === "high") {
        return (
          <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
            High
          </Badge>
        )
      } else if (conf === "medium") {
        return (
          <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-300">
            Medium
          </Badge>
        )
      } else {
        return (
          <Badge variant="outline" className="bg-red-100 text-red-700 border-red-300">
            Low
          </Badge>
        )
      }
    } else {
      // confidence is a number
      if (confidence >= 80) {
        return (
          <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
            High
          </Badge>
        )
      } else if (confidence >= 50) {
        return (
          <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-300">
            Medium
          </Badge>
        )
      } else {
        return (
          <Badge variant="outline" className="bg-red-100 text-red-700 border-red-300">
            Low
          </Badge>
        )
      }
    }
  }

  const stats = {
    total: reports.length,
    draft: reports.filter(r => r.status?.toLowerCase() === 'draft').length,
    submitted: reports.filter(r => r.status?.toLowerCase() === 'submitted').length,
    approved: reports.filter(r => r.status?.toLowerCase() === 'approved').length,
    needsReview: reports.filter(r => r.status?.toLowerCase() === 'needs review').length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/dashboard/${role}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Report Center</h1>
            <p className="text-muted-foreground">
              Centralized repository of all incident reports and their statuses.
            </p>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All reports</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.draft}</div>
            <p className="text-xs text-muted-foreground">In progress</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Submitted</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.submitted}</div>
            <p className="text-xs text-muted-foreground">Pending review</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Needs Review</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.needsReview}</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approved}</div>
            <p className="text-xs text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Reports Table */}
      {loading ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground">Loading reports...</p>
            </div>
          </CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <AlertCircle className="h-8 w-8 text-red-500 mx-auto" />
              <p className="text-red-500">{error}</p>
            </div>
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
              View and manage all incident reports. Showing {filteredReports.length} of {reports.length} reports.
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
                    placeholder="Search by title, ID, type, creator, or location..."
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
                  onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
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
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">Title</TableHead>
                    <TableHead className="font-semibold">Creator</TableHead>
                    <TableHead className="font-semibold">Location</TableHead>
                    <TableHead className="font-semibold">Type</TableHead>
                    <TableHead className="font-semibold">Created</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Priority</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReports.length > 0 ? (
                    filteredReports.map((report) => (
                      <TableRow key={report.id} className="hover:bg-muted/30 transition-colors">
                        <TableCell>
                          <div className="max-w-[200px]">
                            <p className="font-medium truncate">{report.title}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <User className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm truncate max-w-[120px]">{report.creatorName}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm truncate max-w-[120px]">{report.location}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-xs">
                            {report.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">{report.formattedDate}</span>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(report.status)}</TableCell>
                        <TableCell>{getPriorityBadge(report.priority)}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        <div className="flex flex-col items-center space-y-2">
                          <FileText className="h-8 w-8 text-muted-foreground" />
                          <p className="text-muted-foreground">No reports found.</p>
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
  )
}
