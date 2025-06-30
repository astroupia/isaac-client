"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { AIFollowUpDialog } from "@/components/ai-follow-up-dialog"
import { ExportSuccessDialog } from "@/components/export-success-dialog"
import { AIReviewDialog } from "@/components/ai-review-dialog"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, CheckCircle, Download, MessageSquare, XCircle } from "lucide-react"
import Link from "next/link"

interface ChiefAIInsightsProps {
  reportId: string
}

export function ChiefAIInsights({ reportId }: ChiefAIInsightsProps) {
  const [feedback, setFeedback] = useState("")
  const [exportDialog, setExportDialog] = useState<{
    open: boolean
    type: string
    fileName: string
  }>({
    open: false,
    type: "",
    fileName: "",
  })
  const [reviewDialog, setReviewDialog] = useState<{
    open: boolean
    action: "approve" | "flag"
  }>({
    open: false,
    action: "approve",
  })
  const { toast } = useToast()

  const handleApproveAI = () => {
    setReviewDialog({
      open: true,
      action: "approve",
    })
  }

  const handleRejectAI = () => {
    setReviewDialog({
      open: true,
      action: "flag",
    })
  }

  const handleExport = (type: string) => {
    const fileName = `ai_analysis_${reportId}_${new Date().toISOString().split("T")[0]}.pdf`
    setExportDialog({
      open: true,
      type,
      fileName,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/chief/reports">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Reports
          </Link>
        </Button>
      </div>

      <div className="flex flex-col space-y-2">
        <div className="flex items-center space-x-2">
          <h1 className="text-3xl font-bold tracking-tight">AI Analysis Review</h1>
          <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20">
            High Confidence
          </Badge>
        </div>
        <p className="text-muted-foreground">
          Chief review of AI analysis for Report #{reportId} • Multi-vehicle Accident - Bridge
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Analysis Summary</CardTitle>
              <CardDescription>Comprehensive AI-generated analysis and findings</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="findings">Key Findings</TabsTrigger>
                  <TabsTrigger value="evidence">Evidence Analysis</TabsTrigger>
                  <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4 mt-4">
                  <div className="space-y-4">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h3 className="font-medium mb-2">Incident Classification</h3>
                      <p className="text-sm">
                        The AI system has classified this as a multi-vehicle collision involving 3 vehicles on the
                        bridge section of Highway 280. The incident occurred during peak traffic hours with moderate
                        weather conditions.
                      </p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Primary Factors</h4>
                        <ul className="text-sm space-y-1">
                          <li>• Following distance too close</li>
                          <li>• Sudden braking by lead vehicle</li>
                          <li>• Wet road conditions</li>
                          <li>• Reduced visibility due to fog</li>
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Contributing Factors</h4>
                        <ul className="text-sm space-y-1">
                          <li>• Heavy traffic volume</li>
                          <li>• Bridge construction zone</li>
                          <li>• Morning rush hour timing</li>
                          <li>• Distracted driving indicators</li>
                        </ul>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">AI Confidence Breakdown</h4>
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Vehicle Detection</span>
                            <span className="text-sm font-medium">96%</span>
                          </div>
                          <Progress value={96} className="h-2" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Incident Reconstruction</span>
                            <span className="text-sm font-medium">89%</span>
                          </div>
                          <Progress value={89} className="h-2" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Causality Analysis</span>
                            <span className="text-sm font-medium">87%</span>
                          </div>
                          <Progress value={87} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="findings" className="space-y-4 mt-4">
                  <div className="space-y-4">
                    <div className="p-4 border-l-4 border-red-500 bg-red-500/5">
                      <h4 className="font-medium text-red-700 dark:text-red-400">Critical Finding</h4>
                      <p className="text-sm mt-1">
                        Vehicle 1 was following at approximately 0.8 seconds behind Vehicle 2, well below the
                        recommended 3-second rule for the given conditions.
                      </p>
                    </div>

                    <div className="p-4 border-l-4 border-orange-500 bg-orange-500/5">
                      <h4 className="font-medium text-orange-700 dark:text-orange-400">Contributing Factor</h4>
                      <p className="text-sm mt-1">
                        Road surface analysis indicates 15% reduced friction due to moisture, contributing to extended
                        braking distances.
                      </p>
                    </div>

                    <div className="p-4 border-l-4 border-blue-500 bg-blue-500/5">
                      <h4 className="font-medium text-blue-700 dark:text-blue-400">Environmental Factor</h4>
                      <p className="text-sm mt-1">
                        Visibility was reduced to approximately 150 meters due to fog conditions, limiting reaction time
                        for all drivers involved.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium">Timeline Reconstruction</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-start space-x-3">
                          <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                          <div>
                            <p className="font-medium">07:42:15 - Initial Event</p>
                            <p className="text-muted-foreground">Vehicle 3 begins sudden braking maneuver</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                          <div>
                            <p className="font-medium">07:42:17 - Chain Reaction</p>
                            <p className="text-muted-foreground">Vehicle 2 initiates emergency braking</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                          <div>
                            <p className="font-medium">07:42:19 - Impact</p>
                            <p className="text-muted-foreground">Vehicle 1 collides with Vehicle 2</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="evidence" className="space-y-4 mt-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                        <p className="text-sm text-muted-foreground">Traffic Camera 1</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-medium">Bridge North Camera</p>
                        <p className="text-xs text-muted-foreground">AI Confidence: 94%</p>
                        <Badge variant="outline" className="text-xs">
                          Analyzed
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                        <p className="text-sm text-muted-foreground">Dash Camera</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-medium">Vehicle 3 Dashboard</p>
                        <p className="text-xs text-muted-foreground">AI Confidence: 91%</p>
                        <Badge variant="outline" className="text-xs">
                          Analyzed
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                        <p className="text-sm text-muted-foreground">Scene Photos</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-medium">Post-incident Documentation</p>
                        <p className="text-xs text-muted-foreground">AI Confidence: 88%</p>
                        <Badge variant="outline" className="text-xs">
                          Analyzed
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Evidence Processing Results</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="text-sm font-medium">Vehicle Speed Analysis</p>
                          <p className="text-xs text-muted-foreground">Extracted from multiple sources</p>
                        </div>
                        <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20">
                          Validated
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="text-sm font-medium">Impact Force Calculation</p>
                          <p className="text-xs text-muted-foreground">Physics-based reconstruction</p>
                        </div>
                        <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20">
                          Validated
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="text-sm font-medium">Weather Data Correlation</p>
                          <p className="text-xs text-muted-foreground">Environmental impact assessment</p>
                        </div>
                        <Badge className="bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 border-orange-500/20">
                          Needs Review
                        </Badge>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="recommendations" className="space-y-4 mt-4">
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-lg">
                      <h4 className="font-medium text-blue-700 dark:text-blue-400 mb-2">
                        Investigation Recommendations
                      </h4>
                      <ul className="text-sm space-y-1">
                        <li>• Obtain additional witness statements from vehicles behind the incident</li>
                        <li>• Request vehicle maintenance records for all involved vehicles</li>
                        <li>• Analyze cell phone records for distracted driving evidence</li>
                        <li>• Review bridge construction signage and warnings</li>
                      </ul>
                    </div>

                    <div className="p-4 bg-green-500/5 border border-green-500/20 rounded-lg">
                      <h4 className="font-medium text-green-700 dark:text-green-400 mb-2">Safety Recommendations</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Install additional warning signs for bridge construction zone</li>
                        <li>• Consider variable speed limits during fog conditions</li>
                        <li>• Improve road surface drainage on bridge section</li>
                        <li>• Add electronic following distance warnings</li>
                      </ul>
                    </div>

                    <div className="p-4 bg-purple-500/5 border border-purple-500/20 rounded-lg">
                      <h4 className="font-medium text-purple-700 dark:text-purple-400 mb-2">AI Model Improvements</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Enhance fog condition detection algorithms</li>
                        <li>• Improve bridge-specific incident modeling</li>
                        <li>• Refine following distance calculation accuracy</li>
                        <li>• Update weather correlation models</li>
                      </ul>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Chief Review Actions</CardTitle>
              <CardDescription>Review and validate AI analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <Button onClick={handleApproveAI} className="w-full">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approve Analysis
                </Button>
                <Button variant="outline" onClick={handleRejectAI} className="w-full">
                  <XCircle className="mr-2 h-4 w-4" />
                  Flag for Review
                </Button>
              </div>

              <Separator />

              <AIFollowUpDialog reportId={reportId} context="AI analysis review" />

              <Button variant="outline" className="w-full" onClick={() => handleExport("AI Analysis Report")}>
                <Download className="mr-2 h-4 w-4" />
                Export Analysis
              </Button>

              <Separator />

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Chief Notes</h3>
                <Textarea
                  placeholder="Add your review notes and feedback..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="min-h-[100px]"
                />
                <Button variant="outline" className="w-full" disabled={!feedback.trim()}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Save Notes
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Analysis Metadata</CardTitle>
              <CardDescription>Technical details about this AI analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <p className="text-sm text-muted-foreground">Analysis ID</p>
                  <p className="text-sm font-medium">AI-{reportId}-2025</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm text-muted-foreground">Generated</p>
                  <p className="text-sm font-medium">April 24, 2025, 08:15 AM</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm text-muted-foreground">Processing Time</p>
                  <p className="text-sm font-medium">4 minutes, 32 seconds</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm text-muted-foreground">Evidence Items</p>
                  <p className="text-sm font-medium">8 items processed</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm text-muted-foreground">AI Model</p>
                  <p className="text-sm font-medium">ISAAC v3.2.1</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm text-muted-foreground">Overall Confidence</p>
                  <p className="text-sm font-medium">89% (High)</p>
                </div>
              </div>

              <div className="flex items-center p-2 bg-green-500/10 rounded-md">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                <p className="text-xs text-green-600 dark:text-green-400">
                  Analysis meets quality standards for chief review
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <ExportSuccessDialog
        open={exportDialog.open}
        onOpenChange={(open) => setExportDialog((prev) => ({ ...prev, open }))}
        exportType={exportDialog.type}
        fileName={exportDialog.fileName}
      />

      <AIReviewDialog
        open={reviewDialog.open}
        onOpenChange={(open) => setReviewDialog((prev) => ({ ...prev, open }))}
        action={reviewDialog.action}
        reportId={reportId}
      />
    </div>
  )
}
