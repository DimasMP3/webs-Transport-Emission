"use client";

import React, { useState } from "react";
import { Car, TrainFront, Ship, Plane, Calculator } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    calculateRoadEmission,
    calculateRailEmission,
    calculateSeaEmission,
    calculateAviationEmission,
} from "@/utils/calculator";
import { EMISSION_FACTORS, AVIATION_FUEL_DENSITY } from "@/constants/emission-factors";
import type { RoadFuelCode, RailTraction, SeaFuelCode } from "@/types/emission";

// ========================
// Shared Organic Inputs
// ========================
function SoftInput({
    label,
    unit,
    value,
    onChange,
    placeholder,
}: {
    label: string;
    unit?: string;
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
}) {
    return (
        <div className="group">
            <label className="text-sm font-semibold text-muted-foreground transition-colors group-focus-within:text-emerald-600 block mb-2">
                {label}
            </label>
            <div className="relative flex items-center">
                <input
                    type="number"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder || "0"}
                    className="w-full border-b-2 border-border/50 bg-transparent px-2 py-3 text-2xl sm:text-3xl font-bold tracking-tight text-foreground transition-colors placeholder:text-muted-foreground/30 focus:border-emerald-500 focus:outline-none"
                />
                {unit && (
                    <span className="absolute right-2 text-lg font-medium text-muted-foreground/50">
                        {unit}
                    </span>
                )}
            </div>
        </div>
    );
}

function SoftSelect({
    label,
    value,
    onChange,
    options,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    options: { value: string; label: string }[];
}) {
    return (
        <div className="group">
            <label className="text-sm font-semibold text-muted-foreground transition-colors group-focus-within:text-emerald-600 block mb-2">
                {label}
            </label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full cursor-pointer border-b-2 border-border/50 bg-transparent px-2 py-3 text-lg sm:text-xl font-semibold text-foreground transition-colors focus:border-emerald-500 focus:outline-none appearance-none"
            >
                {options.map((o) => (
                    <option key={o.value} value={o.value} className="text-base text-foreground bg-background">
                        {o.label}
                    </option>
                ))}
            </select>
        </div>
    );
}

function ResultPanel({ co2, onCalculate }: { co2: number | null; onCalculate: () => void }) {
    return (
        <div className="relative overflow-hidden rounded-3xl bg-emerald-600 p-8 sm:p-10 text-white shadow-xl mt-8 lg:mt-0 lg:ml-8 lg:sticky lg:top-24 h-fit">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-10 left-10 h-32 w-32 rounded-full bg-emerald-400/20 blur-xl" />

            <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                    <p className="text-emerald-100 font-medium tracking-wide text-sm uppercase mb-4">
                        Estimated Emission
                    </p>
                    <div className="flex items-baseline gap-2 mb-2">
                        <h2 className="text-5xl sm:text-6xl font-bold tracking-tight">
                            {co2 !== null ? new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 }).format(co2) : "0.0"}
                        </h2>
                        <span className="text-xl font-medium text-emerald-200">t</span>
                    </div>
                    <p className="text-emerald-100/80 text-sm">Metric Tons of CO₂</p>
                </div>

                <button
                    onClick={onCalculate}
                    className="mt-12 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-4 text-emerald-600 shadow-md font-bold transition-all hover:bg-emerald-50 hover:shadow-lg active:scale-95"
                >
                    <Calculator className="h-5 w-5" />
                    Calculate Now
                </button>
            </div>
        </div>
    );
}

// ========================
// Sector Forms
// ========================


