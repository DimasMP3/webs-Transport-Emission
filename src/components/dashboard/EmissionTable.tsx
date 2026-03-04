"use client";

import React from "react";
import { type EmissionRecord, SECTOR_COLORS } from "@/types/emission";
import { Download, FileWarning } from "lucide-react";

export function EmissionTable({ data }: { data: EmissionRecord[] }) {
  const handleExport = () => {
    if (data.length === 0) return;
    const header = [
      "ID",
      "Sector",
      "Category",
      "EnergyConsumption",
      "Unit",
      "TotalCO2_t",
    ].join(",");
    const rows = data.map((r) =>
      [
        r.id,
        `"${r.sector}"`,
        `"${r.category}"`,
        r.energyConsumption,
        `"${r.unit}"`,
        r.totalCO2,
      ].join(","),
    );
    const csvContent = [header, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "metropolia_mrv_master_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="rounded-3xl bg-white dark:bg-card p-6 sm:p-8 shadow-sm ring-1 ring-border/50 flex flex-col h-full">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold tracking-tight text-foreground">
            Consolidated Data
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Master list of imported emission records
          </p>
        </div>
        {data.length > 0 && (
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground transition-all hover:bg-muted active:scale-95"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        )}
      </div>

      <div className="flex-1 overflow-hidden">
        {data.length === 0 ? (
          <div className="flex h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed text-center">
            <FileWarning className="mb-3 h-10 w-10 text-muted-foreground/40" />
            <p className="text-muted-foreground">No data available.</p>
            <p className="text-sm text-muted-foreground font-medium mt-1">
              Upload a dataset to see the records.
            </p>
          </div>
        ) : (
          <div className="h-[400px] overflow-auto rounded-2xl border border-border/50 bg-background/50">
            <table className="w-full text-sm text-left">
              <thead className="sticky top-0 bg-muted/80 backdrop-blur-md z-10 text-muted-foreground font-semibold">
                <tr>
                  <th className="px-6 py-4 rounded-tl-2xl">Sector</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4 text-right">Activity Data</th>
                  <th className="px-6 py-4">Unit</th>
                  <th className="px-6 py-4 text-right rounded-tr-2xl">
                    Total CO₂ (t)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {data.slice(0, 100).map((row) => (
                  <tr
                    key={row.id}
                    className="transition-colors hover:bg-muted/30"
                  >
                    <td className="px-6 py-3 whitespace-nowrap">
                      <span
                        className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
                        style={{
                          backgroundColor: `${SECTOR_COLORS[row.sector]}15`,
                          color: SECTOR_COLORS[row.sector],
                        }}
                      >
                        {row.sector}
                      </span>
                    </td>
                    <td className="px-6 py-3 font-medium text-foreground">
                      {row.category}
                    </td>
                    <td className="px-6 py-3 text-right">
                      {new Intl.NumberFormat("en-US", {
                        maximumFractionDigits: 1,
                      }).format(row.energyConsumption)}
                    </td>
                    <td className="px-6 py-3 text-muted-foreground">
                      {row.unit}
                    </td>
                    <td className="px-6 py-3 text-right font-bold text-foreground">
                      {new Intl.NumberFormat("en-US", {
                        maximumFractionDigits: 1,
                      }).format(row.totalCO2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {data.length > 100 && (
              <div className="p-4 text-center text-xs font-medium text-muted-foreground bg-muted/20 border-t border-border/30">
                Showing first 100 records in browser. Please Export CSV to view
                all {data.length} records.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
