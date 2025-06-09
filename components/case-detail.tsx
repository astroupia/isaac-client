"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Brain, Download, MessageSquare, Send } from "lucide-react"
import Link from "next/link"

interface CaseDetailProps {
  id: string
}

export function CaseDetail({ id }: CaseDetailProps) {
  const { toast } = useToast()
  const [notes, setNotes] = useState("")

  // Mock data - in real app, this would be fetched based on the ID
  const caseData = {
    id: id,
    title: "Vehicle Collision - Highway 101",
    status: "in-progress",
    priority: "high",
    assignedDate: "April 24, 2025",
    dueDate: "April 30, 2025",
    progress: 65,
    description: "Multi-vehicle collision involving 3 vehicles during morning rush hour traffic.",
    location: "Highway 101, Mile Marker 42",
    reportedBy: "Officer John Smith",
    vehicles: [
      { id: "V1", make: "Toyota", model: "Camry", year: 2022, damage: "Front-end" },
      { id: "V2", make: "Honda", model: "CR-V", year: 2020, damage: "Side and rear" },
      { id: "V3", make: "Ford", model: "F-150", year: 2021, damage: "Front bumper" },
    ],
    casualties: [
      { name: "Driver 1", severity: "Minor", treatment: "On-scene first aid" },
      { name: "Passenger 1", severity: "Minor", treatment: "Transported to hospital" },
    ],
    evidence: [
      { type: "Photo", name: "Scene overview", status: "Processed" },
      { type: "Video", name: "Traffic camera footage", status: "Processed" },
      { type: "Document", name: "Witness statement", status: "Pending" },
    ],
  }

  const handleSubmitForReview = () => {
    toast({
      title: "Case submitted for review",
      description: "Your investigation has been submitted to the Chief Analyst for review.",
    })
  }

  const handleAddNote = () => {
    if (notes.trim()) {
      toast({
        title: "Note added",
        description: "Your investigation note has been added to the case.",
      })
      setNotes("")
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
            High Priority
          </Badge>
        )
      default:
        return <Badge variant="outline">{priority}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/investigator/cases">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Cases
          </Link>
        </Button>
      </div>

      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h1 className="text-3xl font-bold tracking-tight">Case #{caseData.id}</h1>
            {getStatusBadge(caseData.status)}
            {getPriorityBadge(caseData.priority)}
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" asChild>
              <Link href={`/dashboard/investigator/ai-reports/${caseData.id}`}>
                <Brain className="mr-2 h-4 w-4" />
                View AI Analysis
              </Link>
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export Case
            </Button>
          </div>
        </div>
        <p className="text-muted-foreground">{caseData.title}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{caseData.progress}%</div>
            <div className="w-full bg-muted rounded-full h-2 mt-2">
              <div className="bg-primary h-2 rounded-full" style={{ width: `${caseData.progress}%` }} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vehicles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{caseData.vehicles.length}</div>
            <p className="text-xs text-muted-foreground">Vehicles involved</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Casualties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{caseData.casualties.length}</div>
            <p className="text-xs text-muted-foreground">People injured</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Evidence</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{caseData.evidence.length}</div>
            <p className="text-xs text-muted-foreground">Items collected</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Case Investigation</CardTitle>
            <CardDescription>Detailed investigation information and evidence</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
                <TabsTrigger value="casualties">Casualties</TabsTrigger>
                <TabsTrigger value="evidence">Evidence</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4 mt-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Case Details</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Assigned Date:</span> {caseData.assignedDate}
                      </div>
                      <div>
                        <span className="font-medium">Due Date:</span> {caseData.dueDate}
                      </div>
                      <div>
                        <span className="font-medium">Location:</span> {caseData.location}
                      </div>
                      <div>
                        <span className="font-medium">Reported By:</span> {caseData.reportedBy}
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Description</h3>
                    <p className="text-sm text-muted-foreground">{caseData.description}</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="vehicles" className="space-y-4 mt-4">
                <div className="space-y-4">
                  {caseData.vehicles.map((vehicle, index) => (
                    <div key={vehicle.id} className="p-3 border rounded-lg">
                      <h4 className="font-medium">Vehicle {index + 1}</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                        <div>
                          <span className="font-medium">Make/Model:</span> {vehicle.make} {vehicle.model}
                        </div>
                        <div>
                          <span className="font-medium">Year:</span> {vehicle.year}
                        </div>
                        <div className="col-span-2">
                          <span className="font-medium">Damage:</span> {vehicle.damage}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="casualties" className="space-y-4 mt-4">
                <div className="space-y-4">
                  {caseData.casualties.map((casualty, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <h4 className="font-medium">{casualty.name}</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                        <div>
                          <span className="font-medium">Severity:</span> {casualty.severity}
                        </div>
                        <div>
                          <span className="font-medium">Treatment:</span> {casualty.treatment}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="evidence" className="space-y-4 mt-4">
                <div className="space-y-4">
                  {caseData.evidence.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">{item.type}</p>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          item.status === "Processed"
                            ? "bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20"
                            : "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 border-orange-500/20"
                        }
                      >
                        {item.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Investigation Notes</CardTitle>
            <CardDescription>Add notes and observations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Textarea
                placeholder="Add investigation notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
              />
              <Button onClick={handleAddNote} disabled={!notes.trim()} className="w-full">
                <MessageSquare className="mr-2 h-4 w-4" />
                Add Note
              </Button>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Previous Notes</h4>
              <div className="space-y-2 text-sm">
                <div className="p-2 bg-muted rounded">
                  <p>Initial scene assessment completed. All evidence collected and catalogued.</p>
                  <p className="text-xs text-muted-foreground mt-1">April 24, 2025 - 2:30 PM</p>
                </div>
                <div className="p-2 bg-muted rounded">
                  <p>Witness interviews scheduled for tomorrow morning.</p>
                  <p className="text-xs text-muted-foreground mt-1">April 24, 2025 - 11:15 AM</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <Button onClick={handleSubmitForReview} className="w-full">
                <Send className="mr-2 h-4 w-4" />
                Submit for Review
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
