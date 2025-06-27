"use client";

import { useState } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ModeToggle } from "@/components/mode-toggle";
import { AlertCircle, Car, FileText, Shield, User } from "lucide-react";

export function SignupPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState("traffic");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isFormValid =
    firstName.trim() !== "" &&
    lastName.trim() !== "" &&
    email.trim() !== "" &&
    password.trim() !== "";

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    setError(null);
    setIsLoading(true);
    setSuccess(false);
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        firstName,
        lastName,
        role: selectedRole,
      }),
    });
    const data = await res.json();
    setIsLoading(false);
    if (res.ok) {
      setSuccess(true);
      setTimeout(() => router.push("/"), 1200);
    } else {
      setError(data.error || "Signup failed");
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
          Create your account to access the ISAAC platform
        </p>
      </div>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign up for ISAAC</CardTitle>
          <CardDescription>
            Fill in your details and select your role
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup}>
            <Tabs
              defaultValue="traffic"
              className="w-full mb-6"
              onValueChange={setSelectedRole}
            >
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="traffic" className="flex flex-col items-center py-2">
                  <Car className="h-4 w-4 mb-1" />
                  <span className="text-xs">Traffic</span>
                </TabsTrigger>
                <TabsTrigger value="investigator" className="flex flex-col items-center py-2">
                  <FileText className="h-4 w-4 mb-1" />
                  <span className="text-xs">Investigator</span>
                </TabsTrigger>
                <TabsTrigger value="chief" className="flex flex-col items-center py-2">
                  <User className="h-4 w-4 mb-1" />
                  <span className="text-xs">Chief</span>
                </TabsTrigger>
                <TabsTrigger value="admin" className="flex flex-col items-center py-2">
                  <Shield className="h-4 w-4 mb-1" />
                  <span className="text-xs">Admin</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  placeholder="Enter your first name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Enter your last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={isLoading}
                />
              </div>
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
              {error && (
                <div className="text-red-500 text-sm flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  {error}
                </div>
              )}
              {success && (
                <div className="text-green-600 text-sm flex items-center">
                  <Shield className="h-4 w-4 mr-2" />
                  Signup successful! Redirecting to login...
                </div>
              )}
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            onClick={handleSignup}
            disabled={!isFormValid || isLoading}
          >
            {isLoading ? "Signing Up..." : "Sign Up"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
