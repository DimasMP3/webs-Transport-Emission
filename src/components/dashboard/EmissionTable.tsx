"use client";

import React, { useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import type { EmissionRecord, Sector } from "@/types/emission";

// ========================
// Sector badge styling
// ========================
const SECTOR_BADGE: Record<Sector, { class: string }> = {
    Road: { class: "bg-sky-500/10 text-sky-600 border-0 hover:bg-sky-500/20" },
    Rail: { class: "bg-violet-500/10 text-violet-600 border-0 hover:bg-violet-500/20" },
    Sea: { class: "bg-cyan-500/10 text-cyan-600 border-0 hover:bg-cyan-500/20" },
    Aviation: { class: "bg-amber-500/10 text-amber-600 border-0 hover:bg-amber-500/20" },
};

// ========================
// Props
// ========================
interface EmissionTableProps {
    data: EmissionRecord[];
}

// ========================
// CSV Export helper
// ========================
function exportToCsv(data: EmissionRecord[], filename = "consolidated_emissions.csv") {
    const headers = ["Sector", "Category", "EnergyConsumption", "Unit", "TotalCO2"];
    const rows = data.map((r) =>
        [r.sector, r.category, r.energyConsumption, r.unit, r.totalCO2].join(","),
    );
    const csvContent = [headers.join(","), ...rows].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();

    URL.revokeObjectURL(url);
}

// ========================
// Component
// ========================
export default function EmissionTable({ data }: EmissionTableProps) {
    const handleExport = useCallback(() => exportToCsv(data), [data]);

    return (
        <Card className="shadow-sm">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-base font-semibold">Consolidated Data</CardTitle>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            {data.length > 0 ? `${data.length} records` : "No records loaded"}
                        </p>
                    </div>

                    {/* Export Button */}
                    {data.length > 0 && (
                        <Button variant="outline" size="sm" onClick={handleExport}>
                            <Download className="h-3.5 w-3.5 mr-1.5" />
                            Export CSV
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50 hover:bg-muted/50">
                                <TableHead className="w-[120px]">Sector</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead className="text-right">Energy Consumption</TableHead>
                                <TableHead className="w-[90px]">Unit</TableHead>
                                <TableHead className="text-right w-[140px]">Total CO₂ (t)</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.length > 0 ? (
                                data.map((row) => (
                                    <TableRow key={row.id} className="group">
                                        <TableCell>
                                            <Badge
                                                variant="secondary"
                                                className={SECTOR_BADGE[row.sector]?.class ?? ""}
                                            >
                                                {row.sector}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="font-medium">{row.category}</TableCell>
                                        <TableCell className="text-right tabular-nums">
                                            {row.energyConsumption.toLocaleString()}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">{row.unit}</TableCell>
                                        <TableCell className="text-right font-semibold tabular-nums">
                                            {row.totalCO2.toLocaleString("en-US", { maximumFractionDigits: 1 })}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                        No data — upload a CSV/Excel or load mock data to begin.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
