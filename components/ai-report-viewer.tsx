"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Brain,
  Car,
  Check,
  Download,
  FileText,
  MessageSquare,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import Link from "next/link";

interface AIReportViewerProps {
  id: string;
}

export function AIReportViewer({ id }: AIReportViewerProps) {
  const { toast } = useToast();
  const [feedback, setFeedback] = useState("");

  const handleFeedback = (type: "positive" | "negative") => {
    toast({
      title: "Feedback submitted",
      description: `Thank you for your ${type} feedback on this AI report.`,
    });
  };

  const handleNotifyChief = () => {
    toast({
      title: "Chief Analyst notified",
      description: "Your message has been sent to the Chief Analyst.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/investigator">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      <div className="flex flex-col space-y-2">
        <div className="flex items-center space-x-2">
          <h1 className="text-3xl font-bold tracking-tight">AI Report #{id}</h1>
          <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20">
            High Confidence
          </Badge>
        </div>
        <p className="text-muted-foreground">
          Vehicle Collision - Highway 101 • Generated on April 24, 2025
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Analysis Results</CardTitle>
              <CardDescription>
                Comprehensive analysis of incident #{id}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="summary">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="summary">Summary</TabsTrigger>
                  <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
                  <TabsTrigger value="environment">Environment</TabsTrigger>
                  <TabsTrigger value="casualties">Casualties</TabsTrigger>
                </TabsList>

                <TabsContent value="summary" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Incident Overview</h3>
                    <p className="text-sm">
                      The AI system has analyzed all available evidence for
                      incident #{id} and determined with high confidence (92%)
                      that this was a multi-vehicle collision involving 3
                      vehicles on Highway 101. The incident occurred at
                      approximately 10:30 AM on April 24, 2025, during clear
                      weather conditions with dry road surfaces.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Key Findings</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>
                        Primary cause: Unsafe lane change by Vehicle 1 (red
                        sedan)
                      </li>
                      <li>
                        Contributing factors: Excessive speed by Vehicle 2 (blue
                        SUV)
                      </li>
                      <li>
                        Environmental factors: Sun glare reported by witnesses
                      </li>
                      <li>Casualties: 2 minor injuries, no fatalities</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Incident Timeline</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start space-x-2">
                        <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                          <span className="text-xs font-medium text-primary">
                            1
                          </span>
                        </div>
                        <p>
                          10:28 AM - Vehicle 1 (red sedan) attempts to change
                          lanes without proper signaling
                        </p>
                      </div>
                      <div className="flex items-start space-x-2">
                        <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                          <span className="text-xs font-medium text-primary">
                            2
                          </span>
                        </div>
                        <p>
                          10:29 AM - Vehicle 2 (blue SUV) traveling at
                          approximately 75 mph in a 65 mph zone
                        </p>
                      </div>
                      <div className="flex items-start space-x-2">
                        <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                          <span className="text-xs font-medium text-primary">
                            3
                          </span>
                        </div>
                        <p>
                          10:30 AM - Vehicle 1 collides with Vehicle 2, causing
                          both to lose control
                        </p>
                      </div>
                      <div className="flex items-start space-x-2">
                        <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                          <span className="text-xs font-medium text-primary">
                            4
                          </span>
                        </div>
                        <p>
                          10:30 AM - Vehicle 3 (white pickup) unable to stop in
                          time, collides with Vehicle 2
                        </p>
                      </div>
                      <div className="flex items-start space-x-2">
                        <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                          <span className="text-xs font-medium text-primary">
                            5
                          </span>
                        </div>
                        <p>
                          10:31 AM - All vehicles come to a stop, blocking two
                          lanes of traffic
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="vehicles" className="space-y-4 mt-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-base">Vehicle 1</CardTitle>
                        <CardDescription>Red Sedan</CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-0 space-y-2">
                        <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                          <Car className="h-12 w-12 text-muted-foreground" />
                        </div>
                        <div className="space-y-1 text-sm">
                          <p>
                            <span className="font-medium">Make/Model:</span>{" "}
                            Toyota Camry
                          </p>
                          <p>
                            <span className="font-medium">Year:</span> 2022
                          </p>
                          <p>
                            <span className="font-medium">Damage:</span>{" "}
                            Front-end, moderate
                          </p>
                          <p>
                            <span className="font-medium">Occupants:</span> 1
                            driver (minor injuries)
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-base">Vehicle 2</CardTitle>
                        <CardDescription>Blue SUV</CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-0 space-y-2">
                        <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                          <Car className="h-12 w-12 text-muted-foreground" />
                        </div>
                        <div className="space-y-1 text-sm">
                          <p>
                            <span className="font-medium">Make/Model:</span>{" "}
                            Honda CR-V
                          </p>
                          <p>
                            <span className="font-medium">Year:</span> 2020
                          </p>
                          <p>
                            <span className="font-medium">Damage:</span> Side
                            and rear, severe
                          </p>
                          <p>
                            <span className="font-medium">Occupants:</span> 2 (1
                            with minor injuries)
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-base">Vehicle 3</CardTitle>
                        <CardDescription>White Pickup</CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-0 space-y-2">
                        <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                          <Car className="h-12 w-12 text-muted-foreground" />
                        </div>
                        <div className="space-y-1 text-sm">
                          <p>
                            <span className="font-medium">Make/Model:</span>{" "}
                            Ford F-150
                          </p>
                          <p>
                            <span className="font-medium">Year:</span> 2021
                          </p>
                          <p>
                            <span className="font-medium">Damage:</span> Front
                            bumper, minor
                          </p>
                          <p>
                            <span className="font-medium">Occupants:</span> 1
                            driver (no injuries)
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">
                      Vehicle Trajectory Analysis
                    </h3>
                    <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                      <p className="text-sm text-muted-foreground">
                        Vehicle trajectory visualization would appear here
                      </p>
                    </div>
                    <p className="text-sm">
                      The AI system has reconstructed the vehicle trajectories
                      based on physical evidence, witness statements, and
                      traffic camera footage. The analysis shows that Vehicle 1
                      initiated an unsafe lane change that directly led to the
                      collision sequence.
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="environment" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">
                      Environmental Conditions
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Card>
                        <CardContent className="p-4 space-y-2">
                          <h4 className="font-medium">Weather Conditions</h4>
                          <div className="space-y-1 text-sm">
                            <p>
                              <span className="font-medium">Sky:</span> Clear
                            </p>
                            <p>
                              <span className="font-medium">Temperature:</span>{" "}
                              72°F / 22°C
                            </p>
                            <p>
                              <span className="font-medium">Visibility:</span>{" "}
                              Good (10+ miles)
                            </p>
                            <p>
                              <span className="font-medium">Wind:</span> Light
                              (5-10 mph)
                            </p>
                            <p>
                              <span className="font-medium">
                                Precipitation:
                              </span>{" "}
                              None
                            </p>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4 space-y-2">
                          <h4 className="font-medium">Road Conditions</h4>
                          <div className="space-y-1 text-sm">
                            <p>
                              <span className="font-medium">Surface:</span> Dry
                              asphalt
                            </p>
                            <p>
                              <span className="font-medium">Lanes:</span> 4
                              lanes (2 each direction)
                            </p>
                            <p>
                              <span className="font-medium">Traffic:</span>{" "}
                              Moderate
                            </p>
                            <p>
                              <span className="font-medium">Speed Limit:</span>{" "}
                              65 mph
                            </p>
                            <p>
                              <span className="font-medium">Road Quality:</span>{" "}
                              Good condition
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">
                      Environmental Factors
                    </h3>
                    <p className="text-sm">
                      The AI analysis identified several environmental factors
                      that may have contributed to the incident: 1. Sun glare:
                      The incident occurred in the morning with the sun at a low
                      angle in the east, potentially causing glare for eastbound
                      drivers. 2. High traffic volume: Moderate to heavy traffic
                      was present at the time of the incident, reducing reaction
                      time for drivers. 3. Merging lane: The collision occurred
                      near a merging lane, which often requires additional
                      driver attention. 4. Road curvature: A slight curve in the
                      road may have limited visibility for Vehicle 3.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Location Analysis</h3>
                    <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                      <p className="text-sm text-muted-foreground">
                        Map visualization would appear here
                      </p>
                    </div>
                    <p className="text-sm">
                      The incident occurred at mile marker 42 on Highway 101, a
                      section known for previous incidents. The AI system has
                      identified this as a potential hotspot for traffic
                      incidents, with 3 similar collisions reported in the past
                      12 months.
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="casualties" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Casualty Assessment</h3>
                    <p className="text-sm">
                      The AI system has analyzed medical reports and on-scene
                      assessments to provide the following casualty information:
                    </p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-base">Casualty 1</CardTitle>
                        <CardDescription>Driver of Vehicle 1</CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-0 space-y-2">
                        <div className="space-y-1 text-sm">
                          <p>
                            <span className="font-medium">
                              Injury Severity:
                            </span>{" "}
                            Minor
                          </p>
                          <p>
                            <span className="font-medium">Type:</span>{" "}
                            Contusions, minor lacerations
                          </p>
                          <p>
                            <span className="font-medium">Treatment:</span>{" "}
                            On-scene first aid, no hospitalization
                          </p>
                          <p>
                            <span className="font-medium">
                              Airbag Deployed:
                            </span>{" "}
                            Yes
                          </p>
                          <p>
                            <span className="font-medium">Seatbelt Used:</span>{" "}
                            Yes
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-base">Casualty 2</CardTitle>
                        <CardDescription>
                          Passenger of Vehicle 2
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-0 space-y-2">
                        <div className="space-y-1 text-sm">
                          <p>
                            <span className="font-medium">
                              Injury Severity:
                            </span>{" "}
                            Minor
                          </p>
                          <p>
                            <span className="font-medium">Type:</span> Whiplash,
                            shoulder strain
                          </p>
                          <p>
                            <span className="font-medium">Treatment:</span>{" "}
                            Transported to hospital, released same day
                          </p>
                          <p>
                            <span className="font-medium">
                              Airbag Deployed:
                            </span>{" "}
                            Yes (side)
                          </p>
                          <p>
                            <span className="font-medium">Seatbelt Used:</span>{" "}
                            Yes
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">
                      Safety System Analysis
                    </h3>
                    <p className="text-sm">
                      The AI system has analyzed the effectiveness of vehicle
                      safety systems in this incident:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>
                        All airbags deployed as designed, significantly reducing
                        injury severity
                      </li>
                      <li>
                        Seatbelt use by all occupants was a critical factor in
                        minimizing injuries
                      </li>
                      <li>
                        Vehicle 2&apos;s automatic emergency braking system
                        activated but had insufficient time to prevent collision
                      </li>
                      <li>
                        Vehicle 1&apos;s lane departure warning system did not
                        activate prior to the lane change (driver override)
                      </li>
                    </ul>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-between border-t p-4">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleFeedback("positive")}
                >
                  <ThumbsUp className="mr-2 h-4 w-4" />
                  Helpful
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleFeedback("negative")}
                >
                  <ThumbsDown className="mr-2 h-4 w-4" />
                  Not Helpful
                </Button>
              </div>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Download Report
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Evidence Analysis</CardTitle>
              <CardDescription>
                AI processing of submitted evidence
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                    <p className="text-sm text-muted-foreground">
                      Photo evidence 1
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Dashboard camera from Vehicle 3
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                    <p className="text-sm text-muted-foreground">
                      Photo evidence 2
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Traffic camera footage
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                    <p className="text-sm text-muted-foreground">
                      Photo evidence 3
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Post-incident scene photo
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">AI Evidence Processing</h3>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm">Vehicle Detection</p>
                      <span className="text-sm">94%</span>
                    </div>
                    <Progress value={94} className="h-2" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm">Damage Assessment</p>
                      <span className="text-sm">87%</span>
                    </div>
                    <Progress value={87} className="h-2" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm">Trajectory Reconstruction</p>
                      <span className="text-sm">92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm">Overall Confidence</p>
                      <span className="text-sm">92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Report Actions</CardTitle>
              <CardDescription>Actions for this AI report</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full justify-start" asChild>
                <Link href={`/dashboard/investigator/cases/${id}`}>
                  <FileText className="mr-2 h-4 w-4" />
                  View Full Case
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Brain className="mr-2 h-4 w-4" />
                Ask AI Follow-up Questions
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Download className="mr-2 h-4 w-4" />
                Download Report
              </Button>
              <Separator />
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Notify Chief Analyst</h3>
                <Textarea
                  placeholder="Add a message for the Chief Analyst..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                />
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleNotifyChief}
                  disabled={!feedback.trim()}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI Report Metadata</CardTitle>
              <CardDescription>
                Technical information about this report
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <p className="text-sm text-muted-foreground">Report ID</p>
                  <p className="text-sm font-medium">AI-{id}-2025</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm text-muted-foreground">Generated</p>
                  <p className="text-sm font-medium">
                    April 24, 2025, 11:45 AM
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm text-muted-foreground">
                    Processing Time
                  </p>
                  <p className="text-sm font-medium">3 minutes, 12 seconds</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm text-muted-foreground">
                    Evidence Processed
                  </p>
                  <p className="text-sm font-medium">12 items</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm text-muted-foreground">
                    AI Model Version
                  </p>
                  <p className="text-sm font-medium">ISAAC v3.2.1</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm text-muted-foreground">
                    Confidence Score
                  </p>
                  <p className="text-sm font-medium">92% (High)</p>
                </div>
              </div>

              <div className="flex items-center p-2 bg-green-500/10 rounded-md">
                <Check className="h-4 w-4 text-green-500 mr-2" />
                <p className="text-xs text-green-600 dark:text-green-400">
                  This report has been verified by the ISAAC AI system with high
                  confidence.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
