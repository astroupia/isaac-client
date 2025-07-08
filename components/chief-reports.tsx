"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ExportSuccessDialog } from "@/components/export-success-dialog"
import { ArrowLeft, Brain, Download, Eye, FileText, Filter, Search, User } from "lucide-react"
import Link from "next/link"
import { reportService } from "@/lib/api/reports"

export function ChiefReports() {
  const [reports, setReports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [exportDialog, setExportDialog] = useState<{
    open: boolean
    type: string
    fileName: string
  }>({
    open: false,
    type: "",
    fileName: "",
  })

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

  // Map backend report fields to UI fields
  const mappedReports = reports.map((report) => ({
    id: report._id || report.id,
    title: report.title,
    investigator: report.assignedTo?.firstName ? `${report.assignedTo.firstName} ${report.assignedTo.lastName}` : "Unassigned",
    status: report.status?.toLowerCase() || "pending",
    priority: report.priority?.toLowerCase() || "medium",
    submitted: report.submittedAt ? new Date(report.submittedAt).toLocaleDateString() : "-",
    aiConfidence: report.aiContribution || 0,
    type: report.type || "-",
  }))

  const filteredReports = mappedReports.filter((report) => {
    const matchesSearch =
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.investigator.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.id?.toString().includes(searchTerm)
    const matchesStatus = statusFilter === "all" || report.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleExport = (type: string) => {
    const fileName = `${type.toLowerCase()}_reports_${new Date().toISOString().split("T")[0]}.pdf`
    setExportDialog({
      open: true,
      type,
      fileName,
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 border-orange-500/20">
            Pending Review
          </Badge>
        )
      case "approved":
        return (
          <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20">Approved</Badge>
        )
      case "revision":
        return (
          <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20">Needs Revision</Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">High</Badge>
      case "medium":
        return (
          <Badge className="bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 border-orange-500/20">Medium</Badge>
        )
      case "low":
        return <Badge variant="outline">Low</Badge>
      default:
        return <Badge variant="outline">{priority}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/chief">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Report Management</h1>
        <p className="text-muted-foreground">Review, approve, and manage investigation reports from your team.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Awaiting your approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved This Week</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">+3 from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Needs Revision</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">Returned for updates</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Review Time</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.3h</div>
            <p className="text-xs text-muted-foreground">-0.5h from last week</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Investigation Reports</CardTitle>
              <CardDescription>Manage and review reports from your investigation team</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={() => handleExport("All Reports")}>
                <Download className="mr-2 h-4 w-4" />
                Export All
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search reports, investigators, or IDs..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="revision">Needs Revision</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Tabs defaultValue="list" className="space-y-4">
            <TabsList>
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="grid">Grid View</TabsTrigger>
            </TabsList>

            <TabsContent value="list" className="space-y-4">
              {loading ? (
                <div className="p-8 text-center text-muted-foreground">Loading reports...</div>
              ) : error ? (
                <div className="p-8 text-center text-red-500">{error}</div>
              ) : (
                filteredReports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center space-x-3">
                        <h4 className="font-medium">
                          #{report.id} - {report.title}
                        </h4>
                        {getStatusBadge(report.status)}
                        {getPriorityBadge(report.priority)}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <User className="h-3 w-3" />
                          <span>{report.investigator}</span>
                        </div>
                        <span>•</span>
                        <span>{report.type}</span>
                        <span>•</span>
                        <span>Submitted {report.submitted}</span>
                        <span>•</span>
                        <div className="flex items-center space-x-1">
                          <Brain className="h-3 w-3" />
                          <span>AI Confidence: {report.aiConfidence}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/dashboard/chief/reports/${report.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          Review
                        </Link>
                      </Button>
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/dashboard/chief/ai-insights/${report.id}`}>
                          <Brain className="mr-2 h-4 w-4" />
                          AI Analysis
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </TabsContent>

            <TabsContent value="grid" className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {loading ? (
                <div className="p-8 text-center text-muted-foreground">Loading reports...</div>
              ) : error ? (
                <div className="p-8 text-center text-red-500">{error}</div>
              ) : (
                filteredReports.map((report) => (
                  <Card key={report.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-base">#{report.id}</CardTitle>
                          <CardDescription className="text-sm">{report.title}</CardDescription>
                        </div>
                        {getPriorityBadge(report.priority)}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        {getStatusBadge(report.status)}
                        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                          <Brain className="h-3 w-3" />
                          <span>{report.aiConfidence}%</span>
                        </div>
                      </div>
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <User className="h-3 w-3" />
                          <span>{report.investigator}</span>
                        </div>
                        <p>Submitted {report.submitted}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" className="flex-1" asChild>
                          <Link href={`/dashboard/chief/reports/${report.id}`}>
                            <Eye className="mr-1 h-3 w-3" />
                            Review
                          </Link>
                        </Button>
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/dashboard/chief/ai-insights/${report.id}`}>
                            <Brain className="h-3 w-3" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <ExportSuccessDialog
        open={exportDialog.open}
        onOpenChange={(open) => setExportDialog((prev) => ({ ...prev, open }))}
        exportType={exportDialog.type}
        fileName={exportDialog.fileName}
      />
    </div>
  )
}
