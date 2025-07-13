"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            {/* Header Skeleton */}
            <div className="space-y-4">
              <Skeleton className="h-10 w-80 rounded-xl" />
              <Skeleton className="h-6 w-96 rounded-lg" />
            </div>
            
            {/* Stats Grid Skeleton */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <Skeleton className="h-8 w-32 rounded-lg" />
                      <Skeleton className="h-12 w-20 rounded-xl" />
                      <Skeleton className="h-4 w-24 rounded" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                  Traffic Dashboard
                </h1>
                <p className="text-slate-600 dark:text-slate-400 text-lg">
                  Welcome back! Here's an overview of your recent activity.
                </p>
              </div>
              <Button
                onClick={refreshData}
                variant="outline"
                className="border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl text-red-600 dark:text-red-400 font-semibold"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Retry
              </Button>
            </div>
            <Card className="border-red-200 dark:border-red-800 bg-red-100 dark:bg-red-800/30 rounded-2xl shadow-lg">
              <CardContent className="p-8 text-center">
                <AlertTriangle className="h-12 w-12 text-red-600 dark:text-red-400 mx-auto mb-4" />
                <p className="text-red-700 dark:text-red-300 font-semibold text-xl">Failed to Load Dashboard Data</p>
                <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm">{error}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Main stats cards
  const mainStats = [
    {
      label: 'Total Incidents',
      value: totalIncidentsAnimated,
      icon: <Car className="h-6 w-6" />,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      label: 'Total Evidence',
      value: totalEvidenceAnimated,
      icon: <Upload className="h-6 w-6" />,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
      textColor: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      label: 'Total Casualties',
      value: totalCasualtiesAnimated,
      icon: <Users className="h-6 w-6" />,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      textColor: 'text-red-600 dark:text-red-400',
    },
    {
      label: 'Total Vehicles',
      value: totalVehiclesAnimated,
      icon: <Car className="h-6 w-6" />,
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-50 dark:bg-amber-900/20',
      textColor: 'text-amber-600 dark:text-amber-400',
    },
  ];

  // Report status cards
  const reportStats = [
    {
      label: 'Pending Reports',
      value: pendingReportsAnimated,
      icon: <Clock className="h-5 w-5" />,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    },
    {
      label: 'Completed This Week',
      value: completedThisWeekAnimated,
      icon: <CheckCircle className="h-5 w-5" />,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
    },
    {
      label: 'Rejected Reports',
      value: urgentActionsAnimated,
      icon: <AlertTriangle className="h-5 w-5" />,
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-3">
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                Traffic Dashboard
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl">
                Monitor traffic incidents, evidence, and reports in real-time. Get insights into your department's performance and recent activities.
              </p>
            </div>
            <div className="flex gap-3">
              <Button asChild className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-200">
                <Link href="/dashboard/traffic/new-incident" className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  New Incident
                </Link>
              </Button>
              <Button variant="outline" className="border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl px-6 py-3">
                <RefreshCw className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Main Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12">
          {mainStats.map((stat) => (
            <Card key={stat.label} className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl hover:shadow-xl transition-all duration-300 group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                    <div className={stat.textColor}>{stat.icon}</div>
                  </div>
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                </div>
                <div className="space-y-2">
                  <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">{stat.value}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Report Status Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">Report Status</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {reportStats.map((stat) => (
              <Card key={stat.label} className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                      <div className={stat.color}>{stat.icon}</div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">{stat.value}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">{stat.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Charts Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">Analytics Overview</h2>
          
          {/* Data Color Legend */}
          <div className="mb-8">
            <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">Data Categories</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Incident Types */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">Incident Types</h4>
                    <div className="space-y-2">
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

                  {/* Severity Levels */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">Severity Levels</h4>
                    <div className="space-y-2">
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

                  {/* Evidence Types */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">Evidence Types</h4>
                    <div className="space-y-2">
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
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Make the analytics cards bigger */}
          <div className="grid gap-8 md:grid-cols-2">
            {/* Incident Type Chart */}
            <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Incident Types</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
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
            <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Severity Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
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
            <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl md:col-span-2">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Evidence Types</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
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
        </div>

        {/* Recent Activity Section */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">Recent Activity</h2>
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Recent Incidents */}
            <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-semibold text-slate-900 dark:text-slate-100">Recent Incidents</CardTitle>
                  <Link href="/dashboard/traffic/reports" className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium">
                    View All
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="p-6">
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
            <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-semibold text-slate-900 dark:text-slate-100">Recent Reports</CardTitle>
                  <Link href="/dashboard/traffic/reports" className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium">
                    View All
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="p-6">
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
            <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-semibold text-slate-900 dark:text-slate-100">Recent Evidence</CardTitle>
                  <Link href="/dashboard/traffic/upload-evidence" className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium">
                    View All
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="p-6">
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
                              <Dialog open={dialogOpen && selectedUpload?.id === upload.id} onOpenChange={(open) => { setDialogOpen(open); if (!open) setSelectedUpload(null); }}>
                                <DialogTrigger asChild>
                                  <button
                                    className="text-blue-600 dark:text-blue-400 text-xs hover:underline font-medium mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                                    onClick={() => { setSelectedUpload(upload); setDialogOpen(true); }}
                                  >
                                    Preview
                                  </button>
                                </DialogTrigger>
                                <DialogContent className="bg-white dark:bg-slate-800 rounded-2xl max-w-lg shadow-xl p-6">
                                  <DialogHeader>
                                    <DialogTitle className="text-xl font-semibold text-slate-900 dark:text-slate-100">Evidence Preview</DialogTitle>
                                    <DialogDescription className="text-slate-600 dark:text-slate-400 text-sm space-y-4">
                                      <div className="space-y-2">
                                        <p><strong>Name:</strong> {upload.name}</p>
                                        <p><strong>Type:</strong> {upload.evidenceType}</p>
                                        <p><strong>Uploaded:</strong> {upload.uploadedAt}</p>
                                      </div>
                                      {previewType.startsWith("image/") && previewUrl && (
                                        <img src={previewUrl} alt={upload.name} className="w-full max-h-60 rounded-xl border border-slate-200 dark:border-slate-700 object-contain" />
                                      )}
                                      {previewType.startsWith("video/") && previewUrl && (
                                        <video controls className="w-full max-h-60 rounded-xl border border-slate-200 dark:border-slate-700">
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
                                        <div className="text-slate-500 dark:text-slate-400 italic text-sm">Preview not available for this file type.</div>
                                      )}
                                    </DialogDescription>
                                  </DialogHeader>
                                </DialogContent>
                              </Dialog>
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
    </div>
  );
}