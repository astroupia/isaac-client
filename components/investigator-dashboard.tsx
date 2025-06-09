"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Brain, FileText, User } from "lucide-react"
import Link from "next/link"
import { CaseList } from "@/components/case-list"

export function InvestigatorDashboard() {
  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col space-y-2 w-full">
        <h1 className="text-3xl font-bold tracking-tight">Investigator Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your assigned cases and AI-generated reports.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 w-full">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assigned Cases</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Active investigations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Awaiting chief review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Analysis</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">AI reports ready</p>
          </CardContent>
        </Card>

        <Card className="bg-green-500/10 border-green-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-600 dark:text-green-400">
              Completed This Month
            </CardTitle>
            <FileText className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">8</div>
            <p className="text-xs text-green-600/80 dark:text-green-400/80">+3 from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Assigned Cases</CardTitle>
            <CardDescription>Your current case load and priorities</CardDescription>
          </CardHeader>
          <CardContent>
            <CaseList />
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/dashboard/investigator/cases">
                View All Cases
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>AI Insights</CardTitle>
            <CardDescription>Recent AI-generated analysis</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Incident #2023-045</h4>
                <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20">
                  High Confidence
                </Badge>
              </div>
              <Progress value={92} className="h-2" />
              <p className="text-xs text-muted-foreground">AI detected 3 vehicles and 2 pedestrians in the scene</p>
              <Button variant="outline" size="sm" className="w-full mt-2" asChild>
                <Link href="/dashboard/investigator/ai-reports/2023-045">View Analysis</Link>
              </Button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Incident #2023-044</h4>
                <Badge className="bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 border-orange-500/20">
                  Medium Confidence
                </Badge>
              </div>
              <Progress value={68} className="h-2" />
              <p className="text-xs text-muted-foreground">AI identified potential traffic signal malfunction</p>
              <Button variant="outline" size="sm" className="w-full mt-2" asChild>
                <Link href="/dashboard/investigator/ai-reports/2023-044">View Analysis</Link>
              </Button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Incident #2023-043</h4>
                <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20">
                  High Confidence
                </Badge>
              </div>
              <Progress value={95} className="h-2" />
              <p className="text-xs text-muted-foreground">AI reconstructed multi-vehicle collision sequence</p>
              <Button variant="outline" size="sm" className="w-full mt-2" asChild>
                <Link href="/dashboard/investigator/ai-reports/2023-043">View Analysis</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
