import React from "react";
import { Leaf } from "lucide-react";

// ========================
// Static header for the dashboard — no client-side interactivity needed.
// ========================

export default function DashboardHeader() {
  return (
    <header className="mb-8">
      <div className="flex items-center gap-3 mb-1">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white">
          <Leaf className="h-5 w-5" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
          Transport Emission Dashboard
        </h1>
      </div>
      <p className="text-muted-foreground mt-1 ml-12">
        National Transport Authority of Metropolia — MRV System
      </p>
    </header>
  );
}