function RoadFormWrapper({ result, calculate }: { result: number | null, calculate: Record<string, unknown> }) {
    // Explicit casts to fix unknown types for onChange and value
    const vehicles = calculate.vehicles as string;
    const setVehicles = calculate.setVehicles as (v: string) => void;

    const avgKm = calculate.avgKm as string;
    const setAvgKm = calculate.setAvgKm as (v: string) => void;

    const fuelEconomy = calculate.fuelEconomy as string;
    const setFuelEconomy = calculate.setFuelEconomy as (v: string) => void;

    const fuelCode = calculate.fuelCode as RoadFuelCode;
    const setFuelCode = calculate.setFuelCode as (v: RoadFuelCode) => void;

    const run = calculate.run as () => void;

    return (
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
            <div className="lg:col-span-3 space-y-12">
                <SoftInput label="Number of Vehicles" value={vehicles} onChange={setVehicles} placeholder="2000" />
                <SoftInput label="Average Distance per Vehicle" unit="km/yr" value={avgKm} onChange={setAvgKm} placeholder="12000" />
                <SoftInput label="Fuel Economy (Consumption rate)" unit="L / 100km" value={fuelEconomy} onChange={setFuelEconomy} placeholder="8.5" />
                <SoftSelect
                    label="Fuel Type"
                    value={fuelCode}
                    onChange={(v) => setFuelCode(v as RoadFuelCode)}
                    options={[
                        { value: "GASOLINE", label: `Gasoline (${EMISSION_FACTORS.GASOLINE} kgCO₂/L)` },
                        { value: "DIESEL", label: `Diesel (${EMISSION_FACTORS.DIESEL} kgCO₂/L)` },
                        { value: "B35", label: `Biodiesel B35 (${EMISSION_FACTORS.B35} kgCO₂/L)` },
                    ]}
                />
            </div>
            <div className="lg:col-span-2">
                <ResultPanel co2={result} onCalculate={run} />
            </div>
        </div>
    );
}

// ========================
// Page Structure
// ========================
type SectorTab = "road" | "rail" | "sea" | "aviation";

const SECTORS = [
    { id: "road", label: "Road", icon: Car },
    { id: "rail", label: "Rail", icon: TrainFront },
    { id: "sea", label: "Sea", icon: Ship },
    { id: "aviation", label: "Aviation", icon: Plane },
] as const;

