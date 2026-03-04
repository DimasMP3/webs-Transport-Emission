"use client";

import React, { useState, useMemo, useCallback } from "react";
import type { EmissionRecord, SectorEmission, Sector } from "@/types/emission";
import { MOCK_EMISSION_DATA } from "@/data/mock-data";
import {
    SummaryCards,
    EmissionChart,
    DataUploader,
    EmissionTable,
} from "@/components/dashboard";

// ========================
// Sector aggregation helper
// ========================
const SECTORS: Sector[] = ["Road", "Rail", "Sea", "Aviation"];

function aggregateBySector(records: EmissionRecord[]): SectorEmission[] {
    const map: Record<Sector, number> = { Road: 0, Rail: 0, Sea: 0, Aviation: 0 };
    records.forEach((r) => {
        if (map[r.sector] !== undefined) map[r.sector] += r.totalCO2;
    });
    return SECTORS.map((s) => ({ name: s, co2: map[s] }));
}

// ========================
// Dashboard Page
// ========================
export default function DashboardPage() {
    const [data, setData] = useState<EmissionRecord[]>([]);

    const sectorEmissions = useMemo(() => aggregateBySector(data), [data]);

    const handleLoadMock = useCallback(() => setData(MOCK_EMISSION_DATA), []);
    const handleClear = useCallback(() => setData([]), []);
    const handleDataParsed = useCallback(
        (records: EmissionRecord[]) => setData(records),
        [],
    );

    return (
        <div className="min-h-screen bg-background p-6 md:p-8">
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Overview of carbon emissions across all transport subsectors
                </p>
            </div>

            {/* KPI Summary */}
            <section className="mb-6">
                <SummaryCards data={data} sectorEmissions={sectorEmissions} />
            </section>

            {/* Charts (Bar + Pie) */}
            <section className="mb-6">
                <EmissionChart sectorEmissions={sectorEmissions} />
            </section>

            {/* Upload + Table */}
            <section className="grid gap-6 lg:grid-cols-3 mb-6">
                <div className="lg:col-span-1">
                    <DataUploader
                        onDataParsed={handleDataParsed}
                        onLoadMock={handleLoadMock}
                        onClear={handleClear}
                        hasData={data.length > 0}
                    />
                </div>
                <div className="lg:col-span-2">
                    <EmissionTable data={data} />
                </div>
            </section>
        </div>
    );
}
