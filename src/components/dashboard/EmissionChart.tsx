"use client";

import React, { useMemo } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import { type SectorEmission, SECTOR_COLORS } from "@/types/emission";
import { BarChart3 } from "lucide-react";

// Soft custom tooltip styled as a floating pill
const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Record<string, unknown>[]; label?: string; }) => {
    if (active && payload && payload.length) {
        const co2 = payload[0].value as number;
        const formatted = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(co2);

        return (
            <div className="rounded-2xl border border-white/20 bg-background/95 p-4 shadow-xl backdrop-blur-md">
                <p className="text-sm font-medium text-muted-foreground mb-1">{label || (payload[0].name as string)}</p>
                <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold tracking-tight text-foreground">{formatted}</span>
                    <span className="text-sm text-muted-foreground">t CO₂</span>
                </div>
            </div>
        );
    }
    return null;
};

export function EmissionChart({ sectorEmissions }: { sectorEmissions: SectorEmission[] }) {
    const hasData = sectorEmissions.some((s) => s.co2 > 0);

    // Sort descending for the bar chart
    const sortedData = useMemo(() => {
        return [...sectorEmissions].sort((a, b) => b.co2 - a.co2);
    }, [sectorEmissions]);
    if (!hasData) {
        return (
            <div className="flex h-[400px] w-full items-center justify-center rounded-3xl border border-dashed bg-white/50 dark:bg-card/50">
                <div className="text-center">
                    <BarChart3 className="h-8 w-8 text-emerald-600/50" />
                    <p className="text-muted-foreground">Upload data to view emission analysis</p>
                </div>
            </div>
        );
    }

    return (
        <div className="grid gap-6 lg:grid-cols-3">
            {/* Bar Chart Panel */}
            <div className="lg:col-span-2 rounded-3xl bg-white dark:bg-card p-6 sm:p-8 shadow-sm ring-1 ring-border/50">
                <div className="mb-8">
                    <h3 className="text-xl font-bold tracking-tight text-foreground">Sector Breakdown</h3>
                    <p className="text-sm text-muted-foreground mt-1">Total CO₂ emissions by transport mode</p>
                </div>
                <div className="h-[320px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={sortedData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.4} />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 13, fill: "var(--muted-foreground)" }}
                                dy={16}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 13, fill: "var(--muted-foreground)" }}
                                dx={-10}
                                tickFormatter={(v: number) =>
                                    v >= 1_000_000 ? `${(v / 1_000_000).toFixed(1)}M` : `${(v / 1_000).toFixed(0)}k`
                                }
                            />
                            <Tooltip cursor={{ fill: "var(--muted)", opacity: 0.2 }} content={<CustomTooltip />} />
                            <Bar dataKey="co2" radius={[6, 6, 0, 0]} maxBarSize={60}>
                                {sortedData.map((entry) => (
                                    <Cell key={entry.name} fill={SECTOR_COLORS[entry.name] || "#94a3b8"} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Donut Chart Panel */}
            <div className="rounded-3xl bg-white dark:bg-card p-6 sm:p-8 shadow-sm ring-1 ring-border/50 flex flex-col">
                <div className="mb-2">
                    <h3 className="text-xl font-bold tracking-tight text-foreground">Proportion</h3>
                </div>
                <div className="flex-1 flex items-center justify-center">
                    <div className="h-[240px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={sortedData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={100}
                                    paddingAngle={4}
                                    dataKey="co2"
                                    stroke="none"
                                    cornerRadius={6}
                                >
                                    {sortedData.map((entry) => (
                                        <Cell key={entry.name} fill={SECTOR_COLORS[entry.name] || "#94a3b8"} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
