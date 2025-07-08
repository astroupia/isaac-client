"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RecentReports } from "@/components/recent-reports";
import { AlertTriangle, ArrowRight, Car, FileText, Upload, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useTrafficDashboard } from "@/hooks/useTrafficDashboard";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useState } from "react";

// Add type for RecentUpload
interface RecentUpload {
  id: string;
  name: string;
  type: string;
  uploadedAt: string;
  evidenceType: string;
  url?: string; // Add url as optional
  fileUrl?: string; // fallback if url is not present
}

export function TrafficDashboard() {
  const { stats, recentReports, recentUploads, loading, error, refreshData } = useTrafficDashboard();
  const [selectedUpload, setSelectedUpload] = useState<RecentUpload | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  if (loading) {
    return (
      <div className="space-y-6 w-full">
        <div className="flex flex-col space-y-2 w-full">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-2 w-full mt-3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 w-full">
        <div className="flex items-center justify-between">
          <div className="flex flex-col space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Traffic Personnel Dashboard
            </h1>
            <p className="text-muted-foreground">
              Welcome back! Here&apos;s an overview of your recent activity and
              pending tasks.
            </p>
          </div>
          <Button onClick={refreshData} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </div>
        
        <Card className="border-destructive/20 bg-destructive/5">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertTriangle className="h-8 w-8 text-destructive mx-auto mb-2" />
              <p className="text-destructive font-medium">Failed to load dashboard data</p>
              <p className="text-sm text-muted-foreground mt-1">{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col space-y-2 w-full">
        <h1 className="text-3xl font-bold tracking-tight">
          Traffic Personnel Dashboard
        </h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s an overview of your recent activity and
          pending tasks.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Reports
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingReports}</div>
            <p className="text-xs text-muted-foreground">
              Reports awaiting completion
            </p>
            <Progress value={75} className="mt-3 h-2" />
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" className="w-full" asChild>
              <Link href="/dashboard/traffic/reports">
                View pending reports
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completed This Week
            </CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedThisWeek}</div>
            <p className="text-xs text-muted-foreground">+4 from last week</p>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" className="w-full" asChild>
              <Link href="/dashboard/traffic/reports?filter=completed">
                View completed reports
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="bg-orange-500/10 border-orange-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-600 dark:text-orange-400">
              Urgent Action Required
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {stats.urgentActions}
            </div>
            <p className="text-xs text-orange-600/80 dark:text-orange-400/80">
              Incident report needs additional information
            </p>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              size="sm"
              className="w-full border-orange-500/20 text-orange-600 dark:text-orange-400 hover:bg-orange-500/10"
              asChild
            >
              <Link href="/dashboard/traffic/reports/incident-2023-045">
                Complete report
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        {/* New: Total Incidents */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Incidents
            </CardTitle>
            <Car className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalIncidents}</div>
            <p className="text-xs text-muted-foreground">
              All incidents reported
            </p>
          </CardContent>
        </Card>

        {/* New: Total Evidence */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Evidence
            </CardTitle>
            <Upload className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEvidence}</div>
            <p className="text-xs text-muted-foreground">
              All evidence items uploaded
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Reports and Uploads */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
            <CardDescription>Last 5 reports</CardDescription>
          </CardHeader>
          <CardContent>
            {recentReports.length === 0 ? (
              <p className="text-muted-foreground">No recent reports.</p>
            ) : (
              <ul className="space-y-2">
                {recentReports.map((report, idx) => (
                  <li key={report.id || `${report.title}-${idx}` } className="flex flex-col">
                    <span className="font-medium">{report.title}</span>
                    <span className="text-xs text-muted-foreground">{report.date} &mdash; {report.status}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Evidence Uploads</CardTitle>
            <CardDescription>Last 5 uploads</CardDescription>
          </CardHeader>
          <CardContent>
            {recentUploads.length === 0 ? (
              <p className="text-muted-foreground">No recent uploads.</p>
            ) : (
              <ul className="space-y-2">
                {recentUploads.map((upload) => {
                  // Use fileUrl for preview
                  const previewUrl = (upload as any).fileUrl || undefined;
                  const previewType = (upload as any).fileType || upload.type || '';
                  return (
                    <li key={upload.id} className="flex flex-col gap-1">
                      <span className="font-medium">{upload.name}</span>
                      <span className="text-xs text-muted-foreground">{upload.uploadedAt} &mdash; {upload.evidenceType}</span>
                      <Dialog open={dialogOpen && selectedUpload?.id === upload.id} onOpenChange={(open) => { setDialogOpen(open); if (!open) setSelectedUpload(null); }}>
                        <DialogTrigger asChild>
                          <button
                            className="text-blue-600 underline text-xs self-start"
                            onClick={() => { setSelectedUpload(upload); setDialogOpen(true); }}
                          >
                            Preview
                          </button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Evidence Preview</DialogTitle>
                            <DialogDescription>
                              <div className="mb-2">
                                <strong>Name:</strong> {upload.name}<br />
                                <strong>Type:</strong> {upload.evidenceType}<br />
                                <strong>Uploaded At:</strong> {upload.uploadedAt}
                              </div>
                              {/* Preview logic based on file type */}
                              {previewType.startsWith("image/") && previewUrl && (
                                <img src={previewUrl} alt={upload.name} className="max-w-full max-h-64 rounded border" />
                              )}
                              {previewType.startsWith("video/") && previewUrl && (
                                <video controls className="max-w-full max-h-64 rounded border">
                                  <source src={previewUrl} type={previewType} />
                                  Your browser does not support the video tag.
                                </video>
                              )}
                              {previewType.startsWith("audio/") && previewUrl && (
                                <audio controls className="w-full mt-2">
                                  <source src={previewUrl} type={previewType} />
                                  Your browser does not support the audio tag.
                                </audio>
                              )}
                              {/* Fallback for other types */}
                              {(!previewType || (!previewType.startsWith("image/") && !previewType.startsWith("video/") && !previewType.startsWith("audio/"))) && (
                                <div className="text-muted-foreground italic">Preview not available for this file type.</div>
                              )}
                            </DialogDescription>
                          </DialogHeader>
                        </DialogContent>
                      </Dialog>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
