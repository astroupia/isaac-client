"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { AlertTriangle, ArrowRight, Car, FileText, Upload, RefreshCw, Plus, CloudUpload, TrendingUp, Users, Clock, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useTrafficDashboard } from "@/hooks/useTrafficDashboard";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "@/components/ui/chart";

// Interface for RecentUpload
interface RecentUpload {
  id: string;
  name: string;
  type: string;
  uploadedAt: string;
  evidenceType: string;
  url?: string;
  fileUrl?: string;
}

// Add interface for RecentReport to include statusLabel
interface RecentReport {
  id: string;
  title: string;
  status: string;
  statusLabel: string;
  date: string;
  incidentId?: string;
}

// Modern color palette for a professional look
const CHART_COLORS = [
  "#3b82f6", // Blue
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#ef4444", // Red
  "#8b5cf6", // Violet
  "#06b6d4", // Cyan
];

// Animated Counter Hook
function useAnimatedCounter(value: number, duration = 1000) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const increment = value / (duration / 16);
    let raf: number;
    function animate() {
      start += increment;
      if (start < value) {
        setDisplay(Math.floor(start));
        raf = requestAnimationFrame(animate);
      } else {
        setDisplay(value);
      }
    }
    animate();
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);
  return display;
}

export function TrafficDashboard() {
  const {
    stats,
    incidentTypeBreakdown,
    incidentSeverityBreakdown,
    evidenceTypeBreakdown,
    totalCasualties,
    totalVehicles,
    recentIncidents,
    recentReports: recentReportsRaw,
    recentUploads,
    loading,
    error,
    refreshData,
  } = useTrafficDashboard();
  const recentReports = recentReportsRaw as RecentReport[];
  const [selectedUpload, setSelectedUpload] = useState<RecentUpload | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Animated counters
  const totalIncidentsAnimated = useAnimatedCounter(stats.totalIncidents);
  const totalEvidenceAnimated = useAnimatedCounter(stats.totalEvidence);
  const totalCasualtiesAnimated = useAnimatedCounter(totalCasualties);
  const totalVehiclesAnimated = useAnimatedCounter(totalVehicles);
  const pendingReportsAnimated = useAnimatedCounter(stats.pendingReports);
  const completedThisWeekAnimated = useAnimatedCounter(stats.completedThisWeek);
  const urgentActionsAnimated = useAnimatedCounter(stats.urgentActions);

  if (loading) {
    return (
      <div className="space-y-6 w-full">
        <div className="flex flex-col space-y-2 w-full">
          <Skeleton className="h-10 w-80 rounded-xl" />
          <Skeleton className="h-6 w-96 rounded-lg" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 w-full">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent>
                <Skeleton className="h-8 w-32 rounded-lg" />
                <Skeleton className="h-12 w-20 rounded-xl mt-4" />
                <Skeleton className="h-4 w-24 rounded mt-2" />
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
        <div className="flex flex-col space-y-2 w-full">
          <h1 className="text-3xl font-bold tracking-tight">Traffic Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's an overview of your recent activity.</p>
        </div>
        <Button
          onClick={refreshData}
          variant="outline"
          className="text-red-600 dark:text-red-400 font-semibold w-fit"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry
        </Button>
        <Card className="border-red-200 dark:border-red-800 bg-red-100 dark:bg-red-800/30">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-red-600 dark:text-red-400 mx-auto mb-4" />
            <p className="text-red-700 dark:text-red-300 font-semibold text-xl">Failed to Load Dashboard Data</p>
            <p className="text-muted-foreground mt-2 text-sm">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main stats cards
  const mainStats = [
    {
      label: 'Total Incidents',
      value: totalIncidentsAnimated,
      icon: <Car className="h-6 w-6" />,
    },
    {
      label: 'Total Evidence',
      value: totalEvidenceAnimated,
      icon: <Upload className="h-6 w-6" />,
    },
    {
      label: 'Total Casualties',
      value: totalCasualtiesAnimated,
      icon: <Users className="h-6 w-6" />,
    },
    {
      label: 'Total Vehicles',
      value: totalVehiclesAnimated,
      icon: <Car className="h-6 w-6" />,
    },
  ];

  // Report status cards
  const reportStats = [
    {
      label: 'Pending Reports',
      value: pendingReportsAnimated,
      icon: <Clock className="h-5 w-5" />,
    },
    {
      label: 'Completed This Week',
      value: completedThisWeekAnimated,
      icon: <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />,
      highlight: true,
    },
    {
      label: 'Rejected Reports',
      value: urgentActionsAnimated,
      icon: <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />,
    },
  ];

  // Prepare chart data
  const incidentTypeData = Object.entries(incidentTypeBreakdown).map(([type, value]) => ({ name: type.replace(/_/g, ' '), value }));
  const incidentSeverityData = Object.entries(incidentSeverityBreakdown).map(([severity, value]) => ({ name: severity, value }));
  const evidenceTypeData = Object.entries(evidenceTypeBreakdown).map(([type, value]) => ({ name: type.replace(/_/g, ' '), value }));

  // Chart configs
  const incidentTypeConfig = Object.fromEntries(
    incidentTypeData.map((d, i) => [
      d.name,
      { label: d.name, color: CHART_COLORS[i % CHART_COLORS.length] },
    ])
  );
  const incidentSeverityConfig = Object.fromEntries(
    incidentSeverityData.map((d, i) => [
      d.name,
      { label: d.name, color: CHART_COLORS[i % CHART_COLORS.length] },
    ])
  );
  const evidenceTypeConfig = Object.fromEntries(
    evidenceTypeData.map((d, i) => [
      d.name,
      { label: d.name, color: CHART_COLORS[i % CHART_COLORS.length] },
    ])
  );

  return (
    <div className="space-y-6 w-full">
      {/* Header Section */}
      <div className="flex flex-col space-y-2 w-full">
        <h1 className="text-3xl font-bold tracking-tight">Traffic Dashboard</h1>
        <p className="text-muted-foreground">Monitor traffic incidents, evidence, and reports in real-time. Get insights into your department's performance and recent activities.</p>
      </div>
      <div className="flex gap-3 mb-2">
        <Button asChild className="bg-primary text-white rounded-xl px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-200">
          <Link href="/dashboard/traffic/new-incident" className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            New Incident
          </Link>
        </Button>
        <Button variant="outline" className="border-muted-foreground hover:bg-muted/50 rounded-xl px-6 py-3">
          <RefreshCw className="h-5 w-5" />
        </Button>
      </div>

      {/* Main Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 w-full">
        {mainStats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">{stat.label} {stat.icon}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Report Status Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Report Status</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 w-full">
          {reportStats.map((stat) => (
            <Card key={stat.label} className={stat.highlight ? 'bg-green-500/10 border-green-500/20' : ''}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">{stat.label} {stat.icon}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={stat.highlight ? 'text-2xl font-bold text-green-600 dark:text-green-400' : 'text-2xl font-bold'}>{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Data Categories (Legend) Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Data Categories</h2>
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Data Categories</CardTitle>
            <CardDescription>Color legend for analytics below</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Incident Types: 2 columns */}
            <div className="space-y-3">
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">Incident Types</h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-[#3b82f6]"></div>
                  <span className="text-sm text-slate-700 dark:text-slate-300">Traffic Collision</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-[#10b981]"></div>
                  <span className="text-sm text-slate-700 dark:text-slate-300">Hit and Run</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-[#f59e0b]"></div>
                  <span className="text-sm text-slate-700 dark:text-slate-300">Pedestrian Accident</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-[#ef4444]"></div>
                  <span className="text-sm text-slate-700 dark:text-slate-300">DUI Incident</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-[#8b5cf6]"></div>
                  <span className="text-sm text-slate-700 dark:text-slate-300">Speeding Violation</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-[#06b6d4]"></div>
                  <span className="text-sm text-slate-700 dark:text-slate-300">Other</span>
                </div>
              </div>
            </div>

            {/* Severity Levels: 1 column */}
            <div className="space-y-3 mt-6">
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">Severity Levels</h4>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-[#ef4444]"></div>
                  <span className="text-sm text-slate-700 dark:text-slate-300">Critical</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-[#f59e0b]"></div>
                  <span className="text-sm text-slate-700 dark:text-slate-300">High</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-[#3b82f6]"></div>
                  <span className="text-sm text-slate-700 dark:text-slate-300">Medium</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-[#10b981]"></div>
                  <span className="text-sm text-slate-700 dark:text-slate-300">Low</span>
                </div>
              </div>
            </div>

            {/* Evidence Types: 3 columns */}
            <div className="space-y-3 mt-6">
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">Evidence Types</h4>
              <div className="grid grid-cols-3 gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-[#3b82f6]"></div>
                  <span className="text-sm text-slate-700 dark:text-slate-300">Photos</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-[#10b981]"></div>
                  <span className="text-sm text-slate-700 dark:text-slate-300">Videos</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-[#f59e0b]"></div>
                  <span className="text-sm text-slate-700 dark:text-slate-300">Documents</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-[#ef4444]"></div>
                  <span className="text-sm text-slate-700 dark:text-slate-300">Audio</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-[#8b5cf6]"></div>
                  <span className="text-sm text-slate-700 dark:text-slate-300">Witness Statements</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-[#06b6d4]"></div>
                  <span className="text-sm text-slate-700 dark:text-slate-300">Other</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Section (Charts) */}
      <div className="grid gap-8 md:grid-cols-2">
        {/* Incident Type Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Incident Types</CardTitle>
          </CardHeader>
          <CardContent>
            {incidentTypeData.length === 0 ? (
              <div className="flex items-center justify-center h-64 text-slate-500 dark:text-slate-400">
                No data available
              </div>
            ) : (
              <ChartContainer config={incidentTypeConfig} className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={incidentTypeData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={110}
                      label={({ name, percent }: { name: string; percent: number }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      labelLine={false}
                      isAnimationActive={true}
                      animationDuration={800}
                    >
                      {incidentTypeData.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
        {/* Incident Severity Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Severity Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            {incidentSeverityData.length === 0 ? (
              <div className="flex items-center justify-center h-64 text-slate-500 dark:text-slate-400">
                No data available
              </div>
            ) : (
              <ChartContainer config={incidentSeverityConfig} className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={incidentSeverityData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={12} fontSize={14} />
                    <YAxis allowDecimals={false} fontSize={14} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="value" radius={6} isAnimationActive={true} animationDuration={800} barSize={40}>
                      {incidentSeverityData.map((entry, idx) => (
                        <Cell key={`cell-bar-${idx}`} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
        {/* Evidence Type Chart */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Evidence Types</CardTitle>
          </CardHeader>
          <CardContent>
            {evidenceTypeData.length === 0 ? (
              <div className="flex items-center justify-center h-64 text-slate-500 dark:text-slate-400">
                No data available
              </div>
            ) : (
              <ChartContainer config={evidenceTypeConfig} className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={evidenceTypeData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={110}
                      label={({ name, percent }: { name: string; percent: number }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      labelLine={false}
                      isAnimationActive={true}
                      animationDuration={800}
                    >
                      {evidenceTypeData.map((entry, idx) => (
                        <Cell key={`cell-ev-${idx}`} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="grid gap-6 lg:grid-cols-3 w-full">
          {/* Recent Incidents */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center justify-between">Recent Incidents <Link href="/dashboard/traffic/reports" className="text-sm text-primary hover:underline font-medium">View All</Link></CardTitle>
            </CardHeader>
            <CardContent>
              {recentIncidents.length === 0 ? (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                  No recent incidents
                </div>
              ) : (
                <div className="space-y-4">
                  {recentIncidents.slice(0, 5).map((incident) => (
                    <div key={incident.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                          <Car className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-900 dark:text-slate-100 truncate">{incident.location}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                              {incident.type.replace(/_/g, ' ')}
                            </span>
                            <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                              {incident.severity}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                            {incident.date} • {incident.casualties} casualties
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          {/* Recent Reports */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center justify-between">Recent Reports <Link href="/dashboard/traffic/reports" className="text-sm text-primary hover:underline font-medium">View All</Link></CardTitle>
            </CardHeader>
            <CardContent>
              {recentReports.length === 0 ? (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                  No recent reports
                </div>
              ) : (
                <div className="space-y-4">
                  {recentReports.slice(0, 5).map((report, idx) => (
                    <div key={report.id || idx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                          <FileText className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-900 dark:text-slate-100 truncate">
                            {report.title && report.title.trim() !== ''
                              ? report.title
                              : report.incidentId
                                ? `Report for Incident ${report.incidentId}`
                                : 'Untitled Report'}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                              report.status === 'pending' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
                              report.status === 'completed' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200' :
                              report.status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                              'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200'
                            }`}>
                              {report.statusLabel}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">{report.date}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          {/* Recent Evidence Uploads */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center justify-between">Recent Evidence <Link href="/dashboard/traffic/upload-evidence" className="text-sm text-primary hover:underline font-medium">View All</Link></CardTitle>
            </CardHeader>
            <CardContent>
              {recentUploads.length === 0 ? (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                  No recent uploads
                </div>
              ) : (
                <div className="space-y-4">
                  {recentUploads.slice(0, 5).map((upload) => {
                    const previewUrl = (upload as any).fileUrl || undefined;
                    const previewType = (upload as any).fileType || upload.type || '';
                    return (
                      <div key={upload.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                            <CloudUpload className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-slate-900 dark:text-slate-100 truncate">{upload.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                                {upload.evidenceType}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">{upload.uploadedAt}</p>
                            {previewUrl ? (
                              <a
                                href={previewUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 dark:text-blue-400 text-xs hover:underline font-medium mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded inline-block"
                              >
                                Preview
                              </a>
                            ) : (
                              <span className="text-slate-400 text-xs italic mt-2 inline-block">No preview available</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}