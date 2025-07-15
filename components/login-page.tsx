"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ModeToggle } from "@/components/mode-toggle";
import { AlertCircle, Car, FileText, Shield, User } from "lucide-react";
import { z } from "zod";


// Import toast
import { toast } from "@/components/ui/use-toast";


const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
});

const ROLES = [
  {
    value: "traffic",
    label: "Traffic",
    icon: Car,
  },
  {
    value: "investigator",
    label: "Investigator",
    icon: FileText,
  },
  {
    value: "chief",
    label: "Chief",
    icon: User,
  },
  {
    value: "admin",
    label: "Admin",
    icon: Shield,
  },
];

export function LoginPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState("traffic");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // Remove error state, use toast instead
  const [isLoading, setIsLoading] = useState(false);
  const [greeting, setGreeting] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  // For smooth focus transitions
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  // Validate form fields using zod
  const validateForm = () => {
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const errors: { email?: string; password?: string } = {};
      for (const issue of result.error.issues) {
        if (issue.path[0] === "email") errors.email = issue.message;
        if (issue.path[0] === "password") errors.password = issue.message;
      }
      setFieldErrors(errors);
      return false;
    }
    setFieldErrors({});
    return true;
  };

  const isFormValid = email.trim() !== "" && password.trim() !== "" && Object.keys(fieldErrors).length === 0;

  // When switching roles, clear errors and optionally fields for a clean experience
  const handleRoleChange = (role: string) => {
    setSelectedRole(role);
    setFieldErrors({});
    // Optionally clear credentials on role switch for extra cleanliness:
    // setEmail("");
    // setPassword("");
    // Focus email input for smoothness
    setTimeout(() => {
      emailRef.current?.focus();
    }, 100);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: "Login Error",
        description: "Please fix the errors above.",
        variant: "destructive",
        duration: 4000,
      });
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setGreeting(`Welcome, ${data.firstName || "User"}!`);
        setTimeout(() => {
          switch (selectedRole) {
            case "traffic":
              router.push("/dashboard/traffic");
              break;
            case "investigator":
              router.push("/dashboard/investigator");
              break;
            case "chief":
              router.push("/dashboard/chief");
              break;
            case "admin":
              router.push("/dashboard/admin");
              break;
            default:
              router.push("/dashboard/");
          }
        }, 1000);
      } else {
        toast({
          title: "Login Error",
          description: data.error || "Login failed. Please check your credentials.",
          variant: "destructive",
          duration: 4000,
        });
      }
    } catch (err) {
      toast({
        title: "Login Error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-100 via-background to-background/80 dark:from-slate-900 dark:via-background dark:to-background/80 p-4">
      <div className="absolute right-4 top-4 z-10">
        <ModeToggle />
      </div>

      <div className="flex flex-col items-center space-y-4 text-center mb-8">
        <div className="flex items-center space-x-3">
          <Shield className="h-12 w-12 text-primary drop-shadow" />
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            ISAAC
          </h1>
        </div>
        <p className="text-muted-foreground max-w-md text-base font-medium">
          Integrated AI Surveillance & Data Analysis for Casualty Reporting
        </p>
      </div>

      <Card className="w-full max-w-md shadow-xl border-0 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl font-bold">Sign in to ISAAC</CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            Select your role and enter your credentials
          </CardDescription>
        </CardHeader>
        <CardContent>
          {greeting && (
            <div className="text-green-600 text-lg font-semibold mb-4 text-center animate-fade-in">
              {greeting}
            </div>
          )}
          <form onSubmit={handleLogin} id="login-form" autoComplete="off" className="space-y-6">
            {/* Error toast replaces inline error display */}
            <Tabs
              value={selectedRole}
              className="w-full mb-4"
              onValueChange={handleRoleChange}
            >
              <TabsList className="grid grid-cols-4 w-full rounded-lg bg-muted/50 transition-all duration-200">
                {ROLES.map((role) => (
                  <TabsTrigger
                    key={role.value}
                    value={role.value}
                    className={`flex flex-col items-center py-2 transition-all duration-150 ${
                      selectedRole === role.value
                        ? "bg-primary/10 text-primary scale-105 shadow"
                        : "hover:bg-muted"
                    }`}
                    tabIndex={0}
                    aria-label={role.label}
                  >
                    <role.icon className="h-4 w-4 mb-1" />
                    <span className="text-xs font-medium">{role.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            <div className="space-y-4 transition-all duration-200">
              <div className="space-y-1">
                <Label htmlFor="email" className="font-semibold">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setFieldErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  disabled={isLoading}
                  autoComplete="username"
                  className={fieldErrors.email ? "border-red-500 focus-visible:ring-red-500" : ""}
                  onBlur={validateForm}
                  ref={emailRef}
                />
                {fieldErrors.email && (
                  <span className="text-xs text-red-500">{fieldErrors.email}</span>
                )}
              </div>
              <div className="space-y-1">
                <Label htmlFor="password" className="font-semibold">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setFieldErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  disabled={isLoading}
                  autoComplete="current-password"
                  className={fieldErrors.password ? "border-red-500 focus-visible:ring-red-500" : ""}
                  onBlur={validateForm}
                  ref={passwordRef}
                />
                {fieldErrors.password && (
                  <span className="text-xs text-red-500">{fieldErrors.password}</span>
                )}
              </div>
              <div className="flex items-center mt-2">
                <AlertCircle className="h-4 w-4 text-muted-foreground mr-2" />
                <p className="text-xs text-muted-foreground">
                  Access is restricted to authorized personnel only.
                </p>
              </div>
            </div>
            <CardFooter className="pt-4">
              <Button
                className="w-full text-base font-semibold py-2 rounded-lg shadow"
                type="submit"
                form="login-form"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span>
                    <svg className="inline mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                    Signing In...
                  </span>
                ) : (
                  "Sign In"
                )}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
      <div className="mt-8 text-xs text-muted-foreground text-center">
        &copy; {new Date().getFullYear()} ISAAC. All rights reserved.
      </div>
    </div>
  );
}