import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, FileText, Loader2 } from "lucide-react";
import Link from "next/link";
import { IIncident } from "@/app/types/incident";
import { IReport } from "@/app/types/report";

interface CaseListProps {
  incidents?: IIncident[];
  reports?: IReport[];
  isLoading?: boolean;
  maxItems?: number;
}

export function CaseList({
  incidents = [],
  reports = [],
  isLoading = false,
  maxItems = 5,
}: CaseListProps) {
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
      case "major":
      case "critical":
        return (
          <Badge
            variant="outline"
            className="bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 border-orange-500/20"
          >
            High
          </Badge>
        );
      case "medium":
      case "moderate":
        return (
          <Badge
            variant="outline"
            className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20"
          >
            Medium
          </Badge>
        );
      case "low":
      case "minor":
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in-progress":
      case "draft":
        return (
          <Badge
            variant="outline"
            className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20"
          >
            In Progress
          </Badge>
        );
      case "review":
      case "submitted":
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
      case "published":
        return (
          <Badge
            variant="outline"
            className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20"
          >
            Completed
          </Badge>
        );
      case "rejected":
        return (
          <Badge
            variant="outline"
            className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20"
          >
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  // Process incidents and reports to create case items
  const processCases = () => {
    const caseItems: Array<{
      id: string;
      title: string;
      priority: string;
      status: string;
      aiStatus: string;
      date: string;
      type: "incident" | "report";
      incident: IIncident | null;
      report: IReport | null;
    }> = [];

    // Add incidents as cases
    incidents.slice(0, maxItems).forEach((incident) => {
      const relatedReport = reports.find(
        (report) => report.incidentId?.toString() === incident._id?.toString()
      );

      caseItems.push({
        id: incident._id?.toString() || "unknown",
        title: incident.incidentDescription || "Untitled Incident",
        priority: incident.incidentSeverity || "moderate",
        status: relatedReport?.status || "in-progress",
        aiStatus:
          relatedReport?.aiContribution && relatedReport.aiContribution > 0
            ? "ready"
            : "processing",
        date: new Date(incident.dateTime).toLocaleDateString(),
        type: "incident" as const,
        incident,
        report: relatedReport || null,
      });
    });

    // Add reports that don't have corresponding incidents
    const processedIncidentIds = new Set(
      incidents.map((i) => i._id?.toString())
    );
    reports
      .filter(
        (report) => !processedIncidentIds.has(report.incidentId?.toString())
      )
      .slice(0, maxItems - caseItems.length)
      .forEach((report) => {
        caseItems.push({
          id: report._id?.toString() || "unknown",
          title: report.title || "Untitled Report",
          priority: "medium",
          status: report.status || "in-progress",
          aiStatus:
            report.aiContribution && report.aiContribution > 0
              ? "ready"
              : "processing",
          date: new Date(
            report.createdAt || report.updatedAt
          ).toLocaleDateString(),
          type: "report" as const,
          incident: null,
          report,
        });
      });

    return caseItems.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  };

  const caseItems = processCases();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="flex flex-col space-y-2 p-3 border rounded-lg animate-pulse"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="h-4 w-16 bg-muted rounded"></div>
                <div className="h-5 w-12 bg-muted rounded"></div>
              </div>
              <div className="h-5 w-20 bg-muted rounded"></div>
            </div>
            <div className="h-4 w-48 bg-muted rounded"></div>
            <div className="h-3 w-32 bg-muted rounded"></div>
            <div className="flex items-center space-x-2 pt-1">
              <div className="h-8 flex-1 bg-muted rounded"></div>
              <div className="h-8 flex-1 bg-muted rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (caseItems.length === 0) {
    return (
      <div className="text-center py-8">
        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground text-lg">No cases assigned</p>
        <p className="text-sm text-muted-foreground mt-2">
          You don't have any assigned cases at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {caseItems.map((caseItem) => (
        <div
          key={caseItem.id}
          className="flex flex-col space-y-2 p-3 border rounded-lg"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h4 className="text-sm font-medium">#{caseItem.id}</h4>
              {getPriorityBadge(caseItem.priority)}
            </div>
            {getStatusBadge(caseItem.status)}
          </div>
          <p className="text-sm font-medium">{caseItem.title}</p>
          <p className="text-xs text-muted-foreground">
            Assigned: {caseItem.date}
          </p>
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
              className={`flex-1 ${
                caseItem.aiStatus === "ready" ? "" : "opacity-50"
              }`}
              disabled={caseItem.aiStatus !== "ready"}
              asChild={caseItem.aiStatus === "ready"}
            >
              {caseItem.aiStatus === "ready" ? (
                <Link
                  href={`/dashboard/investigator/ai-reports/${caseItem.id}`}
                >
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
  );
}
