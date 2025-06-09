"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Brain, Download, FileText, Search, Send } from "lucide-react"
import Link from "next/link"
import { AIChart } from "@/components/ai-chart"

export function AIInsightsConsole() {
  const { toast } = useToast()
  const [query, setQuery] = useState("")

  const handleQuery = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      toast({
        title: "Query submitted",
        description: "Processing your query: " + query,
      })
      setQuery("")
    }
  }

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
        <h1 className="text-3xl font-bold tracking-tight">AI Insights Console</h1>
        <p className="text-muted-foreground">Advanced analytics and insights from the ISAAC AI system.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>AI System Status</CardTitle>
            <CardDescription>Current performance metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">System Health</h4>
                <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20">
                  Optimal
                </Badge>
              </div>
              <Progress value={98} className="h-2" />
              <p className="text-xs text-muted-foreground">All AI subsystems operating at optimal levels</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Processing Queue</h4>
                <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20">
                  2 Reports
                </Badge>
              </div>
              <Progress value={20} className="h-2" />
              <p className="text-xs text-muted-foreground">
                2 reports in processing queue, estimated completion: 5 minutes
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Model Version</h4>
                <Badge variant="outline">v3.2.1</Badge>
              </div>
              <p className="text-xs text-muted-foreground">Last updated: April 20, 2025</p>
            </div>

            <Separator />

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Subsystem Status</h4>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs">Vehicle Detection</p>
                  <Badge
                    variant="outline"
                    className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20"
                  >
                    Online
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs">Incident Reconstruction</p>
                  <Badge
                    variant="outline"
                    className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20"
                  >
                    Online
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs">Context Analysis</p>
                  <Badge
                    variant="outline"
                    className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20"
                  >
                    Online
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs">Casualty Assessment</p>
                  <Badge
                    variant="outline"
                    className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20"
                  >
                    Online
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs">Natural Language Processing</p>
                  <Badge
                    variant="outline"
                    className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20"
                  >
                    Online
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>AI Performance Analytics</CardTitle>
            <CardDescription>System-wide performance metrics over time</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="accuracy">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="accuracy">Accuracy</TabsTrigger>
                <TabsTrigger value="processing">Processing</TabsTrigger>
                <TabsTrigger value="confidence">Confidence</TabsTrigger>
                <TabsTrigger value="trends">Trends</TabsTrigger>
              </TabsList>

              <TabsContent value="accuracy" className="space-y-4 mt-4">
                <div className="h-[300px]">
                  <AIChart
                    title="AI Accuracy by Category"
                    type="bar"
                    categories={[
                      "Vehicle Detection",
                      "Damage Assessment",
                      "Incident Reconstruction",
                      "Casualty Assessment",
                      "Context Analysis",
                    ]}
                    data={[94, 87, 92, 91, 82]}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  The AI system maintains high accuracy across all categories, with vehicle detection being the most
                  accurate at 94%. Context analysis shows the most room for improvement at 82%.
                </p>
              </TabsContent>

              <TabsContent value="processing" className="space-y-4 mt-4">
                <div className="h-[300px]">
                  <AIChart
                    title="Average Processing Time (minutes)"
                    type="line"
                    categories={["Jan", "Feb", "Mar", "Apr", "May", "Jun"]}
                    data={[8.2, 7.5, 6.1, 4.8, 3.5, 3.2]}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Processing times have steadily improved over the past 6 months, with the current average processing
                  time at 3.2 minutes per incident report.
                </p>
              </TabsContent>

              <TabsContent value="confidence" className="space-y-4 mt-4">
                <div className="h-[300px]">
                  <AIChart
                    title="Confidence Score Distribution"
                    type="pie"
                    categories={["High (90%+)", "Medium (70-89%)", "Low (<70%)"]}
                    data={[68, 27, 5]}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  68% of all AI reports are generated with high confidence (90% or higher), while only 5% have low
                  confidence scores requiring additional human review.
                </p>
              </TabsContent>

              <TabsContent value="trends" className="space-y-4 mt-4">
                <div className="h-[300px]">
                  <AIChart
                    title="Monthly Report Volume"
                    type="line"
                    categories={["Jan", "Feb", "Mar", "Apr", "May", "Jun"]}
                    data={[42, 48, 53, 61, 68, 72]}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  The number of reports processed by the AI system has been steadily increasing, with a 71% increase in
                  volume over the past 6 months.
                </p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>AI Query Interface</CardTitle>
          <CardDescription>Ask the AI system questions about incidents, trends, or specific reports</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleQuery} className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Ask the AI system a question..."
                className="pl-8"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={!query.trim()}>
              <Send className="mr-2 h-4 w-4" />
              Query
            </Button>
          </form>

          <div className="border rounded-md p-4 min-h-[200px] bg-muted/50">
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Brain className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Ask the AI system a question to see results here</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Example: "Show me trends in vehicle collisions over the past 6 months"
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Suggested Queries</h3>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuery("What are the most common causes of accidents this month?")}
              >
                Common accident causes
              </Button>
              <Button variant="outline" size="sm" onClick={() => setQuery("Show incident hotspots on Highway 101")}>
                Incident hotspots
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuery("Compare vehicle detection accuracy between day and night incidents")}
              >
                Day vs. night accuracy
              </Button>
              <Button variant="outline" size="sm" onClick={() => setQuery("Identify trends in pedestrian incidents")}>
                Pedestrian incident trends
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent AI Reports</CardTitle>
            <CardDescription>Latest reports generated by the AI system</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                id: "2023-047",
                title: "Vehicle Collision - Highway 101",
                confidence: "high",
                time: "10 minutes ago",
              },
              {
                id: "2023-046",
                title: "Pedestrian Incident - Oak St",
                confidence: "medium",
                time: "1 hour ago",
              },
              {
                id: "2023-045",
                title: "Traffic Signal Malfunction",
                confidence: "high",
                time: "2 hours ago",
              },
              {
                id: "2023-044",
                title: "Multi-vehicle Accident - Bridge",
                confidence: "high",
                time: "3 hours ago",
              },
            ].map((report) => (
              <div key={report.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex flex-col">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-sm font-medium">#{report.id}</h4>
                    <Badge
                      variant="outline"
                      className={`
                        ${
                          report.confidence === "high"
                            ? "bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20"
                            : "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 border-orange-500/20"
                        }
                      `}
                    >
                      {report.confidence === "high" ? "High Confidence" : "Medium Confidence"}
                    </Badge>
                  </div>
                  <p className="text-sm">{report.title}</p>
                  <p className="text-xs text-muted-foreground">Generated: {report.time}</p>
                </div>
                <Button size="sm" variant="outline" asChild>
                  <Link href={`/dashboard/chief/ai-insights/${report.id}`}>
                    <FileText className="mr-2 h-4 w-4" />
                    View
                  </Link>
                </Button>
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/dashboard/chief/reports">View All Reports</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Insights</CardTitle>
            <CardDescription>AI-generated insights and recommendations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 p-3 border rounded-lg">
              <div className="flex items-center space-x-2">
                <Brain className="h-5 w-5 text-primary" />
                <h4 className="text-sm font-medium">Incident Hotspot Detected</h4>
              </div>
              <p className="text-sm">
                The AI system has identified a significant increase in incidents at the intersection of Main St and Oak
                Ave. Analysis suggests this may be related to recent construction and changed traffic patterns.
              </p>
              <Button size="sm" variant="outline" className="w-full mt-2">
                View Detailed Analysis
              </Button>
            </div>

            <div className="space-y-2 p-3 border rounded-lg">
              <div className="flex items-center space-x-2">
                <Brain className="h-5 w-5 text-primary" />
                <h4 className="text-sm font-medium">Pattern Recognition Alert</h4>
              </div>
              <p className="text-sm">
                The AI system has detected a 27% increase in rear-end collisions during morning rush hour (7-9 AM) over
                the past month. Contributing factors appear to be increased traffic volume and distracted driving.
              </p>
              <Button size="sm" variant="outline" className="w-full mt-2">
                View Detailed Analysis
              </Button>
            </div>

            <div className="space-y-2 p-3 border rounded-lg">
              <div className="flex items-center space-x-2">
                <Brain className="h-5 w-5 text-primary" />
                <h4 className="text-sm font-medium">System Improvement Recommendation</h4>
              </div>
              <p className="text-sm">
                Based on recent performance metrics, the AI system recommends additional training data for the Context
                Analysis module to improve accuracy in low-light conditions.
              </p>
              <Button size="sm" variant="outline" className="w-full mt-2">
                View Recommendation Details
              </Button>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Export Insights Report
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
