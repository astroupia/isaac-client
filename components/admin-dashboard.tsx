"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { UserManagement } from "@/components/admin/user-management";
import {
  Users,
  Activity,
  Shield,
  TrendingUp,
  UserCheck,
  UserX,
  Clock,
  FileText,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data for dashboard stats
  const stats = {
    totalUsers: 247,
    activeUsers: 231,
    inactiveUsers: 16,
    newUsersThisMonth: 12,
    trafficPersonnel: 89,
    investigators: 67,
    chiefs: 23,
    admins: 8,
    systemHealth: 99.8,
    activeIncidents: 15,
    resolvedToday: 8,
    pendingReports: 23,
  };

  const recentActivity = [
    {
      id: 1,
      action: "User Created",
      user: "John Smith",
      role: "traffic",
      timestamp: "2 hours ago",
      type: "create",
    },
    {
      id: 2,
      action: "User Updated",
      user: "Sarah Johnson",
      role: "investigator",
      timestamp: "4 hours ago",
      type: "update",
    },
    {
      id: 3,
      action: "User Deactivated",
      user: "Mike Wilson",
      role: "traffic",
      timestamp: "6 hours ago",
      type: "deactivate",
    },
    {
      id: 4,
      action: "Role Changed",
      user: "Emily Davis",
      role: "chief",
      timestamp: "1 day ago",
      type: "role_change",
    },
    {
      id: 5,
      action: "Password Reset",
      user: "Robert Brown",
      role: "investigator",
      timestamp: "2 days ago",
      type: "password_reset",
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "create":
        return <UserCheck className="h-4 w-4 text-green-500" />;
      case "update":
        return <FileText className="h-4 w-4 text-blue-500" />;
      case "deactivate":
        return <UserX className="h-4 w-4 text-red-500" />;
      case "role_change":
        return <Shield className="h-4 w-4 text-orange-500" />;
      case "password_reset":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "traffic":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "investigator":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "chief":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      case "admin":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage users, monitor system activity, and oversee platform
          operations.
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>User Management</span>
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center space-x-2">
            <Activity className="h-4 w-4" />
            <span>Activity Logs</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* System Overview Stats */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Users
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <p className="text-xs text-muted-foreground">
                  +{stats.newUsersThisMonth} from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Users
                </CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeUsers}</div>
                <p className="text-xs text-muted-foreground">
                  {((stats.activeUsers / stats.totalUsers) * 100).toFixed(1)}%
                  of total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  System Health
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.systemHealth}%</div>
                <p className="text-xs text-muted-foreground">
                  All systems operational
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Incidents
                </CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.activeIncidents}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stats.resolvedToday} resolved today
                </p>
              </CardContent>
            </Card>
          </div>

          {/* User Role Distribution */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>User Role Distribution</CardTitle>
                <CardDescription>
                  Breakdown of users by role across the platform
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                      Traffic
                    </Badge>
                    <span className="text-sm">Traffic Personnel</span>
                  </div>
                  <span className="font-medium">{stats.trafficPersonnel}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-purple-500/10 text-purple-500 border-purple-500/20">
                      Investigator
                    </Badge>
                    <span className="text-sm">Investigators</span>
                  </div>
                  <span className="font-medium">{stats.investigators}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20">
                      Chief
                    </Badge>
                    <span className="text-sm">Chief Analysts</span>
                  </div>
                  <span className="font-medium">{stats.chiefs}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-red-500/10 text-red-500 border-red-500/20">
                      Admin
                    </Badge>
                    <span className="text-sm">Administrators</span>
                  </div>
                  <span className="font-medium">{stats.admins}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
                <CardDescription>
                  Current platform health and performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Server Uptime</span>
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 bg-green-500 rounded-full" />
                    <span className="text-sm font-medium">99.8%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Database Health</span>
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 bg-green-500 rounded-full" />
                    <span className="text-sm font-medium">Optimal</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">API Response Time</span>
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 bg-green-500 rounded-full" />
                    <span className="text-sm font-medium">&lt; 200ms</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Storage Usage</span>
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 bg-yellow-500 rounded-full" />
                    <span className="text-sm font-medium">67%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users">
          <UserManagement />
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Recent Activity</span>
              </CardTitle>
              <CardDescription>
                Latest user management actions and system events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center space-x-4 p-3 bg-muted/50 rounded-lg"
                  >
                    {getActivityIcon(activity.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium">{activity.action}</p>
                        <Badge
                          className={getRoleBadgeColor(activity.role)}
                          variant="outline"
                        >
                          {activity.role}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        User: {activity.user}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{activity.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
