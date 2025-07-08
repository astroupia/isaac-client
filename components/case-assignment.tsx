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
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, ArrowRight, User, UserCheck } from "lucide-react";
import Link from "next/link";
import { userService } from "@/lib/api/users";
import { reportService } from "@/lib/api/reports";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export function CaseAssignment() {
  const { toast } = useToast();
  const [selectedInvestigator, setSelectedInvestigator] = useState<string>("");
  const [investigators, setInvestigators] = useState<any[]>([]);
  const [unassignedCases, setUnassignedCases] = useState<any[]>([]);

  useEffect(() => {
    // Fetch investigators using the new userService method
    userService.getUsersByRole('investigator').then((data) => {
      setInvestigators(data as any[]);
    });
    // Fetch unassigned reports
    reportService.getAllReports().then((reports: any[]) => {
      // Filter for unassigned reports (assignedTo is null/undefined)
      const unassigned = reports.filter((r) => !r.assignedTo);
      setUnassignedCases(unassigned);
    });
  }, []);

  const handleAssignCase = async (caseId: string, investigatorId: string) => {
    if (!investigatorId) {
      toast({
        title: "No investigator selected",
        description: "Please select an investigator before assigning the case.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Assign the investigator to the report
      await reportService.updateReport(caseId, { assignedTo: investigatorId });
      // Remove the assigned case from the UI
      setUnassignedCases((prev) => prev.filter((c) => c._id !== caseId));
      // Update investigator caseload in backend and UI
      const investigator = investigators.find((inv) => (inv._id || inv.id) === investigatorId);
      if (investigator) {
        const newCaseload = (investigator.currentCaseload ?? 0) + 1;
        await userService.updateUser(investigatorId, { currentCaseload: newCaseload });
        setInvestigators((prev) => prev.map((inv) =>
          (inv._id || inv.id) === investigatorId ? { ...inv, currentCaseload: newCaseload } : inv
        ));
      }
      toast({
        title: "Case assigned successfully",
        description: `Case #${caseId} has been assigned to ${investigator?.name || investigatorId}.`,
      });
    } catch (error) {
      toast({
        title: "Assignment failed",
        description: "There was an error assigning the case. Please try again.",
        variant: "destructive",
      });
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return (
          <Badge
            variant="outline"
            className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20"
          >
            Available
          </Badge>
        );
      case "busy":
        return (
          <Badge
            variant="outline"
            className="bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 border-orange-500/20"
          >
            Busy
          </Badge>
        );
      case "overloaded":
        return (
          <Badge
            variant="outline"
            className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20"
          >
            Overloaded
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  // When mapping investigators, ensure all fields are present and fallback if missing
  const mappedInvestigators = investigators.map((inv) => ({
    id: inv._id || inv.id,
    name: inv.firstName && inv.lastName ? `${inv.firstName} ${inv.lastName}` : inv.email,
    avatar: inv.firstName ? inv.firstName[0] + (inv.lastName ? inv.lastName[0] : "") : "U",
    currentCaseload: inv.currentCaseload ?? 0,
    maxCaseload: inv.maxCaseload ?? 5,
    specialization: inv.specialization ?? [],
    completionRate: inv.completionRate ?? 0,
    isActive: inv.isActive ?? true,
    status: inv.currentCaseload >= inv.maxCaseload ? "overloaded" : inv.currentCaseload / inv.maxCaseload >= 0.8 ? "busy" : "available",
    completedCases: inv.completedCases ?? 0,
    averageResolutionTime: inv.averageResolutionTime ?? null,
  }))
  // Use mappedInvestigators instead of investigators in the UI

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
        <h1 className="text-3xl font-bold tracking-tight">Case Assignment</h1>
        <p className="text-muted-foreground">
          Assign new cases to available investigators based on their workload
          and specialization.
        </p>
      </div>

      <div className="space-y-10">
        {/* Section: Unassigned Cases */}
        <div>
          <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-primary" /> Unassigned Cases
          </h2>
          <Card className="shadow-md border bg-card">
            <CardHeader>
              <CardTitle>Unassigned Cases</CardTitle>
              <CardDescription>
                Cases waiting to be assigned to investigators
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {unassignedCases.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">No unassigned cases 🎉</div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {unassignedCases.map((caseItem) => (
                    <div
                      key={caseItem._id}
                      className="p-4 border rounded-lg bg-muted shadow-sm hover:shadow-lg transition-shadow duration-200 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">#{caseItem._id.slice(-5)}</h4>
                          {getPriorityBadge(caseItem.priority)}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {caseItem.date}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-medium text-lg">{caseItem.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {caseItem.description}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 mt-2">
                        <Select
                          value={selectedInvestigator}
                          onValueChange={setSelectedInvestigator}
                        >
                          <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Select investigator" />
                          </SelectTrigger>
                          <SelectContent>
                            {mappedInvestigators.length === 0 ? (
                              <div className="px-4 py-2 text-muted-foreground text-sm">No investigators available</div>
                            ) : (
                              mappedInvestigators.map((investigator) => (
                                <SelectItem
                                  key={investigator.id}
                                  value={investigator.id}
                                  disabled={investigator.status === "overloaded"}
                                >
                                  <div className="flex items-center space-x-2">
                                    <Avatar className="h-6 w-6 ring-2 ring-muted-foreground">
                                      <AvatarImage src="/placeholder-user.jpg" alt={investigator.name} />
                                      <AvatarFallback>{investigator.avatar}</AvatarFallback>
                                    </Avatar>
                                    <span>{investigator.name}</span>
                                    <span className="text-xs text-muted-foreground">
                                      ({investigator.currentCaseload}/{investigator.maxCaseload})
                                    </span>
                                    <span className={`inline-block w-2 h-2 rounded-full ${investigator.status === "available" ? "bg-green-500 dark:bg-green-400" : investigator.status === "busy" ? "bg-yellow-500 dark:bg-yellow-400" : "bg-red-500 dark:bg-red-400"}`}></span>
                                  </div>
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                        <Button
                          size="sm"
                          onClick={() =>
                            handleAssignCase(caseItem._id, selectedInvestigator)
                          }
                          disabled={!selectedInvestigator}
                          className="ml-2"
                        >
                          <UserCheck className="mr-2 h-4 w-4" />
                          Assign
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Divider */}
        <div className="border-t my-8" />

        {/* Section: Investigator Availability */}
        <div>
          <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
            <User className="h-5 w-5 text-primary" /> Investigator Availability
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border rounded-lg bg-card">
              <thead>
                <tr className="bg-muted text-muted-foreground">
                  <th className="px-4 py-2 text-left font-medium">Investigator</th>
                  <th className="px-4 py-2 text-left font-medium">Status</th>
                  <th className="px-4 py-2 text-left font-medium">Caseload</th>
                  <th className="px-4 py-2 text-left font-medium">Completion</th>
                </tr>
              </thead>
              <tbody>
                {mappedInvestigators.map((inv, idx) => (
                  <tr key={inv.id} className={idx % 2 === 0 ? "bg-background" : "bg-muted/50"}>
                    <td className="px-4 py-2 flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder-user.jpg" alt={inv.name} />
                        <AvatarFallback>{inv.avatar}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{inv.name}</span>
                    </td>
                    <td className="px-4 py-2">
                      <span className={`inline-block w-2 h-2 rounded-full mr-2 align-middle ${inv.status === "available" ? "bg-green-500 dark:bg-green-400" : inv.status === "busy" ? "bg-yellow-500 dark:bg-yellow-400" : "bg-red-500 dark:bg-red-400"}`}></span>
                      <span className="text-xs text-muted-foreground">{inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}</span>
                    </td>
                    <td className="px-4 py-2">{inv.currentCaseload} / {inv.maxCaseload}</td>
                    <td className="px-4 py-2 w-48">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-muted-foreground/10 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-green-500 dark:bg-green-400"
                            style={{ width: `${inv.completionRate}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium w-10 text-right">{inv.completionRate}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t my-8" />

        {/* Section: Investigator Analytics */}
        <div>
          <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
            <User className="h-5 w-5 text-primary" /> Investigator Analytics
          </h2>
          <Card className="w-full shadow-lg border bg-card">
            <CardHeader>
              <CardTitle>Investigator Analytics</CardTitle>
              <CardDescription>
                Performance and workload analytics for all investigators
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 overflow-x-auto pb-4 w-full">
                {mappedInvestigators.map((inv) => (
                  <div key={inv.id} className="min-w-[280px] max-w-xs flex-1 p-4 border rounded-lg bg-muted/50 flex flex-col gap-2 shadow hover:shadow-xl transition-shadow duration-200">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="/placeholder-user.jpg" alt={inv.name} />
                        <AvatarFallback>{inv.avatar}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold text-base flex items-center gap-2">{inv.name}
                          <span className={`inline-block w-2 h-2 rounded-full ${inv.status === "available" ? "bg-green-500 dark:bg-green-400" : inv.status === "busy" ? "bg-yellow-500 dark:bg-yellow-400" : "bg-red-500 dark:bg-red-400"}`}></span>
                        </div>
                        <div className="text-xs text-muted-foreground">{inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-2">
                      <span>Caseload</span>
                      <span>{inv.currentCaseload} / {inv.maxCaseload}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-primary"
                        style={{ width: `${(inv.currentCaseload / inv.maxCaseload) * 100}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-sm mt-2">
                      <span>Completion Rate</span>
                      <span>{inv.completionRate}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-green-500"
                        style={{ width: `${inv.completionRate}%` }}
                      />
                    </div>
                    <details className="mt-2">
                      <summary className="cursor-pointer text-xs text-blue-600">Details</summary>
                      <div className="mt-2 text-xs space-y-1">
                        <div>Completed Cases: <span className="font-medium">{inv.completedCases ?? 0}</span></div>
                        <div>Avg. Resolution: <span className="font-medium">{inv.averageResolutionTime ?? '-'}</span> days</div>
                        <div>Specializations: {inv.specialization.length > 0 ? inv.specialization.map((spec: string, i: number) => (
                          <Badge key={i} variant="outline" className="text-xs ml-1">{spec}</Badge>
                        )) : <span className="text-muted-foreground">None</span>}</div>
                        <div>Status: <span className="font-medium">{inv.isActive ? 'Active' : 'Inactive'}</span></div>
                      </div>
                    </details>
                  </div>
                ))}
              </div>
              <div className="mt-8 w-full">
                <Bar
                  data={{
                    labels: mappedInvestigators.map((inv) => inv.name),
                    datasets: [
                      {
                        label: "Current Caseload",
                        data: mappedInvestigators.map((inv) => inv.currentCaseload),
                        backgroundColor: "#3b82f6",
                      },
                      {
                        label: "Completed Cases",
                        data: mappedInvestigators.map((inv) => inv.completedCases ?? 0),
                        backgroundColor: "#10b981",
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { position: "top" },
                      title: { display: false },
                    },
                    maintainAspectRatio: false,
                  }}
                  height={220}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assignment Recommendations</CardTitle>
          <CardDescription>
            AI-powered recommendations for optimal case assignments
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-primary/5 border border-primary/10 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium">Recommended Assignment</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Case #2023-050 (Vehicle Collision) should be assigned to{" "}
                  <strong>Emily Davis</strong> based on her specialization in
                  multi-vehicle accidents, despite her current workload.
                </p>
                <Button size="sm" className="mt-2">
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Apply Recommendation
                </Button>
              </div>
            </div>
          </div>

          <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                <User className="h-4 w-4 text-blue-500" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium">Workload Balance</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Consider assigning Case #2023-049 (Pedestrian Incident) to{" "}
                  <strong>Robert Wilson</strong> to balance workload
                  distribution across the team.
                </p>
                <Button size="sm" variant="outline" className="mt-2">
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Apply Recommendation
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
