"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CloudLightning, Database, AlertTriangle, TrendingUp } from "lucide-react";
import type { EmissionRecord, SectorEmission } from "@/types/emission";

// ========================
// Props
// ========================
interface SummaryCardsProps {
    data: EmissionRecord[];
    sectorEmissions: SectorEmission[];
}

// ========================
// Helpers
// ========================
function getTotalEmissions(data: EmissionRecord[]): number {
    return data.reduce((acc, r) => acc + r.totalCO2, 0);
}

function getLargestContributor(sectors: SectorEmission[]): SectorEmission {
    if (sectors.length === 0) return { name: "Road", co2: 0 };
    return sectors.reduce((max, s) => (s.co2 > max.co2 ? s : max), sectors[0]);
}

function getSectorCount(data: EmissionRecord[]): number {
    return new Set(data.map((r) => r.sector)).size;
}

// ========================
// Component
// ========================
export default function SummaryCards({ data, sectorEmissions }: SummaryCardsProps) {
    const totalCO2 = getTotalEmissions(data);
    const largest = getLargestContributor(sectorEmissions);
    const hasData = data.length > 0;
    const sectorCount = getSectorCount(data);

    const cards = [
        {
            title: "Total Emission",
            value: hasData
                ? `${totalCO2.toLocaleString("en-US", { maximumFractionDigits: 0 })}`
                : "—",
            subtitle: hasData ? "Metric Tons CO₂" : "No data loaded",
            icon: CloudLightning,
            iconColor: "text-emerald-500",
            iconBg: "bg-emerald-500/10",
            badge: hasData ? "Live" : undefined,
            badgeVariant: "default" as const,
        },
        {
            title: "Data Records",
            value: hasData ? data.length.toString() : "—",
            subtitle: hasData ? `Across ${sectorCount} sector(s)` : "No data loaded",
            icon: Database,
            iconColor: "text-blue-500",
            iconBg: "bg-blue-500/10",
        },
        {
            title: "Largest Contributor",
            value: hasData ? largest.name : "—",
            subtitle: hasData
                ? `${largest.co2.toLocaleString("en-US", { maximumFractionDigits: 0 })} t CO₂`
                : "No data loaded",
            icon: AlertTriangle,
            iconColor: "text-amber-500",
            iconBg: "bg-amber-500/10",
        },
        {
            title: "Avg per Record",
            value: hasData
                ? `${(totalCO2 / data.length).toLocaleString("en-US", { maximumFractionDigits: 0 })}`
                : "—",
            subtitle: hasData ? "Metric Tons CO₂" : "No data loaded",
            icon: TrendingUp,
            iconColor: "text-violet-500",
            iconBg: "bg-violet-500/10",
        },
    ];

    return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => (
                <Card
                    key={card.title}
                    className="group relative overflow-hidden border transition-shadow hover:shadow-md"
                >
                    {/* Decorative gradient accent */}
                    <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-emerald-500 via-sky-500 to-violet-500 opacity-0 transition-opacity group-hover:opacity-100" />

                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            {card.title}
                        </CardTitle>
                        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${card.iconBg}`}>
                            <card.icon className={`h-4 w-4 ${card.iconColor}`} />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold tracking-tight">{card.value}</span>
                            {card.badge && (
                                <Badge variant={card.badgeVariant} className="text-[10px] px-1.5 py-0 bg-emerald-500/15 text-emerald-600 border-0">
                                    {card.badge}
                                </Badge>
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{card.subtitle}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
