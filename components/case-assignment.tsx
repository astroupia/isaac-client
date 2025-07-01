"use client";

import { useState } from "react";
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

export function CaseAssignment() {
  const { toast } = useToast();
  const [selectedInvestigator, setSelectedInvestigator] = useState<string>("");

  const unassignedCases = [
    {
      id: "2023-050",
      title: "Vehicle Collision - Interstate 280",
      priority: "high",
      date: "April 25, 2025",
      description: "Multi-vehicle accident during rush hour",
    },
    {
      id: "2023-049",
      title: "Pedestrian Incident - Main Street",
      priority: "medium",
      date: "April 25, 2025",
      description: "Pedestrian struck at crosswalk",
    },
    {
      id: "2023-048",
      title: "Traffic Signal Malfunction - Oak Avenue",
      priority: "low",
      date: "April 24, 2025",
      description: "Signal timing issues causing confusion",
    },
  ];

  const investigators = [
    {
      id: "INV-001",
      name: "John Smith",
      avatar: "JS",
      currentCaseload: 2,
      maxCaseload: 5,
      specialization: ["Vehicle Collisions", "Traffic Analysis"],
      status: "available",
      completionRate: 94,
    },
    {
      id: "INV-002",
      name: "Sarah Johnson",
      avatar: "SJ",
      currentCaseload: 3,
      maxCaseload: 5,
      specialization: ["Pedestrian Incidents", "Evidence Analysis"],
      status: "busy",
      completionRate: 89,
    },
    {
      id: "INV-003",
      name: "Michael Brown",
      avatar: "MB",
      currentCaseload: 1,
      maxCaseload: 4,
      specialization: ["Infrastructure", "Traffic Systems"],
      status: "available",
      completionRate: 91,
    },
    {
      id: "INV-004",
      name: "Emily Davis",
      avatar: "ED",
      currentCaseload: 4,
      maxCaseload: 4,
      specialization: ["Multi-vehicle Accidents", "Reconstruction"],
      status: "overloaded",
      completionRate: 96,
    },
    {
      id: "INV-005",
      name: "Robert Wilson",
      avatar: "RW",
      currentCaseload: 0,
      maxCaseload: 5,
      specialization: ["Traffic Violations", "Signal Analysis"],
      status: "available",
      completionRate: 87,
    },
  ];

  const handleAssignCase = (caseId: string, investigatorId: string) => {
    if (!investigatorId) {
      toast({
        title: "No investigator selected",
        description: "Please select an investigator before assigning the case.",
        variant: "destructive",
      });
      return;
    }

    const investigator = investigators.find((inv) => inv.id === investigatorId);
    const caseItem = unassignedCases.find((c) => c.id === caseId);

    if (investigator && caseItem) {
      toast({
        title: "Case assigned successfully",
        description: `Case #${caseId} has been assigned to ${investigator.name}.`,
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

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Unassigned Cases</CardTitle>
            <CardDescription>
              Cases waiting to be assigned to investigators
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {unassignedCases.map((caseItem) => (
              <div
                key={caseItem.id}
                className="p-4 border rounded-lg space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium">#{caseItem.id}</h4>
                    {getPriorityBadge(caseItem.priority)}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {caseItem.date}
                  </span>
                </div>
                <div>
                  <h3 className="font-medium">{caseItem.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {caseItem.description}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Select
                    value={selectedInvestigator}
                    onValueChange={setSelectedInvestigator}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select investigator" />
                    </SelectTrigger>
                    <SelectContent>
                      {investigators
                        .filter((inv) => inv.status !== "overloaded")
                        .map((investigator) => (
                          <SelectItem
                            key={investigator.id}
                            value={investigator.id}
                          >
                            <div className="flex items-center space-x-2">
                              <span>{investigator.name}</span>
                              <span className="text-xs text-muted-foreground">
                                ({investigator.currentCaseload}/
                                {investigator.maxCaseload})
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <Button
                    size="sm"
                    onClick={() =>
                      handleAssignCase(caseItem.id, selectedInvestigator)
                    }
                    disabled={!selectedInvestigator}
                  >
                    <UserCheck className="mr-2 h-4 w-4" />
                    Assign
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Investigator Availability</CardTitle>
            <CardDescription>
              Current workload and availability of investigators
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {investigators.map((investigator) => (
              <div
                key={investigator.id}
                className="p-4 border rounded-lg space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src="/placeholder.svg?height=40&width=40"
                        alt={investigator.name}
                      />
                      <AvatarFallback>{investigator.avatar}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium">{investigator.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {investigator.currentCaseload}/
                        {investigator.maxCaseload} cases
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(investigator.status)}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Workload</span>
                    <span>
                      {Math.round(
                        (investigator.currentCaseload /
                          investigator.maxCaseload) *
                          100
                      )}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        investigator.currentCaseload /
                          investigator.maxCaseload >=
                        0.8
                          ? "bg-orange-500"
                          : investigator.currentCaseload /
                              investigator.maxCaseload >=
                            1
                          ? "bg-red-500"
                          : "bg-primary"
                      }`}
                      style={{
                        width: `${
                          (investigator.currentCaseload /
                            investigator.maxCaseload) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium">Specializations:</p>
                  <div className="flex flex-wrap gap-1">
                    {investigator.specialization.map((spec, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span>Completion Rate:</span>
                  <span className="font-medium">
                    {investigator.completionRate}%
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
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
