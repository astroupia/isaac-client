"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ArrowRight, User, CheckCircle, Clock } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export function AssignmentBoard() {
  const { toast } = useToast()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedRecommendation, setSelectedRecommendation] = useState<any>(null)

  const unassignedCases = [
    {
      id: "2023-047",
      title: "Vehicle Collision - Highway 101",
      priority: "high",
      date: "Today, 08:15 AM",
    },
    {
      id: "2023-046",
      title: "Pedestrian Incident - Oak St",
      priority: "medium",
      date: "Today, 09:30 AM",
    },
    {
      id: "2023-045",
      title: "Traffic Signal Malfunction",
      priority: "low",
      date: "Yesterday, 16:45 PM",
    },
  ]

  const investigators = [
    {
      id: "INV-001",
      name: "John Smith",
      avatar: "JS",
      caseload: 2,
      status: "available",
    },
    {
      id: "INV-002",
      name: "Sarah Johnson",
      avatar: "SJ",
      caseload: 3,
      status: "busy",
    },
    {
      id: "INV-003",
      name: "Michael Brown",
      avatar: "MB",
      caseload: 1,
      status: "available",
    },
    {
      id: "INV-004",
      name: "Emily Davis",
      avatar: "ED",
      caseload: 4,
      status: "overloaded",
    },
    {
      id: "INV-005",
      name: "Robert Wilson",
      avatar: "RW",
      caseload: 0,
      status: "available",
    },
  ]

  const recommendations = [
    {
      id: 1,
      caseId: "2023-047",
      caseTitle: "Vehicle Collision - Highway 101",
      investigator: "Emily Davis",
      investigatorId: "INV-004",
      confidence: 95,
      reasons: [
        "Expertise in multi-vehicle accidents",
        "High completion rate (96%)",
        "Available for high-priority cases",
      ],
      estimatedCompletion: "3-4 days",
      priority: "high",
    },
    {
      id: 2,
      caseId: "2023-046",
      caseTitle: "Pedestrian Incident - Oak St",
      investigator: "Sarah Johnson",
      investigatorId: "INV-002",
      confidence: 88,
      reasons: ["Specializes in pedestrian incidents", "Good workload balance", "Recent similar case experience"],
      estimatedCompletion: "5-7 days",
      priority: "medium",
    },
    {
      id: 3,
      caseId: "2023-045",
      caseTitle: "Traffic Signal Malfunction",
      investigator: "Robert Wilson",
      investigatorId: "INV-005",
      confidence: 92,
      reasons: ["Expert in traffic systems", "Currently available", "Perfect workload distribution"],
      estimatedCompletion: "2-3 days",
      priority: "low",
    },
  ]

  const handleApplyRecommendation = (recommendation: any) => {
    setSelectedRecommendation(recommendation)
    setDialogOpen(true)
  }

  const handleConfirmAssignment = () => {
    if (selectedRecommendation) {
      toast({
        title: "Assignment Successful!",
        description: `Case #${selectedRecommendation.caseId} has been assigned to ${selectedRecommendation.investigator}. Expected completion: ${selectedRecommendation.estimatedCompletion}`,
      })
      setDialogOpen(false)
      setSelectedRecommendation(null)
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20">
            Available
          </Badge>
        )
      case "busy":
        return (
          <Badge
            variant="outline"
            className="bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 border-orange-500/20"
          >
            Busy
          </Badge>
        )
      case "overloaded":
        return (
          <Badge variant="outline" className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20">
            Overloaded
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return "text-green-600"
    if (confidence >= 80) return "text-blue-600"
    if (confidence >= 70) return "text-orange-600"
    return "text-red-600"
  }

  return (
    <div className="space-y-6">
      {/* AI Recommendations Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>AI Assignment Recommendations</span>
          </CardTitle>
          <CardDescription>
            Smart case assignments based on investigator expertise, workload, and case complexity
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {recommendations.map((recommendation) => (
            <div
              key={recommendation.id}
              className="p-4 border rounded-lg bg-gradient-to-r from-primary/5 to-transparent"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium">#{recommendation.caseId}</h4>
                    {getPriorityBadge(recommendation.priority)}
                    <span className={`text-sm font-medium ${getConfidenceColor(recommendation.confidence)}`}>
                      {recommendation.confidence}% Match
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{recommendation.caseTitle}</p>

                  <div className="flex items-center space-x-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src="/placeholder.svg?height=24&width=24" alt={recommendation.investigator} />
                      <AvatarFallback className="text-xs">
                        {recommendation.investigator
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{recommendation.investigator}</span>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">Recommendation Reasons:</p>
                    <ul className="text-xs text-muted-foreground space-y-0.5">
                      {recommendation.reasons.map((reason, index) => (
                        <li key={index} className="flex items-center space-x-1">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>Est. completion: {recommendation.estimatedCompletion}</span>
                    </div>
                  </div>
                </div>

                <Dialog
                  open={dialogOpen && selectedRecommendation?.id === recommendation.id}
                  onOpenChange={setDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button size="sm" onClick={() => handleApplyRecommendation(recommendation)} className="ml-4">
                      <ArrowRight className="mr-2 h-4 w-4" />
                      Apply
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirm Assignment</DialogTitle>
                      <DialogDescription>
                        You are about to assign this case based on AI recommendation.
                      </DialogDescription>
                    </DialogHeader>

                    {selectedRecommendation && (
                      <div className="space-y-4">
                        <div className="p-4 bg-muted rounded-lg">
                          <h4 className="font-medium mb-2">Assignment Details</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Case:</span>
                              <span className="font-medium">#{selectedRecommendation.caseId}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Investigator:</span>
                              <span className="font-medium">{selectedRecommendation.investigator}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Confidence:</span>
                              <span className={`font-medium ${getConfidenceColor(selectedRecommendation.confidence)}`}>
                                {selectedRecommendation.confidence}%
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Expected completion:</span>
                              <span className="font-medium">{selectedRecommendation.estimatedCompletion}</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h5 className="text-sm font-medium">Why this assignment?</h5>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {selectedRecommendation.reasons.map((reason: string, index: number) => (
                              <li key={index} className="flex items-center space-x-2">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span>{reason}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                    <DialogFooter>
                      <Button variant="outline" onClick={() => setDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleConfirmAssignment}>Confirm Assignment</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Traditional Assignment Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Unassigned Cases</CardTitle>
            <CardDescription>Cases waiting to be assigned to investigators</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {unassignedCases.map((caseItem) => (
              <div key={caseItem.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex flex-col">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-sm font-medium">#{caseItem.id}</h4>
                    {getPriorityBadge(caseItem.priority)}
                  </div>
                  <p className="text-sm">{caseItem.title}</p>
                  <p className="text-xs text-muted-foreground">Reported: {caseItem.date}</p>
                </div>
                <Button size="sm" asChild>
                  <Link href={`/dashboard/chief/assign/${caseItem.id}`}>
                    Assign
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Available Investigators</CardTitle>
            <CardDescription>Current workload and availability of investigators</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {investigators.map((investigator) => (
              <div key={investigator.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt={investigator.name} />
                    <AvatarFallback>{investigator.avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{investigator.name}</p>
                    <p className="text-xs text-muted-foreground">Current caseload: {investigator.caseload}</p>
                  </div>
                </div>
                {getStatusBadge(investigator.status)}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
