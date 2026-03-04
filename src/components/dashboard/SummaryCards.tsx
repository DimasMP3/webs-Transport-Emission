"use client";

import React from "react";
import {
  type EmissionRecord,
  type SectorEmission,
  type Sector,
  SECTOR_COLORS,
} from "@/types/emission";

interface SummaryCardsProps {
  data: EmissionRecord[];
  sectorEmissions: SectorEmission[];
}

export function SummaryCards({ data, sectorEmissions }: SummaryCardsProps) {
  // Calculate total emissions
  const totalEmissions = sectorEmissions.reduce(
    (acc, curr) => acc + curr.co2,
    0,
  );

  // Find the largest contributor
  const largestSector = sectorEmissions.reduce(
    (max, curr) => (curr.co2 > max.co2 ? curr : max),
    sectorEmissions[0] || { name: "N/A" as unknown as Sector, co2: 0 },
  );

  // Format helpers
  const formatNumber = (num: number) =>
    new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(num);

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* Total Emissions Card (Hero Style) */}
      <div className="relative overflow-hidden rounded-3xl bg-emerald-600 p-8 text-white shadow-lg md:col-span-1">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-10 left-10 h-32 w-32 rounded-full bg-emerald-400/20 blur-xl" />
        <div className="relative">
          <p className="text-emerald-100 font-medium tracking-wide text-sm uppercase">
            Total Emissions
          </p>
          <div className="mt-4 flex items-baseline gap-2">
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
              {formatNumber(totalEmissions)}
            </h2>
            <span className="text-lg font-medium text-emerald-200">t</span>
          </div>
          <p className="mt-2 text-sm text-emerald-100/80">
            Across all recorded sectors
          </p>
        </div>
      </div>

      {/* Sub-cards */}
      <div className="flex flex-col gap-6 md:col-span-2 sm:flex-row">
        {/* Largest Contributor Card */}
        <div className="flex-1 rounded-3xl bg-white dark:bg-card p-8 shadow-sm ring-1 ring-border/50">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Largest Contributor
          </p>
          <div className="mt-4 flex items-center gap-4">
            {(largestSector.name as string) !== "N/A" && (
              <div
                className="h-14 w-2 rounded-full"
                style={{
                  backgroundColor: SECTOR_COLORS[largestSector.name as Sector],
                }}
              />
            )}
            <div>
              <h3 className="text-3xl font-bold tracking-tight text-foreground">
                {largestSector.name}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {formatNumber(largestSector.co2)} t CO₂ (
                {totalEmissions > 0
                  ? Math.round((largestSector.co2 / totalEmissions) * 100)
                  : 0}
                %)
              </p>
            </div>
          </div>
        </div>

        {/* Total Entries Card */}
        <div className="flex-1 rounded-3xl bg-white dark:bg-card p-8 shadow-sm ring-1 ring-border/50">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Data Entries
          </p>
          <div className="mt-4">
            <h3 className="text-4xl font-bold tracking-tight text-foreground">
              {formatNumber(data.length)}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Rows processed successfully
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
