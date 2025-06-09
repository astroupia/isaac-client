"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  Home,
  Search,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function NotFound() {
  const router = useRouter();
  const [isAnimating, setIsAnimating] = useState(false);
  const [glitchText, setGlitchText] = useState("404");

  useEffect(() => {
    const interval = setInterval(() => {
      const glitchChars = ["4", "0", "4", "█", "▓", "▒", "░"];
      const randomText = Array.from(
        { length: 3 },
        () => glitchChars[Math.floor(Math.random() * glitchChars.length)]
      ).join("");

      setGlitchText(randomText);
      setTimeout(() => setGlitchText("404"), 100);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setIsAnimating(true);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <Card className="relative w-full max-w-2xl mx-auto backdrop-blur-sm bg-background/80 border-2 shadow-2xl">
        <CardContent className="p-12 text-center space-y-8">
          {/* Animated 404 */}
          <div className="relative">
            <div className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-500 to-purple-500 animate-pulse">
              {glitchText}
            </div>
            <div className="absolute inset-0 text-9xl font-black text-primary/10 blur-sm">
              404
            </div>
          </div>

          {/* Error Icon with Animation */}
          <div className="relative">
            <div className="w-24 h-24 mx-auto mb-6 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-full animate-ping"></div>
              <div className="relative w-24 h-24 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-12 w-12 text-white animate-bounce" />
              </div>
            </div>
          </div>

          {/* Main Message */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Page Not Found
            </h1>
            <p className="text-xl text-muted-foreground max-w-md mx-auto leading-relaxed">
              Oops! The page you&apos;re looking for seems to have vanished into
              the digital void.
            </p>
          </div>

          {/* Interactive Elements */}
          <div className="space-y-6">
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                size="lg"
                className="group relative overflow-hidden bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 transition-all duration-300 transform hover:scale-105"
                asChild
              >
                <Link href="/">
                  <Home className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                  Go Home
                </Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="group hover:bg-muted/50 transition-all duration-300 transform hover:scale-105"
                onClick={() => router.back()}
              >
                <ArrowLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                Go Back
              </Button>
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                variant="ghost"
                size="lg"
                className="group hover:bg-muted/50 transition-all duration-300"
                onClick={handleRefresh}
                disabled={isAnimating}
              >
                <RefreshCw
                  className={`mr-2 h-5 w-5 transition-transform ${
                    isAnimating ? "animate-spin" : "group-hover:rotate-180"
                  }`}
                />
                {isAnimating ? "Refreshing..." : "Refresh Page"}
              </Button>

              <Button
                variant="ghost"
                size="lg"
                className="group hover:bg-muted/50 transition-all duration-300"
                asChild
              >
                <Link href="/dashboard">
                  <Search className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  Search Dashboard
                </Link>
              </Button>
            </div>
          </div>

          {/* Help Text */}
          <div className="pt-8 border-t border-border/50">
            <p className="text-sm text-muted-foreground">
              If you believe this is an error, please contact support or try
              refreshing the page.
            </p>
          </div>

          {/* Floating Elements */}
          <div className="absolute top-4 right-4 w-3 h-3 bg-primary/30 rounded-full animate-ping"></div>
          <div className="absolute bottom-4 left-4 w-2 h-2 bg-blue-500/30 rounded-full animate-ping delay-500"></div>
          <div className="absolute top-1/2 left-4 w-1 h-1 bg-purple-500/30 rounded-full animate-ping delay-1000"></div>
        </CardContent>
      </Card>
    </div>
  );
}
