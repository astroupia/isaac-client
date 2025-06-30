"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import { NotificationCenter } from "@/components/notification-center";
import { UserNav } from "@/components/user-nav";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  AlertTriangle,
  BarChart3,
  Brain,
  FileText,
  LayoutDashboard,
  LogOut,
  Settings,
  Shield,
  User,
  Zap,
} from "lucide-react";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [role, setRole] = useState<string>("traffic");

  // Determine role based on URL path
  useEffect(() => {
    if (pathname.includes("/traffic")) {
      setRole("traffic");
    } else if (pathname.includes("/investigator")) {
      setRole("investigator");
    } else if (pathname.includes("/chief")) {
      setRole("chief");
    } else if (pathname.includes("/admin")) {
      setRole("admin");
    }
  }, [pathname]);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar role={role} />
        <div className="flex-1 flex flex-col min-w-0 w-full">
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6 w-full">
            <SidebarTrigger />
            <div className="flex-1" />
            <NotificationCenter />
            <ModeToggle />
            <UserNav role={role} />
          </header>
          <main className="flex-1 p-6 w-full min-w-0">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function DashboardSidebar({ role }: { role: string }) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path + "/");
  };

  return (
    <Sidebar className="border-r-0">
      <SidebarHeader className="flex items-center px-6 py-4 border-b bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Shield className="h-8 w-8 text-primary" />
            <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-background"></div>
          </div>
          <div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              ISAAC
            </span>
            <p className="text-xs text-muted-foreground">Intelligent System</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        <SidebarMenu className="space-y-2">
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="Dashboard"
              className={`group relative overflow-hidden transition-all duration-200 ${
                isActive(`/dashboard/`) && pathname === `/dashboard/`
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "hover:bg-accent/50"
              }`}
            >
              <Link
                href={`/dashboard/${role}`}
                className="flex items-center space-x-3 px-3 py-2"
              >
                <LayoutDashboard className="h-5 w-5 transition-transform group-hover:scale-110" />
                <span className="font-medium">Dashboard</span>
                {isActive(`/dashboard/${role}`) &&
                  pathname === `/dashboard/${role}` && (
                    <div className="absolute right-2 h-2 w-2 bg-primary-foreground rounded-full"></div>
                  )}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Traffic Personnel Menu Items */}
          {role === "traffic" && (
            <>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="New Incident"
                  className={`group relative overflow-hidden transition-all duration-200 ${
                    isActive("/dashboard/traffic/new-incident")
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "hover:bg-accent/50"
                  }`}
                >
                  <Link
                    href="/dashboard/traffic/new-incident"
                    className="flex items-center space-x-3 px-3 py-2"
                  >
                    <AlertTriangle className="h-5 w-5 transition-transform group-hover:scale-110" />
                    <span className="font-medium">New Incident</span>
                    <Zap className="h-3 w-3 text-orange-500 ml-auto" />
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="My Reports"
                  className={`group relative overflow-hidden transition-all duration-200 ${
                    isActive("/dashboard/traffic/reports")
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "hover:bg-accent/50"
                  }`}
                >
                  <Link
                    href="/dashboard/traffic/reports"
                    className="flex items-center space-x-3 px-3 py-2"
                  >
                    <FileText className="h-5 w-5 transition-transform group-hover:scale-110" />
                    <span className="font-medium">My Reports</span>
                    <Badge
                      className="ml-auto bg-primary/20 text-primary border-primary/30 hover:bg-primary/30"
                      variant="outline"
                    >
                      3
                    </Badge>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </>
          )}

          {/* Investigator Menu Items */}
          {role === "investigator" && (
            <>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Assigned Cases"
                  className={`group relative overflow-hidden transition-all duration-200 ${
                    isActive("/dashboard/investigator/cases")
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "hover:bg-accent/50"
                  }`}
                >
                  <Link
                    href="/dashboard/investigator/cases"
                    className="flex items-center space-x-3 px-3 py-2"
                  >
                    <FileText className="h-5 w-5 transition-transform group-hover:scale-110" />
                    <span className="font-medium">Assigned Cases</span>
                    <Badge
                      className="ml-auto bg-orange-500/20 text-orange-600 border-orange-500/30 hover:bg-orange-500/30"
                      variant="outline"
                    >
                      5
                    </Badge>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="AI Reports"
                  className={`group relative overflow-hidden transition-all duration-200 ${
                    isActive("/dashboard/investigator/ai-reports")
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "hover:bg-accent/50"
                  }`}
                >
                  <Link
                    href="/dashboard/investigator/ai-reports"
                    className="flex items-center space-x-3 px-3 py-2"
                  >
                    <Brain className="h-5 w-5 transition-transform group-hover:scale-110" />
                    <span className="font-medium">AI Reports</span>
                    <div className="ml-auto h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </>
          )}

          {/* Chief Analyst Menu Items */}
          {role === "chief" && (
            <>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Assign Cases"
                  className={`group relative overflow-hidden transition-all duration-200 ${
                    isActive("/dashboard/chief/assign")
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "hover:bg-accent/50"
                  }`}
                >
                  <Link
                    href="/dashboard/chief/assign"
                    className="flex items-center space-x-3 px-3 py-2"
                  >
                    <User className="h-5 w-5 transition-transform group-hover:scale-110" />
                    <span className="font-medium">Assign Cases</span>
                    <Badge
                      className="ml-auto bg-orange-500/20 text-orange-600 border-orange-500/30 hover:bg-orange-500/30"
                      variant="outline"
                    >
                      7
                    </Badge>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Final Reports"
                  className={`group relative overflow-hidden transition-all duration-200 ${
                    isActive("/dashboard/chief/reports")
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "hover:bg-accent/50"
                  }`}
                >
                  <Link
                    href="/dashboard/chief/reports"
                    className="flex items-center space-x-3 px-3 py-2"
                  >
                    <FileText className="h-5 w-5 transition-transform group-hover:scale-110" />
                    <span className="font-medium">Final Reports</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="AI Insights"
                  className={`group relative overflow-hidden transition-all duration-200 ${
                    isActive("/dashboard/chief/ai-insights")
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "hover:bg-accent/50"
                  }`}
                >
                  <Link
                    href="/dashboard/chief/ai-insights"
                    className="flex items-center space-x-3 px-3 py-2"
                  >
                    <Brain className="h-5 w-5 transition-transform group-hover:scale-110" />
                    <span className="font-medium">AI Insights</span>
                    <div className="ml-auto h-2 w-2 bg-blue-500 rounded-full animate-pulse"></div>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </>
          )}

          <Separator className="my-4" />

          {/* Common Menu Items */}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="Report Center"
              className={`group relative overflow-hidden transition-all duration-200 ${
                isActive(`/dashboard/${role}/report-center`)
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "hover:bg-accent/50"
              }`}
            >
              <Link
                href={`/dashboard/${role}/report-center`}
                className="flex items-center space-x-3 px-3 py-2"
              >
                <BarChart3 className="h-5 w-5 transition-transform group-hover:scale-110" />
                <span className="font-medium">Report Center</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="Settings"
              className={`group relative overflow-hidden transition-all duration-200 ${
                isActive(`/dashboard/${role}/settings`)
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "hover:bg-accent/50"
              }`}
            >
              <Link
                href={`/dashboard/${role}/settings`}
                className="flex items-center space-x-3 px-3 py-2"
              >
                <Settings className="h-5 w-5 transition-transform group-hover:scale-110" />
                <span className="font-medium">Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t bg-gradient-to-r from-muted/50 to-muted/30 p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="Logout"
              className="group hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
            >
              <Link href="/" className="flex items-center space-x-3 px-3 py-2">
                <LogOut className="h-5 w-5 transition-transform group-hover:scale-110" />
                <span className="font-medium">Logout</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
