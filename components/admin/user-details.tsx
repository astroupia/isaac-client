"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import type { User, UserRole } from "@/lib/models";
import {
  UserIcon,
  Mail,
  Phone,
  Building,
  Shield,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  MapPin,
  Car,
  Users,
  FileText,
  Activity,
  TrendingUp,
  Award,
} from "lucide-react";

interface UserDetailsProps {
  user: User;
}

export function UserDetails({ user }: UserDetailsProps) {
  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case "traffic":
        return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20";
      case "investigator":
        return "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20 border-purple-500/20";
      case "chief":
        return "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 border-orange-500/20";
      case "admin":
        return "bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20 border-gray-500/20";
    }
  };

  const getStatusBadgeColor = (isActive: boolean) => {
    return isActive
      ? "bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20"
      : "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20 border-gray-500/20";
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getRoleSpecificInfo = () => {
    switch (user.role) {
      case "traffic":
        return (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center space-x-3">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">District</p>
                <p className="text-sm text-muted-foreground">Downtown Patrol</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Car className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Vehicle</p>
                <p className="text-sm text-muted-foreground">UNIT-001</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Shift</p>
                <p className="text-sm text-muted-foreground">
                  Morning (6 AM - 2 PM)
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Reports Submitted</p>
                <p className="text-sm text-muted-foreground">47 this month</p>
              </div>
            </div>
          </div>
        );
      case "investigator":
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Award className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Specializations</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  <Badge variant="outline" className="text-xs">
                    Traffic Analysis
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Forensics
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Accident Reconstruction
                  </Badge>
                </div>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center space-x-3">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Current Caseload</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Progress value={60} className="w-20 h-2" />
                    <span className="text-sm text-muted-foreground">6/10</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Completed Cases</p>
                  <p className="text-sm text-muted-foreground">23 this year</p>
                </div>
              </div>
            </div>
          </div>
        );
      case "chief":
        return (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center space-x-3">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Team Size</p>
                <p className="text-sm text-muted-foreground">8 investigators</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Cases Managed</p>
                <p className="text-sm text-muted-foreground">156 total</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Analytics Access</p>
                <Badge
                  variant="outline"
                  className="bg-green-500/10 text-green-500 border-green-500/20"
                >
                  Full Access
                </Badge>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Department Performance</p>
                <p className="text-sm text-muted-foreground">95% efficiency</p>
              </div>
            </div>
          </div>
        );
      case "admin":
        return (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center space-x-3">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Access Level</p>
                <Badge
                  variant="outline"
                  className="bg-red-500/10 text-red-500 border-red-500/20"
                >
                  Level 3 - Super Admin
                </Badge>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Users Managed</p>
                <p className="text-sm text-muted-foreground">
                  247 active users
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">System Health</p>
                <p className="text-sm text-muted-foreground">99.8% uptime</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Permissions</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  <Badge variant="outline" className="text-xs">
                    User Management
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    System Config
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Security
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <ScrollArea className="h-full max-h-[70vh] pr-4">
      <div className="space-y-6">
        {/* User Profile Header */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start space-x-6">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.profileImageUrl || "/placeholder.svg"} />
                <AvatarFallback className="text-xl">
                  {user.firstName[0]}
                  {user.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-3 mb-3">
                  <h3 className="text-2xl font-bold truncate">
                    {user.firstName} {user.lastName}
                  </h3>
                  <Badge className={getStatusBadgeColor(user.isActive)}>
                    {user.isActive ? (
                      <>
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Active
                      </>
                    ) : (
                      <>
                        <XCircle className="mr-1 h-3 w-3" />
                        Inactive
                      </>
                    )}
                  </Badge>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span className="truncate">{user.email}</span>
                  </div>
                  {user.badgeId && (
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Shield className="h-4 w-4" />
                      <code className="bg-muted px-2 py-1 rounded text-xs">
                        {user.badgeId}
                      </code>
                    </div>
                  )}
                  {user.phoneNumber && (
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{user.phoneNumber}</span>
                    </div>
                  )}
                  {user.department && (
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Building className="h-4 w-4" />
                      <span className="truncate">{user.department}</span>
                    </div>
                  )}
                </div>
              </div>
              <Badge
                className={`${getRoleBadgeColor(user.role)} text-sm px-3 py-1`}
                variant="outline"
              >
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Account Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Account Created</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(user.createdAt)}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Last Updated</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(user.updatedAt)}
                  </p>
                </div>
              </div>

              {user.lastLogin && (
                <div className="flex items-center space-x-3">
                  <UserIcon className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Last Login</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(user.lastLogin)}
                    </p>
                  </div>
                </div>
              )}

              <Separator />

              <div className="space-y-2">
                <p className="text-sm font-medium">Account Status</p>
                <div className="flex items-center space-x-2">
                  {user.isActive ? (
                    <>
                      <div className="h-2 w-2 bg-green-500 rounded-full" />
                      <span className="text-sm text-green-600">
                        Active and operational
                      </span>
                    </>
                  ) : (
                    <>
                      <div className="h-2 w-2 bg-gray-400 rounded-full" />
                      <span className="text-sm text-gray-600">
                        Account disabled
                      </span>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Role Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Role & Responsibilities</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">Current Role</p>
                <Badge
                  className={`${getRoleBadgeColor(
                    user.role
                  )} text-sm px-3 py-1`}
                  variant="outline"
                >
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </Badge>
              </div>

              <Separator />

              <div className="text-sm text-muted-foreground">
                {user.role === "traffic" && (
                  <p>
                    Field officer responsible for responding to incidents and
                    creating initial reports. Handles on-scene documentation and
                    evidence collection.
                  </p>
                )}
                {user.role === "investigator" && (
                  <p>
                    Analyst responsible for investigating cases and creating
                    detailed reports. Specializes in case analysis and evidence
                    evaluation.
                  </p>
                )}
                {user.role === "chief" && (
                  <p>
                    Supervisor responsible for reviewing reports and managing
                    investigations. Oversees team performance and strategic
                    decisions.
                  </p>
                )}
                {user.role === "admin" && (
                  <p>
                    System administrator with full platform access and user
                    management capabilities. Maintains system security and
                    operations.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Role-Specific Information */}
        <Card>
          <CardHeader>
            <CardTitle>Professional Details</CardTitle>
            <CardDescription>
              Role-specific information and performance metrics
            </CardDescription>
          </CardHeader>
          <CardContent>{getRoleSpecificInfo()}</CardContent>
        </Card>

        {/* Activity Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Recent Activity</span>
            </CardTitle>
            <CardDescription>
              Latest actions and system interactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                <div className="h-2 w-2 bg-green-500 rounded-full" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Logged into system</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                <div className="h-2 w-2 bg-blue-500 rounded-full" />
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    Updated profile information
                  </p>
                  <p className="text-xs text-muted-foreground">1 day ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                <div className="h-2 w-2 bg-purple-500 rounded-full" />
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    Completed training module
                  </p>
                  <p className="text-xs text-muted-foreground">3 days ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Performance Overview</span>
            </CardTitle>
            <CardDescription>
              Key performance indicators and metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">98%</div>
                <p className="text-sm text-muted-foreground">Task Completion</p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">4.8</div>
                <p className="text-sm text-muted-foreground">Quality Rating</p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">24h</div>
                <p className="text-sm text-muted-foreground">
                  Avg Response Time
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}
