"use client";

import { Monitor, Sparkles } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" className="bg-background w-10 h-10">
        <div className="w-5 h-5 animate-pulse bg-muted-foreground/20 rounded" />
      </Button>
    );
  }

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="relative bg-background hover:bg-accent transition-all duration-300 group"
      title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {/* Light Mode Icon */}
      <Monitor
        className={`h-5 w-5 transition-all duration-500 ${
          theme === "light"
            ? "text-yellow-500 scale-110 rotate-0 opacity-100"
            : "text-muted-foreground scale-75 -rotate-90 opacity-0"
        }`}
      />

      {/* Dark Mode Icon */}
      <Sparkles
        className={`absolute h-5 w-5 transition-all duration-500 ${
          theme === "dark"
            ? "text-purple-400 scale-110 rotate-0 opacity-100"
            : "text-muted-foreground scale-75 rotate-90 opacity-0"
        }`}
      />

      {/* Hover Effect Ring */}
      <div className="absolute inset-0 rounded-md ring-2 ring-transparent group-hover:ring-primary/20 transition-all duration-300" />

      <span className="sr-only">
        {theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
      </span>
    </Button>
  );
}
