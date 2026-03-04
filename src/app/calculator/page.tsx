"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Car, TrainFront, Ship, Plane, Calculator } from "lucide-react";
import {
    calculateRoadEmission,
    calculateRailEmission,
    calculateSeaEmission,
    calculateAviationEmission,
} from "@/utils/calculator";
import { EMISSION_FACTORS, AVIATION_FUEL_DENSITY } from "@/constants/emission-factors";
import type { RoadFuelCode, RailFuelCode, RailTraction, SeaFuelCode } from "@/types/emission";

// ========================
// Shared input component
// ========================
function FormField({
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
        <div>
            <label className="text-sm font-medium text-foreground mb-1 block">{label}</label>
            <div className="relative">
                <input
                    type="number"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder || "0"}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                />
                {unit && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                        {unit}
                    </span>
                )}
            </div>
        </div>
    );
}

function SelectField({
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
        <div>
            <label className="text-sm font-medium text-foreground mb-1 block">{label}</label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
                {options.map((o) => (
                    <option key={o.value} value={o.value}>
                        {o.label}
                    </option>
                ))}
            </select>
        </div>
    );
}

function ResultCard({ co2, label }: { co2: number | null; label: string }) {
    return (
        <div className="mt-6 rounded-lg border-2 border-dashed border-emerald-500/30 bg-emerald-500/5 p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">{label}</p>
            <p className="text-3xl font-bold text-emerald-600">
                {co2 !== null
                    ? `${co2.toLocaleString("en-US", { maximumFractionDigits: 2 })} t`
                    : "—"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Metric Tons CO₂</p>
        </div>
    );
}

// ========================
// Tab Forms
// ========================
function RoadForm() {
    const [vehicles, setVehicles] = useState("");
    const [avgKm, setAvgKm] = useState("");
    const [fuelEconomy, setFuelEconomy] = useState("");
    const [fuelCode, setFuelCode] = useState<RoadFuelCode>("GASOLINE");
    const [result, setResult] = useState<number | null>(null);

    const calculate = () => {
        const co2 = calculateRoadEmission(
            parseFloat(vehicles) || 0,
            parseFloat(avgKm) || 0,
            parseFloat(fuelEconomy) || 0,
            fuelCode,
        );
        setResult(co2);
    };

    return (
        <div className="space-y-4">
            <FormField label="Number of Vehicles" value={vehicles} onChange={setVehicles} placeholder="e.g. 20000000" />
            <FormField label="Avg. Distance per Vehicle" unit="km/yr" value={avgKm} onChange={setAvgKm} placeholder="e.g. 12000" />
            <FormField label="Fuel Economy" unit="L/100km" value={fuelEconomy} onChange={setFuelEconomy} placeholder="e.g. 8.5" />
            <SelectField
                label="Fuel Type"
                value={fuelCode}
                onChange={(v) => setFuelCode(v as RoadFuelCode)}
                options={[
                    { value: "GASOLINE", label: `Gasoline (EF: ${EMISSION_FACTORS.GASOLINE} kgCO₂/L)` },
                    { value: "DIESEL", label: `Diesel (EF: ${EMISSION_FACTORS.DIESEL} kgCO₂/L)` },
                    { value: "B35", label: `Biodiesel B35 (EF: ${EMISSION_FACTORS.B35} kgCO₂/L)` },
                ]}
            />
            <Button className="w-full" onClick={calculate}>
                <Calculator className="h-4 w-4 mr-2" />
                Calculate Emission
            </Button>
            <ResultCard co2={result} label="Road Transport CO₂ Emission" />
        </div>
    );
}

function RailForm() {
    const [traction, setTraction] = useState<RailTraction>("Electric");
    const [energyValue, setEnergyValue] = useState("");
    const [result, setResult] = useState<number | null>(null);

    const fuelCode: RailFuelCode = traction === "Electric" ? "GRID_ELECTRICITY" : "DIESEL";

    const calculate = () => {
        const co2 = calculateRailEmission(parseFloat(energyValue) || 0, traction, fuelCode);
        setResult(co2);
    };

    return (
        <div className="space-y-4">
            <SelectField
                label="Traction Type"
                value={traction}
                onChange={(v) => setTraction(v as RailTraction)}
                options={[
                    { value: "Electric", label: "Electric (Grid)" },
                    { value: "Diesel", label: "Diesel" },
                ]}
            />
            <FormField
                label={traction === "Electric" ? "Total Electricity Consumed" : "Total Diesel Consumed"}
                unit={traction === "Electric" ? "kWh" : "Liter"}
                value={energyValue}
                onChange={setEnergyValue}
                placeholder="e.g. 80300000"
            />
            <p className="text-xs text-muted-foreground">
                EF: {EMISSION_FACTORS[fuelCode]} {traction === "Electric" ? "kgCO₂/kWh" : "kgCO₂/L"}
            </p>
            <Button className="w-full" onClick={calculate}>
                <Calculator className="h-4 w-4 mr-2" />
                Calculate Emission
            </Button>
            <ResultCard co2={result} label="Rail Transport CO₂ Emission" />
        </div>
    );
}

function SeaForm() {
    const [distance, setDistance] = useState("");
    const [fuelIntensity, setFuelIntensity] = useState("");
    const [fuelCode, setFuelCode] = useState<SeaFuelCode>("MARINE_DIESEL");
    const [result, setResult] = useState<number | null>(null);

    const calculate = () => {
        const co2 = calculateSeaEmission(
            parseFloat(distance) || 0,
            parseFloat(fuelIntensity) || 0,
            fuelCode,
        );
        setResult(co2);
    };

    return (
        <div className="space-y-4">
            <FormField label="Total Distance" unit="NM" value={distance} onChange={setDistance} placeholder="e.g. 1680000" />
            <FormField label="Fuel Intensity" unit="t/NM" value={fuelIntensity} onChange={setFuelIntensity} placeholder="e.g. 0.015" />
            <SelectField
                label="Fuel Type"
                value={fuelCode}
                onChange={(v) => setFuelCode(v as SeaFuelCode)}
                options={[
                    { value: "MARINE_DIESEL", label: `Marine Diesel (EF: ${EMISSION_FACTORS.MARINE_DIESEL} tCO₂/t fuel)` },
                    { value: "HFO_LFO", label: `HFO/LFO (EF: ${EMISSION_FACTORS.HFO_LFO} tCO₂/t fuel)` },
                    { value: "LNG_LPG", label: `LNG/LPG (EF: ${EMISSION_FACTORS.LNG_LPG} tCO₂/t fuel)` },
                ]}
            />
            <Button className="w-full" onClick={calculate}>
                <Calculator className="h-4 w-4 mr-2" />
                Calculate Emission
            </Button>
            <ResultCard co2={result} label="Sea Transport CO₂ Emission" />
        </div>
    );
}

function AviationForm() {
    const [flights, setFlights] = useState("");
    const [fuelPerFlight, setFuelPerFlight] = useState("");
    const [result, setResult] = useState<number | null>(null);

    const calculate = () => {
        const co2 = calculateAviationEmission(
            parseFloat(flights) || 0,
            parseFloat(fuelPerFlight) || 0,
        );
        setResult(co2);
    };

    return (
        <div className="space-y-4">
            <FormField label="Total Flights" value={flights} onChange={setFlights} placeholder="e.g. 10000" />
            <FormField label="Avg. Fuel per Flight" unit="Liter" value={fuelPerFlight} onChange={setFuelPerFlight} placeholder="e.g. 500" />
            <p className="text-xs text-muted-foreground">
                Fuel density: {AVIATION_FUEL_DENSITY} kg/L · EF: {EMISSION_FACTORS.JET_FUEL} kgCO₂/kg
            </p>
            <Button className="w-full" onClick={calculate}>
                <Calculator className="h-4 w-4 mr-2" />
                Calculate Emission
            </Button>
            <ResultCard co2={result} label="Aviation CO₂ Emission" />
        </div>
    );
}

// ========================
// Page
// ========================
export default function CalculatorPage() {
    return (
        <div className="min-h-screen bg-background p-6 md:p-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold tracking-tight">Emission Calculator</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Calculate CO₂ emissions per sector using WRI-standard formulas
                </p>
            </div>

            <Card className="shadow-sm max-w-2xl">
                <CardContent className="pt-6">
                    <Tabs defaultValue="road">
                        <TabsList className="grid w-full grid-cols-4 mb-6">
                            <TabsTrigger value="road" className="gap-1.5 text-xs sm:text-sm">
                                <Car className="h-3.5 w-3.5" />
                                <span className="hidden sm:inline">Road</span>
                            </TabsTrigger>
                            <TabsTrigger value="rail" className="gap-1.5 text-xs sm:text-sm">
                                <TrainFront className="h-3.5 w-3.5" />
                                <span className="hidden sm:inline">Rail</span>
                            </TabsTrigger>
                            <TabsTrigger value="sea" className="gap-1.5 text-xs sm:text-sm">
                                <Ship className="h-3.5 w-3.5" />
                                <span className="hidden sm:inline">Sea</span>
                            </TabsTrigger>
                            <TabsTrigger value="aviation" className="gap-1.5 text-xs sm:text-sm">
                                <Plane className="h-3.5 w-3.5" />
                                <span className="hidden sm:inline">Aviation</span>
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="road"><RoadForm /></TabsContent>
                        <TabsContent value="rail"><RailForm /></TabsContent>
                        <TabsContent value="sea"><SeaForm /></TabsContent>
                        <TabsContent value="aviation"><AviationForm /></TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}
