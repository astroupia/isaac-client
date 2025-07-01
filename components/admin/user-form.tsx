"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { User, UserRole } from "@/lib/models";
import { Save, X, UserIcon, Shield, Settings, Briefcase } from "lucide-react";

interface UserFormProps {
  initialData?: User;
  onSubmit: (data: Partial<User>) => void;
  isEditing?: boolean;
}

export function UserForm({
  initialData,
  onSubmit,
  isEditing = false,
}: UserFormProps) {
  const [formData, setFormData] = useState({
    firstName: initialData?.firstName || "",
    lastName: initialData?.lastName || "",
    email: initialData?.email || "",
    role: initialData?.role || ("traffic" as UserRole),
    badgeId: initialData?.badgeId || "",
    department: initialData?.department || "",
    phoneNumber: initialData?.phoneNumber || "",
    isActive: initialData?.isActive ?? true,
    // Role-specific fields
    district: "",
    vehicleId: "",
    shift: "morning" as "morning" | "afternoon" | "night",
    specialization: [] as string[],
    maxCaseload: 10,
    accessLevel: 1,
    systemPermissions: [] as string[],
    notes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.email.includes("@"))
      newErrors.email = "Valid email is required";
    if (!formData.role) newErrors.role = "Role is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const submitData: Partial<User> = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      role: formData.role,
      badgeId: formData.badgeId || undefined,
      department: formData.department || undefined,
      phoneNumber: formData.phoneNumber || undefined,
      isActive: formData.isActive,
    };

    onSubmit(submitData);
  };

  const getRoleDescription = (role: UserRole) => {
    switch (role) {
      case "traffic":
        return "Field officers who respond to incidents and create initial reports";
      case "investigator":
        return "Analysts who investigate cases and create detailed reports";
      case "chief":
        return "Supervisors who review reports and manage investigations";
      case "admin":
        return "System administrators with full platform access";
      default:
        return "";
    }
  };

  const getRoleFields = () => {
    switch (formData.role) {
      case "traffic":
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Briefcase className="h-5 w-5" />
                <span>Traffic Personnel Details</span>
              </CardTitle>
              <CardDescription>
                Specific information for traffic officers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="district">District Assignment</Label>
                  <Input
                    id="district"
                    value={formData.district}
                    onChange={(e) =>
                      setFormData({ ...formData, district: e.target.value })
                    }
                    placeholder="e.g., Downtown, North Side, Highway Patrol"
                  />
                  <p className="text-xs text-muted-foreground">
                    Geographic area of responsibility
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vehicleId">Assigned Vehicle</Label>
                  <Input
                    id="vehicleId"
                    value={formData.vehicleId}
                    onChange={(e) =>
                      setFormData({ ...formData, vehicleId: e.target.value })
                    }
                    placeholder="e.g., UNIT-001, PATROL-15"
                  />
                  <p className="text-xs text-muted-foreground">
                    Primary patrol vehicle identifier
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="shift">Work Shift</Label>
                <Select
                  value={formData.shift}
                  onValueChange={(value: "morning" | "afternoon" | "night") =>
                    setFormData({ ...formData, shift: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">
                      <div className="flex flex-col items-start">
                        <span className="font-medium">Morning Shift</span>
                        <span className="text-xs text-muted-foreground">
                          6:00 AM - 2:00 PM
                        </span>
                      </div>
                    </SelectItem>
                    <SelectItem value="afternoon">
                      <div className="flex flex-col items-start">
                        <span className="font-medium">Afternoon Shift</span>
                        <span className="text-xs text-muted-foreground">
                          2:00 PM - 10:00 PM
                        </span>
                      </div>
                    </SelectItem>
                    <SelectItem value="night">
                      <div className="flex flex-col items-start">
                        <span className="font-medium">Night Shift</span>
                        <span className="text-xs text-muted-foreground">
                          10:00 PM - 6:00 AM
                        </span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        );
      case "investigator":
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Investigator Details</span>
              </CardTitle>
              <CardDescription>
                Specialized information for investigators
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="specialization">Areas of Specialization</Label>
                <Textarea
                  id="specialization"
                  value={formData.specialization.join(", ")}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      specialization: e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                  placeholder="e.g., Traffic Analysis, Forensics, Accident Reconstruction, Digital Evidence"
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  Separate multiple specializations with commas
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="maxCaseload">Maximum Caseload</Label>
                  <Input
                    id="maxCaseload"
                    type="number"
                    min="1"
                    max="50"
                    value={formData.maxCaseload}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        maxCaseload: Number.parseInt(e.target.value) || 10,
                      })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Maximum number of concurrent cases
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Current Status</Label>
                  <div className="flex items-center space-x-2 p-3 bg-muted rounded-md">
                    <Badge
                      variant="outline"
                      className="bg-green-500/10 text-green-500 border-green-500/20"
                    >
                      Available
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      Ready for case assignment
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      case "chief":
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Chief Analyst Details</span>
              </CardTitle>
              <CardDescription>
                Leadership and management information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="analyticsAccess">
                    Analytics Access Level
                  </Label>
                  <Select defaultValue="full">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic Analytics</SelectItem>
                      <SelectItem value="advanced">
                        Advanced Analytics
                      </SelectItem>
                      <SelectItem value="full">Full Analytics Suite</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="managementLevel">Management Level</Label>
                  <Select defaultValue="department">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="team">Team Lead</SelectItem>
                      <SelectItem value="department">
                        Department Head
                      </SelectItem>
                      <SelectItem value="division">Division Chief</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subordinates">Supervised Personnel</Label>
                <Textarea
                  id="subordinates"
                  placeholder="List of investigators and personnel under supervision..."
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  Personnel reporting to this chief analyst
                </p>
              </div>
            </CardContent>
          </Card>
        );
      case "admin":
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Administrator Details</span>
              </CardTitle>
              <CardDescription>
                System administration and security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="accessLevel">Access Level</Label>
                  <Select
                    value={formData.accessLevel.toString()}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        accessLevel: Number.parseInt(value),
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">
                        <div className="flex flex-col items-start">
                          <span className="font-medium">
                            Level 1 - Basic Admin
                          </span>
                          <span className="text-xs text-muted-foreground">
                            User management, basic reports
                          </span>
                        </div>
                      </SelectItem>
                      <SelectItem value="2">
                        <div className="flex flex-col items-start">
                          <span className="font-medium">
                            Level 2 - Advanced Admin
                          </span>
                          <span className="text-xs text-muted-foreground">
                            System config, data management
                          </span>
                        </div>
                      </SelectItem>
                      <SelectItem value="3">
                        <div className="flex flex-col items-start">
                          <span className="font-medium">
                            Level 3 - Super Admin
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Full system access, security settings
                          </span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Security Clearance</Label>
                  <div className="flex items-center space-x-2 p-3 bg-muted rounded-md">
                    <Badge
                      variant="outline"
                      className="bg-red-500/10 text-red-500 border-red-500/20"
                    >
                      High Security
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      Full system access
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="systemPermissions">System Permissions</Label>
                <Textarea
                  id="systemPermissions"
                  value={formData.systemPermissions.join(", ")}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      systemPermissions: e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                  placeholder="e.g., user_management, system_config, data_export, security_settings, audit_logs"
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  Separate multiple permissions with commas
                </p>
              </div>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <ScrollArea className="h-full max-h-[70vh] pr-4">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <UserIcon className="h-5 w-5" />
              <span>Basic Information</span>
            </CardTitle>
            <CardDescription>
              Essential user details and contact information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  className={errors.firstName ? "border-red-500" : ""}
                />
                {errors.firstName && (
                  <p className="text-sm text-red-500">{errors.firstName}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  className={errors.lastName ? "border-red-500" : ""}
                />
                {errors.lastName && (
                  <p className="text-sm text-red-500">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className={errors.email ? "border-red-500" : ""}
                placeholder="user@police.gov"
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="badgeId">Badge ID</Label>
                <Input
                  id="badgeId"
                  value={formData.badgeId}
                  onChange={(e) =>
                    setFormData({ ...formData, badgeId: e.target.value })
                  }
                  placeholder="e.g., T001, I002, C003, A004"
                />
                <p className="text-xs text-muted-foreground">
                  Unique identifier for the officer
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, phoneNumber: e.target.value })
                  }
                  placeholder="+1-555-0123"
                />
                <p className="text-xs text-muted-foreground">
                  Primary contact number
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) =>
                  setFormData({ ...formData, department: e.target.value })
                }
                placeholder="e.g., Traffic Division, Criminal Investigation, IT Administration"
              />
              <p className="text-xs text-muted-foreground">
                Organizational unit or division
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Role and Permissions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Role and Permissions</span>
            </CardTitle>
            <CardDescription>
              User role determines access level and available features
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <Select
                value={formData.role}
                onValueChange={(value: UserRole) =>
                  setFormData({ ...formData, role: value })
                }
              >
                <SelectTrigger className={errors.role ? "border-red-500" : ""}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="traffic">
                    <div className="flex items-center space-x-3 py-2">
                      <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                        Traffic
                      </Badge>
                      <div className="flex flex-col items-start">
                        <span className="font-medium">Traffic Personnel</span>
                        <span className="text-xs text-muted-foreground">
                          Field officers, incident response
                        </span>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="investigator">
                    <div className="flex items-center space-x-3 py-2">
                      <Badge className="bg-purple-500/10 text-purple-500 border-purple-500/20">
                        Investigator
                      </Badge>
                      <div className="flex flex-col items-start">
                        <span className="font-medium">Investigator</span>
                        <span className="text-xs text-muted-foreground">
                          Case analysis, detailed reports
                        </span>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="chief">
                    <div className="flex items-center space-x-3 py-2">
                      <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20">
                        Chief
                      </Badge>
                      <div className="flex flex-col items-start">
                        <span className="font-medium">Chief Analyst</span>
                        <span className="text-xs text-muted-foreground">
                          Supervision, report review
                        </span>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="admin">
                    <div className="flex items-center space-x-3 py-2">
                      <Badge className="bg-red-500/10 text-red-500 border-red-500/20">
                        Admin
                      </Badge>
                      <div className="flex flex-col items-start">
                        <span className="font-medium">Administrator</span>
                        <span className="text-xs text-muted-foreground">
                          System management, full access
                        </span>
                      </div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.role && (
                <p className="text-sm text-red-500">{errors.role}</p>
              )}
              <p className="text-sm text-muted-foreground">
                {getRoleDescription(formData.role)}
              </p>
            </div>

            <div className="flex items-center space-x-3 p-4 bg-muted rounded-lg">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isActive: checked })
                }
              />
              <div className="flex-1">
                <Label htmlFor="isActive" className="text-base font-medium">
                  Active User Account
                </Label>
                <p className="text-sm text-muted-foreground">
                  {formData.isActive
                    ? "User can log in and access the system"
                    : "User account is disabled"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Role-Specific Fields */}
        {getRoleFields()}

        {/* Additional Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
            <CardDescription>
              Optional notes and comments about the user
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Any additional information about the user..."
                rows={4}
              />
              <p className="text-xs text-muted-foreground">
                Internal notes visible only to administrators
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t">
          <Button type="button" variant="outline" size="lg">
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button type="submit" size="lg">
            <Save className="mr-2 h-4 w-4" />
            {isEditing ? "Update User" : "Create User"}
          </Button>
        </div>
      </form>
    </ScrollArea>
  );
}