export default function CalculatorPage() {
    const [activeTab, setActiveTab] = useState<SectorTab>("road");
    const [result, setResult] = useState<number | null>(null);

    // States inside page to avoid losing data when switching (optional, but cleaner if we don't care about keeping state across tabs)
    // For simplicity, we'll reset result when changing tabs
    const handleTabChange = (id: SectorTab) => {
        setActiveTab(id);
        setResult(null);
    };

    // State handlers for all sectors
    const [roadVehicles, setRoadVehicles] = useState("");
    const [roadKm, setRoadKm] = useState("");
    const [roadEcon, setRoadEcon] = useState("");
    const [roadFuel, setRoadFuel] = useState<RoadFuelCode>("GASOLINE");

    const [railTraction, setRailTraction] = useState<RailTraction>("Electric");
    const [railEnergy, setRailEnergy] = useState("");

    const [seaDist, setSeaDist] = useState("");
    const [seaIntensity, setSeaIntensity] = useState("");
    const [seaFuel, setSeaFuel] = useState<SeaFuelCode>("MARINE_DIESEL");

    const [aviFlights, setAviFlights] = useState("");
    const [aviFuel, setAviFuel] = useState("");

    const runRoad = () => setResult(calculateRoadEmission(parseFloat(roadVehicles) || 0, parseFloat(roadKm) || 0, parseFloat(roadEcon) || 0, roadFuel));
    const runRail = () => setResult(calculateRailEmission(parseFloat(railEnergy) || 0, railTraction, railTraction === "Electric" ? "GRID_ELECTRICITY" : "DIESEL"));
    const runSea = () => setResult(calculateSeaEmission(parseFloat(seaDist) || 0, parseFloat(seaIntensity) || 0, seaFuel));
    const runAvi = () => setResult(calculateAviationEmission(parseFloat(aviFlights) || 0, parseFloat(aviFuel) || 0));

    return (
        <div className="max-w-5xl mx-auto pb-12">
            <div className="mb-12 text-center max-w-2xl mx-auto">
                <h1 className="text-4xl font-bold tracking-tight mb-4">Manual Calculator</h1>
                <p className="text-lg text-muted-foreground">
                    Quickly estimate CO&sub2; emissions for specific scenarios without uploading a full dataset.
                </p>
            </div>

            <div className="rounded-3xl bg-white dark:bg-card p-6 sm:p-10 lg:p-12 shadow-sm ring-1 ring-border/50">

                {/* Organic Sector Picker */}
                <div className="mb-14">
                    <h2 className="text-sm font-semibold text-muted-foreground tracking-wide uppercase mb-6 text-center">
                        1. Select Transport Mode
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {SECTORS.map((s) => (
                            <button
                                key={s.id}
                                onClick={() => handleTabChange(s.id as SectorTab)}
                                className={cn(
                                    "flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-200 outline-none",
                                    activeTab === s.id
                                        ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 scale-[1.02] shadow-md"
                                        : "border-transparent bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground hover:scale-[1.01]"
                                )}
                            >
                                <s.icon className="h-8 w-8 mb-3" />
                                <span className="font-bold">{s.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="h-px w-full bg-border/50 mb-14" />

                {/* Dynamic Forms */}
                <div>
                    <h2 className="text-sm font-semibold text-muted-foreground tracking-wide uppercase mb-8">
                        2. Input Activity Data
                    </h2>

                    {activeTab === "road" && (
                        <RoadFormWrapper
                            result={result}
                            calculate={{
                                vehicles: roadVehicles, setVehicles: setRoadVehicles,
                                avgKm: roadKm, setAvgKm: setRoadKm,
                                fuelEconomy: roadEcon, setFuelEconomy: setRoadEcon,
                                fuelCode: roadFuel, setFuelCode: setRoadFuel,
                                run: runRoad
                            }}
                        />
                    )}

                    {activeTab === "rail" && (
                        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
                            <div className="lg:col-span-3 space-y-12">
                                <SoftSelect
                                    label="Traction Type"
                                    value={railTraction}
                                    onChange={(v) => setRailTraction(v as RailTraction)}
                                    options={[
                                        { value: "Electric", label: "Electric (Grid)" },
                                        { value: "Diesel", label: "Diesel" },
                                    ]}
                                />
                                <SoftInput
                                    label={railTraction === "Electric" ? "Total Electricity Consumed" : "Total Diesel Consumed"}
                                    unit={railTraction === "Electric" ? "kWh" : "Liter"}
                                    value={railEnergy}
                                    onChange={setRailEnergy}
                                    placeholder="80,500"
                                />
                                <div className="p-4 rounded-xl bg-muted/50 text-sm text-muted-foreground border border-border/50">
                                    Using Emission Factor: <strong className="text-foreground">{EMISSION_FACTORS[railTraction === "Electric" ? "GRID_ELECTRICITY" : "DIESEL"]}</strong> {railTraction === "Electric" ? "kgCO₂/kWh" : "kgCO₂/L"}
                                </div>
                            </div>
                            <div className="lg:col-span-2">
                                <ResultPanel co2={result} onCalculate={runRail} />
                            </div>
                        </div>
                    )}

                    {activeTab === "sea" && (
                        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
                            <div className="lg:col-span-3 space-y-12">
                                <SoftInput label="Total Distance" unit="Nautical Miles (NM)" value={seaDist} onChange={setSeaDist} placeholder="1,680,000" />
                                <SoftInput label="Average Fuel Intensity" unit="tons per NM" value={seaIntensity} onChange={setSeaIntensity} placeholder="0.015" />
                                <SoftSelect
                                    label="Marine Fuel Type"
                                    value={seaFuel}
                                    onChange={(v) => setSeaFuel(v as SeaFuelCode)}
                                    options={[
                                        { value: "MARINE_DIESEL", label: `Marine Diesel (${EMISSION_FACTORS.MARINE_DIESEL} tCO₂/t)` },
                                        { value: "HFO_LFO", label: `Heavy/Light Fuel Oil (${EMISSION_FACTORS.HFO_LFO} tCO₂/t)` },
                                        { value: "LNG_LPG", label: `LNG / LPG (${EMISSION_FACTORS.LNG_LPG} tCO₂/t)` },
                                    ]}
                                />
                            </div>
                            <div className="lg:col-span-2">
                                <ResultPanel co2={result} onCalculate={runSea} />
                            </div>
                        </div>
                    )}

                    {activeTab === "aviation" && (
                        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
                            <div className="lg:col-span-3 space-y-12">
                                <SoftInput label="Total Number of Flights" value={aviFlights} onChange={setAviFlights} placeholder="10,000" />
                                <SoftInput label="Average Fuel per Flight" unit="Liters" value={aviFuel} onChange={setAviFuel} placeholder="5,000" />
                                <div className="p-4 rounded-xl bg-muted/50 text-sm border border-border/50">
                                    <p className="text-foreground font-medium mb-1">Standard Aviation Constants</p>
                                    <ul className="text-muted-foreground list-disc pl-4 space-y-1">
                                        <li>Fuel density: <strong>{AVIATION_FUEL_DENSITY} kg/L</strong></li>
                                        <li>Jet Fuel EF: <strong>{EMISSION_FACTORS.JET_FUEL} kgCO₂/kg</strong></li>
                                    </ul>
                                </div>
                            </div>
                            <div className="lg:col-span-2">
                                <ResultPanel co2={result} onCalculate={runAvi} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
