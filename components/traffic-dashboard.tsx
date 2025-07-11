"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertTriangle, ArrowRight, Car, FileText, Upload, RefreshCw, Plus, CloudUpload } from "lucide-react";
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

// Updated chart color palette for a professional look
const CHART_COLORS = [
  "#1e40af", // Deep blue
  "#15803d", // Forest green
  "#d97706", // Amber
  "#b91c1c", // Deep red
  "#6b21a8", // Purple
  "#ca8a04", // Gold
];

// Animated Counter Hook with adjusted duration
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

  // Animated counters with a slightly longer duration for smoothness
  const totalIncidentsAnimated = useAnimatedCounter(stats.totalIncidents);
  const totalEvidenceAnimated = useAnimatedCounter(stats.totalEvidence);
  const totalCasualtiesAnimated = useAnimatedCounter(totalCasualties);
  const totalVehiclesAnimated = useAnimatedCounter(totalVehicles);
  const pendingReportsAnimated = useAnimatedCounter(stats.pendingReports);
  const completedThisWeekAnimated = useAnimatedCounter(stats.completedThisWeek);
  const urgentActionsAnimated = useAnimatedCounter(stats.urgentActions);

  if (loading) {
    return (
      <div className="space-y-6 p-6 max-w-7xl mx-auto">
        <div className="flex flex-col space-y-2">
          <Skeleton className="h-8 w-64 rounded-lg" />
          <Skeleton className="h-4 w-80 rounded-lg" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24 rounded-lg" />
                <Skeleton className="h-4 w-4 rounded-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2 rounded-lg" />
                <Skeleton className="h-3 w-32 rounded-lg" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 p-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
              Traffic Personnel Dashboard
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Welcome back! Here's an overview of your recent activity.
            </p>
          </div>
          <Button
            onClick={refreshData}
            variant="outline"
            className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300"
          >
            <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
            Retry
          </Button>
        </div>
        <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 rounded-lg shadow-sm">
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400 mx-auto mb-2" aria-hidden="true" />
            <p className="text-red-700 dark:text-red-300 font-medium">Failed to load dashboard data</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Stat cards with improved styling
  const statCards = [
    {
      label: 'Total Incidents',
      value: totalIncidentsAnimated,
      icon: <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" aria-label="Total Incidents" />,
      bgIcon: <FileText className="absolute right-4 top-4 opacity-10 text-5xl text-blue-200 dark:text-blue-800 pointer-events-none" aria-hidden="true" />,
      color: 'text-blue-600 dark:text-blue-400',
    },
    {
      label: 'Total Evidence',
      value: totalEvidenceAnimated,
      icon: <Upload className="h-5 w-5 text-green-600 dark:text-green-400" aria-label="Total Evidence" />,
      bgIcon: <Upload className="absolute right-4 top-4 opacity-10 text-5xl text-green-200 dark:text-green-800 pointer-events-none" aria-hidden="true" />,
      color: 'text-green-600 dark:text-green-400',
    },
    {
      label: 'Total Casualties',
      value: totalCasualtiesAnimated,
      icon: <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" aria-label="Total Casualties" />,
      bgIcon: <AlertTriangle className="absolute right-4 top-4 opacity-10 text-5xl text-red-200 dark:text-red-800 pointer-events-none" aria-hidden="true" />,
      color: 'text-red-600 dark:text-red-400',
    },
    {
      label: 'Total Vehicles',
      value: totalVehiclesAnimated,
      icon: <Car className="h-5 w-5 text-yellow-600 dark:text-yellow-400" aria-label="Total Vehicles" />,
      bgIcon: <Car className="absolute right-4 top-4 opacity-10 text-5xl text-yellow-200 dark:text-yellow-800 pointer-events-none" aria-hidden="true" />,
      color: 'text-yellow-600 dark:text-yellow-400',
    },
  ];

  // Report status cards
  const reportCards = [
    {
      label: 'Pending Reports',
      value: pendingReportsAnimated,
      icon: <FileText className="h-5 w-5 text-orange-600 dark:text-orange-400" aria-label="Pending Reports" />,
      color: 'text-orange-600 dark:text-orange-400',
    },
    {
      label: 'Completed This Week',
      value: completedThisWeekAnimated,
      icon: <FileText className="h-5 w-5 text-green-600 dark:text-green-400" aria-label="Completed Reports" />,
      color: 'text-green-600 dark:text-green-400',
    },
    {
      label: 'Rejected Reports',
      value: urgentActionsAnimated,
      icon: <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" aria-label="Rejected Reports" />,
      color: 'text-red-600 dark:text-red-400',
    },
  ];

  // Quick Actions
  const quickActions = [
    {
      label: 'Create Incident',
      icon: <Plus className="h-4 w-4 mr-2" aria-hidden="true" />,
      href: '/dashboard/traffic/new-incident',
      variant: 'default',
    },
  ];

  // Prepare chart data
  const incidentTypeData = Object.entries(incidentTypeBreakdown).map(([type, value]) => ({ name: type.replace(/_/g, ' '), value }));
  const incidentSeverityData = Object.entries(incidentSeverityBreakdown).map(([severity, value]) => ({ name: severity, value }));
  const evidenceTypeData = Object.entries(evidenceTypeBreakdown).map(([type, value]) => ({abei: type.replace(/_/g, ' '), value }));

  // Chart configs with improved colors
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
  // evidenceTypeData uses 'abei' as the key instead of 'name'
  const evidenceTypeConfig = Object.fromEntries(
    evidenceTypeData.map((d, i) => [
      d.abei,
      { label: d.abei, color: CHART_COLORS[i % CHART_COLORS.length] },
    ])
  );

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto font-sans">
      {/* Header with improved typography and spacing */}
      <div className="sticky top-0 z-30 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm p-4 rounded-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col space-y-1.5">
            <h1 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Car className="h-6 w-6 text-blue-600 dark:text-blue-400" aria-hidden="true" />
              Traffic Personnel Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm max-w-md">
              Monitor traffic incidents, evidence, and reports in real-time.
            </p>
          </div>
          <div className="flex gap-2">
            {quickActions.map((action) => (
              <Button
                key={action.label}
                asChild
                variant={action.variant as
                  | "link"
                  | "default"
                  | "destructive"
                  | "outline"
                  | "secondary"
                  | "ghost"
                  | null
                  | undefined}
                className="font-medium bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg px-4 py-2 transition-colors duration-200"
              >
                <Link href={action.href} className="flex items-center">
                  {action.icon}
                  {action.label}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Overview</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((card) => (
            <Card
              key={card.label}
              className="relative overflow-hidden border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              {card.bgIcon}
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">{card.label}</CardTitle>
                <div className="rounded-full bg-gray-100 dark:bg-gray-700 p-1.5">{card.icon}</div>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className={`text-2xl font-bold ${card.color}`}>{card.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Report Status Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Report Status</h2>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {reportCards.map((card) => (
            <Card
              key={card.label}
              className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">{card.label}</CardTitle>
                <div className="p-1.5 rounded-full bg-gray-100 dark:bg-gray-700">{card.icon}</div>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className={`text-xl font-bold ${card.color}`}>{card.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Breakdown & Chart Section */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Incident Type Donut Chart */}
        <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="px-4 pt-4 pb-2">
            <CardTitle className="text-base font-semibold text-gray-900 dark:text-gray-100">Incident Type Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {incidentTypeData.length === 0 ? (
              <span className="text-gray-500 dark:text-gray-400 text-sm">No data available</span>
            ) : (
              <ChartContainer config={incidentTypeConfig} className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={incidentTypeData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={40} // Added for donut style
                      outerRadius={70}
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
                    <ChartLegend content={<ChartLegendContent />} align="center" verticalAlign="bottom" />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
        {/* Incident Severity Bar Chart */}
        <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="px-4 pt-4 pb-2">
            <CardTitle className="text-base font-semibold text-gray-900 dark:text-gray-100">Incident Severity Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {incidentSeverityData.length === 0 ? (
              <span className="text-gray-500 dark:text-gray-400 text-sm">No data available</span>
            ) : (
              <ChartContainer config={incidentSeverityConfig} className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={incidentSeverityData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                    <YAxis allowDecimals={false} fontSize={12} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="value" radius={4} isAnimationActive={true} animationDuration={800}>
                      {incidentSeverityData.map((entry, idx) => (
                        <Cell key={`cell-bar-${idx}`} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                      ))}
                    </Bar>
                    <ChartLegend content={<ChartLegendContent />} align="center" verticalAlign="bottom" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
        {/* Evidence Type Donut Chart */}
        <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="px-4 pt-4 pb-2">
            <CardTitle className="text-base font-semibold text-gray-900 dark:text-gray-100">Evidence Type Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {evidenceTypeData.length === 0 ? (
              <span className="text-gray-500 dark:text-gray-400 text-sm">No data available</span>
            ) : (
              <ChartContainer config={evidenceTypeConfig} className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={evidenceTypeData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={40} // Added for donut style
                      outerRadius={70}
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
                    <ChartLegend content={<ChartLegendContent />} align="center" verticalAlign="bottom" />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Section */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Recent Incidents */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Recent Incidents</h2>
            <Link href="/dashboard/traffic/reports" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">View All</Link>
          </div>
          <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-4">
              {recentIncidents.length === 0 ? (
                <span className="text-gray-500 dark:text-gray-400 text-sm">No recent incidents.</span>
              ) : (
                <ul className="space-y-4">
                  {recentIncidents.map((incident) => (
                    <li key={incident.id} className="flex flex-col gap-1 border-b border-gray-100 dark:border-gray-700 pb-3 last:border-b-0 last:pb-0">
                      <div className="flex flex-wrap items-center gap-2 text-sm">
                        <Car className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0" aria-hidden="true" />
                        <span className="font-medium truncate text-gray-900 dark:text-gray-100">{incident.location}</span>
                        <span className="inline-flex px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          {incident.type.replace(/_/g, ' ')}
                        </span>
                        <span className="inline-flex px-2 py-0.5 rounded text-xs font-semibold bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                          Severity: {incident.severity}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{incident.date}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">Casualties: {incident.casualties}</span>
                      <span className="text-xs italic text-gray-500 dark:text-gray-400 truncate">{incident.description}</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
        {/* Recent Reports */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Recent Reports</h2>
            <Link href="/dashboard/traffic/reports" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">View All</Link>
          </div>
          <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-4">
              {recentReports.length === 0 ? (
                <span className="text-gray-500 dark:text-gray-400 text-sm">No recent reports.</span>
              ) : (
                <ul className="space-y-4">
                  {recentReports.map((report, idx) => (
                    <li key={report.id || `${report.title || report.incidentId || idx}`} className="flex flex-col gap-1 border-b border-gray-100 dark:border-gray-700 pb-3 last:border-b-0 last:pb-0">
                      <div className="flex flex-wrap items-center gap-2 text-sm">
                        <FileText className="h-4 w-4 text-orange-600 dark:text-orange-400 flex-shrink-0" aria-hidden="true" />
                        <span className="font-medium truncate text-gray-900 dark:text-gray-100">
                          {report.title && report.title.trim() !== ''
                            ? report.title
                            : report.incidentId
                              ? `Report for Incident ${report.incidentId}`
                              : 'Untitled Report'}
                        </span>
                        <span className={`inline-flex px-2 py-0.5 rounded text-xs font-semibold ${report.status === 'pending' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' : report.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : report.status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}>
                          {report.statusLabel}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{report.date}</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
        {/* Recent Evidence Uploads */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Recent Evidence Uploads</h2>
            <Link href="/dashboard/traffic/upload-evidence" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">View All</Link>
          </div>
          <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-4">
              {recentUploads.length === 0 ? (
                <span className="text-gray-500 dark:text-gray-400 text-sm">No recent uploads.</span>
              ) : (
                <ul className="space-y-4">
                  {recentUploads.map((upload) => {
                    const previewUrl = (upload as any).fileUrl || undefined;
                    const previewType = (upload as any).fileType || upload.type || '';
                    return (
                      <li key={upload.id} className="flex flex-col gap-1 border-b border-gray-100 dark:border-gray-700 pb-3 last:border-b-0 last:pb-0">
                        <div className="flex flex-wrap items-center gap-2 text-sm">
                          <CloudUpload className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" aria-hidden="true" />
                          <span className="font-medium truncate text-gray-900 dark:text-gray-100">{upload.name}</span>
                          <span className="inline-flex px-2 py-0.5 rounded text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            {upload.evidenceType}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{upload.uploadedAt}</span>
                        <Dialog open={dialogOpen && selectedUpload?.id === upload.id} onOpenChange={(open) => { setDialogOpen(open); if (!open) setSelectedUpload(null); }}>
                          <DialogTrigger asChild>
                            <button
                              className="text-blue-600 dark:text-blue-400 text-xs hover:underline w-fit focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                              onClick={() => { setSelectedUpload(upload); setDialogOpen(true); }}
                            >
                              Preview
                            </button>
                          </DialogTrigger>
                          <DialogContent className="bg-white dark:bg-gray-800 rounded-lg max-w-lg shadow-lg">
                            <DialogHeader>
                              <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">Evidence Preview</DialogTitle>
                              <DialogDescription className="text-gray-600 dark:text-gray-400 text-sm space-y-2">
                                <div className="space-y-1">
                                  <p><strong>Name:</strong> {upload.name}</p>
                                  <p><strong>Type:</strong> {upload.evidenceType}</p>
                                  <p><strong>Uploaded At:</strong> {upload.uploadedAt}</p>
                                </div>
                                {previewType.startsWith("image/") && previewUrl && (
                                  <img src={previewUrl} alt={upload.name} className="w-full max-h-60 rounded-lg border border-gray-200 dark:border-gray-700 object-contain" />
                                )}
                                {previewType.startsWith("video/") && previewUrl && (
                                  <video controls className="w-full max-h-60 rounded-lg border border-gray-200 dark:border-gray-700">
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
                                {(!previewType || (!previewType.startsWith("image/") && !previewType.startsWith("video/") && !previewType.startsWith("audio/"))) && (
                                  <div className="text-gray-500 dark:text-gray-400 italic text-sm">Preview not available for this file type.</div>
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
    </div>
  );
}