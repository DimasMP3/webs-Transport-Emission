"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    PieChart,
    Pie,
    Legend,
} from "recharts";
import type { SectorEmission } from "@/types/emission";

// ========================
// Props
// ========================
interface EmissionChartProps {
    sectorEmissions: SectorEmission[];
}

// ========================
// Sector colour palette
// ========================
const SECTOR_COLORS: Record<string, string> = {
    Road: "#0ea5e9",
    Rail: "#8b5cf6",
    Sea: "#06b6d4",
    Aviation: "#f59e0b",
};

// ========================
// Components
// ========================
export default function EmissionChart({ sectorEmissions }: EmissionChartProps) {
    const hasData = sectorEmissions.some((s) => s.co2 > 0);

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            {/* Bar Chart */}
            <Card className="shadow-sm">
                <CardHeader className="pb-2">
                    <CardTitle className="text-base font-semibold">Emission by Sector</CardTitle>
                    <p className="text-xs text-muted-foreground">Metric tons CO₂ — annual total</p>
                </CardHeader>
                <CardContent className="h-72">
                    {hasData ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={sectorEmissions}
                                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12 }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 11 }}
                                    tickFormatter={(v: number) =>
                                        v >= 1_000_000 ? `${(v / 1_000_000).toFixed(1)}M` : `${(v / 1_000).toFixed(0)}k`
                                    }
                                />
                                <Tooltip
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    formatter={(value: any) => [
                                        `${Number(value).toLocaleString("en-US", { maximumFractionDigits: 0 })} t`,
                                        "CO₂",
                                    ]}
                                    cursor={{ fill: "hsl(var(--muted))" }}
                                    contentStyle={{
                                        borderRadius: "8px",
                                        border: "1px solid hsl(var(--border))",
                                        background: "hsl(var(--card))",
                                    }}
                                />
                                <Bar dataKey="co2" radius={[6, 6, 0, 0]}>
                                    {sectorEmissions.map((entry) => (
                                        <Cell key={entry.name} fill={SECTOR_COLORS[entry.name] || "#94a3b8"} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <EmptyState />
                    )}
                </CardContent>
            </Card>

            {/* Donut / Pie Chart */}
            <Card className="shadow-sm">
                <CardHeader className="pb-2">
                    <CardTitle className="text-base font-semibold">Sector Proportion</CardTitle>
                    <p className="text-xs text-muted-foreground">Share of total CO₂ emission</p>
                </CardHeader>
                <CardContent className="h-72">
                    {hasData ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={sectorEmissions.filter((s) => s.co2 > 0)}
                                    dataKey="co2"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius="45%"
                                    outerRadius="75%"
                                    paddingAngle={3}
                                    stroke="none"
                                >
                                    {sectorEmissions
                                        .filter((s) => s.co2 > 0)
                                        .map((entry) => (
                                            <Cell key={entry.name} fill={SECTOR_COLORS[entry.name] || "#94a3b8"} />
                                        ))}
                                </Pie>
                                <Tooltip
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    formatter={(value: any) => [
                                        `${Number(value).toLocaleString("en-US", { maximumFractionDigits: 0 })} t`,
                                        "CO₂",
                                    ]}
                                    contentStyle={{
                                        borderRadius: "8px",
                                        border: "1px solid hsl(var(--border))",
                                        background: "hsl(var(--card))",
                                    }}
                                />
                                <Legend
                                    verticalAlign="bottom"
                                    iconType="circle"
                                    iconSize={8}
                                    formatter={(value: string) => (
                                        <span className="text-xs text-muted-foreground">{value}</span>
                                    )}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <EmptyState />
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

function EmptyState() {
    return (
        <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                <svg className="h-8 w-8 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6m6 0h6m-6 0V9a2 2 0 012-2h2a2 2 0 012 2v10m6 0v-4a2 2 0 00-2-2h-2a2 2 0 00-2 2v4" />
                </svg>
            </div>
            <p className="text-sm">No data loaded yet</p>
        </div>
    );
}
