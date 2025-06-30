"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Car, FileText, Shield, User, Settings, Bell, Lock, Palette, Globe, HelpCircle } from "lucide-react"

interface UserNavProps {
  role: string
}

export function UserNav({ role }: UserNavProps) {
  const [profileOpen, setProfileOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)

  const getRoleIcon = () => {
    switch (role) {
      case "traffic":
        return <Car className="h-4 w-4 mr-2" />
      case "investigator":
        return <FileText className="h-4 w-4 mr-2" />
      case "chief":
        return <User className="h-4 w-4 mr-2" />
      case "admin":
        return <Shield className="h-4 w-4 mr-2" />
      default:
        return <User className="h-4 w-4 mr-2" />
    }
  }

  const getRoleName = () => {
    switch (role) {
      case "traffic":
        return "Traffic Personnel"
      case "investigator":
        return "Investigator"
      case "chief":
        return "Chief Analyst"
      case "admin":
        return "Admin"
      default:
        return "User"
    }
  }

  const getInitials = () => {
    switch (role) {
      case "traffic":
        return "TP"
      case "investigator":
        return "IN"
      case "chief":
        return "CA"
      case "admin":
        return "AD"
      default:
        return "U"
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Avatar" />
              <AvatarFallback>{getInitials()}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">John Doe</p>
              <p className="text-xs leading-none text-muted-foreground flex items-center">
                {getRoleIcon()}
                {getRoleName()}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => setProfileOpen(true)}>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSettingsOpen(true)}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Log out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Profile Dialog */}
      <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Profile Settings</DialogTitle>
            <DialogDescription>Manage your profile information and preferences.</DialogDescription>
          </DialogHeader>
          <div className="overflow-y-auto max-h-[60vh] pr-2 scrollbar-hide">
            <div className="space-y-6">
              {/* Profile Picture */}
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="/placeholder.svg?height=80&width=80" alt="Profile" />
                  <AvatarFallback className="text-lg">{getInitials()}</AvatarFallback>
                </Avatar>
                <Button variant="outline" size="sm">
                  Change Photo
                </Button>
              </div>

              <Separator />

              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Personal Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" defaultValue="John" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" defaultValue="Doe" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="john.doe@isaac.gov" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="badge">Badge Number</Label>
                  <Input id="badge" defaultValue="TP-2024-001" />
                </div>
              </div>

              <Separator />

              {/* Role Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Role Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Current Role</Label>
                    <div className="flex items-center space-x-2 p-2 bg-muted rounded-md">
                      {getRoleIcon()}
                      <span className="text-sm">{getRoleName()}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Department</Label>
                    <div className="p-2 bg-muted rounded-md">
                      <span className="text-sm">Traffic Division</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supervisor">Supervisor</Label>
                  <Input id="supervisor" defaultValue="Chief Smith" readOnly />
                </div>
              </div>

              <Separator />

              {/* Bio */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Bio</h3>
                <div className="space-y-2">
                  <Label htmlFor="bio">About</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself..."
                    defaultValue="Experienced traffic personnel with 5+ years in incident management and road safety."
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setProfileOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setProfileOpen(false)}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
            <DialogDescription>Configure your application preferences and security settings.</DialogDescription>
          </DialogHeader>
          <div className="overflow-y-auto max-h-[60vh] pr-2 scrollbar-hide">
            <div className="space-y-6">
              {/* Notifications */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Bell className="h-5 w-5" />
                  <h3 className="text-lg font-medium">Notifications</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive push notifications</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Case Assignments</Label>
                      <p className="text-sm text-muted-foreground">Notify when new cases are assigned</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Security */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Lock className="h-5 w-5" />
                  <h3 className="text-lg font-medium">Security</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Session Timeout</Label>
                      <p className="text-sm text-muted-foreground">Auto-logout after inactivity</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Button variant="outline" className="w-full">
                    Change Password
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Appearance */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Palette className="h-5 w-5" />
                  <h3 className="text-lg font-medium">Appearance</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Dark Mode</Label>
                      <p className="text-sm text-muted-foreground">Toggle dark theme</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Compact Mode</Label>
                      <p className="text-sm text-muted-foreground">Reduce spacing and padding</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Language & Region */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Globe className="h-5 w-5" />
                  <h3 className="text-lg font-medium">Language & Region</h3>
                </div>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label>Language</Label>
                    <Input defaultValue="English (US)" />
                  </div>
                  <div className="space-y-2">
                    <Label>Timezone</Label>
                    <Input defaultValue="Eastern Time (ET)" />
                  </div>
                  <div className="space-y-2">
                    <Label>Date Format</Label>
                    <Input defaultValue="MM/DD/YYYY" />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Help & Support */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <HelpCircle className="h-5 w-5" />
                  <h3 className="text-lg font-medium">Help & Support</h3>
                </div>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <HelpCircle className="mr-2 h-4 w-4" />
                    Help Center
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Contact Support
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Report a Bug
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setSettingsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setSettingsOpen(false)}>Save Settings</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
