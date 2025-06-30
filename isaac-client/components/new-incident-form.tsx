"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { ModernDateTimePicker } from "@/components/modern-date-time-picker"
import { AlertTriangle, ArrowLeft, ArrowRight, FileText, MapPin, Upload, X } from "lucide-react"
import Link from "next/link"

export function NewIncidentForm() {
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const [files, setFiles] = useState<File[]>([])
  const [incidentDate, setIncidentDate] = useState<Date>(new Date())

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setFiles((prev) => [...prev, ...newFiles])
    }
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Incident report submitted",
      description: "Your incident report has been successfully submitted.",
    })
    // Redirect to dashboard or confirmation page
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/traffic">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Report New Incident</h1>
        <p className="text-muted-foreground">Complete the form below to report a new traffic incident.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Incident Report Form</CardTitle>
          <CardDescription>Please provide as much detail as possible about the incident.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={`step-${step}`} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="step-1" onClick={() => setStep(1)}>
                Basic Information
              </TabsTrigger>
              <TabsTrigger value="step-2" onClick={() => setStep(2)}>
                Incident Details
              </TabsTrigger>
              <TabsTrigger value="step-3" onClick={() => setStep(3)}>
                Evidence Upload
              </TabsTrigger>
            </TabsList>

            <TabsContent value="step-1" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="incident-datetime">Incident Date & Time</Label>
                  <ModernDateTimePicker
                    value={incidentDate}
                    onChange={setIncidentDate}
                    placeholder="Select incident date and time"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="incident-location">Incident Location</Label>
                <div className="relative">
                  <Input id="incident-location" placeholder="Enter the location of the incident" />
                  <MapPin className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="incident-type">Incident Type</Label>
                <Select>
                  <SelectTrigger id="incident-type">
                    <SelectValue placeholder="Select incident type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vehicle-collision">Vehicle Collision</SelectItem>
                    <SelectItem value="pedestrian-incident">Pedestrian Incident</SelectItem>
                    <SelectItem value="traffic-violation">Traffic Violation</SelectItem>
                    <SelectItem value="infrastructure-damage">Infrastructure Damage</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="incident-severity">Severity</Label>
                <Select>
                  <SelectTrigger id="incident-severity">
                    <SelectValue placeholder="Select severity level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minor">Minor - No injuries</SelectItem>
                    <SelectItem value="moderate">Moderate - Minor injuries</SelectItem>
                    <SelectItem value="severe">Severe - Serious injuries</SelectItem>
                    <SelectItem value="fatal">Fatal - Casualties involved</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => setStep(2)}>
                  Next Step
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="step-2" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="vehicles-involved">Number of Vehicles Involved</Label>
                <Input id="vehicles-involved" type="number" min="0" placeholder="Enter number of vehicles" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="casualties">Number of Casualties</Label>
                <Input id="casualties" type="number" min="0" placeholder="Enter number of casualties" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="incident-description">Incident Description</Label>
                <Textarea
                  id="incident-description"
                  placeholder="Provide a detailed description of what happened"
                  rows={5}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weather-conditions">Weather Conditions</Label>
                <Select>
                  <SelectTrigger id="weather-conditions">
                    <SelectValue placeholder="Select weather conditions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="clear">Clear</SelectItem>
                    <SelectItem value="cloudy">Cloudy</SelectItem>
                    <SelectItem value="rain">Rain</SelectItem>
                    <SelectItem value="snow">Snow</SelectItem>
                    <SelectItem value="fog">Fog</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="road-conditions">Road Conditions</Label>
                <Select>
                  <SelectTrigger id="road-conditions">
                    <SelectValue placeholder="Select road conditions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dry">Dry</SelectItem>
                    <SelectItem value="wet">Wet</SelectItem>
                    <SelectItem value="icy">Icy</SelectItem>
                    <SelectItem value="snow-covered">Snow Covered</SelectItem>
                    <SelectItem value="under-construction">Under Construction</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(1)}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous Step
                </Button>
                <Button onClick={() => setStep(3)}>
                  Next Step
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="step-3" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Evidence Files</Label>
                <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center">
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-1">Drag and drop files here or click to browse</p>
                  <p className="text-xs text-muted-foreground">Supports images, videos, and documents up to 50MB</p>
                  <Input type="file" className="hidden" id="file-upload" multiple onChange={handleFileChange} />
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => document.getElementById("file-upload")?.click()}
                  >
                    Browse Files
                  </Button>
                </div>
              </div>

              {files.length > 0 && (
                <div className="space-y-2">
                  <Label>Uploaded Files ({files.length})</Label>
                  <div className="space-y-2 max-h-[200px] overflow-y-auto">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </span>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => removeFile(index)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="additional-notes">Additional Notes</Label>
                <Textarea
                  id="additional-notes"
                  placeholder="Any additional information about the evidence or incident"
                  rows={3}
                />
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(2)}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous Step
                </Button>
                <Button onClick={handleSubmit}>Submit Report</Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col items-start border-t p-4">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <AlertTriangle className="h-4 w-4 text-orange-500" />
            <p>All information provided will be used for official investigation purposes only.</p>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
