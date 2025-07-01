"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { User } from "lucide-react";

interface UserNavProps {
  role?: string;
}

export function UserNav({ role: initialRole }: UserNavProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) setUser(data);
      });
  }, []);

  const role = user?.role || initialRole || "user";

  const getRoleIcon = () => {
    switch (role) {
      case "traffic":
        return <User className="h-4 w-4 mr-2" />;
      case "investigator":
        return <User className="h-4 w-4 mr-2" />;
      case "chief":
        return <User className="h-4 w-4 mr-2" />;
      case "admin":
        return <User className="h-4 w-4 mr-2" />;
      default:
        return <User className="h-4 w-4 mr-2" />;
    }
  };

  const getRoleName = () => {
    switch (role) {
      case "traffic":
        return "Traffic Personnel";
      case "investigator":
        return "Investigator";
      case "chief":
        return "Chief Analyst";
      case "admin":
        return "Admin";
      default:
        return "User";
    }
  };

  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    switch (role) {
      case "traffic":
        return "TP";
      case "investigator":
        return "IN";
      case "chief":
        return "CA";
      case "admin":
        return "AD";
      default:
        return "U";
    }
  };

  const getFirstLetter = () => {
    if (user?.firstName) {
      return user.firstName[0].toUpperCase();
    }
    return getInitials()[0];
  };

  const getAvatarColor = () => {
    const colors = [
      "bg-gradient-to-br from-blue-500 to-blue-600",
      "bg-gradient-to-br from-green-500 to-green-600",
      "bg-gradient-to-br from-purple-500 to-purple-600",
      "bg-gradient-to-br from-orange-500 to-orange-600",
      "bg-gradient-to-br from-pink-500 to-pink-600",
      "bg-gradient-to-br from-indigo-500 to-indigo-600",
      "bg-gradient-to-br from-teal-500 to-teal-600",
      "bg-gradient-to-br from-red-500 to-red-600",
    ];

    // Use user's name to consistently pick a color
    const name = user?.firstName || role;
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative h-10 w-10 rounded-full p-0 hover:bg-accent/50 transition-all duration-200 group"
          >
            <Avatar className="h-10 w-10 border-2 border-transparent group-hover:border-primary/20 transition-all duration-200">
              <div
                className={`h-full w-full rounded-full ${getAvatarColor()} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200`}
              >
                <span className="text-white font-semibold text-lg group-hover:scale-110 transition-transform duration-200">
                  {getFirstLetter()}
                </span>
              </div>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {user ? `${user.firstName} ${user.lastName}` : "John Doe"}
              </p>
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
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Profile Dialog */}
      <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Profile Settings</DialogTitle>
            <DialogDescription>
              Manage your profile information and preferences.
            </DialogDescription>
          </DialogHeader>
          <div className="overflow-y-auto max-h-[60vh] pr-2 scrollbar-hide">
            <div className="space-y-6">
              {/* Profile Picture */}
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-20 w-20 border-4 border-background shadow-lg">
                  <div
                    className={`h-full w-full rounded-full ${getAvatarColor()} flex items-center justify-center`}
                  >
                    <span className="text-white font-bold text-2xl">
                      {getFirstLetter()}
                    </span>
                  </div>
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
                    <Input
                      id="firstName"
                      defaultValue={user?.firstName || ""}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" defaultValue={user?.lastName || ""} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue={user?.email || ""}
                  />
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
                      <span className="text-sm">{user?.department || ""}</span>
                    </div>
                  </div>
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
    </>
  );
}
