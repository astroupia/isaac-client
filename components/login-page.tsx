"use client";

import React, { useState } from "react";
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ModeToggle } from "@/components/mode-toggle";
import { AlertCircle, Car, FileText, Shield, User } from "lucide-react";

export function LoginPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState("traffic");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [greeting, setGreeting] = useState<string | null>(null);

  const isFormValid = email.trim() !== "" && password.trim() !== "";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      setError("Please enter both email and password");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setGreeting(`Hey ${data.firstName}`);
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
        }, 1200);
      } else {
        setError(data.error || "Login failed. Please check your credentials.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-background/80 p-4">
      <div className="absolute right-4 top-4 z-10">
        <ModeToggle />
      </div>

      <div className="flex flex-col items-center space-y-4 text-center mb-8">
        <div className="flex items-center space-x-2">
          <Shield className="h-12 w-12 text-primary" />
          <h1 className="text-4xl font-bold tracking-tight">ISAAC</h1>
        </div>
        <p className="text-muted-foreground max-w-md">
          Integrated AI Surveillance & Data Analysis for Casualty Reporting
        </p>
      </div>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign in to ISAAC</CardTitle>
          <CardDescription>
            Select your role and enter your credentials
          </CardDescription>
        </CardHeader>
        <CardContent>
          {greeting && (
            <div className="text-green-600 text-lg font-semibold mb-4 text-center">
              {greeting}
            </div>
          )}
          <form onSubmit={handleLogin} id="login-form">
            {error && (
              <div className="text-red-500 text-sm mb-4 flex items-center">
                <AlertCircle className="h-4 w-4 mr-2" />
                {error}
              </div>
            )}
            <Tabs
              defaultValue="traffic"
              className="w-full mb-6"
              onValueChange={setSelectedRole}
            >
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger
                  value="traffic"
                  className="flex flex-col items-center py-2"
                >
                  <Car className="h-4 w-4 mb-1" />
                  <span className="text-xs">Traffic</span>
                </TabsTrigger>
                <TabsTrigger
                  value="investigator"
                  className="flex flex-col items-center py-2"
                >
                  <FileText className="h-4 w-4 mb-1" />
                  <span className="text-xs">Investigator</span>
                </TabsTrigger>
                <TabsTrigger
                  value="chief"
                  className="flex flex-col items-center py-2"
                >
                  <User className="h-4 w-4 mb-1" />
                  <span className="text-xs">Chief</span>
                </TabsTrigger>
                <TabsTrigger
                  value="admin"
                  className="flex flex-col items-center py-2"
                >
                  <Shield className="h-4 w-4 mb-1" />
                  <span className="text-xs">Admin</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="flex items-center">
                <AlertCircle className="h-4 w-4 text-muted-foreground mr-2" />
                <p className="text-xs text-muted-foreground">
                  Access is restricted to authorized personnel only
                </p>
              </div>
            </div>
            <CardFooter>
              <Button
                className="w-full"
                type="submit"
                form="login-form"
                disabled={!isFormValid || isLoading}
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}