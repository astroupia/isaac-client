"use client"

import type React from "react"

import { TrafficDashboard } from "@/components/traffic-dashboard"
import { InvestigatorDashboard } from "@/components/investigator-dashboard"
import { ChiefDashboard } from "@/components/chief-dashboard"
import { AdminDashboard } from "@/components/admin-dashboard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Shield, Crown, Settings } from "lucide-react"
import { useState, useEffect } from "react"

type UserRole = "traffic" | "investigator" | "chief" | "admin"

interface RoleConfig {
  label: string
  icon: React.ReactNode
  color: string
  description: string
}

const roleConfigs: Record<UserRole, RoleConfig> = {
  traffic: {
    label: "Traffic Personnel",
    icon: <User className="h-4 w-4" />,
    color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    description: "Field officer responsible for incident reporting and evidence collection",
  },
  investigator: {
    label: "Investigator",
    icon: <Shield className="h-4 w-4" />,
    color: "bg-green-500/10 text-green-500 border-green-500/20",
    description: "Analyst responsible for case investigation and AI report review",
  },
  chief: {
    label: "Chief Analyst",
    icon: <Crown className="h-4 w-4" />,
    color: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    description: "Senior analyst with case assignment and team oversight responsibilities",
  },
  admin: {
    label: "Administrator",
    icon: <Settings className="h-4 w-4" />,
    color: "bg-red-500/10 text-red-500 border-red-500/20",
    description: "System administrator with full platform access and user management",
  },
}

export default function DashboardPage() {
  const [currentRole, setCurrentRole] = useState<UserRole>("traffic")
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Simulate role detection from user session/context
  useEffect(() => {
    // In a real app, this would come from user context/session
    const savedRole = localStorage.getItem("userRole") as UserRole
    if (savedRole && roleConfigs[savedRole]) {
      setCurrentRole(savedRole)
    }
  }, [])

  const handleRoleChange = (newRole: UserRole) => {
    if (newRole === currentRole) return

    setIsTransitioning(true)

    // Simulate role switching with smooth transition
    setTimeout(() => {
      setCurrentRole(newRole)
      localStorage.setItem("userRole", newRole)
      setIsTransitioning(false)
    }, 300)
  }

  const renderDashboard = () => {
    if (isTransitioning) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-muted-foreground">Switching dashboard...</p>
          </div>
        </div>
      )
    }

    switch (currentRole) {
      case "traffic":
        return <TrafficDashboard />
      case "investigator":
        return <InvestigatorDashboard />
      case "chief":
        return <ChiefDashboard />
      case "admin":
        return <AdminDashboard />
      default:
        return <TrafficDashboard />
    }
  }

  return (
    <div className="space-y-6 w-full">
      {/* Role Selector Card */}
      <Card className="border-2 border-dashed border-muted-foreground/20 bg-muted/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Role Dashboard
              </CardTitle>
              <Badge className={roleConfigs[currentRole].color}>
                {roleConfigs[currentRole].icon}
                <span className="ml-1">{roleConfigs[currentRole].label}</span>
              </Badge>
            </div>
            <Select value={currentRole} onValueChange={handleRoleChange}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(roleConfigs).map(([role, config]) => (
                  <SelectItem key={role} value={role}>
                    <div className="flex items-center space-x-2">
                      {config.icon}
                      <span>{config.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{roleConfigs[currentRole].description}</p>
          <div className="mt-4 text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
            <strong>Demo Mode:</strong> This role selector allows you to preview different dashboard views. In
            production, the role would be automatically determined from your user permissions.
          </div>
        </CardContent>
      </Card>

      {/* Dynamic Dashboard Content */}
      <div
        className={`transition-all duration-300 ${isTransitioning ? "opacity-50 scale-95" : "opacity-100 scale-100"}`}
      >
        {renderDashboard()}
      </div>
    </div>
  )
}
