"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, ArrowUpDown, Brain, FileText, Search } from "lucide-react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function InvestigatorCases() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  const cases = [
    {
      id: "2023-047",
      title: "Vehicle Collision - Highway 101",
      status: "in-progress",
      priority: "high",
      assignedDate: "April 24, 2025",
      dueDate: "April 30, 2025",
      aiStatus: "ready",
      progress: 65,
    },
    {
      id: "2023-046",
      title: "Pedestrian Incident - Oak St",
      status: "in-progress",
      priority: "medium",
      assignedDate: "April 23, 2025",
      dueDate: "May 1, 2025",
      aiStatus: "ready",
      progress: 40,
    },
    {
      id: "2023-045",
      title: "Traffic Signal Malfunction",
      status: "review",
      priority: "high",
      assignedDate: "April 22, 2025",
      dueDate: "April 28, 2025",
      aiStatus: "ready",
      progress: 95,
    },
    {
      id: "2023-044",
      title: "Multi-vehicle Accident - Bridge",
      status: "in-progress",
      priority: "high",
      assignedDate: "April 21, 2025",
      dueDate: "April 27, 2025",
      aiStatus: "ready",
      progress: 75,
    },
    {
      id: "2023-043",
      title: "Vehicle Rollover - Highway 280",
      status: "completed",
      priority: "medium",
      assignedDate: "April 18, 2025",
      dueDate: "April 25, 2025",
      aiStatus: "ready",
      progress: 100,
    },
  ]

  const filteredCases = cases
    .filter(
      (caseItem) =>
        (statusFilter === "all" || caseItem.status === statusFilter) &&
        (priorityFilter === "all" || caseItem.priority === priorityFilter) &&
        (caseItem.title.toLowerCase().includes(searchTerm.toLowerCase()) || caseItem.id.includes(searchTerm)),
    )
    .sort((a, b) => {
      const dateA = new Date(a.assignedDate).getTime()
      const dateB = new Date(b.assignedDate).getTime()
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA
    })

  const getStatusBadge = (status: string) => {
    switch (status) {
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
        )
      case "medium":
        return (
          <Badge variant="outline" className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20">
            Medium
          </Badge>
        )
      case "low":
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20">
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
          <Link href="/dashboard/investigator">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">My Cases</h1>
        <p className="text-muted-foreground">Manage and track your assigned investigation cases.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cases.filter((c) => c.status === "in-progress").length}</div>
            <p className="text-xs text-muted-foreground">Currently investigating</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cases.filter((c) => c.status === "review").length}</div>
            <p className="text-xs text-muted-foreground">Awaiting chief review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cases.filter((c) => c.priority === "high").length}</div>
            <p className="text-xs text-muted-foreground">Urgent cases</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cases.filter((c) => c.status === "completed").length}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Case Management</CardTitle>
          <CardDescription>View and manage all your assigned investigation cases.</CardDescription>
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
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
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
                      <TableHead>Case ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Assigned Date</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCases
                      .filter((c) => c.status === "in-progress")
                      .map((caseItem) => (
                        <TableRow key={caseItem.id}>
                          <TableCell className="font-medium">#{caseItem.id}</TableCell>
                          <TableCell>{caseItem.title}</TableCell>
                          <TableCell>{getPriorityBadge(caseItem.priority)}</TableCell>
                          <TableCell>{caseItem.assignedDate}</TableCell>
                          <TableCell>{caseItem.dueDate}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <div className="w-16 bg-muted rounded-full h-2">
                                <div
                                  className="bg-primary h-2 rounded-full"
                                  style={{ width: `${caseItem.progress}%` }}
                                />
                              </div>
                              <span className="text-xs text-muted-foreground">{caseItem.progress}%</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button size="sm" variant="outline" asChild>
                                <Link href={`/dashboard/investigator/cases/${caseItem.id}`}>
                                  <FileText className="h-4 w-4" />
                                </Link>
                              </Button>
                              <Button size="sm" variant="outline" asChild>
                                <Link href={`/dashboard/investigator/ai-reports/${caseItem.id}`}>
                                  <Brain className="h-4 w-4" />
                                </Link>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
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
                    {cases
                      .filter((c) => c.status === "review")
                      .map((caseItem) => (
                        <TableRow key={caseItem.id}>
                          <TableCell className="font-medium">#{caseItem.id}</TableCell>
                          <TableCell>{caseItem.title}</TableCell>
                          <TableCell>{getPriorityBadge(caseItem.priority)}</TableCell>
                          <TableCell>{caseItem.assignedDate}</TableCell>
                          <TableCell>{getStatusBadge(caseItem.status)}</TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline" asChild>
                              <Link href={`/dashboard/investigator/cases/${caseItem.id}`}>
                                <FileText className="h-4 w-4" />
                              </Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
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
                    {cases
                      .filter((c) => c.status === "completed")
                      .map((caseItem) => (
                        <TableRow key={caseItem.id}>
                          <TableCell className="font-medium">#{caseItem.id}</TableCell>
                          <TableCell>{caseItem.title}</TableCell>
                          <TableCell>{getPriorityBadge(caseItem.priority)}</TableCell>
                          <TableCell>{caseItem.assignedDate}</TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline" asChild>
                              <Link href={`/dashboard/investigator/cases/${caseItem.id}`}>
                                <FileText className="h-4 w-4" />
                              </Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
