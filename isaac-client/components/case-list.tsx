import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Brain, FileText } from "lucide-react"
import Link from "next/link"

export function CaseList() {
  const cases = [
    {
      id: "2023-045",
      title: "Vehicle Collision - Highway 101",
      priority: "high",
      status: "in-progress",
      aiStatus: "ready",
      date: "Today, 10:30 AM",
    },
    {
      id: "2023-044",
      title: "Traffic Incident - Downtown",
      priority: "medium",
      status: "in-progress",
      aiStatus: "ready",
      date: "Yesterday",
    },
    {
      id: "2023-043",
      title: "Multi-vehicle Accident - Bridge",
      priority: "high",
      status: "review",
      aiStatus: "ready",
      date: "2 days ago",
    },
    {
      id: "2023-042",
      title: "Pedestrian Incident - Main St",
      priority: "low",
      status: "in-progress",
      aiStatus: "processing",
      date: "3 days ago",
    },
    {
      id: "2023-041",
      title: "Vehicle Rollover - Highway 280",
      priority: "medium",
      status: "in-progress",
      aiStatus: "processing",
      date: "4 days ago",
    },
  ]

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

  return (
    <div className="space-y-4">
      {cases.map((caseItem) => (
        <div key={caseItem.id} className="flex flex-col space-y-2 p-3 border rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h4 className="text-sm font-medium">#{caseItem.id}</h4>
              {getPriorityBadge(caseItem.priority)}
            </div>
            {getStatusBadge(caseItem.status)}
          </div>
          <p className="text-sm font-medium">{caseItem.title}</p>
          <p className="text-xs text-muted-foreground">Assigned: {caseItem.date}</p>
          <div className="flex items-center space-x-2 pt-1">
            <Button size="sm" variant="outline" className="flex-1" asChild>
              <Link href={`/dashboard/investigator/cases/${caseItem.id}`}>
                <FileText className="mr-2 h-4 w-4" />
                View Case
              </Link>
            </Button>
            <Button
              size="sm"
              variant={caseItem.aiStatus === "ready" ? "default" : "outline"}
              className={`flex-1 ${caseItem.aiStatus === "ready" ? "" : "opacity-50"}`}
              disabled={caseItem.aiStatus !== "ready"}
              asChild={caseItem.aiStatus === "ready"}
            >
              {caseItem.aiStatus === "ready" ? (
                <Link href={`/dashboard/investigator/ai-reports/${caseItem.id}`}>
                  <Brain className="mr-2 h-4 w-4" />
                  AI Report
                </Link>
              ) : (
                <>
                  <Brain className="mr-2 h-4 w-4" />
                  Processing
                </>
              )}
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
