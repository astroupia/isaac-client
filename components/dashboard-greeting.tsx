"use client";
import { useEffect, useState } from "react";

export function DashboardGreeting() {
  const [firstName, setFirstName] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.firstName) setFirstName(data.firstName);
      });
  }, []);

  if (!firstName) return null;

  return (
    <div className="text-2xl font-bold mb-4">Hey {firstName}</div>
  );
}
