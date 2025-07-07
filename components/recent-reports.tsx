import { Badge } from "@/components/ui/badge"

interface RecentReport {
  id: string;
  title: string;
  status: string;
  date: string;
  incidentId?: string;
}

interface RecentReportsProps {
  reports?: RecentReport[];
}

export function RecentReports({ reports = [] }: RecentReportsProps) {
  // Fallback to static data if no reports provided
  const displayReports = reports.length > 0 ? reports : [
    {
      id: "2023-045",
      title: "Vehicle Collision - Highway 101",
      status: "pending",
      date: "Today, 10:30 AM",
    },
    {
      id: "2023-044",
      title: "Traffic Incident - Downtown",
      status: "completed",
      date: "Yesterday",
    },
    {
      id: "2023-043",
      title: "Multi-vehicle Accident - Bridge",
      status: "review",
      date: "2 days ago",
    },
    {
      id: "2023-042",
      title: "Pedestrian Incident - Main St",
      status: "completed",
      date: "3 days ago",
    },
  ];

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
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20">
            Completed
          </Badge>
        )
      case "review":
        return (
          <Badge variant="outline" className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20">
            In Review
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <div className="space-y-4">
      {displayReports.map((report) => (
        <div key={report.id} className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">{report.title}</p>
            <p className="text-xs text-muted-foreground">
              #{report.id} • {report.date}
            </p>
          </div>
          {getStatusBadge(report.status)}
        </div>
      ))}
    </div>
  )
}
