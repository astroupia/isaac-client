"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  MessageSquare,
  PrinterIcon as Print,
  Share2,
  Clock,
  User,
  Brain,
  FileText,
  AlertTriangle,
  Eye,
  Calendar,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

interface ChiefReportDetailProps {
  reportId: string
}

export function ChiefReportDetail({ reportId }: ChiefReportDetailProps) {
  const [reviewNotes, setReviewNotes] = useState("")
  const [isApproving, setIsApproving] = useState(false)
  const [isRejecting, setIsRejecting] = useState(false)

  // Mock data - in real app, this would be fetched based on reportId
  const report = {
    id: reportId,
    title: "Multi-vehicle Accident - Bridge Intersection",
    investigator: "John Smith",
    submittedDate: "2024-01-10",
    incidentDate: "2024-01-08",
    status: "pending_review",
    aiConfidence: 94,
    priority: "high",
    location: "Bridge St & Main Ave",
    summary:
      "Three-vehicle collision at controlled intersection during peak hours. AI analysis indicates primary cause was failure to yield right of way.",
    findings: [
      "Vehicle A (sedan) failed to yield at intersection",
      "Traffic signal was functioning normally",
      "Weather conditions were clear",
      "No evidence of impairment or distraction",
      "Speed analysis shows Vehicle A was traveling 5 mph over limit",
    ],
    recommendations: [
      "Cite Vehicle A driver for failure to yield",
      "No criminal charges recommended",
      "Suggest defensive driving course",
      "Review intersection signal timing",
    ],
    evidence: [
      { type: "photo", count: 12, description: "Scene photographs" },
      { type: "video", count: 2, description: "Traffic camera footage" },
      { type: "witness", count: 3, description: "Witness statements" },
      { type: "measurement", count: 8, description: "Scene measurements" },
    ],
  }

  const handleApprove = async () => {
    setIsApproving(true)
    // Simulate API call
    setTimeout(() => {
      setIsApproving(false)
      // In real app, would redirect or show success message
    }, 2000)
  }

  const handleReject = async () => {
    setIsRejecting(true)
    // Simulate API call
    setTimeout(() => {
      setIsRejecting(false)
      // In real app, would redirect or show success message
    }, 2000)
  }

  return (
    <div className="space-y-6 w-full">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/chief">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Report Review</h1>
            <p className="text-muted-foreground">
              #{report.id} - {report.title}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20">
            <Clock className="h-3 w-3 mr-1" />
            Pending Review
          </Badge>
          <Button variant="outline" size="sm">
            <Print className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* Report Header Info */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Investigator</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{report.investigator}</div>
            <p className="text-xs text-muted-foreground">Lead investigator</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Confidence</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-green-500">{report.aiConfidence}%</div>
            <Progress value={report.aiConfidence} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Incident Date</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{report.incidentDate}</div>
            <p className="text-xs text-muted-foreground">Date of occurrence</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Priority</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Badge className="bg-red-500/10 text-red-500 border-red-500/20">High Priority</Badge>
            <p className="text-xs text-muted-foreground mt-1">Requires immediate attention</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="report" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="report">Report Details</TabsTrigger>
          <TabsTrigger value="evidence">Evidence</TabsTrigger>
          <TabsTrigger value="ai-analysis">AI Analysis</TabsTrigger>
          <TabsTrigger value="review">Review & Approval</TabsTrigger>
        </TabsList>

        <TabsContent value="report" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Incident Summary</CardTitle>
              <CardDescription>Overview of the incident and initial findings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Location</h4>
                  <p className="text-sm text-muted-foreground">{report.location}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Summary</h4>
                  <p className="text-sm text-muted-foreground">{report.summary}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Key Findings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {report.findings.map((finding, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm">{finding}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {report.recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm">{recommendation}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="evidence" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Evidence Summary</CardTitle>
              <CardDescription>All evidence collected and analyzed for this incident</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {report.evidence.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">{item.description}</p>
                        <p className="text-sm text-muted-foreground">{item.count} items</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-analysis" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="h-5 w-5 mr-2" />
                AI Analysis Results
              </CardTitle>
              <CardDescription>Detailed AI-generated analysis and confidence metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-500">{report.aiConfidence}%</div>
                    <p className="text-sm text-muted-foreground">Overall Confidence</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-500">98%</div>
                    <p className="text-sm text-muted-foreground">Object Detection</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-purple-500">91%</div>
                    <p className="text-sm text-muted-foreground">Scene Reconstruction</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">AI Analysis Breakdown</h4>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Vehicle Detection Accuracy</span>
                        <span className="font-medium">98%</span>
                      </div>
                      <Progress value={98} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Trajectory Analysis</span>
                        <span className="font-medium">94%</span>
                      </div>
                      <Progress value={94} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Impact Assessment</span>
                        <span className="font-medium">91%</span>
                      </div>
                      <Progress value={91} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Environmental Factors</span>
                        <span className="font-medium">89%</span>
                      </div>
                      <Progress value={89} className="h-2" />
                    </div>
                  </div>
                </div>

                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/dashboard/investigator/ai-reports/${report.id}`}>
                    <Brain className="h-4 w-4 mr-2" />
                    View Full AI Analysis Report
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="review" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="h-5 w-5 mr-2" />
                Review & Decision
              </CardTitle>
              <CardDescription>Provide your review and make a decision on this report</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Review Notes</label>
                  <Textarea
                    placeholder="Enter your review comments, feedback, or required changes..."
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    className="min-h-[120px]"
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Decision Actions</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <Button
                    size="lg"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={handleApprove}
                    disabled={isApproving || isRejecting}
                  >
                    {isApproving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Approving...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve Report
                      </>
                    )}
                  </Button>

                  <Button size="lg" variant="destructive" onClick={handleReject} disabled={isApproving || isRejecting}>
                    {isRejecting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 mr-2" />
                        Return for Revision
                      </>
                    )}
                  </Button>
                </div>

                <div className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg">
                  <p className="font-medium mb-2">Review Guidelines:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Verify all evidence has been properly documented and analyzed</li>
                    <li>• Ensure AI analysis confidence levels meet department standards (≥85%)</li>
                    <li>• Check that recommendations align with department policies</li>
                    <li>• Confirm all witness statements have been collected</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
