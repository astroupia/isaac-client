"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Download, MapPin, Save, Send } from "lucide-react"
import Link from "next/link"
import { ModernDateTimePicker } from "@/components/modern-date-time-picker"

interface TrafficReportDetailProps {
  id: string
}

export function TrafficReportDetail({ id }: TrafficReportDetailProps) {
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)

  // Mock data - in real app, this would be fetched based on the ID
  const reportData = {
    id: id,
    title: "Vehicle Collision - Highway 101",
    status: "pending",
    priority: "high",
    date: "2025-04-24",
    time: "10:30",
    location: "Highway 101, Mile Marker 42",
    description: "Multi-vehicle collision involving 3 vehicles during morning rush hour traffic.",
    incidentType: "vehicle-collision",
    severity: "moderate",
    vehiclesInvolved: 3,
    casualties: 2,
    weatherConditions: "clear",
    roadConditions: "dry",
    completionPercentage: 75,
  }

  const handleSave = () => {
    toast({
      title: "Report saved",
      description: "Your changes have been saved successfully.",
    })
    setIsEditing(false)
  }

  const handleSubmit = () => {
    toast({
      title: "Report submitted",
      description: "Your report has been submitted for review.",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 border-orange-500/20"
          >
            Pending Completion
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
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/traffic/reports">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Reports
          </Link>
        </Button>
      </div>

      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h1 className="text-3xl font-bold tracking-tight">Report #{reportData.id}</h1>
            {getStatusBadge(reportData.status)}
          </div>
          <div className="flex items-center space-x-2">
            {!isEditing ? (
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                Edit Report
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </>
            )}
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
        <p className="text-muted-foreground">{reportData.title}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData.completionPercentage}%</div>
            <div className="w-full bg-muted rounded-full h-2 mt-2">
              <div className="bg-primary h-2 rounded-full" style={{ width: `${reportData.completionPercentage}%` }} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vehicles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData.vehiclesInvolved}</div>
            <p className="text-xs text-muted-foreground">Vehicles involved</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Casualties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData.casualties}</div>
            <p className="text-xs text-muted-foreground">Minor injuries</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{reportData.priority}</div>
            <p className="text-xs text-muted-foreground">Priority level</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Incident Report Details</CardTitle>
          <CardDescription>Complete incident information and evidence</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="basic-info">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic-info">Basic Information</TabsTrigger>
              <TabsTrigger value="details">Incident Details</TabsTrigger>
              <TabsTrigger value="evidence">Evidence</TabsTrigger>
              <TabsTrigger value="review">Review & Submit</TabsTrigger>
            </TabsList>

            <TabsContent value="basic-info" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="incident-datetime">Incident Date & Time</Label>
                  <ModernDateTimePicker
                    value={new Date(`${reportData.date}T${reportData.time}`)}
                    onChange={(date) => {
                      // Handle date change - in real app this would update the state
                      console.log("Date changed:", date)
                    }}
                    placeholder="Select incident date and time"
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="incident-location">Incident Location</Label>
                  <div className="relative">
                    <Input id="incident-location" value={reportData.location} disabled={!isEditing} />
                    <MapPin className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="incident-type">Incident Type</Label>
                  <Select value={reportData.incidentType} disabled={!isEditing}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vehicle-collision">Vehicle Collision</SelectItem>
                      <SelectItem value="pedestrian-incident">Pedestrian Incident</SelectItem>
                      <SelectItem value="traffic-violation">Traffic Violation</SelectItem>
                      <SelectItem value="infrastructure-damage">Infrastructure Damage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="severity">Severity</Label>
                  <Select value={reportData.severity} disabled={!isEditing}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="minor">Minor - No injuries</SelectItem>
                      <SelectItem value="moderate">Moderate - Minor injuries</SelectItem>
                      <SelectItem value="severe">Severe - Serious injuries</SelectItem>
                      <SelectItem value="fatal">Fatal - Casualties involved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="details" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vehicles">Number of Vehicles</Label>
                  <Input id="vehicles" type="number" value={reportData.vehiclesInvolved} disabled={!isEditing} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="casualties">Number of Casualties</Label>
                  <Input id="casualties" type="number" value={reportData.casualties} disabled={!isEditing} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Incident Description</Label>
                <Textarea id="description" value={reportData.description} disabled={!isEditing} rows={5} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weather">Weather Conditions</Label>
                  <Select value={reportData.weatherConditions} disabled={!isEditing}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="clear">Clear</SelectItem>
                      <SelectItem value="cloudy">Cloudy</SelectItem>
                      <SelectItem value="rain">Rain</SelectItem>
                      <SelectItem value="snow">Snow</SelectItem>
                      <SelectItem value="fog">Fog</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="road">Road Conditions</Label>
                  <Select value={reportData.roadConditions} disabled={!isEditing}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dry">Dry</SelectItem>
                      <SelectItem value="wet">Wet</SelectItem>
                      <SelectItem value="icy">Icy</SelectItem>
                      <SelectItem value="snow-covered">Snow Covered</SelectItem>
                      <SelectItem value="under-construction">Under Construction</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="evidence" className="space-y-4 mt-4">
              <div className="text-center py-8">
                <p className="text-muted-foreground">Evidence management interface would be implemented here</p>
                <p className="text-sm text-muted-foreground mt-2">
                  This would include file upload, evidence linking, and chain of custody tracking
                </p>
              </div>
            </TabsContent>

            <TabsContent value="review" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Report Summary</h3>
                  <p className="text-sm text-muted-foreground">
                    This report documents a {reportData.severity} {reportData.incidentType.replace("-", " ")} that
                    occurred on {reportData.date} at {reportData.time} at {reportData.location}. The incident involved{" "}
                    {reportData.vehiclesInvolved} vehicles and resulted in {reportData.casualties} casualties.
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Report completion: {reportData.completionPercentage}%
                  </div>
                  <Button onClick={handleSubmit} disabled={reportData.completionPercentage < 100}>
                    <Send className="mr-2 h-4 w-4" />
                    Submit for Review
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
