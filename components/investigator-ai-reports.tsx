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
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const aiReports = [
  {
    id: "2023-047",
    title: "Multi-Vehicle Collision Analysis",
    date: "2024-01-15",
    time: "14:30",
    confidence: 94,
    status: "completed",
    priority: "high",
    vehicles: 3,
    people: 5,
    processingTime: "2.3s",
    type: "collision",
  },
  {
    id: "2023-046",
    title: "Pedestrian Incident Assessment",
    date: "2024-01-14",
    time: "09:15",
    confidence: 87,
    status: "completed",
    priority: "medium",
    vehicles: 1,
    people: 2,
    processingTime: "1.8s",
    type: "pedestrian",
  },
  {
    id: "2023-045",
    title: "Traffic Signal Malfunction Analysis",
    date: "2024-01-13",
    time: "16:45",
    confidence: 91,
    status: "processing",
    priority: "high",
    vehicles: 2,
    people: 3,
    processingTime: "3.1s",
    type: "signal",
  },
  {
    id: "2023-044",
    title: "Highway Merge Incident",
    date: "2024-01-12",
    time: "11:20",
    confidence: 89,
    status: "completed",
    priority: "low",
    vehicles: 4,
    people: 4,
    processingTime: "2.7s",
    type: "collision",
  },
  {
    id: "2023-043",
    title: "Intersection Safety Analysis",
    date: "2024-01-11",
    time: "08:30",
    confidence: 96,
    status: "reviewed",
    priority: "medium",
    vehicles: 2,
    people: 6,
    processingTime: "1.9s",
    type: "intersection",
  },
];

export function InvestigatorAIReports() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const filteredReports = aiReports.filter((report) => {
    const matchesSearch =
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.id.includes(searchTerm);
    const matchesStatus =
      statusFilter === "all" || report.status === statusFilter;
    const matchesPriority =
      priorityFilter === "all" || report.priority === priorityFilter;

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
      case "reviewed":
        return (
          <Badge className="bg-purple-500/10 text-purple-500 border-purple-500/20">
            <Eye className="h-3 w-3 mr-1" />
            Reviewed
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
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
    if (confidence >= 80) return "text-orange-500";
    return "text-red-500";
  };

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col space-y-2 w-full">
        <h1 className="text-3xl font-bold tracking-tight">
          AI Analysis Reports
        </h1>
        <p className="text-muted-foreground">
          Review and manage AI-generated incident analysis reports
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
            <p className="text-xs text-muted-foreground">+2 from last week</p>
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
              {aiReports.filter((r) => r.confidence >= 90).length}
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
              {aiReports.filter((r) => r.status === "processing").length}
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
            <p className="text-xs text-muted-foreground">Per incident</p>
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
                <SelectItem value="reviewed">Reviewed</SelectItem>
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

      {/* Reports List */}
      <Tabs defaultValue="grid" className="w-full">
        <TabsList>
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredReports.map((report) => (
              <Card
                key={report.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">#{report.id}</CardTitle>
                      <CardDescription className="font-medium">
                        {report.title}
                      </CardDescription>
                    </div>
                    {getPriorityBadge(report.priority)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    {getStatusBadge(report.status)}
                    <div
                      className={`text-sm font-medium ${getConfidenceColor(
                        report.confidence
                      )}`}
                    >
                      {report.confidence}% confidence
                    </div>
                  </div>

                  <Progress value={report.confidence} className="h-2" />

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Vehicles</p>
                      <p className="font-medium">{report.vehicles}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">People</p>
                      <p className="font-medium">{report.people}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {report.date}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {report.time}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1" asChild>
                      <Link
                        href={`/dashboard/investigator/ai-reports/${report.id}`}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Link>
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          <div className="space-y-4">
            {filteredReports.map((report) => (
              <Card
                key={report.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold">#{report.id}</h3>
                          {getPriorityBadge(report.priority)}
                          {getStatusBadge(report.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {report.title}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {report.date} at {report.time}
                          </span>
                          <span>
                            {report.vehicles} vehicles, {report.people} people
                          </span>
                          <span>Processed in {report.processingTime}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div
                          className={`text-sm font-medium ${getConfidenceColor(
                            report.confidence
                          )}`}
                        >
                          {report.confidence}% confidence
                        </div>
                        <Progress
                          value={report.confidence}
                          className="h-1 w-20 mt-1"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" asChild>
                          <Link
                            href={`/dashboard/investigator/ai-reports/${report.id}`}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Report
                          </Link>
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {filteredReports.length === 0 && (
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
