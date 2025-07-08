"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowUpDown, Brain, Download, FileText, Search } from "lucide-react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { reportService } from "@/lib/api/reports"

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
        setReports(data)
        setLoading(false)
      })
      .catch((err) => {
        setError("Failed to load reports.")
        setLoading(false)
      })
  }, [])

  const filteredReports = reports
    .filter(
      (report) =>
        (statusFilter === "all" || report.status === statusFilter) &&
        (report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (report._id || report.id)?.toString().includes(searchTerm) ||
          (report.investigator?.toLowerCase?.() || "").includes(searchTerm.toLowerCase())),
    )
    .sort((a, b) => {
      const dateA = new Date(a.date || a.createdAt).getTime()
      const dateB = new Date(b.date || b.createdAt).getTime()
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA
    })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 border-orange-500/20"
          >
            Pending
          </Badge>
        )
      case "in-progress":
        return (
          <Badge variant="outline" className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20">
            In Progress
          </Badge>
        )
      case "review":
        return (
          <Badge
            variant="outline"
            className="bg-purple-500/10 text-purple-500 hover:bg-purple-500/20 border-purple-500/20"
          >
            In Review
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20">
            Completed
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getConfidenceBadge = (confidence: string) => {
    switch (confidence) {
      case "high":
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20">
            High
          </Badge>
        )
      case "medium":
        return (
          <Badge
            variant="outline"
            className="bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 border-orange-500/20"
          >
            Medium
          </Badge>
        )
      case "low":
        return (
          <Badge variant="outline" className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20">
            Low
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/dashboard/${role}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Report Center</h1>
        <p className="text-muted-foreground">Centralized repository of all incident reports and their statuses.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Report Management</CardTitle>
          <CardDescription>View, filter, and manage all incident reports in the system.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search reports..."
                  className="pl-8"
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
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="review">In Review</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
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

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Investigator</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>AI Confidence</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                {loading ? (
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 flex items-center justify-center text-muted-foreground">Loading reports...</TableCell>
                    </TableRow>
                  </TableBody>
                ) : error ? (
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 flex items-center justify-center text-red-500">{error}</TableCell>
                    </TableRow>
                  </TableBody>
                ) : (
                  <TableBody>
                    {filteredReports.length > 0 ? (
                      filteredReports.map((report) => (
                        <TableRow key={report._id || report.id}>
                          <TableCell className="font-medium">#{report._id || report.id}</TableCell>
                          <TableCell>{report.title}</TableCell>
                          <TableCell>{report.date || (report.createdAt ? new Date(report.createdAt).toLocaleDateString() : "-")}</TableCell>
                          <TableCell>{report.investigator || (report.assignedTo?.firstName ? `${report.assignedTo.firstName} ${report.assignedTo.lastName}` : "Unassigned")}</TableCell>
                          <TableCell>{getStatusBadge(report.status)}</TableCell>
                          <TableCell>{getConfidenceBadge(report.aiConfidence || report.aiContribution || "low")}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button size="sm" variant="outline" asChild>
                                <Link href={`/dashboard/${role}/reports/${report._id || report.id}`}>
                                  <span className="sr-only">View</span>
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                </Link>
                              </Button>
                              <Button size="sm" variant="outline" asChild>
                                <Link href={`/dashboard/${role}/reports/${report._id || report.id}`}>
                                  <FileText className="h-4 w-4" />
                                </Link>
                              </Button>
                              <Button size="sm" variant="outline" asChild>
                                <Link href={`/dashboard/${role}/ai-insights/${report._id || report.id}`}>
                                  <Brain className="h-4 w-4" />
                                </Link>
                              </Button>
                              <Button size="sm" variant="outline">
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          No reports found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                )}
              </Table>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {filteredReports.length} of {reports.length} reports
              </p>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Next
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
